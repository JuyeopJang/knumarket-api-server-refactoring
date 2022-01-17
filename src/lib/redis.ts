import { redisClient } from "./database";

export const setRefreshToken = (userUid: string, refreshToken: string): void => {
    redisClient.set(userUid, refreshToken);  
};

export const getRefreshToken = async (userUid: string): Promise<string> => {
    return redisClient.get(userUid);  
};