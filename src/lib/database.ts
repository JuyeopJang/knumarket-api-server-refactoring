import { createConnection, Connection } from "typeorm";
import { createClient } from "redis";

export const initializeDatabase = async () => {
    // mysql connection
    const connection: Connection = await createConnection();
    // redis connection
    const redisClient = createClient();

    redisClient.on('error', (err) => console.log('Redis Client Error', err));

    await redisClient.connect();
};