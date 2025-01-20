import { IsNotEmpty, IsUUID } from "class-validator";

export class FollowParamsDto {
  @IsUUID()
  @IsNotEmpty()
  followingId: string
}

export class UserFollowParamsDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string
}