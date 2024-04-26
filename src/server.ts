import express, { Express } from 'express';
import { PORT } from './constants';

export class Server {
    protected app: Express;

    constructor(
        public port: number = PORT
    ) {
        this.app = express();
        this.useMiddlewires();
    }

    private useMiddlewires() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    public start() {
        this.app.listen(this.port);
    }
}