import { CommentM } from "src/domains/model/comment";
import { CommentRepository } from "src/domains/repositories/comment/comment.repository"
import { PostRepository } from "src/domains/repositories/post/post.repository";
import { UserRepository } from "src/domains/repositories/user/user.repository"
import { PostCommentDto, PostCommentParamsDto } from "src/presentations/comment/dto/postComment.dto"

export class PostCommentUsecase {
  constructor(
    private userRepository: UserRepository,
    private postRepository: PostRepository,
    private commentRepository: CommentRepository
  ){}
  async execute (commentDto: PostCommentDto, userId: string, postId: string) {
    const user = await this.userRepository.findUser({ id: userId });
    await this.postRepository.verifyPostAvailability(postId);
    const post = await this.postRepository.getPostById(postId);
    const comment = new CommentM();
    comment.content = commentDto.content;
    comment.user = user;
    comment.post = post;
    await this.commentRepository.createComment(comment);
  }
}