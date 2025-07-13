import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  CheckSquare, 
  FileText, 
  Settings, 
  LogOut,
  Bot,
  MessageSquare,
  User,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const { user, logout } = useAuth();
  const { preferences, toggleDarkMode, toggleMenuCollapse, isMobile } = useUI();

  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'requests', label: 'Solicitudes', icon: MessageSquare },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'projects', label: 'Proyectos', icon: FolderOpen },
    { id: 'tasks', label: 'Tareas', icon: CheckSquare },
    { id: 'invoices', label: 'Facturas', icon: FileText },
    { id: 'settings', label: 'Configuración', icon: Settings }
  ];

  const clientMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'requests', label: 'Mis Solicitudes', icon: MessageSquare },
    { id: 'projects', label: 'Mis Proyectos', icon: FolderOpen },
    { id: 'invoices', label: 'Mis Facturas', icon: FileText },
    { id: 'profile', label: 'Mi Perfil', icon: User }
  ];

  const menuItems = (user as any)?.role === 'admin' ? adminMenuItems : clientMenuItems;

  return (
    <div 
      className={`${preferences.collapseMenu ? 'w-20' : 'w-64'} transition-all duration-300 ease-in-out
        ${preferences.darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} 
        shadow-lg h-full flex flex-col relative z-20`}>
      {/* Mobile menu toggle (visible only on mobile) */}
      {isMobile && (
        <button
          onClick={toggleMenuCollapse}
          className={`absolute -right-3 top-4 w-6 h-6 rounded-full flex items-center justify-center z-30
            ${preferences.darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-700'} shadow-md`}
        >
          <Menu size={14} />
        </button>
      )}
      
      <div className={`${preferences.collapseMenu ? 'p-4' : 'p-6'} border-b ${preferences.darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className={`flex items-center ${preferences.collapseMenu ? 'justify-center' : 'space-x-3'}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          {!preferences.collapseMenu && (
            <div>
              <h1 className={`text-xl font-bold ${preferences.darkMode ? 'text-white' : 'text-gray-900'}`}>Kacum</h1>
              <p className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {(user as any)?.role === 'admin' ? 'Panel Admin' : 'Panel Cliente'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle button (visible only on desktop) */}
      {!isMobile && (
        <button
          onClick={toggleMenuCollapse}
          className={`absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center
            ${preferences.darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-700'} shadow-md`}
        >
          {preferences.collapseMenu ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      )}
      
      <nav className={`flex-1 ${preferences.collapseMenu ? 'px-2 py-4' : 'p-4'}`}>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex ${preferences.collapseMenu ? 'justify-center' : 'items-center space-x-3'} 
                  ${preferences.collapseMenu ? 'px-2' : 'px-4'} py-3 rounded-lg text-left transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : preferences.darkMode 
                      ? 'text-gray-300 hover:bg-gray-800' 
                      : 'text-gray-700 hover:bg-gray-100'
                }`}
                title={preferences.collapseMenu ? item.label : ''}
              >
                <item.icon className="w-5 h-5" />
                {!preferences.collapseMenu && <span className="font-medium">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className={`${preferences.collapseMenu ? 'p-2' : 'p-4'} border-t ${preferences.darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        {/* User Profile */}
        <div className={`flex ${preferences.collapseMenu ? 'justify-center' : 'items-center space-x-3'} mb-4`}>
          <div className={`w-10 h-10 ${preferences.darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full flex items-center justify-center`}>
            <User className={`w-5 h-5 ${preferences.darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
          </div>
          {!preferences.collapseMenu && (
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${preferences.darkMode ? 'text-gray-200' : 'text-gray-900'} truncate`}>{user?.name}</p>
              <p className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>{user?.email}</p>
            </div>
          )}
        </div>
        
        {/* Theme Toggle */}
        <div className="mb-4">
          <button
            onClick={toggleDarkMode}
            className={`w-full flex items-center ${preferences.collapseMenu ? 'justify-center' : 'space-x-3 px-4'} py-2 rounded-lg 
              ${preferences.darkMode 
                ? 'text-yellow-400 hover:bg-gray-800' 
                : 'text-gray-700 hover:bg-gray-100'} 
              transition-all duration-200`}
          >
            {preferences.darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {!preferences.collapseMenu && <span className="font-medium">{preferences.darkMode ? 'Modo Claro' : 'Modo Oscuro'}</span>}
          </button>
        </div>
        
        {/* Logout Button */}
        <button
          onClick={logout}
          className={`w-full flex ${preferences.collapseMenu ? 'justify-center' : 'items-center space-x-3 px-4'} py-2 
            ${preferences.darkMode 
              ? 'text-gray-300 hover:bg-red-900 hover:text-red-300' 
              : 'text-gray-700 hover:bg-red-50 hover:text-red-600'} 
            rounded-lg transition-all duration-200`}
          title={preferences.collapseMenu ? 'Cerrar Sesión' : ''}
        >
          <LogOut className="w-5 h-5" />
          {!preferences.collapseMenu && <span className="font-medium">Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;