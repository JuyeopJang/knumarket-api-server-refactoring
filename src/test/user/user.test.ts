import request from 'supertest';
import { UserRepository } from '../../api/user/user.repo';
import UserService from '../../api/user/user.serv';
import { closeDatabase, initializeDatabase, redisClient } from '../../lib/database';
import { jwtVerify } from '../../lib/jwt';
import { getRefreshToken } from '../../lib/redis';
import { LoginFakeUser, SignUpFakeUser } from '../lib/fake-data';
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

      const params = new SignUpFakeUser();

      // when
      const res = await withHeaders(req.post(apiPath)).send(params).expect(201);

      // then
      expectResponseSucceed(res);

      const user = await userRepository.findByEmail(params.getEmail());
      expect(user).not.toBeUndefined();
      expect(user.nickname).toEqual(params.getNickname());
    });

    it('실패 - 이미 가입된 이메일 입니다. (409)', async () => {
      // given
      const headers = await fetchHeaders(req);
      const withHeaders = withHeadersBy(headers);

      const mockUser = new SignUpFakeUser();
      
      const res = await withHeaders(req.post(apiPath))
        .send(mockUser).expect(409);

      expectResponseFailed(res);
    });

    it('실패 - 비밀번호는 6글자 이상 20자 이하 입니다. (400)', async () => {
      // given
      const headers = await fetchHeaders(req);
      const withHeaders = withHeadersBy(headers);

      const mockUser = new SignUpFakeUser();

      mockUser.setPassword('123');
      
      // when
      const res = await withHeaders(req.post(apiPath))
        .send(mockUser)
        .expect(400);

      // then
      expectResponseFailed(res);
    });

    it('실패 - 닉네임은 2글자 이상 10자 이하 입니다. (400)', async () => {
      // given
      const headers = await fetchHeaders(req);
      const withHeaders = withHeadersBy(headers);

      const mockUser = new SignUpFakeUser();

      mockUser.setNickname('mynameisnoah');
      
      // when
      const res = await withHeaders(req.post(apiPath))
        .send(mockUser)
        .expect(400);

      // then
      expectResponseFailed(res);
    });

    it('실패 - 이메일 형식에 맞지 않습니다. (400)', async () => {
      // given
      const headers = await fetchHeaders(req);
      const withHeaders = withHeadersBy(headers);

      const mockUser = new SignUpFakeUser();
      mockUser.setEmail('hi@');
      
      // when
      const res = await withHeaders(req.post(apiPath))
        .send(mockUser)
        .expect(400);

      // then
      expectResponseFailed(res);
    });
  });

  describe('로그인: POST /api/users/login', () => {
    const apiPath = `${rootApiPath}/login`;

    it('성공 - 로그인 (200)', async () => {
      // given
      const headers = await fetchHeaders(req);
      const withHeaders = withHeadersBy(headers);

      const mockUser = new LoginFakeUser();

      // when
      const res = await withHeaders(req.post(apiPath)).send(mockUser).expect(200);

      // then
      expectResponseSucceed(res);

      const result = res.body.response;

      const decoded = [jwtVerify(result.access_token), jwtVerify(result.refresh_token)];
      
      expect(decoded[0]).toHaveProperty('email', mockUser.getEmail());
      expect(decoded[1]).toHaveProperty('email', mockUser.getEmail());

      expect(await getRefreshToken(mockUser.getEmail())).toEqual(result.refresh_token);
    });

    it('실패 - 이메일 또는 비밀번호가 일치하지 않습니다. (401)', async () => {
      // given
      const headers = await fetchHeaders(req);
      const withHeaders = withHeadersBy(headers);

      const mockUser = new LoginFakeUser();
      mockUser.setEmail('hello@naver.com');
      // when
      const res = await withHeaders(req.post(apiPath)).send(mockUser).expect(401);

      // then
      expectResponseFailed(res);
    });
    
    it('실패 - 비밀번호는 6글자 이상 20자 이하 입니다. (400)', async () => {
      // given
      const headers = await fetchHeaders(req);
      const withHeaders = withHeadersBy(headers);

      const mockUser = new LoginFakeUser();

      mockUser.setPassword('231271231923829013821387');
      
      // when
      const res = await withHeaders(req.post(apiPath))
        .send(mockUser)
        .expect(400);

      // then
      expectResponseFailed(res);
    });

    it('실패 - 이메일 형식에 맞지 않습니다. (400)', async () => {
      // given
      const headers = await fetchHeaders(req);
      const withHeaders = withHeadersBy(headers);

      const mockUser = new LoginFakeUser();
      mockUser.setEmail('hi@gmail..com');
      
      // when
      const res = await withHeaders(req.post(apiPath))
        .send(mockUser)
        .expect(400);

      // then
      expectResponseFailed(res);
    });
  });

  describe('개인 정보 조회: GET /api/users/me', () => {
    const loginPath = `${rootApiPath}/login`
    const apiPath = `${rootApiPath}/me`;

    it('성공 - 개인 정보 조회 (200)', async () => {
      // login
      const headers = await fetchHeaders(req);
      const withHeaders = withHeadersBy(headers);

      const mockUser = new LoginFakeUser();

      const res = await withHeaders(req.post(loginPath)).send(mockUser).expect(200);
      const { access_token } = res.body.response;

      // get myinfo

      const myInfo = await withHeaders(req.get(apiPath)).set('authorization', access_token).expect(200);

      expect(myInfo.body.response).toHaveProperty('email');
      expect(myInfo.body.response).toHaveProperty('nickname');
      expect(myInfo.body.response).toHaveProperty('is_verified');
    });

    it('실패 - 토큰이 유효하지 않습니다. (401)', async () => {
      // given
      const headers = await fetchHeaders(req);
      const withHeaders = withHeadersBy(headers);

      const res = await withHeaders(req.get(apiPath)).set('authorization', 'dksaekjriwh.dasjdhjasd.dsakdaskjds').expect(401);

      expect(res.body.error).toHaveProperty('status', 401);
      expect(res.body.error).toHaveProperty('message', '토큰이 유효하지 않습니다.');
    });
    
    it('실패 - 토큰이 존재하지 않습니다. (400)', async () => {
      // given
      const headers = await fetchHeaders(req);
      const withHeaders = withHeadersBy(headers);

      const res = await withHeaders(req.get(apiPath)).set('authorization', '').expect(400);

      expect(res.body.error).toHaveProperty('status', 400);
      expect(res.body.error).toHaveProperty('message', 'req header에 authorization이 존재하지 않습니다.');
    });
  });

  describe('닉네임 변경: PUT /api/users/me', () => {
    const loginPath = `${rootApiPath}/login`
    const apiPath = `${rootApiPath}/me`;

    it('성공 - 닉네임 변경 성공 (200)', async () => {
      // login
      const headers = await fetchHeaders(req);
      const withHeaders = withHeadersBy(headers);

      const mockUser = new LoginFakeUser();

      const res = await withHeaders(req.post(loginPath)).send(mockUser).expect(200);
      const { access_token } = res.body.response;

      // update nickname
      const myInfo = await withHeaders(req.put(apiPath)).set('authorization', access_token).send({ nickname: 'newNick'}).expect(200);

      expect(myInfo.body.response).toHaveProperty('nickname');      
    });

    it('실패 - 토큰이 유효하지 않습니다. (401)', async () => {
      // given
      const headers = await fetchHeaders(req);
      const withHeaders = withHeadersBy(headers);

      const res = await withHeaders(req.put(apiPath)).set('authorization', 'dksaekjriwh.dasjdhjasd.dsakdaskjds').send({ nickname: 'idadsa'}).expect(401);

      expect(res.body.error).toHaveProperty('status', 401);
      expect(res.body.error).toHaveProperty('message', '토큰이 유효하지 않습니다.');
    });
    
    it('실패 - 토큰이 존재하지 않습니다. (400)', async () => {
      // given
      const headers = await fetchHeaders(req);
      const withHeaders = withHeadersBy(headers);

      const res = await withHeaders(req.put(apiPath)).set('authorization', '').send({ nickname: 'idadsa'}).expect(400);

      expect(res.body.error).toHaveProperty('status', 400);
      expect(res.body.error).toHaveProperty('message', 'req header에 authorization이 존재하지 않습니다.');
    });

    it('실패 - 닉네임은 2글자 이상 10자 이하 입니다. (400)', async () => {
      // given
      const headers = await fetchHeaders(req);
      const withHeaders = withHeadersBy(headers);

      const mockUser = new LoginFakeUser();

      const res = await withHeaders(req.post(loginPath)).send(mockUser).expect(200);
      const { access_token } = res.body.response;

      // update nickname
      const myInfo = await withHeaders(req.put(apiPath)).set('authorization', access_token).send({ nickname: 'i'}).expect(400);

      expect(myInfo.body.error.params.length).toBe(1);
    });
  });
});


