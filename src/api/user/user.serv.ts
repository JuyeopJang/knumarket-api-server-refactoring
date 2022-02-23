import { v4 as uuidv4 } from 'uuid';
import { ServerException, UnauthorizedException } from '../../common/exceptions/';
import crypto from 'crypto';
import { UserRepository } from './user.repo';
import { ConflictException } from '../../common/exceptions/conflict.exception';
import { jwtSign } from '../../lib/jwt';
// import { getRefreshToken, setRefreshToken } from '../../lib/redis';
import { NotFoundException } from '../../common/exceptions/not-found.exception';
import { insertUserDto } from '../dto/InsertUserDto';
import { Connection } from 'typeorm';
import { PostRoomRepository } from '../post_room/post-room.repo';

export default class UserService {

  private userRepository: UserRepository;
  private postRoomRepository: PostRoomRepository;
  private connection: Connection;
    
  constructor(userRepository, postRoomRepository, connection) {
    this.userRepository = userRepository;
    this.postRoomRepository = postRoomRepository;
    this.connection = connection;
  }

  cryptoPassword(password: string) {
    return crypto
      .createHmac('sha512', process.env.CRYPTO || '')
      .update(password)
      .digest('hex');
  }
    
  async countByEmail(email: string) {
    return this.userRepository.countByEmail(email);
  }

  async signUp(insertUserDto: insertUserDto) {
    const { email, password, nickname } = insertUserDto;
    const hasEmail: number = +await this.countByEmail(email);

    if (hasEmail) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    const userUid: string = uuidv4();
    const encryptedPassword: string = this.cryptoPassword(password);
    const user = this.userRepository.createUser(userUid, email, encryptedPassword, nickname);

    const queryRunner = this.connection.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.getCustomRepository(UserRepository).insertUser(user);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      
      throw new ServerException('서버 오류로 회원 가입에 실패했습니다. 다시 시도해주세요');
    } finally {
      await queryRunner.release();
    }
  }

  async getTokens(email: string, password: string) {
    const encryptedPassword: string = this.cryptoPassword(password);
    const user = await this.userRepository.findUserByEmailAndPassword(email, encryptedPassword);
    let tokens: string[] = [];

    if (!user) {
      throw new UnauthorizedException("이메일 또는 비밀번호가 일치하지 않습니다.");
    }

    tokens.push(jwtSign({ ...user }, '1d', {}));
    tokens.push(jwtSign({ ...user }, '14d', {}));

    // this.setRefreshToken(userUid, tokens[1]);

    return tokens;
  }

  getUser = async (userUid: string) => {
    const user = await this.userRepository.findUserById(userUid);

    if (!user) throw new NotFoundException('회원 정보가 존재하지 않습니다.');

    return user;
  }

  setRefreshToken = (userUid: string, refreshToken: string) => {
    // setRefreshToken(userUid, refreshToken);
  }

  async getMyInfo(userUid: string) {
    const user = await this.userRepository.findUserById(userUid);
    if (!user) throw new NotFoundException('회원 정보가 존재하지 않습니다.');
    return user;
  }

  updateMyInfo = async (userUid: string, nickname: string) => {
    const user = await this.userRepository.findUserById(userUid);
  
    if (!user) throw new NotFoundException('회원 정보가 존재하지 않습니다.');

    const queryRunner = this.connection.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.getCustomRepository(UserRepository).updateNickname(nickname, userUid);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      
      throw new ServerException('서버 오류로 닉네임 변경에 실패했습니다. 다시 시도해주세요');
    } finally {
      await queryRunner.release();
    }
  }

  signOut = async (userUid: string) => {
    const user = await this.userRepository.findUserById(userUid);
  
    if (!user) throw new NotFoundException('회원 정보가 존재하지 않습니다.');
    
    const queryRunner = this.connection.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const myRooms = await queryRunner.manager.getCustomRepository(PostRoomRepository).findPostRoomsByUserId(userUid);

      myRooms.forEach(async room => {
        await queryRunner.manager.getCustomRepository(PostRoomRepository).updateCountOfRoom(room.post_room_uid, room.current_head_count - 1)
        await queryRunner.manager.getCustomRepository(PostRoomRepository).deleteUserOutOfRoom(room.post_room_uid, userUid);
      });

      await queryRunner.manager.getCustomRepository(UserRepository).deleteUser(userUid);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      
      throw new ServerException('서버 오류로 회원 탈퇴에 실패했습니다. 다시 시도해주세요');
    } finally {
      await queryRunner.release();
    }
  }

  createNewAccessToken = async (userUid: string) => {
    // const isRefreshTokenExist: boolean = await this.getRefreshTokenInRedis(userUid);

    // if (!isRefreshTokenExist) {
    //   throw new UnauthorizedException('토큰을 재발급할 수 없습니다. 다시 로그인 해주세요');
    // }

    // const accessToken = jwtSign({
    //   user_uid: userUid
    // }, '1d');

    // return accessToken;
  }

  getRefreshTokenInRedis = async (userUid: string) => {
    // const refreshToken = getRefreshToken(userUid);

    // if (refreshToken) return true;
    // return false;
  }
  
}