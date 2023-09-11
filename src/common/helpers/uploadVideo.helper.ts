import * as multer from 'multer';
import { mkdirp } from 'mkdirp';

import * as fs from 'fs';
const getUrlVideo = () => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const day = new Date().getDay();

  return `./public/uploads/video/episodes/${year}/${month}/${day}`;
};

export const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = getUrlVideo();
    mkdirp(dir, () => cb(null, dir));
  },
  filename: (req, file, cb) => {
    const filePath = getUrlVideo() + '/' + file.originalname;
    if (!fs.existsSync(filePath)) cb(null, file.originalname);
    else cb(null, Date.now() + '-' + file.originalname);
  },
});
