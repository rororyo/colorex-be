import { ReplyLikeRepository } from "src/domains/repositories/like/replyLike.repository";
import { ReplyRepository } from "src/domains/repositories/reply/reply.repository";

export class GetReplyLikeStatusUsecase {
  constructor(
    private replyRepository: ReplyRepository,
    private replyLikeRepository: ReplyLikeRepository
  ) {}
  async execute(replyId: string, userId: string) {
    await this.replyRepository.verifyReplyAvailability(replyId);
    const isReplyLiked = await this.replyLikeRepository.verifyIsReplyLiked(userId, replyId);
    return isReplyLiked;
  } 
}