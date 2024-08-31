if (!process.env.REDIS_HOST) {
    throw new Error("REDIS_HOST is required");
}
if (!process.env.REDIS_PORT) {
    throw new Error("REDIS_PORT is required");
}


export const redisConfig = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD || null, // optional, if Redis requires authentication
    db: process.env.REDIS_DB || 0, // default database index to use if not provided
    connectTimeout: process.env.REDIS_CONNECT_TIMEOUT || 10000, // default timeout 10 seconds
    tls: process.env.REDIS_TLS === 'true' // Enable TLS if set to 'true'
};
