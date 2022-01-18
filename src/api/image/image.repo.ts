import { Image } from "../../entity/Image";
import { connection } from "../../lib/database";

export class ImageRepository {
    createImages = async (imageUrls: string[]) => {
        imageUrls.forEach(imageUrl => {
            const image = new Image();
    
            image.url = imageUrl;
            connection.manager.save(image);            
        })
    }
}