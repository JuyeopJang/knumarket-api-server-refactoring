import { v4 as uuidv4 } from 'uuid';
import { BadRequestException } from '../../common/exceptions/index.js';
import crypto from 'crypto';
// import * as jwt from '../../lib/jwt.js';
import { UserRepository } from './user.repo.js';
import { UserDto } from '../interfaces/dto/UserDto.js';
import { UserDao } from '../interfaces/dao/UserDao.js';

export default class UserService {
  userRepository: UserRepository;
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

//   findById(id) {
//     return this.userRepository.findById(id);
//   }

//   findByEmail(email) {
//     return this.userRepository.findByEmail(email);
//   }

  cryptoPassword(password: string): string {
    return crypto
      .createHmac('sha512', process.env.CRYPTO || '')
      .update(password)
      .digest('hex');
  }
    

//   countByEmail(email: string) {
//     return this.userRepository.countByEmail(email);
//   }

  signUp = async (userDto: UserDto) => {
    // const { count: hasEmail } = this.countByEmail(email);

    // if (hasEmail) {
    //   throw new BadRequestException('중복된 이메일이 있습니다.');
    // }

    const user_uid: string = uuidv4();
    const password: string = this.cryptoPassword(userDto.password);

    const userDao: UserDao = {
        user_uid: user_uid,
        email: userDto.email,
        password,
        nickname: userDto.nickname
    };

    await this.userRepository.create(userDao);
  }

//   async login({ email, password }) {
//     const user = this.findByEmail(email);
//     if (!user) {
//       throw new BadRequestException(
//         '이메일 또는 비밀번호를 다시 확인해 주세요.',
//       );
//     }

//     const isValidPassword = await compare(password, user.password);
//     if (!isValidPassword) {
//       throw new BadRequestException(
//         '이메일 또는 비밀번호를 다시 확인해 주세요.',
//       );
//     }

//     const token = jwt.sign({
//       user_id: user.id,
//       email,
//     });

//     return [token, user.toJson()]
//   }
}