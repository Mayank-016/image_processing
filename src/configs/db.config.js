if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL is required");
}
const mongoConfig = {
    url: process.env.MONGO_URL,
    dbName: process.env.MONGO_DB_NAME || "prod",
};

export { mongoConfig };