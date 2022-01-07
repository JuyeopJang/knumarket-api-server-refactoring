import { createConnection, Connection } from "typeorm";
import { createClient } from "redis";
import { node_env } from "../config";

export let connection: Connection;
export let redisClient;

export const initializeDatabase = async () => {
    // mysql connection
    connection = await createConnection(node_env);
    // redis connection
    redisClient = createClient();

    redisClient.on('error', (err) => console.log('Redis Client Error', err));

    await redisClient.connect();
};

export const closeDatabase = async () => {
    if (connection) {
        await connection.close();
    }
    if (redisClient) {
        await redisClient.quit();
    }
}