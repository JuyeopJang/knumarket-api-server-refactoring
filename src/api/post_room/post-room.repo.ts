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

  insertRoom(roomUid: string, title: string, maxHeadCount: number) {
    return this.createQueryBuilder()
      .insert()
      .into(PostRoom, ['post_room_uid', 'title', 'max_head_count'])
      .values({ 
        post_room_uid: roomUid, 
        title, 
        max_head_count: maxHeadCount 
      })
      .updateEntity(false)
      .execute();
  }
}