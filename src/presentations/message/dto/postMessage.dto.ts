import { IsUUID, IsString } from 'class-validator';

export class PostMessageDto {
  @IsUUID()
  receiverId: string;

  @IsString()
  content: string;
}
