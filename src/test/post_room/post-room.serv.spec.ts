import { Connection, EntityManager, QueryRunner } from "typeorm"
import { UserRepository } from "../../api/user/user.repo"
import { mock, mockDeep } from "jest-mock-extended";
import { ConflictException } from "../../common/exceptions/conflict.exception";
import { ServerException, UnauthorizedException } from "../../common/exceptions";
import { User } from "../../entity/User";
import { NotFoundException } from "../../common/exceptions/not-found.exception";
import { PostRoomRepository } from "../../api/post_room/post-room.repo";
import { PostRoomService } from "../../api/post_room/post-room.serv";
import { PostRoom } from "../../entity/PostRoom";

describe('PostRoomService - post-room.serv.ts', () => {
  let userRepository = mock<UserRepository>();
  let postRoomRepository = mock<PostRoomRepository>();
  let connection = mockDeep<Connection>({
    createQueryRunner: () => queryRunner
  });
  let entityManager = mock<EntityManager>();
  let queryRunner = mock<QueryRunner>({
    manager: entityManager
  });
  let postRoomService = new PostRoomService(postRoomRepository, userRepository, connection);

  describe('participateUserInRoom - 채팅방에 유저 참여하기', () => {
    it('실패 - DB에 유저가 존재하지 않는 경우', async () => {
      // given
      const userUid = 'dskajdkwjqijdiosajd';
      const roomUid = 'djksadjksandouwqpjdoiwqj';
      
      // when
      userRepository.findUserById.mockResolvedValue(undefined);
      
      // then
      try {
        await postRoomService.participateUserInRoom(userUid, roomUid);
      } catch (err) {
        expect(err).toEqual(new NotFoundException('존재하지 않는 회원입니다.'));  
      }
    });

    it('실패 - DB에 채팅방이 존재하지 않는 경우', async () => {
        // given
        const userUid = 'dskajdkwjqijdiosajd';
        const roomUid = 'djksadjksandouwqpjdoiwqj';
        
        // when
        userRepository.findUserById.mockResolvedValue(new User());
        postRoomRepository.findRoomById(undefined);
        
        // then
        try {
          await postRoomService.participateUserInRoom(userUid, roomUid);
        } catch (err) {
          expect(err).toEqual(new NotFoundException('존재하지 않는 채팅방입니다.'));  
        }
      });

      it('실패 - 이미 채팅방에 유저가 존재하는 경우', async () => {
        // given
        const userUid = 'dskajdkwjqijdiosajd';
        const roomUid = 'djksadjksandouwqpjdoiwqj';
        
        const room = new PostRoom();
        room.post_room_uid = roomUid;
        room.current_head_count = 4;
        room.max_head_count = 4;

        // when
        userRepository.findUserById.mockResolvedValue(new User());
        postRoomRepository.findRoomById.mockResolvedValue(room);
        postRoomRepository.findRoomByUserIdAndRoomId.mockResolvedValue(room);
        
        // then
        try {
          await postRoomService.participateUserInRoom(userUid, roomUid);
        } catch (err) {
          expect(err).toEqual(new ConflictException('이미 채팅방에 존재하는 회원입니다.'));  
        }
      });

      it('실패 - 채팅방 인원이 꽉 찬 경우', async () => {
        // given
        const userUid = 'dskajdkwjqijdiosajd';
        const roomUid = 'djksadjksandouwqpjdoiwqj';
        
        const room = new PostRoom();
        room.post_room_uid = roomUid;
        room.current_head_count = 4;
        room.max_head_count = 4;
        
        // when
        userRepository.findUserById.mockResolvedValue(new User());
        postRoomRepository.findRoomById.mockResolvedValue(room);
        postRoomRepository.findRoomByUserIdAndRoomId.mockResolvedValue(room);
        
        // then
        try {
          await postRoomService.participateUserInRoom(userUid, roomUid);
        } catch (err) {
          expect(err).toEqual(new ConflictException('이미 채팅방에 존재하는 회원입니다.'));  
        }
      });

    it('실패 - UserRepository.relateRoomOfUser 트랜잭션 롤백 여부 확인', async () => {
      // given
      const userUid = 'dskajdkwjqijdiosajd';
      const roomUid = 'djksadjksandouwqpjdoiwqj';
      
      const room = new PostRoom();
      room.post_room_uid = roomUid;
      room.current_head_count = 3;
      room.max_head_count = 4;
      
      // when
      userRepository.findUserById.mockResolvedValue(new User());
      postRoomRepository.findRoomById.mockResolvedValue(room);
      postRoomRepository.findRoomByUserIdAndRoomId.mockResolvedValue(new PostRoom());
      
      jest
        .spyOn(entityManager, 'getCustomRepository')
        .mockImplementation(() => {
          return {
            updateCountOfRoom: async () => {}
          };
        });

      // then
      try {
        await postRoomService.participateUserInRoom(userUid, roomUid);
      } catch (err) {
        expect(err).toEqual(new ServerException('서버 오류로 채팅방 참여에 실패했습니다. 다시 시도해주세요'));
      }

      expect(connection.createQueryRunner().rollbackTransaction).toHaveBeenCalled();
      expect(connection.createQueryRunner().release).toHaveBeenCalled();
    });

    it('실패 - PostRoomRepository.updateCountOfRoom 트랜잭션 롤백 여부 확인', async () => {
        // given
        const userUid = 'dskajdkwjqijdiosajd';
        const roomUid = 'djksadjksandouwqpjdoiwqj';
        
        const room = new PostRoom();
        room.post_room_uid = roomUid;
        room.current_head_count = 3;
        room.max_head_count = 4;
        
        // when
        userRepository.findUserById.mockResolvedValue(new User());
        postRoomRepository.findRoomById.mockResolvedValue(room);
        postRoomRepository.findRoomByUserIdAndRoomId.mockResolvedValue(new PostRoom());
        
        jest
          .spyOn(entityManager, 'getCustomRepository')
          .mockImplementation(() => {
            return {
                relateRoomOfUser: async () => {}
            };
          });
  
        // then
        try {
          await postRoomService.participateUserInRoom(userUid, roomUid);
        } catch (err) {
          expect(err).toEqual(new ServerException('서버 오류로 채팅방 참여에 실패했습니다. 다시 시도해주세요'));
        }
  
        expect(connection.createQueryRunner().rollbackTransaction).toHaveBeenCalled();
        expect(connection.createQueryRunner().release).toHaveBeenCalled();
      });

    it('성공 - 트랜잭션 커밋 여부 확인', async () => {
      // given
      const userUid = 'dskajdkwjqijdiosajd';
      const roomUid = 'djksadjksandouwqpjdoiwqj';
      
      const room = new PostRoom();
      room.post_room_uid = roomUid;
      room.current_head_count = 3;
      room.max_head_count = 4;
      
      // when
      userRepository.findUserById.mockResolvedValue(new User());
      postRoomRepository.findRoomById.mockResolvedValue(room);
      postRoomRepository.findRoomByUserIdAndRoomId.mockResolvedValue(new PostRoom());
      
      jest
        .spyOn(entityManager, 'getCustomRepository')
        .mockImplementation(() => {
          return {
            relateRoomOfUser: async () => {},
            updateCountOfRoom: async () => {},
          };
        });

      // then
      try {
        await postRoomService.participateUserInRoom(userUid, roomUid);
      } catch (err) {  
        console.log(err);
      }

      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });
  });

  describe('deleteUserInRoom - 채팅방에서 유저 삭제', () => {
    it('실패 - DB에 유저가 존재하지 않는 경우', async () => {
        // given
        const userUid = 'dskajdkwjqijdiosajd';
        const roomUid = 'djksadjksandouwqpjdoiwqj';
        
        // when
        userRepository.findUserById.mockResolvedValue(undefined);
  
        // then
        try {
          await postRoomService.deleteUserInRoom(userUid, roomUid);
        } catch (err) {  
          expect(err).toEqual(new NotFoundException('존재하지 않는 회원입니다.'));
        }
    });
    
    it('실패 - DB에 채팅방이 존재하지 않는 경우', async () => {
        // given
        const userUid = 'dskajdkwjqijdiosajd';
        const roomUid = 'djksadjksandouwqpjdoiwqj';

        // when
        userRepository.findUserById.mockResolvedValue(new User());
        postRoomRepository.findRoomById.mockResolvedValue(undefined);

        // then
        try {
          await postRoomService.deleteUserInRoom(userUid, roomUid);
        } catch (err) {  
          expect(err).toEqual(new NotFoundException('존재하지 않는 채팅방입니다.'));
        }
    });

    it('실패 - PostRoomRepository.deleteUserOutOfRoom 트랜잭션 롤백 여부 확인', async () => {
        // given
        const userUid = 'dskajdkwjqijdiosajd';
        const roomUid = 'djksadjksandouwqpjdoiwqj';

        // when
        userRepository.findUserById.mockResolvedValue(new User());
        postRoomRepository.findRoomById.mockResolvedValue(new PostRoom());

        jest
          .spyOn(entityManager, 'getCustomRepository')
          .mockImplementation(() => {
            return {
              updateCountOfRoom: async () => {},
            };
          });     

        // then
        try {
          await postRoomService.deleteUserInRoom(userUid, roomUid);
        } catch (err) {  
          expect(err).toEqual(new ServerException('서버 오류로 채팅방에서 나가기에 실패했습니다.'));
        }

        expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
        expect(queryRunner.release).toHaveBeenCalled();
    });

    it('실패 - PostRoomRepository.updateCountOfRoom 트랜잭션 롤백 여부 확인', async () => {
        // given
        const userUid = 'dskajdkwjqijdiosajd';
        const roomUid = 'djksadjksandouwqpjdoiwqj';

        // when
        userRepository.findUserById.mockResolvedValue(new User());
        postRoomRepository.findRoomById.mockResolvedValue(new PostRoom());

        jest
          .spyOn(entityManager, 'getCustomRepository')
          .mockImplementation(() => {
            return {
              deleteUserOutOfRoom: async () => {},
            };
          });     

        // then
        try {
          await postRoomService.deleteUserInRoom(userUid, roomUid);
        } catch (err) {  
          expect(err).toEqual(new ServerException('서버 오류로 채팅방에서 나가기에 실패했습니다.'));
        }

        expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
        expect(queryRunner.release).toHaveBeenCalled();
    });

    it('성공 - 트랜잭션 커밋 여부 확인', async () => {
        // given
        const userUid = 'dskajdkwjqijdiosajd';
        const roomUid = 'djksadjksandouwqpjdoiwqj';

        // when
        userRepository.findUserById.mockResolvedValue(new User());
        postRoomRepository.findRoomById.mockResolvedValue(new PostRoom());

        jest
          .spyOn(entityManager, 'getCustomRepository')
          .mockImplementation(() => {
            return {
              deleteUserOutOfRoom: async () => {},
              updateCountOfRoom: async () => {},
            };
          });     

        // then
        try {
          await postRoomService.deleteUserInRoom(userUid, roomUid);
        } catch (err) {
        }

        expect(queryRunner.commitTransaction).toHaveBeenCalled();
        expect(queryRunner.release).toHaveBeenCalled();
    });
  });
});