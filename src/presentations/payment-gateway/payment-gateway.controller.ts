// import { Controller, Post, UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
// import { UseCaseProxy } from 'src/infrastructure/usecase-proxy/usecase-proxy';

// @Controller('api/pay')
// export class SubscriptionController {
//   constructor(
//     private readonly createSubcriptionPaymentUseCaseProxy: UseCaseProxy<CreateSubcriptionPaymentUseCase>,
//   ) {}
//   @UseGuards(JwtAuthGuard)
//   @Post('/subscription')

//   async paySubscription() {
//     const orderId = 'SUB-'
//   }
// }
