import React, { useState } from 'react';
import { Eye, CheckCircle, XCircle, Clock, MessageSquare, Filter } from 'lucide-react';
import { mockRequests } from '../../../data/mockData';
import { Request } from '../../../types';

const RequestsManagement = () => {
  const [requests, setRequests] = useState<Request[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredRequests = filterStatus === 'all' 
    ? requests 
    : requests.filter(r => r.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewing': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'in_development': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'reviewing': return 'Revisando';
      case 'approved': return 'Aprobado';
      case 'rejected': return 'Rechazado';
      case 'in_development': return 'En Desarrollo';
      default: return status;
    }
  };

  const updateRequestStatus = (requestId: string, newStatus: string, notes?: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: newStatus as any, updatedAt: new Date().toISOString(), notes }
        : req
    ));
    setSelectedRequest(null);
  };

  const RequestModal = ({ request, onClose }: { request: Request; onClose: () => void }) => {
    const [notes, setNotes] = useState(request.notes || '');
    const [newStatus, setNewStatus] = useState(request.status);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Detalles de Solicitud</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Cliente</label>
                <p className="text-gray-900">{request.clientName}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{request.clientEmail}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Empresa</label>
                <p className="text-gray-900">{request.company}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de Proyecto</label>
                <p className="text-gray-900">{request.projectType}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Presupuesto</label>
                <p className="text-gray-900">{request.budget}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Timeline</label>
                <p className="text-gray-900">{request.timeline}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
              <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{request.description}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">Pendiente</option>
                <option value="reviewing">Revisando</option>
                <option value="approved">Aprobado</option>
                <option value="rejected">Rechazado</option>
                <option value="in_development">En Desarrollo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Notas Internas</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Añadir notas sobre esta solicitud..."
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => updateRequestStatus(request.id, newStatus, notes)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
              >
                Actualizar Solicitud
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
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Solicitudes</h1>
          <p className="text-gray-600">Administra las solicitudes de proyectos de los clientes</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas</option>
              <option value="pending">Pendientes</option>
              <option value="reviewing">Revisando</option>
              <option value="approved">Aprobadas</option>
              <option value="rejected">Rechazadas</option>
              <option value="in_development">En Desarrollo</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Cliente</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Proyecto</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Presupuesto</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Estado</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Fecha</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-semibold text-gray-900">{request.clientName}</p>
                      <p className="text-sm text-gray-600">{request.company}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{request.projectType}</p>
                      <p className="text-sm text-gray-600">{request.timeline}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-900">{request.budget}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {getStatusText(request.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => setSelectedRequest(request)}
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

      {selectedRequest && (
        <RequestModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
};

export default RequestsManagement;