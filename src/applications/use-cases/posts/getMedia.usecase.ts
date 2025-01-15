import { PostM } from "src/domains/model/post";
import { CommentRepository } from "src/domains/repositories/comment/comment.repository";
import { PostRepository } from "src/domains/repositories/post/post.repository";
import { ReplyRepository } from "src/domains/repositories/reply/reply.repository";
import { UserRepository } from "src/domains/repositories/user/user.repository";

export class getMediaDetailsUsecase {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(postId: string): Promise<PostM> {
    await this.postRepository.verifyPostAvailability(postId);
    const post = await this.postRepository.getDetailedPostById(postId);
    return post;
  }
}