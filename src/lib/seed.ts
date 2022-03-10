import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export const initializaPostAndRoomDatas = async (userRepository, postRepository, roomRepository, userUid: string) => {
  for (let i = 0; i < 4; i++) {
    const post = await postRepository.insertPost('피자 같이 시킬사람?', '장소는 쪽문 또는 정문~~', 3, 10);
    const postId = post.identifiers[0].id;
    await userRepository.relatePostOfUser(userUid, postId);

    const roomUid = uuidv4();
    await roomRepository.insertRoom(roomUid, '피자 같이 시킬사람?', 10);
    
    await postRepository.relateRoomOfPost(postId, roomUid);

    await userRepository.relateRoomOfUser(userUid, roomUid);
  }
};

export const initializaUserDatas = async (userRepository, postRepository, roomRepository) => {
  for (let i = 0; i < 500; i++) {
    const userUid = uuidv4();
    const password = crypto
      .createHmac('sha512', process.env.CRYPTO || '')
      .update('helloworld')
      .digest('hex');
    const email = `noah${i}@gmail.com`;
    const nickname = `mockUser${i}`;

    const user = userRepository.createUser(userUid, email, password, nickname);
    await userRepository.insertUser(user);
    
    await initializaPostAndRoomDatas(userRepository, postRepository, roomRepository, userUid);
  }
};