import React, { useState, useMemo } from 'react';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { mockInvoices, mockProjects } from '../../../data/mockData';
import { Invoice, InvoiceItem } from '../../../types';

// Helper para formatear fechas a YYYY-MM-DD para inputs
const formatDateForInput = (date: string | Date | undefined): string => {
  if (!date) return '';
  try {
    // Intenta crear una fecha; si es inválida, devuelve una cadena vacía
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  } catch (error) {
    return '';
  }
};

// Estado inicial para el formulario de factura
const initialInvoiceFormData: Omit<Invoice, 'id' | 'clientName'> = {
  invoiceNumber: '',
  clientId: '',
  projectId: '',
  issueDate: '',
  dueDate: '',
  items: [],
  amount: 0,
  status: 'Draft',
};

// Estado inicial para un nuevo concepto de factura
const initialNewItem: Omit<InvoiceItem, 'id' | 'amount'> = {
  description: '',
  quantity: 1,
  rate: 0,
};

const InvoicesManagement: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [invoiceFormData, setInvoiceFormData] = useState<Partial<Invoice>>(initialInvoiceFormData);
  const [newItem, setNewItem] = useState(initialNewItem);
  const [filterStatus, setFilterStatus] = useState<Invoice['status'] | 'all'>('all');

  const filteredInvoices = useMemo(() => {
    if (filterStatus === 'all') return invoices;
    return invoices.filter(i => i.status === filterStatus);
  }, [invoices, filterStatus]);

  const getStatusColor = (status: Invoice['status']) => {
    const colors: Record<Invoice['status'], string> = {
      Draft: 'bg-gray-200 text-gray-800',
      Sent: 'bg-blue-200 text-blue-800',
      Paid: 'bg-green-200 text-green-800',
      Overdue: 'bg-red-200 text-red-800',
    };
    return colors[status] || 'bg-gray-200 text-gray-800';
  };

  const getStatusText = (status: Invoice['status']) => {
    const texts: Record<Invoice['status'], string> = {
      Draft: 'Borrador',
      Sent: 'Enviada',
      Paid: 'Pagada',
      Overdue: 'Vencida',
    };
    return texts[status] || status;
  };

  const openModal = (invoice?: Invoice) => {
    if (invoice) {
      setIsEditMode(true);
      setInvoiceFormData({
        ...invoice,
        issueDate: formatDateForInput(invoice.issueDate),
        dueDate: formatDateForInput(invoice.dueDate),
      });
    } else {
      setIsEditMode(false);
      const newInvoiceNumber = `INV-${new Date().getFullYear()}-${invoices.length + 1}`;
      setInvoiceFormData({ ...initialInvoiceFormData, invoiceNumber: newInvoiceNumber });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInvoice(null);
    setInvoiceFormData(initialInvoiceFormData);
    setNewItem(initialNewItem);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInvoiceFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: name === 'description' ? value : parseFloat(value) || 0 }));
  };

  const addItem = () => {
    if (!newItem.description || !newItem.rate) return;
    const newAmount = (newItem.quantity || 1) * newItem.rate;
    const itemToAdd: InvoiceItem = { ...newItem, id: Date.now().toString(), amount: newAmount };
    setInvoiceFormData(prev => ({
      ...prev,
      items: [...(prev.items || []), itemToAdd],
      amount: (prev.amount || 0) + newAmount,
    }));
    setNewItem(initialNewItem);
  };

  const removeItem = (itemId: string) => {
    const itemToRemove = (invoiceFormData.items || []).find(i => i.id === itemId);
    if (!itemToRemove) return;
    setInvoiceFormData(prev => ({
      ...prev,
      items: (prev.items || []).filter(i => i.id !== itemId),
      amount: (prev.amount || 0) - itemToRemove.amount,
    }));
  };

  const handleSave = () => {
    const clientName = mockProjects.find(p => p.id === invoiceFormData.projectId)?.clientName || 'N/A';

    if (isEditMode) {
      if (!invoiceFormData.id) {
        console.error('Error: No se puede actualizar una factura sin ID.');
        return;
      }
      const updatedInvoice: Invoice = {
        ...initialInvoiceFormData,
        ...invoiceFormData,
        id: invoiceFormData.id,
        clientName,
      };
      setInvoices(invoices.map(inv => (inv.id === updatedInvoice.id ? updatedInvoice : inv)));
    } else {
      const newInvoice: Invoice = {
        ...initialInvoiceFormData,
        ...invoiceFormData,
        id: Date.now().toString(),
        clientName,
      };
      setInvoices(prevInvoices => [...prevInvoices, newInvoice]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Confirmas la eliminación de esta factura?')) {
      setInvoices(invoices.filter(inv => inv.id !== id));
    }
  };

  const handleStatusChange = (id: string, status: Invoice['status']) => {
    setInvoices(invoices.map(inv => (inv.id === id ? { ...inv, status } : inv)));
    if (selectedInvoice?.id === id) {
      setSelectedInvoice(prev => (prev ? { ...prev, status } : null));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Facturas</h2>
        <button onClick={() => openModal()} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus size={18} className="mr-2" /> Nueva Factura
        </button>
      </div>
      <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="mb-4 p-2 border rounded">
        <option value="all">Todos</option>
        <option value="Draft">Borrador</option>
        <option value="Sent">Enviada</option>
        <option value="Paid">Pagada</option>
        <option value="Overdue">Vencida</option>
      </select>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Nº Factura</th>
              <th className="px-6 py-3">Cliente</th>
              <th className="px-6 py-3">Fecha</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map(invoice => (
              <tr key={invoice.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">{invoice.invoiceNumber}</td>
                <td className="px-6 py-4">{invoice.clientName}</td>
                <td className="px-6 py-4">{formatDateForInput(invoice.issueDate)}</td>
                <td className="px-6 py-4">€{invoice.amount.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                    {getStatusText(invoice.status)}
                  </span>
                </td>
                <td className="px-6 py-4 flex space-x-2">
                  <button onClick={() => setSelectedInvoice(invoice)}><Eye size={18} /></button>
                  <button onClick={() => openModal(invoice)}><Edit size={18} /></button>
                  <button onClick={() => handleDelete(invoice.id)}><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <AddEditModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSave}
          isEdit={isEditMode}
          invoiceData={invoiceFormData as Omit<Invoice, 'id' | 'clientName'>}
          onFormChange={handleFormChange}
          newItem={newItem}
          onItemChange={handleItemChange}
          addItem={addItem}
          removeItem={removeItem}
        />
      )}

      {selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onStatusChange={handleStatusChange}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />
      )}
    </div>
  );
};

// --- MODAL COMPONENTS ---

interface AddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  isEdit: boolean;
  invoiceData: Omit<Invoice, 'id' | 'clientName'>;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  newItem: Omit<InvoiceItem, 'id' | 'amount'>;
  onItemChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addItem: () => void;
  removeItem: (id: string) => void;
}

const AddEditModal: React.FC<AddEditModalProps> = ({ isOpen, onClose, onSave, isEdit, invoiceData, onFormChange, newItem, onItemChange, addItem, removeItem }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{isEdit ? 'Editar Factura' : 'Crear Factura'}</h2>
        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-4">
          <input name="invoiceNumber" value={invoiceData.invoiceNumber} onChange={onFormChange} placeholder="Nº Factura" className="p-2 border rounded" />
          <select name="projectId" value={invoiceData.projectId} onChange={onFormChange} className="p-2 border rounded">
            <option value="">Seleccionar Proyecto</option>
            {mockProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input name="issueDate" type="date" value={invoiceData.issueDate as string} onChange={onFormChange} className="p-2 border rounded" />
          <input name="dueDate" type="date" value={invoiceData.dueDate as string} onChange={onFormChange} className="p-2 border rounded" />
        </div>
        {/* Items Section */}
        <h3 className="text-lg font-semibold mt-4">Conceptos</h3>
        <div className="flex gap-2 my-2">
            <input name="description" value={newItem.description} onChange={onItemChange} placeholder="Descripción" className="flex-grow p-2 border rounded"/>
            <input name="quantity" type="number" value={newItem.quantity} onChange={onItemChange} placeholder="Cant." className="w-20 p-2 border rounded"/>
            <input name="rate" type="number" value={newItem.rate} onChange={onItemChange} placeholder="Precio" className="w-24 p-2 border rounded"/>
            <button onClick={addItem} className="bg-gray-200 p-2 rounded">Añadir</button>
        </div>
        <div className="space-y-2">
            {invoiceData.items.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                    <span>{item.description}</span>
                    <button onClick={() => removeItem(item.id)} className="text-red-500">X</button>
                </div>
            ))}
        </div>
        <div className="text-right font-bold text-xl mt-4">Total: €{invoiceData.amount.toFixed(2)}</div>
        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
          <button onClick={onSave} className="bg-blue-600 text-white px-4 py-2 rounded">{isEdit ? 'Guardar' : 'Crear'}</button>
        </div>
      </div>
    </div>
  );
};

interface InvoiceDetailModalProps {
  invoice: Invoice;
  onClose: () => void;
  onStatusChange: (id: string, status: Invoice['status']) => void;
  getStatusColor: (status: Invoice['status']) => string;
  getStatusText: (status: Invoice['status']) => string;
}

const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({ invoice, onClose, onStatusChange, getStatusColor, getStatusText }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
      <h2 className="text-xl font-bold mb-4">Factura {invoice.invoiceNumber}</h2>
      <p><strong>Cliente:</strong> {invoice.clientName}</p>
      <p><strong>Total:</strong> €{invoice.amount.toFixed(2)}</p>
      <div className="my-4">
        <h4 className="font-semibold">Cambiar Estado</h4>
        <div className="flex gap-2 mt-2">
          {['Draft', 'Sent', 'Paid', 'Overdue'].map(status => (
            <button
              key={status}
              onClick={() => onStatusChange(invoice.id, status as Invoice['status'])}
              className={`px-3 py-1 rounded-full text-xs ${invoice.status === status ? getStatusColor(status as any) : 'bg-gray-200'}`}>
              {getStatusText(status as any)}
            </button>
          ))}
        </div>
      </div>
      <button onClick={onClose} className="mt-4 bg-gray-300 px-4 py-2 rounded">Cerrar</button>
    </div>
  </div>
);

export default InvoicesManagement;