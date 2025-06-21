import { Request, Project, Task, Invoice } from '../types';

export const mockRequests: Request[] = [
  {
    id: '1',
    clientId: '2',
    clientName: 'Juan Pérez',
    clientEmail: 'juan@empresa.com',
    company: 'Empresa ABC',
    projectType: 'CRM Inteligente',
    budget: '€15,000 - €30,000',
    timeline: '3-4 meses',
    description: 'Necesitamos un CRM que automatice nuestro proceso de ventas y nos ayude a gestionar mejor nuestros clientes. Queremos integración con email marketing y análisis predictivo.',
    status: 'approved',
    createdAt: '2024-11-15T10:30:00Z',
    updatedAt: '2024-11-20T14:15:00Z',
    notes: 'Cliente muy interesado. Reunión programada para el 25/11.'
  },
  {
    id: '2',
    clientId: '3',
    clientName: 'María García',
    clientEmail: 'maria@startup.com',
    company: 'Startup XYZ',
    projectType: 'SaaS Personalizado',
    budget: '€30,000 - €50,000',
    timeline: '5-6 meses',
    description: 'Plataforma SaaS para gestión de inventarios con IA predictiva. Necesitamos dashboard avanzado, APIs robustas y sistema de notificaciones.',
    status: 'in_development',
    createdAt: '2024-10-20T09:15:00Z',
    updatedAt: '2024-12-01T11:30:00Z',
    notes: 'Proyecto en desarrollo. Fase 1 completada.'
  },
  {
    id: '3',
    clientId: '2',
    clientName: 'Juan Pérez',
    clientEmail: 'juan@empresa.com',
    company: 'Empresa ABC',
    projectType: 'Chatbot con IA',
    budget: '€5,000 - €15,000',
    timeline: '1-2 meses',
    description: 'Chatbot para atención al cliente 24/7 con procesamiento de lenguaje natural y integración con nuestro sistema de tickets.',
    status: 'pending',
    createdAt: '2024-12-01T16:45:00Z',
    updatedAt: '2024-12-01T16:45:00Z'
  }
];

export const mockProjects: Project[] = [
  {
    id: '1',
    clientId: '2',
    requestId: '1',
    name: 'CRM Inteligente - Empresa ABC',
    description: 'Sistema CRM con automatización de ventas y análisis predictivo',
    type: 'CRM Inteligente',
    status: 'development',
    budget: 25000,
    startDate: '2024-11-25T00:00:00Z',
    progress: 35,
    createdAt: '2024-11-25T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: '2',
    clientId: '3',
    requestId: '2',
    name: 'SaaS Inventarios - Startup XYZ',
    description: 'Plataforma SaaS para gestión inteligente de inventarios',
    type: 'SaaS Personalizado',
    status: 'development',
    budget: 40000,
    startDate: '2024-11-01T00:00:00Z',
    progress: 65,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    projectId: '1',
    title: 'Diseño de base de datos',
    description: 'Crear esquema de base de datos para el CRM',
    status: 'completed',
    priority: 'high',
    assignedTo: 'Admin Kacum',
    dueDate: '2024-11-30T00:00:00Z',
    createdAt: '2024-11-25T00:00:00Z',
    updatedAt: '2024-11-28T00:00:00Z'
  },
  {
    id: '2',
    projectId: '1',
    title: 'Desarrollo API de contactos',
    description: 'Implementar endpoints para gestión de contactos',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'Admin Kacum',
    dueDate: '2024-12-05T00:00:00Z',
    createdAt: '2024-11-28T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: '3',
    projectId: '1',
    title: 'Dashboard de ventas',
    description: 'Crear dashboard con métricas de ventas',
    status: 'todo',
    priority: 'medium',
    dueDate: '2024-12-10T00:00:00Z',
    createdAt: '2024-11-25T00:00:00Z',
    updatedAt: '2024-11-25T00:00:00Z'
  },
  {
    id: '4',
    projectId: '2',
    title: 'Módulo de predicción IA',
    description: 'Implementar algoritmo de predicción de demanda',
    status: 'in_progress',
    priority: 'urgent',
    assignedTo: 'Admin Kacum',
    dueDate: '2024-12-03T00:00:00Z',
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    clientId: '2',
    projectId: '1',
    number: 'INV-2024-001',
    amount: 8750,
    status: 'paid',
    issueDate: '2024-11-25T00:00:00Z',
    dueDate: '2024-12-25T00:00:00Z',
    paidDate: '2024-11-30T00:00:00Z',
    items: [
      {
        id: '1',
        description: 'Desarrollo CRM - Fase 1',
        quantity: 1,
        rate: 8750,
        amount: 8750
      }
    ],
    createdAt: '2024-11-25T00:00:00Z'
  },
  {
    id: '2',
    clientId: '3',
    projectId: '2',
    number: 'INV-2024-002',
    amount: 15000,
    status: 'sent',
    issueDate: '2024-12-01T00:00:00Z',
    dueDate: '2024-12-31T00:00:00Z',
    items: [
      {
        id: '2',
        description: 'Desarrollo SaaS - Fase 1',
        quantity: 1,
        rate: 15000,
        amount: 15000
      }
    ],
    createdAt: '2024-12-01T00:00:00Z'
  }
];