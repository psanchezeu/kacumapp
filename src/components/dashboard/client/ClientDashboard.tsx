import { useState, useEffect } from 'react';
import { FolderOpen, MessageSquare, FileText, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';
import { Request, Project, Invoice } from '../../../types/index';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [clientRequests, setClientRequests] = useState<Request[]>([]);
  const [clientProjects, setClientProjects] = useState<Project[]>([]);
  const [clientInvoices, setClientInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch real data from API endpoints
        if (user?.id) {
          const [requestsRes, projectsRes, invoicesRes] = await Promise.all([
            api.get(`/api/requests?clientId=${user.id}`),
            api.get(`/api/projects?clientId=${user.id}`),
            api.get(`/api/invoices?clientId=${user.id}`)
          ]);

          setClientRequests(requestsRes.data || []);
          setClientProjects(projectsRes.data || []);
          setClientInvoices(invoicesRes.data || []);
        }
      } catch (error) {
        console.error('Error fetching client dashboard data:', error);
        // Inicializar con arrays vacíos en caso de error
        setClientRequests([]);
        setClientProjects([]);
        setClientInvoices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const stats = [
    {
      title: 'Solicitudes Enviadas',
      value: clientRequests.length,
      icon: MessageSquare,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Proyectos Activos',
      value: clientProjects.filter(p => p.status === 'development').length,
      icon: FolderOpen,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Facturas Pendientes',
      value: clientInvoices.filter(i => i.status === 'sent').length,
      icon: FileText,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Total Invertido',
      value: `€${clientInvoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}`,
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'in_development': return 'bg-blue-100 text-blue-800';
      case 'development': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'approved': return 'Aprobado';
      case 'in_development': return 'En Desarrollo';
      case 'development': return 'En Desarrollo';
      case 'completed': return 'Completado';
      case 'paid': return 'Pagada';
      case 'sent': return 'Enviada';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bienvenido, {user?.name}
        </h1>
        <p className="text-gray-600">Resumen de tus proyectos y actividad</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Requests */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Mis Solicitudes</h2>
            <MessageSquare className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {clientRequests.length > 0 ? (
              clientRequests.map((request) => (
                <div key={request.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{request.projectType}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {getStatusText(request.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{request.description.substring(0, 100)}...</p>
                  <p className="text-xs text-gray-500">
                    Enviada: {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No tienes solicitudes aún</p>
            )}
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Mis Proyectos</h2>
            <FolderOpen className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {clientProjects.length > 0 ? (
              clientProjects.map((project) => (
                <div key={project.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {getStatusText(project.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-4">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{project.progress}%</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No tienes proyectos activos</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Facturas Recientes</h2>
          <FileText className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Número</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Proyecto</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Importe</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Estado</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {clientInvoices.length > 0 ? (
                clientInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">{invoice.number}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {clientProjects.find(p => p.id === invoice.projectId)?.name || 'Proyecto'}
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900">€{invoice.amount.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {getStatusText(invoice.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(invoice.issueDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No tienes facturas aún
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;