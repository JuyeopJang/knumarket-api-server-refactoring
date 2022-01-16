import { User } from '../../entity/User';
import { getConnection } from 'typeorm';
import { UserDao } from '../interfaces/dao/UserDao';
import { node_env } from '../../config';

export class UserRepository {
    
    async countByEmail(email: string) {
        const { cnt } = await getConnection(node_env)
          .createQueryBuilder()
          .select("COUNT(user.user_uid) AS cnt")
          .from(User, "user")
          .where("user.email = :email", { email })
          .getRawOne();

        return cnt;
    }

    async findByEmail(email: string) {
      return getConnection(node_env)
        .getRepository(User)
        .findOne({ where: {
          email
        }});
    }

    async create(user: UserDao) {
        return getConnection(node_env)
          .createQueryBuilder()
          .insert()
          .into(User)
          .values(user)
          .execute();
    }

    async selectUserByEmailAndPassword(email: string, password: string) {
      const { cnt } = await getConnection(node_env)
        .createQueryBuilder()
        .select("COUNT(user.user_uid) AS cnt")
        .from(User, "user")
        .where("user.email = :email", { email })
        .andWhere("user.password = :password", { password })
        .getRawOne();

      return cnt;
    }

    async updateNicknameByEmail(email: string, nickname: string) {
      return getConnection(node_env)
        .createQueryBuilder()
        .update(User)
        .set({ nickname })
        .where("email = :email", { email })
        .execute();
    }

    
}