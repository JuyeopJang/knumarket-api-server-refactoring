import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, UnauthorizedException } from '../../common/exceptions/';
import crypto from 'crypto';
// import * as jwt from '../../lib/jwt.js';
// import { UserRepository } from './user.repo';
import { PostRepository } from '../post/post.repo';
import { ConflictException } from '../../common/exceptions/conflict.exception';
import { jwtSign } from '../../lib/jwt';
// import { getRefreshToken, setRefreshToken } from '../../lib/redis';
// import { redisClient } from '../../lib/database';
import { AddPostDto } from '../dto/AddPostDto';
import { FindManyOptions } from 'typeorm';
import { PostPaginationDto } from '../dto/PostPaginationDto';
import { UpdatePostDto } from '../dto/UpdatePostDto';
import { UserRepository } from '../user/user.repo';
import { Post } from '../../entity/Post';


export class PostService {

  postRepository: PostRepository;
  userRepository: UserRepository;
    
  constructor(postRepository: PostRepository, userRepository: UserRepository) {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
  }

  addPost = async (addPostDto: AddPostDto) => {
    addPostDto.user.post_rooms.push(addPostDto.postRoom);
    await this.userRepository.save(addPostDto.user);

    return this.postRepository.createPost(addPostDto);
  }
  
  getPost = async (postUid: string) => {
    return this.postRepository.getPostById(postUid);
  }

  getPosts = async (lastId: number): Promise<PostPaginationDto[]> => {
    return await this.postRepository.getPosts(lastId);
  }

  getMyPosts = async (lastId: number, userUid: string) => {
    return await this.postRepository.getMyPosts(lastId, userUid); 
  }

  updatePost = async (updatePostDto: UpdatePostDto, postUid: number) => {
    return this.postRepository.updatePostById(updatePostDto, postUid);
  }

  deletePost = async (post: Post) => {
    return this.postRepository.deletePostById(post);
  }

}