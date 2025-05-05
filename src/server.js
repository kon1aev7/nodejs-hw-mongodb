import express from 'express';
import cors from 'cors';
import { logger } from './middlewares/logger.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
// import authRouter from './routers/auth.js';
// import contactsRouter from './routers/contacts.js';
import router from './routers/index.js';
import cookieParser from 'cookie-parser';
import { getEnvVar } from './utils/getEnvVar.js';
import { UPLOAD_DIR } from './constants/index.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());
  app.use(logger);

  app.use('/upload', express.static(UPLOAD_DIR));
  app.use('/api-docs', swaggerDocs());

  app.use(router);

  app.use(notFoundHandler);

  app.use(errorHandler);

  const port = Number(getEnvVar('PORT', 3000));

  app.listen(port, () => {
    console.log(`Server is running on ${port} port`);
  });
};
