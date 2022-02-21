import { EntityRepository, Repository } from "typeorm";
import { Image } from "../../entity/Image";
// import { connection } from "../../lib/database";

@EntityRepository(Image)
export class ImageRepository extends Repository<Image> {

    getImagesByPostId = async (postId: number) => {
        return await this.find({
            where: {
                post: postId
            }  
        });
    }

  insertImage(image_uid: string, key: string, url: string) {
    return this.createQueryBuilder()
      .insert()
      .into(Image, ['image_uid', 'key', 'url'])
      .values({ image_uid, key, url })
      .updateEntity(false)
      .execute();
  }
}