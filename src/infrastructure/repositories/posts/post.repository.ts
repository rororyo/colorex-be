import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostM } from 'src/domains/model/post';
import { PostRepository } from 'src/domains/repositories/post/post.repository';
import { CommentLike } from 'src/infrastructure/entities/commentLike.entity';
import { Post } from 'src/infrastructure/entities/post.entity';
import { PostLike } from 'src/infrastructure/entities/postLike.entity';
import { ReplyLike } from 'src/infrastructure/entities/replyLike.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostRepositoryOrm implements PostRepository {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(PostLike)
    private readonly postLikeRepository: Repository<PostLike>,
    @InjectRepository(CommentLike)
    private readonly commentLikeRepository: Repository<CommentLike>,
    @InjectRepository(ReplyLike)
    private readonly replyLikeRepository: Repository<ReplyLike>,
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
    const result = await this.postRepository
      .createQueryBuilder('post')
      .leftJoin('post.postLikes', 'postLikes') // Join postLikes for counting
      .leftJoinAndSelect('post.comments', 'comments') // Include comments
      .leftJoin('comments.commentLikes', 'commentLikes') // Join commentLikes for counting
      .leftJoinAndSelect('comments.replies', 'replies') // Include replies
      .leftJoin('replies.replyLikes', 'replyLikes') // Join replyLikes for counting
      .addSelect('COUNT(DISTINCT postLikes.id)', 'postLikeCount') // Aggregate post likes
      .addSelect('COUNT(DISTINCT commentLikes.id)', 'commentLikeCount') // Aggregate comment likes
      .addSelect('COUNT(DISTINCT replyLikes.id)', 'replyLikeCount') // Aggregate reply likes
      .groupBy('post.id')
      .addGroupBy('comments.id') // Ensure comments are grouped
      .addGroupBy('replies.id') // Ensure replies are grouped
      .where('post.id = :id', { id })
      .getRawAndEntities();
  
    if (!result.entities[0]) throw new Error('Post not found');
  
    // Extract entities and raw data
    const postEntity = result.entities[0];
    const rawData = result.raw;
  
    // Map comments and replies with like counts
    const commentsWithReplies = postEntity.comments.map((comment) => {
      const commentLikeCount = parseInt(
        rawData.find((data) => data.comments_id === comment.id)?.commentLikeCount || '0',
        10
      );
  
      const repliesWithLikeCount = comment.replies.map((reply) => {
        const replyLikeCount = parseInt(
          rawData.find((data) => data.replies_id === reply.id)?.replyLikeCount || '0',
          10
        );
  
        return {
          ...reply,
          likeCount: replyLikeCount, // Add like count to replies
        };
      });
  
      return {
        ...comment,
        likeCount: commentLikeCount, // Add like count to comments
        replies: repliesWithLikeCount, // Include mapped replies
      };
    });
  
    // Return mapped PostM
    return {
      id: postEntity.id,
      user: postEntity.user as any, // Map user to your domain model if needed
      post_type: postEntity.post_type,
      media_url: postEntity.media_url,
      title: postEntity.title,
      content: postEntity.content,
      created_at: postEntity.created_at,
      updated_at: postEntity.updated_at,
      comments: commentsWithReplies, // Include mapped comments
      likeCount: parseInt(rawData[0]?.postLikeCount || '0', 10), // Add post like count
      postLikes: undefined, // Exclude postLikes from the response
    };
  }
  async deletePost(id: string): Promise<void> {
    await this.postRepository.delete({ id });
  }
}
