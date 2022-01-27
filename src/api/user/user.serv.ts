import { v4 as uuidv4 } from 'uuid';
import { UnauthorizedException } from '../../common/exceptions/';
import crypto from 'crypto';
import { UserRepository } from './user.repo';
import { PostRepository } from '../post/post.repo';
import { UserDao } from '../interfaces/dao/UserDao.js';
import { ConflictException } from '../../common/exceptions/conflict.exception';
import { jwtSign } from '../../lib/jwt';
import { getRefreshToken, setRefreshToken } from '../../lib/redis';
import { NotFoundException } from '../../common/exceptions/not-found.exception';

export default class UserService {

  userRepository: UserRepository;
    
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

    const createdUser = this.userRepository.create();

    createdUser.user_uid = user_uid;
    createdUser.email = user.email;
    createdUser.password = encryptedPassword;
    createdUser.nickname = user.nickname;
  
    this.userRepository.save(createdUser);
  }

  getTokens = async (email: string, password: string) => {
    const user = await this.countByEmailAndPassword(email, password);
    let tokens: string[] = [];

    if (!user) {
      throw new UnauthorizedException("이메일 또는 비밀번호가 일치하지 않습니다.");
    }

    tokens.push(jwtSign({ user_uid: user.user_uid }, '1d', {}));
    tokens.push(jwtSign({ user_uid: user.user_uid }, '14d', {}));

    this.setRefreshToken(user.user_uid, tokens[1]);

    return tokens;
  }

  getUser = async (userUid: string) => {
    const user = await this.userRepository.findOne(userUid);

    if (!user) throw new NotFoundException('회원 정보가 존재하지 않습니다.');

    return user;
  }

  setRefreshToken = (userUid: string, refreshToken: string) => {
    setRefreshToken(userUid, refreshToken);
  }

  getMyInfo = async (userUid: string) => {
    const user = await this.userRepository.findOne(userUid);
  
    if (!user) throw new NotFoundException('회원 정보가 존재하지 않습니다.');
    return user;
  }

  updateMyInfo = async (userUid: string, nickname: string) => {
    const user = await this.userRepository.findOne(userUid);
  
    if (!user) throw new NotFoundException('회원 정보가 존재하지 않습니다.');
    
    user.nickname = nickname;
    
    await this.userRepository.save(user);
  }

  signOut = async (userUid: string) => {
    const user = await this.userRepository.findOne(userUid);
  
    if (!user) throw new NotFoundException('회원 정보가 존재하지 않습니다.');

    await this.userRepository.delete(userUid);
  }

  createNewAccessToken = async (userUid: string) => {
    const isRefreshTokenExist: boolean = await this.getRefreshTokenInRedis(userUid);

    if (!isRefreshTokenExist) {
      throw new UnauthorizedException('토큰을 재발급할 수 없습니다. 다시 로그인 해주세요');
    }

    const accessToken = jwtSign({
      user_uid: userUid
    }, '1d');

    return accessToken;
  }

  getRefreshTokenInRedis = async (userUid: string) => {
    const refreshToken = getRefreshToken(userUid);

    if (refreshToken) return true;
    return false;
  }

}