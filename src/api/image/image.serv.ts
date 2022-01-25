import { ImageRepository } from "./image.repo";
import { Image } from "../../entity/Image";
import { deleteImage } from "../../lib/multer-s3";

export class ImageService {
    imageRepository: ImageRepository;

    constructor(imageRepository: ImageRepository) {
        this.imageRepository = imageRepository;
    }

    deleteImageInS3 = async (imageUrl: string) => {
        deleteImage(imageUrl);
    }

    deletImagesInS3 = async (postId: number) => {
        const images = await this.imageRepository.getImagesByPostId(postId);     
        
        images.forEach(image => {
            deleteImage(image.url);
        });
    }

    getImageObjs = async (imageUrls: string[]) => {
        const images: Image[] = [];

        imageUrls.forEach(imageUrl => {
            const image = new Image();
    
            image.url = imageUrl;
            images.push(image);
        });
        
        return images;
    }
}