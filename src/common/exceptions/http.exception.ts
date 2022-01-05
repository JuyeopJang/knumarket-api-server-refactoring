export class HttpException extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        
        this.status = status;
        this.message = message;
    }

    get getStatus() {
        return this.status;
    }

    get getMessage() {
        return this.message;
    }
}