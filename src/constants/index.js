export const sortList = ['asc', 'desc'];

import path from 'node:path';

// export const TEMPLATES_DIR = path.resolve('src', 'templates');
// export const TEMPORARY_FILE_DIR = path.resolve('temp');
// export const _FILE_DIR = path.resolve('upload');

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};

export const JWT_SECRET = 'JWT_SECRET';
export const APP_DOMAIN = 'APP_DOMAIN';

export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');
export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'upload');

export const CLOUDINARY = {
  CLOUDINARY_CLOUD_NAME: 'CLOUDINARY_CLOUD_NAME',
  CLOUDINARY_API_KEY: 'CLOUDINARY_API_KEY',
  CLOUDINARY_API_SECRET: 'CLOUDINARY_API_SECRET',
};

export const SAVE_FILE_STRATEGY = 'cloudinary';

export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');
