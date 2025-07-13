import { useState, useEffect } from 'react';
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
// Utilizamos UserSettings para la configuración en su lugar
import UserProfile from './client/UserProfile';
import UserSettings from './client/UserSettings';

const DashboardLayout = () => {
  const { user } = useAuth();
  const { preferences, isMobile } = useUI();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Cerrar menú móvil al cambiar de sección
  useEffect(() => {
    if (isMobile) {
      setShowMobileMenu(false);
    }
  }, [activeSection, isMobile]);

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
    <div className={`min-h-screen flex ${preferences.darkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Overlay para cerrar menú en móvil */}
      {isMobile && showMobileMenu && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setShowMobileMenu(false)}
        />
      )}
      
      {/* Sidebar con posicionamiento condicional para móvil */}
      <div 
        className={`${isMobile ? 'fixed' : 'relative'} h-full z-20 
          ${isMobile && !showMobileMenu ? '-translate-x-full' : 'translate-x-0'} 
          transition-transform duration-300 ease-in-out`}
      >
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={(section) => {
            setActiveSection(section);
            if (isMobile) setShowMobileMenu(false);
          }} 
        />
      </div>
      
      {/* Contenido principal */}
      <div className={`flex-1 overflow-auto transition-all duration-300 ${preferences.collapseMenu && !isMobile ? 'ml-20' : ''}`}>
        <div className="p-4 md:p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;