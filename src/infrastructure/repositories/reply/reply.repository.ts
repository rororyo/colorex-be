import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReplyM } from "src/domains/model/reply";
import { ReplyRepository } from "src/domains/repositories/reply/reply.repository";
import { Reply } from "src/infrastructure/entities/reply.entity";
import { Repository } from "typeorm";

@Injectable()
export class ReplyRepositoryOrm implements ReplyRepository {
  constructor(
    @InjectRepository(Reply) private readonly replyRepository: Repository<Reply>,
  ){}
  async createReply(reply: ReplyM): Promise<void> {
    await this.replyRepository.save(reply);
  }
  async verifyReplyAvailability(replyId: string): Promise<boolean> {
    const reply = await this.replyRepository.findOne({where: {id: replyId}});
    if(!reply) {
      throw new NotFoundException('Reply not found');
    }
    return true;
  }
  async verifyReplyOwnership(userId: string, replyId: string): Promise<boolean> {
    const reply = await this.replyRepository.findOne({where: {id: replyId, user: {id: userId}}});
    if(!reply) {
      throw new UnauthorizedException('You are not the owner of this reply');
    }
    return true;
  }
  async getRepliesByCommentId(commentId: string): Promise<ReplyM[]> {
    const replies = await this.replyRepository.find({where: {comment: {id: commentId}}});
    return replies;
  }
  async getReplyById(replyId: string): Promise<ReplyM> {
    const reply = await this.replyRepository.findOne({where: {id: replyId}});
    return reply;
  }
  async editReplyById(replyId: string, reply: Partial<ReplyM>): Promise<void> {
    await this.replyRepository.update({id: replyId}, reply);
  }
  async deleteReply(replyId: string): Promise<void> {
    await this.replyRepository.delete({id: replyId});
  }
}