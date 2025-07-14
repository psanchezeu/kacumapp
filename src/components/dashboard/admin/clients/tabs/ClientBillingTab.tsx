import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUI } from '../../../../../contexts/UIContext';
import {
  Building2,
  CreditCard,
  FileText,
  Hash,
  MapPin,
  Globe,
  Building, // Reemplazado Bank por Building que es un icono disponible
  Loader2,
  AlertCircle,
  Save,
  Plus
} from 'lucide-react';
import axios from 'axios';

import { BillingInfo } from '../../../../../types';

interface Props {
  clientId: string;
  billingInfo: BillingInfo | null;
  isNew: boolean;
}

// Componente principal
const ClientBillingTab: React.FC<Props> = ({ clientId, billingInfo: initialBillingInfo, isNew }) => {
  const { preferences } = useUI();
  const darkMode = preferences.darkMode;
  
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Estado para edición
  const [formData, setFormData] = useState<Partial<BillingInfo>>({
    companyName: '',
    vatNumber: '',
    fiscalAddress: '',
    fiscalCity: '',
    fiscalPostalCode: '',
    fiscalCountry: '',
    paymentMethod: 'bank_transfer',
    bankAccount: '',
    bankName: '',
    swiftBic: '',
    notes: ''
  });
  
  // Si es un cliente nuevo, aún no podemos gestionar facturación
  if (isNew || !clientId) {
    return (
      <div className={`p-6 rounded-lg ${
        darkMode ? 'bg-gray-700' : 'bg-gray-100'
      } text-center`}>
        <Building2 size={40} className="mx-auto mb-3 text-gray-400" />
        <h3 className="font-medium">No se puede añadir información de facturación</h3>
        <p className={`mt-2 ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Guarda primero la información general del cliente antes de añadir datos de facturación.
        </p>
      </div>
    );
  }

  // Cargar datos de facturación si no se proporcionaron inicialmente
  useEffect(() => {
    if (initialBillingInfo) {
      setBillingInfo(initialBillingInfo);
      setFormData({
        ...initialBillingInfo
      });
      return;
    }
    
    const fetchBillingInfo = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await axios.get(`/api/clients/${clientId}/billing`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setBillingInfo(response.data);
        if (response.data) {
          setFormData({
            ...response.data
          });
        }
      } catch (err) {
        // Si la facturación no existe aún, no es un error
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setBillingInfo(null);
          return;
        }
        
        console.error('Error al cargar información de facturación:', err);
        setError('No se pudo cargar la información de facturación. Por favor, inténtalo de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBillingInfo();
  }, [clientId, initialBillingInfo]);

  // Manejador de cambios en formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Guardar información de facturación
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);
      
      let response;
      
      if (billingInfo) {
        // Actualizar información existente
        response = await axios.put(`/api/clients/${clientId}/billing`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      } else {
        // Crear nueva información de facturación
        response = await axios.post(`/api/clients/${clientId}/billing`, {
          ...formData,
          clientId
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      }
      
      setBillingInfo(response.data);
      setSuccessMessage('Información de facturación guardada correctamente');
      setIsEditing(false);
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error al guardar información de facturación:', err);
      setError('No se pudo guardar la información de facturación. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Información de Facturación</h2>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className={`flex items-center px-3 py-1.5 rounded-md ${
              darkMode 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white transition-colors duration-200`}
          >
            {billingInfo ? (
              <>
                <FileText size={16} className="mr-1" />
                <span>Editar información</span>
              </>
            ) : (
              <>
                <Plus size={16} className="mr-1" />
                <span>Añadir información</span>
              </>
            )}
          </button>
        )}
      </div>
      
      {/* Estado de carga y error */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 size={24} className="animate-spin mr-2" />
          <span>Cargando información de facturación...</span>
        </div>
      )}
      
      {error && !isLoading && (
        <div className={`p-4 rounded-md ${
          darkMode ? 'bg-red-900/30' : 'bg-red-50'
        } ${
          darkMode ? 'text-red-200' : 'text-red-800'
        } flex items-center`}>
          <AlertCircle size={20} className="mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      {successMessage && !isLoading && (
        <div className={`p-4 rounded-md ${
          darkMode ? 'bg-green-900/30' : 'bg-green-50'
        } ${
          darkMode ? 'text-green-200' : 'text-green-800'
        } flex items-center`}>
          <AlertCircle size={20} className="mr-2" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Sin información de facturación */}
      {!isLoading && !billingInfo && !isEditing && (
        <div className={`p-8 text-center rounded-lg ${
          darkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <Building2 size={40} className="mx-auto mb-3 text-gray-400" />
          <h3 className="font-medium">No hay información de facturación</h3>
          <p className={`mt-2 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Este cliente aún no tiene información de facturación registrada.
          </p>
        </div>
      )}

      {/* Mostrar información de facturación */}
      {!isLoading && billingInfo && !isEditing && (
        <div className="space-y-6">
          {/* Información de empresa */}
          <div className={`p-6 rounded-lg ${
            darkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <h3 className={`font-medium mb-4 ${
              darkMode ? 'text-gray-200' : 'text-gray-800'
            }`}>
              Información de Empresa
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Nombre de empresa
                </p>
                <div className="flex items-center mt-1">
                  <Building2 size={16} className="mr-2 text-gray-400" />
                  <p className="font-medium">{billingInfo.companyName || 'No especificado'}</p>
                </div>
              </div>
              
              <div>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  NIF/CIF
                </p>
                <div className="flex items-center mt-1">
                  <Hash size={16} className="mr-2 text-gray-400" />
                  <p className="font-medium">{billingInfo.vatNumber || 'No especificado'}</p>
                </div>
              </div>
            </div>
            
            {/* Dirección fiscal */}
            <div className="mt-4">
              <p className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Dirección fiscal
              </p>
              <div className="flex items-start mt-1">
                <MapPin size={16} className="mr-2 text-gray-400 mt-1" />
                <p className="font-medium">
                  {billingInfo.fiscalAddress ? (
                    <>
                      {billingInfo.fiscalAddress}<br />
                      {[
                        billingInfo.fiscalCity,
                        billingInfo.fiscalPostalCode,
                        billingInfo.fiscalCountry
                      ].filter(Boolean).join(', ')}
                    </>
                  ) : (
                    'No especificada'
                  )}
                </p>
              </div>
            </div>
          </div>
          
          {/* Información de pago */}
          <div className={`p-6 rounded-lg ${
            darkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <h3 className={`font-medium mb-4 ${
              darkMode ? 'text-gray-200' : 'text-gray-800'
            }`}>
              Método de Pago
            </h3>
            
            <div className="flex items-center">
              <CreditCard size={16} className="mr-2 text-gray-400" />
              <p className="font-medium">
                {billingInfo.paymentMethod === 'bank_transfer' && 'Transferencia bancaria'}
                {billingInfo.paymentMethod === 'credit_card' && 'Tarjeta de crédito'}
                {billingInfo.paymentMethod === 'paypal' && 'PayPal'}
                {billingInfo.paymentMethod === 'other' && 'Otro'}
              </p>
            </div>
            
            {billingInfo.paymentMethod === 'bank_transfer' && (
              <div className="mt-4 space-y-3">
                <div>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Banco
                  </p>
                  <div className="flex items-center mt-1">
                    <Bank size={16} className="mr-2 text-gray-400" />
                    <p className="font-medium">{billingInfo.bankName || 'No especificado'}</p>
                  </div>
                </div>
                
                <div>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Cuenta bancaria
                  </p>
                  <p className="font-medium pl-6">{billingInfo.bankAccount || 'No especificada'}</p>
                </div>
                
                <div>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    SWIFT/BIC
                  </p>
                  <p className="font-medium pl-6">{billingInfo.swiftBic || 'No especificado'}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Notas */}
          {billingInfo.notes && (
            <div className={`p-6 rounded-lg ${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <h3 className={`font-medium mb-2 ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Notas
              </h3>
              <p className="whitespace-pre-wrap">{billingInfo.notes}</p>
            </div>
          )}
        </div>
      )}
      
      {/* Formulario de edición */}
      {(isEditing || (!billingInfo && isEditing)) && (
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-6"
        >
          {/* Información de empresa */}
          <div className={`p-6 rounded-lg ${
            darkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <h3 className={`font-medium mb-4 ${
              darkMode ? 'text-gray-200' : 'text-gray-800'
            }`}>
              Información de Empresa
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Nombre de empresa
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName || ''}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-md border ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-800 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  } focus:outline-none focus:ring-2 ${
                    darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-600'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  NIF/CIF
                </label>
                <input
                  type="text"
                  name="vatNumber"
                  value={formData.vatNumber || ''}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-md border ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-800 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  } focus:outline-none focus:ring-2 ${
                    darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-600'
                  }`}
                />
              </div>
            </div>
            
            {/* Dirección fiscal */}
            <div className="mt-4">
              <label className={`block text-sm font-medium mb-1 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Dirección fiscal
              </label>
              <input
                type="text"
                name="fiscalAddress"
                value={formData.fiscalAddress || ''}
                onChange={handleChange}
                placeholder="Calle, número, piso..."
                className={`w-full px-3 py-2 rounded-md border ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-800 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                } focus:outline-none focus:ring-2 ${
                  darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-600'
                }`}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Ciudad
                </label>
                <input
                  type="text"
                  name="fiscalCity"
                  value={formData.fiscalCity || ''}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-md border ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-800 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  } focus:outline-none focus:ring-2 ${
                    darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-600'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Código postal
                </label>
                <input
                  type="text"
                  name="fiscalPostalCode"
                  value={formData.fiscalPostalCode || ''}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-md border ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-800 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  } focus:outline-none focus:ring-2 ${
                    darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-600'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  País
                </label>
                <input
                  type="text"
                  name="fiscalCountry"
                  value={formData.fiscalCountry || ''}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-md border ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-800 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  } focus:outline-none focus:ring-2 ${
                    darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-600'
                  }`}
                />
              </div>
            </div>
          </div>
          
          {/* Información de pago */}
          <div className={`p-6 rounded-lg ${
            darkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <h3 className={`font-medium mb-4 ${
              darkMode ? 'text-gray-200' : 'text-gray-800'
            }`}>
              Método de Pago
            </h3>
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Método preferido
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod || 'bank_transfer'}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-md border ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-800 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                } focus:outline-none focus:ring-2 ${
                  darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-600'
                }`}
              >
                <option value="bank_transfer">Transferencia bancaria</option>
                <option value="credit_card">Tarjeta de crédito</option>
                <option value="paypal">PayPal</option>
                <option value="other">Otro</option>
              </select>
            </div>
            
            {formData.paymentMethod === 'bank_transfer' && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Banco
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName || ''}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-md border ${
                      darkMode 
                        ? 'border-gray-600 bg-gray-800 text-white' 
                        : 'border-gray-300 bg-white text-gray-900'
                    } focus:outline-none focus:ring-2 ${
                      darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-600'
                    }`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Cuenta bancaria (IBAN)
                  </label>
                  <input
                    type="text"
                    name="bankAccount"
                    value={formData.bankAccount || ''}
                    onChange={handleChange}
                    placeholder="ES00 0000 0000 0000 0000 0000"
                    className={`w-full px-3 py-2 rounded-md border ${
                      darkMode 
                        ? 'border-gray-600 bg-gray-800 text-white' 
                        : 'border-gray-300 bg-white text-gray-900'
                    } focus:outline-none focus:ring-2 ${
                      darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-600'
                    }`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    SWIFT/BIC
                  </label>
                  <input
                    type="text"
                    name="swiftBic"
                    value={formData.swiftBic || ''}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-md border ${
                      darkMode 
                        ? 'border-gray-600 bg-gray-800 text-white' 
                        : 'border-gray-300 bg-white text-gray-900'
                    } focus:outline-none focus:ring-2 ${
                      darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-600'
                    }`}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Notas */}
          <div className={`p-6 rounded-lg ${
            darkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <label className={`block text-sm font-medium mb-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Notas adicionales
            </label>
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              rows={3}
              className={`w-full px-3 py-2 rounded-md border ${
                darkMode 
                  ? 'border-gray-600 bg-gray-800 text-white' 
                  : 'border-gray-300 bg-white text-gray-900'
              } focus:outline-none focus:ring-2 ${
                darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-600'
              }`}
            />
          </div>
          
          {/* Botones */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className={`px-4 py-2 rounded-md ${
                darkMode 
                  ? 'bg-gray-600 hover:bg-gray-500' 
                  : 'bg-gray-200 hover:bg-gray-300'
              } transition-colors duration-200`}
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`flex items-center px-4 py-2 rounded-md ${
                darkMode 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-green-500 hover:bg-green-600'
              } text-white transition-colors duration-200 ${
                isSaving ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 size={18} className="mr-2 animate-spin" />
              ) : (
                <Save size={18} className="mr-2" />
              )}
              <span>Guardar</span>
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
};

export default ClientBillingTab;
