import mongoose from "mongoose";
import { STATUS_CONSTANTS } from "../constants/constants.js"; // Assuming STATUS_CONSTANTS is imported from your constants

/**
 * Order schema definition for Mongoose.
 */
const orderSchema = new mongoose.Schema(
    {
        // Unique identifier for each order, automatically generated by MongoDB
        orderId: {
            type: String,
            default: () => new mongoose.Types.ObjectId().toString(),
        },

        // Status of the order
        status: {
            type: String,
            enum: [STATUS_CONSTANTS.PENDING, STATUS_CONSTANTS.IN_PROGRESS, STATUS_CONSTANTS.COMPLETED],
            default: STATUS_CONSTANTS.PENDING,
        },

        // Webhook URL to send notifications for the order
        webhookUrl: {
            type: String,
            required: false,
        },

        // Array to store SKU references
        skus: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Sku'
        }],

        // URL of the result CSV file
        resultFileUrl: {
            type: String,
            required: false,
        }
    },
    {
        // Automatically include `createdAt` and `updatedAt` timestamps
        timestamps: true,
    }
);

// Export the model
export const Order = mongoose.model("Order", orderSchema);