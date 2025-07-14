export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  company?: string;
  phone?: string;
  createdAt?: string | Date;
  role?: 'admin' | 'client';
}

export interface Project {
  id: string;
  name: string;
  clientName: string;
  status: 'Active' | 'Completed' | 'On Hold' | 'Development'; // Added 'Development'
  deadline: string | Date;
  description?: string;
  type?: string;
  budget?: number;
  startDate?: string | Date;
  progress?: number;
  tasks?: Task[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'To Do' | 'In Progress' | 'Done' | 'Completed'; // Added 'Completed'
  dueDate: string | Date;
  assignedTo?: User;
  priority?: 'Low' | 'Medium' | 'High';
  projectId?: string;
}

export type RequestStatus = 'Pending' | 'Approved' | 'Rejected' | 'In Development';

export interface Request {
  id: string;
  title: string;
  description: string;
  status: RequestStatus;
  submittedBy: string;
  createdAt: string | Date;
  clientName?: string;
  clientEmail?: string;
  projectType?: string;
  company?: string;
  budget?: number;
  timeline?: string;
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity?: number;
  rate?: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId?: string;
  projectId?: string;
  clientName: string;
  amount: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
  issueDate?: string | Date;
  dueDate: string | Date;
  paidDate?: string | Date;
  items: InvoiceItem[];
}

