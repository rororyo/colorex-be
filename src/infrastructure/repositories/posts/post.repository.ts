import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostM } from 'src/domains/model/post';
import { PostRepository } from 'src/domains/repositories/post/post.repository';
import { Post } from 'src/infrastructure/entities/post.entity';
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
  async getDetailedPostById(id: string): Promise<PostM> {
    const postEntity = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('comments.user', 'commentUser')
      .leftJoinAndSelect('comments.replies', 'replies')
      .leftJoinAndSelect('replies.user', 'replyUser')
      .select([
        'post',
        'user.id',
        'user.username',
        'user.email',
        'comments',
        'commentUser.id',
        'commentUser.username',
        'commentUser.email',
        'replies',
        'replyUser.id',
        'replyUser.username',
        'replyUser.email'
      ])
      .where('post.id = :id', { id })
      .orderBy({
        'post.created_at': 'DESC',
        'comments.created_at': 'DESC',
        'replies.created_at': 'DESC'
      })
      .getOne();
    return postEntity;
  }
  async deletePost(id: string): Promise<void> {
    await this.postRepository.delete({ id });
  }
}
