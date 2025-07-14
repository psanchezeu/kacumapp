import { Users, MessageSquare, FolderOpen, TrendingUp, CheckCircle, DollarSign } from 'lucide-react';
import { mockRequests, mockProjects } from '../../../data/mockData';

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Solicitudes Pendientes',
      value: mockRequests.filter(r => r.status === 'Pending').length,
      icon: MessageSquare,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Proyectos Activos',
      value: mockProjects.filter(p => p.status === 'Development').length,
      icon: FolderOpen,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Clientes Totales',
      value: 15,
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Ingresos del Mes',
      value: '€23,750',
      icon: DollarSign,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  const recentRequests = mockRequests.slice(0, 5);
  const activeProjects = mockProjects.filter(p => p.status === 'Development');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'In Development': return 'bg-blue-100 text-blue-800';
      case 'Development': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Pending': return 'Pendiente';
      case 'Approved': return 'Aprobado';
      case 'In Development': return 'En Desarrollo';
      case 'Development': return 'En Desarrollo';
      case 'Completed': return 'Completado';
      default: return status;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Administrativo</h1>
        <p className="text-gray-600">Resumen general de la actividad de Kacum</p>
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
            <h2 className="text-xl font-bold text-gray-900">Solicitudes Recientes</h2>
            <MessageSquare className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {recentRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{request.clientName}</h3>
                  <p className="text-sm text-gray-600">{request.projectType}</p>
                  <p className="text-xs text-gray-500">{request.company}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                  {getStatusText(request.status)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Proyectos Activos</h2>
            <FolderOpen className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {activeProjects.map((project) => (
              <div key={project.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {getStatusText(project.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{project.type}</p>
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
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-900">Revisar Solicitudes</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-medium text-gray-900">Actualizar Tareas</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-gray-900">Ver Reportes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;