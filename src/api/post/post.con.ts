import ApiController from "../interfaces/ApiController";
import { Request, Response, NextFunction, Router } from 'express';
import { body, param } from "express-validator";
import { isAuthorized } from "../../middlewares/auth.middleware";
import { PostService } from './post.serv';
import { ImageService } from '../image/image.serv';
import { PostRoomService } from "../post_room/post-room.serv";
import { validationCheck } from "../../middlewares/validation.middleware";
import UserService from "../user/user.serv";
import { wrap } from "../../lib/req-handler";

export default class PostController implements ApiController {

    path: string = "/posts";
    router: Router = Router();
    private postService: PostService
    private imageService: ImageService
    private postRoomService: PostRoomService
    private userService: UserService

    constructor(
        postService: PostService, 
        imageService: ImageService,
        postRoomService: PostRoomService,
        userService: UserService 
    ) {
        this.postService = postService;
        this.imageService = imageService;
        this.postRoomService = postRoomService;
        this.userService = userService;
        this.initializeRoutes();
    }

    initializeRoutes(): void {
        const routes = Router();
    
        routes
          .post('/', [
              body('title').isLength({ min: 2, max: 50 }).withMessage('글 제목은 2자 이상 50자 이하의 문자열입니다.'),
              body('description').isLength({ max: 500 }).withMessage('글 본문은 최대 500자 이하의 문자열입니다.'),
              body('location').isInt({ min: 0, max: 10 }).withMessage('위치로 가능한 값은 0 ~ 10 사이의 숫자 입니다.'),
              body('max_head_count').isInt({ min: 2, max: 10 }).withMessage('모집 가능 인원은 최소 2명부터 최대 10명까지 입니다.'),
              body('images').isArray({ min: 0, max: 5 }).withMessage('이미지의 url을 담은 배열이어야 합니다.')
            ], validationCheck, isAuthorized, wrap(this.writePost))
          .get('/', wrap(this.showPosts))
          .get('/me', isAuthorized, wrap(this.showMyPosts))
          .get('/:postUid', param('postUid').exists({ checkFalsy: true, checkNull: true }), validationCheck, wrap(this.showPost))
          .put('/:postUid', [
              param('postUid').exists({ checkFalsy: true, checkNull: true }),
              body('title').isLength({ min: 2, max: 50 }).withMessage('글 제목은 2자 이상 50자 이하의 문자열입니다.'),
              body('description').isLength({ max: 500 }).withMessage('글 본문은 최대 500자 이하의 문자열입니다.'),
              body('location').isInt({ min: 0, max: 10 }).withMessage('위치로 가능한 값은 0 ~ 10 사이의 숫자 입니다.'),
              body('max_head_count').isInt({ min: 2, max: 10 }).withMessage('모집 가능 인원은 최소 2명부터 최대 10명까지 입니다.'),
              body('isArchived').isBoolean({ loose: false }).withMessage('boolean 값이어야 합니다.')
            ], validationCheck, isAuthorized, wrap(this.updatePost))
          .delete('/:postUid', param('postUid').exists({ checkFalsy: true, checkNull: true }), isAuthorized, wrap(this.deletePost));
        this.router.use(this.path, routes);
    }

    writePost = async (req: Request, res: Response, next: NextFunction) => {
        const { userUid } = res.locals;
            
        await this.postService.createPostAndRoom({
            ...req.body,
            userUid
        });

        return {
            statusCode: 201,
            response: '글이 성공적으로 작성 되었습니다.'
        };
    }

    showPosts = async (req: Request, res: Response, next: NextFunction) => {
        const { last_id } = req.query;
        let posts;

        if (last_id !== 'null') {
            posts = await this.postService.getPosts(Number(last_id));    
        } else {
            posts = await this.postService.getPosts(null);
        }

        return {
            statusCode: 200,
            response: {
                posts,
                nextLastId: posts.length < 20 || posts[posts.length - 1].id === 1 ? null : posts[posts.length - 1].id
            }
        };
    }

    showPost = async (req: Request, res: Response, next: NextFunction) => {
        const { postUid } = req.params;
        const post = await this.postService.getPost(Number(postUid));

        return {
            statusCode: 200,
            response: post
        };
    }

    showMyPosts = async (req: Request, res: Response, next: NextFunction) => {
        const { last_id } = req.query;
        const { userUid } = res.locals;

        let myPosts;

        if (last_id !== 'null') {
            myPosts = await this.postService.getMyPosts(Number(last_id), userUid);    
        } else {
            myPosts = await this.postService.getMyPosts(null, userUid);
        }
        
        return {
            statusCode: 200,
            response: {
                posts: myPosts,
                nextLastId: myPosts.length < 20 || myPosts[myPosts.length - 1].id === 1 ? null : myPosts[myPosts.length - 1].id,
            }
        };
    }

    updatePost = async (req: Request, res: Response, next: NextFunction) => {
        const { postUid } = req.params;

        await this.postService.updatePost({
            ...req.body
        }, Number(postUid));

        return {
            statusCode: 200,
            response: '글이 성공적으로 수정 되었습니다.'
        };
    }

    deletePost = async (req: Request, res: Response, next: NextFunction) => {
        const { userUid } = res.locals;
        const { postUid } = req.params;

        await this.postService.deletePost(userUid, Number(postUid));
    
        return {
            statusCode: 200,
            response: '글 삭제에 성공했습니다.'
        };
    }
}