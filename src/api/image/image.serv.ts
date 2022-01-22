import { ImageRepository } from "./image.repo";
import { Image } from "../../entity/Image";

export class ImageService {
    imageRepository: ImageRepository;

    constructor(imageRepository: ImageRepository) {
        this.imageRepository = imageRepository;
    }

    uploadImageInS3 = async () => {
        
    }

    deletImagesInS3 = async () => {
        
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

    deleteImage = async (imageUid: string) => {
        return await this.imageRepository.deleteImage(imageUid);
    }
}