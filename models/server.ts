import express, {
  Application,
  NextFunction,
  Request,
  Response,
  Router,
} from 'express';
import cors from 'cors';
import db from '../database/db';
import AppError from './appError';
import { globalErrorHandler } from '../controllers/error.controller';
import swaggerUi from 'swagger-ui-express';
import swaggerSetup from '../docs/swagger';
class Server {
  private app: Application;
  private PORT: string = process.env.PORT || '4003';
  private HOST: string = process.env.HOST || 'localhost';
  private ROUTE: string = process.env.ROUTE || '/api/v1';

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
    const router = Router();
    this.app.use(this.ROUTE, router);

    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSetup));

    this.app.use(
      /^\/(?!$).*$/,
      (req: Request, _res: Response, next: NextFunction) => {
        return next(
          new AppError(`can't find ${req.originalUrl} on this server`, 404)
        );
      }
    );
    this.app.use('/', (_req: Request, res: Response) => {
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
      console.log(`📝 View docs at: ${server}/api-docs`);
    });
  }
}

export default Server;
