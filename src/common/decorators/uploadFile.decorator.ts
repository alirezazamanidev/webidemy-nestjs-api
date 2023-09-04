import { UseInterceptors, applyDecorators } from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { ImageStorage } from '../helpers/uploadImages';
import { videoStorage } from '../helpers/uploadVideo.helper';

export const UploadImageFile = (data: string) => {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(data, {
        storage: ImageStorage,
      }),
    ),
  );
};

// export const UploadAvatarImageFile = (data: string) => {
//   return applyDecorators(
//     UseInterceptors(
//       FileInterceptor(data, {
//         storage: ImageAvatarStorage,
//       }),
//     ),
//   );
// };
export const UploadVideoFile = (data: string) => {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(data, {
        storage: videoStorage,
      }),
    ),
  );
};
