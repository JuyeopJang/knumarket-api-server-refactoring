import dotenv from 'dotenv';
dotenv.config();

export const jwtSecret = process.env.JWT_SECRET;
export const node_env = process.env.NODE_ENV;

// s3 info
export const bucket = process.env.S3_BUCKET;
export const secretAccessKey = process.env.KEY;
export const accessKeyId = process.env.KEYID;
export const region = process.env.REGION;

// db info
export const db = process.env.DB;
export const db_host = process.env.DB_HOST;
export const db_port = process.env.DB_PORT;
export const db_user = process.env.DB_USER;
export const db_password = process.env.DB_PASSWORD;

export const redis_url = process.env.REDIS;
