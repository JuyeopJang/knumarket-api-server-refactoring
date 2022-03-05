import { EntityRepository, Repository } from "typeorm";
import { PostRoom } from "../../entity/PostRoom";

@EntityRepository(PostRoom)
export class PostRoomRepository extends Repository<PostRoom> {

  findRoomByUserIdAndRoomId(userUid: string, roomUid: string) {
    return this.createQueryBuilder('r')
      .select(['r.post_room_uid'])
      .innerJoin('r.users', 'u')
      .where('u.user_uid = :userUid', { userUid })
      .andWhere('r.post_room_uid = :roomUid', { roomUid })
      .getOne();
  }

  findPostRoomsByUserId(userUid: string) {
    return this.createQueryBuilder('r')
      .select(['r.post_room_uid', 'r.title', 'r.current_head_count'])
      .innerJoin('r.users', 'u')
      .where('u.user_uid = :userUid', { userUid })
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

  findRoomById(roomUid: string) {
    return this.findOne({
      select: ["post_room_uid", "max_head_count", "current_head_count"],
      where: {
        post_room_uid: roomUid
      }
    });
  }

  deleteUserOutOfRoom(roomUid: string, userUid: string) {
    return this.createQueryBuilder()
      .relation(PostRoom, "users")
      .of(roomUid)
      .remove(userUid);
  }

  updateCountOfRoom(roomUid: string, count: number) {
    return this.createQueryBuilder()
      .createQueryBuilder()
      .update(PostRoom)
      .set({ current_head_count: count })
      .where("post_room_uid = :roomUid", { roomUid })
      .updateEntity(false)
      .execute();
  }
}