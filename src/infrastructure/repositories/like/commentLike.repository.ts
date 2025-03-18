import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentLikeM } from "../../../domains/model/commentLike";
import { CommentLikeRepository } from "../../../domains/repositories/like/commentLike.repository";
import { CommentLike } from "../../../infrastructure/entities/commentLike.entity";
import { Repository } from "typeorm";

@Injectable()
export class CommentLikeRepositoryOrm implements CommentLikeRepository  {
  constructor(
    @InjectRepository(CommentLike) private readonly commentLikeRepository: Repository<CommentLike>,
  ){}
  async createCommentLike(commentLike: CommentLikeM): Promise<void> {
    await this.commentLikeRepository.save(commentLike);
  }
  async verifyIsCommentLiked(userId: string, commentId: string): Promise<boolean> {
    const commentLike = await this.commentLikeRepository.findOneBy({user: {id: userId}, comment: {id: commentId}});
    return commentLike ? true : false
  }
  async getCommentLikeCount(commentId: string): Promise<number> {
    return this.commentLikeRepository.count({ where: { comment: { id: commentId } } });
  }
  
  async deleteCommentLike(userId: string, commentId: string): Promise<void> {
    await this.commentLikeRepository.delete({user: {id: userId}, comment: {id: commentId}});
  }
}