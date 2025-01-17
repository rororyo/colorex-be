import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PostType } from 'src/domains/model/post';

export class EditMediaDto {
  @IsEnum(PostType)
  @IsOptional()
  post_type: PostType;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  content: string;
}
