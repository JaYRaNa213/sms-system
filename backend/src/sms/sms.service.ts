import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type SendSmsInput = {
  mobile: string;
  message: string;
  campaignId?: number;
};

type SendBulkSmsInput = {
  message: string;
  contactIds: number[];
  campaignId?: number;
};

@Injectable()
export class SmsService {
  constructor(private readonly prisma: PrismaService) {}

  async sendSMS(input: SendSmsInput) {
    return this.prisma.smsLog.create({
      data: {
        mobile: input.mobile,
        message: input.message,
        campaignId: input.campaignId,
        status: 'DELIVERED',
      },
    });
  }

  async sendBulk(input: SendBulkSmsInput) {
    const contacts = await this.prisma.contact.findMany({
      where: { id: { in: input.contactIds } },
      select: { id: true, mobile: true },
    });

    if (!contacts.length) {
      return { sent: 0 };
    }

    await this.prisma.smsLog.createMany({
      data: contacts.map((contact) => ({
        contactId: contact.id,
        campaignId: input.campaignId,
        mobile: contact.mobile,
        message: input.message,
        status: 'DELIVERED',
      })),
    });

    return { sent: contacts.length };
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
