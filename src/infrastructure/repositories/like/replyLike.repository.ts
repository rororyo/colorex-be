import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { replyLikeM } from "src/domains/model/replyLike";
import { replyLikeRepository } from "src/domains/repositories/like/replyLike.repository";
import { replyLike } from "src/infrastructure/entities/replyLike.entity";
import { Repository } from "typeorm";

@Injectable()
export class ReplyLikeRepositoryOrm implements replyLikeRepository  {
  constructor(
    @InjectRepository(replyLike) private readonly replyLikeRepository: Repository<replyLike>,
  ){}
  async createReplyLike(replyLike: replyLikeM): Promise<void> {
    await this.replyLikeRepository.save(replyLike);
  }
  async verifyIsReplyLiked(userId: string, replyId: string): Promise<boolean> {
    const commentLike = await this.replyLikeRepository.findOneBy({user: {id: userId}, reply: {id: replyId}});
    return commentLike ? true : false
  }
  async deleteReplyLike(userId: string, replyId: string): Promise<void> {
    await this.replyLikeRepository.delete({user: {id: userId}, reply: {id: replyId}});
  }
}