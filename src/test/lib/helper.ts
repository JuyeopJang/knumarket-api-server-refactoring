import UserController from '../../api/user/user.con';
import App from '../../app';
// import { createUser, mockCreateDocumentDto, mockUserRaw } from './mockup.js';

export function getServer() {
  const app = new App([
    new UserController()
  ]);
  return app.getServer();
}

export function expectResponseSucceed(res) {
  const data = res.body;
  expect(data.success).toBe(true);
  expect(data.response).not.toBeNull();
  expect(data.error).toBeNull();
}

export function expectResponseFailed(res) {
  const data = res.body;
  expect(data.success).toBe(false);
  expect(data.response).toBeNull();
  expect(data.error).not.toBeNull();
}

export function withHeadersBy(
  headers,
  options?,
) {
  return function withHeaders(req) {
    return setHeaders(req, headers, options);
  };
}

export function getHeadersFrom(res, headers?){
  const token = headers?.token;
  return {
    token
  };
}

export async function fetchHeaders(req) {
  const res = await req.get('/api').expect(200);

  return getHeadersFrom(res);
}

export function setHeaders(req, headers, options) {
    if (headers.token && !(typeof options.token !== 'undefined' && !options.token)) {
        req.auth(headers.token, { type: 'bearer' });
    }
    return req;
}

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