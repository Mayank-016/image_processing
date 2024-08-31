import mongoose from "mongoose";
import { mongoConfig } from "../configs/db.config.js";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(mongoConfig.url, {});
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MogoDB connection Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
