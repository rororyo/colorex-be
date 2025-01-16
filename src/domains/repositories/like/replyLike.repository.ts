import { ReplyLikeM } from "src/domains/model/replyLike";

export interface ReplyLikeRepository {
  createReplyLike(postLike: ReplyLikeM): Promise<void>
  getReplyLikeCount(replyId: string): Promise<number>
  verifyIsReplyLiked(userId: string, replyId: string): Promise<boolean>
  deleteReplyLike(userId: string, replyId: string): Promise<void>
}