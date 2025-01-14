import { IsString, IsEnum, IsNotEmpty } from "class-validator";
import { PostType } from "src/domains/model/post";

export type AllowedMediaTypes = 
  | 'image/jpeg'
  | 'image/png'
  | 'image/gif'
  | 'video/mp4'
  | 'video/quicktime'
  | 'video/x-msvideo';

// Interface for the file object
export interface MediaFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: AllowedMediaTypes;
  buffer: Buffer;
  size: number;
}

export class PostMediaDto {
  @IsEnum(PostType)
  @IsNotEmpty()
  post_type: PostType;

  // @IsNotEmpty()
  // file: MediaFile; 

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}

// Optional: Validation helper
export const isAllowedFileType = (mimetype: string): mimetype is AllowedMediaTypes => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo'
  ];
  return allowedTypes.includes(mimetype);
};