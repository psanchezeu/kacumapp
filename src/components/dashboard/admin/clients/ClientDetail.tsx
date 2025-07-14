import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useUI } from '../../../../contexts/UIContext';
import { 
  ArrowLeft, 
  Edit,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  Trash
} from 'lucide-react';
import axios from 'axios';
// Importación usando ruta absoluta para evitar problemas de resolución
import type { Client } from '../../../../types/index';
import ClientGeneralTab from './tabs/ClientGeneralTab';
import ClientContactsTab from './tabs/ClientContactsTab';
import ClientBillingTab from './tabs/ClientBillingTab';

// Componente principal
const ClientDetail: React.FC = () => {
  const { preferences } = useUI();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'new';
  
  const [client, setClient] = useState<Client | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(isNew);

  useEffect(() => {
    const createNewClient = () => {
      setClient({
        id: '', name: '', email: '', phone: '', address: '', city: '', 
        postalCode: '', country: '', status: 'prospect', notes: '', 
        avatarUrl: '', website: '', createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString(), BillingInfo: null, Contacts: [],
      });
      setIsEditing(true);
      setIsLoading(false);
    };

    const fetchClient = async () => {
      try {
        const response = await axios.get(`/api/clients/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        // Sanitizar datos nulos a strings vacíos para evitar inputs no controlados
        const fetchedData = response.data;
        const sanitizedClient = { ...fetchedData };
        for (const key in sanitizedClient) {
          if (sanitizedClient[key as keyof Client] === null) {
            (sanitizedClient as any)[key] = '';
          }
        }
        setClient(sanitizedClient);
        setClient(sanitizedClient);
      } catch (err) {
        console.error('Error al cargar cliente:', err);
        setError('No se pudo cargar la información del cliente.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isNew) {
      createNewClient();
    } else {
      fetchClient();
    }
  }, [id, isNew]);

  const handleClientChange = (updatedData: Partial<Client>) => {
    setClient((prev: Client | null) => {
      if (!prev) return null; // No debería ocurrir en la práctica si la UI está bien
      return { ...prev, ...updatedData };
    });
  };

  const handleSave = async () => {
    if (!client) return;

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData();
    Object.entries(client).forEach(([key, value]) => {
      if (key !== 'BillingInfo' && key !== 'Contacts' && key !== 'createdAt' && key !== 'updatedAt' && value !== null) {
        formData.append(key, value as string);
      }
    });

    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      };

      const response = isNew
        ? await axios.post('/api/clients', formData, config)
        : await axios.put(`/api/clients/${id}`, formData, config);

      setSuccessMessage(isNew ? 'Cliente creado correctamente.' : 'Cliente actualizado correctamente.');
      
      if (isNew) {
        navigate(`/dashboard/clients/${response.data.client.id}`, { replace: true });
      } else {
        setClient(response.data.client);
        setIsEditing(false);
      }

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Error al guardar cliente:', err);
      const errorMsg = err.response?.data?.error || 'No se pudo guardar la información. Revisa los campos e inténtalo de nuevo.';
      setError(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-indigo-500" size={32} /></div>;
  }

  if (!client) {
    return <div className="text-center p-8 text-gray-500">No se encontró el cliente o hubo un error al cargarlo.</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`p-4 sm:p-6 rounded-lg shadow-sm ${preferences.darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center">
            <button onClick={() => navigate('/dashboard/clients')} className={`p-2 mr-3 rounded-full ${preferences.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                <ArrowLeft size={20} />
            </button>
            <h1 className={`text-2xl font-bold ${preferences.darkMode ? 'text-white' : 'text-gray-900'}`}>{isNew ? 'Nuevo Cliente' : client.name}</h1>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <button onClick={handleSave} disabled={isSaving} className="btn btn-primary">
              {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}Guardar
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="btn btn-secondary">
              <Edit size={18} className="mr-2" />Editar
            </button>
          )}
          {!isNew && (
             <button onClick={() => alert('Funcionalidad de eliminar pendiente.')} className="btn btn-danger">
                <Trash size={18} className="mr-2" />Eliminar
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="alert alert-danger mb-4"><AlertCircle className="mr-2" />{error}</motion.div>}
        {successMessage && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="alert alert-success mb-4"><CheckCircle className="mr-2" />{successMessage}</motion.div>}
      </AnimatePresence>

      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {['general', 'contacts', 'billing'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab ? 'border-indigo-500 text-indigo-600' : `border-transparent ${preferences.darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'general' && (
          <ClientGeneralTab
            client={client}
            isEditing={isEditing}
            onClientChange={handleClientChange}
            onAvatarChange={setAvatarFile}
          />
        )}
        {activeTab === 'contacts' && <ClientContactsTab clientId={client.id} contacts={client.Contacts || []} isNew={isNew} />}
        {activeTab === 'billing' && <ClientBillingTab clientId={client.id} billingInfo={client.BillingInfo} isNew={isNew} />}
      </div>
    </motion.div>
  );
};

export default ClientDetail;
