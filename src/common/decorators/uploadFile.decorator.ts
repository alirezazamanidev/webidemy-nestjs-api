import { UseInterceptors, applyDecorators } from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { PhotoCourseStorage } from '../helpers/uploadPhotoCourse';
import { videoStorage } from '../helpers/uploadVideo.helper';
import { AvatarImageStorage } from '../helpers/uploadAvatarImage';
import { PhotoBlogStorage } from '../helpers/uploadPhotoBlog';

export const UploadPhotoCourseFile = (data: string) => {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(data, {
        storage: PhotoCourseStorage,
      }),
    ),
  );
};

export const UploadPhotoBlogFile = (data: string) => {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(data, {
        storage: PhotoBlogStorage,
      }),
    ),
  );
};
export const UploadAvatarImageFile = (data: string) => {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(data, {
        storage: AvatarImageStorage,
      }),
    ),
  );
};
export const UploadVideoFile = (data: string) => {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(data, {
        storage: videoStorage,
      }),
    ),
  );
};
