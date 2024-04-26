import express, { Express } from 'express';
import { PORT } from './constants';

export class Server {
    protected app: Express;

    constructor(
        protected port: number = PORT
    ) {
        this.app = express();
        this.useMiddlewires();
    }

    useMiddlewires() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    start() {
        this.app.listen(this.port);
    }
}