import { Module } from "@nestjs/common";
import { MidtransService } from "./midtrans.service";

export const PAYMENT_GATEWAY_TOKEN = Symbol('IMidtrans');
@Module({
  providers: [
    {
      provide: PAYMENT_GATEWAY_TOKEN,
      useClass: MidtransService,
    },
  ],
  exports: [PAYMENT_GATEWAY_TOKEN],
})
export class MidtransModule {}