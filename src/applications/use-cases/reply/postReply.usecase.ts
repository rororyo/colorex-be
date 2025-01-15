//TODO: Fix db structure here
import { CommentRepository } from "src/domains/repositories/comment/comment.repository";
import { PostRepository } from "src/domains/repositories/post/post.repository";
import { ReplyRepository } from "src/domains/repositories/reply/reply.repository";
import { UserRepository } from "src/domains/repositories/user/user.repository";
import { Reply } from "src/infrastructure/entities/reply.entity";
import { PostReplyDto } from "src/presentations/reply/dto/postReply.dto";

export class postReplyUseCase{
  constructor(
    private userRepository: UserRepository,
    private postRepository: PostRepository,
    private commentRepository: CommentRepository,
    private replyRepository: ReplyRepository
  ){}
  async execute (postReplyDto: PostReplyDto, userId: string, postId: string, commentId: string) {
      const user = await this.userRepository.findUser({ id: userId });
      await this.postRepository.verifyPostAvailability(postId);
      // const post = await this.postRepository.getPostById(postId);
      const comment = await this.commentRepository.getCommentById(commentId);
      const reply = new Reply();
      reply.content = postReplyDto.content;
      reply.user = user;
      // reply = post;
      reply.comment = comment;
      await this.replyRepository.createReply(reply);
  }
}