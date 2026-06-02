import { api } from './api';

export interface AppSettings {
  id: number;
  companyName: string;
  senderId: string;
  supportEmail: string;
  updatedAt: string;
}

export const settingsService = {
  async get(): Promise<AppSettings> {
    const response = await api.get<AppSettings>('/settings');
    return response.data;
  },

  async update(input: {
    companyName: string;
    senderId: string;
    supportEmail: string;
  }): Promise<AppSettings> {
    const response = await api.put<AppSettings>('/settings', input);
    return response.data;
  },
};
