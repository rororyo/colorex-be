import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class EditCommentParamsDto {
  @IsUUID()
  @IsString()
  commentId: string
}

export class EditCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string
}