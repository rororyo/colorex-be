import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentM } from "src/domains/model/comment";
import { PostM } from "src/domains/model/post";
import { CommentRepository } from "src/domains/repositories/comment/comment.repository";
import { Comment } from "src/infrastructure/entities/comment.entity";
import { PostCommentDto } from "src/presentations/comment/dto/postComment.dto";
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
  async getCommentsByPostId(postId: string): Promise<CommentM[]> {
    const comments = await this.commentRepository.find({where: {post: {id: postId}}});
    return comments;
  }
  
  async getCommentById(commentId: string): Promise<CommentM> {
    const comment = await this.commentRepository.findOne({where: {id: commentId}});
    return comment;
  }
  async deleteComment(commentId: string): Promise<void> {
    await this.commentRepository.delete({id: commentId});
  }
}