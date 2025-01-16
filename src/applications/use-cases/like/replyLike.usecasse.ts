import { ReplyLikeM } from "src/domains/model/replyLike";
import { ReplyLikeRepository} from "src/domains/repositories/like/replyLike.repository";
import { ReplyRepository } from "src/domains/repositories/reply/reply.repository";
import { UserRepository } from "src/domains/repositories/user/user.repository";


export class ReplyLikeUsecase {
  constructor(
    private userRepository: UserRepository,
    private replyRepository: ReplyRepository,
    private replyLikeRepository: ReplyLikeRepository
  ){}
  async execute(replyId: string, userId: string) {
    await this.replyRepository.verifyReplyAvailability(replyId);
    const isReplyLiked = await this.replyLikeRepository.verifyIsReplyLiked(userId, replyId);
    if (!isReplyLiked) {
    const replyLike = new ReplyLikeM()
    replyLike.user = await this.userRepository.findUser({ id: userId });
    replyLike.reply = await this.replyRepository.getReplyById(replyId);
    await this.replyLikeRepository.createReplyLike(replyLike);
    return 'reply Liked Successfully';
    } else {
      await this.replyLikeRepository.deleteReplyLike(userId, replyId);
      return 'reply Unliked Successfully';
    }
  }
}