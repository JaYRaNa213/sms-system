import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async get() {
    const existing = await this.prisma.setting.findUnique({ where: { id: 1 } });
    if (existing) {
      return existing;
    }

    return this.prisma.setting.create({
      data: {
        id: 1,
        companyName: 'SMS Platform',
        senderId: 'SMSINFO',
        supportEmail: 'support@localhost.com',
      },
    });
  }

  update(data: { companyName: string; senderId: string; supportEmail: string }) {
    return this.prisma.setting.upsert({
      where: { id: 1 },
      update: data,
      create: {
        id: 1,
        ...data,
      },
    });
  }
}
