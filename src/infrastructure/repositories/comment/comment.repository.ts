import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentM } from "../../../domains/model/comment";
import { CommentRepository } from "../../../domains/repositories/comment/comment.repository";
import { Comment } from "../../../infrastructure/entities/comment.entity";
import { EditCommentDto } from "../../../presentations/comment/dto/editComment.dto";
import { Repository } from "typeorm";

@Injectable()
export class CommentRepositoryOrm implements CommentRepository{
  constructor(
    @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,
  ){}
  async createComment(comment: CommentM): Promise<void> {
    await this.commentRepository.save(comment);
  }
  async verifyCommentAvailability(commentId: string): Promise<boolean> {
    const comment = await this.commentRepository.findOne({where: {id: commentId}});
    if(!comment) {
      throw new NotFoundException('Comment not found');
    };
    return true;
  }
  async verifyCommentOwnership(userId: string, commentId: string): Promise<boolean> {
    const comment = await this.commentRepository.findOne({where: {id: commentId,user: {id: userId}}});
    if(!comment) {
      throw new UnauthorizedException('You are not the owner of this comment');
    }
    return true;
  }
  async getCommentsByPostId(postId: string): Promise<CommentM[]> {
    const comments = await this.commentRepository.find({where: {post: {id: postId}}});
    return comments;
  }
  
  async getCommentById(commentId: string): Promise<CommentM> {
    const comment = await this.commentRepository.findOne({where: {id: commentId}});
    return comment;
  }
  async editComment(commentId: string,comment: Partial<EditCommentDto>): Promise<void> {
    await this.commentRepository.update({id: commentId},comment);
  }
  async deleteComment(commentId: string): Promise<void> {
    await this.commentRepository.delete({id: commentId});
  }
}