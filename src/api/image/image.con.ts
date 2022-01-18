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


export default class ImageController implements ApiController {

    path: string = "/images";
    router: Router = Router();
    imageService = new ImageService(new ImageRepository());

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes(): void {
        const routes = Router();
    
        routes
          .post('/', this.addImages);

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

    addImages = async (req: Request, res: Response, next: NextFunction) => {
        // multer를 통해 받아오는 image url 배열 바로 반환
        const imageUrls = req.params;

        return res.status(201).json({
            success: true,
            response: {
                images: imageUrls
            },
            error: null
        });
    }

}