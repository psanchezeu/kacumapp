import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  description: string;
  timeline: string;
  phone?: string;
}

export const sendContactForm = async (data: Omit<ContactFormData, 'phone'> & { phone?: string }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/contact`, {
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      message: `Empresa: ${data.company}\nTipo de Proyecto: ${data.projectType}\nPresupuesto: ${data.budget}\nPlazo: ${data.timeline}\n\nDescripción:\n${data.description}`
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error al enviar el formulario:', error);
    const axiosError = error as AxiosError;
    return { 
      success: false, 
      error: (axiosError.response?.data as any)?.message || 'Error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.'
    };
  }
};
