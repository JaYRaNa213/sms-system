import { api } from './api';

export interface SmsLog {
  id: number;
  mobile: string;
  message: string;
  status: 'SENT' | 'DELIVERED' | 'FAILED';
  createdAt: string;
  campaign: { id: number; name: string } | null;
  contact: { id: number; name: string; mobile: string } | null;
}

export const smsService = {
  async getLogs(): Promise<SmsLog[]> {
    const response = await api.get<SmsLog[]>('/sms/logs');
    return response.data;
  },
};
