import ApiController from "../interfaces/ApiController";
import { Request, Response, NextFunction, Router } from 'express';
import { ImageService } from '../image/image.serv';
import { ImageRepository } from "../image/image.repo";
import { isAuthorized } from "../../middlewares/auth.middleware";
import { wrap } from "../../lib/req-handler";
import { uploadImage } from "../../middlewares/image.middleware";

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
          .post('/', isAuthorized, uploadImage, wrap(this.addImageInS3)) // multer-s3 거쳐야 함
          .delete('/', isAuthorized, wrap(this.deleteImageInS3))

        this.router.use(this.path, routes);
    }

    addImageInS3 = async (req: Request, res: Response, next: NextFunction) => {
        const { imageUrl } = req.params;

        return {
            statusCode: 201,
            response: {
                image: imageUrl
            }
        };
    }

    deleteImageInS3 = async (req: Request, res: Response, next: NextFunction) => {
        const { image_url } = req.body;

        await this.imageService.deleteImageInS3(image_url);

        return {
            statusCode: 200,
            response: '이미지가 성공적으로 삭제 되었습니다.'
        };
    }
}