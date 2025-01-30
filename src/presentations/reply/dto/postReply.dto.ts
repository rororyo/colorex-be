import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class PostReplyParamsDto {
      @ApiProperty({
        example:'2a047d80-d406-424d-bbfa-adc39e20077b',
        description:'the id of the post'
      })
  @IsUUID()
  @IsNotEmpty()
  postId: string
  @ApiProperty({
    example:'2a047d80-d406-424d-bbfa-adc39e20077b',
    description:'the id of the comment'
  })
  @IsUUID()
  @IsNotEmpty()
  commentId: string
}

export class PostReplyDto {
  @ApiProperty({
    example:'Hello World!',
    description:'reply content'
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}