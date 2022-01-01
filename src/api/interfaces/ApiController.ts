export default interface ApiController {
    path: string;
    router: any;

    initializeRoutes(): void;
}