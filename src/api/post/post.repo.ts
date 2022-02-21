import { EntityRepository, FindManyOptions, getRepository, LessThan, MoreThan, Repository } from 'typeorm';
import { node_env } from '../../config';
import { Image } from '../../entity/Image';
import { Post } from '../../entity/Post';
import { User } from '../../entity/User';
import { connection } from '../../lib/database';
import { AddPostDto } from '../dto/AddPostDto';
import { PostPaginationDto } from '../dto/PostPaginationDto';
import { UpdatePostDto } from '../dto/UpdatePostDto';

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
      .where('p.id > :id', { id: lastId })
      .limit(20)
      .orderBy('p.id', 'DESC')
      .getMany();
  }

  getMyPosts = async (lastId: number, userUid: string) => {
    return this.createQueryBuilder('p')
      .select(['p.id', 'p.title', 'p.created_at', 'i.url'])
      .leftJoin('p.images', 'i')
      .innerJoin('p.user', 'u')
      .where('p.id > :id', { id: lastId })
      .andWhere('u.user_uid = :userUid', { userUid })
      .limit(20)
      .orderBy('p.id', 'DESC')
      .getMany(); 
  }

  getPostById = async (id: number) => {
    return this.createQueryBuilder('p')
      .select(['p.id', 'p.title', 'p.description', 'p.max_head_count', 'p.location', 'p.created_at', 'i.url', 'r.post_room_uid', 'r.current_head_count'])
      .leftJoin('p.images', 'i')
      .innerJoin('p.post_room', 'r')
      .where('p.id = :id', { id })
      .getOne();
  }

    // updatePostById = async (updatePostDto: UpdatePostDto, postId: number) => {
    //     const post = await this.findOne(postId);

    //     post.title = updatePostDto.title;
    //     post.description = updatePostDto.description;
    //     post.location = updatePostDto.location;
    //     post.max_head_count = updatePostDto.max_head_count;
    //     post.images = updatePostDto.images;
    //     post.is_archived = updatePostDto.isArchived;

    //     await this.save(post);
    // }

  deletePostById = async (post: Post) => {
    await this.remove(post);
  }

  relateRoomOfPost(postUid: number, roomUid: string) {
    return this.createQueryBuilder()
      .relation(Post, "post_room")
      .of(postUid)
      .set(roomUid);
  }

  relateImageOfPost(postUid: number, imageUid: string) {
    return this.createQueryBuilder()
      .relation(Post, "images")
      .of(postUid)
      .add(imageUid);
  }
}