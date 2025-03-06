import { Module } from '@nestjs/common';
import { UseCaseProxyModule } from 'src/infrastructure/usecase-proxy/usecase-proxy.module';
import { CronController } from './cron.controller';

@Module({
  imports: [UseCaseProxyModule.register()],
  controllers: [CronController],
})
export class CronModule {}
