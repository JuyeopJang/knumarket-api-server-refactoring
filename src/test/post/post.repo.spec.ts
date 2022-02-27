import { max } from "class-validator";
import { createConnection, getConnection, getCustomRepository } from "typeorm"
import { ImageRepository } from "../../api/image/image.repo";
import { PostRepository } from "../../api/post/post.repo";
import { PostRoomRepository } from "../../api/post_room/post-room.repo";
import { UserRepository } from "../../api/user/user.repo";
import { Image } from "../../entity/Image";
import { Post } from "../../entity/Post";
import { PostRoom } from "../../entity/PostRoom";
import { User } from "../../entity/User";

describe('PostRepository - post.repo.ts', () => {
  let userRepository: UserRepository;
  let postRepository: PostRepository;
  let postRoomRepository: PostRoomRepository;
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

    userRepository = getCustomRepository(UserRepository);
    postRepository = getCustomRepository(PostRepository);
    postRoomRepository = getCustomRepository(PostRoomRepository);
    imageRepository = getCustomRepository(ImageRepository);
  });

  afterEach(async () => {
    await imageRepository.clear();
    await postRepository.clear();
    await postRoomRepository.clear();
    await userRepository.clear();
    await getConnection().close();
  });

  it('insertPost - 공동구매 글 생성', async () => {
    // given
    const title = '치피 파티 할 사람??';
    const description = '치킨나라 피자공주 같이 시켜먹어요!! 너무 심심해요..ㅜㅜ';
    const location = 2;
    const max_head_count = 4;

    // when
    await postRepository.insertPost(title, description, location, max_head_count);

    // then
    const result = await postRepository.findOne(1);
    expect(result.title).toBe(title);
    expect(result.description).toBe(description);
    expect(result.max_head_count).toBe(max_head_count);
    expect(result.is_archived).toBe(false);
  });

  it('getPostsForFirstPage - 첫 페이지 글 목록 조회', async () => {
    // given
    const title = '치피 파티 할 사람??';
    const description = '치킨나라 피자공주 같이 시켜먹어요!! 너무 심심해요..ㅜㅜ';
    const location = 2;
    const max_head_count = 4;
    
    for (let i = 0; i < 15; i++) {
        await postRepository.insertPost(title, description, location, max_head_count);
    }

    // when
    const result1 = await postRepository.getPostsForFirstPage();
    
    // then
    expect(result1.length).toBe(15);
  });

  it('getPosts - 페이징을 통한 글 목록 조회', async () => {
    // given
    const title = '치피 파티 할 사람??';
    const description = '치킨나라 피자공주 같이 시켜먹어요!! 너무 심심해요..ㅜㅜ';
    const location = 2;
    const max_head_count = 4;
    
    for (let i = 0; i < 43; i++) {
        await postRepository.insertPost(title, description, location, max_head_count);
    }

    // when
    const result1 = await postRepository.getPosts(24);
    const result2 = await postRepository.getPosts(4);
    
    // then
    expect(result1.length).toBe(20);
    expect(result1[0].id).toBe(23);
    expect(result1[19].id).toBe(4);
    
    expect(result2.length).toBe(3);
    expect(result2[0].id).toBe(3);
    expect(result2[result2.length - 1].id).toBe(1);
  });

  it('getMyPostsForFirstPage - 첫 페이지 유저가 쓴 글 목록 조회', async () => {
    // given
    const user = new User();
    user.user_uid = 'dsalkalsdmlkmnfiaiosdnios';
    user.email = 'noah0225@naver.com';
    user.nickname = 'goodman';
    user.password = 'kdklasdklmijo3j1iofjkajhdlsajlkdfjlrhj';
    await userRepository.save(user);

    const title = '치피 파티 할 사람??';
    const description = '치킨나라 피자공주 같이 시켜먹어요!! 너무 심심해요..ㅜㅜ';
    const location = 2;
    const max_head_count = 4;
    
    for (let i = 0; i < 3; i++) {
      await postRepository.insertPost(title, description, location, max_head_count);
      await userRepository.relatePostOfUser(user.user_uid, i + 1);
    }

    // when
    const result = await postRepository.getMyPostsForFirstPage(user.user_uid);
    
    // then
    expect(result.length).toBe(3);
    expect(result[0].id).toBe(3);
    expect(result[result.length - 1].id).toBe(1);
  });

  it('getMyPosts - 페이징을 통한 특정 유저가 쓴 글 목록 조회', async () => {
    // given
    const user = new User();
    user.user_uid = 'dsalkalsdmlkmnfiaiosdnios';
    user.email = 'noah0225@naver.com';
    user.nickname = 'goodman';
    user.password = 'kdklasdklmijo3j1iofjkajhdlsajlkdfjlrhj';
    await userRepository.save(user);

    const title = '치피 파티 할 사람??';
    const description = '치킨나라 피자공주 같이 시켜먹어요!! 너무 심심해요..ㅜㅜ';
    const location = 2;
    const max_head_count = 4;
    
    for (let i = 0; i < 32; i++) {
      await postRepository.insertPost(title, description, location, max_head_count);
      await userRepository.relatePostOfUser(user.user_uid, i + 1);
    }

    // when
    const result = await postRepository.getMyPosts(13, user.user_uid);
    
    // then
    expect(result.length).toBe(12);
    expect(result[0].id).toBe(12);
    expect(result[result.length - 1].id).toBe(1);
  });

  it('getPostById - 아이디로 특정 글 조회', async () => {
    // given
    const image = new Image();
    image.image_uid = 'dsalkalsdmlkmnfiaiosdnios';
    image.key = '372164876217836';
    image.url = `https://aws.amazon.com/ap2-northeast${image.key}`;

    const title = '치피 파티 할 사람??';
    const description = '치킨나라 피자공주 같이 시켜먹어요!! 너무 심심해요..ㅜㅜ';
    const location = 2;
    const max_head_count = 4;
    const roomUid = 'dkjsajdij31iojoidjkashdjk';

    await postRepository.insertPost(title, description, location, max_head_count);
    await postRoomRepository.insertRoom(roomUid, title, max_head_count);
    await imageRepository.save(image);

    await postRepository.relateImageOfPost(1, image.image_uid);
    await postRepository.relateRoomOfPost(1, roomUid);

    // when
    const result = await postRepository.getPostById(1);
    
    // then
    expect(result.images.length).toBe(1);
    expect(result).toHaveProperty('post_room');
  });

  it('updatePostById - 아이디로 특정 글 수정', async () => {
    // given
    const title = '치피 파티 할 사람??';
    const description = '치킨나라 피자공주 같이 시켜먹어요!! 너무 심심해요..ㅜㅜ';
    const location = 2;
    const max_head_count = 4;
    await postRepository.insertPost(title, description, location, max_head_count);
    
    // when
    await postRepository.updatePostById('수정!', description, location, max_head_count, false, 1);
    
    // then
    const result = await postRepository.findOne(1);
    expect(result.title).toBe('수정!');
  });

  it('deletePostById - 글 삭제', async () => {
    // given
    const post = new Post();
    post.title = '치피 파티 할 사람??';
    post.description = '치킨나라 피자공주 같이 시켜먹어요!! 너무 심심해요..ㅜㅜ';
    post.location = 2;
    post.max_head_count = 4;
    await postRepository.save(post);
    
    // when
    await postRepository.deletePostById(post);
    
    // then
    const result = await postRepository.findOne(1);
    expect(result).toBeUndefined();
  });

  it('relateRoomOfPost - 글, 채팅방 관계 형성', async () => {
    // given
    const post = new Post();
    post.title = '치피 파티 할 사람??';
    post.description = '치킨나라 피자공주 같이 시켜먹어요!! 너무 심심해요..ㅜㅜ';
    post.location = 2;
    post.max_head_count = 4;
    await postRepository.save(post);
    
    const room = new PostRoom();
    room.post_room_uid = 'djsadiojiojiojiosdjfiosjaido';
    room.title = post.title;
    room.max_head_count = post.max_head_count;
    await postRoomRepository.save(room);
    
    // when
    await postRepository.relateRoomOfPost(1, room.post_room_uid);
    
    // then
    const result = await postRepository.findOne(1, {
      relations: ["post_room"]
    });

    expect(result.post_room.post_room_uid).toBe(room.post_room_uid);
  });

  it('deleteRoomOfPost - 글, 채팅방 관계 삭제', async () => {
    // given
    const post = new Post();
    post.title = '치피 파티 할 사람??';
    post.description = '치킨나라 피자공주 같이 시켜먹어요!! 너무 심심해요..ㅜㅜ';
    post.location = 2;
    post.max_head_count = 4;
    await postRepository.save(post);
    
    const room = new PostRoom();
    room.post_room_uid = 'djsadiojiojiojiosdjfiosjaido';
    room.title = post.title;
    room.max_head_count = post.max_head_count;
    await postRoomRepository.save(room);

    await postRepository.relateRoomOfPost(1, room.post_room_uid);
    
    // when
    await postRepository.deleteRoomOfPost(1);
    
    // then
    const result = await postRepository.findOne(1, {
      relations: ["post_room"]
    });

    expect(result.post_room).toBeNull();
  });

  it('relateImageOfPost - 글, 이미지 관계 형성', async () => {
    // given
    const post = new Post();
    post.title = '치피 파티 할 사람??';
    post.description = '치킨나라 피자공주 같이 시켜먹어요!! 너무 심심해요..ㅜㅜ';
    post.location = 2;
    post.max_head_count = 4;
    await postRepository.save(post);
    
    const image = new Image();
    image.image_uid = 'dkosajdioj12099301j';
    image.url = 'dksajdioi12j32ldlas.com';
    image.key = '3218974892173914';
    await imageRepository.save(image);

    // when
    await postRepository.relateImageOfPost(1, image.image_uid);
    
    // then
    const result = await postRepository.findOne(1, {
        relations: ["images"]
    });

    expect(result.images.length).toBe(1);
  });


});