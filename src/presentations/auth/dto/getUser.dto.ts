import { IsString, IsUUID } from "class-validator";

export class GetUserParamsDto {
  @IsString()
  @IsUUID()
  profileId: string
}