import { api } from './api';

export interface Contact {
  id: number;
  name: string;
  mobile: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactInput {
  name: string;
  mobile: string;
  tags?: string[];
}

export interface PaginatedContactsResponse {
  data: Contact[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const contactsService = {
  getContacts: async (
    page: number = 1,
    limit: number = 10,
    search: string = '',
  ): Promise<PaginatedContactsResponse> => {
    const response = await api.get<PaginatedContactsResponse>('/contacts', { params: { page, limit, search } });
    return response.data;
  },
  
  createContact: async (contact: CreateContactInput): Promise<Contact> => {
    const response = await api.post<Contact>('/contacts', contact);
    return response.data;
  },

  importContacts: async (contacts: CreateContactInput[]): Promise<{ count: number }> => {
    const response = await api.post<{ count: number }>('/contacts/bulk', contacts);
    return response.data;
  },

  deleteContact: async (id: number): Promise<{ deleted: boolean }> => {
    const response = await api.delete<{ deleted: boolean }>(`/contacts/${id}`);
    return response.data;
  }
};
