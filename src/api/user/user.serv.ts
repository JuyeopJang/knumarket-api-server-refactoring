import { v4 as uuidv4 } from 'uuid';
import { BadRequestException } from '../../common/exceptions/';
import crypto from 'crypto';
// import * as jwt from '../../lib/jwt.js';
import { UserRepository } from './user.repo.js';
// import { UserDto } from '../interfaces/dto/UserDto.js';
import { UserDao } from '../interfaces/dao/UserDao.js';
import { ConflictException } from '../../common/exceptions/conflict.exception';

export default class UserService {

  userRepository: UserRepository;
    
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  cryptoPassword(password: string): string {
    return crypto
      .createHmac('sha512', process.env.CRYPTO || '')
      .update(password)
      .digest('hex');
  }
    
  async countByEmail(email: string) {
    return this.userRepository.countByEmail(email);
  }

  signUp = async (email: string, password: string, nickname: string) => {
    const hasEmail: number = +await this.countByEmail(email);

    if (hasEmail) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    const user_uid: string = uuidv4();
    const encryptedPassword: string = this.cryptoPassword(password);

    const userDao: UserDao = {
        user_uid: user_uid,
        email,
        password: encryptedPassword,
        nickname
    };

    await this.userRepository.create(userDao);
  }
}