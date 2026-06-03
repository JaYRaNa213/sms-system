import { Test, TestingModule } from '@nestjs/testing';
import { MockProvider } from './mock.provider';

describe('MockProvider', () => {
  let provider: MockProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MockProvider],
    }).compile();

    provider = module.get<MockProvider>(MockProvider);
  });

  it('should send single SMS', async () => {
    const res = await provider.send({ mobile: '1234567890', message: 'test' });
    expect(res.success).toBe(true);
    expect(res.provider).toBe('mock');
    expect(res.messageId).toMatch(/MOCK_\d+_\d+/);
  });

  it('should send bulk SMS', async () => {
    const payloads = [{ mobile: '1', message: 'msg1' }, { mobile: '2', message: 'msg2' }];
    const res = await provider.sendBulk(payloads);
    expect(res.length).toBe(2);
    expect(res[0].success).toBe(true);
  });
});
