// import { UseInterceptors, applyDecorators } from '@nestjs/common';
// import { ImageStorage } from '../helpers/uploadImage.helper';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { videoStorage } from '../helpers/uploadVideo.helper';
// import { ImageAvatarStorage } from '../helpers/uploadAvatar';

// export const UploadImageFile = (data: string) => {
//   return applyDecorators(
//     UseInterceptors(
//       FileInterceptor(data, {
//         storage: ImageStorage,
//       }),
//     ),
//   );
// };

// export const UploadAvatarImageFile = (data: string) => {
//   return applyDecorators(
//     UseInterceptors(
//       FileInterceptor(data, {
//         storage: ImageAvatarStorage,
//       }),
//     ),
//   );
// };
// export const UploadVideoFile = (data: string) => {
//   return applyDecorators(
//     UseInterceptors(
//       FileInterceptor(data, {
//         storage: videoStorage,
//       }),
//     ),
//   );
// };
