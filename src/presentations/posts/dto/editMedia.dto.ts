import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { PostType } from '../../../domains/model/post';

export class EditMediaDto {
  @ApiProperty({
    enum: PostType,
    description: 'Type of the post',
    required: false,
    example: 'image'
  })
  @IsEnum(PostType)
  @IsOptional()
  post_type: PostType;

  @ApiProperty({
    description: 'Title of the media post',
    required: false,
    example: 'Beautiful sunset'
  })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({
    description: 'Content or description of the media post',
    required: false,
    example: 'Captured this amazing sunset at the beach'
  })
  @IsString()
  @IsOptional()
  content: string;
  
  @ApiProperty({
    description: ' Hashtags of the media post',
    required:true,
    example: ['sunset', 'beach']
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  hashtags: string[]
}


