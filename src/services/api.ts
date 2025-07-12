import axios, { AxiosError } from 'axios';

// En Vite, las variables de entorno deben comenzar con VITE_
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Configuración global de Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Importante para CORS con credenciales
});

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

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('Error en la petición:', error.message);
    if (error.response) {
      console.error('Detalles del error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    }
    return Promise.reject(error);
  }
);

export const sendContactForm = async (data: Omit<ContactFormData, 'phone'> & { phone?: string }) => {
  try {
    const response = await api.post('/api/contact', {
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      message: `Empresa: ${data.company}\nTipo de Proyecto: ${data.projectType}\nPresupuesto: ${data.budget}\nPlazo: ${data.timeline}\n\nDescripción:\n${data.description}`
    });
    return response;
  } catch (error) {
    console.error('Error al enviar el formulario de contacto:', error);
    throw error;
  }
};

export default api;
