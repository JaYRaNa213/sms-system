import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.template.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  create(body: { name: string; content: string }) {
    return this.prisma.template.create({ data: body });
  }

  remove(id: number) {
    return this.prisma.template.delete({ where: { id } });
  }
}
