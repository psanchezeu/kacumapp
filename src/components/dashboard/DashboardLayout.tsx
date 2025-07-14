import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, Outlet } from 'react-router-dom';
// Mantenemos la importación de AuthContext comentada por si se necesita en el futuro
// import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import Sidebar from './Sidebar';

const DashboardLayout: React.FC = () => {
  // const { user } = useAuth(); // Comentado temporalmente ya que no se usa
  const { preferences, isMobile } = useUI();
  const location = useLocation();
  // const navigate = useNavigate(); // Comentado temporalmente ya que no se usa
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
    
    // Determinar la sección activa basada en la ruta actual
    const path = location.pathname;
    if (path.includes('/clients')) {
      setActiveSection('clients');
    } else if (path.includes('/projects')) {
      setActiveSection('projects');
    } else if (path.includes('/tasks')) {
      setActiveSection('tasks');
    } else if (path.includes('/invoices')) {
      setActiveSection('invoices');
    } else if (path.includes('/requests')) {
      setActiveSection('requests');
    } else if (path.includes('/settings')) {
      setActiveSection('settings');
    } else {
      setActiveSection('dashboard');
    }
  }, [location]);

  useEffect(() => {
    if (isMobile) {
      setShowMobileMenu(false);
    }
  }, [activeSection, isMobile]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    window.scrollTo(0, 0);
  };

  // Ya no necesitamos la función renderContent, las rutas se manejan con React Router

  return (
    <div 
      className={`min-h-screen w-full ${preferences.darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}
    >
      {isLoading ? (
        <div className="flex h-screen w-full items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 p-2 shadow-xl">
              <div className="h-full w-full rounded-full bg-white/20 p-2 backdrop-blur-sm">
                <div className="h-full w-full animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
              </div>
            </div>
            <p className="mt-4 text-lg font-medium">
              {preferences.darkMode ? 'Cargando panel...' : 'Cargando Kacum...'}  
            </p>
          </motion.div>
        </div>
      ) : (
        <div className="flex h-screen overflow-hidden">
          {/* Overlay para cerrar menú en móvil */}
          {isMobile && showMobileMenu && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-10"
              onClick={() => setShowMobileMenu(false)}
            />
          )}
          
          {/* Sidebar con posicionamiento condicional para móvil */}
          <Sidebar onSectionChange={handleSectionChange} />
          
          {/* Main Content Area */}
          <motion.main 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`relative flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-300 ${
              (!preferences.collapseMenu && !isMobile) ? 'ml-64' : isMobile ? 'ml-0' : 'ml-20'
            } ${preferences.darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}
          >
            {/* Usamos Outlet para que el contenido de las rutas secundarias se rendericen aquí */}
            <Outlet />
          </motion.main>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;