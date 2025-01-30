import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class DeleteReplyParamsDto{
  @ApiProperty({
    example:'2a047d80-d406-424d-bbfa-adc39e20077b',
    description:'the id of the reply'
  })
  @IsUUID()
  @IsNotEmpty()
  replyId: string
}