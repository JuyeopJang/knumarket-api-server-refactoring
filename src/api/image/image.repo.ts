import { EntityRepository, Repository } from "typeorm";
import { Image } from "../../entity/Image";
import { connection } from "../../lib/database";

@EntityRepository()
export class ImageRepository extends Repository<Image> {
    
    
    // createImageObjs = async (imageUrls: string[]) => {
        
    // }

    deleteImage = async (imageUid: string) => {
        await connection.getRepository(Image).delete(imageUid);
    }
}