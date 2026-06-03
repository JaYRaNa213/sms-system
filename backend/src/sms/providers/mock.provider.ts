import { Injectable } from '@nestjs/common';
import { SmsProvider, SmsPayload, SmsResponse } from '../interfaces/sms-provider.interface';

@Injectable()
export class MockProvider implements SmsProvider {
  async send(payload: SmsPayload): Promise<SmsResponse> {
    const messageId = `MOCK_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    // Simulate random delivery delay between 50ms to 200ms
    await new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 150));

    return {
      success: true,
      provider: 'mock',
      messageId,
      raw: { status: 'mock_sent', timestamp: new Date() },
    };
  }

  async sendBulk(payloads: SmsPayload[]): Promise<SmsResponse[]> {
    return Promise.all(payloads.map((payload) => this.send(payload)));
  }

  async getStatus(messageId: string): Promise<any> {
    return {
      messageId,
      status: 'DELIVERED', // Always delivered in mock
      provider: 'mock',
      timestamp: new Date(),
    };
  }
}
