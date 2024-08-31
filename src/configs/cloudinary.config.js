if (!process.env.CLOUDINARY_API_KEY) {
    throw new Error("CLOUDINARY_API_KEY is required");
}
if (!process.env.CLOUDINARY_API_SECRET) {
    throw new Error("CLOUDINARY_API_SECRET is required");
}
if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error("CLOUDINARY_CLOUD_NAME is required");
}

const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
};

export { cloudinaryConfig };