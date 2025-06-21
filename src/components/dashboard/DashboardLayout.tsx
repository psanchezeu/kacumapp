import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import AdminDashboard from './admin/AdminDashboard';
import ClientDashboard from './client/ClientDashboard';
import RequestsManagement from './admin/RequestsManagement';
import ProjectsManagement from './admin/ProjectsManagement';
import ClientsManagement from './admin/ClientsManagement';
import TasksManagement from './admin/TasksManagement';
import InvoicesManagement from './admin/InvoicesManagement';
import Settings from './admin/Settings';
import UserProfile from './client/UserProfile';

const DashboardLayout = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    if (user?.role === 'admin') {
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
          return <Settings />;
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
        default:
          return <ClientDashboard />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default DashboardLayout;