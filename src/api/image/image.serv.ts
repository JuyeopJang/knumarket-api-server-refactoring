import { ImageRepository } from "./image.repo";

export class ImageService {
    imageRepository: ImageRepository;

    constructor(imageRepository: ImageRepository) {
        this.imageRepository = imageRepository;
    }

    addImages = async (imageUrls: string[]) => {
        return await this.imageRepository.createImages(imageUrls);
    }
}