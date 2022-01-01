import { Request, Response, NextFunction } from "express";
import { ServerException } from "../common/exceptions";

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err) {
        throw new ServerException();
    } else {
        next();
    }
};