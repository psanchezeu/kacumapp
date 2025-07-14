import Contact from '../models/contact.model.js';
import Client from '../models/client.model.js';
import { sequelize } from '../config/database.js';
import fs from 'fs/promises';
import path from 'path';

/**
 * Obtener todos los contactos de un cliente
 */
export const getClientContacts = async (req, res) => {
  try {
    const { clientId } = req.params;
    
    // Verificar si el cliente existe
    const clientExists = await Client.findByPk(clientId);
    if (!clientExists) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    const contacts = await Contact.findAll({
      where: { clientId },
      order: [['isPrimary', 'DESC'], ['createdAt', 'DESC']]
    });
    
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error al obtener contactos:', error);
    res.status(500).json({ error: 'Error al obtener la lista de contactos' });
  }
};

/**
 * Obtener un contacto específico
 */
export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.findByPk(id);
    
    if (!contact) {
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }
    
    res.status(200).json(contact);
  } catch (error) {
    console.error('Error al obtener contacto:', error);
    res.status(500).json({ error: 'Error al obtener los detalles del contacto' });
  }
};

/**
 * Crear un nuevo contacto para un cliente
 */
export const createContact = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const contactData = req.validatedBody;
    
    // Verificar si el cliente existe
    const clientExists = await Client.findByPk(contactData.clientId);
    if (!clientExists) {
      await t.rollback();
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    // Si es contacto primario, actualizar otros para que no lo sean
    if (contactData.isPrimary) {
      await Contact.update(
        { isPrimary: false },
        { 
          where: { 
            clientId: contactData.clientId,
            isPrimary: true 
          },
          transaction: t 
        }
      );
    }
    
    // Manejo de avatar si existe
    if (req.file) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'contacts');
      
      // Asegurar que existe el directorio
      try {
        await fs.mkdir(uploadDir, { recursive: true });
      } catch (err) {
        console.log('El directorio ya existe o no pudo crearse');
      }
      
      const filename = `${Date.now()}-${req.file.originalname}`;
      const filePath = path.join(uploadDir, filename);
      
      await fs.writeFile(filePath, req.file.buffer);
      contactData.avatarUrl = `/uploads/contacts/${filename}`;
    }
    
    const contact = await Contact.create(contactData, { transaction: t });
    
    await t.commit();
    
    res.status(201).json({
      message: 'Contacto creado correctamente',
      contact
    });
  } catch (error) {
    await t.rollback();
    console.error('Error al crear contacto:', error);
    res.status(500).json({ error: 'Error al crear el contacto' });
  }
};

/**
 * Actualizar un contacto existente
 */
export const updateContact = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const contactData = req.validatedBody;
    
    // Verificar si existe
    const contact = await Contact.findByPk(id);
    if (!contact) {
      await t.rollback();
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }
    
    // Si se cambia el cliente, verificar que exista
    if (contactData.clientId && contactData.clientId !== contact.clientId) {
      const clientExists = await Client.findByPk(contactData.clientId);
      if (!clientExists) {
        await t.rollback();
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }
    }
    
    // Si es contacto primario, actualizar otros para que no lo sean
    if (contactData.isPrimary && !contact.isPrimary) {
      await Contact.update(
        { isPrimary: false },
        { 
          where: { 
            clientId: contactData.clientId || contact.clientId,
            isPrimary: true 
          },
          transaction: t 
        }
      );
    }
    
    // Manejo de avatar si existe
    if (req.file) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'contacts');
      
      // Asegurar que existe el directorio
      try {
        await fs.mkdir(uploadDir, { recursive: true });
      } catch (err) {
        console.log('El directorio ya existe o no pudo crearse');
      }
      
      // Eliminar imagen anterior si existe
      if (contact.avatarUrl) {
        const oldImagePath = path.join(process.cwd(), 'public', contact.avatarUrl);
        try {
          await fs.unlink(oldImagePath);
        } catch (err) {
          console.log('No se pudo eliminar la imagen anterior o no existe');
        }
      }
      
      const filename = `${Date.now()}-${req.file.originalname}`;
      const filePath = path.join(uploadDir, filename);
      
      await fs.writeFile(filePath, req.file.buffer);
      contactData.avatarUrl = `/uploads/contacts/${filename}`;
    }
    
    await contact.update(contactData, { transaction: t });
    
    await t.commit();
    
    res.status(200).json({
      message: 'Contacto actualizado correctamente',
      contact
    });
  } catch (error) {
    await t.rollback();
    console.error('Error al actualizar contacto:', error);
    res.status(500).json({ error: 'Error al actualizar el contacto' });
  }
};

/**
 * Eliminar un contacto
 */
export const deleteContact = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    
    // Verificar si existe
    const contact = await Contact.findByPk(id);
    if (!contact) {
      await t.rollback();
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }
    
    // Eliminar avatar si existe
    if (contact.avatarUrl) {
      const imagePath = path.join(process.cwd(), 'public', contact.avatarUrl);
      try {
        await fs.unlink(imagePath);
      } catch (err) {
        console.log('No se pudo eliminar la imagen o no existe');
      }
    }
    
    await contact.destroy({ transaction: t });
    
    await t.commit();
    
    res.status(200).json({
      message: 'Contacto eliminado correctamente'
    });
  } catch (error) {
    await t.rollback();
    console.error('Error al eliminar contacto:', error);
    res.status(500).json({ error: 'Error al eliminar el contacto' });
  }
};

export default {
  getClientContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
};
