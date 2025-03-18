import { BadRequestException } from '@nestjs/common';
import { AllowedMediaTypes, isAllowedFileType, MediaFile } from '../../presentations/posts/dto/postMedia.dto';


export const convertToMediaFile = (file: Express.Multer.File): MediaFile => {
  if (!file) {
    throw new BadRequestException('No file uploaded');
  }

  if (!isAllowedFileType(file.mimetype)) {
    throw new BadRequestException(`File type ${file.mimetype} is not allowed`);
  }

  return {
    fieldname: file.fieldname,
    originalname: file.originalname,
    encoding: file.encoding,
    mimetype: file.mimetype as AllowedMediaTypes, // Safe because we validated it
    buffer: file.buffer,
    size: file.size
  };
};