import { HttpException } from "./http.exception";

export class ServerException extends HttpException {
    constructor(message: string = '서버 에러 입니다.') {
      super(500, message);
    }
};