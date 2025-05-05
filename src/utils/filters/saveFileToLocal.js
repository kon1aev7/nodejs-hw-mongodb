import fs from 'node:fs/promises';
import path from 'node:path';
import {
  APP_DOMAIN,
  UPLOAD_DIR,
  TEMP_UPLOAD_DIR,
} from '../../constants/index.js';
import { getEnvVar } from '../getEnvVar.js';

export const saveFileToLocal = async (file) => {
  await fs.rename(
    path.join(TEMP_UPLOAD_DIR, file.filename),
    path.join(UPLOAD_DIR, file.filename),
  );

  return `${getEnvVar(APP_DOMAIN)}/upload/${file.filename}`;
};
