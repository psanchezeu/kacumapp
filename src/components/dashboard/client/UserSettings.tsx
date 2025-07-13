import React, { useState } from 'react';
import { useUI } from '../../../contexts/UIContext';
import { useAuth } from '../../../contexts/AuthContext';
import { Save, RotateCw } from 'lucide-react';

const UserSettings = () => {
  const { user } = useAuth();
  const { preferences, updatePreferences } = useUI();
  
  const [formData, setFormData] = useState({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus({});
    
    try {
      // Actualizar todas las preferencias
      await updatePreferences({
        darkMode: formData.darkMode,
        collapseMenu: formData.collapseMenu,
        language: formData.language,
        theme: formData.theme as 'system' | 'light' | 'dark',
        accentColor: formData.accentColor,
        fontSize: formData.fontSize,
        notifications: formData.notifications
      });
      
      setSaveStatus({ 
        success: true, 
        message: 'Preferencias guardadas correctamente' 
      });
    } catch (error) {
      console.error('Error al guardar preferencias:', error);
      setSaveStatus({ 
        success: false, 
        message: 'Error al guardar preferencias. Intente nuevamente.' 
      });
    } finally {
      setIsSaving(false);
      // Limpiar el mensaje después de 3 segundos
      setTimeout(() => setSaveStatus({}), 3000);
    }
  };

  return (
    <div className={`${preferences.darkMode ? 'text-white' : 'text-gray-800'}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Configuración de Usuario</h1>
        <p className={`mt-2 ${preferences.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Personaliza tu experiencia en Kacum
        </p>
      </div>

      <div className={`bg-${preferences.darkMode ? 'gray-800' : 'white'} shadow-sm rounded-lg p-6 mb-6`}>
        <h2 className="text-xl font-medium mb-4">Preferencias de Interfaz</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tema */}
            <div>
              <label className="block mb-2 font-medium">Tema</label>
              <select
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                className={`w-full p-2 rounded-md border ${
                  preferences.darkMode 
                    ? 'border-gray-600 bg-gray-700 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
              >
                <option value="system">Automático (según sistema)</option>
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
              </select>
            </div>

            {/* Modo oscuro directo */}
            <div>
              <label className="block mb-2 font-medium">Modo Oscuro</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="darkMode"
                  checked={formData.darkMode}
                  onChange={handleChange}
                  className="h-5 w-5 rounded border-gray-300"
                />
                <span className="ml-2">Activar modo oscuro</span>
              </div>
            </div>
            
            {/* Color de acento */}
            <div>
              <label className="block mb-2 font-medium">Color de Acento</label>
              <select
                name="accentColor"
                value={formData.accentColor}
                onChange={handleChange}
                className={`w-full p-2 rounded-md border ${
                  preferences.darkMode 
                    ? 'border-gray-600 bg-gray-700 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
              >
                <option value="blue">Azul</option>
                <option value="purple">Púrpura</option>
                <option value="green">Verde</option>
                <option value="orange">Naranja</option>
              </select>
            </div>
            
            {/* Tamaño de fuente */}
            <div>
              <label className="block mb-2 font-medium">Tamaño de Texto</label>
              <select
                name="fontSize"
                value={formData.fontSize}
                onChange={handleChange}
                className={`w-full p-2 rounded-md border ${
                  preferences.darkMode 
                    ? 'border-gray-600 bg-gray-700 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
              >
                <option value="small">Pequeño</option>
                <option value="medium">Mediano</option>
                <option value="large">Grande</option>
              </select>
            </div>
            
            {/* Idioma */}
            <div>
              <label className="block mb-2 font-medium">Idioma</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className={`w-full p-2 rounded-md border ${
                  preferences.darkMode 
                    ? 'border-gray-600 bg-gray-700 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
            
            {/* Menú lateral */}
            <div>
              <label className="block mb-2 font-medium">Menú Lateral</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="collapseMenu"
                  checked={formData.collapseMenu}
                  onChange={handleChange}
                  className="h-5 w-5 rounded border-gray-300"
                />
                <span className="ml-2">Contraer menú automáticamente</span>
              </div>
            </div>
          </div>
          
          {/* Notificaciones */}
          <div className="mt-8 mb-4">
            <h3 className="text-lg font-medium mb-2">Notificaciones</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="email"
                    checked={formData.notifications.email}
                    onChange={handleNotificationChange}
                    className="h-5 w-5 rounded border-gray-300"
                  />
                  <span className="ml-2">Recibir notificaciones por correo</span>
                </div>
              </div>
              <div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="app"
                    checked={formData.notifications.app}
                    onChange={handleNotificationChange}
                    className="h-5 w-5 rounded border-gray-300"
                  />
                  <span className="ml-2">Notificaciones en la aplicación</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Estado de guardado */}
          {saveStatus.message && (
            <div 
              className={`my-4 p-3 rounded-md ${
                saveStatus.success 
                  ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                  : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
              }`}
            >
              {saveStatus.message}
            </div>
          )}
          
          {/* Botón de guardar */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              {isSaving ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar Preferencias</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      <div className={`bg-${preferences.darkMode ? 'gray-800' : 'white'} shadow-sm rounded-lg p-6`}>
        <h2 className="text-xl font-medium mb-4">Información de Cuenta</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className={`font-medium ${preferences.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Nombre:
            </p>
            <p>{user?.name}</p>
          </div>
          
          <div>
            <p className={`font-medium ${preferences.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Email:
            </p>
            <p>{user?.email}</p>
          </div>
          
          <div>
            <p className={`font-medium ${preferences.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Rol:
            </p>
            <p className="capitalize">{(user as any)?.role}</p>
          </div>
          
          <div>
            <p className={`font-medium ${preferences.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Fecha de registro:
            </p>
            <p>{new Date((user as any)?.createdAt || '').toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
