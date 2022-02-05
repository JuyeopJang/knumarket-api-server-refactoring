import express, { NextFunction, Request, Response, Router } from 'express';
import bodyParser from 'body-parser';
// import csurf from 'csurf';
import helmet from 'helmet';
import ApiController from './api/interfaces/ApiController';
import morgan from 'morgan';
import { errorMiddleware } from './middlewares/error.middleware';
import { Express } from 'express-serve-static-core';

class App {
    private app: Express;
    private isDisableKeepAlive = false;
    
    constructor(controllers: ApiController[]) {
        this.app = express();
        
        this.initializeMiddlewares(); 
        this.initializeControllers(controllers);
        this.initializeErrorHandling(); 
    }

    initializeMiddlewares() {
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            if (this.isDisableKeepAlive) {
                res.set('Connection', 'close');
            }
            next();
        })
        this.app.use(bodyParser.json());
        this.app.use(helmet());
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
        return this.app.listen(port, () => {
            console.log(`App listening on the port ${port}`);
        });
    }

    getServer() {
        return this.app;
    }

    getIsDisableKeepAlive() {
        return this.isDisableKeepAlive;
    }

    setIsDisableKeepAlive(isDisableKeepAlive: boolean) {
        this.isDisableKeepAlive = isDisableKeepAlive;
    }
}

export default App;