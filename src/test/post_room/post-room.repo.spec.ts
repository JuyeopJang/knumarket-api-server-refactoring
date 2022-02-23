import { createConnection, getConnection, getCustomRepository } from "typeorm"
import { PostRepository } from "../../api/post/post.repo";
import { PostRoomRepository } from "../../api/post_room/post-room.repo";
import { UserRepository } from "../../api/user/user.repo"
import { Image } from "../../entity/Image";
import { Post } from "../../entity/Post";
import { PostRoom } from "../../entity/PostRoom";
import { User } from "../../entity/User";

describe('PostRoomRepository - post-room.repo.ts', () => {
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

  it('insertRoom - 채팅방 생성', async () => {
    // given
    const roomUid = 'kdsajoidjoiqjdioasjiodjas';
    const title = '치킨 같이 시키실 분?';
    const max_head_count = 2;

    // when
    await postRoomRepository.insertRoom(roomUid, title, max_head_count);

    // then
    const room = await postRoomRepository.findOne(roomUid);

    expect(room.post_room_uid).toBe(roomUid);
    expect(room.title).toBe(title);
    expect(room.max_head_count).toBe(max_head_count);
    expect(room.current_head_count).toBe(1);
  });

  it('updateCountOfRoom - 채팅방 현재 인원수 수정', async () => {
    // given
    const room = new PostRoom();
    room.post_room_uid = 'kdsajoidjoiqjdioasjiodjas';
    room.title = '치킨 같이 시키실 분?';
    room.max_head_count = 2;
    await postRoomRepository.save(room);
  
    // when  
    await postRoomRepository.updateCountOfRoom(room.post_room_uid, 2);
  
    // then
    const result = await postRoomRepository.findRoomById(room.post_room_uid);

    expect(result.current_head_count).toBe(2);
  });

  it('findRoomById - 아이디로 채팅방 조회', async () => {
    // given
    const room = new PostRoom();
    room.post_room_uid = 'kdsajoidjoiqjdioasjiodjas';
    room.title = '치킨 같이 시키실 분?';
    room.max_head_count = 2;
    await postRoomRepository.save(room);
  
    // when  
    const savedRoom = await postRoomRepository.findRoomById(room.post_room_uid);
  
    // then
    expect(savedRoom.post_room_uid).toBe(room.post_room_uid);
    expect(savedRoom.max_head_count).toBe(room.max_head_count);
    expect(savedRoom.current_head_count).toBe(1);
  });

  it('findPostRoomsByUserId - 유저가 참여중인 모든 채팅방 조회', async () => {
    // given
    const user = new User();
    user.user_uid = 'dlaksjekfjjkaheljfhksaj';
    user.email = 'noah0225@gmail.com';
    user.password = 'ddksahhruhuhu123y7846dhja';
    user.nickname = 'navergo';
    await userRepository.save(user);

    const room1 = new PostRoom();
    room1.post_room_uid = 'kdsajoidjoiqjdioasjiodjas';
    room1.title = '치킨 같이 시키실 분?';
    room1.max_head_count = 2;
    await postRoomRepository.save(room1);
    
    const room2 = new PostRoom();
    room2.post_room_uid = 'dlksadjnqwondoasnudoasn';
    room2.title = '피자 같이 시키실 분?';
    room2.max_head_count = 4;
    await postRoomRepository.save(room2);

    await userRepository.relateRoomOfUser(user.user_uid, room1.post_room_uid);
    await userRepository.relateRoomOfUser(user.user_uid, room2.post_room_uid);

    // when
    const result = await postRoomRepository.findPostRoomsByUserId(user.user_uid);
  
    // then
    expect(result.length).toBe(2);
    expect(result[0].post_room_uid).toBe(room1.post_room_uid);
    expect(result[1].post_room_uid).toBe(room2.post_room_uid);
  });

  it('findRoomByUserIdAndRoomId - 유저가 참여중인 특정 채팅방 조회', async () => {
    // given
    const user = new User();
    user.user_uid = 'dlaksjekfjjkaheljfhksaj';
    user.email = 'noah0225@gmail.com';
    user.password = 'ddksahhruhuhu123y7846dhja';
    user.nickname = 'navergo';
    await userRepository.save(user);

    const room1 = new PostRoom();
    room1.post_room_uid = 'kdsajoidjoiqjdioasjiodjas';
    room1.title = '치킨 같이 시키실 분?';
    room1.max_head_count = 2;
    await postRoomRepository.save(room1);
    
    const room2 = new PostRoom();
    room2.post_room_uid = 'dlksadjnqwondoasnudoasn';
    room2.title = '피자 같이 시키실 분?';
    room2.max_head_count = 4;
    await postRoomRepository.save(room2);

    await userRepository.relateRoomOfUser(user.user_uid, room1.post_room_uid);
    await userRepository.relateRoomOfUser(user.user_uid, room2.post_room_uid);

    // when
    const result = await postRoomRepository.findRoomByUserIdAndRoomId(user.user_uid, room1.post_room_uid);
  
    // then
    expect(result.post_room_uid).toBe(room1.post_room_uid);
  });

  it('deleteUserOutOfRoom - 특정 채팅방에서 유저 제외', async () => {
    // given
    const user = new User();
    user.user_uid = 'dlaksjekfjjkaheljfhksaj';
    user.email = 'noah0225@gmail.com';
    user.password = 'ddksahhruhuhu123y7846dhja';
    user.nickname = 'navergo';
    await userRepository.save(user);

    const room1 = new PostRoom();
    room1.post_room_uid = 'kdsajoidjoiqjdioasjiodjas';
    room1.title = '치킨 같이 시키실 분?';
    room1.max_head_count = 2;
    await postRoomRepository.save(room1);
    
    const room2 = new PostRoom();
    room2.post_room_uid = 'dlksadjnqwondoasnudoasn';
    room2.title = '피자 같이 시키실 분?';
    room2.max_head_count = 4;
    await postRoomRepository.save(room2);

    await userRepository.relateRoomOfUser(user.user_uid, room1.post_room_uid);
    await userRepository.relateRoomOfUser(user.user_uid, room2.post_room_uid);

    // when
    await postRoomRepository.deleteUserOutOfRoom(room1.post_room_uid, user.user_uid);
  
    // then
    const result = await postRoomRepository.findPostRoomsByUserId(user.user_uid);
    expect(result.length).toBe(1);
    expect(result[0].post_room_uid).toBe(room2.post_room_uid);
  });
});