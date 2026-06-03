import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { normalizeIndianPhoneNumber } from '../common/utils/phone-normalizer';
import { ProviderFactory } from './providers/provider.factory';
import { SmsLogger } from './logger/sms.logger';

type SendSmsInput = {
  mobile: string;
  message: string;
  campaignId?: number;
  templateId?: string;
};

type SendBulkSmsInput = {
  message: string;
  contactIds: number[];
  campaignId?: number;
  templateId?: string;
};

@Injectable()
export class SmsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly providerFactory: ProviderFactory,
    private readonly smsLogger: SmsLogger,
  ) {}

  async sendSMS(input: SendSmsInput) {
    const normalizedMobile = normalizeIndianPhoneNumber(input.mobile);
    const provider = this.providerFactory.getProvider();

    try {
      const response = await provider.send({
        mobile: normalizedMobile,
        message: input.message,
        templateId: input.templateId,
      });

      this.smsLogger.logSuccess(response.provider, normalizedMobile, response.messageId, response.raw);

      return this.prisma.smsLog.create({
        data: {
          mobile: normalizedMobile,
          message: input.message,
          campaignId: input.campaignId,
          status: response.success ? 'SENT' : 'FAILED',
          provider: response.provider,
          providerMessageId: response.messageId,
        },
      });
    } catch (error: any) {
      const providerName = error.provider || 'unknown';
      this.smsLogger.logFailure(providerName, normalizedMobile, error);

      return this.prisma.smsLog.create({
        data: {
          mobile: normalizedMobile,
          message: input.message,
          campaignId: input.campaignId,
          status: 'FAILED',
          provider: providerName,
        },
      });
    }
  }

  async sendBulk(input: SendBulkSmsInput) {
    const contacts = await this.prisma.contact.findMany({
      where: { id: { in: input.contactIds } },
      select: { id: true, mobile: true },
    });

    if (!contacts.length) {
      return { sent: 0 };
    }

    const provider = this.providerFactory.getProvider();

    // To prevent crashing the whole batch, we can send them one by one or let the provider handle bulk.
    // Given the prompt requirement: "Never crash application."
    // Let's rely on the provider's sendBulk if we want.
    
    let sentCount = 0;
    const logEntries: any[] = [];

    try {
      const payloads = contacts.map(c => ({
        mobile: c.mobile,
        message: input.message,
        templateId: input.templateId,
      }));

      const responses = await provider.sendBulk(payloads);

      for (let i = 0; i < responses.length; i++) {
        const response = responses[i];
        const contact = contacts[i];

        if (response.success) {
          sentCount++;
          this.smsLogger.logSuccess(response.provider, contact.mobile, response.messageId, response.raw);
        } else {
          this.smsLogger.logFailure(response.provider, contact.mobile, { message: 'Provider returned failure status' });
        }

        logEntries.push({
          contactId: contact.id,
          campaignId: input.campaignId,
          mobile: contact.mobile,
          message: input.message,
          status: response.success ? 'SENT' : 'FAILED',
          provider: response.provider,
          providerMessageId: response.messageId,
        });
      }
    } catch (error: any) {
      const providerName = error.provider || 'unknown';
      
      // If the whole bulk request failed
      for (const contact of contacts) {
        this.smsLogger.logFailure(providerName, contact.mobile, error);
        logEntries.push({
          contactId: contact.id,
          campaignId: input.campaignId,
          mobile: contact.mobile,
          message: input.message,
          status: 'FAILED',
          provider: providerName,
        });
      }
    }

    if (logEntries.length > 0) {
      await this.prisma.smsLog.createMany({
        data: logEntries,
      });
    }

    return { sent: sentCount };
  }

  async sendBulkSMS(input: SendBulkSmsInput) {
    return this.sendBulk(input);
  }

  findAll() {
    return this.prisma.smsLog.findMany({
      orderBy: { createdAt: 'desc' },
      include: { campaign: true, contact: true },
    });
  }
}
