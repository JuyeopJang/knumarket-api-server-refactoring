import { Connection, EntityManager, QueryRunner } from "typeorm"
import { UserRepository } from "../../api/user/user.repo"
import { mock, mockDeep } from "jest-mock-extended";
import { ConflictException } from "../../common/exceptions/conflict.exception";
import { ServerException, UnauthorizedException } from "../../common/exceptions";
import { User } from "../../entity/User";
import UserService from "../../api/user/user.serv";
import { NotFoundException } from "../../common/exceptions/not-found.exception";

describe('UserService - user.serv.ts', () => {
  let userRepository = mock<UserRepository>();
  let connection = mockDeep<Connection>({
    createQueryRunner: () => queryRunner
  });
  let entityManager = mock<EntityManager>();
  let queryRunner = mock<QueryRunner>({
    manager: entityManager
  });
  let userService = new UserService(userRepository, connection);

  describe('signUp - 회원가입', () => {
    it('실패 - 중복된 이메일이 존재하는 경우', async () => {
      // given
      const email = 'noah0225@gmail.com';
      const password = 'dkas;jdjijidasjlfjlkas';
      const nickname = 'hellod'
      
      // when
      userRepository.countByEmail.mockResolvedValue(1);
      
      // then
      try {
        await userService.signUp({ email, password, nickname });
      } catch (err) {
        expect(err).toEqual(new ConflictException('이미 존재하는 이메일입니다.'));  
      }
    });

    it('실패 - 트랜잭션 롤백 여부 확인', async () => {
      // given
      const email = 'noah0225@gmail.com';
      const password = 'dkas;jdjijidasjlfjlkas';
      const nickname = 'hellod'
      
      // when
      userRepository.countByEmail.mockResolvedValue(0);
      
      // then
      try {
        await userService.signUp({ email, password, nickname });
      } catch (err) {
        expect(err).toEqual(new ServerException('서버 오류로 회원 가입에 실패했습니다. 다시 시도해주세요'));
      }

      expect(connection.createQueryRunner().rollbackTransaction).toHaveBeenCalled();
      expect(connection.createQueryRunner().release).toHaveBeenCalled();
    });

    it('성공 - 트랜잭션 커밋 여부 확인', async () => {
      // given
      const email = 'noah0225@gmail.com';
      const password = 'dkas;jdjijidasjlfjlkas';
      const nickname = 'hellod'
      
      // when
      userRepository.countByEmail.mockResolvedValue(0);
      
      jest
        .spyOn(entityManager, 'getCustomRepository')
        .mockImplementation(() => {
          return {
            insertUser: async () => {}
          };
        });

      // then
      try {
        await userService.signUp({ email, password, nickname });
      } catch (err) {  
        console.log(err);
      }

      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });
  });

  describe('getTokens - 액세스, 리프레시 토큰 발급', () => {
    it('실패 - 이메일 또는 비밀번호가 틀린 경우', async () => {
      // given
      const email = 'noah0225@gmail.com';
      const password = 'dkas;jdjijidasjlfjlkas';
      
      // when
      userRepository.findUserByEmailAndPassword.mockResolvedValue(undefined);
      
      // then
      try {
        await userService.getTokens(email, password);
      } catch (err) {
        expect(err).toEqual(new UnauthorizedException("이메일 또는 비밀번호가 일치하지 않습니다."));  
      }
    });

    it('성공 - 액세스, 리프레시 토큰 발급', async () => {
      // given
      const email = 'noah0225@gmail.com';
      const password = 'dkas;jdjijidasjlfjlkas';

      const user = new User();
      
      // when
      userRepository.findUserByEmailAndPassword.mockResolvedValue(user);
      
      // then
      let tokens;
      try {
        tokens = await userService.getTokens(email, password);
      } catch (err) {
      }
      
      expect(tokens.length).toBe(2);
    });
  });

  describe('getMyInfo - 내 정보 조회', () => {
    it('실패 - 유저가 DB에 존재하지 않는 경우', async () => {
      // given
      const userUid = 'dksjauoehfokjsakldjsklajdk';

      // when
      userRepository.findUserById.mockResolvedValue(undefined);
      
      // then
      let user;

      try {
        user = await userService.getMyInfo(userUid);
      } catch (err) {
        expect(err).toEqual(new NotFoundException('회원 정보가 존재하지 않습니다.'));  
      }
    });

    it('성공 - 유저 정보 반환', async () => {
      // given
      const userUid = 'dksjauoehfokjsakldjsklajdk';
      const user = new User();
      user.user_uid = userUid;
      
      // when
      userRepository.findUserById.mockResolvedValue(user);
      
      // then
      let result;
      try {
        result = await userService.getMyInfo(userUid);
      } catch (err) {
      }
      
      expect(result.user_uid).toBe(userUid);
    });
  });

  describe('updateMyInfo - 회원 정보 수정', () => {
    it('실패 - 유저가 DB에 존재하지 않는 경우', async () => {
      // given
      const userUid = 'dkjsajdlksjdklasjddksajdklsajhioqw';
      const email = 'noah0225@gmail.com';
      const password = 'dkas;jdjijidasjlfjlkas';
      const nickname = 'hellod'
      
      // when
      userRepository.findUserById.mockResolvedValue(undefined);
      
      // then
      try {
        await userService.updateMyInfo(userUid, nickname);
      } catch (err) {
        expect(err).toEqual(new NotFoundException('회원 정보가 존재하지 않습니다.'));  
      }
    });

    it('실패 - 트랜잭션 롤백 여부 확인', async () => {
      // given
      const userUid = 'dkjsajdlksjdklasjddksajdklsajhioqw';
      const email = 'noah0225@gmail.com';
      const password = 'dkas;jdjijidasjlfjlkas';
      const nickname = 'hellod'

      const user = new User();
      user.user_uid = userUid;
      user.email = email;
      user.password = password;
      user.nickname = nickname;
      
      // when
      userRepository.findUserById.mockResolvedValue(user);
      
      // then
      try {
        await userService.updateMyInfo(userUid, '수정된닉네임');
      } catch (err) {
        expect(err).toEqual(new ServerException('서버 오류로 닉네임 변경에 실패했습니다. 다시 시도해주세요'));
      }

      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('성공 - 트랜잭션 커밋 여부 확인', async () => {
        // given
      const userUid = 'dkjsajdlksjdklasjddksajdklsajhioqw';
      const email = 'noah0225@gmail.com';
      const password = 'dkas;jdjijidasjlfjlkas';
      const nickname = 'hellod'
  
      const user = new User();
      user.user_uid = userUid;
      user.email = email;
      user.password = password;
      user.nickname = nickname;
      
      // when
      userRepository.findUserById.mockResolvedValue(user);
      jest
        .spyOn(entityManager, 'getCustomRepository')
        .mockImplementation(() => {
          return {
            updateNickname: async () => {}
          };
        });
      
      // then
      try {
        await userService.updateMyInfo(userUid, '수정된닉네임');
      } catch (err) {
      }
  
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });
  });

  describe('signOut - 회원탈퇴', () => {
    it('실패 - 유저가 DB에 존재하지 않는 경우', async () => {
      // given
      const userUid = 'dkjsajdlksjdklasjddksajdklsajhioqw';
      const nickname = 'hellod'
      
      // when
      userRepository.findUserById.mockResolvedValue(undefined);
      
      // then
      try {
        await userService.signOut(userUid);
      } catch (err) {
        expect(err).toEqual(new NotFoundException('회원 정보가 존재하지 않습니다.'));  
      }
    });

    it('실패 - PostRoomRepository.findPostRoomsByUserId 롤백 여부 확인', async () => {
      // given
      const userUid = 'dkjsajdlksjdklasjddksajdklsajhioqw';
      const email = 'noah0225@gmail.com';
      const password = 'dkas;jdjijidasjlfjlkas';
      const nickname = 'hellod'

      const user = new User();
      user.user_uid = userUid;
      user.email = email;
      user.password = password;
      user.nickname = nickname;
      
      // when
      userRepository.findUserById.mockResolvedValue(user);
      jest
        .spyOn(entityManager, 'getCustomRepository')
        .mockImplementation(() => {
          return {
            updateCountOfRoom: async () => {},
            deleteUserOutOfRoom: async () => {},
            deleteUser: async () => {},
          };
        });
      
      // then
      try {
        await userService.signOut(userUid);
      } catch (err) {
        expect(err).toEqual(new ServerException('서버 오류로 회원 탈퇴에 실패했습니다. 다시 시도해주세요'));
      }

      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('실패 - PostRoomRepository.updateCountOfRoom 롤백 여부 확인', async () => {
        // given
        const userUid = 'dkjsajdlksjdklasjddksajdklsajhioqw';
        const email = 'noah0225@gmail.com';
        const password = 'dkas;jdjijidasjlfjlkas';
        const nickname = 'hellod'
  
        const user = new User();
        user.user_uid = userUid;
        user.email = email;
        user.password = password;
        user.nickname = nickname;
        
        // when
        userRepository.findUserById.mockResolvedValue(user);
        jest
          .spyOn(entityManager, 'getCustomRepository')
          .mockImplementation(() => {
            return {
              findPostRoomsByUserId: async () => {}, 
              deleteUserOutOfRoom: async () => {},
              deleteUser: async () => {},
            };
          });
        
        // then
        try {
          await userService.signOut(userUid);
        } catch (err) {
          expect(err).toEqual(new ServerException('서버 오류로 회원 탈퇴에 실패했습니다. 다시 시도해주세요'));
        }
  
        expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
        expect(queryRunner.release).toHaveBeenCalled();
    });

    it('실패 - PostRoomRepository.deleteUserOutOfRoom 롤백 여부 확인', async () => {
        // given
        const userUid = 'dkjsajdlksjdklasjddksajdklsajhioqw';
        const email = 'noah0225@gmail.com';
        const password = 'dkas;jdjijidasjlfjlkas';
        const nickname = 'hellod'
  
        const user = new User();
        user.user_uid = userUid;
        user.email = email;
        user.password = password;
        user.nickname = nickname;
        
        // when
        userRepository.findUserById.mockResolvedValue(user);
        jest
          .spyOn(entityManager, 'getCustomRepository')
          .mockImplementation(() => {
            return {
              findPostRoomsByUserId: async () => {}, 
              updateCountOfRoom: async () => {},
              deleteUser: async () => {},
            };
          });
        
        // then
        try {
          await userService.signOut(userUid);
        } catch (err) {
          expect(err).toEqual(new ServerException('서버 오류로 회원 탈퇴에 실패했습니다. 다시 시도해주세요'));
        }
  
        expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
        expect(queryRunner.release).toHaveBeenCalled();
    });

    it('실패 - UserRepository.deleteUser 롤백 여부 확인', async () => {
        // given
        const userUid = 'dkjsajdlksjdklasjddksajdklsajhioqw';
        const email = 'noah0225@gmail.com';
        const password = 'dkas;jdjijidasjlfjlkas';
        const nickname = 'hellod'
  
        const user = new User();
        user.user_uid = userUid;
        user.email = email;
        user.password = password;
        user.nickname = nickname;
        
        // when
        userRepository.findUserById.mockResolvedValue(user);
        jest
          .spyOn(entityManager, 'getCustomRepository')
          .mockImplementation(() => {
            return {
              findPostRoomsByUserId: async () => {}, 
              updateCountOfRoom: async () => {},
              deleteUserOutOfRoom: async () => {},
            };
          });
        
        // then
        try {
          await userService.signOut(userUid);
        } catch (err) {
          expect(err).toEqual(new ServerException('서버 오류로 회원 탈퇴에 실패했습니다. 다시 시도해주세요'));
        }
  
        expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
        expect(queryRunner.release).toHaveBeenCalled();
    });

    it('성공 - 트랜잭션 커밋 여부 확인', async () => {
        // given
      const userUid = 'dkjsajdlksjdklasjddksajdklsajhioqw';
      const email = 'noah0225@gmail.com';
      const password = 'dkas;jdjijidasjlfjlkas';
      const nickname = 'hellod'
  
      const user = new User();
      user.user_uid = userUid;
      user.email = email;
      user.password = password;
      user.nickname = nickname;
      
      // when
      userRepository.findUserById.mockResolvedValue(user);
      jest
        .spyOn(entityManager, 'getCustomRepository')
        .mockImplementation(() => {
          return {
            findPostRoomsByUserId: async () => {},
            updateCountOfRoom: async () => {},
            deleteUserOutOfRoom: async () => {},
            deleteUser: async () => {},
          };
        });
      
      // then
      try {
        await userService.signOut(userUid);
      } catch (err) {
      }
  
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });
  });
});
