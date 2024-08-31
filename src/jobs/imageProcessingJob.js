import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { uploadOnCloudinary } from '../utils/Cloudinary.js';
import { storageConfig } from '../configs/storage.config.js';
import { Sku } from '../models/sku.model.js';
import { Order } from '../models/order.model.js';
import axios from 'axios';
import { generateCsv } from '../utils/csvGenerator.js';
import { STATUS_CONSTANTS } from '../constants/constants.js';

const resultFilePath = path.join(storageConfig.local.destination, 'result_file.csv');

/**
 * Deletes a file if it exists.
 *
 * @param {string} filePath - The path to the file to be deleted.
 */
const deleteFileIfExists = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

/**
 * Get the file extension from a URL or file path.
 *
 * @param {string} url - The URL or file path to extract the extension from.
 * @returns {string} - The file extension (e.g., '.jpg', '.png', etc.).
 */
const getFileExtension = (url) => {
    return path.extname(new URL(url).pathname).toLowerCase();
};

/**
 * Process an image job.
 *
 * @param {object} job - The Bull job object.
 */
const processImageJob = async (job) => {
    const { orderId } = job.data;

    try {
        // Fetch the order and its associated SKUs
        const order = await Order.findOne({ orderId }).populate('skus');
        if (!order) {
            throw new Error(`Order with orderId ${orderId} not found`);
        }

        // Update order status to processing
        order.status = STATUS_CONSTANTS.IN_PROGRESS;
        await order.save();

        const results = []; // To collect result data for CSV

        for (const skuModel of order.skus) {
            for (const imageUrl of skuModel.inputImageUrl) {
                const fileExtension = getFileExtension(imageUrl); // Get the file extension

                const tempFilePath = path.join(storageConfig.local.destination, `temp_image${fileExtension}`);
                const compressedFilePath = path.join(storageConfig.local.destination, `compressed_image${fileExtension}`);

                try {
                    // Fetch image from the URL
                    const response = await fetch(imageUrl.trim());
                    if (!response.ok) {
                        throw new Error(`Failed to fetch image: ${response.statusText}`);
                    }
                    const buffer = await response.arrayBuffer();

                    // Save the image to a temporary file
                    fs.writeFileSync(tempFilePath, Buffer.from(buffer));

                    // Use sharp to process the image (supporting various formats)
                    let sharpPipeline = sharp(tempFilePath);

                    if (fileExtension === '.jpg' || fileExtension === '.jpeg' || fileExtension === '.png') {
                        sharpPipeline = sharpPipeline.toFormat('jpeg', { quality: 50 });
                    }

                    await sharpPipeline.toFile(compressedFilePath);

                    // Upload the compressed image to Cloudinary (images folder)
                    const uploadResult = await uploadOnCloudinary(compressedFilePath, 'images');

                    // Collect result data for CSV
                    results.push({
                        sno: skuModel.sno,
                        productName: skuModel.productName,
                        inputImageUrl: imageUrl,
                        outputImageUrl: uploadResult.url
                    });

                    console.log('Image processed successfully for SKU:', skuModel.sno);

                } catch (error) {
                    console.error(`Error processing SKU ${skuModel.sno}:`, error);
                } finally {
                    // Clean up: remove the temporary files
                    deleteFileIfExists(tempFilePath);
                    deleteFileIfExists(compressedFilePath);
                }
            }
        }

        // Generate CSV file
        await generateCsv(results, resultFilePath);

        // Upload the result CSV to Cloudinary (csv folder)
        const resultFileUpload = await uploadOnCloudinary(resultFilePath, 'csv');

        // Delete the result file after upload
        deleteFileIfExists(resultFilePath);

        // Update order status to completed and save resultFileUrl
        order.status = STATUS_CONSTANTS.COMPLETED;
        order.resultFileUrl = resultFileUpload.url;
        await order.save();

        // Send webhook notification if webhook URL is present
        if (order.webhookUrl) {
            await axios.post(order.webhookUrl, {
                message: `Image processing completed for order ${orderId}.`,
                status: 'success',
                resultFileUrl: resultFileUpload.url
            });
            console.log('Webhook sent successfully.');
        }

    } catch (error) {
        console.error('Error processing images for order:', error);
        throw error; // Rethrow error to ensure job failure and retry if needed
    }
};

export default processImageJob;
