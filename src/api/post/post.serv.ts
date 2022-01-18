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
import { AddPostDto } from './dto/add.post.dto';


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

}