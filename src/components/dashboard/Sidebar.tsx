import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  CheckSquare, 
  FileText, 
  Settings, 
  LogOut,
  MessageSquare,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';

interface SidebarProps {
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSectionChange }) => {
  const { user, logout } = useAuth();
  const { preferences, toggleDarkMode, toggleMenuCollapse, isMobile } = useUI();
  const location = useLocation();
  
  // Estado para tooltip activo
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  
  // Cerrar menú en cambios de vista en móvil
  useEffect(() => {
    if (isMobile && !preferences.collapseMenu) {
      toggleMenuCollapse();
    }
  }, [isMobile, preferences.collapseMenu, toggleMenuCollapse]);

  // Definir elementos del menú para administradores
  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'requests', label: 'Solicitudes', icon: MessageSquare, path: '/dashboard/requests' },
    { id: 'clients', label: 'Clientes', icon: Users, path: '/dashboard/clients' },
    { id: 'projects', label: 'Proyectos', icon: FolderOpen, path: '/dashboard/projects' },
    { id: 'tasks', label: 'Tareas', icon: CheckSquare, path: '/dashboard/tasks' },
    { id: 'invoices', label: 'Facturas', icon: FileText, path: '/dashboard/invoices' },
    { id: 'settings', label: 'Configuración', icon: Settings, path: '/dashboard/settings' }
  ];

  const clientMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'projects', label: 'Mis Proyectos', icon: FolderOpen, path: '/dashboard/projects' },
    { id: 'tasks', label: 'Mis Tareas', icon: CheckSquare, path: '/dashboard/tasks' },
    { id: 'invoices', label: 'Mis Facturas', icon: FileText, path: '/dashboard/invoices' },
    { id: 'settings', label: 'Configuración', icon: Settings, path: '/dashboard/settings' }
  ];

  // Determinar qué menú mostrar según el rol del usuario
  const menuItems = user && user.role === 'admin' ? adminMenuItems : clientMenuItems;
  
  // Para depuración - mostrar el rol del usuario en consola
  useEffect(() => {
    if (user) {
      console.log('Usuario actual:', user);
      console.log('Rol del usuario:', user.role);
      console.log('Menú seleccionado:', user.role === 'admin' ? 'Admin' : 'Cliente');
    }
  }, [user]);

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

  // Botón flotante para móvil que permite mostrar el menú
  const renderMobileToggle = () => {
    if (!isMobile) return null;
    
    return (
      <button 
        onClick={toggleMenuCollapse}
        className={`fixed bottom-6 ${preferences.darkMode ? 'bg-gray-700' : 'bg-blue-600'} text-white p-3 rounded-full shadow-lg z-30 flex items-center justify-center transition-all duration-300 ${!preferences.collapseMenu ? 'left-[260px]' : 'left-6'}`}
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </button>
    );
  };

  return (
    <>
      {renderMobileToggle()}
      <motion.div 
        className={`fixed left-0 top-0 h-screen ${
          preferences.collapseMenu ? "w-16" : "w-64"
        } ${
          preferences.darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        } shadow-lg flex flex-col z-20 transition-all duration-300 ease-in-out ${
          // En móvil, mostrar sólo cuando NO está colapsado
          isMobile ? (preferences.collapseMenu ? "-translate-x-full" : "translate-x-0") : "translate-x-0"
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
              <li key={item.id}>
                <Link to={item.path} className="w-full">
                  <motion.button
                    onClick={() => onSectionChange(item.id)}
                    className={`flex items-center w-full p-3 my-1 rounded-lg transition-colors duration-200 ${location.pathname.startsWith(item.path) || (item.id === 'dashboard' && location.pathname === '/dashboard')
                      ? preferences.darkMode
                        ? "bg-blue-900/40 text-white"
                        : "bg-blue-100 text-blue-700"
                      : preferences.darkMode
                      ? "hover:bg-gray-700 text-gray-300"
                      : "hover:bg-gray-200 text-gray-700"}`}
                    onMouseEnter={() => showTooltip(item.id)}
                    onMouseLeave={hideTooltip}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon size={20} className={`${preferences.collapseMenu ? "mx-auto" : "mr-3"}`} />
                    {!preferences.collapseMenu && <span className="whitespace-nowrap">{item.label}</span>}
                    {preferences.collapseMenu && activeTooltip === item.id && !isMobile && (
                      <div className="absolute left-16 bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-md z-50">
                        {item.label}
                      </div>
                    )}
                  </motion.button>
                </Link>
              </li>
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
    </>
  );
};

export default Sidebar;
