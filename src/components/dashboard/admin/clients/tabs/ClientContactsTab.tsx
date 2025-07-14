import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUI } from '../../../../../contexts/UIContext';
import {
  User,
  Mail,
  Phone,
  Plus,
  Edit,
  Trash,
  AlertCircle,
  Loader2
} from 'lucide-react';
import axios from 'axios';

// Importación usando ruta absoluta para evitar problemas de resolución
import type { Contact } from '../../../../../types/index';

interface Props {
  clientId: string;
  contacts: Contact[];
  isNew: boolean;
}

// Componente ContactCard para mostrar cada contacto
const ContactCard: React.FC<{
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
  darkMode: boolean;
}> = ({ contact, onEdit, onDelete, darkMode }) => {
  return (
    <div className={`p-4 rounded-lg ${
      darkMode ? 'bg-gray-700' : 'bg-gray-50'
    } flex flex-col md:flex-row justify-between`}>
      <div className="flex items-center mb-4 md:mb-0">
        <div className={`w-10 h-10 rounded-full overflow-hidden ${
          darkMode ? 'bg-gray-600' : 'bg-gray-300'
        } mr-3`}>
          {contact.avatarUrl ? (
            <img 
              src={contact.avatarUrl} 
              alt={`${contact.firstName} ${contact.lastName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-medium text-gray-400">
                {contact.firstName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center">
            <h3 className="font-medium">{`${contact.firstName} ${contact.lastName}`}</h3>
            {contact.isPrimary && (
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
              }`}>
                Principal
              </span>
            )}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {contact.position || 'Sin cargo'}
            {contact.department && ` · ${contact.department}`}
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <Mail size={16} className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <a 
            href={`mailto:${contact.email}`}
            className={darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}
          >
            {contact.email}
          </a>
        </div>
        
        {contact.phone && (
          <div className="flex items-center">
            <Phone size={16} className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <a 
              href={`tel:${contact.phone}`}
              className={darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}
            >
              {contact.phone}
            </a>
          </div>
        )}
      </div>
      
      <div className="flex mt-4 md:mt-0 md:ml-4 space-x-2">
        <button
          onClick={() => onEdit(contact)}
          className={`p-2 rounded-full ${
            darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
          }`}
        >
          <Edit size={18} />
        </button>
        <button
          onClick={() => onDelete(contact.id)}
          className={`p-2 rounded-full ${
            darkMode ? 'hover:bg-gray-600 text-red-400' : 'hover:bg-gray-200 text-red-600'
          }`}
        >
          <Trash size={18} />
        </button>
      </div>
    </div>
  );
};

// Componente principal
const ClientContactsTab: React.FC<Props> = ({ clientId, contacts: initialContacts, isNew }) => {
  const { preferences } = useUI();
  const [contacts, setContacts] = useState<Contact[]>(initialContacts || []);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Si es un cliente nuevo, aún no podemos gestionar contactos
  if (isNew || !clientId) {
    return (
      <div className={`p-6 rounded-lg ${
        preferences.darkMode ? 'bg-gray-700' : 'bg-gray-100'
      } text-center`}>
        <User size={40} className="mx-auto mb-3 text-gray-400" />
        <h3 className="font-medium">No se pueden agregar contactos</h3>
        <p className={`mt-2 ${
          preferences.darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Guarda primero la información general del cliente antes de agregar contactos.
        </p>
      </div>
    );
  }
  
  // Cargar contactos si no se proporcionaron inicialmente
  useEffect(() => {
    if (!initialContacts || initialContacts.length === 0) {
      const fetchContacts = async () => {
        try {
          setIsLoading(true);
          setError(null);
          
          const response = await axios.get(`/api/clients/${clientId}/contacts`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          setContacts(response.data);
        } catch (err) {
          console.error('Error al cargar contactos:', err);
          setError('No se pudieron cargar los contactos. Por favor, inténtalo de nuevo.');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchContacts();
    }
  }, [clientId, initialContacts]);
  
  // Eliminar contacto
  const handleDeleteContact = async (contactId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este contacto? Esta acción no se puede deshacer.')) {
      try {
        setIsLoading(true);
        setError(null);
        
        await axios.delete(`/api/contacts/${contactId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Actualizar lista de contactos
        setContacts(contacts.filter(contact => contact.id !== contactId));
      } catch (err) {
        console.error('Error al eliminar contacto:', err);
        setError('No se pudo eliminar el contacto. Por favor, inténtalo de nuevo.');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Contactos</h2>
        <button
          onClick={() => setIsAdding(true)}
          className={`flex items-center px-3 py-1.5 rounded-md ${
            preferences.darkMode 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white transition-colors duration-200`}
        >
          <Plus size={16} className="mr-1" />
          <span>Nuevo contacto</span>
        </button>
      </div>
      
      {/* Estado de carga y error */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 size={24} className="animate-spin mr-2" />
          <span>Cargando contactos...</span>
        </div>
      )}
      
      {error && !isLoading && (
        <div className={`p-4 rounded-md ${
          preferences.darkMode ? 'bg-red-900/30' : 'bg-red-50'
        } ${
          preferences.darkMode ? 'text-red-200' : 'text-red-800'
        } flex items-center`}>
          <AlertCircle size={20} className="mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Formulario para añadir contacto */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`p-4 rounded-lg mb-4 ${preferences.darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}
        >
          <h3 className="font-medium mb-3">Nuevo Contacto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input 
                type="text" 
                className={`w-full p-2 rounded-md ${preferences.darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50'}`}
                placeholder="Nombre del contacto"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Apellidos</label>
              <input 
                type="text" 
                className={`w-full p-2 rounded-md ${preferences.darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50'}`}
                placeholder="Apellidos del contacto"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input 
                type="email" 
                className={`w-full p-2 rounded-md ${preferences.darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50'}`}
                placeholder="email@ejemplo.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Teléfono</label>
              <input 
                type="tel" 
                className={`w-full p-2 rounded-md ${preferences.darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50'}`}
                placeholder="+34 600 000 000"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button 
              onClick={() => setIsAdding(false)}
              className={`px-3 py-1.5 rounded-md ${preferences.darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Cancelar
            </button>
            <button 
              className={`px-3 py-1.5 rounded-md ${preferences.darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
            >
              Guardar
            </button>
          </div>
        </motion.div>
      )}

      {/* Lista de contactos */}
      {!isLoading && (
        <div className="space-y-4">
          {contacts.length === 0 ? (
            <div className={`p-8 text-center rounded-lg ${
              preferences.darkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <User size={40} className="mx-auto mb-3 text-gray-400" />
              <h3 className="font-medium">No hay contactos</h3>
              <p className={`mt-2 ${
                preferences.darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Este cliente aún no tiene contactos registrados.
              </p>
            </div>
          ) : (
            contacts.map(contact => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onEdit={(contact) => {
                  // Aquí iría la lógica para editar contacto
                  console.log('Editar contacto', contact);
                }}
                onDelete={handleDeleteContact}
                darkMode={preferences.darkMode}
              />
            ))
          )}
        </div>
      )}
      
      {/* Aquí iría el formulario para añadir/editar contacto */}
      {/* Se implementará en una futura actualización para mantener este componente más ligero */}
    </motion.div>
  );
};

export default ClientContactsTab;
