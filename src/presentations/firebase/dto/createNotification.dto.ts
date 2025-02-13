import { IsNotEmpty, IsString } from "class-validator";

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  fcmToken: string;
  @IsNotEmpty()
  @IsString()
  title:string
  @IsNotEmpty()
  @IsString()
  body:string
}