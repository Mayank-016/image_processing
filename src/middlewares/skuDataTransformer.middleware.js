import { v4 as uuidv4 } from 'uuid';
import { ApiResponse } from '../utils/ApiResponse.js';
import HTTP from '../constants/http-status-codes.js';
import { ERRORS } from '../constants/error.constants.js';

/**
 * Middleware to validate and transform SKU data.
 * - Validates required fields: S. No., Product Name, Input Image Urls
 * - Converts Input Image Urls to an array
 * - Assigns a consistent requestId for all SKUs in the request
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const skuDataTransformer = (req, res, next) => {
    // Retrieve SKU data from previous middleware
    let skuData = req.csvData; // Assuming csvData is added by a previous middleware

    if (!Array.isArray(skuData) || skuData.length === 0) {
        const response = new ApiResponse(HTTP.BAD_REQUEST, null, ERRORS.NO_VALID_SKU_DATA, false);
        return res.status(response.statusCode).json(response);
    }

    // Generate a consistent requestId for all SKUs in this request
    const requestId = uuidv4();

    // Process and validate each SKU
    skuData = skuData.map((sku) => {
        // Convert 'sno' to a number if it's a valid string representation of a number
        const sno = Number(sku['sno']);
        if (isNaN(sno) || sno < 1) {
            console.error(`Invalid S.No. value: ${sku['sno']}`);
            return null; // Skip SKUs with invalid sno
        }

        // Validate 'product_name'
        const productName = sku['product_name'];
        if (typeof productName !== 'string' || productName.trim() === '') {
            console.error(`Invalid Product Name value: ${productName}`);
            return null; // Skip SKUs with invalid product name
        }

        // Validate and clean 'input_image_urls'
        const inputImageUrls = sku['input_image_urls'];
        if (typeof inputImageUrls !== 'string' || inputImageUrls.trim() === '') {
            console.error(`Invalid Input Image Urls value: ${inputImageUrls}`);
            return null; // Skip SKUs with invalid image URLs
        }

        // Convert 'Input Image Urls' to an array, clean URLs, and remove spaces within URLs
        const imageUrlsArray = inputImageUrls.split(',')
            .map((url) => url.trim().replace(/^"|"$/g, '').replace(/\s+/g, '')) // Remove quotes and internal spaces
            .filter(Boolean); // Remove empty values

        if (imageUrlsArray.length === 0) {
            console.error("No valid image URLs");
            return null; // Skip SKUs with no valid image URLs
        }

        return {
            sno,
            productName: productName.trim(),
            inputImageUrl: imageUrlsArray,
            requestId, // Assign the consistent requestId
        };
    }).filter(Boolean); // Remove null values (invalid SKUs)

    // Ensure there's at least one valid SKU
    if (skuData.length === 0) {
        const response = new ApiResponse(HTTP.BAD_REQUEST, null, ERRORS.NO_VALID_SKU_DATA, false);
        return res.status(response.statusCode).json(response);
    }

    // Attach the transformed data to the request object for further processing
    req.skuData = skuData;

    // Proceed to the next middleware or route handler
    next();
};
