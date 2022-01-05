import { User } from '../../entity/User';
import { getConnection } from 'typeorm';
import { UserDao } from '../interfaces/dao/UserDao';
import { node_env } from '../../config';

export class UserRepository {

    async create(user: UserDao) {
        return getConnection(node_env)
          .createQueryBuilder()
          .insert()
          .into(User)
          .values(user)
          .execute();
    }

}