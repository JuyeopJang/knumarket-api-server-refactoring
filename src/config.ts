import dotenv from 'dotenv';
dotenv.config();

export const jwtSecret = process.env.JWT_SECRET;
export const node_env = process.env.NODE_ENV;

// db info
export const db = process.env.DB;
export const db_host = process.env.DB_HOST;
export const db_port = process.env.DB_PORT;
export const db_user = process.env.DB_USER;
export const db_password = process.env.DB_PASSWORD;
