import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostM } from 'src/domains/model/post';
import { PostRepository } from 'src/domains/repositories/post/post.repository';
import { Post } from 'src/infrastructure/entities/post.entity';
import { PostMediaDto } from 'src/presentations/posts/dto/postMedia.dto';
import { Repository } from 'typeorm';

@Injectable()
export class PostRepositoryOrm implements PostRepository {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}
  async createPost(post: PostM): Promise<void> {
    const postEntity = this.postRepository.create(post);
    await this.postRepository.save(postEntity);
  }
  async verifyPostAvailability(id: string): Promise<boolean> {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException('Post not found');
    } else {
      return true;
    }
  }
  async getPostById(id: string): Promise<PostM> {
    const post = await this.postRepository.findOneBy({ id });
    return post;
  }
  async deletePost(id: string): Promise<void> {
    await this.postRepository.delete({ id });
  }
}
