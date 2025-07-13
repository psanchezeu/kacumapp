import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  
  // Estado para tooltip activo
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  
  // Cerrar menú en cambios de vista en móvil
  useEffect(() => {
    if (isMobile && !preferences.collapseMenu) {
      toggleMenuCollapse();
    }
  }, [isMobile, preferences.collapseMenu, toggleMenuCollapse]);

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
    { id: 'projects', label: 'Mis Proyectos', icon: FolderOpen },
    { id: 'tasks', label: 'Mis Tareas', icon: CheckSquare },
    { id: 'invoices', label: 'Mis Facturas', icon: FileText },
    { id: 'settings', label: 'Configuración', icon: Settings }
  ];

  // Determinar qué menú mostrar según el rol del usuario
  const menuItems = user && (user as any).role === 'admin' ? adminMenuItems : clientMenuItems;

  // Mostrar tooltip
  const showTooltip = (id: string) => {
    if (preferences.collapseMenu && !isMobile) {
      setActiveTooltip(id);
    }
  };

  // Ocultar tooltip
  const hideTooltip = () => {
    setActiveTooltip(null);
  };

  return (
    <motion.div 
      className={`fixed left-0 top-0 h-screen ${
        preferences.collapseMenu ? "w-16" : "w-64"
      } ${
        preferences.darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      } shadow-lg flex flex-col z-20 transition-all duration-300 ease-in-out ${
        isMobile && preferences.collapseMenu ? "-translate-x-full" : "translate-x-0"
      }`}
      animate={{ 
        width: preferences.collapseMenu ? '4rem' : '16rem',
        x: (isMobile && preferences.collapseMenu) ? '-100%' : 0
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className={`p-4 ${preferences.darkMode ? "bg-gray-900" : "bg-gray-100"} flex items-center justify-between`}>
          <motion.div 
            initial={false}
            animate={{ opacity: preferences.collapseMenu ? 0 : 1 }}
            className="flex items-center"
          >
            <span className="text-xl font-bold">
              {preferences.collapseMenu ? '' : 'Kacum'}
            </span>
          </motion.div>
          
          {/* Toggle button solo visible en desktop */}
          {!isMobile && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMenuCollapse}
              className={`rounded-full p-1 ${preferences.darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"} transition-colors`}
            >
              {preferences.collapseMenu ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </motion.button>
          )}
        </div>
        
        {/* Menú de navegación */}
        <nav className="flex-grow py-4">
          <ul className="space-y-2 px-2">
            {menuItems.map((item) => (
              <motion.li key={item.id} className="relative">
                <motion.button
                  whileHover={{ 
                    backgroundColor: preferences.darkMode ? "rgba(75, 85, 99, 0.5)" : "rgba(243, 244, 246, 1)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSectionChange(item.id)}
                  onMouseEnter={() => showTooltip(item.id)}
                  onMouseLeave={hideTooltip}
                  className={`flex items-center w-full p-3 rounded-lg ${
                    activeSection === item.id 
                      ? preferences.darkMode 
                        ? "bg-gray-700 text-white" 
                        : "bg-gray-200 text-gray-900"
                      : "text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  } transition-all duration-200`}
                >
                  <item.icon size={20} />
                  {!preferences.collapseMenu && (
                    <span className="ml-4 truncate">{item.label}</span>
                  )}
                </motion.button>
                
                {/* Tooltip */}
                <AnimatePresence>
                  {activeTooltip === item.id && preferences.collapseMenu && !isMobile && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className={`absolute left-12 top-2 z-50 px-2 py-1 rounded ${
                        preferences.darkMode ? "bg-gray-700" : "bg-gray-800"
                      } text-white text-sm whitespace-nowrap`}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.li>
            ))}
          </ul>
        </nav>
        
        {/* User menu */}
        <div className={`mt-auto p-4 ${preferences.darkMode ? "border-t border-gray-700" : "border-t border-gray-100"}`}>
          <div className="flex items-center">
            {!preferences.collapseMenu && (
              <div className="mr-3">
                <img 
                  src={user?.avatarUrl || "https://ui-avatars.com/api/?name=User&background=random"} 
                  alt={user?.name || "Usuario"} 
                  className="h-8 w-8 rounded-full"
                />
              </div>
            )}
            
            {!preferences.collapseMenu && (
              <div className="flex-grow">
                <div className="text-sm font-medium truncate">
                  {user?.name || "Usuario"}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user && (user as any).role === 'admin' ? 'Administrador' : 'Cliente'}
                </div>
              </div>
            )}
            
            {/* Control buttons */}
            <div className="flex space-x-1">
              {/* Dark Mode Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                onMouseEnter={() => showTooltip('darkmode')}
                onMouseLeave={hideTooltip}
                className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {preferences.darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </motion.button>
              
              {/* Logout button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                onMouseEnter={() => showTooltip('logout')}
                onMouseLeave={hideTooltip}
                className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <LogOut size={18} />
              </motion.button>
              
              {/* Tooltips */}
              <AnimatePresence>
                {activeTooltip === 'darkmode' && preferences.collapseMenu && !isMobile && (
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute bottom-12 right-4 z-50 px-2 py-1 rounded ${
                      preferences.darkMode ? "bg-gray-700" : "bg-gray-800"
                    } text-white text-xs whitespace-nowrap`}
                  >
                    {preferences.darkMode ? 'Modo Claro' : 'Modo Oscuro'}
                  </motion.span>
                )}
              </AnimatePresence>
              
              <AnimatePresence>
                {activeTooltip === 'logout' && preferences.collapseMenu && !isMobile && (
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute bottom-12 right-4 z-50 px-2 py-1 rounded ${
                      preferences.darkMode ? "bg-gray-700" : "bg-gray-800"
                    } text-white text-xs whitespace-nowrap`}
                  >
                    Cerrar Sesión
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      
      {/* Botón de menú flotante para móvil */}
      {isMobile && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-4 right-4 z-30"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMenuCollapse}
            className={`p-3 rounded-full shadow-lg ${
              preferences.darkMode ? "bg-indigo-600 text-white" : "bg-white text-gray-800"
            }`}
          >
            <Menu size={24} />
          </motion.button>
        </motion.div>
      )}
      
      {/* Overlay para cerrar menú en móvil */}
      <AnimatePresence>
        {isMobile && !preferences.collapseMenu && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-10"
            onClick={toggleMenuCollapse}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Sidebar;
