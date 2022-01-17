import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, UnauthorizedException } from '../../common/exceptions/';
import crypto from 'crypto';
// import * as jwt from '../../lib/jwt.js';
import { UserRepository } from './user.repo';
import { PostRepository } from '../post/post.repo';
import { UserDao } from '../interfaces/dao/UserDao.js';
import { ConflictException } from '../../common/exceptions/conflict.exception';
import { jwtSign } from '../../lib/jwt';
import { getRefreshToken, setRefreshToken } from '../../lib/redis';
import { redisClient } from '../../lib/database';


export default class UserService {

  userRepository: UserRepository;
  postRepository: PostRepository;
    
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  cryptoPassword = (password: string): string => {
    return crypto
      .createHmac('sha512', process.env.CRYPTO || '')
      .update(password)
      .digest('hex');
  }
    
  countByEmail = async (email: string) => {
    return this.userRepository.countByEmail(email);
  }

  countByEmailAndPassword = async (email: string, password: string) => {
    const encryptedPassword: string = this.cryptoPassword(password);
    const user = await this.userRepository.selectUserByEmailAndPassword(email, encryptedPassword); 
    return user;
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
    const user = await this.countByEmailAndPassword(email, password);
    let tokens: string[] = [];

    if (!user) {
      throw new UnauthorizedException("이메일 또는 비밀번호가 일치하지 않습니다.");
    }

    tokens.push(jwtSign(user, '1d', {}));
    tokens.push(jwtSign(user, '14d', {}));

    this.setRefreshToken(user.user_uid, tokens[1]);

    return tokens;
  }

  setRefreshToken = (userUid: string, refreshToken: string) => {
    setRefreshToken(userUid, refreshToken);
  }

  getMyInfo = async (email: string) => {
    return this.userRepository.findByEmail(email);
  }

  updateMyInfo = async (email: string, nickname: string) => {
    return this.userRepository.updateNicknameByEmail(email, nickname)
  }

  signOut = async (email: string) => {
    return this.userRepository.deleteUserByEmail(email);
  }

  createNewAccessToken = async () => {

  }

  getRefreshTokenInRedis = async (userUid: string) => {
    return getRefreshToken(userUid);
  }

}