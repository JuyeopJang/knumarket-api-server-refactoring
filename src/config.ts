import dotenv from 'dotenv';
dotenv.config();

export const jwtSecret = process.env.JWT_SECRET;
export const node_env = process.env.NODE_ENV;

export const database = process.env.DB;
export const db_password = process.env.DB_PASSWORD;