import { Router } from 'express';
import * as clientController from '../controllers/client.controller.js';
import * as billingController from '../controllers/billing.controller.js';
import * as contactController from '../controllers/contact.controller.js';
import { authRequired, hasRole } from '../middlewares/auth.middleware.js';
import { uploadImage, handleMulterError } from '../middlewares/upload.middleware.js';
import { validateSchema, clientSchema, billingInfoSchema, contactSchema } from '../validators/client.validator.js';

const router = Router();

// Rutas para clientes
router.get('/clients', 
  authRequired, 
  hasRole(['admin']), 
  clientController.getAllClients
);

router.get('/clients/:id', 
  authRequired, 
  clientController.getClientById
);

router.post('/clients',
  authRequired,
  hasRole(['admin']),
  uploadImage.single('avatar'),
  handleMulterError,
  validateSchema(clientSchema),
  clientController.createClient
);

router.put('/clients/:id',
  authRequired,
  hasRole(['admin']),
  uploadImage.single('avatar'),
  handleMulterError,
  validateSchema(clientSchema),
  clientController.updateClient
);

router.delete('/clients/:id',
  authRequired,
  hasRole(['admin']),
  clientController.deleteClient
);

// Rutas para información de facturación
router.get('/clients/:clientId/billing',
  authRequired,
  billingController.getBillingInfo
);

router.post('/billing',
  authRequired,
  hasRole(['admin']),
  validateSchema(billingInfoSchema),
  billingController.createBillingInfo
);

router.put('/billing/:id',
  authRequired,
  hasRole(['admin']),
  validateSchema(billingInfoSchema),
  billingController.updateBillingInfo
);

router.delete('/billing/:id',
  authRequired,
  hasRole(['admin']),
  billingController.deleteBillingInfo
);

// Rutas para contactos
router.get('/clients/:clientId/contacts',
  authRequired,
  contactController.getClientContacts
);

router.get('/contacts/:id',
  authRequired,
  contactController.getContactById
);

router.post('/contacts',
  authRequired,
  hasRole(['admin']),
  uploadImage.single('avatar'),
  handleMulterError,
  validateSchema(contactSchema),
  contactController.createContact
);

router.put('/contacts/:id',
  authRequired,
  hasRole(['admin']),
  uploadImage.single('avatar'),
  handleMulterError,
  validateSchema(contactSchema),
  contactController.updateContact
);

router.delete('/contacts/:id',
  authRequired,
  hasRole(['admin']),
  contactController.deleteContact
);

export default router;
