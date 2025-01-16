import { IsNotEmpty, IsUUID } from "class-validator";

export class MediaParamsDto {
  @IsUUID()
  @IsNotEmpty()
  postId: string
}