import { initializeDatabase } from './lib/database';
import UserController from './api/user/user.con';
import UserService from './api/user/user.serv';
import { UserRepository } from './api/user/user.repo';
import PostController from './api/post/post.con';
import { PostService } from './api/post/post.serv';
import { PostRepository } from './api/post/post.repo';
import { ImageService } from './api/image/image.serv';
import { ImageRepository } from './api/image/image.repo';
import { PostRoomService } from './api/post_room/post-room.serv';
import { PostRoomRepository } from './api/post_room/post-room.repo';
import PostRoomController from './api/post_room/post-room.con';
import ImageController from './api/image/image.con';
import App from './app';
import { getConnection, getCustomRepository } from 'typeorm';
import { node_env } from './config';

export async function startServer() {
  await initializeDatabase();

  const connection = getConnection(node_env);

  const userRepository = getCustomRepository(UserRepository, node_env);
  const postRepository = getCustomRepository(PostRepository, node_env);
  const imageRepository = getCustomRepository(ImageRepository, node_env);
  const postRoomRepository = getCustomRepository(PostRoomRepository, node_env);

  const userService = new UserService(userRepository, postRoomRepository, connection);
  const imageService = new ImageService(imageRepository);
  const postService = new PostService(postRepository, userRepository, postRoomRepository, imageService, imageRepository, connection);
  const postRoomService = new PostRoomService(postRoomRepository, userRepository, connection);

  const app = new App([
    new UserController(userService),
    new PostController(postService, imageService, postRoomService, userService),
    new PostRoomController(postRoomService),
    new ImageController(imageService)
  ]);

  const server = app.listen();

  process.on('SIGINT', () => {
    app.setIsDisableKeepAlive(true);
    server.close(() => {
      console.log('server closed');
      process.exit(0);
    })
  });
  
  return app;
};

startServer();
