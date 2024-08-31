import Bull from "bull";
import { redisConfig } from "./redis.config.js";

/**
 * Create a new Bull queue instance for handling jobs.
 *
 * @param {string} queueName - The name of the queue.
 * @returns {object} Bull queue instance.
 */
const createQueue = (queueName) => {
    // Create a new Bull queue
    const queue = new Bull(queueName, {
        redis: {
            host: redisConfig.host,
            port: redisConfig.port,
            password: redisConfig.password, // optional, if Redis requires authentication
        },
    });

    // Event listener for when the queue is ready
    queue.on("ready", () => {
        console.log(`Bull Queue (${queueName}) is ready.`);
    });

    // Event listener for when an error occurs
    queue.on("error", (error) => {
        console.error(`Bull Queue (${queueName}) Error: ${error.message}`);
    });

    return queue;
};

// Export the createQueue function for use in other parts of the application
export default createQueue;
