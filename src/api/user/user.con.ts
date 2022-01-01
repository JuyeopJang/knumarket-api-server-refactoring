import ApiController from "../interfaces/ApiController";

export default class UserController implements ApiController {
    path: string;
    router: any;
    initializeRoutes(): void {
        throw new Error("Method not implemented.");
    }

}