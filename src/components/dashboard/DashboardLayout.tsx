import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import Sidebar from './Sidebar';
import AdminDashboard from './admin/AdminDashboard';
import ClientDashboard from './client/ClientDashboard';
import RequestsManagement from './admin/RequestsManagement';
import ProjectsManagement from './admin/ProjectsManagement';
import ClientsManagement from './admin/ClientsManagement';
import TasksManagement from './admin/TasksManagement';
import InvoicesManagement from './admin/InvoicesManagement';
import UserProfile from './client/UserProfile';
import UserSettings from './client/UserSettings';

const DashboardLayout: React.FC = () => {
  const { user } = useAuth();
  const { preferences, isMobile } = useUI();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setShowMobileMenu(false);
    }
  }, [activeSection, isMobile]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    if ((user as any)?.role === 'admin') {
      switch (activeSection) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'requests':
          return <RequestsManagement />;
        case 'projects':
          return <ProjectsManagement />;
        case 'clients':
          return <ClientsManagement />;
        case 'tasks':
          return <TasksManagement />;
        case 'invoices':
          return <InvoicesManagement />;
        case 'settings':
          return <UserSettings />;
        default:
          return <AdminDashboard />;
      }
    } else {
      switch (activeSection) {
        case 'dashboard':
          return <ClientDashboard />;
        case 'requests':
          return <div className="p-6"><h1 className="text-2xl font-bold">Mis Solicitudes</h1><p className="text-gray-600 mt-2">Funcionalidad en desarrollo...</p></div>;
        case 'projects':
          return <div className="p-6"><h1 className="text-2xl font-bold">Mis Proyectos</h1><p className="text-gray-600 mt-2">Funcionalidad en desarrollo...</p></div>;
        case 'invoices':
          return <div className="p-6"><h1 className="text-2xl font-bold">Mis Facturas</h1><p className="text-gray-600 mt-2">Funcionalidad en desarrollo...</p></div>;
        case 'profile':
          return <UserProfile />;
        case 'settings':
          return <UserSettings />;
        default:
          return <ClientDashboard />;
      }
    }
  };

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
          <Sidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
          
          {/* Main Content Area */}
          <motion.main 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`relative flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-300 ${
              (!preferences.collapseMenu && !isMobile) ? 'ml-64' : isMobile ? 'ml-0' : 'ml-20'
            } ${preferences.darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}
          >
            {renderContent()}
          </motion.main>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;