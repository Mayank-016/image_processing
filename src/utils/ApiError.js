class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        this.data = null; // Consider removing this if not used
        this.success = false;
        this.errors = errors;

        // Enhance error message with details
        this.message = `${message} (Status Code: ${statusCode})`;

        // Ensure stack trace is properly captured
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
