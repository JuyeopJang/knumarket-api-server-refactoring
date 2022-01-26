import { EntityRepository, FindManyOptions, getRepository, LessThan, MoreThan, Repository } from 'typeorm';
import { node_env } from '../../config';
import { Post } from '../../entity/Post';
import { connection } from '../../lib/database';
import { AddPostDto } from '../dto/AddPostDto';
import { PostPaginationDto } from '../dto/PostPaginationDto';
import { UpdatePostDto } from '../dto/UpdatePostDto';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {

    getPaginationOptions = (lastId: number, userUid: string) => {
        const paginationOptions: FindManyOptions<Post> = {
          select: ['id', 'title', 'images', 'created_at'],
          order: {
            id: 'DESC'
          },
          take: 20
        };
      
        if (lastId) {
            paginationOptions['id'] = LessThan(lastId);
        }

        if (userUid) {
            paginationOptions['where'] = {
                user: {
                    user_uid: userUid
                }
            };
        }

        return paginationOptions;
    }

    createPost = async (addPostDto: AddPostDto) => {
        const post = new Post();
    
        post.title = addPostDto.title;
        post.description = addPostDto.description;
        post.location = addPostDto.location;
        post.max_head_count = addPostDto.max_head_count;
        post.images = addPostDto.images;
        post.user = addPostDto.user;

        await getRepository(Post).save(post);
    }

    getPostById = async (postUid: string) => {
        return connection.manager.findOne(Post, postUid);
    }

    getPosts = async (lastId: number): Promise<PostPaginationDto[]> => {
        return await getRepository(Post).find(this.getPaginationOptions(lastId, ''));
    }

    getMyPosts = async (lastId: number, userUid: string) => {
        return await getRepository(Post).find(this.getPaginationOptions(lastId, userUid));
    }

    updatePostById = async (updatePostDto: UpdatePostDto, postId: number) => {
        const post = await this.findOne(postId);

        post.title = updatePostDto.title;
        post.description = updatePostDto.description;
        post.location = updatePostDto.location;
        post.max_head_count = updatePostDto.max_head_count;
        post.images = updatePostDto.images;
        post.is_archived = updatePostDto.isArchived;

        await this.save(post);
    }

    deletePostById = async (postUid: number) => {
        await this.delete(postUid);
    }
}