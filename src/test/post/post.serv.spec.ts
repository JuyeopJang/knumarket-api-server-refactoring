import { Connection, EntityManager, QueryRunner } from "typeorm"
import { UserRepository } from "../../api/user/user.repo"
import { mock, mockDeep } from "jest-mock-extended";
import { ServerException } from "../../common/exceptions";
import { NotFoundException } from "../../common/exceptions/not-found.exception";
import { PostRoomRepository } from "../../api/post_room/post-room.repo";
import { PostRepository } from "../../api/post/post.repo";
import { ImageRepository } from "../../api/image/image.repo";
import { ImageService } from "../../api/image/image.serv";
import { PostService } from "../../api/post/post.serv";
import { AddPostDto } from "../../api/dto/AddPostDto";
import { Image } from "../../entity/Image";
import { AddImageDto } from "../../api/dto/AddImageDto";
import { Post } from "../../entity/Post";
import { UpdatePostDto } from "../../api/dto/UpdatePostDto";

describe('PostService - post.serv.ts', () => {
  let postRepository= mock<PostRepository>();
  let userRepository = mock<UserRepository>();
  let postRoomRepository = mock<PostRoomRepository>();
  let imageRepository = mock<ImageRepository>();

  let connection = mockDeep<Connection>({
    createQueryRunner: () => queryRunner
  });
  let entityManager = mock<EntityManager>();
  let queryRunner = mock<QueryRunner>({
    manager: entityManager
  });

  let imageService = mock<ImageService>();
  let postService = new PostService(postRepository, userRepository, postRoomRepository, imageService, imageRepository, connection);
  
  describe('createPostAndRoom - 공동구매 글 생성, 채팅방 생성, 이미지 생성', () => {
    it('실패 - PostRepository.insertPost 트랜잭션 롤백 여부 확인', async () => {
      // given
      const addPostDto = new AddPostDto();
      addPostDto.title = '치킨 같이 시키실 분??';
      addPostDto.description = '쪽문 정문 근처에서 만나요.';
      addPostDto.location = 5;
      addPostDto.max_head_count = 2;

      const image = new AddImageDto();
      image.key = '219038092748';
      image.url = `dkasjdklasjkld.com/${image.key}`;

      addPostDto.images = [image];

      // when
      jest
        .spyOn(entityManager, 'getCustomRepository')
        .mockImplementation(() => {
          return {
            insertRoom: async () => {},
            insertImage: async () => {},
            relateImageOfPost: async () => {},
            relatePostOfUser: async () => {},
            relateRoomOfUser: async () => {},
            relateRoomOfPost: async () => {}
          };
        });

      try {
        await postService.createPostAndRoom(addPostDto);
      } catch (err) {
        expect(err).toEqual(new ServerException('서버 오류로 글 작성에 실패했습니다. 다시 시도해주세요'));
      }

      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('실패 - PostRoomRepository.insertRoom 트랜잭션 롤백 여부 확인', async () => {
      // given
      const addPostDto = new AddPostDto();
      addPostDto.title = '치킨 같이 시키실 분??';
      addPostDto.description = '쪽문 정문 근처에서 만나요.';
      addPostDto.location = 5;
      addPostDto.max_head_count = 2;

      const image = new AddImageDto();
      image.key = '219038092748';
      image.url = `dkasjdklasjkld.com/${image.key}`;

      addPostDto.images = [image];

      // when
      jest
        .spyOn(entityManager, 'getCustomRepository')
        .mockImplementation(() => {
          return {
            insertPost: async () => {
              return {
                identifiers: [
                  {
                    id: 1
                  }
                ]
              }
            },
            insertImage: async () => {},
            relateImageOfPost: async () => {},
            relatePostOfUser: async () => {},
            relateRoomOfUser: async () => {},
            relateRoomOfPost: async () => {}
          };
        });

      try {
        await postService.createPostAndRoom(addPostDto);
      } catch (err) {
        expect(err).toEqual(new ServerException('서버 오류로 글 작성에 실패했습니다. 다시 시도해주세요'));
      }

      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('실패 - ImageRepository.insertImage 트랜잭션 롤백 여부 확인', async () => {
      // given
      const addPostDto = new AddPostDto();
      addPostDto.title = '치킨 같이 시키실 분??';
      addPostDto.description = '쪽문 정문 근처에서 만나요.';
      addPostDto.location = 5;
      addPostDto.max_head_count = 2;

      const image = new AddImageDto();
      image.key = '219038092748';
      image.url = `dkasjdklasjkld.com/${image.key}`;

      addPostDto.images = [image];

      // when
      jest
        .spyOn(entityManager, 'getCustomRepository')
        .mockImplementation(() => {
          return {
            insertPost: async () => {
              return {
                identifiers: [
                  {
                    id: 1
                  }
                ]
              }
            },
            insertRoom: async () => {},
            relateImageOfPost: async () => {},
            relatePostOfUser: async () => {},
            relateRoomOfUser: async () => {},
            relateRoomOfPost: async () => {}
          };
        });

      try {
        await postService.createPostAndRoom(addPostDto);
      } catch (err) {
        expect(err).toEqual(new ServerException('서버 오류로 글 작성에 실패했습니다. 다시 시도해주세요'));
      }

      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('실패 - PostRepository.relateImageOfPost 트랜잭션 롤백 여부 확인', async () => {
      // given
      const addPostDto = new AddPostDto();
      addPostDto.title = '치킨 같이 시키실 분??';
      addPostDto.description = '쪽문 정문 근처에서 만나요.';
      addPostDto.location = 5;
      addPostDto.max_head_count = 2;

      const image = new AddImageDto();
      image.key = '219038092748';
      image.url = `dkasjdklasjkld.com/${image.key}`;

      addPostDto.images = [image];

      // when
      jest
        .spyOn(entityManager, 'getCustomRepository')
        .mockImplementation(() => {
          return {
            insertPost: async () => {
              return {
                identifiers: [
                  {
                    id: 1
                  }
                ]
              }
            },
            insertRoom: async () => {},
            insertImage: async () => {},
            relatePostOfUser: async () => {},
            relateRoomOfUser: async () => {},
            relateRoomOfPost: async () => {}
          };
        });

      try {
        await postService.createPostAndRoom(addPostDto);
      } catch (err) {
        expect(err).toEqual(new ServerException('서버 오류로 글 작성에 실패했습니다. 다시 시도해주세요'));
      }

      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('실패 - UserRepository.relatePostOfUser 트랜잭션 롤백 여부 확인', async () => {
      // given
      const addPostDto = new AddPostDto();
      addPostDto.title = '치킨 같이 시키실 분??';
      addPostDto.description = '쪽문 정문 근처에서 만나요.';
      addPostDto.location = 5;
      addPostDto.max_head_count = 2;

      const image = new AddImageDto();
      image.key = '219038092748';
      image.url = `dkasjdklasjkld.com/${image.key}`;

      addPostDto.images = [image];

      // when
      jest
        .spyOn(entityManager, 'getCustomRepository')
        .mockImplementation(() => {
          return {
            insertPost: async () => {
              return {
                identifiers: [
                  {
                    id: 1
                  }
                ]
              }
            },
            insertRoom: async () => {},
            insertImage: async () => {},
            relateImageOfPost: async () => {},
            relateRoomOfUser: async () => {},
            relateRoomOfPost: async () => {}
          };
        });

      try {
        await postService.createPostAndRoom(addPostDto);
      } catch (err) {
        expect(err).toEqual(new ServerException('서버 오류로 글 작성에 실패했습니다. 다시 시도해주세요'));
      }

      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('실패 - UserRepository.relateRoomOfUser 트랜잭션 롤백 여부 확인', async () => {
      // given
      const addPostDto = new AddPostDto();
      addPostDto.title = '치킨 같이 시키실 분??';
      addPostDto.description = '쪽문 정문 근처에서 만나요.';
      addPostDto.location = 5;
      addPostDto.max_head_count = 2;

      const image = new AddImageDto();
      image.key = '219038092748';
      image.url = `dkasjdklasjkld.com/${image.key}`;

      addPostDto.images = [image];

      // when
      jest
        .spyOn(entityManager, 'getCustomRepository')
        .mockImplementation(() => {
          return {
            insertPost: async () => {
              return {
                identifiers: [
                  {
                    id: 1
                  }
                ]
              }
            },
            insertRoom: async () => {},
            insertImage: async () => {},
            relateImageOfPost: async () => {},
            relatePostOfUser: async () => {},
            relateRoomOfPost: async () => {}
          };
        });

      try {
        await postService.createPostAndRoom(addPostDto);
      } catch (err) {
        expect(err).toEqual(new ServerException('서버 오류로 글 작성에 실패했습니다. 다시 시도해주세요'));
      }

      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('실패 - PostRepository.relateRoomOfPost 트랜잭션 롤백 여부 확인', async () => {
      // given
      const addPostDto = new AddPostDto();
      addPostDto.title = '치킨 같이 시키실 분??';
      addPostDto.description = '쪽문 정문 근처에서 만나요.';
      addPostDto.location = 5;
      addPostDto.max_head_count = 2;

      const image = new AddImageDto();
      image.key = '219038092748';
      image.url = `dkasjdklasjkld.com/${image.key}`;

      addPostDto.images = [image];

      // when
      jest
        .spyOn(entityManager, 'getCustomRepository')
        .mockImplementation(() => {
          return {
            insertPost: async () => {
              return {
                identifiers: [
                  {
                    id: 1
                  }
                ]
              }
            },
            insertRoom: async () => {},
            insertImage: async () => {},
            relateImageOfPost: async () => {},
            relatePostOfUser: async () => {},
            relateRoomOfUser: async () => {}
          };
        });

      try {
        await postService.createPostAndRoom(addPostDto);
      } catch (err) {
        expect(err).toEqual(new ServerException('서버 오류로 글 작성에 실패했습니다. 다시 시도해주세요'));
      }
      
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('성공 - 트랜잭션 커밋 여부 확인', async () => {
      // given
      const addPostDto = new AddPostDto();
      addPostDto.title = '치킨 같이 시키실 분??';
      addPostDto.description = '쪽문 정문 근처에서 만나요.';
      addPostDto.location = 5;
      addPostDto.max_head_count = 2;
      
      const image = new AddImageDto();
      image.key = '219038092748';
      image.url = `dkasjdklasjkld.com/${image.key}`;

      addPostDto.images = [image];
      
      // when
      jest
        .spyOn(entityManager, 'getCustomRepository')
        .mockImplementation(() => {
          return {
            insertPost: async () => {
              return {
                identifiers: [
                  {
                    id: 1
                  }
                ]
              }
            },
            insertRoom: async () => {},
            insertImage: async () => {},
            relateImageOfPost: async () => {},
            relatePostOfUser: async () => {},
            relateRoomOfUser: async () => {},
            relateRoomOfPost: async () => {},
          };
        });
      
      try {
        await postService.createPostAndRoom(addPostDto);
      } catch (err) {
        expect(err).toEqual(new ServerException('서버 오류로 글 작성에 실패했습니다. 다시 시도해주세요'));
      }
      
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });
  });

  describe('convertPostHaveOneImage - 글이 가진 이미지가 여러 개인 경우 하나만 가지도록 변환', () => {
    it('성공 - 글과 관계된 이미지가 2개 이상인 글은 모두 첫 번째 이미지만 반환하도록 한다.', async () => {
      // given
      let posts: Post[];
      const post1 = new Post();
      post1.images = [new Image(), new Image()];
      posts = [post1];

      // when
      const result = postService.convertPostHaveOneImage(posts);

      // then
      expect(result[0].images.length).toBe(1);
    });
  });

  describe('getPosts - 공동구매 글 조회', () => {
    it('성공 - lastId가 null인 경우 첫 번째 페이지의 글 조회', async () => {
      // given
      const lastId = null;

      // when
      postRepository.getPostsForFirstPage.mockResolvedValue([]);
      await postService.getPosts(lastId);

      // then
      expect(postRepository.getPostsForFirstPage).toHaveBeenCalled();
    });

    it('성공 - lastId가 number인 경우 lastId보다 작은 수부터 20개 조회', async () => {
        const lastId = 22;

        // when
        postRepository.getPosts.mockResolvedValue([]);
        await postService.getPosts(lastId);
  
        // then
        expect(postRepository.getPosts).toHaveBeenCalled();
    });
  });

  describe('getMyPosts - 내가 쓴 글 조회', () => {
    it('성공 - lastId가 null인 경우 첫 번째 페이지의 글 조회', async () => {
       // given
      const lastId = null;
      const userUid = 'dakjdlkjasioejw';

      // when
      postRepository.getMyPostsForFirstPage.mockResolvedValue([]);
      await postService.getMyPosts(lastId, userUid);

      // then
      expect(postRepository.getMyPostsForFirstPage).toHaveBeenCalled();
    });

    it('성공 - lastId가 number인 경우 lastId보다 작은 수부터 20개 조회', async () => {
       // given
      const lastId = 43;
      const userUid = 'dakjdlkjasioejw';

      // when
      postRepository.getMyPosts.mockResolvedValue([]);
      await postService.getMyPosts(lastId, userUid);
      
      // then
      expect(postRepository.getMyPosts).toHaveBeenCalled();
    });
  });

  describe('updatePost - 글과 관련된 내용 수정', () => {
    it('실패 - DB에 글이 존재하지 않는 경우', async () => {
      // given
      const updatePostDto = new UpdatePostDto();
      updatePostDto.title = '치킨 같이 시키실 분?';
      updatePostDto.description = '쪽문이나 정문에서 만나요';
      updatePostDto.location = 4;
      updatePostDto.max_head_count = 2;
      updatePostDto.isArchived = false;

      const postUid = 2;

      // when
      postRepository.getPostById.mockResolvedValue(undefined);
      
      try {
        await postService.updatePost(updatePostDto, postUid);
      } catch (err) {
        expect(err).toEqual(new NotFoundException('글이 존재하지 않습니다.'));
      }
    });

    it('실패 - PostRepository.updatePostById 트랜잭션 롤백 여부 확인', async () => {
       // given
      const updatePostDto = new UpdatePostDto();
      updatePostDto.title = '치킨 같이 시키실 분?';
      updatePostDto.description = '쪽문이나 정문에서 만나요';
      updatePostDto.location = 4;
      updatePostDto.max_head_count = 2;
      updatePostDto.isArchived = false;

      const postUid = 2;

      // when
      postRepository.getPostById.mockResolvedValue(new Post());
      
      try {
        await postService.updatePost(updatePostDto, postUid);
      } catch (err) {
        expect(err).toEqual(new ServerException('서버 오류로 글 수정에 실패했습니다. 다시 시도해주세요'));
      }

      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('성공 - 트랜잭션 커밋 여부 확인', async () => {
      // given
      const updatePostDto = new UpdatePostDto();
      updatePostDto.title = '치킨 같이 시키실 분?';
      updatePostDto.description = '쪽문이나 정문에서 만나요';
      updatePostDto.location = 4;
      updatePostDto.max_head_count = 2;
      updatePostDto.isArchived = false;
 
      const postUid = 2;
 
      // when
      postRepository.getPostById.mockResolvedValue(new Post());
 
      jest
        .spyOn(entityManager, 'getCustomRepository')
        .mockImplementation(() => {
          return {
            updatePostById: async () => {}
          };
        });
 
      try {
        await postService.updatePost(updatePostDto, postUid);
      } catch (err) {
      }

      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });
  });

  describe('deletePost - 글 삭제', () => {
    it('실패 - DB에 글이 존재하지 않는 경우', async () => {
      // given
      const userUid = 'djklsajdasjdiwjqidj'; 
      const postUid = 2;

      // when
      postRepository.getPostById.mockResolvedValue(undefined);
      
      try {
        await postService.deletePost(userUid, postUid);
      } catch (err) {
        expect(err).toEqual(new NotFoundException('글이 존재하지 않습니다.'));
      }
    });

    it('실패 - PostRepository.deletePostById 트랜잭션 롤백 여부 확인', async () => {
      // given
      const userUid = 'djklsajdasjdiwjqidj'; 
      const postUid = 2;

      // when
      postRepository.getPostById.mockResolvedValue(new Post());

      try {
        await postService.deletePost(userUid, postUid);
      } catch (err) {
        expect(err).toEqual(new ServerException('서버 오류로 글 삭제에 실패했습니다. 다시 시도해주세요'));
      }

      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('실패 - imageService.deletImagesInS3 트랜잭션 롤백 여부 확인', async () => {
      // given
      const userUid = 'djklsajdasjdiwjqidj'; 
      const postUid = 2;

      // when
      postRepository.getPostById.mockResolvedValue(new Post());
      jest
        .spyOn(entityManager, 'getCustomRepository')
        .mockImplementation(() => {
          return {
            deletePostById: async () => {}
          };
        });

      try {
        await postService.deletePost(userUid, postUid);
      } catch (err) {
        expect(err).toEqual(new ServerException('서버 오류로 글 삭제에 실패했습니다. 다시 시도해주세요'));
      }

      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('성공 - 트랜잭션 커밋 여부 확인', async () => {
      // given
      const userUid = 'djklsajdasjdiwjqidj'; 
      const postUid = 2;

      // when
      postRepository.getPostById.mockResolvedValue(new Post());
      jest
        .spyOn(entityManager, 'getCustomRepository')
        .mockImplementation(() => {
          return {
            deletePostById: async () => {}
          };
        });
      imageService.deletImagesInS3.mockResolvedValue();
      
      try {
        await postService.deletePost(userUid, postUid);
      } catch (err) {
        expect(err).toEqual(new NotFoundException('글이 존재하지 않습니다.'));
      }

      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });
  });
});