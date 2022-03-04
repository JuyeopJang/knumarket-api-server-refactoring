// import { Connection, getConnection, getCustomRepository } from 'typeorm';
// import ImageController from '../../api/image/image.con';
// import { ImageRepository } from '../../api/image/image.repo';
// import { ImageService } from '../../api/image/image.serv';
// import PostController from '../../api/post/post.con';
// import { PostRepository } from '../../api/post/post.repo';
// import { PostService } from '../../api/post/post.serv';
// import PostRoomController from '../../api/post_room/post-room.con';
// import { PostRoomRepository } from '../../api/post_room/post-room.repo';
// import { PostRoomService } from '../../api/post_room/post-room.serv';
// import UserController from '../../api/user/user.con';
// import { UserRepository } from '../../api/user/user.repo';
// import UserService from '../../api/user/user.serv';
// import App from '../../app';

// export function getServer(connection: Connection) {
//   const userRepository = connection.getCustomRepository(UserRepository);
//   const postRepository = connection.getCustomRepository(PostRepository);
//   const imageRepository = connection.getCustomRepository(ImageRepository);
//   const postRoomRepository = connection.getCustomRepository(PostRoomRepository);

//   const userService = new UserService(userRepository);
//   const postService = new PostService(postRepository, userRepository);
//   const imageService = new ImageService(imageRepository);
//   const postRoomService = new PostRoomService(postRoomRepository, userRepository);

//   const app = new App([
//     new UserController(userService),
//     new PostController(postService, imageService, postRoomService, userService),
//     new PostRoomController(postRoomService),
//     new ImageController(imageService)
//   ]);

//   return {
//     app: app.getServer(),
//     userRepository,
//     postRepository,
//     imageRepository,
//     postRoomRepository
//   }
// }

// export function expectResponseSucceed(res) {
//   const data = res.body;
//   expect(data.success).toBe(true);
//   expect(data.response).not.toBeNull();
//   expect(data.error).toBeNull();
// }

// export function expectResponseFailed(res) {
//   const data = res.body;
//   expect(data.success).toBe(false);
//   expect(data.response).toBeNull();
//   expect(data.error).not.toBeNull();
// }

// export function withHeadersBy(
//   headers,
//   options?,
// ) {
//   return function withHeaders(req) {
//     return setHeaders(req, headers, options);
//   };
// }

// export function getHeadersFrom(res, headers?){
//   const token = headers?.token;
//   return {
//     token
//   };
// }

// export async function fetchHeaders(req) {
//   const res = await req.get('/api').expect(200);

//   return getHeadersFrom(res);
// }

// export function setHeaders(req, headers, options) {
//     if (headers.token && !(typeof options.token !== 'undefined' && !options.token)) {
//       req.auth(headers.token, { type: 'bearer' });
//     }
//     return req;
// }

// export async function fetchUserTokenAndHeaders(
//   req,
//   raw = mockUserRaw(),
// ) {
//   try {
//     createUser(raw);
//   } catch {}

//   const headers = await fetchHeaders(req);
//   const withHeaders = withHeadersBy(headers);

//   const params = {
//     email: raw.email,
//     password: raw.password,
//   };

//   const res = await withHeaders(req.post('/api/users/login'))
//     .send(params)
//     .expect(200);

//   const token = res.body.token ?? res.body.response.token;
//   const headersWithToken = getHeadersFrom(res, {
//     ...headers,
//     token,
//   });
//   return headersWithToken;
// }

// export function updateCsrfToken(res, headers) {
//   headers.csrfToken = res.header[CSRF_TOKEN_HEADER];
// }

// export async function createDocument(
//   req,
//   headers,
// ) {
//   const params = mockCreateDocumentDto();
//   const res = await setHeaders(req.post('/api/documents'), headers)
//     .send(params)
//     .expect(200);

//   updateCsrfToken(res, headers);

//   return res.body.response.documentId
// }

// export async function publishDocument(
//   req,
//   headers,
//   documentId,
// ) {
//   const params = mockCreateDocumentDto();
//   const res = await setHeaders(
//     req.post(`/api/documents/${documentId}/publish`),
//     headers,
//   )
//     .send(params)
//     .expect(200);

//   updateCsrfToken(res, headers);

//   return res.body.response;
// }

// export async function fetchDocument(
//   req,
//   headers,
//   documentId,
// ) {
//   const res = await setHeaders(
//     req.get(`/api/documents/${documentId}`),
//     headers,
//   ).expect(200);

//   updateCsrfToken(res, headers);

//   const document = res.body.response.document;
//   expect(document).not.toBeUndefined();
//   return document;
// }