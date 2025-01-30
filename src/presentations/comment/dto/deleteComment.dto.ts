import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class DeleteCommentParamsDto{
  @ApiProperty({
    example:'b9e9b1b1-1b1b-1b1b-1b1b-1b1b1b1b1b1b', 
    description:'The id of the comment'
  })
  @IsUUID()
  @IsNotEmpty()
  commentId: string
}