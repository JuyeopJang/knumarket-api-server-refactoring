import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, UnauthorizedException } from '../../common/exceptions/';
import crypto from 'crypto';
// import * as jwt from '../../lib/jwt.js';
import { UserRepository } from './user.repo.js';
import { UserDao } from '../interfaces/dao/UserDao.js';
import { ConflictException } from '../../common/exceptions/conflict.exception';
import { jwtSign } from '../../lib/jwt';
import { setRefreshToken } from '../../lib/redis';
import { token } from 'morgan';
import { isEmail } from 'class-validator';

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

  async countByEmailAndPassword(email: string, password: string) {
    const encryptedPassword: string = this.cryptoPassword(password);
    const isExist = await this.userRepository.selectUserByEmailAndPassword(email, encryptedPassword); 
    return +isExist;
  }

  signUp = async (user: { email: string, password: string, nickname: string }) => {
    const hasEmail: number = +await this.countByEmail(user.email);

    if (hasEmail) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    const user_uid: string = uuidv4();
    const encryptedPassword: string = this.cryptoPassword(user.password);

    const userDao: UserDao = {
        user_uid,
        email: user.email,
        password: encryptedPassword,
        nickname: user.nickname
    };

    await this.userRepository.create(userDao);
  }

  getTokens = async (email: string, password: string) => {
    const isExistUser = await this.countByEmailAndPassword(email, password);
    let tokens: string[] = [];

    if (!isExistUser) {
      throw new UnauthorizedException("이메일 또는 비밀번호가 일치하지 않습니다.");
    }

    tokens.push(jwtSign({ email }, '1d', {}));
    tokens.push(jwtSign({ email }, '14d', {}));

    setRefreshToken(email, tokens[1]);

    return tokens;
  }

  getMyInfo = async (email: string) => {
    return this.userRepository.findByEmail(email);
  }

  updateMyInfo = async (email: string, nickname: string) => {
    return this.userRepository.updateNicknameByEmail(email, nickname)
  }
}