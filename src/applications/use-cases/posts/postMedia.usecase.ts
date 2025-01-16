import { PostRepository } from "src/domains/repositories/post/post.repository";
import { UserRepository } from "src/domains/repositories/user/user.repository";
import { PostMediaDto } from "src/presentations/posts/dto/postMedia.dto";
import { PostM } from "src/domains/model/post";
export class PostMediaUsecase {
  constructor(
    private userRepository: UserRepository,
    private postRepository: PostRepository
  ){}
  async execute (postMediaDto: PostMediaDto, userId: string) {
    const user = await this.userRepository.findUser({ id: userId });
    const post = new PostM();
    post.content = postMediaDto.content;
    post.media_url = 'lorem ipsum';
    post.post_type = postMediaDto.post_type;
    post.title = postMediaDto.title;
    post.user = user;
    await this.postRepository.createPost(post);
  }
}