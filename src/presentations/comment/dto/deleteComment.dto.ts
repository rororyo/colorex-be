import { IsNotEmpty, IsUUID } from "class-validator";

export class DeleteCommentParamsDto{
  @IsUUID()
  @IsNotEmpty()
  commentId: string
}