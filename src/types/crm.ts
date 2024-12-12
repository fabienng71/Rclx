import { Customer } from './index';

export interface Tool {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'document';
  category: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Activity {
  id: string;
  customerCode: string;
  companyName: string;
  searchName: string;
  date: string;
  type: 'call' | 'visit' | 'email' | 'sample';
  notes: string;
  status: 'won' | 'lost' | 'pending';
  callbackDate?: string;
  createdBy: string;
  createdAt: string;
}

export interface Sample {
  id: string;
  customerCode: string;
  companyName: string;
  searchName: string;
  itemCode: string;
  description: string;
  quantity: number;
  date: string;
  notes: string;
  status: 'won' | 'lost' | 'pending';
  feedback?: 'like' | 'dont_like' | 'too_expensive';
  createdBy: string;
  createdAt: string;
}

export interface File {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  folderId: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdBy: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  customerCode: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isLead: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  role: string;
  customerCode: string;
  isLead: boolean;
}