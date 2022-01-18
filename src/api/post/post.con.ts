import ApiController from "../interfaces/ApiController";
import { Request, Response, NextFunction, Router } from 'express';
import { BadRequestException, HttpException, ServerException, UnauthorizedException } from '../../common/exceptions';
// import UserService from "./user.serv";
// import { UserRepository } from './user.repo';
import { body, check, header, param, Result, ValidationError, validationResult } from "express-validator";
import { jwtVerify } from '../../lib/jwt';
import { isAuthorized } from "../../middlewares/auth.middleware";
import { PostRepository } from "./post.repo";
import { PostService } from './post.serv';
import { ImageService } from '../image/image.serv';
import { ImageRepository } from "../image/image.repo";
import { Post } from "../../entity/Post";


export default class PostController implements ApiController {

    path: string = "/posts";
    router: Router = Router();
    postService = new PostService(new PostRepository());
    imageService = new ImageService(new ImageRepository());

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes(): void {
        const routes = Router();
    
        routes
          .post('/', [
              check('title').isLength({ min: 2, max: 50}).withMessage('글 제목은 2자 이상 50자 이하의 문자열입니다.'),
              check('description').isLength({ max: 500 }).withMessage('글 본문은 최대 500자 이하의 문자열입니다.'),
              check('location').withMessage('위치로 가능한 값은 0 ~ 10 사이의 숫자 입니다.'),
              check('max_head_count').withMessage('모집 가능 인원은 최소 2명부터 최대 10명까지 입니다.'),
              check('images').withMessage('이미지의 url을 담은 배열이어야 합니다.')
            ], this.validationCheck, this.addPost)
          .get('/:postUid', this.showPost);
        this.router.use(this.path, routes);
    }

    validationCheck = async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorFormatter = ({ param, msg }: ValidationError) => {
                return {
                    param,
                    msg
                }    
            };
            
            const result = errors.formatWith(errorFormatter);

            next(new BadRequestException(result.array()));
        } else {
            next();
        }
    }

    addPost = async (req: Request, res: Response, next: NextFunction) => {
        const { images } = req.body;

        try {
            const imagesFromImageService: Image[] = await this.imageService.addImages(images);
            
            await this.postService.addPost({
                ...req.body,
                images: imagesFromImageService
            })
        } catch (err) {
            next(err);
        }
    }

    showPosts = async (req: Request, res: Response, next: NextFunction) => {
        // const posts: ;
    }

    showPost = async (req: Request, res: Response, next: NextFunction) => {
        const { postUid } = req.params; //? path인가 파람인가 여튼
        
        try {
            const post: Post = await this.postService.getPost(postUid);

            if (post) {
                res.status(200).json({
                    success: true,
                    response: post,
                    error: null
                });
            }
        } catch (err) {
            next(err);
        }
    }

    showMyPosts = async (req: Request, res: Response, next: NextFunction) => {
        
    }

    updatePost = async (req: Request, res: Response, next: NextFunction) => {
        
    }

    deletePost = async (req: Request, res: Response, next: NextFunction) => {
        
    }

}