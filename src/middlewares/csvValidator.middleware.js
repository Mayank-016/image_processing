import { ERRORS } from "../constants/error.constants.js";
import HTTP from "../constants/http-status-codes.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as csvParser from "csv-parse";
import { standardizeHeader } from "../utils/helpers.js";
import fs from "fs";

/**
 * Middleware to validate uploaded CSV file.
 * Ensures that the uploaded file is a CSV and contains valid data.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const csvValidator = (req, res, next) => {
    // Check if any files are uploaded
    if (!req.files || Object.keys(req.files).length === 0) {
        const response = new ApiResponse(HTTP.BAD_REQUEST, null, ERRORS.NO_FILES_WERE_UPLOADED, false);
        return res.status(response.statusCode).json(response);
    }

    // Extract the uploaded file
    const file = req.files['csv'] && req.files['csv'][0];

    // Check if the file exists and is a CSV
    if (!file || file.mimetype !== 'text/csv') {
        if (file && file.path) deleteFile(file);
        const response = new ApiResponse(HTTP.BAD_REQUEST, null, ERRORS.FILE_MUST_BE_CSV, false);
        return res.status(response.statusCode).json(response);
    }

    // Check if file path is available before reading
    if (!file.path) {
        const response = new ApiResponse(HTTP.BAD_REQUEST, null, ERRORS.FILE_UPLOAD_ERROR, false);
        return res.status(response.statusCode).json(response);
    }

    // Parse and validate the CSV content
    try {
        const fileContent = fs.readFileSync(file.path, 'utf-8'); // Read file from disk

        // Attempt to parse the CSV with different configurations
        const options = {
            columns: (header) => header.map(standardizeHeader),
            trim: true,           // Trim whitespace around each field
            skip_empty_lines: true, // Skip empty lines in the file
            relax_column_count: true, // Allow inconsistent columns count
            relax_quotes: true,   // Relax quote validation
            delimiter: ',',       // Explicitly set delimiter to comma
            quote: '"',           // Set quote character
        };

        csvParser.parse(fileContent, options, (err, records) => {
            if (err || !records || records.length === 0) {
                deleteFile(file);
                const response = new ApiResponse(HTTP.BAD_REQUEST, null, ERRORS.INVALID_CSV_CONTENT, false);
                return res.status(response.statusCode).json(response);
            }

            // Attach parsed CSV data to the request object for further processing
            req.csvData = records;
            // Proceed to the next middleware or route handler
            next();
        });
    } catch (readError) {
        // Handle file read error
        deleteFile(file);
        const response = new ApiResponse(HTTP.INTERNAL_SERVER_ERROR, null, ERRORS.FILE_READ_ERROR, false);
        return res.status(response.statusCode).json(response);
    }
};

/**
 * Function to delete a file from the local storage.
 *
 * @param {object} file - Multer file object.
 */
const deleteFile = (file) => {
    if (file && file.path) {
        fs.unlink(file.path, (err) => {
            if (err) {
                console.error(`Failed to delete file: ${file.path} - ${err.message}`);
            } else {
                console.log(`File deleted successfully: ${file.path}`);
            }
        });
    }
};
