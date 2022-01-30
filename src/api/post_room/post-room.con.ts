import ApiController from "../interfaces/ApiController";
import { Request, Response, NextFunction, Router } from 'express';
import { param } from "express-validator";
import { isAuthorized } from "../../middlewares/auth.middleware";
import { PostRoomService } from "./post-room.serv";
import { PostRoomRepository } from "./post-room.repo";
import { UserRepository } from "../user/user.repo";
import { validationCheck } from "../../middlewares/validation.middleware";
import { wrap } from "../../lib/req-handler";


export default class PostRoomController implements ApiController {

    path: string = "/rooms";
    router: Router = Router();
    private postRoomService: PostRoomService;

    constructor(postRoomService: PostRoomService) {
        this.postRoomService = postRoomService;
        this.initializeRoutes();
    }

    initializeRoutes(): void {
        const routes = Router();
    
        routes
          .get('/me', isAuthorized, wrap(this.showMyChatRooms))
          .post('/:roomUid', param('roomUid').exists({ checkFalsy: true, checkNull: true }), validationCheck, isAuthorized, wrap(this.participateInRoom))
          .delete('/:roomUid', param('roomUid').exists({ checkFalsy: true, checkNull: true }), validationCheck, isAuthorized, wrap(this.exitOutOfRoom));

        this.router.use(this.path, routes);
    }

    showMyChatRooms = async (req: Request, res: Response, next: NextFunction) => {
        const { userUid } = res.locals;
        const myRooms = await this.postRoomService.getMyRooms(userUid);
        
        return {
            statusCode: 200,
            response: myRooms
        };
    }

    participateInRoom = async (req: Request, res: Response, next: NextFunction) => {
        const { roomUid } = req.params;
        const { userUid } = res.locals;

        await this.postRoomService.participateUserInRoom(userUid, roomUid);

        return {
            statusCode: 200,
            response: '성공적으로 채팅 방에 참여 됐습니다.'
        };
    }

    exitOutOfRoom = async (req: Request, res: Response, next: NextFunction) => {
        const { roomUid } = req.params;
        const { userUid } = res.locals;

        await this.postRoomService.deleteUserInRoom(userUid, roomUid);
        
        return {
            statusCode: 200,
            response: '성공적으로 채팅 방에서 나가게 됐습니다.'
        };
    }
}