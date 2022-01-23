import ApiController from "../interfaces/ApiController";
import { Request, Response, NextFunction, Router } from 'express';
import { BadRequestException, HttpException, ServerException, UnauthorizedException } from '../../common/exceptions';
// import UserService from "./user.serv";
// import { UserRepository } from './user.repo';
import { body, check, header, param, Result, ValidationError, validationResult } from "express-validator";
import { jwtVerify } from '../../lib/jwt';
import { isAuthorized } from "../../middlewares/auth.middleware";
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
          .post('/', this.addImageInS3) // multer-s3 거쳐야 함
          .delete('/', this.deleteImageInS3)

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

    addImageInS3 = async (req: Request, res: Response, next: NextFunction) => {
        // s3에 이미지를 업로드해달라는 요청
        const { imageUrl } = req.params; // multer-s3 거치고 난 뒤 imageUrl

        res.status(201).json({
            success: true,
            response: {
                image: imageUrl
            },
            error: null
        });
        
    }

    deleteImageInS3 = async (req: Request, res: Response, next: NextFunction) => {
        const { image_url } = req.body;

        try {
            await this.imageService.deleteImageInS3(image_url);

            res.status(200).json({
                success: true,
                response: '이미지가 성공적으로 삭제 되었습니다.',
                error: null
            });
        } catch (err) {
            next(err);
        }
    }
}