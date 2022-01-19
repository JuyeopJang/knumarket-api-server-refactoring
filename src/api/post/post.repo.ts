import { getRepository } from 'typeorm';
import { node_env } from '../../config';
import { Post } from '../../entity/Post';
import { connection } from '../../lib/database';
import { AddPostDto } from './dto/add.post.dto';

export class PostRepository {
    createPost = async (addPostDto: AddPostDto) => {
        const post = new Post();
    
        post.title = addPostDto.title;
        post.description = addPostDto.description;
        post.location = addPostDto.location;
        post.max_head_count = addPostDto.max_head_count;
        post.images = addPostDto.images;

        await getRepository(Post).save(post);
    }

    getPostById = async (postUid: string) => {
        return connection.manager.findOne(Post, postUid);
    }

    getPosts = async (skipValue: number) => {
        const posts = await getRepository(Post)
            .find({
                take: 20,
                skip: skipValue,
                order: {
                    created_at: 'DESC'
                },
                cache: 1000
            })

        return posts;
    }

    getMyPosts = async (skipValue: number, userUid: string) => {
        const myPosts = await getRepository(Post)
            .find({
                take: 20,
                skip: skipValue,
                order: {
                    created_at: 'DESC'
                },
                where: {
                    user: userUid
                }
            })

        return myPosts;
    }

    deletePostById = async (postUid: string) => {
        await getRepository(Post)
            .delete(postUid);
    }
}