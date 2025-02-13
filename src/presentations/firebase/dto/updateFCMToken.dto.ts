import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class UpdateFCMTokenDto {
  @IsString()
  @IsNotEmpty()
  fcmToken: string;
}