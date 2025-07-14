import React from 'react';
import ClientsList from './clients/ClientsList';
import { motion } from 'framer-motion';

/**
 * Componente de gestión de clientes
 * Muestra la lista de clientes y permite navegar a los detalles o crear nuevos clientes
 * Las rutas para detalles y creación se manejan ahora en App.tsx
 */
const ClientsManagement: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ClientsList />
    </motion.div>
  );
};

export default ClientsManagement;