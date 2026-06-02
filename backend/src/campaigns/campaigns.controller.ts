import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get()
  findAll() {
    return this.campaignsService.findAll();
  }

  @Post()
  create(@Body() body: { name: string; message: string; templateId?: number; recipientIds?: number[] }) {
    return this.campaignsService.create(body);
  }

  @Patch(':id/send')
  send(@Param('id') id: string) {
    return this.campaignsService.markSent(Number(id));
  }
}
