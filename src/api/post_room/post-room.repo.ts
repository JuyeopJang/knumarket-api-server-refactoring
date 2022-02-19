import { EntityRepository, Repository } from "typeorm";
import { PostRoom } from "../../entity/PostRoom";
import { User } from "../../entity/User";

@EntityRepository(PostRoom)
export class PostRoomRepository extends Repository<PostRoom> {
  findPostRoomsByUserId(userUid: string) {
    return this.createQueryBuilder('room')
      .select(['room.post_room_uid', 'room.title'])
      .innerJoin(User, 'user')
      .where('user.user_uid = :userUid', { userUid })
      .getMany();
  }
}