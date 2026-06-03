import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ProviderFactory } from './provider.factory';
import { MockProvider } from './mock.provider';
import { MSG91Provider } from './msg91.provider';

describe('ProviderFactory', () => {
  let factory: ProviderFactory;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProviderFactory,
        {
          provide: ConfigService,
          useValue: { get: jest.fn() },
        },
        {
          provide: MockProvider,
          useValue: {},
        },
        {
          provide: MSG91Provider,
          useValue: {},
        },
      ],
    }).compile();

    factory = module.get<ProviderFactory>(ProviderFactory);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should return MockProvider when SMS_PROVIDER=mock', () => {
    jest.spyOn(configService, 'get').mockReturnValue('mock');
    const provider = factory.getProvider();
    expect(provider).toBeDefined();
  });

  it('should return MSG91Provider when SMS_PROVIDER=msg91', () => {
    jest.spyOn(configService, 'get').mockReturnValue('msg91');
    const provider = factory.getProvider();
    expect(provider).toBeDefined();
  });

  it('should throw error on invalid provider', () => {
    jest.spyOn(configService, 'get').mockReturnValue('invalid');
    expect(() => factory.getProvider()).toThrow('Unsupported SMS provider: invalid');
  });
});
