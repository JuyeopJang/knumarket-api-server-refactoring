import { User } from '../../entity/User';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  createUser(
    userUid: string,
    email: string,
    password: string,
    nickname: string
  ) {
    const user = this.create();

    user.user_uid = userUid;
    user.email = email;
    user.password = password;
    user.nickname = nickname;
    
    return user;
  }

  insertUser(user: User) {
    return this.createQueryBuilder()
      .insert()
      .into(User, ['user_uid', 'email', 'password', 'nickname'])
      .values(user)
      .updateEntity(false)
      .execute();
  }

  relatePostOfUser(userUid: string, postId: number) {
    return this.createQueryBuilder()
      .relation(User, "posts")
      .of(userUid)
      .add(postId);
  }

  relateRoomOfUser(userUid: string, roomId: string) {
    return this.createQueryBuilder()
      .relation(User, "post_rooms")
      .of(userUid)
      .add(roomId);
  }
    
  async countByEmail(email: string) {
    const { cnt } = await this.createQueryBuilder()
      .select("COUNT(user.user_uid)", "cnt")
      .where("user.email = :email", { email })
      .getRawOne();

    return cnt;
  }

    async findByEmail(email: string) {
      return this.findOne({
        where: {
          email: email
        }
      });
    }

  findUserByEmailAndPassword(email: string, password: string) {
    return this.findOne({
      select: ["user_uid"],
      where: {
        email,
        password
      }
    });
  }

  findUserById(userUid: string) {
    return this.findOne({
      select: ["email", "nickname", "is_verified"],
      where: {
        user_uid: userUid
      }
    });
  }

  updateNickname(nickname: string, userUid: string) {
    return this.createQueryBuilder()
      .update()
      .set({ nickname })
      .where("user_uid = :userUid", { userUid })
      .execute();
  }

  deleteUser(userUid: string) {
    return this.createQueryBuilder()
      .softDelete()
      .where("user_uid = :userUid", { userUid })
      .execute();
  }

  deletePostOfUser(userUid: string, postId: number) {
    return this.createQueryBuilder()
      .relation(User, "posts")
      .of(userUid)
      .remove(postId);   
  }
}