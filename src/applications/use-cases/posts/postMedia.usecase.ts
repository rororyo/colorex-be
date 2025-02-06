import { PostRepository } from 'src/domains/repositories/post/post.repository';
import { UserRepository } from 'src/domains/repositories/user/user.repository';
import { PostMediaDto } from 'src/presentations/posts/dto/postMedia.dto';
import { PostM } from 'src/domains/model/post';
import { HashTagRepository } from 'src/domains/repositories/hashtag/hashtag.repository';
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
