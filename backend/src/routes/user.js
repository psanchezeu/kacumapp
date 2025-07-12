import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Obtener perfil del usuario
// @route   GET /api/profile
// @access  Privado
router.get('/profile', protect, (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(404).json({ message: 'Usuario no encontrado' });
  }
});

export default router;
