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

export async function startServer() {
  await initializeDatabase();

  const userRepository = new UserRepository();
  const userService = new UserService(userRepository);
  const postService = new PostService(new PostRepository());
  const imageService = new ImageService(new ImageRepository());
  const postRoomService = new PostRoomService(new PostRoomRepository(), userRepository);

  const app = new App([
    new UserController(userService),
    new PostController(postService, imageService, postRoomService, userService),
    new PostRoomController(postRoomService),
    new ImageController(imageService)
  ]);

  app.listen();
  return app;
};

startServer();
