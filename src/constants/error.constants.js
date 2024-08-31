// error.constants.js

/**
 * Error constants for the application.
 */
export const ERRORS = {
    /**
     * Validation errors.
     */
    NO_FILES_WERE_UPLOADED: "No files were uploaded",
    FILE_MUST_BE_CSV: "File must be a CSV",
    INVALID_CSV_CONTENT: "Invalid CSV content",
    NO_VALID_SKU_DATA: "No valid SKU data found",
    ERROR_SAVING_SKUS: "Error saving SKUs to the database",
    NO_ORDER_FOUND: "No order found",
    MULTIPLE_FILE_UPLOAD: "Multiple file upload is not allowed",
    ONLY_ONE_FILE_ALLOWED: "Only one file is allowed",
};

export const ERROR_CODES = {
    LIMIT_FILE_COUNT: "LIMIT_FILE_COUNT",
}
