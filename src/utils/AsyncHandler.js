/**
 * Async wrapper for Express route handlers.
 *
 * Wraps an asynchronous function in a middleware function, handling potential errors
 * and passing them to the next error handler.
 *
 * @param {function} requestHandler - The asynchronous route handler function.
 * @returns {function} - The wrapped middleware function.
 */
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((error) => next(error));
    };
};

export { asyncHandler };
