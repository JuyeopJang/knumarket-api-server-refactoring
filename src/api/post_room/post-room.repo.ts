import { EntityRepository, Repository } from "typeorm";
import { PostRoom } from "../../entity/PostRoom";
import { User } from "../../entity/User";
import { AddPostRoomDto } from "../dto/AddPostRoomDto";

@EntityRepository(PostRoom)
export class PostRoomRepository extends Repository<PostRoom> {
    
}