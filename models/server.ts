import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import db from '../database/db';
import path from 'path';
import AppError from './appError';
import globalErrorHandler from '../controllers/error.controller';

class Server {
  private app: Application;
  private PORT: string = process.env.PORT || '4003';
  private HOST: string = process.env.HOST || 'localhost';
  private rootDir = path.resolve(__dirname, '..');
  private path = {
    home: `/${process.env.ROUTE}/`,
  };
  constructor() {
    this.app = express();
    this.middlewares();
    this.database();
    this.routes();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }
  database() {
    db.authenticate()
      .then(() => console.log('Database authenticate'))
      .catch(err => console.log(err));
  }
  routes() {
    this.app.all('/:404', (req: Request, res: Response, next: NextFunction) => {
      return next(
        new AppError(`can't find ${req.originalUrl} on this server`, 404)
      );
    });
    this.app.use('/', (req: Request, res: Response) => {
      res.json({
        status: true,
        server: 'OK',
      });
    });
    this.app.use(globalErrorHandler);
  }
  listen() {
    this.app.listen(this.PORT, () => {
      const server = `http://${this.HOST}:${this.PORT}`;
      console.log(`🚀 Server deployed at: ${server}`);
    });
  }
}

export default Server;
