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
  collapseMenu?: boolean;
  language?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface Request {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'in_development';
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface Project {
  id: string;
  clientId: string;
  requestId: string;
  name: string;
  description: string;
  type: string;
  status: 'planning' | 'development' | 'testing' | 'completed' | 'on_hold';
  budget: number;
  startDate: string;
  endDate?: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  projectId: string;
  number: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  items: InvoiceItem[];
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}