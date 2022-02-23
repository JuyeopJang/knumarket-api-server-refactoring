import { ImageRepository } from "./image.repo";
import { Image } from "../../entity/Image";
import { deleteImage } from "../../lib/multer-s3";

export class ImageService {
    imageRepository: ImageRepository;

    constructor(imageRepository: ImageRepository) {
        this.imageRepository = imageRepository;
    }

    deleteImageInS3 = async (key: string) => {
        deleteImage(key);
    }

    deletImagesInS3 = async (images: Image[]) => {
        // const images = await this.imageRepository.getImagesByPostId(postId);
        images.forEach(image => {
            deleteImage(image.key);
        });
    }

    getImageObjs = async (imageInfos: any) => {
        const images: Image[] = [];

        imageInfos.forEach(imageInfo => {
            const image = new Image();
    
            image.key = imageInfo.key
            image.url = imageInfo.url;
            images.push(image);
        });
        
        return images;
    }
}