import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    example: 'fcm_device_token_123456',
    description: 'The Firebase Cloud Messaging (FCM) token of the recipient device',
  })
  @IsNotEmpty()
  @IsString()
  fcmToken: string;

  @ApiProperty({
    example: 'New Message',
    description: 'The title of the notification',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'You have received a new message from John Doe.',
    description: 'The body content of the notification',
  })
  @IsNotEmpty()
  @IsString()
  body: string;
}
