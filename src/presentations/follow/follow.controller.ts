import { Body, Controller, Inject, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { FollowUserUseCase } from "src/applications/use-cases/follow/followUser.usecase";
import { GetUserFollowStatusUsecase } from "src/applications/use-cases/follow/GetUserFollowStatus.usecase";
import { UnfollowUserUseCase } from "src/applications/use-cases/follow/unfollowUser.usecase";
import { CurrUserUsecase } from "src/applications/use-cases/user/currUser.usecase";
import { UseCaseProxyModule } from "src/infrastructure/usecase-proxy/usecase-proxy.module";
import { getAuthCookie } from "src/utils/auth/get-auth-cookie";
import { FollowParamsDto } from "./dto/follow.dto";

@Controller('api/follow')
export class FollowController {
  constructor(
    @Inject(UseCaseProxyModule.CURRENT_USER_USECASE) private readonly currUserUseCaseProxy: CurrUserUsecase,
    @Inject(UseCaseProxyModule.GET_USER_FOLLOW_STATUS_USECASE) private readonly getUserFollowStatusUsecase: GetUserFollowStatusUsecase,
    @Inject(UseCaseProxyModule.FOLLOW_USER_USECASE) private readonly followUserUsecase: FollowUserUseCase,
    @Inject(UseCaseProxyModule.UNFOLLOW_USER_USECASE) private readonly unfollowUserUsecase: UnfollowUserUseCase
  ){}
  @Post(':userId')
  async followUnfollowAction(@Req() req:Request,@Body() followParamsDto:FollowParamsDto) {
    const token = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.execute(token);
    const {followingId} = followParamsDto;
    const isFollowing = await this.getUserFollowStatusUsecase.execute(user.id,followingId);
    if(isFollowing) {
      await this.unfollowUserUsecase.execute(user.id,followingId);
    } else {
      await this.followUserUsecase.execute(user.id,followingId);
    }
  }
}