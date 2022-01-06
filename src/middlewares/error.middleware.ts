import { Request, Response, NextFunction } from "express";
import { HttpException, ServerException } from "../common/exceptions";

export const errorMiddleware = (err: HttpException, req: Request, res: Response, next: NextFunction) => {
    if (err) {
        res.status(err.status).json({
            success: false,
            response: null,
            error: {
                status: err.status,
                message: err.message,
                params: err.errors !== null ? err.errors : null
            }
        })
    } else {
        next();
    }
};