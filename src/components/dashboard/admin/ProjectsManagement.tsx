import { useState } from 'react';
import { Eye, Plus, Calendar, TrendingUp, Users } from 'lucide-react';
import { mockProjects, mockTasks } from '../../../data/mockData';
import { Project } from '../../../types';

const ProjectsManagement = () => {
  const [projects] = useState<Project[]>(mockProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planning': return 'bg-yellow-100 text-yellow-800';
            case 'Development': return 'bg-blue-100 text-blue-800';
      case 'Testing': return 'bg-purple-100 text-purple-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'On Hold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Planning': return 'Planificación';
            case 'Development': return 'Desarrollo';
      case 'Testing': return 'Testing';
      case 'Completed': return 'Completado';
      case 'On Hold': return 'En Pausa';
      default: return status;
    }
  };

  const ProjectModal = ({ project, onClose }: { project: Project; onClose: () => void }) => {
    const projectTasks = mockTasks.filter(t => t.projectId === project.id);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Detalles del Proyecto</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h3>
                <p className="text-gray-600">{project.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo</label>
                  <p className="text-gray-900">{project.type ?? 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Presupuesto</label>
                  <p className="text-gray-900">€{(project.budget ?? 0).toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha Inicio</label>
                  <p className="text-gray-900">{new Date(project.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Estado</label>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {getStatusText(project.status)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Progreso</label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{project.progress}%</span>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">Tareas del Proyecto</h4>
                <div className="space-y-3">
                  {projectTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{task.title}</h5>
                        <p className="text-sm text-gray-600">{task.description}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.status === 'Completed' ? 'Completada' :
                           task.status === 'In Progress' ? 'En Progreso' : 'Pendiente'}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          task.priority === 'High' ? 'bg-red-100 text-red-800' :
                          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.priority === 'High' ? 'Alta' :
                           task.priority === 'Medium' ? 'Media' : 'Baja'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-bold text-gray-900 mb-3">Estadísticas</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tareas Totales</span>
                    <span className="font-semibold">{projectTasks.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completadas</span>
                    <span className="font-semibold text-green-600">
                      {projectTasks.filter(t => t.status === 'Completed').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">En Progreso</span>
                    <span className="font-semibold text-blue-600">
                      {projectTasks.filter(t => t.status === 'In Progress').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pendientes</span>
                    <span className="font-semibold text-gray-600">
                      {projectTasks.filter(t => t.status === 'To Do').length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-4 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-3">Acciones</h4>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    Actualizar Progreso
                  </button>
                  <button className="w-full text-left px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    Añadir Tarea
                  </button>
                  <button className="w-full text-left px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                    Generar Reporte
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Proyectos</h1>
          <p className="text-gray-600">Administra y supervisa todos los proyectos activos</p>
        </div>
        
        <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300">
          <Plus className="w-5 h-5" />
          <span>Nuevo Proyecto</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Proyectos Activos</p>
                                          <p className="text-3xl font-bold text-gray-900">{projects.filter(p => p.status === 'Development').length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Proyectos Completados</p>
                            <p className="text-3xl font-bold text-gray-900">{projects.filter(p => p.status === 'Completed').length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Clientes Activos</p>
                            <p className="text-3xl font-bold text-gray-900">{new Set(projects.map(p => p.clientName)).size}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Proyecto</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Tipo</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Progreso</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Presupuesto</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Estado</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-semibold text-gray-900">{project.name}</p>
                      <p className="text-sm text-gray-600">{project.description.substring(0, 50)}...</p>
                    </div>
                  </td>
                                    <td className="py-4 px-6 text-gray-900">{project.type || 'N/A'}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[80px]">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{project.progress}%</span>
                    </div>
                  </td>
                                    <td className="py-4 px-6 font-medium text-gray-900">€{(project.budget || 0).toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {getStatusText(project.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-medium">Ver</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};

export default ProjectsManagement;