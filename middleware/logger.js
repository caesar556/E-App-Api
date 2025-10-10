import path from 'path';
import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import express from 'express';
import morgan from 'morgan';

export const morganLogger = async () => {
  const folderLog = path.join('logs');
  const fileLogs = path.join(folderLog, 'access.log');
  try {
    await fs.access(folderLog);
  } catch {
    await fs.mkdir(folderLog, { recursive: true });
  }
  const stream = createWriteStream(fileLogs, { flags: 'a' });
  
  const format = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
  return morgan(format, { stream });
};
