import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async create(createContactDto: CreateContactDto) {
    return this.prisma.contact.create({ data: createContactDto });
  }

  async createBulk(contacts: CreateContactDto[]) {
    return this.prisma.contact.createMany({ 
      data: contacts, 
      skipDuplicates: true 
    });
  }

  async findAll(page: number = 1, limit: number = 10, search: string = '') {
    const skip = (page - 1) * limit;
    const whereClause = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { mobile: { contains: search } }
      ]
    } : {};

    const [data, total] = await Promise.all([
      this.prisma.contact.findMany({
        where: whereClause,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.contact.count({ where: whereClause })
    ]);

    return {
      data,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    };
  }

  findOne(id: number) {
    return this.prisma.contact.findUnique({ where: { id } });
  }

  remove(id: number) {
    return this.prisma.contact.delete({ where: { id } });
  }
}
