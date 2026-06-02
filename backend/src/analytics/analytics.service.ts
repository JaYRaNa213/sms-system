import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async summary() {
    const [totalContacts, totalCampaigns, totalSms, delivered, failed] = await Promise.all([
      this.prisma.contact.count(),
      this.prisma.campaign.count(),
      this.prisma.smsLog.count(),
      this.prisma.smsLog.count({ where: { status: 'DELIVERED' } }),
      this.prisma.smsLog.count({ where: { status: 'FAILED' } }),
    ]);

    return {
      totalContacts,
      totalCampaigns,
      totalSms,
      delivered,
      failed,
    };
  }
}
