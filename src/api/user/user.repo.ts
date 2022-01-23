import { User } from '../../entity/User';
import { FindConditions, FindOneOptions, getConnection, ObjectID, Repository } from 'typeorm';
import { UserDao } from '../interfaces/dao/UserDao';
import { node_env } from '../../config';

export class UserRepository extends Repository<User> {
    
  countByEmail = async (email: string) => {
    const { cnt } = await getConnection(node_env)
      .createQueryBuilder()
      .select("COUNT(user.user_uid) AS cnt")
      .from(User, "user")
      .where("user.email = :email", { email })
      .getRawOne()
    return cnt;
  }

    findByEmail = async (email: string) => {
      return getConnection(node_env)
        .getRepository(User)
        .findOne({ where: {
          email
        }});
    }

    createUser = async (user: UserDao) => {
      return getConnection(node_env)
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(user)
        .execute();
    }

    selectUserByEmailAndPassword = async (email: string, password: string) => {
      const user = await getConnection(node_env)
        .createQueryBuilder()
        .select("user.user_uid, user.email")
        .from(User, "user")
        .where("user.email = :email", { email })
        .andWhere("user.password = :password", { password })
        .getRawOne();

      return user;
    }

    updateNicknameByEmail = async (email: string, nickname: string) => {
      return getConnection(node_env)
        .createQueryBuilder()
        .update(User)
        .set({ nickname })
        .where("email = :email", { email })
        .execute();
    }

    deleteUserByEmail = async (email: string) => {
      return getConnection(node_env)
        .createQueryBuilder()
        .delete()
        .from(User)
        .where("email = :email", { email })
        .execute();
    }
}