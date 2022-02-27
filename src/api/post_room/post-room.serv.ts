import { Connection } from "typeorm";
import { ServerException } from "../../common/exceptions";
import { ConflictException } from "../../common/exceptions/conflict.exception";
import { NotFoundException } from "../../common/exceptions/not-found.exception";
import { AddPostRoomDto } from "../dto/AddPostRoomDto";
import { UserRepository } from "../user/user.repo";
import { PostRoomRepository } from "./post-room.repo";

export class PostRoomService {

    postRoomRepository: PostRoomRepository;
    userRepository: UserRepository;
    connection: Connection;

    constructor(postRoomRepository, userRepository, connection) {
        this.postRoomRepository = postRoomRepository;
        this.userRepository = userRepository;
        this.connection = connection;
    }

    participateUserInRoom = async (userUid: string, roomUid: string) => {

        const user = await this.userRepository.findUserById(userUid);

        if (!user) {
            throw new NotFoundException('존재하지 않는 회원입니다.');
        }

        const room = await this.postRoomRepository.findRoomById(roomUid);

        if (!room) {
            throw new NotFoundException('존재하지 않는 채팅방입니다.');
        }

        const { post_room_uid } = await this.postRoomRepository.findRoomByUserIdAndRoomId(userUid, roomUid);

        if (post_room_uid === roomUid) throw new ConflictException('이미 채팅방에 존재하는 회원입니다.');

        if (room.current_head_count >= room.max_head_count) {
            throw new ConflictException('인원이 꽉 차서 채팅방에 입장 불가합니다.');
        }

        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.getCustomRepository(UserRepository).relateRoomOfUser(userUid, roomUid);
            await queryRunner.manager.getCustomRepository(PostRoomRepository).updateCountOfRoom(roomUid, room.current_head_count + 1);

            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
      
            throw new ServerException('서버 오류로 채팅방 참여에 실패했습니다. 다시 시도해주세요');
        } finally {
            await queryRunner.release();
        }
    }

    deleteUserInRoom = async (userUid: string, roomUid: string) => {
        const user = await this.userRepository.findUserById(userUid);

        if (!user) {
            throw new NotFoundException('존재하지 않는 회원입니다.');
        }

        const room = await this.postRoomRepository.findRoomById(roomUid);

        if (!room) {
            throw new NotFoundException('존재하지 않는 채팅방입니다.');
        }

        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.getCustomRepository(PostRoomRepository).deleteUserOutOfRoom(roomUid, userUid);
            await queryRunner.manager.getCustomRepository(PostRoomRepository).updateCountOfRoom(roomUid, room.current_head_count - 1);

            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
      
            throw new ServerException('서버 오류로 채팅방에서 나가기에 실패했습니다.');
        } finally {
            await queryRunner.release();
        }
    }

  async getMyRooms(userUid: string) {
    return await this.postRoomRepository.findPostRoomsByUserId(userUid);
  }
}