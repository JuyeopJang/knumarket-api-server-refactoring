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
import { PostPaginationDto } from "./dto/PostPaginationDto";


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
          .get('/:postUid', this.showPost)
          .get('/', this.showPosts)
          .get('/me', this.showMyPosts)
          .put('/:postUid', this.updatePost)
          .delete('/:postUid', this.deletePost);
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
            const imagesFromImageService = await this.imageService.addImages(images);
            
            await this.postService.addPost({
                ...req.body,
                images: imagesFromImageService
            })
        } catch (err) {
            next(err);
        }
    }

    showPosts = async (req: Request, res: Response, next: NextFunction) => {
        // 가장 많은 요청이 있을 것으로 예상되는 부분 커뮤니티 글 읽기 부분
        // 대부분의 사용자는 그냥 눈팅만 하는 경우가 많음
        // 이런 기능을 캐시를 이용해 캐싱하면 성능이 매우 좋아지겠지
        // 대용량 서비스임을 감안해서 1초에 한 번씩 캐싱 ㄱㄱ
        const { last_id } = req.query;
        let posts: PostPaginationDto[];
        
        try {
            posts = await this.postService.getPosts(Number(last_id));
        
            res.status(200).json({
                success: true,
                response: {
                    posts,
                    nextLastId: posts.length < 20 ? 0 : posts[posts.length - 1].id
                },
                error: null
            });
        } catch (err) {
            next(err);
        }
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
        const { page } = req.query;
        let myPosts: Post[];
        
        try {
            const userUid = isAuthorized(req, res, next);

            myPosts = await this.postService.getMyPosts(Number(page), userUid);
        
            res.status(200).json({
                success: true,
                response: myPosts,
                error: null
            });
        } catch (err) {
            next(err);
        }
    }

    updatePost = async (req: Request, res: Response, next: NextFunction) => {
        const { postUid } = req.params;
        

    }

    deletePost = async (req: Request, res: Response, next: NextFunction) => {
        const { postUid } = req.params;
    
        try {
            const userUid = isAuthorized(req, res, next);

            await this.postService.deletePost(postUid);

            res.status(200).json({
                success: true,
                response: '글 삭제에 성공했습니다.',
                error: null
            })
        } catch (err) {

        }
    }

}