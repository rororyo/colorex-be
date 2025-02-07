import { IsOptional, IsString, IsUUID } from "class-validator";

export class EditUserDto {
  @IsString()
  @IsOptional()
  username: string
  @IsString()
  @IsOptional()
  bio: string
  @IsString()
  @IsOptional()
  avatarUrl: string
}

export class EditUserParamsDto {
  @IsString()
  @IsUUID()
  profileId: string
}