import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostM } from '../../../domains/model/post';
import { PostRepository } from '../../../domains/repositories/post/post.repository';
import { Post } from '../../../infrastructure/entities/post.entity';
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
  async verifyPostOwnership(userId: string, postId: string): Promise<boolean> {
    const post = await this.postRepository.findOneBy({
      id: postId,
      user: { id: userId },
    });
    if (!post) {
      throw new UnauthorizedException(
        'You are not authorized to perform this action',
      );
    }
    return true;
  }

  async getPaginatedPosts(
    searchQuery: string,
    page: number,
    limit: number,
  ): Promise<{
    posts: Partial<PostM[]>;
    total: number;
  }> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.hashTags', 'hashTags')
      .leftJoin('post.postLikes', 'postLikes')
      .leftJoinAndSelect('post.user', 'user')
      .addSelect([
        'user.id',
        'user.email',
        'user.username',
        'user.avatarUrl',
        'user.role',
        'user.colorType',
      ])
      .addSelect('COUNT(postLikes.id)', 'likeCount')
      .orderBy('post.created_at', 'DESC');

    // Add search condition for post title if searchQuery is provided
    if (searchQuery && searchQuery.trim()) {
      queryBuilder.where('LOWER(post.title) LIKE LOWER(:searchTerm)', {
        searchTerm: `%${searchQuery.trim()}%`,
      });
    }

    // Get total count before pagination
    const total = await queryBuilder.getCount();

    const { entities: posts, raw } = await queryBuilder
      .groupBy('post.id')
      .addGroupBy('user.id')
      .addGroupBy('hashTags.id')
      .addGroupBy('hashTags.name')
      .orderBy('post.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getRawAndEntities();

    const mappedPosts = posts.map((post, index) => ({
      ...post,
      user: {
        id: post.user.id,
        email: post.user.email,
        username: post.user.username,
        avatarUrl: post.user.avatarUrl,
        role: post.user.role,
        colorType: post.user.colorType,
      },
      likeCount: parseInt(raw[index]?.likeCount || '0', 10),
    }));

    return {
      posts: mappedPosts as PostM[],
      total,
    };
  }
  async getPostsByUserId(
    page: number,
    limit: number,
    userId: string,
    searchQuery: string,
  ): Promise<{ posts: Partial<PostM>[]; total: number }> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .where('post.user_id = :userId', { userId })
      .leftJoinAndSelect('post.hashTags', 'hashTags')
      .leftJoin('post.postLikes', 'postLikes')
      .leftJoinAndSelect('post.user', 'user')
      .addSelect([
        'user.id',
        'user.email',
        'user.username',
        'user.avatarUrl',
        'user.role',
        'user.colorType',
      ])
      .addSelect('COUNT(postLikes.id)', 'likeCount')
      .orderBy('post.created_at', 'DESC');

    // Add search condition for post title if searchQuery is provided
    if (searchQuery && searchQuery.trim()) {
      queryBuilder.where('LOWER(post.title) LIKE LOWER(:searchTerm)', {
        searchTerm: `%${searchQuery.trim()}%`,
      });
    }
    // Get total count before pagination
    const total = await queryBuilder.getCount();

    const { entities: posts, raw } = await queryBuilder
      .groupBy('post.id')
      .addGroupBy('user.id')
      .addGroupBy('hashTags.id')
      .addGroupBy('hashTags.name')
      .skip((page - 1) * limit)
      .take(limit)
      .getRawAndEntities();

    const mappedPosts = posts.map((post, index) => ({
      ...post,
      user: {
        id: post.user.id,
        email: post.user.email,
        username: post.user.username,
        avatarUrl: post.user.avatarUrl,
        role: post.user.role,
        colorType: post.user.colorType,
      },
      likeCount: parseInt(raw[index]?.likeCount || '0', 10),
    }));

    return {
      posts: mappedPosts as PostM[],
      total,
    };
  }
  async getPostsByHashTagName(
    page: number,
    limit: number,
    hashTagName: string,
    searchQuery: string,
  ): Promise<{ posts: Partial<PostM>[]; total: number }> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.hashTags', 'hashTags')
      .leftJoin('post.postLikes', 'postLikes')
      .leftJoin('post.user', 'user')
      .addSelect([
        'user.id',
        'user.email',
        'user.username',
        'user.avatarUrl',
        'user.role',
        'user.colorType',
      ])
      .addSelect('COUNT(postLikes.id)', 'likeCount')
      .orderBy('post.created_at', 'DESC');

    if (searchQuery && searchQuery.trim()) {
      queryBuilder.where('LOWER(post.title) LIKE LOWER(:searchTerm)', {
        searchTerm: `%${searchQuery.trim()}%`,
      });
    }
    if (hashTagName && hashTagName.trim()) {
      queryBuilder.andWhere(
        `EXISTS (
          SELECT 1 FROM post_hash_tags_hash_tag pht
          JOIN hash_tag ht ON ht.id = pht."hashTagId"
          WHERE pht."postId" = post.id
          AND LOWER(ht.name) LIKE LOWER(:hashTagName)
        )`,
        { hashTagName: `%${hashTagName.trim()}%` },
      );
    }

    // 🔹 Get total before pagination
    const total = await queryBuilder.getCount();

    // 🔹 Apply pagination
    const { entities: posts, raw } = await queryBuilder
      .groupBy('post.id')
      .addGroupBy('user.id')
      .addGroupBy('hashTags.id')
      .addGroupBy('hashTags.name')
      .skip((page - 1) * limit)
      .take(limit)
      .getRawAndEntities();

    const mappedPosts = posts.map((post, index) => ({
      ...post,
      likeCount: parseInt(raw[index]?.likeCount || '0', 10),
    }));

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
      .addSelect([
        'postUser.id',
        'postUser.email',
        'postUser.username',
        'postUser.avatarUrl',
        'postUser.role',
        'postUser.colorType',
      ]) // Select specific fields for post user
      .leftJoinAndSelect('comments.user', 'commentUser') // Include user for comments
      .addSelect([
        'commentUser.id',
        'commentUser.email',
        'commentUser.username',
        'commentUser.avatarUrl',
        'commentUser.role',
        'commentUser.colorType',
      ]) // Select specific fields for comment user
      .leftJoinAndSelect('replies.user', 'replyUser') // Include user for replies
      .addSelect([
        'replyUser.id',
        'replyUser.email',
        'replyUser.username',
        'replyUser.avatarUrl',
        'replyUser.role',
        'replyUser.colorType',
      ]) // Select specific fields for reply user
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
        rawData.find((data) => data.comments_id === comment.id)
          ?.commentLikeCount || '0',
        10,
      );

      const repliesWithLikeCount = comment.replies.map((reply) => {
        const replyLikeCount = parseInt(
          rawData.find((data) => data.replies_id === reply.id)
            ?.replyLikeCount || '0',
          10,
        );

        return {
          ...reply,
          user: {
            id: reply.user.id,
            email: reply.user.email,
            username: reply.user.username,
            avatarUrl: reply.user.avatarUrl,
            role: reply.user.role,
            colorType: reply.user.colorType,
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
          avatarUrl: comment.user.avatarUrl,
          role: comment.user.role,
          colorType: comment.user.colorType,
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
        avatarUrl: postEntity.user.avatarUrl,
        role: postEntity.user.role,
        colorType: postEntity.user.colorType,
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
  async getPostsByUserIds(
    page: number,
    limit: number,
    userIds: string[],
    searchQuery: string,
  ): Promise<{ posts: PostM[]; total: number }> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.hashTags', 'hashTags')
      .leftJoin('post.user', 'user')
      .leftJoin('post.postLikes', 'postLikes')
      .addSelect([
        'user.id',
        'user.email',
        'user.username',
        'user.role',
        'user.avatarUrl',
        'user.colorType',
      ])
      .addSelect('COUNT(postLikes.id)', 'likeCount')
      .where('post.user_id IN (:...userIds)', { userIds })
      .groupBy('post.id')
      .addGroupBy('post.title')
      .addGroupBy('post.content')
      .addGroupBy('post.media_url')
      .addGroupBy('post.post_type')
      .addGroupBy('post.created_at')
      .addGroupBy('post.updated_at')
      .addGroupBy('user.id')
      .addGroupBy('user.email')
      .addGroupBy('user.username')
      .addGroupBy('user.role')
      .addGroupBy('hashTags.id')
      .addGroupBy('hashTags.name')
      .orderBy('post.created_at', 'DESC');

    if (searchQuery && searchQuery.trim()) {
      queryBuilder.where('LOWER(post.title) LIKE LOWER(:searchTerm)', {
        searchTerm: `%${searchQuery.trim()}%`,
      });
    }

    const total = await queryBuilder.getCount();

    const { entities: posts, raw } = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getRawAndEntities();

    const mappedPosts = posts.map((post, index) => ({
      ...post,
      likeCount: parseInt(raw[index]?.likeCount || '0', 10),
    }));

    return { posts: mappedPosts, total };
  }
  async editPost(id: string, post: Partial<PostM>): Promise<void> {
    const existingPost = await this.postRepository.findOne({
      where: { id },
      relations: ['hashTags'],
    });
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
