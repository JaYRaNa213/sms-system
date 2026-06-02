import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class CampaignsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly smsService: SmsService,
  ) {}

  findAll() {
    return this.prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        template: true,
        recipients: {
          include: { contact: true },
        },
      },
    });
  }

  async create(body: { name: string; message: string; templateId?: number; recipientIds?: number[] }) {
    return this.prisma.$transaction(async (tx) => {
      const campaign = await tx.campaign.create({
        data: {
          name: body.name,
          message: body.message,
          templateId: body.templateId,
        },
      });

      if (body.recipientIds?.length) {
        await tx.campaignRecipient.createMany({
          data: body.recipientIds.map((contactId) => ({
            campaignId: campaign.id,
            contactId,
          })),
          skipDuplicates: true,
        });
      }

      return tx.campaign.findUnique({
        where: { id: campaign.id },
        include: {
          template: true,
          recipients: {
            include: { contact: true },
          },
        },
      });
    });
  }

  async markSent(id: number) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        recipients: {
          select: { contactId: true },
        },
      },
    });

    if (!campaign) {
      return null;
    }

    const contactIds = campaign.recipients.map((recipient) => recipient.contactId);
    const smsResult = await this.smsService.sendBulk({
      message: campaign.message,
      contactIds,
      campaignId: campaign.id,
    });

    const updatedCampaign = await this.prisma.campaign.update({
      where: { id },
      data: {
        status: 'SENT',
        sentAt: new Date(),
      },
      include: {
        template: true,
        recipients: {
          include: { contact: true },
        },
      },
    });

    return {
      campaign: updatedCampaign,
      sent: smsResult.sent,
    };
  }
}
