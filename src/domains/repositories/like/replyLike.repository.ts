import { replyLikeM } from "src/domains/model/replyLike";

export interface replyLikeRepository {
  createReplyLike(postLike: replyLikeM): Promise<void>
  verifyIsReplyLiked(userId: string, replyId: string): Promise<boolean>
  deleteReplyLike(userId: string, replyId: string): Promise<void>
}