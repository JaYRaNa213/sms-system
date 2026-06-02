import { api } from './api';

export interface AnalyticsSummary {
  totalContacts: number;
  totalCampaigns: number;
  totalSms: number;
  delivered: number;
  failed: number;
}

export const analyticsService = {
  async getSummary(): Promise<AnalyticsSummary> {
    const response = await api.get<AnalyticsSummary>('/analytics/summary');
    return response.data;
  },
};
