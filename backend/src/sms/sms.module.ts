import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SmsService } from './sms.service';
import { SmsController } from './sms.controller';
import { ProviderFactory } from './providers/provider.factory';
import { MockProvider } from './providers/mock.provider';
import { MSG91Provider } from './providers/msg91.provider';
import { SmsLogger } from './logger/sms.logger';

@Module({
  imports: [HttpModule],
  controllers: [SmsController],
  providers: [
    SmsService,
    ProviderFactory,
    MockProvider,
    MSG91Provider,
    SmsLogger
  ],
  exports: [SmsService],
})
export class SmsModule {}
