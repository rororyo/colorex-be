import { ReplyM } from "../../../domains/model/reply";
import { CommentRepository } from "../../../domains/repositories/comment/comment.repository";
import { PostRepository } from "../../../domains/repositories/post/post.repository";
import { ReplyRepository } from "../../../domains/repositories/reply/reply.repository";
import { UserRepository } from "../../../domains/repositories/user/user.repository";
import { PostReplyDto } from "../../../presentations/reply/dto/postReply.dto";

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
      const reply = new ReplyM();
      reply.content = postReplyDto.content;
      reply.user = user;
      // reply = post;
      reply.comment = comment;
      await this.replyRepository.createReply(reply);
  }
}