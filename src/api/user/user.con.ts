import ApiController from "../interfaces/ApiController";
import { Request, Response, NextFunction, Router } from 'express';
import { BadRequestException, HttpException, UnauthorizedException } from '../../common/exceptions/index';
// import { wrap } from '../../lib/req-handler';
import UserService from "./user.serv";
import { UserRepository } from './user.repo';
import { MetadataWithSuchNameAlreadyExistsError } from "typeorm";

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
          .post('/sign-up', this.signUp)
        //   .post('/login', this.login)
        //   .get('/logout',  this.logout);

        this.router.use(this.path, routes);
    }

    signUp = async (req: Request, res: Response, next: NextFunction) => {
        const { email, password, nickname } = req.body;

        if (!email || !email.length) {
            next(new BadRequestException("이메일은 필수입니다."));
            return;
        }
        if (!password || !password.length) {
            next(new BadRequestException("비밀번호는 필수입니다."));
            return;
        }
        if (!nickname || !nickname.length) {
            next(new BadRequestException("닉네임은 필수입니다."));
            return;
        }

        // email을 통해 중복확인 먼저!
        
        try {
            await this.userService.signUp({ email, password, nickname });
        } catch (err) {
            console.log(err);
        }
        
        res.status(201).json({
            message: 'user created!'
        });
    }

    // login(req: Request, res: Response, next: NextFunction) {

    // }

    // logout(req: Request, res: Response, next: NextFunction) {

    // }

}