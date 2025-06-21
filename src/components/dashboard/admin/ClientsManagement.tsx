import React, { useState } from 'react';
import { Eye, Plus, Edit, Trash2, Users, Mail, Phone, Building, Calendar } from 'lucide-react';
import { User } from '../../../types';

const ClientsManagement = () => {
  const [clients, setClients] = useState<User[]>([
    {
      id: '2',
      name: 'Juan Pérez',
      email: 'juan@empresa.com',
      role: 'client',
      company: 'Empresa ABC',
      phone: '+34 600 123 456',
      createdAt: '2024-01-15T00:00:00Z',
      lastLogin: '2024-12-01T10:30:00Z'
    },
    {
      id: '3',
      name: 'María García',
      email: 'maria@startup.com',
      role: 'client',
      company: 'Startup XYZ',
      phone: '+34 700 987 654',
      createdAt: '2024-02-01T00:00:00Z',
      lastLogin: '2024-11-28T15:45:00Z'
    },
    {
      id: '4',
      name: 'Carlos López',
      email: 'carlos@tech.com',
      role: 'client',
      company: 'Tech Solutions',
      phone: '+34 650 111 222',
      createdAt: '2024-03-10T00:00:00Z',
      lastLogin: '2024-11-30T09:15:00Z'
    },
    {
      id: '5',
      name: 'Ana Martínez',
      email: 'ana@innovate.com',
      role: 'client',
      company: 'Innovate Corp',
      phone: '+34 680 333 444',
      createdAt: '2024-04-05T00:00:00Z',
      lastLogin: '2024-12-01T14:20:00Z'
    }
  ]);

  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState<User | null>(null);

  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    company: '',
    phone: ''
  });

  const handleAddClient = () => {
    const client: User = {
      id: Date.now().toString(),
      name: newClient.name,
      email: newClient.email,
      role: 'client',
      company: newClient.company,
      phone: newClient.phone,
      createdAt: new Date().toISOString()
    };

    setClients([...clients, client]);
    setNewClient({ name: '', email: '', company: '', phone: '' });
    setShowAddModal(false);
  };

  const handleEditClient = (client: User) => {
    setEditingClient(client);
    setNewClient({
      name: client.name,
      email: client.email,
      company: client.company || '',
      phone: client.phone || ''
    });
  };

  const handleUpdateClient = () => {
    if (!editingClient) return;

    setClients(clients.map(client => 
      client.id === editingClient.id 
        ? { ...client, ...newClient }
        : client
    ));
    setEditingClient(null);
    setNewClient({ name: '', email: '', company: '', phone: '' });
  };

  const handleDeleteClient = (clientId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      setClients(clients.filter(client => client.id !== clientId));
    }
  };

  const ClientModal = ({ client, onClose }: { client: User; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Detalles del Cliente</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <Trash2 className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
              <p className="text-gray-900">{client.name}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <p className="text-gray-900">{client.email}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Empresa</label>
              <p className="text-gray-900">{client.company}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
              <p className="text-gray-900">{client.phone}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha de Registro</label>
              <p className="text-gray-900">{new Date(client.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Último Acceso</label>
              <p className="text-gray-900">
                {client.lastLogin ? new Date(client.lastLogin).toLocaleDateString() : 'Nunca'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Estado</label>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Activo
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex space-x-4">
          <button
            onClick={() => handleEditClient(client)}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
          >
            Editar Cliente
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );

  const AddEditModal = ({ isEdit = false, onClose }: { isEdit?: boolean; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <Trash2 className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
            <input
              type="text"
              value={newClient.name}
              onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nombre completo"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={newClient.email}
              onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="email@empresa.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Empresa</label>
            <input
              type="text"
              value={newClient.company}
              onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nombre de la empresa"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
            <input
              type="tel"
              value={newClient.phone}
              onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+34 600 123 456"
            />
          </div>
        </div>

        <div className="mt-6 flex space-x-4">
          <button
            onClick={isEdit ? handleUpdateClient : handleAddClient}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
          >
            {isEdit ? 'Actualizar' : 'Crear Cliente'}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Clientes</h1>
          <p className="text-gray-600">Administra la información de todos los clientes</p>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Clientes</p>
              <p className="text-3xl font-bold text-gray-900">{clients.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Activos</p>
              <p className="text-3xl font-bold text-gray-900">{clients.filter(c => c.lastLogin).length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Nuevos (30d)</p>
              <p className="text-3xl font-bold text-gray-900">2</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Empresas</p>
              <p className="text-3xl font-bold text-gray-900">{new Set(clients.map(c => c.company)).size}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Cliente</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Empresa</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Contacto</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Registro</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Último Acceso</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {client.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{client.name}</p>
                        <p className="text-sm text-gray-600">{client.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-900">{client.company}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{client.phone}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {new Date(client.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {client.lastLogin ? new Date(client.lastLogin).toLocaleDateString() : 'Nunca'}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedClient(client)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditClient(client)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClient(client.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedClient && (
        <ClientModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
        />
      )}

      {showAddModal && (
        <AddEditModal
          onClose={() => {
            setShowAddModal(false);
            setNewClient({ name: '', email: '', company: '', phone: '' });
          }}
        />
      )}

      {editingClient && (
        <AddEditModal
          isEdit={true}
          onClose={() => {
            setEditingClient(null);
            setNewClient({ name: '', email: '', company: '', phone: '' });
          }}
        />
      )}
    </div>
  );
};

export default ClientsManagement;