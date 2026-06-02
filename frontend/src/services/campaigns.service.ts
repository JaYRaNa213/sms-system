import { api } from './api';
import type { Template } from './templates.service';

export interface CampaignRecipient {
  id: number;
  campaignId: number;
  contactId: number;
  createdAt: string;
  contact: {
    id: number;
    name: string;
    mobile: string;
  };
}

export interface Campaign {
  id: number;
  name: string;
  message: string;
  status: 'DRAFT' | 'SENT';
  templateId: number | null;
  sentAt: string | null;
  createdAt: string;
  updatedAt: string;
  template?: Template | null;
  recipients: CampaignRecipient[];
}

export const campaignsService = {
  async getAll(): Promise<Campaign[]> {
    const response = await api.get<Campaign[]>('/campaigns');
    return response.data;
  },

  async create(input: {
    name: string;
    message: string;
    templateId?: number;
    recipientIds: number[];
  }): Promise<Campaign> {
    const response = await api.post<Campaign>('/campaigns', input);
    return response.data;
  },

  async send(id: number): Promise<{ campaign: Campaign; sent: number }> {
    const response = await api.patch<{ campaign: Campaign; sent: number }>(`/campaigns/${id}/send`);
    return response.data;
  },
};
