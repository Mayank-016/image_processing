import { } from 'dotenv/config';
import connectDB from "./db/index.js";
import { app } from "./app.js";
import createQueue from './configs/bull.config.js';
import processImageJob from './jobs/imageProcessingJob.js';
import { QUEUES } from './constants/constants.js';

connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.error(`Express error: ${error.message}`);
        });
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        }
        );
    })
    .catch((error) => {
        console.error(`MogoDB connection Error: ${error.message}`);
    });


// Create a queue instance for image processing
const imageProcessingQueue = createQueue(QUEUES.IMAGE_PROCESSING);

// Process jobs from the image-processing queue
imageProcessingQueue.process(processImageJob);

console.log('Image Processing Queue is set up.');
