import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SmsService } from './sms.service';

@UseGuards(JwtAuthGuard)
@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('send')
  send(@Body() body: { mobile: string; message: string; campaignId?: number }) {
    return this.smsService.sendSMS(body);
  }

  @Post('bulk')
  sendBulk(@Body() body: { message: string; contactIds: number[]; campaignId?: number }) {
    return this.smsService.sendBulkSMS(body);
  }

  @Get('logs')
  logs() {
    return this.smsService.findAll();
  }
}
