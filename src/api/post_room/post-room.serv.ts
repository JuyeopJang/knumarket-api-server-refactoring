import { NotFoundException } from "../../common/exceptions/not-found.exception";
import { AddPostRoomDto } from "../dto/AddPostRoomDto";
import { UserRepository } from "../user/user.repo";
import { PostRoomRepository } from "./post-room.repo";

export class PostRoomService {

    postRoomRepository: PostRoomRepository;
    userRepository: UserRepository;

    constructor(postRoomRepository, userRepository) {
        this.postRoomRepository = postRoomRepository;
        this.userRepository = userRepository;
    }

    getPostRoom = async (addPostRoomDto: AddPostRoomDto, userUid: string) => {
        const user = await this.userRepository.findOne(userUid);

        if (!user) {
            throw new NotFoundException('존재하지 않는 회원입니다.');
        }
    
        const postRoom = this.postRoomRepository.create();
        postRoom.title = addPostRoomDto.title;
        postRoom.max_head_count = addPostRoomDto.max_head_count;
        

        if (!postRoom) {
            throw new NotFoundException('존재하지 않는 채팅 방입니다.');
        }

        return await this.postRoomRepository.save(postRoom);
    }

    participateUserInRoom = async (userUid: string, roomUid: string) => {
        const user = await this.userRepository.findOne(userUid);

        if (!user) {
            throw new NotFoundException('존재하지 않는 회원입니다.');
        }

        const postRoom = await this.postRoomRepository.findOne(roomUid, {
            relations: ['users']
        });
    
        if (!postRoom) {
            throw new NotFoundException('존재하지 않는 채팅 방입니다.');
        }

        postRoom.users.push(user);

        await this.postRoomRepository.save(postRoom);
    }

    deleteUserInRoom = async (userUid: any, roomUid: string) => {
        const user = await this.userRepository.findOne(userUid);

        if (!user) {
            throw new NotFoundException('존재하지 않는 회원입니다.');
        }

        const postRoom = await this.postRoomRepository.findOne(roomUid, {
            relations: ['users']
        });
    
        if (!postRoom) {
            throw new NotFoundException('존재하지 않는 채팅 방입니다.');
        }

        postRoom.users = postRoom.users.filter((user) => {
            return user.user_uid !== userUid;
        });

        await this.postRoomRepository.save(postRoom);
    }

  async getMyRooms(userUid: string) {
    return await this.postRoomRepository.findPostRoomsByUserId(userUid);
  }
}