import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    const [
      totalContacts,
      totalTemplates,
      totalCampaigns,
      totalSmsSent,
      delivered,
      failed,
      pending,
      latestCampaign,
      latestSmsLog
    ] = await Promise.all([
      this.prisma.contact.count(),
      this.prisma.template.count(),
      this.prisma.campaign.count(),
      this.prisma.smsLog.count(),
      this.prisma.smsLog.count({ where: { status: 'DELIVERED' } }),
      this.prisma.smsLog.count({ where: { status: 'FAILED' } }),
      this.prisma.smsLog.count({ where: { status: 'SENT' } }), // Pending mapped to SENT status? Let's check schema. Prisma schema says DeliveryStatus is SENT, DELIVERED, FAILED. SENT is probably pending.
      this.prisma.campaign.findFirst({
        orderBy: { createdAt: 'desc' },
        include: { template: true }
      }),
      this.prisma.smsLog.findFirst({
        orderBy: { createdAt: 'desc' },
        include: { contact: true, campaign: true }
      })
    ]);

    return {
      totalContacts,
      totalTemplates,
      totalCampaigns,
      totalSmsSent,
      delivered,
      failed,
      pending,
      latestCampaign: latestCampaign || null,
      latestSmsLog: latestSmsLog || null
    };
  }
}
