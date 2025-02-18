import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { FollowUserUseCase } from 'src/applications/use-cases/follow/followUser.usecase';
import { GetUserFollowStatusUsecase } from 'src/applications/use-cases/follow/GetUserFollowStatus.usecase';
import { UnfollowUserUseCase } from 'src/applications/use-cases/follow/unfollowUser.usecase';
import { CurrUserUsecase } from 'src/applications/use-cases/user/currUser.usecase';
import { UseCaseProxyModule } from 'src/infrastructure/usecase-proxy/usecase-proxy.module';
import { getAuthCookie } from 'src/utils/auth/get-auth-cookie';
import { FollowParamsDto, UserFollowParamsDto, UserFollowQueryDto } from './dto/follow.dto';
import { UseCaseProxy } from 'src/infrastructure/usecase-proxy/usecase-proxy';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { GetUserFollowerUseCase } from 'src/applications/use-cases/follow/getUserFollower.usecase';
import { GetUserFollowingUseCase } from 'src/applications/use-cases/follow/getUserFollowing.usecase';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('follow')
@Controller('api/follow')
export class FollowController {
  constructor(
    @Inject(UseCaseProxyModule.CURRENT_USER_USECASE)
    private readonly currUserUseCaseProxy: UseCaseProxy<CurrUserUsecase>,
    @Inject(UseCaseProxyModule.GET_USER_FOLLOW_STATUS_USECASE)
    private readonly getUserFollowStatusUsecase: UseCaseProxy<GetUserFollowStatusUsecase>,
    @Inject(UseCaseProxyModule.FOLLOW_USER_USECASE)
    private readonly followUserUsecase: UseCaseProxy<FollowUserUseCase>,
    @Inject(UseCaseProxyModule.UNFOLLOW_USER_USECASE)
    private readonly unfollowUserUsecase: UseCaseProxy<UnfollowUserUseCase>,
    @Inject(UseCaseProxyModule.GET_USER_FOLLOWERS_USECASE)
    private readonly getUserFollowersUsecase: UseCaseProxy<GetUserFollowerUseCase>,
    @Inject(UseCaseProxyModule.GET_USER_FOLLOWING_USECASE)
    private readonly getUserFollowingUsecase: UseCaseProxy<GetUserFollowingUseCase>,
  ) {}
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'follow or unfollow user' })
  @ApiParam({
    name: 'followingId',
    required: true,
    type: 'string',
    description: 'following user id',
  })
  @ApiResponse({
    status: 200,
    description: 'follow or unfollow user',
    schema: {
      example: {
        status: 'success',
        message: 'User followed successfully',
      },
    },
  })
  @Post(':followingId')
  async followUnfollowAction(
    @Req() req: Request,
    @Param() followParamsDto: FollowParamsDto,
  ) {
    const token = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.getInstance().execute(token);
    const { followingId } = followParamsDto;
    const isFollowing = await this.getUserFollowStatusUsecase
      .getInstance()
      .execute(user.id, followingId);
    let followMsg = '';
    if (isFollowing) {
      followMsg = await this.unfollowUserUsecase
        .getInstance()
        .execute(user.id, followingId);
    } else {
      followMsg = await this.followUserUsecase
        .getInstance()
        .execute(user.id, followingId);
    }
    return {
      status: 'success',
      message: followMsg,
    };
  }
  @ApiOperation({ summary: "get a user's followers" })
  @ApiParam({
    name: 'userId',
    required: true,
    type: 'string',
    description: 'user id',
  })
  @ApiResponse({
    status: 200,
    description: 'get a user followers',
    schema: {
      example: {
        status: 'success',
        message: 'Followers fetched successfully',
        data: {
          followers: [
            {
              id: '8eccff6a-f4a7-4502-9103-e725669b9011',
              email: 'test@admin.com',
              username: 'admin',
              password:
                '$argon2id$v=19$m=65536,t=3,p=4$RSxRbgC2WQEV9463TTNCPg$d1X5D3Lvk0NS6wyn5hN7MuerP2kZ568nLNnf3zX77Og',
              role: 'user',
              created_at: '2025-01-14T15:40:01.774Z',
              subscribed_at: null,
              followersCount: 0,
              followingCount: 1,
            },
          ],
          count: 1,
        },
      },
    },
  })
  @Get('/followers/:userId')
  async getFollowers(@Param() params: UserFollowParamsDto,@Query() query: UserFollowQueryDto) {
    const { userId } = params;
    const { page, limit } = query;
    const followers = await this.getUserFollowersUsecase
      .getInstance()
      .execute(userId,page,limit);
    return {
      status: 'success',
      message: 'Followers fetched successfully',
      data: followers,
    };
  }

  @ApiOperation({ summary: "get a user's following" })
  @ApiParam({
    name: 'userId',
    required: true,
    type: 'string',
    description: 'id of the user',
  })
  @ApiResponse({
    status:200,
    description: "get a user's following",
    schema:{
      example:{
        status: 'success',
        message: 'Following fetched successfully',
        data:  {
          "following": [
              {
                  "id": "95ea813f-3762-4eb2-9336-a4556d73214c",
                  "email": "test@mail.com",
                  "username": "test",
                  "password": "$argon2id$v=19$m=65536,t=3,p=4$5j6BLSqeA301CXROti6C+g$i4XSOgmCGByIu5tozc1zz4WectgD1sVSnHGasJdbul8",
                  "role": "user",
                  "created_at": "2025-01-18T06:44:44.747Z",
                  "subscribed_at": null,
                  "followersCount": 1,
                  "followingCount": 0
              }
          ],
          "count": 1
      },
      }
    }

  })

  @Get('/following/:userId')
  async getFollowing(@Param() params: UserFollowParamsDto,@Query() query: UserFollowQueryDto) {
    const { userId } = params;
    const { page, limit } = query;
    const following = await this.getUserFollowingUsecase
      .getInstance()
      .execute(userId,page,limit);
    return {
      status: 'success',
      message: 'Following fetched successfully',
      data: following,
    };
  }
}
