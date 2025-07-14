import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../../../../contexts/UIContext';
import { useAuth } from '../../../../contexts/AuthContext';
import { 
  Users,
  Plus, 
  Search,
  MoreVertical,
  Edit,
  Trash,
  Eye,
  UserPlus,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

// Tipo para datos del cliente
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: 'active' | 'inactive' | 'prospect';
  createdAt: string;
  avatarUrl: string | null;
}

// Componente para la vista de lista de clientes
const ClientsList: React.FC = () => {
  const navigate = useNavigate();
  const { preferences } = useUI();
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  // Cargar clientes desde la API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await axios.get('/api/clients', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setClients(response.data);
        // Asegurarse de que response.data sea un array
        if (Array.isArray(response.data)) {
          setClients(response.data);
          setFilteredClients(response.data);
        } else if (Array.isArray(response.data.clients)) {
          setClients(response.data.clients);
          setFilteredClients(response.data.clients);
        } else {
          console.error('La respuesta no contiene un array de clientes');
          setClients([]);
          setFilteredClients([]);
        }
      } catch (err) {
        console.error('Error al cargar clientes:', err);
        setError('No se pudieron cargar los clientes. Por favor, inténtalo de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Filtrar clientes según término de búsqueda
  useEffect(() => {
    // Verificar que clients sea un array
    if (!Array.isArray(clients)) {
      console.error('clients no es un array', clients);
      setFilteredClients([]);
      return;
    }

    if (!searchTerm.trim()) {
      setFilteredClients(clients);
      return;
    }
    
    const term = searchTerm.toLowerCase().trim();
    const filtered = clients.filter(client => 
      client?.name?.toLowerCase().includes(term) || 
      client?.email?.toLowerCase().includes(term) || 
      (client?.phone && client.phone.includes(term))
    );
    
    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  // Manejar cambio en búsqueda
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Manejar clic en menú de acciones
  const handleActionClick = (clientId: string) => {
    if (selectedClient === clientId) {
      setSelectedClient(null);
    } else {
      setSelectedClient(clientId);
    }
  };

  // Cerrar menú de acciones al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = () => {
      setSelectedClient(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Obtener color de estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'prospect':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtener texto de estado
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'inactive':
        return 'Inactivo';
      case 'prospect':
        return 'Prospecto';
      default:
        return 'Desconocido';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`w-full p-6 rounded-lg ${
        preferences.darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <Users className="mr-2" size={24} />
          <h1 className="text-2xl font-bold">Clientes</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <div className={`relative flex-grow ${
            preferences.darkMode ? 'bg-gray-700' : 'bg-gray-100'
          } rounded-md`}>
            <input
              type="text"
              placeholder="Buscar clientes..."
              className={`w-full py-2 pl-10 pr-4 rounded-md border ${
                preferences.darkMode 
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                  : 'border-gray-300 bg-gray-100 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 ${
                preferences.darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-600'
              }`}
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search 
              className={`absolute left-3 top-2.5 ${
                preferences.darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} 
              size={18} 
            />
          </div>
          
          <button
            className={`flex items-center px-4 py-2 rounded-md ${
              preferences.darkMode 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white transition-colors duration-200`}
            onClick={() => navigate('/dashboard/clients/new')}
          >
            <Plus size={18} className="mr-2" />
            <span>Nuevo Cliente</span>
          </button>
        </div>
      </div>

      {/* Estado de carga y error */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <RefreshCw size={24} className="animate-spin mr-2" />
          <span>Cargando clientes...</span>
        </div>
      )}

      {error && !isLoading && (
        <div className={`p-4 mb-4 rounded-md ${
          preferences.darkMode ? 'bg-red-900/30' : 'bg-red-50'
        } ${
          preferences.darkMode ? 'text-red-200' : 'text-red-800'
        } flex items-center`}>
          <AlertCircle size={20} className="mr-2" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabla de clientes */}
      {!isLoading && !error && (
        <div className="overflow-x-auto">
          {filteredClients.length === 0 ? (
            <div className={`p-8 text-center rounded-md ${
              preferences.darkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <Users size={40} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium">No hay clientes</h3>
              <p className={`mt-2 ${
                preferences.darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {searchTerm 
                  ? 'No se encontraron clientes que coincidan con tu búsqueda.' 
                  : 'Aún no hay clientes registrados.'}
              </p>
              {!searchTerm && (
                <button
                  className={`mt-4 px-4 py-2 rounded-md ${
                    preferences.darkMode 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white transition-colors duration-200`}
                  onClick={() => navigate('/dashboard/clients/new')}
                >
                  <UserPlus size={18} className="inline mr-2" />
                  <span>Agregar cliente</span>
                </button>
              )}
            </div>
          ) : (
            <table className={`w-full border-collapse ${
              preferences.darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              <thead>
                <tr className={`${
                  preferences.darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <th className="px-4 py-3 text-left">Cliente</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Teléfono</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Estado</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(filteredClients) && filteredClients.length > 0 ? filteredClients.map((client) => (
                  <tr
                    key={client.id}
                    className={`border-b ${
                      preferences.darkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-200 hover:bg-gray-50'
                    } transition-colors duration-150 cursor-pointer`}
                    onClick={() => navigate(`/dashboard/clients/${client.id}`)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 mr-3 flex-shrink-0">
                          {client.avatarUrl ? (
                            <img 
                              src={client.avatarUrl} 
                              alt={client.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center ${
                              preferences.darkMode ? 'bg-gray-600' : 'bg-gray-200'
                            }`}>
                              <span className="font-bold text-lg">
                                {client.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <span className="font-medium">{client.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{client.email}</td>
                    <td className="px-4 py-3 hidden md:table-cell">{client.phone || '—'}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(client.status)}`}>
                        {getStatusText(client.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
                        <button
                          className={`p-1 rounded-full ${
                            preferences.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                          }`}
                          onClick={() => handleActionClick(client.id)}
                        >
                          <MoreVertical size={18} />
                        </button>
                        <AnimatePresence>
                          {selectedClient === client.id && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.15 }}
                              className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-10 ${
                                preferences.darkMode ? 'bg-gray-800' : 'bg-white'
                              } ${
                                preferences.darkMode ? 'border border-gray-700' : 'border border-gray-200'
                              }`}
                            >
                              <div className="py-1" onClick={() => setSelectedClient(null)}>
                                <button
                                  onClick={() => navigate(`/dashboard/clients/${client.id}`)}
                                  className={`flex items-center px-4 py-2 text-sm w-full text-left ${
                                    preferences.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                  }`}
                                >
                                  <Eye size={16} className="mr-2" />
                                  Ver detalles
                                </button>
                                <button
                                  onClick={() => navigate(`/dashboard/clients/${client.id}`)}
                                  className={`flex items-center px-4 py-2 text-sm w-full text-left ${
                                    preferences.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                  }`}
                                >
                                  <Edit size={16} className="mr-2" />
                                  Editar
                                </button>
                                <button
                                  className={`flex items-center w-full text-left px-4 py-2 text-sm text-red-600 ${
                                    preferences.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                  }`}
                                  onClick={() => {
                                    // Implementar confirmación de eliminación
                                    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.')) {
                                      // Implementar lógica de eliminación
                                    }
                                  }}
                                >
                                  <Trash size={16} className="mr-2" />
                                  Eliminar
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center">
                      <p className={`${
                        preferences.darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        No se encontraron clientes
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ClientsList;
