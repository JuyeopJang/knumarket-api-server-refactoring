import { Request, Response, NextFunction } from "express";
import { BadRequestException, UnauthorizedException } from "../common/exceptions";
import { jwtVerify } from "../lib/jwt";

export const isAuthorized = (req: Request, res: Response, next: NextFunction): void => {
  const bearerToken = req.headers['authorization'];

  if (bearerToken) {
    try {
      const token = bearerToken.replace(/^Bearer /, '');
      const decoded = jwtVerify(token);

      next();
    } catch (err) {
      next(new UnauthorizedException());
    }
  } else {
    next(new BadRequestException());
  }
}