import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SmsLogger {
  private readonly logger = new Logger('SmsService');

  logSuccess(provider: string, mobile: string, messageId: string, response: any) {
    this.logger.log(
      `[${provider}] SMS sent successfully | Mobile: ${mobile} | MessageId: ${messageId} | Raw: ${JSON.stringify(
        response,
      )}`,
    );
  }

  logFailure(provider: string, mobile: string, error: any) {
    this.logger.error(
      `[${provider}] SMS failed | Mobile: ${mobile} | Error: ${error.message} | Raw: ${JSON.stringify(
        error.rawError || error,
      )}`,
    );
  }
}
