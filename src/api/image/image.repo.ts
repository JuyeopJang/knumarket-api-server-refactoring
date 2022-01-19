import { Image } from "../../entity/Image";
import { connection } from "../../lib/database";

export class ImageRepository {
    
    
    createImages = async (imageUrls: string[]) => {
        let images: Image[] = [];

        imageUrls.forEach(imageUrl => {
            const image = new Image();
    
            image.url = imageUrl;
            images.push(image);
        })

        await connection.manager.save(images);
        
        return images;
    }
}