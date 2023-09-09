import { UseInterceptors, applyDecorators } from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { ImageStorage } from '../helpers/uploadImages';
import { videoStorage } from '../helpers/uploadVideo.helper';
import { AvatarImageStorage } from '../helpers/uploadAvatarImage';

export const UploadImageFile = (data: string) => {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(data, {
        storage: ImageStorage,
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
