import HTTP from "../constants/http-status-codes.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Sku } from "../models/sku.model.js";
import { Order } from "../models/order.model.js";
import createQueue from "../configs/bull.config.js";
import { QUEUES, STATUS_CONSTANTS } from "../constants/constants.js";
import { ERRORS } from "../constants/error.constants.js";

const imageProcessingQueue = createQueue(QUEUES.IMAGE_PROCESSING);

/**
 * Handles SKU uploads.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 */
const uploadSku = asyncHandler(async (req, res) => {
    const skuData = req.skuData;
    const webhookUrl = req.body.webhookUrl;
    try {
        // Create a new order
        const order = new Order({
            webhookUrl: webhookUrl,
            status: STATUS_CONSTANTS.PENDING,
        });

        // Save the order to generate an orderId
        await order.save();

        // Set the order reference in each SKU
        skuData.forEach(sku => {
            sku.order = order._id;
        });

        // Insert SKUs into the database
        const result = await Sku.insertMany(skuData);

        if (!result) {
            throw new Error(ERRORS.ERROR_SAVING_SKUS);
        }

        // Associate the SKUs with the order
        order.skus = result.map(sku => sku._id);
        await order.save();

        // Add the order to the image processing queue using orderId
        await imageProcessingQueue.add({ orderId: order.orderId });

        return res.json(new ApiResponse(HTTP.OK, { orderId: order.orderId }));

    } catch (error) {
        console.error('Error processing SKUs:', error);

        // Handle insertion error
        return res.json(new ApiResponse(HTTP.INTERNAL_SERVER_ERROR, null, ERRORS.ERROR_SAVING_SKUS));
    }
});




const getSku = asyncHandler(async (req, res) => {
    const order = await Order.findOne({ orderId: req.query.orderId }).populate('skus');
    if (!order) {
        return res.status(HTTP.NOT_FOUND).json(new ApiResponse(HTTP.NOT_FOUND, null, ERRORS.ORDER_NOT_FOUND));
    }

    if (order.status !== STATUS_CONSTANTS.COMPLETED) {
        return res.json(new ApiResponse(HTTP.OK, { status: order.status }));
    }

    return res.json(new ApiResponse(HTTP.OK, { status: order.status, fileUrl: order.resultFileUrl }));
});

export { uploadSku, getSku };
