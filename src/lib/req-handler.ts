import { Request, Response, NextFunction } from "express";

export const wrap = (handler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { statusCode, response } = await handler(req, res, next);
            
            res.status(statusCode).json({
                success: true,
                response,
                error: null
            });
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
};