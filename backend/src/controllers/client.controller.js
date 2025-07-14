import Client from '../models/client.model.js';
import BillingInfo from '../models/billing.model.js';
import Contact from '../models/contact.model.js';
import { sequelize } from '../config/database.js';
import fs from 'fs/promises';
import path from 'path';

/**
 * Obtener todos los clientes con información básica
 */
export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll({
      attributes: ['id', 'name', 'email', 'phone', 'status', 'createdAt', 'avatarUrl'],
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json(clients);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ error: 'Error al obtener la lista de clientes' });
  }
};

/**
 * Obtener un cliente por ID con toda su información
 */
export const getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const client = await Client.findByPk(id, {
      include: [
        { model: BillingInfo },
        { model: Contact }
      ]
    });
    
    if (!client) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    res.status(200).json(client);
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({ error: 'Error al obtener los detalles del cliente' });
  }
};

/**
 * Crear un nuevo cliente
 */
export const createClient = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const clientData = req.validatedBody;
    
    // Agregar información del usuario que crea
    if (req.user) {
      clientData.createdBy = req.user.id;
      clientData.updatedBy = req.user.id;
    }
    
    // Manejo de imagen de avatar si existe
    if (req.file) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'clients');
      
      // Asegurar que existe el directorio
      try {
        await fs.mkdir(uploadDir, { recursive: true });
      } catch (err) {
        console.log('El directorio ya existe o no pudo crearse');
      }
      
      const filename = `${Date.now()}-${req.file.originalname}`;
      const filePath = path.join(uploadDir, filename);
      
      await fs.writeFile(filePath, req.file.buffer);
      clientData.avatarUrl = `/uploads/clients/${filename}`;
    }
    
    const client = await Client.create(clientData, { transaction: t });
    
    await t.commit();
    
    res.status(201).json({
      message: 'Cliente creado correctamente',
      client
    });
  } catch (error) {
    await t.rollback();
    console.error('Error al crear cliente:', error);
    res.status(500).json({ error: 'Error al crear el cliente' });
  }
};

/**
 * Actualizar un cliente existente
 */
export const updateClient = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const clientData = req.validatedBody;
    
    // Verificar si existe
    const client = await Client.findByPk(id);
    if (!client) {
      await t.rollback();
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    // Agregar información del usuario que actualiza
    if (req.user) {
      clientData.updatedBy = req.user.id;
    }
    
    // Manejo de imagen de avatar si existe
    if (req.file) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'clients');
      
      // Asegurar que existe el directorio
      try {
        await fs.mkdir(uploadDir, { recursive: true });
      } catch (err) {
        console.log('El directorio ya existe o no pudo crearse');
      }
      
      // Eliminar imagen anterior si existe
      if (client.avatarUrl) {
        const oldImagePath = path.join(process.cwd(), 'public', client.avatarUrl);
        try {
          await fs.unlink(oldImagePath);
        } catch (err) {
          console.log('No se pudo eliminar la imagen anterior o no existe');
        }
      }
      
      const filename = `${Date.now()}-${req.file.originalname}`;
      const filePath = path.join(uploadDir, filename);
      
      await fs.writeFile(filePath, req.file.buffer);
      clientData.avatarUrl = `/uploads/clients/${filename}`;
    }
    
    await client.update(clientData, { transaction: t });
    
    await t.commit();
    
    res.status(200).json({
      message: 'Cliente actualizado correctamente',
      client
    });
  } catch (error) {
    await t.rollback();
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({ error: 'Error al actualizar el cliente' });
  }
};

/**
 * Eliminar un cliente
 */
export const deleteClient = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    
    // Verificar si existe
    const client = await Client.findByPk(id);
    if (!client) {
      await t.rollback();
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    // Eliminar imagen si existe
    if (client.avatarUrl) {
      const imagePath = path.join(process.cwd(), 'public', client.avatarUrl);
      try {
        await fs.unlink(imagePath);
      } catch (err) {
        console.log('No se pudo eliminar la imagen o no existe');
      }
    }
    
    // Eliminar cliente y relacionados (cascade)
    await client.destroy({ transaction: t });
    
    await t.commit();
    
    res.status(200).json({
      message: 'Cliente eliminado correctamente'
    });
  } catch (error) {
    await t.rollback();
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({ error: 'Error al eliminar el cliente' });
  }
};

export default {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
};
