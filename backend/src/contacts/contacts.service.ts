import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { PrismaService } from '../prisma/prisma.service';
import { normalizeIndianPhoneNumber } from '../common/utils/phone-normalizer';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async create(createContactDto: CreateContactDto) {
    const normalizedMobile = normalizeIndianPhoneNumber(createContactDto.mobile);
    
    const existingContact = await this.prisma.contact.findUnique({
      where: { mobile: normalizedMobile },
    });

    if (existingContact) {
      throw new BadRequestException('Contact already exists');
    }

    return this.prisma.contact.create({ 
      data: { ...createContactDto, mobile: normalizedMobile } 
    });
  }

  async createBulk(contacts: CreateContactDto[]) {
    const normalizedContacts = contacts.map(c => ({
      ...c,
      mobile: normalizeIndianPhoneNumber(c.mobile)
    }));

    return this.prisma.contact.createMany({ 
      data: normalizedContacts, 
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
