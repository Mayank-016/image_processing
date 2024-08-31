import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { cloudinaryConfig } from '../configs/cloudinary.config.js';

cloudinary.config({
    cloud_name: cloudinaryConfig.cloud_name,
    api_key: cloudinaryConfig.api_key,
    api_secret: cloudinaryConfig.api_secret,
});

/**
 * Uploads a local file to Cloudinary.
 *
 * @param {string} localFilePath - The path to the local file.
 * @param {string} folder - The Cloudinary folder name where the file will be uploaded.
 * @returns {Promise<object>} - Resolves with the Cloudinary upload response, or rejects with an error.
 */
const uploadOnCloudinary = async (localFilePath, folder) => {
    try {
        if (!localFilePath) {
            throw new Error("Local file path is required");
        }

        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: folder, // Specify the folder in Cloudinary
        });

        console.log("File uploaded successfully", uploadResult.url);

        // Delete the local file after successful upload
        fs.unlinkSync(localFilePath);

        return uploadResult;
    } catch (error) {
        // Remove the file if upload fails
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        console.error("Error uploading file:", error);
        throw error; // Re-throw the error to handle it at a higher level
    }
};

export { uploadOnCloudinary };
