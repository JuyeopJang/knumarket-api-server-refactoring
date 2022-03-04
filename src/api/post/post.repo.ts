import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { Post } from '../../entity/Post';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  insertPost(
      title: string,
      description: string,
      location: number,
      max_head_count: number,
  ) {
    return this.createQueryBuilder()
      .insert()
      .into(Post, ['title', 'description', 'location', 'max_head_count'])
      .values({ title, description, location, max_head_count })
      .execute();
  }

  getPosts(lastId: number) {
    return this.createQueryBuilder('p')
      .select(['p.id', 'p.title', 'p.created_at', 'i.url'])
      .leftJoin('p.images', 'i')
      .where('p.id < :lastId', { lastId })
      .orderBy('p.id', 'DESC')
      .limit(20)
      .getMany();
  }

  getPostsForFirstPage() {
    return this.createQueryBuilder('p')
      .select(['p.id', 'p.title', 'p.created_at', 'i.url'])
      .leftJoin('p.images', 'i')
      .orderBy('p.id', 'DESC')
      .limit(20)
      .getMany();
  }
  
  getMyPostsForFirstPage = async (userUid: string) => {
    return this.createQueryBuilder('p')
      .select(['p.id', 'p.title', 'p.created_at', 'i.url'])
      .leftJoin('p.images', 'i')
      .innerJoin('p.user', 'u')
      .andWhere('u.user_uid = :userUid', { userUid })
      .orderBy('p.id', 'DESC')
      .limit(20)
      .getMany(); 
  }

  getMyPosts = async (lastId: number, userUid: string) => {
    return this.createQueryBuilder('p')
      .select(['p.id', 'p.title', 'p.created_at', 'i.url'])
      .leftJoin('p.images', 'i')
      .innerJoin('p.user', 'u')
      .where('p.id < :lastId', { lastId })
      .andWhere('u.user_uid = :userUid', { userUid })
      .orderBy('p.id', 'DESC')
      .limit(20)
      .getMany(); 
  }

  getPostById(id: number) {
    return this.createQueryBuilder('p')
      .select(['p.id', 'p.title', 'p.description', 'p.max_head_count', 'p.location', 'p.created_at', 'i.url', 'i.key', 'r.post_room_uid', 'r.current_head_count'])
      .leftJoin('p.images', 'i')
      .innerJoin('p.post_room', 'r')
      .where('p.id = :id', { id })
      .getOne();
  }

  updatePostById(
    title: string,
    description: string,
    location: number,
    max_head_count: number,
    is_archived: boolean,
    id: number
  ) {
    return this.createQueryBuilder()
      .update(Post)
      .set({ title, description, location, max_head_count, is_archived })
      .where("id = :id", { id })
      .updateEntity(false)
      .execute();
  }

  deletePostById = async (post: Post) => {
    await this.remove(post);
  }

  relateRoomOfPost(postUid: number, roomUid: string) {
    return this.createQueryBuilder()
      .relation(Post, "post_room")
      .of(postUid)
      .set(roomUid);
  }

  deleteRoomOfPost(postUid: number) {
    return this.createQueryBuilder()
      .relation(Post, "post_room")
      .of(postUid)
      .set(null);
  }

  relateImageOfPost(postUid: number, imageUid: string) {
    return this.createQueryBuilder()
      .relation(Post, "images")
      .of(postUid)
      .add(imageUid);
  }
}