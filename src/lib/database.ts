import { createConnection, Connection } from "typeorm";
import { createClient } from "redis";
import { node_env } from "../config";

export const initializeDatabase = async () => {
    // mysql connection
    const connection: Connection = await createConnection(node_env);
    // redis connection
    const redisClient = createClient();

    redisClient.on('error', (err) => console.log('Redis Client Error', err));

    await redisClient.connect();
};