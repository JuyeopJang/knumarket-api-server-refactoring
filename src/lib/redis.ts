import { redisClient } from "./database";

export const setRefreshToken = (email: string, refreshToken: string): void => {
    redisClient.set(email, refreshToken);  
};

export const getRefreshToken = async (email: string): Promise<string> => {
    return redisClient.get(email);  
};