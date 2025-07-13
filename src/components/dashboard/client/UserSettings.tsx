import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUI } from '../../../contexts/UIContext';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  Save, 
  RotateCw, 
  Check, 
  AlertCircle, 
  User as UserIcon, 
  Mail, 
  Shield, 
  BellRing,
  Palette,
  Moon,
  Sun,
  Laptop,
  PanelLeft
} from 'lucide-react';

// Definición de tipos para el formulario de configuración
type NotificationSettings = {
  email: boolean;
  app: boolean;
  push?: boolean;
};

interface SettingsFormData {
  darkMode: boolean;
  collapseMenu: boolean;
  language: string;
  theme: 'system' | 'light' | 'dark';
  accentColor: string;
  fontSize: string;
  notifications: NotificationSettings;
}

// Componente de configuración del usuario
const UserSettings: React.FC = () => {
  const { user } = useAuth();
  const { preferences, updatePreferences } = useUI();
  
  // Estado para la pestaña activa
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'notifications'>('general');
  
  // Estado para animación de guardado
  const [showSavedAnimation, setShowSavedAnimation] = useState(false);
  
  // Estado del formulario con tipos mejorados
  const [formData, setFormData] = useState<SettingsFormData>({
    darkMode: preferences.darkMode,
    collapseMenu: preferences.collapseMenu,
    language: preferences.language || 'es',
    theme: preferences.theme || 'system',
    accentColor: preferences.accentColor || 'blue',
    fontSize: preferences.fontSize || 'medium',
    notifications: {
      email: preferences.notifications?.email || false,
      app: preferences.notifications?.app || true,
    },
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ success?: boolean; message?: string }>({});

  // Efectos para cargar las preferencias del usuario
  useEffect(() => {
    // Mostrar una animación cuando se guardan los cambios con éxito
    if (saveStatus.success) {
      setShowSavedAnimation(true);
      const timer = setTimeout(() => {
        setShowSavedAnimation(false);
        setSaveStatus({});
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  // Gestionar cambios en inputs y selects
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Gestionar cambios en configuración de notificaciones
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: checked
      }
    }));
  };
  
  // Cambiar de pestaña
  const switchTab = (tab: 'general' | 'appearance' | 'notifications') => {
    setActiveTab(tab);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Actualizar preferencias en el contexto UI
      await updatePreferences(formData);
      
      setSaveStatus({
        success: true,
        message: 'Preferencias guardadas correctamente'
      });
    } catch (error) {
      console.error('Error al guardar las preferencias:', error);
      setSaveStatus({
        success: false,
        message: 'Error al guardar las preferencias'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Renderizado de las pestañas
  const renderTabs = () => (
    <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
      <div className="flex space-x-4">
        <button 
          onClick={() => switchTab('general')}
          className={`flex items-center py-3 px-4 border-b-2 font-medium text-sm ${activeTab === 'general'
            ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
        >
          <UserIcon size={18} className="mr-2" />
          General
        </button>
        
        <button
          onClick={() => switchTab('appearance')}
          className={`flex items-center py-3 px-4 border-b-2 font-medium text-sm ${activeTab === 'appearance'
            ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
        >
          <Palette size={18} className="mr-2" />
          Apariencia
        </button>
        
        <button
          onClick={() => switchTab('notifications')}
          className={`flex items-center py-3 px-4 border-b-2 font-medium text-sm ${activeTab === 'notifications'
            ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
        >
          <BellRing size={18} className="mr-2" />
          Notificaciones
        </button>
      </div>
    </div>
  );

  // Animación para mostrar que se ha guardado con éxito
  const renderSavedAnimation = () => (
    <AnimatePresence>
      {showSavedAnimation && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-4 right-4 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 p-4 rounded-md shadow-lg flex items-center z-50"
        >
          <Check size={20} className="mr-2" />
          Configuración guardada correctamente
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Pestaña de configuración general
  const renderGeneralTab = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm mb-6">
        <h2 className="text-lg font-medium mb-4 dark:text-white">Información Personal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              disabled
              value={user?.name || ''}
              className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              disabled
              value={user?.email || ''}
              className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm">
        <h2 className="text-lg font-medium mb-4 dark:text-white">Idioma</h2>
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Seleccionar idioma
          </label>
          <select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Este ajuste cambiará el idioma de la interfaz de usuario.
          </p>
        </div>
      </div>
    </motion.div>
  );

  // Pestaña de apariencia
  const renderAppearanceTab = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm mb-6">
        <h2 className="text-lg font-medium mb-4 dark:text-white">Tema</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Modo de apariencia
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={formData.theme === 'light'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <Sun size={18} className="mr-1" />
                <span className="text-sm">Claro</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={formData.theme === 'dark'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <Moon size={18} className="mr-1" />
                <span className="text-sm">Oscuro</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  name="theme"
                  value="system"
                  checked={formData.theme === 'system'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <Laptop size={18} className="mr-1" />
                <span className="text-sm">Sistema</span>
              </label>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="collapseMenu"
                checked={formData.collapseMenu}
                onChange={handleChange}
                className="mr-2"
              />
              <PanelLeft size={18} className="mr-1" />
              <span className="text-sm">Menú lateral colapsado por defecto</span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm mb-6">
        <h2 className="text-lg font-medium mb-4 dark:text-white">Personalización</h2>
        
        <div className="mb-4">
          <label htmlFor="accentColor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Color de acento
          </label>
          <select
            id="accentColor"
            name="accentColor"
            value={formData.accentColor}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
          >
            <option value="blue">Azul</option>
            <option value="purple">Morado</option>
            <option value="green">Verde</option>
            <option value="orange">Naranja</option>
            <option value="red">Rojo</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tamaño de fuente
          </label>
          <select
            id="fontSize"
            name="fontSize"
            value={formData.fontSize}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
          >
            <option value="small">Pequeño</option>
            <option value="medium">Mediano</option>
            <option value="large">Grande</option>
          </select>
        </div>
      </div>
    </motion.div>
  );

  // Pestaña de notificaciones
  const renderNotificationsTab = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm">
        <h2 className="text-lg font-medium mb-4 dark:text-white">Preferencias de notificaciones</h2>
        
        <div className="space-y-4">
          <div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="email"
                checked={formData.notifications.email}
                onChange={handleNotificationChange}
                className="mr-2"
              />
              <Mail size={18} className="mr-2" />
              <div>
                <span className="text-sm font-medium">Notificaciones por correo</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Recibir alertas y actualizaciones en tu correo electrónico
                </p>
              </div>
            </label>
          </div>
          
          <div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="app"
                checked={formData.notifications.app}
                onChange={handleNotificationChange}
                className="mr-2"
              />
              <BellRing size={18} className="mr-2" />
              <div>
                <span className="text-sm font-medium">Notificaciones en la aplicación</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Mostrar alertas dentro de la aplicación
                </p>
              </div>
            </label>
          </div>
          
          {formData.notifications.push !== undefined && (
            <div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="push"
                  checked={formData.notifications.push}
                  onChange={handleNotificationChange}
                  className="mr-2"
                />
                <Shield size={18} className="mr-2" />
                <div>
                  <span className="text-sm font-medium">Notificaciones push</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Recibir notificaciones incluso cuando no estás usando la aplicación
                  </p>
                </div>
              </label>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-sm rounded-lg"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Configuración de Usuario</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Última actualización: {new Date().toLocaleDateString()}
        </div>
      </div>
      
      {/* Notificaciones de estado */}
      {saveStatus.success && (
        <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-3 rounded-md mb-4 flex items-center">
          <Check size={18} className="mr-2" />
          {saveStatus.message || 'Configuración guardada correctamente'}
        </div>
      )}
      
      {saveStatus.success === false && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-md mb-4 flex items-center">
          <AlertCircle size={18} className="mr-2" />
          {saveStatus.message || 'Error al guardar la configuración'}
        </div>
      )}
      
      {/* Animación de guardado */}
      {renderSavedAnimation()}
      
      {/* Pestañas */}
      {renderTabs()}
      
      <form onSubmit={handleSubmit}>
        {/* Contenido de las pestañas */}
        <AnimatePresence mode="wait">
          {activeTab === 'general' && renderGeneralTab()}
          {activeTab === 'appearance' && renderAppearanceTab()}
          {activeTab === 'notifications' && renderNotificationsTab()}
        </AnimatePresence>
        
        {/* Botón de guardar */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RotateCw size={18} className="mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Guardar cambios
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default UserSettings;
