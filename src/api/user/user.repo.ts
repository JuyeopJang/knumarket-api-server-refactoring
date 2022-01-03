import { User } from '../../entity/User';
import { getConnection } from 'typeorm';
import { UserDao } from '../interfaces/dao/UserDao';

export class UserRepository {

    async create(user: UserDao) {
        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(User)
          .values(user)
          .execute();
    }

}