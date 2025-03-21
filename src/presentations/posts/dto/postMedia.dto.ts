import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsString, IsEnum, IsNotEmpty, IsArray, IsOptional } from "class-validator";
import { PostType } from "../../../domains/model/post";

export type AllowedMediaTypes = 
  | 'image/jpeg'
  | 'image/png'
  | 'image/gif'
  | 'video/mp4'
  | 'video/quicktime'
  | 'video/x-msvideo';

export interface MediaFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: AllowedMediaTypes;
  buffer: Buffer;
  size: number;
}

export class PostMediaDto {
  @ApiProperty({
    enum: PostType,
    description: 'Type of the post (image or video)',
    example: 'image'
  })
  @IsEnum(PostType)
  @IsNotEmpty()
  post_type: PostType;

  @ApiProperty({
    description: 'Title of the media post',
    example: 'Beautiful sunset at the beach'
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Content or description of the media post',
    example: 'Captured this amazing sunset while walking along the shore'
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'URL of the media file',
    example: 'https://example.com/media/file.mp4'
  })
  @IsOptional()
  @IsString()
  media_url: string;
  
  @ApiProperty({
    description: 'Hashtags associated with the media post',
    example: ['sunset', 'beach', 'amazing']
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
  hashtags: string[];

  // Note: File upload is typically handled separately through @UploadedFile() decorator
  // and doesn't need @ApiProperty() documentation
}

// Helper function - no Swagger decoration needed as it's not part of the API schema
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