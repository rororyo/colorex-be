import { postLikeRepository } from "src/domains/repositories/like/postLike.repository";
import { PostRepository } from "src/domains/repositories/post/post.repository";
import { UserRepository } from "src/domains/repositories/user/user.repository";
import { PostLike } from "src/infrastructure/entities/postLike.entity";

export class PostLikeUsecase {
  constructor(
    private userRepository: UserRepository,
    private postRepository: PostRepository,
    private postLikeRepository: postLikeRepository
  ){}
  async execute(postId: string, userId: string) {
    await this.postRepository.verifyPostAvailability(postId);
    const isPostLiked = await this.postLikeRepository.verifyIsPostLiked(userId, postId);
    if (!isPostLiked) {
    const postLike = new PostLike()
    postLike.user = await this.userRepository.findUser({ id: userId });
    postLike.post = await this.postRepository.getPostById(postId);
    await this.postLikeRepository.createPostLike(postLike);
    } else {
      await this.postLikeRepository.deletePostLike(userId, postId);
    }
  }
}