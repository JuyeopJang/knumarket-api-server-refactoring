import ApiController from "../interfaces/ApiController";
import { Request, Response, NextFunction, Router } from 'express';
import { ImageService } from '../image/image.serv';
import { isAuthorized } from "../../middlewares/auth.middleware";
import { wrap } from "../../lib/req-handler";
import { isImageExist } from "../../middlewares/image.middleware";
import { upload } from "../../lib/multer-s3";

export default class ImageController implements ApiController {

    path: string = "/images";
    router: Router = Router();
    private imageService: ImageService;

    constructor(imageService: ImageService) {
        this.imageService = imageService;
        this.initializeRoutes();
    }

    initializeRoutes(): void {
        const routes = Router();
    
        routes
          .post('/', isAuthorized, upload.single('image'), isImageExist, wrap(this.addImageInS3)) // multer-s3 거쳐야 함
          .delete('/', isAuthorized, wrap(this.deleteImageInS3))

        this.router.use(this.path, routes);
    }

    addImageInS3 = async (req: Request, res: Response, next: NextFunction) => {
        return {
            statusCode: 201,
            response: {
                key: req.file['key'],
                url: req.file['location']
            }
        };
    }

    deleteImageInS3 = async (req: Request, res: Response, next: NextFunction) => {
        const { key } = req.body;

        await this.imageService.deleteImageInS3(key);

        return {
            statusCode: 200,
            response: '이미지가 성공적으로 삭제 되었습니다.'
        };
    }
}