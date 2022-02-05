import { createConnection, Connection, getConnectionOptions } from "typeorm";
import { createClient } from "redis";
import { node_env, redis_url } from "../config";

export let connection: Connection;
export let redisClient;

export const initializeDatabase = async () => {
    // mysql connection
    connection = await createConnection(node_env);
    // redis connection
    redisClient = createClient({
        url: redis_url
    });

    redisClient.on('error', (err) => console.log('Redis Client ', err));

    await redisClient.connect();

    return connection;
};

export const closeDatabase = async () => {
    if (connection) {
        await connection.close();
    }
    if (redisClient) {
        await redisClient.quit();
    }
}