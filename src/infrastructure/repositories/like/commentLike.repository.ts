import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { commentLikeM } from "src/domains/model/commentLike";
import { commentLikeRepository } from "src/domains/repositories/like/commentLike.repository";
import { commentLike } from "src/infrastructure/entities/commentLike.entity";
import { Repository } from "typeorm";

@Injectable()
export class CommentLikeRepositoryOrm implements commentLikeRepository  {
  constructor(
    @InjectRepository(commentLike) private readonly commentLikeRepository: Repository<commentLike>,
  ){}
  async createCommentLike(commentLike: commentLikeM): Promise<void> {
    await this.commentLikeRepository.save(commentLike);
  }
  async verifyIsCommentLiked(userId: string, commentId: string): Promise<boolean> {
    const commentLike = await this.commentLikeRepository.findOneBy({user: {id: userId}, comment: {id: commentId}});
    return commentLike ? true : false
  }
  async deleteCommentLike(userId: string, commentId: string): Promise<void> {
    await this.commentLikeRepository.delete({user: {id: userId}, comment: {id: commentId}});
  }
}