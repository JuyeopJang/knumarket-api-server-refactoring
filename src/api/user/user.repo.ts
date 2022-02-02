import { User } from '../../entity/User';
import { EntityRepository, FindConditions, FindOneOptions, getConnection, ObjectID, Repository } from 'typeorm';
import { UserDao } from '../interfaces/dao/UserDao';
import { node_env } from '../../config';

@EntityRepository(User)
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

    async findByEmail(email: string) {
      return this.findOne({
        where: {
          email: email
        }
      });
    }

    createUser = async (user: UserDao) => {
      return await getConnection(node_env)
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(user)
        .execute();
    }

    selectUserByEmailAndPassword = async (email: string, password: string) => {
      return this.findOne({
        email,
        password
      });
    }
}