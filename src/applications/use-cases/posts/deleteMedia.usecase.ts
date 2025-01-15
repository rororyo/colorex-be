import { PostRepository } from "src/domains/repositories/post/post.repository";

export class DeleteReplyUsecase {
  constructor(
    private postRepository: PostRepository
  ) {}
  async execute(postId: string) {
    await this.postRepository.verifyPostAvailability(postId);
    await this.postRepository.deletePost(postId);
  }
}