import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, UnauthorizedException } from '../../common/exceptions/';
import crypto from 'crypto';
// import * as jwt from '../../lib/jwt.js';
// import { UserRepository } from './user.repo';
import { PostRepository } from '../post/post.repo';
import { ConflictException } from '../../common/exceptions/conflict.exception';
import { jwtSign } from '../../lib/jwt';
import { getRefreshToken, setRefreshToken } from '../../lib/redis';
import { redisClient } from '../../lib/database';
import { AddPostDto } from '../dto/AddPostDto';
import { FindManyOptions } from 'typeorm';
import { PostPaginationDto } from '../dto/PostPaginationDto';
import { UpdatePostDto } from '../dto/UpdatePostDto';


export class PostService {

  postRepository: PostRepository;
    
  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  addPost = async (addPostDto: AddPostDto) => {
    return this.postRepository.createPost(addPostDto);
  }
  
  getPost = async (postUid: string) => {
    return this.postRepository.getPostById(postUid);
  }

  getPosts = async (lastId: number): Promise<PostPaginationDto[]> => {
    return await this.postRepository.getPosts(lastId);
  }

  getMyPosts = async (startPage: number, userUid: string) => {
    const skipValue = (startPage - 1) * 20;
    
    return this.postRepository.getMyPosts(skipValue, userUid); 
  }

  updatePost = async (updatePostDto: UpdatePostDto, postUid: number) => {
    return this.postRepository.updatePostById(updatePostDto, postUid);
  }

  deletePost = async (postUid: number) => {
    
    return this.postRepository.deletePostById(postUid);
  }

}