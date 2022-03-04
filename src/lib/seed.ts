import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export const initializaPostDatas = async (userRepository, postRepository, userUid: string) => {
  for (let i = 0; i < 2; i++) {
    const post = await postRepository.insertPost('피자 같이 시킬사람?', '장소는 쪽문 또는 정문~~', 3, 10);
    const postId = post.identifiers[0].id;
    await userRepository.relatePostOfUser(userUid, postId);
  }
};

export const initializaUserDatas = async (userRepository, postRepository) => {
  for (let i = 0; i < 500; i++) {
    const userUid = uuidv4();
    const password = crypto
      .createHmac('sha512', process.env.CRYPTO || '')
      .update('123456')
      .digest('hex');
    const email = `noah${i}@gmail.com`;
    const nickname = `mockUser${i}`;

    const user = userRepository.createUser(userUid, email, password, nickname);
    await userRepository.insertUser(user);
    
    await initializaPostDatas(userRepository, postRepository, userUid);
  }
};