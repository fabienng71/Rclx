import { create } from 'zustand';
import type { Contact, ContactFormData } from '../types/crm';
import { saveContact, updateContact, deleteContact, fetchContacts } from '../services/contacts';

interface ContactStore {
  contacts: Contact[];
  isLoading: boolean;
  error: string | null;
  setContacts: (contacts: Contact[]) => void;
  addContact: (contact: ContactFormData, userId: string) => Promise<void>;
  updateContact: (id: string, updates: Partial<ContactFormData>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  loadContacts: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useContactStore = create<ContactStore>((set, get) => ({
  contacts: [],
  isLoading: false,
  error: null,
  setContacts: (contacts) => set({ contacts }),
  addContact: async (contactData, userId) => {
    try {
      const newContact = await saveContact(contactData, userId);
      set((state) => ({
        contacts: [...state.contacts, newContact],
        error: null
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to add contact' });
      throw error;
    }
  },
  updateContact: async (id, updates) => {
    try {
      await updateContact(id, updates);
      set((state) => ({
        contacts: state.contacts.map((contact) =>
          contact.id === id
            ? {
                ...contact,
                ...updates,
                updatedAt: new Date().toISOString()
              }
            : contact
        ),
        error: null
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update contact' });
      throw error;
    }
  },
  deleteContact: async (id) => {
    try {
      await deleteContact(id);
      set((state) => ({
        contacts: state.contacts.filter((contact) => contact.id !== id),
        error: null
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete contact' });
      throw error;
    }
  },
  loadContacts: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchContacts();
      set({ contacts: data, error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load contacts' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error })
}));