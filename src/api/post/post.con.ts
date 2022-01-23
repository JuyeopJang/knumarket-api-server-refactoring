import ApiController from "../interfaces/ApiController";
import { Request, Response, NextFunction, Router } from 'express';
import { BadRequestException, HttpException, ServerException, UnauthorizedException } from '../../common/exceptions';
// import UserService from "./user.serv";
// import { UserRepository } from './user.repo';
import { body, check, header, param, Result, ValidationError, validationResult } from "express-validator";
import { isAuthorized } from "../../middlewares/auth.middleware";
import { Post } from "../../entity/Post";
import { PostService } from './post.serv';
import { PostRepository } from "./post.repo";
import { ImageService } from '../image/image.serv';
import { ImageRepository } from "../image/image.repo";
import { PostRoomService } from "../post_room/post-room.serv";
import { PostRoomRepository } from "../post_room/post-room.repo";
import { PostPaginationDto } from "../dto/PostPaginationDto";
import { UserRepository } from "../user/user.repo";
import { AddPostRoomDto } from "../dto/AddPostRoomDto";

export default class PostController implements ApiController {

    path: string = "/posts";
    router: Router = Router();
    postService = new PostService(new PostRepository());
    imageService = new ImageService(new ImageRepository());
    postRoomService = new PostRoomService(new PostRoomRepository(), new UserRepository());

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
            const userUid = isAuthorized(req, res, next);

            const imagesFromImageService = await this.imageService.getImageObjs(images);
            const postRoomFromPostRoomService = await this.postRoomService.getPostRoom({
                title: req.body.title,
                max_head_count: req.body.max_head_count
            }, userUid);
            
            await this.postService.addPost({
                ...req.body,
                images: imagesFromImageService,
                postRoom: postRoomFromPostRoomService
            });

            res.status(201).json({
                success: true,
                response: '글이 성공적으로 작성 되었습니다.',
                error: null
            });
        } catch (err) {
            next(err);
        }

    }

    showPosts = async (req: Request, res: Response, next: NextFunction) => {
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
        const { images } = req.body;

        const imagesFromImageService = await this.imageService.getImageObjs(images);
        
        try {

            await this.postService.updatePost({
                ...req.body,
                images: imagesFromImageService
            }, Number(postUid));

            res.status(200).json({
                success: true,
                response: '글이 성공적으로 수정 되었습니다.',
                error: null
            });

        } catch (err) {
            next(err);
        }

    }

    deletePost = async (req: Request, res: Response, next: NextFunction) => {
        const { postId } = req.params;
        const pIdToNumber = Number(postId);
    
        try {
            const userUid = isAuthorized(req, res, next);

            await this.imageService.deletImagesInS3(pIdToNumber);
            await this.postService.deletePost(pIdToNumber);

            res.status(200).json({
                success: true,
                response: '글 삭제에 성공했습니다.',
                error: null
            })
        } catch (err) {

        }
    }

}