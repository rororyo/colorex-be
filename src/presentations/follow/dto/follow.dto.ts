import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class FollowParamsDto {
  @ApiProperty({
    example: 'b9e9b1b1-1b1b-1b1b-1b1b-1b1b1b1b1b1b1b',
    description: 'The id of the user to follow',
  })
  @IsUUID()
  @IsNotEmpty()
  followingId: string;
}

export class UserFollowParamsDto {
  @ApiProperty({
    example: 'b9e9b1b1-1b1b-1b1b-1b1b-1b1b1b1b1b1b1b',
    description: 'The id of the user',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
