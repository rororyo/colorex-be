import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class PostCommentParamsDto {
  @IsUUID()
  @IsNotEmpty()
  postId: string
}
export class PostCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}