import { getConnection } from 'typeorm';
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

        await connection.manager.save(post);
    }

    getPostById = async (postUid: string) => {
        return connection.manager.findOne(Post, postUid);
    }
}