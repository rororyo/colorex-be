import { PostRepository } from "src/domains/repositories/post/post.repository";
import { UserRepository } from "src/domains/repositories/user/user.repository";
import { PostMediaDto } from "src/presentations/posts/dto/postMedia.dto";
import { Post } from "src/infrastructure/entities/post.entity";
export class PostMediaUsecase {
  constructor(
    private userRepository: UserRepository,
    private postRepository: PostRepository
  ){}
  async execute (postMediaDto: PostMediaDto, userId: string) {
    const user = await this.userRepository.findUser({ id: userId });
    const post = new Post();
    post.content = postMediaDto.content;
    post.media_url = 'lorem ipsum';
    post.post_type = postMediaDto.post_type;
    post.title = postMediaDto.title;
    post.user = user.id;
    await this.postRepository.createPost(post);
  }
}