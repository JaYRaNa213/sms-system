import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SmsProvider, SmsPayload, SmsResponse } from '../interfaces/sms-provider.interface';
import { MSG91_URLS } from '../constants/msg91.constants';
import { ProviderException } from '../exceptions/provider.exception';

@Injectable()
export class MSG91Provider implements SmsProvider {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async send(payload: SmsPayload): Promise<SmsResponse> {
    const apiKey = this.configService.get<string>('MSG91_API_KEY');
    const senderId = this.configService.get<string>('MSG91_SENDER_ID');
    const templateId = payload.templateId || this.configService.get<string>('MSG91_TEMPLATE_ID');

    if (!apiKey) {
      throw new ProviderException('msg91', 'MSG91_API_KEY is not configured');
    }

    try {
      const raw = await firstValueFrom(
        this.httpService.post(
          MSG91_URLS.SEND_SMS,
          {
            template_id: templateId,
            short_url: '0',
            recipients: [
              {
                mobiles: payload.mobile.replace('+', ''),
                message: payload.message,
              },
            ],
          },
          {
            headers: {
              authkey: apiKey,
              'Content-Type': 'application/json',
              accept: 'application/json',
            },
          },
        ) as any,
      );
      const response = raw as { data: { type: string; message: string } };

      return {
        success: response.data?.type === 'success',
        provider: 'msg91',
        messageId: response.data?.message || 'unknown',
        raw: response.data,
      };
    } catch (error: any) {
      throw new ProviderException('msg91', error.message || 'Request failed', error.response?.data || error);
    }
  }

  async sendBulk(payloads: SmsPayload[]): Promise<SmsResponse[]> {
    // In a real scenario MSG91 supports sending to multiple recipients in one payload.
    // However, to match the interface returning individual message IDs if needed, 
    // we can either map it or just use the same approach depending on the flow API.
    // For simplicity and matching standard implementation, we batch it.
    
    const apiKey = this.configService.get<string>('MSG91_API_KEY');
    const templateId = this.configService.get<string>('MSG91_TEMPLATE_ID');

    if (!apiKey) {
      throw new ProviderException('msg91', 'MSG91_API_KEY is not configured');
    }

    try {
      const raw = await firstValueFrom(
        this.httpService.post(
          MSG91_URLS.SEND_SMS,
          {
            template_id: templateId,
            short_url: '0',
            recipients: payloads.map(p => ({
              mobiles: p.mobile.replace('+', ''),
              message: p.message,
            })),
          },
          {
            headers: {
              authkey: apiKey,
              'Content-Type': 'application/json',
              accept: 'application/json',
            },
          },
        ) as any,
      );
      const response = raw as { data: { type: string; message: string } };

      // Return a single summary mapped to all or just individual responses. 
      // Assuming one message ID is returned for the batch.
      const batchMessageId = response.data?.message || 'unknown_batch';
      
      return payloads.map(p => ({
        success: response.data?.type === 'success',
        provider: 'msg91',
        messageId: batchMessageId,
        raw: response.data,
      }));
    } catch (error: any) {
      throw new ProviderException('msg91', error.message || 'Bulk request failed', error.response?.data || error);
    }
  }

  async getStatus(messageId: string): Promise<any> {
    const apiKey = this.configService.get<string>('MSG91_API_KEY');
    try {
      const raw = await firstValueFrom(
        this.httpService.get(`${MSG91_URLS.GET_STATUS}?authkey=${apiKey}&reqId=${messageId}`) as any
      );
      const response = raw as { data: { status: string } };
      return {
        messageId,
        status: response.data?.status || 'UNKNOWN',
        provider: 'msg91',
        raw: response.data,
      };
    } catch (error: any) {
      throw new ProviderException('msg91', error.message || 'Get status failed', error.response?.data || error);
    }
  }
}
