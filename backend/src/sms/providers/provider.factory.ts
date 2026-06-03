import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SmsProvider } from '../interfaces/sms-provider.interface';
import { MockProvider } from './mock.provider';
import { MSG91Provider } from './msg91.provider';

@Injectable()
export class ProviderFactory {
  constructor(
    private readonly configService: ConfigService,
    private readonly mockProvider: MockProvider,
    private readonly msg91Provider: MSG91Provider,
  ) {}

  getProvider(): SmsProvider {
    const provider = this.configService.get<string>('SMS_PROVIDER', 'mock');
    
    switch (provider.toLowerCase()) {
      case 'mock':
        return this.mockProvider;
      case 'msg91':
        return this.msg91Provider;
      default:
        throw new Error(`Unsupported SMS provider: ${provider}`);
    }
  }
}
