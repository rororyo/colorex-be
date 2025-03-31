import { CommentLikeM } from "../../model/commentLike"

export interface CommentLikeRepository {
  createCommentLike(commentLike: CommentLikeM): Promise<void>
  getCommentLikeCount(commentId: string): Promise<number>
  verifyIsCommentLiked(userId: string, commentId: string): Promise<boolean>
  deleteCommentLike(userId: string, commentId: string): Promise<void>
}