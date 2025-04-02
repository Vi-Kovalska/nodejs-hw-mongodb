import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pino from 'pino-http';
import { getEnvVar } from './utils/getEnvVar';

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

  // request contacts

  // request contact by id

  app.use((req, res, next) => {
    res.status(404).json({
      message: 'Page not found with this route',
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  const port = +getEnvVar('PORT', '3000');
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};
