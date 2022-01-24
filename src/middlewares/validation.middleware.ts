import { Request, Response, NextFunction } from "express";
import { ValidationError, validationResult } from "express-validator";
import { BadRequestException } from "../common/exceptions";

export const validationCheck = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorFormatter = ({ param, msg }: ValidationError) => {
            return {
                param,
                msg
            }    
        };
        
        const result = errors.formatWith(errorFormatter);

        next(new BadRequestException(result.array()));
    } else {
        next();
    }
}