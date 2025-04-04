import { PostRepository } from "../../../domains/repositories/post/post.repository";

export class DeleteMediaUsecase {
  constructor(
    private postRepository: PostRepository
  ) {}
  async execute(postId: string, userId: string) {
    await this.postRepository.verifyPostAvailability(postId);
    await this.postRepository.verifyPostOwnership(userId, postId);
    await this.postRepository.deletePost(postId);
  }
}