// import request from 'supertest';
// import { node_env } from '../../config';
// import { closeDatabase, initializeDatabase } from '../../lib/database';
// import { LoginFakeUser, SignUpFakeUser } from '../lib/fake-data';
// import { getServer, expectResponseFailed, expectResponseSucceed, withHeadersBy, fetchHeaders } from '../lib/helper';
// import { getConnection } from 'typeorm';
// import path from 'path';


// // 컨트롤러 유효성 검사
// // 응답 확인
// // 데이터베이스에 post, update, delete 데이터 쓰기 확인

// let req;

// beforeAll(async () => {
//   await initializeDatabase();

//   const connection = getConnection(node_env);
//   const testApp = getServer(connection);
  
//   req = request(testApp.app);
// });

// afterAll(async () => {
//   await closeDatabase();
// });

// describe('ImageController (e2e)', () => {
//   const signUpPath = '/api/users/sign-up';
//   const loginPath = '/api/users/login';
//   const rootApiPath = '/api/images';

//   let accessToken;
//   let key;

//   beforeAll(async () => {
//     const headers = await fetchHeaders(req);
//     const withHeaders = withHeadersBy(headers);
//     const params = new SignUpFakeUser();
//     // req, res
//     const signUpRes = await withHeaders(req.post(signUpPath)).send(params).expect(201);
//     expectResponseSucceed(signUpRes);

//     const mockUser = new LoginFakeUser();

//       // req, res
//     const loginRes = await withHeaders(req.post(loginPath)).send(mockUser).expect(200);
//     expectResponseSucceed(loginRes);
//     const result = loginRes.body.response;
    
//     expect(result).toHaveProperty('access_token');
//     expect(result).toHaveProperty('refresh_token');
    
//     accessToken = result['access_token'];
//   })
  
  describe('이미지 업로드: POST /api/images', () => {

    it('성공 - 생성 (201)', async () => {
        // const headers = await fetchHeaders(req);
        // const withHeaders = withHeadersBy(headers);
        // const res = await withHeaders(req.post(rootApiPath)).set('authorization', accessToken).attach('image', path.resolve(__dirname, './static/spring.png')).set('Content-Type', 'multipart/form-data').expect(201);
        // const result = res.body.response;
        // expectResponseSucceed(res);

        // expect(result).toHaveProperty('key');
        // expect(result).toHaveProperty('url');

        // key = result.key;
    });
  });

//     it('실패 - 토큰이 유효하지 않습니다. (401)', async () => {
//         // given
//         const headers = await fetchHeaders(req);
//         const withHeaders = withHeadersBy(headers);
  
//         const res = await withHeaders(req.post(rootApiPath)).set('authorization', 'dksaekjriwh.dasjdhjasd.dsakdaskjds').expect(401);
  
//         expect(res.body.error).toHaveProperty('status', 401);
//         expect(res.body.error).toHaveProperty('message', '토큰이 유효하지 않습니다. 리프레시 토큰을 보냈다면 다시 로그인 해주세요.');
//     });
      
//       it('실패 - 토큰이 존재하지 않습니다. (400)', async () => {
//         // given
//         const headers = await fetchHeaders(req);
//         const withHeaders = withHeadersBy(headers);
  
//         const res = await withHeaders(req.post(rootApiPath)).set('authorization', '').expect(400);
  
//         expect(res.body.error).toHaveProperty('status', 400);
//         expect(res.body.error).toHaveProperty('message', 'req header에 authorization이 존재하지 않습니다.');
//       });
//   });

//   describe('이미지 삭제: DELETE /api/images', () => {

//     it('성공 - 삭제 (200)', async () => {
//         const headers = await fetchHeaders(req);
//         const withHeaders = withHeadersBy(headers);
//         const res = await withHeaders(req.delete(rootApiPath)).set('authorization', accessToken).send({ key: key }).expect(200);
//         const result = res.body.response;
//         expectResponseSucceed(res);

//         expect(result).toBe('이미지가 성공적으로 삭제 되었습니다.');
//     });

//     it('실패 - 토큰이 유효하지 않습니다. (401)', async () => {
//       // given
//       const headers = await fetchHeaders(req);
//       const withHeaders = withHeadersBy(headers);

//       const res = await withHeaders(req.delete(rootApiPath)).set('authorization', 'dksaekjriwh.dasjdhjasd.dsakdaskjds').expect(401);

//       expect(res.body.error).toHaveProperty('status', 401);
//       expect(res.body.error).toHaveProperty('message', '토큰이 유효하지 않습니다. 리프레시 토큰을 보냈다면 다시 로그인 해주세요.');
//     });
    
//     it('실패 - 토큰이 존재하지 않습니다. (400)', async () => {
//       // given
//       const headers = await fetchHeaders(req);
//       const withHeaders = withHeadersBy(headers);

//       const res = await withHeaders(req.delete(rootApiPath)).set('authorization', '').expect(400);

//       expect(res.body.error).toHaveProperty('status', 400);
//       expect(res.body.error).toHaveProperty('message', 'req header에 authorization이 존재하지 않습니다.');
//     });
//   });
// });