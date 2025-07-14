export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client' | 'user';
  company?: string;
  phone?: string;
  avatar?: string;
  avatarUrl?: string;
  darkMode?: boolean;
  language?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  startDate: string;
  endDate: string | null;
  clientId: string;
  clientName?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  projectId: string;
  projectName?: string;
  assignedTo: string[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: 'draft' | 'sent' | 'paid' | 'cancelled';
  amount: number;
  issueDate: string;
  dueDate: string;
  clientId: string;
  clientName?: string;
  items: InvoiceItem[];
  notes?: string;
}

export interface Request {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  clientId: string;
  clientName?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
  link: string;
}

export interface UIPreferences {
  darkMode: boolean;
  language: 'es' | 'en';
  notifications: {
    email: boolean;
    push: boolean;
  };
  collapseMenu: boolean;
}

// --- UNIFIED CLIENT-RELATED TYPES ---

export interface BillingInfo {
  id: string;
  clientId: string;
  companyName: string | null;
  vatNumber: string | null;
  fiscalAddress: string | null;
  fiscalCity: string | null;
  fiscalPostalCode: string | null;
  fiscalCountry: string | null;
  paymentMethod: 'bank_transfer' | 'credit_card' | 'paypal' | 'other';
  bankAccount: string | null;
  bankName: string | null;
  swiftBic: string | null;
  notes: string | null;
}

export interface Contact {
  id: string;
  clientId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  position: string | null;
  isPrimary: boolean;
  department: string | null;
  notes: string | null;
  avatarUrl: string | null;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  country: string | null;
  status: 'active' | 'inactive' | 'prospect';
  notes: string | null;
  avatarUrl: string | null;
  website: string | null;
  createdAt: string;
  updatedAt: string;
  BillingInfo: BillingInfo | null;
  Contacts: Contact[];
}