export class HttpException extends Error {
    status: number;
    errors: any;

    constructor(status: number, message: string, errors?: any) {
        super(message);
        
        this.status = status;
        this.message = message;
        this.errors = errors;
    }

    get getStatus() {
        return this.status;
    }

    get getMessage() {
        return this.message;
    }
}