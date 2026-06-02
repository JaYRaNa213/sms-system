import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  findAll() {
    return this.templatesService.findAll();
  }

  @Post()
  create(@Body() body: { name: string; content: string }) {
    return this.templatesService.create(body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.templatesService.remove(Number(id));
  }
}
