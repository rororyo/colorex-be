import { IsNotEmpty, IsUUID } from "class-validator";

export class DeleteReplyParamsDto{
  @IsUUID()
  @IsNotEmpty()
  replyId: string
}