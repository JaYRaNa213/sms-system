export interface SmsPayload {
  mobile: string;
  message: string;
  templateId?: string;
}

export interface SmsResponse {
  success: boolean;
  provider: string;
  messageId: string;
  raw?: any;
}

export interface SmsProvider {
  send(payload: SmsPayload): Promise<SmsResponse>;

  sendBulk(
    payloads: SmsPayload[],
  ): Promise<SmsResponse[]>;

  getStatus(
    messageId: string,
  ): Promise<any>;
}
