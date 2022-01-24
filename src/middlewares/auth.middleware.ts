import { Request, Response, NextFunction } from "express";
import { BadRequestException, UnauthorizedException } from "../common/exceptions";
import { jwtVerify } from "../lib/jwt";

export const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
  const bearerToken = req.headers['authorization'];

  if (bearerToken) {
    try {
      const token = bearerToken.replace(/^Bearer /, '');
      const decoded = jwtVerify(token);

      res.locals.userUid = decoded['user_uid'];
      next();
    } catch (err) {
      next(new UnauthorizedException('토큰이 유효하지 않습니다. 리프레시 토큰을 보냈다면 다시 로그인 해주세요.'));
    }
  } else {
    next(new BadRequestException('req header에 authorization이 존재하지 않습니다.'));
  }
}