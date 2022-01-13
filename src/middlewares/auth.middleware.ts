import { Request, Response, NextFunction } from "express";
import { decode } from "jsonwebtoken";
import { BadRequestException, UnauthorizedException } from "../common/exceptions";
import { jwtVerify } from "../lib/jwt";

export const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
  const bearerToken = req.headers['authorization'];

  if (bearerToken) {
    try {
      const token = bearerToken.replace(/^Bearer /, '');
      const decoded = jwtVerify(token);

      return decoded['email'];
    } catch (err) {
      next(new UnauthorizedException('토큰이 유효하지 않습니다.'));
    }
  } else {
    next(new BadRequestException('req header에 authorization이 존재하지 않습니다.'));
  }
}