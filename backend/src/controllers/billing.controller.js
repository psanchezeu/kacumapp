import BillingInfo from '../models/billing.model.js';
import Client from '../models/client.model.js';
import { sequelize } from '../config/database.js';

/**
 * Obtener información de facturación para un cliente
 */
export const getBillingInfo = async (req, res) => {
  try {
    const { clientId } = req.params;
    
    // Verificar si el cliente existe
    const clientExists = await Client.findByPk(clientId);
    if (!clientExists) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    const billingInfo = await BillingInfo.findOne({
      where: { clientId }
    });
    
    if (!billingInfo) {
      return res.status(404).json({ error: 'Información de facturación no encontrada' });
    }
    
    res.status(200).json(billingInfo);
  } catch (error) {
    console.error('Error al obtener información de facturación:', error);
    res.status(500).json({ error: 'Error al obtener información de facturación' });
  }
};

/**
 * Crear información de facturación para un cliente
 */
export const createBillingInfo = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const billingData = req.validatedBody;
    
    // Verificar si el cliente existe
    const clientExists = await Client.findByPk(billingData.clientId);
    if (!clientExists) {
      await t.rollback();
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    // Verificar si ya existe información de facturación
    const existingBillingInfo = await BillingInfo.findOne({
      where: { clientId: billingData.clientId }
    });
    
    if (existingBillingInfo) {
      await t.rollback();
      return res.status(400).json({ 
        error: 'El cliente ya tiene información de facturación',
        billingInfo: existingBillingInfo
      });
    }
    
    const billingInfo = await BillingInfo.create(billingData, { transaction: t });
    
    await t.commit();
    
    res.status(201).json({
      message: 'Información de facturación creada correctamente',
      billingInfo
    });
  } catch (error) {
    await t.rollback();
    console.error('Error al crear información de facturación:', error);
    res.status(500).json({ error: 'Error al crear información de facturación' });
  }
};

/**
 * Actualizar información de facturación
 */
export const updateBillingInfo = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const billingData = req.validatedBody;
    
    // Verificar si existe
    const billingInfo = await BillingInfo.findByPk(id);
    if (!billingInfo) {
      await t.rollback();
      return res.status(404).json({ error: 'Información de facturación no encontrada' });
    }
    
    // Si se intenta cambiar el clientId, validar que exista el cliente
    if (billingData.clientId && billingData.clientId !== billingInfo.clientId) {
      const clientExists = await Client.findByPk(billingData.clientId);
      if (!clientExists) {
        await t.rollback();
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }
    }
    
    await billingInfo.update(billingData, { transaction: t });
    
    await t.commit();
    
    res.status(200).json({
      message: 'Información de facturación actualizada correctamente',
      billingInfo
    });
  } catch (error) {
    await t.rollback();
    console.error('Error al actualizar información de facturación:', error);
    res.status(500).json({ error: 'Error al actualizar información de facturación' });
  }
};

/**
 * Eliminar información de facturación
 */
export const deleteBillingInfo = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    
    // Verificar si existe
    const billingInfo = await BillingInfo.findByPk(id);
    if (!billingInfo) {
      await t.rollback();
      return res.status(404).json({ error: 'Información de facturación no encontrada' });
    }
    
    await billingInfo.destroy({ transaction: t });
    
    await t.commit();
    
    res.status(200).json({
      message: 'Información de facturación eliminada correctamente'
    });
  } catch (error) {
    await t.rollback();
    console.error('Error al eliminar información de facturación:', error);
    res.status(500).json({ error: 'Error al eliminar información de facturación' });
  }
};

export default {
  getBillingInfo,
  createBillingInfo,
  updateBillingInfo,
  deleteBillingInfo
};
