/**
 * ApiResponse class
 *
 * This class represents a standardized response format for API endpoints.
 *
 * @constructor
 * @param {number} status - HTTP status code for the response.
 * @param {object|array|string} data - Data to be included in the response.
 * @param {string} message - Optional message to be included in the response (defaults to "Success").
 * @param {boolean} success - Optional flag indicating success (defaults to true).
 */
class ApiResponse {
    constructor(status, data, message = "Success", success = true) {
        this.statusCode = status;
        this.success = success;
        this.message = message;
        this.data = data;
    }
}

export { ApiResponse };
