import multer from 'multer';
import fs from 'fs';
import ImageKit from 'imagekit';
import { envConfig } from '@/config/env.config';

const imagekit = new ImageKit({
  publicKey: envConfig.imageUpload.publicKey,
  privateKey: envConfig.imageUpload.privateKey,
  urlEndpoint: envConfig.imageUpload.urlEndpoint,
});

const upload = multer({ storage: multer.memoryStorage() });
export default upload;

export const uploadLocalFile = async (
  buffer: Buffer<ArrayBufferLike>,
  fileName: string,
) => {
  const response = await imagekit.upload({ file: buffer, fileName });
  return response;
};

export const deleteFile = async (fileId: string) => {
  const response = await imagekit.deleteFile(fileId);
  return response;
};
