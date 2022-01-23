import { getManager, Transaction, TransactionManager } from "typeorm";
import { node_env } from "../../config";
import { AddPostRoomDto } from "../dto/AddPostRoomDto";
import { UserRepository } from "../user/user.repo";
import { PostRoomRepository } from "./post-room.repo";

export class PostRoomService {

    postRoomRepository: PostRoomRepository;
    userRepository: UserRepository;

    constructor(postRoomRepository: PostRoomRepository, userRepository: UserRepository) {
        this.postRoomRepository = postRoomRepository;
        this.userRepository = userRepository;
    }

    // @Transaction({ isolation: "READ COMMITTED" })
    getPostRoom = async (addPostRoomDto: AddPostRoomDto, userUid: string) => {
        const user = await this.userRepository.findOne(userUid);

        if (!user) {
        // 존재하지 않는 유저라고 에러 던짐
        // 로직이 진행되는 도중에 회원탈퇴 할 수도 있잖아?
        }
    
        const postRoom = this.postRoomRepository.create({
            ...addPostRoomDto,
            users: [user]
        });

        if (!postRoom) {
            // postRoom 없으면 에러
        }

        await this.postRoomRepository.save(postRoom);

        return postRoom;
    }

    participateUserInRoom = async (userUid: string, roomUid: string) => {
        const user = await this.userRepository.findOne(userUid);

        if (!user) {
            // 존재하지 않는 유저라고 에러 던짐
        }

        const postRoom = await this.postRoomRepository.findOne(roomUid);
    
        if (!postRoom) {
            // postRoom 없으면 에러
        }

        postRoom.users.push(user);

        await this.postRoomRepository.save(postRoom);
    }

    deleteUserInRoom = async (userUid: any, roomUid: string) => {
        const user = await this.userRepository.findOne(userUid);

        if (!user) {
            // 존재하지 않는 유저라고 에러 던짐
        }

        const postRoom = await this.postRoomRepository.findOne(roomUid);
    
        if (!postRoom) {
            // postRoom 없으면 에러
        }

        const indexOfUser = postRoom.users.indexOf(user);

        postRoom.users = [...postRoom.users.slice(0, indexOfUser), ...postRoom.users.slice(indexOfUser + 1)];

        await this.postRoomRepository.save(postRoom);
    }
}