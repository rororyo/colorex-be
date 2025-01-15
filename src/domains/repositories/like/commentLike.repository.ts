import { commentLikeM } from "src/domains/model/commentLike"

export interface commentLikeRepository {
  createCommentLike(postLike: commentLikeM): Promise<void>
  verifyIsCommentLiked(userId: string, commentId: string): Promise<boolean>
  deleteCommentLike(userId: string, commentId: string): Promise<void>
}