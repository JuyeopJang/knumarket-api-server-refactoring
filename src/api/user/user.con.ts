import ApiController from "../interfaces/ApiController";
import { Request, Response, NextFunction, Router } from 'express';
import { BadRequestException, UnauthorizedException } from '../../common/exceptions/index';
// import { wrap } from '../../lib/req-handler';
import UserService from "./user.serv";
import { UserRepository } from './user.repo';

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

    signUp = async (req: Request, res: Response) => {
        const { email, password, nickname } = req.body;

        if (!email || !email.length) throw new BadRequestException("이메일이 없습니다.");
        if (!password || !password.length) throw new BadRequestException("비밀번호가 없습니다.");
        if (!nickname || !nickname.length) throw new BadRequestException("닉네임이 없습니다.");
        
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