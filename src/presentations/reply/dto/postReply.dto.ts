import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class PostReplyParamsDto {
  @IsUUID()
  @IsNotEmpty()
  postId: string
  @IsUUID()
  @IsNotEmpty()
  commentId: string
}
export class PostReplyDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}