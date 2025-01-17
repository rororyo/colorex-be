import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class EditReplyParamsDto {
  @IsUUID()
  @IsString()
  replyId: string
}

export class EditReplyDto {
  @IsNotEmpty()
  @IsString()
  content: string
}