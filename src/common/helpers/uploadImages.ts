import * as multer from 'multer';
import { mkdirp } from 'mkdirp';
import * as fs from 'fs';
const getUrlImage = () => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const day = new Date().getDay();

  return `./public/uploads/images/courses/${year}/${month}/${day}`;
};

export const ImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = getUrlImage();
    mkdirp(dir).then((err: any) => cb(err, dir));
  },
  filename: (req, file, cb) => {
    const filePath = getUrlImage() + '/' + file.originalname;
    if (!fs.existsSync(filePath)) cb(null, file.originalname);
    else cb(null, Date.now() + '-' + file.originalname);
  },
});
