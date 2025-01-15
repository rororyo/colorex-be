import { ReplyM } from "src/domains/model/reply";

export interface ReplyRepository{
  createReply(reply: ReplyM): Promise<void>
  verifyReplyAvailability(replyId: string): Promise<boolean>
  getRepliesByCommentId(commentId: string): Promise<ReplyM[]>
  getReplyById(replyId: string): Promise<ReplyM>
  deleteReply(replyId: string): Promise<void>
}