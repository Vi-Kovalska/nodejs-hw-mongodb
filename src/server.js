import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pino from 'pino-http';
import { getEnvVar } from './utils/getEnvVar.js';
import Routers from './routers/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';

export const setupServer = () => {
  const app = express();
  dotenv.config();

  app.use(express.json());
  app.use(cors());
  app.use(
    pino({
      transport: { target: 'pino-pretty' },
    }),
  );

  app.use(cookieParser());
  app.use(Routers);

  app.use(notFoundHandler);

  app.use(errorHandler);

  const port = +getEnvVar('PORT', '3000');

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};
