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

    async create(user: UserDao) {
        return getConnection(node_env)
          .createQueryBuilder()
          .insert()
          .into(User)
          .values(user)
          .execute();
    }

}