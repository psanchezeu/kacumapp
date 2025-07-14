import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUI } from '../../../../../contexts/UIContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  FileText,
  Upload,
  X
} from 'lucide-react';

// Tipos
interface Client {
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
  avatarFile?: File; // Añadido para manejar el archivo de avatar
}

interface Props {
  client: Client;
  isEditing: boolean;
  onClientChange: (updatedClient: Partial<Client>) => void;
  onAvatarChange: (file: File | null) => void;
}

// Componente
const ClientGeneralTab: React.FC<Props> = ({ client, isEditing, onClientChange, onAvatarChange }) => {
  const { preferences } = useUI();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(client.avatarUrl);
  
  // Manejador de cambios en formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onClientChange({ [name]: value });
  };
  
  // Manejador de cambio de avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onAvatarChange(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      onAvatarChange(null);
    }
  };
  
  // Eliminar avatar
  const handleRemoveAvatar = () => {
    onAvatarChange(null);
    setAvatarPreview(null);
    onClientChange({ avatarUrl: '' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Avatar */}
      <div className="flex items-start space-x-6">
        <div className="relative">
          <div className={`w-24 h-24 rounded-lg overflow-hidden ${
            preferences.darkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            {avatarPreview ? (
              <img 
                src={avatarPreview} 
                alt={client.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User size={48} className="text-gray-400" />
              </div>
            )}
          </div>
          
          {isEditing && (
            <div className="mt-2 flex space-x-2">
              <label className={`cursor-pointer flex items-center px-2 py-1 text-xs rounded ${
                preferences.darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}>
                <Upload size={14} className="mr-1" />
                <span>Subir</span>
                <input 
                  type="file" 
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
              
              {avatarPreview && (
                <button
                  onClick={handleRemoveAvatar}
                  className={`flex items-center px-2 py-1 text-xs rounded ${
                    preferences.darkMode ? 'bg-red-900/50 hover:bg-red-800' : 'bg-red-100 hover:bg-red-200'
                  } ${
                    preferences.darkMode ? 'text-red-200' : 'text-red-700'
                  }`}
                >
                  <X size={14} className="mr-1" />
                  <span>Eliminar</span>
                </button>
              )}
            </div>
          )}
        </div>
        
        <div className="space-y-4 flex-1">
          {/* Nombre */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              preferences.darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Nombre
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={client.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-md border ${
                  preferences.darkMode 
                    ? 'border-gray-600 bg-gray-700 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                } focus:outline-none focus:ring-2 ${
                  preferences.darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-600'
                }`}
                required
              />
            ) : (
              <div className="flex items-center">
                <User size={16} className="mr-2 text-gray-400" />
                <p className="text-lg font-medium">{client.name || '—'}</p>
              </div>
            )}
          </div>
          
          {/* Email */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              preferences.darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={client.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-md border ${
                  preferences.darkMode 
                    ? 'border-gray-600 bg-gray-700 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                } focus:outline-none focus:ring-2 ${
                  preferences.darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-600'
                }`}
                required
              />
            ) : (
              <div className="flex items-center">
                <Mail size={16} className="mr-2 text-gray-400" />
                <p>{client.email || '—'}</p>
              </div>
            )}
          </div>
          
          {/* Estado */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              preferences.darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Estado
            </label>
            {isEditing ? (
              <select
                name="status"
                value={client.status}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-md border ${
                  preferences.darkMode 
                    ? 'border-gray-600 bg-gray-700 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                } focus:outline-none focus:ring-2 ${
                  preferences.darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-600'
                }`}
              >
                <option value="prospect">Prospecto</option>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            ) : (
              <div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  client.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : client.status === 'inactive' 
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-100 text-blue-800'
                }`}>
                  {client.status === 'active' 
                    ? 'Activo' 
                    : client.status === 'inactive' 
                      ? 'Inactivo'
                      : 'Prospecto'
                  }
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Teléfono */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${
            preferences.darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Teléfono
          </label>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={client.phone || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md border ${
                preferences.darkMode 
                  ? 'border-gray-600 bg-gray-700 text-white' 
                  : 'border-gray-300 bg-white text-gray-900'
              } focus:outline-none focus:ring-2 ${
                preferences.darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-600'
              }`}
            />
          ) : (
            <div className="flex items-center">
              <Phone size={16} className="mr-2 text-gray-400" />
              <p>{client.phone || '—'}</p>
            </div>
          )}
        </div>
        
        {/* Sitio web */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${
            preferences.darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Sitio web
          </label>
          {isEditing ? (
            <input
              type="url"
              name="website"
              value={client.website || ''}
              onChange={handleChange}
              placeholder="https://ejemplo.com"
              className={`w-full px-3 py-2 rounded-md border ${
                preferences.darkMode 
                  ? 'border-gray-600 bg-gray-700 text-white' 
                  : 'border-gray-300 bg-white text-gray-900'
              } focus:outline-none focus:ring-2 ${
                preferences.darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-600'
              }`}
            />
          ) : (
            <div className="flex items-center">
              <Globe size={16} className="mr-2 text-gray-400" />
              {client.website ? (
                <a 
                  href={client.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {client.website}
                </a>
              ) : (
                <p>—</p>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Dirección */}
      <div className="space-y-4">
        <h3 className={`font-medium ${
          preferences.darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Dirección
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dirección */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              preferences.darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Calle
            </label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={client.address || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-md border ${
                  preferences.darkMode 
                    ? 'border-gray-600 bg-gray-700 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                } focus:outline-none focus:ring-2 ${
                  preferences.darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-600'
                }`}
              />
            ) : (
              <p className={preferences.darkMode ? 'text-gray-300' : 'text-gray-700'}>
                {client.address || '—'}
              </p>
            )}
          </div>
          
          {/* Ciudad */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              preferences.darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Ciudad
            </label>
            {isEditing ? (
              <input
                type="text"
                name="city"
                value={client.city || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-md border ${
                  preferences.darkMode 
                    ? 'border-gray-600 bg-gray-700 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                } focus:outline-none focus:ring-2 ${
                  preferences.darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-600'
                }`}
              />
            ) : (
              <p className={preferences.darkMode ? 'text-gray-300' : 'text-gray-700'}>
                {client.city || '—'}
              </p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Código postal */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              preferences.darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Código postal
            </label>
            {isEditing ? (
              <input
                type="text"
                name="postalCode"
                value={client.postalCode || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-md border ${
                  preferences.darkMode 
                    ? 'border-gray-600 bg-gray-700 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                } focus:outline-none focus:ring-2 ${
                  preferences.darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-600'
                }`}
              />
            ) : (
              <p className={preferences.darkMode ? 'text-gray-300' : 'text-gray-700'}>
                {client.postalCode || '—'}
              </p>
            )}
          </div>
          
          {/* País */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              preferences.darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              País
            </label>
            {isEditing ? (
              <input
                type="text"
                name="country"
                value={client.country || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-md border ${
                  preferences.darkMode 
                    ? 'border-gray-600 bg-gray-700 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                } focus:outline-none focus:ring-2 ${
                  preferences.darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-600'
                }`}
              />
            ) : (
              <p className={preferences.darkMode ? 'text-gray-300' : 'text-gray-700'}>
                {client.country || '—'}
              </p>
            )}
          </div>
        </div>
        
        {/* Dirección completa en modo visualización */}
        {!isEditing && (client.address || client.city || client.postalCode || client.country) && (
          <div className="flex items-start mt-2">
            <MapPin size={16} className="mr-2 text-gray-400 mt-1" />
            <p className={preferences.darkMode ? 'text-gray-300' : 'text-gray-700'}>
              {[
                client.address,
                client.city,
                client.postalCode,
                client.country
              ].filter(Boolean).join(', ')}
            </p>
          </div>
        )}
      </div>
      
      {/* Notas */}
      <div>
        <label className={`block text-sm font-medium mb-1 ${
          preferences.darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Notas
        </label>
        {isEditing ? (
          <textarea
            name="notes"
            value={client.notes || ''}
            onChange={handleChange}
            rows={4}
            className={`w-full px-3 py-2 rounded-md border ${
              preferences.darkMode 
                ? 'border-gray-600 bg-gray-700 text-white' 
                : 'border-gray-300 bg-white text-gray-900'
            } focus:outline-none focus:ring-2 ${
              preferences.darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-600'
            }`}
          />
        ) : (
          <div className="flex items-start">
            <FileText size={16} className="mr-2 text-gray-400 mt-1" />
            <p className={`whitespace-pre-wrap ${
              preferences.darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {client.notes || 'No hay notas para este cliente.'}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ClientGeneralTab;
