import ApiController from "../interfaces/ApiController";
import { Request, Response, NextFunction, Router } from 'express';
import UserService from "./user.serv";
import { UserRepository } from './user.repo';
import { body } from "express-validator";
import { isAuthorized } from "../../middlewares/auth.middleware";
import { validationCheck } from "../../middlewares/validation.middleware";
import { wrap } from "../../lib/req-handler";

export default class UserController implements ApiController {

    path: string = "/users";
    router: Router = Router();
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
        this.initializeRoutes();
    }

    initializeRoutes(): void {
        const routes = Router();
    
        routes
          .post('/sign-up', [
              body('email').isEmail().withMessage('이메일 형식이 아닙니다.'),
              body('password').isLength({ min: 6, max: 20}).withMessage('비밀번호는 6자 이상 20자 이하의 문자열입니다.'),
              body('nickname').isLength({ min: 2, max: 10}).withMessage('닉네임은 2자 이상 10자 이하의 문자열입니다.') 
            ], validationCheck, wrap(this.signUp))
          .post('/login', [
              body('email').isEmail().withMessage('이메일 형식이 아닙니다.'),
              body('password').isLength({ min: 6, max: 20}).withMessage('비밀번호는 6자 이상 20자 이하의 문자열입니다.')
            ], validationCheck, wrap(this.login))
          .get('/me', isAuthorized, wrap(this.getMyInfo))
          .put('/me', [
              body('nickname').isLength({ min: 2, max: 10}).withMessage('닉네임은 2자 이상 10자 이하의 문자열입니다.')
            ], validationCheck, isAuthorized, wrap(this.updateMyInfo))
          .delete('/me', isAuthorized, wrap(this.withdrawlMyInfo))
          .get('/token', isAuthorized, wrap(this.reissueToken));
          
        this.router.use(this.path, routes);
    }

    signUp = async (req: Request, res: Response, next: NextFunction) => {
      await this.userService.signUp(req.body);  
      
      return {
        statusCode: 201,
        response: '회원가입에 성공했습니다.'
      };
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;
        const [accessToken, refreshToken] = await this.userService.getTokens(email, password);
        
        return {
            statusCode: 200,
            response: {
                access_token: accessToken,
                refresh_token: refreshToken
            }
        };
    }

  getMyInfo = async (req: Request, res: Response, next: NextFunction) => {
    const { userUid } = res.locals;
    const user = await this.userService.getMyInfo(userUid);
    
    return {
      statusCode: 200,
      response: user
    };
  }

    updateMyInfo = async (req: Request, res: Response, next: NextFunction) => {
        const { nickname } = req.body;
        const { userUid } = res.locals;
        
        await this.userService.updateMyInfo(userUid, nickname);

        return {
            statusCode: 200,
            response: nickname
        };
    }

    withdrawlMyInfo = async (req: Request, res: Response, next: NextFunction) => {
        const { userUid } = res.locals;

        await this.userService.signOut(userUid);
    
        return {
            statusCode: 200,
            response: '성공적으로 회원탈퇴 되었습니다.'
        };
    }

    reissueToken = async (req: Request, res: Response, next: NextFunction) => {
        const { userUid } = res.locals; 
        const accessToken = await this.userService.createNewAccessToken(userUid);

        return {
            statusCode: 200,
            response: {
                access_token: accessToken
            }
        };
    }
}