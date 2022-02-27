import { createConnection, getConnection, getCustomRepository } from "typeorm"
import { ImageRepository } from "../../api/image/image.repo";
import { Image } from "../../entity/Image";
import { Post } from "../../entity/Post";
import { PostRoom } from "../../entity/PostRoom";
import { User } from "../../entity/User";

describe('ImageRepository - image.repo.ts', () => {
  let imageRepository: ImageRepository;

  beforeEach(async () => {
    const connection = await createConnection({
      type: "sqlite",
      database: ":memory:",
      dropSchema: true,
      entities: [User, Post, Image, PostRoom],
      synchronize: true,
      logging: ["error"]
    });
  
    imageRepository = getCustomRepository(ImageRepository);
  });

  afterEach(async () => {
    await imageRepository.clear();
    await getConnection().close();
  });

  it('insertImage - 이미지 생성', async () => {
    // given
    const imageUid = 'dlaksjekfjjkaheljfhksaj';
    const key = '164782137821';
    const url = `https://aws.amazon.com/ap2-northeast-s3/${key}`;

    // when
    await imageRepository.insertImage(imageUid, key, url);

    // then
    const result = await imageRepository.findOne(imageUid);
    expect(result.image_uid).toBe(imageUid);
    expect(result.key).toBe(key);
    expect(result.url).toBe(url);
  });
});