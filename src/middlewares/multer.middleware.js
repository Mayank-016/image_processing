import multer from "multer";
import { storageConfig } from "../configs/storage.config.js";
import { ERROR_CODES, ERRORS } from "../constants/error.constants.js";

/**
 * Multer storage configuration.
 */
const storage = multer.diskStorage({
    /**
     * Specifies the destination directory for uploaded files.
     *
     * @param {object} req - Express request object.
     * @param {object} file - Multer file object.
     * @param {function} callback - Callback function to pass the destination directory.
     */
    destination: function (req, file, callback) {
        callback(null, storageConfig.local.destination);
    },

    /**
     * Specifies the filename for the uploaded file.
     *
     * @param {object} req - Express request object.
     * @param {object} file - Multer file object.
     * @param {function} callback - Callback function to pass the filename.
     */
    filename: function (req, file, callback) {
        // TODO: Implement a more robust file naming strategy in the future
        callback(null, file.originalname);
    },
});

/**
 * File filter to restrict multiple file uploads.
 *
 * @param {object} req - Express request object.
 * @param {object} file - Multer file object.
 * @param {function} callback - Callback function to pass the error or accept the file.
 */
const fileFilter = (req, file, callback) => {
    // If req.files already has files, it indicates multiple file upload attempt
    if (req.files && req.files.length > 0) {
        const error = new Error(ERRORS.MULTIPLE_FILE_UPLOAD);
        error.code = ERROR_CODES.LIMIT_FILE_COUNT; // Custom error code
        return callback(error, false); // Reject the file
    }

    callback(null, true); // Accept the file
};

/**
 * Multer instance with configured storage and file filter.
 */
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        files: 1, // Multer will enforce only one file upload
    },
});

/**
 * Express error-handling middleware for handling Multer errors.
 */
export const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Handle Multer-specific errors
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                error: ERRORS.ONLY_ONE_FILE_ALLOWED,
            });
        }
    } else if (err) {
        // Handle other possible errors
        return res.status(400).json({
            error: err.message || 'An unexpected error occurred during file upload',
        });
    }
    next(err); // Pass other errors to the default error handler
};
