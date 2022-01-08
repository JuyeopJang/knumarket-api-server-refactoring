import request from 'supertest';
import { UserRepository } from '../../api/user/user.repo';
import UserService from '../../api/user/user.serv';
import { closeDatabase, initializeDatabase } from '../../lib/database';
import { getMockUser, getWrongNicknameUser, getWrongPasswordUser } from '../lib/fake-data';
import { getServer, expectResponseFailed, expectResponseSucceed, withHeadersBy, fetchHeaders } from '../lib/helper';

beforeAll(async () => {
  await initializeDatabase();
})

afterAll(async () => {
  await closeDatabase();
})

describe('UserController (e2e)', () => {
  const app = getServer();
  const req = request(app);
  const userRepository = new UserRepository();

  const rootApiPath = '/api/users';

  describe('회원가입: POST /api/users/signup', () => {
    const apiPath = `${rootApiPath}/sign-up`;

    it('성공 - 가입 (201)', async () => {
      // given
      const headers = await fetchHeaders(req);
      const withHeaders = withHeadersBy(headers);

      const params = getMockUser();

      // when
      const res = await withHeaders(req.post(apiPath)).send(params).expect(201);

      // then
      expectResponseSucceed(res);

      const user = await userRepository.findByEmail(params.email);
      expect(user).not.toBeUndefined();
      expect(user.nickname).toEqual(params.nickname);
    });

    it('실패 - 이미 가입된 이메일 입니다. (409)', async () => {
      // given
      const headers = await fetchHeaders(req);
      const withHeaders = withHeadersBy(headers);

      const mockUser = getMockUser();
      
      const res = await withHeaders(req.post(apiPath))
        .send(mockUser).expect(409);

      expectResponseFailed(res);
    });

    it('실패 - 비밀번호는 6글자 이상 20자 이하 입니다. (400)', async () => {
      // given
      const headers = await fetchHeaders(req);
      const withHeaders = withHeadersBy(headers);

      const wrongPasswordUser = getWrongPasswordUser('123438219748921738');
      
      // when
      const res = await withHeaders(req.post(apiPath))
        .send(wrongPasswordUser)
        .expect(400);

      // then
      expectResponseFailed(res);
    });

    it('실패 - 닉네임은 2글자 이상 10자 이하 입니다. (400)', async () => {
      // given
      const headers = await fetchHeaders(req);
      const withHeaders = withHeadersBy(headers);

      const wrongNicknameUser = getWrongNicknameUser('L');
      
      // when
      const res = await withHeaders(req.post(apiPath))
        .send(wrongNicknameUser)
        .expect(400);

      // then
      expectResponseFailed(res);
    });

    it('실패 - 이메일 형식에 맞지 않습니다. (400)', async () => {
      // given
      const headers = await fetchHeaders(req);
      const withHeaders = withHeadersBy(headers);

      const wrongEmailUser = getWrongPasswordUser('hi@');
      
      // when
      const res = await withHeaders(req.post(apiPath))
        .send(wrongEmailUser)
        .expect(400);

      // then
      expectResponseFailed(res);
    });
  });

  // describe('로그인: POST /api/users/login', () => {
  //   const apiPath = `${rootApiPath}/login`;

  //   it('성공 - 로그인 (200)', async () => {
  //     // given
  //     const headers = await fetchHeaders(req);
  //     const withHeaders = withHeadersBy(headers);

  //     const userRaw = mockUserRaw();
  //     createUser(userRaw);

  //     const params = {
  //       email: userRaw.email,
  //       password: userRaw.password,
  //     };

  //     // when
  //     const res = await withHeaders(req.post(apiPath)).send(params).expect(200);

  //     // then
  //     expectResponseSucceed(res);

  //     const result = res.body.response;
  //     expect(result.token).toBeTruthy();

  //     const decoded = verify(result.token);
  //     expect(decoded).toHaveProperty('user_id', userRaw.id);
  //     expect(decoded).toHaveProperty('email', userRaw.email);

  //     expect(result.user).toEqual(User.fromJson(userRaw).toJson());
  //   });

  //   it('실패 - 이메일은 필수입니다. (400)', async () => {
  //     // given
  //     const headers = await fetchHeaders(req);
  //     const withHeaders = withHeadersBy(headers);

  //     // when
  //     const res = await withHeaders(req.post(apiPath)).expect(400);

  //     // then
  //     expectResponseFailed(res);
  //   });

  //   it('실패 - 비밀번호는 최소 8글자 입니다. (400)', async () => {
  //     // given
  //     const headers = await fetchHeaders(req);
  //     const withHeaders = withHeadersBy(headers);
  //     const userRaw = mockUserRaw();

  //     const params = {
  //       email: userRaw.email,
  //       password: 'passwd',
  //     };

  //     // when
  //     const res = await withHeaders(req.post(apiPath)).send(params).expect(400);

  //     // then
  //     expectResponseFailed(res);
  //   });

  //   it('실패 - 인증이 필요합니다. (401) #중복 로그인', async () => {
  //     // given
  //     const userRaw = mockUserRaw();
  //     const headers = await fetchUserTokenAndHeaders(req, userRaw);
  //     const withHeaders = withHeadersBy(headers);

  //     await fetchUserTokenAndHeaders(req, userRaw);

  //     // when
  //     const res = await withHeaders(req.get(`${rootApiPath}/me`)).expect(401);

  //     // then
  //     expectResponseFailed(res);
  //   });
  // });

  // describe('내 정보 조회: GET /api/users/me', () => {
  //   const apiPath = `${rootApiPath}/me`;

  //   it('성공 - 내 정보 조회 (200)', async () => {
  //     // given
  //     const userRaw = mockUserRaw();
  //     const headers = await fetchUserTokenAndHeaders(req, userRaw);
  //     const withHeaders = withHeadersBy(headers);

  //     // when
  //     const res = await withHeaders(req.get(apiPath)).expect(200);

  //     // then
  //     expectResponseSucceed(res);

  //     const result = res.body.response;

  //     expect(result.user).toEqual(User.fromJson(userRaw).toJson());
  //   });

  //   it('실패 - 인증이 필요합니다. (401)', async () => {
  //     // given
  //     const headers = await fetchUserTokenAndHeaders(req);
  //     const withHeaders = withHeadersBy(headers, { token: false });

  //     // when
  //     const res = await withHeaders(req.get(apiPath)).expect(401);

  //     // then
  //     expectResponseFailed(res);
  //   });

  //   it('실패 - 인증이 필요합니다. (401) #쿠키 없이 요청', async () => {
  //     // given
  //     const headers = await fetchUserTokenAndHeaders(req);
  //     const withHeaders = withHeadersBy(headers, { cookie: false });

  //     // when
  //     const res = await withHeaders(req.get(apiPath)).expect(401);

  //     // then
  //     expectResponseFailed(res);
  //   });

  //   it('실패 - 인증 정보와 세션 정보가 다릅니다. (403)', async () => {
  //     // given
  //     const headers1 = await fetchUserTokenAndHeaders(req);
  //     const headers2 = await fetchUserTokenAndHeaders(req);
  //     headers1.cookie = headers2.cookie;
  //     const withHeaders = withHeadersBy(headers1);

  //     // when
  //     const res = await withHeaders(req.get(apiPath)).expect(403);

  //     // then
  //     expectResponseFailed(res);
  //   });

  //   it('실패 - CSRF 토큰이 유효하지 않습니다. (403) #empty header', async () => {
  //     // given
  //     const headers = await fetchUserTokenAndHeaders(req);
  //     const withHeaders = withHeadersBy(headers, { csrfToken: false });

  //     // when
  //     const res = await withHeaders(req.get(apiPath)).expect(403);

  //     // then
  //     expectResponseFailed(res);
  //   });

  //   it('실패 - CSRF 토큰이 유효하지 않습니다. (403) #invalid csrf token', async () => {
  //     // given
  //     const headers = await fetchUserTokenAndHeaders(req);
  //     headers.csrfToken = 'invalid csrf token';

  //     const withHeaders = withHeadersBy(headers);

  //     // when
  //     const res = await withHeaders(req.get(apiPath)).expect(403);

  //     // then
  //     expectResponseFailed(res);
  //   });
  // });
});


