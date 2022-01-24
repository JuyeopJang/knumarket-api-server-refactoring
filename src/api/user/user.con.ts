import ApiController from "../interfaces/ApiController";
import { Request, Response, NextFunction, Router } from 'express';
import UserService from "./user.serv";
import { UserRepository } from './user.repo';
import { body } from "express-validator";
import { isAuthorized } from "../../middlewares/auth.middleware";
import { validationCheck } from "../../middlewares/validation.middleware";

export default class UserController implements ApiController {

    path: string = "/users";
    router: Router = Router();
    userService = new UserService(new UserRepository());

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes(): void {
        const routes = Router();
    
        routes
          .post('/sign-up', [
              body('email').isEmail().withMessage('이메일 형식이 아닙니다.'),
              body('password').isLength({ min: 6, max: 20}).withMessage('비밀번호는 6자 이상 20자 이하의 문자열입니다.'),
              body('nickname').isLength({ min: 2, max: 10}).withMessage('닉네임은 2자 이상 10자 이하의 문자열입니다.') 
            ], validationCheck, this.signUp)
          .post('/login', [
              body('email').isEmail().withMessage('이메일 형식이 아닙니다.'),
              body('password').isLength({ min: 6, max: 20}).withMessage('비밀번호는 6자 이상 20자 이하의 문자열입니다.')
            ], validationCheck, this.login)
          .get('/me', isAuthorized, this.getMyInfo)
          .put('/me', [
              body('nickname').isLength({ min: 2, max: 10}).withMessage('닉네임은 2자 이상 10자 이하의 문자열입니다.')
            ], validationCheck, isAuthorized, this.updateMyInfo)
          .delete('/me', isAuthorized, this.withdrawlMyInfo)
          .get('/token', isAuthorized, this.reissueToken);
          
          this.router.use(this.path, routes);
        }

    signUp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.userService.signUp(req.body);

            res.status(201).json({
                success: true,
                response: '회원가입에 성공했습니다.',
                error: null
            });
        } catch (err) {
            next(err);
        }    
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;

        try {
            const [accessToken, refreshToken] = await this.userService.getTokens(email, password);

            res.status(200).json({
                success: true,
                response: {
                    access_token: accessToken,
                    refresh_token: refreshToken
                },
                error: null
            });
        } catch (err) {
            next(err);
        }
    }

    getMyInfo = async (req: Request, res: Response, next: NextFunction) => {
        const { userUid } = res.locals;
 
        try {

            const userInfo = await this.userService.getMyInfo(userUid);

            res.status(200).json({
                success: true,
                response: {
                    email: userInfo.email,
                    nickname: userInfo.nickname,
                    is_verified: userInfo.is_verified
                },
                error: null
            });
        } catch (err) {
            next(err);
        }
    }

    updateMyInfo = async (req: Request, res: Response, next: NextFunction) => {
        const { nickname } = req.body;
        const { userUid } = res.locals;
        
        try {

            await this.userService.updateMyInfo(userUid, nickname);

            res.status(200).json({
                success: true,
                response: {
                    nickname
                },
                error: null
            });

        } catch (err) {
            next(err);
        }
    }

    withdrawlMyInfo = async (req: Request, res: Response, next: NextFunction) => {
        const { userUid } = res.locals;
        
        try {

            await this.userService.signOut(userUid);

            res.status(200).json({
                success: true,
                response: '성공적으로 회원탈퇴 되었습니다.',
                error: null
            });

        } catch (err) {
            next(err);
        }
    }

    reissueToken = async (req: Request, res: Response, next: NextFunction) => {
        const { userUid } = res.locals;
        
        try {
            const accessToken = this.userService.createNewAccessToken();
            const refreshToken = await this.userService.getRefreshTokenInRedis(userUid);

            res.status(200).json({
                success: true,
                response: {
                    access_token: accessToken,
                    refresh_token: refreshToken
                },
                error: null
            });

        } catch (err) {
            next(err);
        }

    }

}