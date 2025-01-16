import { IsNotEmpty, IsUUID } from "class-validator";

export class getPostLikesParamsDto {
    @IsUUID()
    @IsNotEmpty()
    postId: string
}
export class getCommentLikesParamsDto {
    @IsUUID()
    @IsNotEmpty()
    commentId: string
}
export class getReplyLikesParamsDto {
    @IsUUID()
    @IsNotEmpty()
    replyId: string
}