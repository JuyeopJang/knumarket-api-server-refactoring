import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, ServerException, UnauthorizedException } from '../../common/exceptions/';
import crypto from 'crypto';
// import * as jwt from '../../lib/jwt.js';
// import { UserRepository } from './user.repo';
import { PostRepository } from '../post/post.repo';
import { ConflictException } from '../../common/exceptions/conflict.exception';
import { jwtSign } from '../../lib/jwt';
// import { getRefreshToken, setRefreshToken } from '../../lib/redis';
// import { redisClient } from '../../lib/database';
import { AddPostDto } from '../dto/AddPostDto';
import { Connection } from 'typeorm';
import { PostPaginationDto } from '../dto/PostPaginationDto';
import { UpdatePostDto } from '../dto/UpdatePostDto';
import { UserRepository } from '../user/user.repo';
import { Post } from '../../entity/Post';
import { max } from 'class-validator';
import { PostRoomRepository } from '../post_room/post-room.repo';
import { ImageRepository } from '../image/image.repo';
import { image } from 'faker';


export class PostService {

  postRepository: PostRepository;
  userRepository: UserRepository;
  postRoomRepository: PostRoomRepository;
  imageRepository: ImageRepository;
  connection: Connection;
    
  constructor(
    postRepository, 
    userRepository, 
    postRoomRepository, 
    imageRepository, 
    connection
  ) {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
    this.postRoomRepository = postRoomRepository;
    this.imageRepository = imageRepository;
    this.connection = connection;
  }

  async createPostAndRoom(addPostDto: AddPostDto) {
    const { title, description, location, max_head_count, images, userUid } = addPostDto;

    const queryRunner = this.connection.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const post = await queryRunner.manager.getCustomRepository(PostRepository).insertPost(title, description, location, max_head_count);
      const postId = post.identifiers[0].id;

      const roomUid = uuidv4();
      const room = await queryRunner.manager.getCustomRepository(PostRoomRepository).insertRoom(roomUid, title, max_head_count);

      if (images.length) {
        images.forEach(async image => {
          const imageUid = uuidv4();
          await queryRunner.manager.getCustomRepository(ImageRepository).insertImage(imageUid, image.key, image.url);
          await queryRunner.manager.getCustomRepository(PostRepository).relateImageOfPost(postId, imageUid);
        });
      }

      await queryRunner.manager.getCustomRepository(UserRepository).relatePostOfUser(userUid, postId); // 유저 글 일대다
      await queryRunner.manager.getCustomRepository(UserRepository).relateRoomOfUser(userUid, roomUid); // 유저 채팅방 다대다
      await queryRunner.manager.getCustomRepository(PostRepository).relateRoomOfPost(postId, roomUid); // 글 채팅방 일대일

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      
      throw new ServerException('서버 오류로 글 작성에 실패했습니다. 다시 시도해주세요');
    } finally {
      await queryRunner.release();
    }    
  }
  
  getPost = async (postUid: number) => {
    return await this.postRepository.getPostById(postUid);
  }

  convertPostHaveOneImage(posts: Post[]) {
    return posts.map(post => {
      if (!post.images.length) post.images = null;
      else post.images = post.images.slice(0, 1);
      return post;
    });
  }

  getPosts = async (lastId: number) => {
    const posts = await this.postRepository.getPosts(lastId);
    
    const convertedPosts = this.convertPostHaveOneImage(posts);
  
    return convertedPosts;
  }

  getMyPosts = async (lastId: number, userUid: string) => {
    const myPosts = await this.postRepository.getMyPosts(lastId, userUid); 
  
    const convertedPosts = this.convertPostHaveOneImage(myPosts);

    return convertedPosts;
  }

  // updatePost = async (updatePostDto: UpdatePostDto, postUid: number) => {
  //   return this.postRepository.updatePostById(updatePostDto, postUid);
  // }

  deletePost = async (post: Post) => {
    return this.postRepository.deletePostById(post);
  }

}