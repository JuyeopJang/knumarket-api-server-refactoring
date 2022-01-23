import { ImageRepository } from "./image.repo";
import { Image } from "../../entity/Image";
import { image } from "faker";

export class ImageService {
    imageRepository: ImageRepository;

    constructor(imageRepository: ImageRepository) {
        this.imageRepository = imageRepository;
    }

    uploadImageInS3 = async () => {
        
    }

    deleteImageInS3 = async (imageUrl: string) => {
        // s3.deleteObject({
        //     Bucket: s3Bucket,
        //     Key: imageUrl
        // }, (err, data) => {
        //     if (err) throw new Error(err.message);
        //     else console.log(data);
        // });
    }

    deletImagesInS3 = async (postId: number) => {
        // const images = await this.imageRepository.getImagesByPostId(postId);     
        // images.forEach(image => {
        //     s3.deleteObject({
        //         Bucket: s3Bucket,
        //         Key: image.url
        //     }, (err, data) => {
        //         if (err) throw new Error(err.message);
        //         else console.log(data);
        //     });
        // });
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