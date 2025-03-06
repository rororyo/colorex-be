import { CommentRepository } from "src/domains/repositories/comment/comment.repository";
import { CommentLikeRepository } from "src/domains/repositories/like/commentLike.repository";

export class GetCommentLikeStatusUsecase {
  constructor(
    private commentRepository: CommentRepository,
    private commentLikeRepository: CommentLikeRepository
  ){}
  async execute(commentId: string, userId: string) {
    await this.commentRepository.verifyCommentAvailability(commentId);
    const isCommentLiked = await this.commentLikeRepository.verifyIsCommentLiked(userId, commentId);
    return isCommentLiked
  }
}