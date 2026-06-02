import { api } from './api';

export interface DashboardSummary {
  totalContacts: number;
  totalTemplates: number;
  totalCampaigns: number;
  totalSmsSent: number;
  delivered: number;
  failed: number;
  pending: number;
  latestCampaign: any;
  latestSmsLog: any;
}

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await api.get('/dashboard/summary');
    return response.data;
  },
};
