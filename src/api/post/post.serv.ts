import { v4 as uuidv4 } from 'uuid';
import { ServerException } from '../../common/exceptions/';
import { PostRepository } from '../post/post.repo';
import { AddPostDto } from '../dto/AddPostDto';
import { Connection } from 'typeorm';
import { UserRepository } from '../user/user.repo';
import { Post } from '../../entity/Post';
import { PostRoomRepository } from '../post_room/post-room.repo';
import { ImageRepository } from '../image/image.repo';
import { ImageService } from '../image/image.serv';
import { NotFoundException } from '../../common/exceptions/not-found.exception';
import { UpdatePostDto } from '../dto/UpdatePostDto';

export class PostService {

  postRepository: PostRepository;
  userRepository: UserRepository;
  postRoomRepository: PostRoomRepository;
  imageService: ImageService;
  imageRepository: ImageRepository;
  connection: Connection;
    
  constructor(
    postRepository, 
    userRepository, 
    postRoomRepository,
    imageService, 
    imageRepository, 
    connection
  ) {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
    this.postRoomRepository = postRoomRepository;
    this.imageService = imageService;
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

  getPosts = async (lastId: number | null) => {
    let posts;
    
    if (!lastId) {
      posts = await this.postRepository.getPostsForFirstPage();
    } else {
      posts = await this.postRepository.getPosts(lastId);
    }
    
    const convertedPosts = this.convertPostHaveOneImage(posts);
  
    return convertedPosts;
  }

  getMyPosts = async (lastId: number | null, userUid: string) => {
    let myPosts;

    if (!myPosts) {
      myPosts = await this.postRepository.getMyPostsForFirstPage(userUid);
    } else {
      myPosts = await this.postRepository.getMyPosts(lastId, userUid);
    } 
  
    const convertedPosts = this.convertPostHaveOneImage(myPosts);

    return convertedPosts;
  }

  updatePost = async (updatePostDto: UpdatePostDto, postUid: number) => {
    const { title, description, location, max_head_count, isArchived } = updatePostDto;

    const post = this.postRepository.getPostById(postUid);

    if (!post) throw new NotFoundException('글이 존재하지 않습니다.');

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.getCustomRepository(PostRepository).updatePostById(
        title, 
        description, 
        location, 
        max_head_count, 
        isArchived, 
        postUid
      );      
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new ServerException('서버 오류로 글 수정에 실패했습니다. 다시 시도해주세요');
    } finally {
      await queryRunner.release();
    }
  }

  deletePost = async (userUid: string, postId: number) => {
    const post = await this.postRepository.getPostById(postId);

    if (!post) {
      throw new NotFoundException('글이 존재하지 않습니다.');
    }

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.getCustomRepository(PostRepository).deletePostById(post);      
      await this.imageService.deletImagesInS3(post.images);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new ServerException('서버 오류로 글 삭제에 실패했습니다. 다시 시도해주세요');
    } finally {
      await queryRunner.release();
    }
  }

}