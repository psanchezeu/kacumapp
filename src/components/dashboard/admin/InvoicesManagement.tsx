import React, { useState } from 'react';
import { Plus, Eye, Edit, Trash2, FileText, DollarSign, Calendar, Send } from 'lucide-react';
import { mockInvoices, mockProjects } from '../../../data/mockData';
import { Invoice, InvoiceItem } from '../../../types';

const InvoicesManagement = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [newInvoice, setNewInvoice] = useState({
    clientId: '',
    projectId: '',
    number: '',
    amount: 0,
    status: 'draft' as Invoice['status'],
    issueDate: '',
    dueDate: '',
    items: [] as InvoiceItem[]
  });

  const [newItem, setNewItem] = useState({
    description: '',
    quantity: 1,
    rate: 0
  });

  const filteredInvoices = filterStatus === 'all' 
    ? invoices 
    : invoices.filter(i => i.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Borrador';
      case 'sent': return 'Enviada';
      case 'paid': return 'Pagada';
      case 'overdue': return 'Vencida';
      default: return status;
    }
  };

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const count = invoices.length + 1;
    return `INV-${year}-${count.toString().padStart(3, '0')}`;
  };

  const addItemToInvoice = () => {
    if (!newItem.description || newItem.rate <= 0) return;

    const item: InvoiceItem = {
      id: Date.now().toString(),
      ...newItem,
      amount: newItem.quantity * newItem.rate
    };

    setNewInvoice({
      ...newInvoice,
      items: [...newInvoice.items, item],
      amount: newInvoice.amount + item.amount
    });

    setNewItem({ description: '', quantity: 1, rate: 0 });
  };

  const removeItemFromInvoice = (itemId: string) => {
    const item = newInvoice.items.find(i => i.id === itemId);
    if (!item) return;

    setNewInvoice({
      ...newInvoice,
      items: newInvoice.items.filter(i => i.id !== itemId),
      amount: newInvoice.amount - item.amount
    });
  };

  const handleAddInvoice = () => {
    const invoice: Invoice = {
      id: Date.now().toString(),
      ...newInvoice,
      number: newInvoice.number || generateInvoiceNumber(),
      createdAt: new Date().toISOString()
    };

    setInvoices([...invoices, invoice]);
    setNewInvoice({
      clientId: '',
      projectId: '',
      number: '',
      amount: 0,
      status: 'draft',
      issueDate: '',
      dueDate: '',
      items: []
    });
    setShowAddModal(false);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setNewInvoice({
      clientId: invoice.clientId,
      projectId: invoice.projectId,
      number: invoice.number,
      amount: invoice.amount,
      status: invoice.status,
      issueDate: invoice.issueDate.split('T')[0],
      dueDate: invoice.dueDate.split('T')[0],
      items: invoice.items
    });
  };

  const handleUpdateInvoice = () => {
    if (!editingInvoice) return;

    setInvoices(invoices.map(invoice => 
      invoice.id === editingInvoice.id 
        ? { ...invoice, ...newInvoice }
        : invoice
    ));
    setEditingInvoice(null);
    setNewInvoice({
      clientId: '',
      projectId: '',
      number: '',
      amount: 0,
      status: 'draft',
      issueDate: '',
      dueDate: '',
      items: []
    });
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta factura?')) {
      setInvoices(invoices.filter(invoice => invoice.id !== invoiceId));
    }
  };

  const handleStatusChange = (invoiceId: string, newStatus: Invoice['status']) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === invoiceId 
        ? { 
            ...invoice, 
            status: newStatus,
            paidDate: newStatus === 'paid' ? new Date().toISOString() : invoice.paidDate
          }
        : invoice
    ));
  };

  const InvoiceModal = ({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) => {
    const project = mockProjects.find(p => p.id === invoice.projectId);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Factura {invoice.number}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Número</label>
                  <p className="text-gray-900">{invoice.number}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Proyecto</label>
                  <p className="text-gray-900">{project?.name || 'Sin proyecto'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha Emisión</label>
                  <p className="text-gray-900">{new Date(invoice.issueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha Vencimiento</label>
                  <p className="text-gray-900">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Estado</label>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                    {getStatusText(invoice.status)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Total</label>
                  <p className="text-2xl font-bold text-gray-900">€{invoice.amount.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">Conceptos</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-2 px-4 font-semibold text-gray-900">Descripción</th>
                        <th className="text-left py-2 px-4 font-semibold text-gray-900">Cantidad</th>
                        <th className="text-left py-2 px-4 font-semibold text-gray-900">Precio</th>
                        <th className="text-left py-2 px-4 font-semibold text-gray-900">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100">
                          <td className="py-2 px-4 text-gray-900">{item.description}</td>
                          <td className="py-2 px-4 text-gray-900">{item.quantity}</td>
                          <td className="py-2 px-4 text-gray-900">€{item.rate.toLocaleString()}</td>
                          <td className="py-2 px-4 font-semibold text-gray-900">€{item.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-bold text-gray-900 mb-3">Cambiar Estado</h4>
                <div className="space-y-2">
                  {['draft', 'sent', 'paid', 'overdue'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(invoice.id, status as Invoice['status'])}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        invoice.status === status 
                          ? getStatusColor(status)
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      {getStatusText(status)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-4 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-3">Acciones</h4>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    Descargar PDF
                  </button>
                  <button className="w-full text-left px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    Enviar por Email
                  </button>
                  <button className="w-full text-left px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                    Duplicar Factura
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AddEditModal = ({ isEdit = false, onClose }: { isEdit?: boolean; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Editar Factura' : 'Nueva Factura'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Número de Factura</label>
              <input
                type="text"
                value={newInvoice.number}
                onChange={(e) => setNewInvoice({ ...newInvoice, number: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={generateInvoiceNumber()}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Proyecto</label>
              <select
                value={newInvoice.projectId}
                onChange={(e) => setNewInvoice({ ...newInvoice, projectId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar proyecto</option>
                {mockProjects.map((project) => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha Emisión</label>
                <input
                  type="date"
                  value={newInvoice.issueDate}
                  onChange={(e) => setNewInvoice({ ...newInvoice, issueDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha Vencimiento</label>
                <input
                  type="date"
                  value={newInvoice.dueDate}
                  onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
              <select
                value={newInvoice.status}
                onChange={(e) => setNewInvoice({ ...newInvoice, status: e.target.value as Invoice['status'] })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">Borrador</option>
                <option value="sent">Enviada</option>
                <option value="paid">Pagada</option>
                <option value="overdue">Vencida</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Añadir Conceptos</h3>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
              <input
                type="text"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descripción del servicio"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cantidad</label>
                <input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Precio €</label>
                <input
                  type="number"
                  value={newItem.rate}
                  onChange={(e) => setNewItem({ ...newItem, rate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <button
              onClick={addItemToInvoice}
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Añadir Concepto
            </button>

            {newInvoice.items.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Conceptos añadidos:</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {newInvoice.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.description}</p>
                        <p className="text-xs text-gray-600">{item.quantity} x €{item.rate} = €{item.amount}</p>
                      </div>
                      <button
                        onClick={() => removeItemFromInvoice(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-2 p-2 bg-blue-50 rounded">
                  <p className="font-bold text-blue-900">Total: €{newInvoice.amount.toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex space-x-4">
          <button
            onClick={isEdit ? handleUpdateInvoice : handleAddInvoice}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
          >
            {isEdit ? 'Actualizar' : 'Crear Factura'}
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Facturas</h1>
          <p className="text-gray-600">Administra todas las facturas y pagos</p>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Factura</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Facturas</p>
              <p className="text-3xl font-bold text-gray-900">{invoices.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pagadas</p>
              <p className="text-3xl font-bold text-gray-900">{invoices.filter(i => i.status === 'paid').length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pendientes</p>
              <p className="text-3xl font-bold text-gray-900">{invoices.filter(i => i.status === 'sent').length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Send className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Ingresos</p>
              <p className="text-3xl font-bold text-gray-900">
                €{invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Todos los estados</option>
          <option value="draft">Borrador</option>
          <option value="sent">Enviada</option>
          <option value="paid">Pagada</option>
          <option value="overdue">Vencida</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Número</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Proyecto</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Importe</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Estado</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Fecha Emisión</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Vencimiento</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => {
                const project = mockProjects.find(p => p.id === invoice.projectId);
                return (
                  <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium text-gray-900">{invoice.number}</td>
                    <td className="py-4 px-6 text-gray-900">{project?.name || 'Sin proyecto'}</td>
                    <td className="py-4 px-6 font-semibold text-gray-900">€{invoice.amount.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {getStatusText(invoice.status)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {new Date(invoice.issueDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedInvoice(invoice)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditInvoice(invoice)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

      {showAddModal && (
        <AddEditModal
          onClose={() => {
            setShowAddModal(false);
            setNewInvoice({
              clientId: '',
              projectId: '',
              number: '',
              amount: 0,
              status: 'draft',
              issueDate: '',
              dueDate: '',
              items: []
            });
          }}
        />
      )}

      {editingInvoice && (
        <AddEditModal
          isEdit={true}
          onClose={() => {
            setEditingInvoice(null);
            setNewInvoice({
              clientId: '',
              projectId: '',
              number: '',
              amount: 0,
              status: 'draft',
              issueDate: '',
              dueDate: '',
              items: []
            });
          }}
        />
      )}
    </div>
  );
};

export default InvoicesManagement;