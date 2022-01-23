import ApiController from "../interfaces/ApiController";
import { Request, Response, NextFunction, Router } from 'express';
import { BadRequestException, HttpException, ServerException, UnauthorizedException } from '../../common/exceptions';
// import UserService from "./user.serv";
// import { UserRepository } from './user.repo';
import { body, check, header, param, Result, ValidationError, validationResult } from "express-validator";
import { jwtVerify } from '../../lib/jwt';
import { isAuthorized } from "../../middlewares/auth.middleware";
import { PostRoomService } from "./post-room.serv";
import { PostRoomRepository } from "./post-room.repo";
import { UserRepository } from "../user/user.repo";


export default class PostRoomController implements ApiController {

    path: string = "/rooms";
    router: Router = Router();
    postRoomService = new PostRoomService(new PostRoomRepository(), new UserRepository());

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes(): void {
        const routes = Router();
    
        routes
          .get('/', this.showMyChatRooms)
          .put('/:roomUid', this.participateInRoom)
          .put('/:roomUid', this.exitOutOfRoom);

        this.router.use(this.path, routes);
    }

    // validationCheck = async (req: Request, res: Response, next: NextFunction) => {
    //     const errors = validationResult(req);

    //     if (!errors.isEmpty()) {
    //         const errorFormatter = ({ param, msg }: ValidationError) => {
    //             return {
    //                 param,
    //                 msg
    //             }    
    //         };
            
    //         const result = errors.formatWith(errorFormatter);

    //         next(new BadRequestException(result.array()));
    //     } else {
    //         next();
    //     }
    // }

    showMyChatRooms = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userUid = isAuthorized(req, res, next);

            const myRooms = await this.postRoomService.getMyRooms(userUid);
            
            res.status(200).json({

            });
        } catch (err) {
            next(err);
        }
    }

    participateInRoom = async (req: Request, res: Response, next: NextFunction) => {
        const { roomUid } = req.params;

        try {
            const userUid = isAuthorized(req, res, next);

            await this.postRoomService.participateUserInRoom(userUid, roomUid);
            
            res.status(200).json({

            });
        } catch (err) {
            next(err);
        }
    }

    exitOutOfRoom = async (req: Request, res: Response, next: NextFunction) => {
        const { roomUid } = req.params;

        try {
            const userUid = isAuthorized(req, res, next);

            await this.postRoomService.deleteUserInRoom(userUid, roomUid);            
            
            res.status(200).json({

            });
        } catch (err) {
            next(err);
        }
    }
}