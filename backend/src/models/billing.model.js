import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Client from './client.model.js';

const BillingInfo = sequelize.define('BillingInfo', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  clientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Clients',
      key: 'id'
    }
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  vatNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fiscalAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fiscalCity: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fiscalPostalCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fiscalCountry: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paymentMethod: {
    type: DataTypes.ENUM('bank_transfer', 'credit_card', 'paypal', 'other'),
    defaultValue: 'bank_transfer'
  },
  bankAccount: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bankName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  swiftBic: {
    type: DataTypes.STRING,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

// Establecer relación con Client
BillingInfo.belongsTo(Client, { foreignKey: 'clientId' });
Client.hasOne(BillingInfo, { foreignKey: 'clientId' });

export default BillingInfo;
