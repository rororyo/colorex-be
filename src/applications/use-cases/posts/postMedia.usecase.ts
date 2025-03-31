import { PostRepository } from '../../../domains/repositories/post/post.repository';
import { UserRepository } from '../../../domains/repositories/user/user.repository';
import { PostMediaDto } from '../../../presentations/posts/dto/postMedia.dto';
import { PostM } from '../../../domains/model/post';
import { HashTagRepository } from '../../../domains/repositories/hashtag/hashtag.repository';
export class PostMediaUsecase {
  constructor(
    private userRepository: UserRepository,
    private postRepository: PostRepository,
    private hashTagRepository: HashTagRepository,
  ) {}

  async execute(postMediaDto: PostMediaDto, userId: string) {
    const user = await this.userRepository.findUser({ id: userId });
    const post = new PostM();

    await Promise.all(
      postMediaDto.hashtags.map(async (hashtag) => {
        const existingHashtag =
          await this.hashTagRepository.verifyHashtagAvailability(hashtag);
        if (!existingHashtag) {
          await this.hashTagRepository.createHashtag(hashtag);
        }
      }),
    );

    const hashtags = await Promise.all(
      postMediaDto.hashtags.map((name) =>
        this.hashTagRepository.findHashtagByName(name),
      ),
    );
    post.hashTags = hashtags;

    post.content = postMediaDto.content;
    post.media_url = postMediaDto.media_url;
    post.post_type = postMediaDto.post_type;
    post.title = postMediaDto.title;
    post.user = user;

    await this.postRepository.createPost(post);
  }
}
