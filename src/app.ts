import express from 'express';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
import config from './config';

global.Config = config;

//import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';

import { router } from './api/routes';
import { morganMiddleware } from './config/logger';
import rateLimit from 'express-rate-limit';
import path from 'path';
import favicon from 'serve-favicon';

export class App {
    public app;

    constructor() {
        this.app = express();
        this.setConfig();
        this.setRoutes();
    }

    setConfig(): void {
        // Set Public Directory
        this.app.use(express.static('public'));
        // Set View Engine
        this.app.set('view engine', 'ejs');
        // Set Directory for View Engine
        this.app.set('views', path.resolve('./resource/views'));

        // Serve the favicon
        this.app.use(favicon(path.join(process.cwd(), 'public', 'favicon.ico')));

        if (process.env.NODE_ENV !== 'test') {
            this.app.use(morganMiddleware);
        }
        // Apply the rate limiting middleware to all requests
        this.app.use(rateLimit(Config.rateLimit));
        this.app.use(cors(Config.cors));
        // Helmet Config
        //this.app.use(helmet());
        // Input Post Values to req.body
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }

    setRoutes(): void {
        this.app.use(router);
    }
}
