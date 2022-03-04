import { createConnection, getConnection, getCustomRepository } from "typeorm"
import { PostRepository } from "../../api/post/post.repo";
import { PostRoomRepository } from "../../api/post_room/post-room.repo";
import { UserRepository } from "../../api/user/user.repo"
import { Image } from "../../entity/Image";
import { Post } from "../../entity/Post";
import { PostRoom } from "../../entity/PostRoom";
import { User } from "../../entity/User";

describe('UserRepository - user.repo.ts', () => {
  let userRepository: UserRepository;
  let postRepository: PostRepository;
  let postRoomRepository: PostRoomRepository;

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
  });

  afterEach(async () => {
    await postRoomRepository.clear();
    await postRepository.clear();
    await userRepository.clear();
    await getConnection().close();
  });

  it('findUserById - 아이디로 유저 조회', async () => {
    // given
    const user = new User();
    user.user_uid = 'dlaksjekfjjkaheljfhksaj';
    user.email = 'noah0225@gmail.com';
    user.nickname = 'navergo';
    user.password = 'ddksahhruhuhu123y7846dhja';
    await userRepository.save(user);

    // when
    const result = await userRepository.findUserById(user.user_uid);

    // then
    expect(result.email).toBe(user.email);
    expect(result.nickname).toBe(user.nickname);
    expect(result.is_verified).toBe(false);
  });

  it('updateNickname - 유저 닉네임 수정', async () => {
    // given
    const user = new User();
    user.user_uid = 'dlaksjekfjjkaheljfhksaj';
    user.email = 'noah0225@gmail.com';
    user.nickname = 'navergo';
    user.password = 'ddksahhruhuhu123y7846dhja';
    await userRepository.save(user);

    // when
    await userRepository.updateNickname('kakaogo', user.user_uid);    
    
    // then
    const result = await userRepository.findUserById(user.user_uid);
    expect(result.nickname).toBe('kakaogo');
  });

  it('insertUser - 유저 생성', async () => {
    // given
    const user = new User();
    user.user_uid = 'dlaksjekfjjkaheljfhksaj';
    user.email = 'noah0225@gmail.com';
    user.password = 'ddksahhruhuhu123y7846dhja';
    user.nickname = 'navergo';

    // when
    await userRepository.insertUser(user);    
    
    // then
    const result = await userRepository.findUserById(user.user_uid);
    expect(result.email).toBe(user.email);
    expect(result.nickname).toBe(user.nickname);
    expect(result.is_verified).toBe(false);
  });

  it('findUserByEmailAndPassword - 이메일, 비밀번호로 유저 조회', async () => {
    // given
    const user = new User();
    user.user_uid = 'dlaksjekfjjkaheljfhksaj';
    user.email = 'noah0225@gmail.com';
    user.password = 'ddksahhruhuhu123y7846dhja';
    user.nickname = 'navergo';
    await userRepository.insertUser(user);    
    
    // when
    const result = await userRepository.findUserByEmailAndPassword(user.email, user.password);
    
    // then
    expect(result.user_uid).toBe(user.user_uid);
  });

  it('countByEmail - 이메일로 유저 존재 여부 확인', async () => {
    // given
    const user = new User();
    user.user_uid = 'dlaksjekfjjkaheljfhksaj';
    user.email = 'noah0225@gmail.com';
    user.password = 'ddksahhruhuhu123y7846dhja';
    user.nickname = 'navergo';
    await userRepository.insertUser(user);    
    
    // when
    const result = await userRepository.countByEmail(user.email);
    
    // then
    expect(result).toBe(1);
  });

  it('deleteUser - 유저 삭제', async () => {
    // given
    const user = new User();
    user.user_uid = 'dlaksjekfjjkaheljfhksaj';
    user.email = 'noah0225@gmail.com';
    user.password = 'ddksahhruhuhu123y7846dhja';
    user.nickname = 'navergo';
    await userRepository.insertUser(user);    
    
    // when
    await userRepository.deleteUser(user.user_uid);
    
    // then
    const result = await userRepository.findOne(user.user_uid);
    expect(result).toBeUndefined();
  });

  it('relatePostOfUser - 유저, 글 관계 생성', async () => {
    // given
    const user = new User();
    user.user_uid = 'dlaksjekfjjkaheljfhksaj';
    user.email = 'noah0225@gmail.com';
    user.password = 'ddksahhruhuhu123y7846dhja';
    user.nickname = 'navergo';
    await userRepository.insertUser(user);
    
    const post = new Post();
    post.title = '치킨 같이 시킬사람??';
    post.description = '비비큐 황금올리브고 인당 10000원이야!';
    post.location = 3;
    post.max_head_count = 2;
    await postRepository.save(post);
    
    // when
    await userRepository.relatePostOfUser(user.user_uid, 1);
    
    // then
    const result = await userRepository.findOne(user.user_uid, {
      relations: ['posts']
    });
    expect(result.posts[0].id).toBe(1);
  });

  it('relatePostOfUser - 유저, 글 관계 삭제', async () => {
    // given
    const user = new User();
    user.user_uid = 'dlaksjekfjjkaheljfhksaj';
    user.email = 'noah0225@gmail.com';
    user.password = 'ddksahhruhuhu123y7846dhja';
    user.nickname = 'navergo';
    await userRepository.insertUser(user);
    
    const post = new Post();
    post.title = '치킨 같이 시킬사람??';
    post.description = '비비큐 황금올리브고 인당 10000원이야!';
    post.location = 3;
    post.max_head_count = 2;
    await postRepository.save(post);
    await userRepository.relatePostOfUser(user.user_uid, 1);
    
    // when
    await userRepository.deletePostOfUser(user.user_uid, 1);
    
    // then
    const result = await userRepository.findOne(user.user_uid, {
      relations: ['posts']
    });
    expect(result.posts.length).toBe(0);
  });

  it('relateRoomOfUser - 유저, 채팅방 관계 생성', async () => {
    // given
    const user = new User();
    user.user_uid = 'dlaksjekfjjkaheljfhksaj';
    user.email = 'noah0225@gmail.com';
    user.password = 'ddksahhruhuhu123y7846dhja';
    user.nickname = 'navergo';
    await userRepository.insertUser(user);
    
    const room = new PostRoom();
    room.post_room_uid = 'kdasdji1jidjoiasjdk';
    room.title = '치킨 같이 시킬사람??';
    room.max_head_count = 2;
    await postRoomRepository.save(room);
    
    // when
    await userRepository.relateRoomOfUser(user.user_uid, room.post_room_uid);
    
    // then
    const result = await userRepository.findOne(user.user_uid, {
      relations: ['post_rooms']
    });
    expect(result.post_rooms[0].post_room_uid).toBe(room.post_room_uid);
  });
});