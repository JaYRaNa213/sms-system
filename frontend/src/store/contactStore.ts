import { create } from 'zustand';
import { contactsService } from '../services/contacts.service';

interface Contact {
  id: number;
  name: string;
  mobile: string;
  tags: string[];
  createdAt: string;
}

interface ContactState {
  contacts: Contact[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  search: string;
  fetchContacts: (page?: number, limit?: number, search?: string) => Promise<void>;
  setSearch: (search: string) => void;
}

export const useContactStore = create<ContactState>((set, get) => ({
  contacts: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  loading: false,
  search: '',
  setSearch: (search) => set({ search }),
  fetchContacts: async (page = 1, limit = 10, search = '') => {
    set({ loading: true });
    try {
      const data = await contactsService.getContacts(page, limit, search);
      set({ 
        contacts: data.data, 
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
        loading: false 
      });
    } catch (error) {
      set({ loading: false });
      console.error("Failed to fetch contacts", error);
    }
  },
}));
