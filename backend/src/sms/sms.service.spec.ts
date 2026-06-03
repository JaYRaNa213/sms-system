import { Test, TestingModule } from '@nestjs/testing';
import { SmsService } from './sms.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProviderFactory } from './providers/provider.factory';
import { SmsLogger } from './logger/sms.logger';

describe('SmsService', () => {
  let service: SmsService;
  let prisma: PrismaService;
  let factory: ProviderFactory;

  const mockProvider = {
    send: jest.fn(),
    sendBulk: jest.fn(),
    getStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SmsService,
        {
          provide: PrismaService,
          useValue: {
            smsLog: { create: jest.fn(), createMany: jest.fn(), findMany: jest.fn() },
            contact: { findMany: jest.fn() },
          },
        },
        {
          provide: ProviderFactory,
          useValue: { getProvider: jest.fn().mockReturnValue(mockProvider) },
        },
        {
          provide: SmsLogger,
          useValue: { logSuccess: jest.fn(), logFailure: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<SmsService>(SmsService);
    prisma = module.get<PrismaService>(PrismaService);
    factory = module.get<ProviderFactory>(ProviderFactory);
  });

  it('should send SMS and save log successfully', async () => {
    mockProvider.send.mockResolvedValue({ success: true, provider: 'mock', messageId: 'msg1' });
    jest.spyOn(prisma.smsLog, 'create').mockResolvedValue({} as any);

    await service.sendSMS({ mobile: '6395857663', message: 'Hello' });

    expect(mockProvider.send).toHaveBeenCalledWith(expect.objectContaining({
      mobile: '+916395857663',
      message: 'Hello'
    }));
    expect(prisma.smsLog.create).toHaveBeenCalled();
  });

  it('should handle provider failure in sendSMS', async () => {
    mockProvider.send.mockRejectedValue(new Error('Failed'));
    jest.spyOn(prisma.smsLog, 'create').mockResolvedValue({} as any);

    await service.sendSMS({ mobile: '6395857663', message: 'Hello' });

    expect(prisma.smsLog.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ status: 'FAILED' })
    }));
  });
});
