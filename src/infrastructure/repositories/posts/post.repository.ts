import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'crypto';
import { PostM } from 'src/domains/model/post';
import { UserM } from 'src/domains/model/user';
import { PostRepository } from 'src/domains/repositories/post/post.repository';
import { CommentLike } from 'src/infrastructure/entities/commentLike.entity';
import { Post } from 'src/infrastructure/entities/post.entity';
import { PostLike } from 'src/infrastructure/entities/postLike.entity';
import { ReplyLike } from 'src/infrastructure/entities/replyLike.entity';
import { EditMediaDto } from 'src/presentations/posts/dto/editMedia.dto';
import { PostMediaDto } from 'src/presentations/posts/dto/postMedia.dto';
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
  async verifyPostOwnership(userId: string, postId: string): Promise<boolean> {
    const post = await this.postRepository.findOneBy({ id: postId,user: { id: userId } });
    if(!post) {
      throw new UnauthorizedException('You are not authorized to perform this action');
    }
    return true;
  }

  async getPaginatedPosts(
    searchQuery: string,
    page: number,
    limit: number
  ): Promise<{
    posts: Partial<PostM[]>;
    total: number;
  }> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoin('post.postLikes', 'postLikes')
      .leftJoinAndSelect('post.user', 'user')
      .addSelect(['user.id', 'user.email', 'user.username'])
      .addSelect('COUNT(postLikes.id)', 'likeCount');
  
    // Add search condition for post title if searchQuery is provided
    if (searchQuery && searchQuery.trim()) {
      queryBuilder.where('LOWER(post.title) LIKE LOWER(:searchTerm)', {
        searchTerm: `%${searchQuery.trim()}%`
      });
    }
  
    // Get total count before pagination
    const total = await queryBuilder.getCount();
  
    const { entities: posts, raw } = await queryBuilder
      .groupBy('post.id')
      .addGroupBy('user.id')
      .skip((page - 1) * limit)
      .take(limit)
      .getRawAndEntities();
  
    const mappedPosts = posts.map((post, index) => ({
      ...post,
      user: {
        id: post.user.id,
        email: post.user.email,
        username: post.user.username,
      },
      likeCount: parseInt(raw[index]?.likeCount || '0', 10),
    }));
  
    return {
      posts: mappedPosts as PostM[],
      total,
    };
  }
  async getPostsByUserId(page: number, limit: number, userId: string): Promise<{
    posts: Partial<PostM>[];
    total: number;
  }> {
    const {entities: posts, raw} = await this.postRepository.createQueryBuilder('post')
    .where('post.user_id = :userId', { userId })
    .leftJoin('post.postLikes', 'postLikes') // Join postLikes for likeCount
    .leftJoinAndSelect('post.user', 'user') // Join user to include user data
    .addSelect(['user.id', 'user.email', 'user.username']) // Select only specific user fields
    .addSelect('COUNT(postLikes.id)', 'likeCount') // Aggregate likeCount
    .groupBy('post.id')
    .addGroupBy('user.id') // Ensure grouping by user ID to avoid conflicts
    .skip((page - 1) * limit)
    .take(limit)
    .getRawAndEntities();

  const mappedPosts = posts.map((post, index) => ({
    ...post,
    user: post.user as UserM ,
    likeCount: parseInt(raw[index]?.likeCount || '0', 10),
  }));

  const total = mappedPosts.length;

  return {
    posts: mappedPosts,
    total,
  };
  }
  async getPostById(id: string): Promise<PostM> {
    const post = await this.postRepository.findOneBy({ id });
    return post;
  }
  async getDetailedPostById(id: string): Promise<any> {
    const result = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.hashTags', 'hashTags')
      .leftJoin('post.postLikes', 'postLikes') // Join postLikes for post like count
      .leftJoinAndSelect('post.comments', 'comments') // Include comments
      .leftJoin('comments.commentLikes', 'commentLikes') // Join commentLikes for like count
      .leftJoinAndSelect('comments.replies', 'replies') // Include replies
      .leftJoin('replies.replyLikes', 'replyLikes') // Join replyLikes for like count
      .leftJoinAndSelect('post.user', 'postUser') // Include user for post
      .addSelect(['postUser.id', 'postUser.email', 'postUser.username']) // Select specific fields for post user
      .leftJoinAndSelect('comments.user', 'commentUser') // Include user for comments
      .addSelect(['commentUser.id', 'commentUser.email', 'commentUser.username']) // Select specific fields for comment user
      .leftJoinAndSelect('replies.user', 'replyUser') // Include user for replies
      .addSelect(['replyUser.id', 'replyUser.email', 'replyUser.username']) // Select specific fields for reply user
      .addSelect('COUNT(DISTINCT postLikes.id)', 'postLikeCount') // Count post likes
      .addSelect('COUNT(DISTINCT commentLikes.id)', 'commentLikeCount') // Count comment likes
      .addSelect('COUNT(DISTINCT replyLikes.id)', 'replyLikeCount') // Count reply likes
      .groupBy('post.id')
      .addGroupBy('postUser.id')
      .addGroupBy('comments.id')
      .addGroupBy('commentUser.id')
      .addGroupBy('replies.id')
      .addGroupBy('replyUser.id') // Group by reply user ID
      .addGroupBy('hashTags.id') // Fix for error
      .addGroupBy('hashTags.name') // Include more fields if needed
      .where('post.id = :id', { id })
      .getRawAndEntities();
  
    if (!result.entities[0]) throw new Error('Post not found');
  
    const postEntity = result.entities[0];
    const rawData = result.raw;
  
    const commentsWithReplies = postEntity.comments.map((comment) => {
      const commentLikeCount = parseInt(
        rawData.find((data) => data.comments_id === comment.id)?.commentLikeCount || '0',
        10,
      );
  
      const repliesWithLikeCount = comment.replies.map((reply) => {
        const replyLikeCount = parseInt(
          rawData.find((data) => data.replies_id === reply.id)?.replyLikeCount || '0',
          10,
        );
  
        return {
          ...reply,
          user: {
            id: reply.user.id,
            email: reply.user.email,
            username: reply.user.username,
          },
          likeCount: replyLikeCount,
        };
      });
  
      return {
        ...comment,
        user: {
          id: comment.user.id,
          email: comment.user.email,
          username: comment.user.username,
        },
        likeCount: commentLikeCount,
        replies: repliesWithLikeCount,
      };
    });
  
    return {
      id: postEntity.id,
      user: {
        id: postEntity.user.id,
        email: postEntity.user.email,
        username: postEntity.user.username,
      },
      post_type: postEntity.post_type,
      media_url: postEntity.media_url,
      title: postEntity.title,
      content: postEntity.content,
      hashTags: postEntity.hashTags,
      created_at: postEntity.created_at,
      updated_at: postEntity.updated_at,
      likeCount: parseInt(rawData[0]?.postLikeCount || '0', 10),
      comments: commentsWithReplies,
    };
  }
  async editPost(id: string, post: Partial<PostM>): Promise<void> {
    const existingPost = await this.postRepository.findOne({
      where: { id },
      relations: ['hashTags'],
    });
  
    if (!existingPost) {
      throw new Error('Post not found');
    }
  
    // Update simple fields
    Object.assign(existingPost, post);
  
    // If hashtags are updated, replace them
    if (post.hashTags) {
      existingPost.hashTags = post.hashTags; // Assign new hashtags
    }
  
    await this.postRepository.save(existingPost);
  }
  
  async deletePost(id: string): Promise<void> {
    await this.postRepository.delete({ id });
  }
}
