import { api } from './api';

export interface Template {
  id: number;
  name: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const templatesService = {
  async getAll(): Promise<Template[]> {
    const response = await api.get<Template[]>('/templates');
    return response.data;
  },

  async create(input: { name: string; content: string }): Promise<Template> {
    const response = await api.post<Template>('/templates', input);
    return response.data;
  },

  async remove(id: number): Promise<Template> {
    const response = await api.delete<Template>(`/templates/${id}`);
    return response.data;
  },
};
