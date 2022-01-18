import { ImageRepository } from "./image.repo";

export class ImageService {
    imageRepository: ImageRepository;

    constructor(imageRepository: ImageRepository) {
        this.imageRepository = imageRepository;
    }

    addImages = async (imageUrls: string[]) => {
        await this.imageRepository.createImages(imageUrls);
    }
}