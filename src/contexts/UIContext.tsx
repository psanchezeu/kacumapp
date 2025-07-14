import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

export interface UIPreferences {
  darkMode: boolean;
  collapseMenu: boolean;
  language: string;
  theme?: 'system' | 'light' | 'dark';
  accentColor?: string;
  fontSize?: string;
  notifications?: {
    email: boolean;
    app: boolean;
  };
}

interface UIContextType {
  preferences: UIPreferences;
  isMobile: boolean;
  toggleDarkMode: () => void;
  toggleMenuCollapse: () => void;
  setLanguage: (lang: string) => void;
  setTheme: (theme: 'system' | 'light' | 'dark') => Promise<void>;
  setAccentColor: (color: string) => Promise<void>;
  setFontSize: (size: string) => Promise<void>;
  updatePreferences: (prefs: Partial<UIPreferences>) => Promise<void>;
  savePreferences: (prefs: Partial<UIPreferences>) => Promise<void>;
}

const defaultPreferences: UIPreferences = {
  darkMode: false,
  collapseMenu: false,
  language: 'es',
  theme: 'system',
  accentColor: 'blue',
  fontSize: 'medium',
};

export const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const [preferences, setPreferences] = useState<UIPreferences>(defaultPreferences);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  // Detectar si es un dispositivo móvil
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // Si es móvil, colapsar el menú automáticamente
      if (window.innerWidth < 768 && !preferences.collapseMenu) {
        setPreferences(prev => ({ ...prev, collapseMenu: true }));
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Comprobar al inicio

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [preferences.collapseMenu]);

  // Cargar preferencias del usuario cuando cambia el estado de auth
  useEffect(() => {
    const loadPreferences = async () => {
      if (user && !isLoading) {
        try {
          // Cargar preferencias básicas del usuario
          const userPrefs: UIPreferences = {
            darkMode: (user as any)?.darkMode ?? false,
            collapseMenu: (user as any)?.collapseMenu ?? false,
            language: (user as any)?.language ?? 'es'
          };

          // Cargar preferencias avanzadas si existen
          // Nota: Los errores 404 son esperados si el backend no tiene implementada esta funcionalidad
          if (user.id) {
            try {
              const response = await api.get(`/api/users/${user.id}/settings`);
              if (response.data) {
                userPrefs.theme = response.data.theme || 'system';
                userPrefs.accentColor = response.data.accentColor || 'blue';
                userPrefs.fontSize = response.data.fontSize || 'medium';
              }
            } catch (error: any) {
              // Silenciar errores 404 ya que pueden ser esperados
              if (error?.response?.status !== 404) {
                console.error('Error loading user settings', error);
              }
            }
          }

          setPreferences(userPrefs);
          
          // Aplicar tema oscuro si está activado
          if (userPrefs.darkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        } catch (error) {
          console.error('Error loading user preferences', error);
        }
      } else {
        // Usar preferencias por defecto si no hay usuario
        setPreferences(defaultPreferences);
        document.documentElement.classList.remove('dark');
      }
    };

    loadPreferences();
  }, [user, isLoading]);

  // Guardar preferencias en la BD
  const savePreferences = async (prefs: Partial<UIPreferences>): Promise<void> => {
    if (!user) return;

    try {
      // Actualizar el estado local primero para UI inmediata
      const newPrefs = { ...preferences, ...prefs };
      setPreferences(newPrefs);

      // Aplicar el tema oscuro si es necesario
      if (prefs.darkMode !== undefined) {
        if (prefs.darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }

      // Guardar en la BD
      await api.put(`/api/users/${user.id}/preferences`, prefs);

      // Si hay cambios en las preferencias avanzadas, actualizarlas también
      if (prefs.theme || prefs.accentColor || prefs.fontSize) {
        if (user.id) {
        await api.put(`/api/users/${user.id}/settings`, {
          theme: prefs.theme || preferences.theme,
          accentColor: prefs.accentColor || preferences.accentColor,
          fontSize: prefs.fontSize || preferences.fontSize,
        });
      }
      }

      return;
    } catch (error) {
      console.error('Error saving user preferences', error);
      // En caso de error, solo registramos pero no interrumpimos el flujo
      return;
    }
  };

  const toggleDarkMode = async () => {
    const newValue = !preferences.darkMode;
    await savePreferences({ darkMode: newValue });
  };

  const toggleMenuCollapse = async () => {
    const newValue = !preferences.collapseMenu;
    await savePreferences({ collapseMenu: newValue });
  };

  const setLanguage = async (language: string) => {
    await savePreferences({ language });
  };

  const setTheme = async (theme: 'system' | 'light' | 'dark') => {
    await savePreferences({ theme });
  };

  const setAccentColor = async (accentColor: string) => {
    await savePreferences({ accentColor });
  };

  const setFontSize = async (fontSize: string) => {
    await savePreferences({ fontSize });
  };

  const updatePreferences = async (prefs: Partial<UIPreferences>): Promise<void> => {
    // Actualizar el estado local
    setPreferences(prev => ({
      ...prev,
      ...prefs
    }));
    
    // Guardar en backend
    await savePreferences(prefs);
  };

  const value: UIContextType = {
    preferences,
    isMobile,
    toggleDarkMode,
    toggleMenuCollapse,
    setLanguage,
    setTheme,
    setAccentColor,
    setFontSize,
    updatePreferences,
    savePreferences,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
