import ApiController from "../interfaces/ApiController";
import { Request, Response, NextFunction, Router } from 'express';
import { BadRequestException, UnauthorizedException } from '../../common/exceptions/index';
// import { wrap } from '../../lib/req-handler';
import { UserService } from './user.serv';
import { UserRepository } from './user.repo';

export default class UserController implements ApiController {
    path: string;
    router: any;
    userService: UserService;

    constructor() {
        this.path = "/users";
        this.router = Router();
        this.userService = new UserService(new UserRepository());

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

    async signUp(req: Request, res: Response, next: NextFunction) {
        const { email, password, nickname } = req.body;

        if (!email || !email.length) throw new BadRequestException("이메일이 없습니다.");
        if (!password || !password.length) throw new BadRequestException("비밀번호가 없습니다.");
        if (!nickname || !nickname.length) throw new BadRequestException("닉네임이 없습니다.");
        
        await this.userService.signUp({ email, password, nickname });
        
    }

    // login(req: Request, res: Response, next: NextFunction) {

    // }

    // logout(req: Request, res: Response, next: NextFunction) {

    // }

}