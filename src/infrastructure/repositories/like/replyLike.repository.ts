import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReplyLikeM } from '../../../domains/model/replyLike';
import { ReplyLikeRepository } from '../../../domains/repositories/like/replyLike.repository';
import { ReplyLike } from '../../../infrastructure/entities/replyLike.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReplyLikeRepositoryOrm implements ReplyLikeRepository {
  constructor(
    @InjectRepository(ReplyLike)
    private readonly replyLikeRepository: Repository<ReplyLike>,
  ) {}
  async createReplyLike(replyLike: ReplyLikeM): Promise<void> {
    await this.replyLikeRepository.save(replyLike);
  }
  async getReplyLikeCount(replyId: string): Promise<number> {
    return this.replyLikeRepository.count({
      where: { reply: { id: replyId } },
    });
  }
  async verifyIsReplyLiked(userId: string, replyId: string): Promise<boolean> {
    const commentLike = await this.replyLikeRepository.findOneBy({
      user: { id: userId },
      reply: { id: replyId },
    });
    return commentLike ? true : false;
  }

  async deleteReplyLike(userId: string, replyId: string): Promise<void> {
    await this.replyLikeRepository.delete({
      user: { id: userId },
      reply: { id: replyId },
    });
  }
}
