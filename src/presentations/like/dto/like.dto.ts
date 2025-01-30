import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class getPostLikesParamsDto {
  @ApiProperty({
    example: '8eccff6a-f4a7-4502-9103-e725669b9011',
    description: 'The id of the post',
  })
  @IsUUID()
  @IsNotEmpty()
  postId: string;
}
export class getCommentLikesParamsDto {
  @ApiProperty({
    example: '2a047d80-d406-424d-bbfa-adc39e20077b',
    description: 'The id of the comment',
  })
  @IsUUID()
  @IsNotEmpty()
  commentId: string;
}
export class getReplyLikesParamsDto {
  @ApiProperty({
    example: '2a047d80-d406-424d-bbfa-adc39e20077b',
    description: 'The id of the comment',
  })
  @IsUUID()
  @IsNotEmpty()
  replyId: string;
}
