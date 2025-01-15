import { IsNotEmpty, IsUUID } from "class-validator";

export class getMediaDetailsParamsDto {
  @IsUUID()
  @IsNotEmpty()
  postId: string
}