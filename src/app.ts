import express, { Request, Response, Router } from 'express';
import bodyParser from 'body-parser';
import csurf from 'csurf';
import helmet from 'helmet';
import ApiController from './api/interfaces/ApiController';
import morgan from 'morgan';
import { errorMiddleware } from './middlewares/error.middleware';

class App {
    private app;
    
    constructor(controllers: ApiController[]) {
        this.app = express();
        
        this.initializeMiddlewares(); 
        this.initializeControllers(controllers);
        this.initializeErrorHandling(); 
    }

    initializeMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(helmet());
        // this.app.use(csurf());
        this.app.use(morgan("combined"));
    }

    initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }
    
    initializeControllers(controllers: ApiController[]) {
        const router = Router();

        router.get('/', (req: Request, res: Response) => res.send('OK'));

        controllers.forEach((controller) => {
            router.use(controller.router);
        });

        this.app.use('/api', router);
    }

    listen() {
        const port: number = Number(process.env.PORT) || 5000;
        this.app.listen(port, () => {
            console.log(`App listening on the port ${port}`);
        });
    }

    get getServer() {
        return this.app;
    }
}

export default App;