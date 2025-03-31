import { PostM } from "../../../domains/model/post";
import { PostRepository } from "../../../domains/repositories/post/post.repository";

export class GetMediaDetailsUsecase {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(postId: string): Promise<PostM> {
    await this.postRepository.verifyPostAvailability(postId);
    const post = await this.postRepository.getDetailedPostById(postId);
    return post;
  }
}
