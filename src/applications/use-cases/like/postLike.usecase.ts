import { PostLikeM } from "src/domains/model/postLike";
import { PostLikeRepository } from "src/domains/repositories/like/postLike.repository";
import { PostRepository } from "src/domains/repositories/post/post.repository";
import { UserRepository } from "src/domains/repositories/user/user.repository";

export class PostLikeUsecase {
  constructor(
    private userRepository: UserRepository,
    private postRepository: PostRepository,
    private postLikeRepository: PostLikeRepository
  ){}
  async execute(postId: string, userId: string) {
    await this.postRepository.verifyPostAvailability(postId);
    const isPostLiked = await this.postLikeRepository.verifyIsPostLiked(userId, postId);
    if (!isPostLiked) {
    const postLike = new PostLikeM()
    postLike.user = await this.userRepository.findUser({ id: userId });
    postLike.post = await this.postRepository.getPostById(postId);
    await this.postLikeRepository.createPostLike(postLike);
    return 'Post Liked Successfully';
    } else {
      await this.postLikeRepository.deletePostLike(userId, postId);
      return 'Post Unliked Successfully';
    }
  }
}