import { Body, Controller, Get, Inject, Param, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { FollowUserUseCase } from "src/applications/use-cases/follow/followUser.usecase";
import { GetUserFollowStatusUsecase } from "src/applications/use-cases/follow/GetUserFollowStatus.usecase";
import { UnfollowUserUseCase } from "src/applications/use-cases/follow/unfollowUser.usecase";
import { CurrUserUsecase } from "src/applications/use-cases/user/currUser.usecase";
import { UseCaseProxyModule } from "src/infrastructure/usecase-proxy/usecase-proxy.module";
import { getAuthCookie } from "src/utils/auth/get-auth-cookie";
import { FollowParamsDto, UserFollowParamsDto } from "./dto/follow.dto";
import { UseCaseProxy } from "src/infrastructure/usecase-proxy/usecase-proxy";
import { JwtAuthGuard } from "src/infrastructure/auth/guards/jwt-auth.guard";
import { GetUserFollowerUseCase } from "src/applications/use-cases/follow/getUserFollower.usecase";
import { GetUserFollowingUseCase } from "src/applications/use-cases/follow/getUserFollowing.usecase";

@Controller('api/follow')
export class FollowController {
  constructor(
    @Inject(UseCaseProxyModule.CURRENT_USER_USECASE) private readonly currUserUseCaseProxy: UseCaseProxy<CurrUserUsecase>,
    @Inject(UseCaseProxyModule.GET_USER_FOLLOW_STATUS_USECASE) private readonly getUserFollowStatusUsecase: UseCaseProxy<GetUserFollowStatusUsecase>,
    @Inject(UseCaseProxyModule.FOLLOW_USER_USECASE) private readonly followUserUsecase: UseCaseProxy<FollowUserUseCase>,
    @Inject(UseCaseProxyModule.UNFOLLOW_USER_USECASE) private readonly unfollowUserUsecase: UseCaseProxy<UnfollowUserUseCase>,
    @Inject(UseCaseProxyModule.GET_USER_FOLLOWERS_USECASE) private readonly getUserFollowersUsecase: UseCaseProxy<GetUserFollowerUseCase>,
    @Inject(UseCaseProxyModule.GET_USER_FOLLOWING_USECASE) private readonly getUserFollowingUsecase: UseCaseProxy<GetUserFollowingUseCase>,
  ){}
  @UseGuards(JwtAuthGuard)
  @Post(':followingId')
  async followUnfollowAction(@Req() req:Request,@Param() followParamsDto:FollowParamsDto) {
    const token = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.getInstance().execute(token);
    const {followingId} = followParamsDto;
    const isFollowing = await this.getUserFollowStatusUsecase.getInstance().execute(user.id,followingId);
    let followMsg= "";
    if(isFollowing) {
      followMsg = await this.unfollowUserUsecase.getInstance().execute(user.id,followingId);
    } else {
      followMsg = await this.followUserUsecase.getInstance().execute(user.id,followingId);
    }
    return {
      status:'success',
      message: followMsg
    }
  }
  @Get('/followers/:userId')
  async getFollowers(@Param() params:UserFollowParamsDto) {
    const {userId} = params;
    const followers = await this.getUserFollowersUsecase.getInstance().execute(userId);
    return {
      status:'success',
      message: 'Followers fetched successfully',
      data:followers
    }
  }
  @Get('/following/:userId')
  async getFollowing(@Param() params:UserFollowParamsDto) {
  const {userId} = params;
  const following = await this.getUserFollowingUsecase.getInstance().execute(userId);  
  return{
    status:'success',
    message: 'Following fetched successfully',
    data:following
  }
  }
}