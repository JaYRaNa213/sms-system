import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { MSG91Provider } from './msg91.provider';
import { of, throwError } from 'rxjs';

describe('MSG91Provider', () => {
  let provider: MSG91Provider;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MSG91Provider,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile();

    provider = module.get<MSG91Provider>(MSG91Provider);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should throw if MSG91_API_KEY is missing', async () => {
    jest.spyOn(configService, 'get').mockReturnValue(undefined);
    await expect(provider.send({ mobile: '123', message: 'test' })).rejects.toThrow('MSG91_API_KEY is not configured');
  });

  it('should send SMS successfully', async () => {
    jest.spyOn(configService, 'get').mockImplementation((key) => {
      if (key === 'MSG91_API_KEY') return 'key';
      if (key === 'MSG91_TEMPLATE_ID') return 'tmpl';
      return null;
    });

    jest.spyOn(httpService, 'post').mockReturnValue(of({ data: { type: 'success', message: 'msg123' } }) as any);

    const res = await provider.send({ mobile: '123', message: 'test' });
    expect(res.success).toBe(true);
    expect(res.messageId).toBe('msg123');
  });

  it('should handle API failure gracefully', async () => {
    jest.spyOn(configService, 'get').mockReturnValue('key');
    jest.spyOn(httpService, 'post').mockReturnValue(throwError(() => new Error('Network Error')));

    await expect(provider.send({ mobile: '123', message: 'test' })).rejects.toThrow('Network Error');
  });
});
