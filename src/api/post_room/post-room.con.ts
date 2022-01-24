import ApiController from "../interfaces/ApiController";
import { Request, Response, NextFunction, Router } from 'express';
import { BadRequestException, HttpException, ServerException, UnauthorizedException } from '../../common/exceptions';
import { param } from "express-validator";
import { isAuthorized } from "../../middlewares/auth.middleware";
import { PostRoomService } from "./post-room.serv";
import { PostRoomRepository } from "./post-room.repo";
import { UserRepository } from "../user/user.repo";
import { validationCheck } from "../../middlewares/validation.middleware";


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
          .get('/', isAuthorized, this.showMyChatRooms)
          .put('/:roomUid', param('roomUid'), validationCheck, isAuthorized, this.participateInRoom)
          .put('/:roomUid', param('roomUid'), validationCheck, isAuthorized, this.exitOutOfRoom);

        this.router.use(this.path, routes);
    }

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
        const { userUid } = res.locals;

        try {
            await this.postRoomService.participateUserInRoom(userUid, roomUid);
            
            res.status(200).json({

            });
        } catch (err) {
            next(err);
        }
    }

    exitOutOfRoom = async (req: Request, res: Response, next: NextFunction) => {
        const { roomUid } = req.params;
        const { userUid } = res.locals;

        try {
            await this.postRoomService.deleteUserInRoom(userUid, roomUid);            
            
            res.status(200).json({
                
            });
        } catch (err) {
            next(err);
        }
    }
}