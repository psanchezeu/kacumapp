import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extraer token de la cabecera
      token = req.headers.authorization.split(' ')[1];

      // Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscar usuario en la BD y adjuntarlo a la request (sin la contraseña)
      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, name: true, avatarUrl: true, googleId: true },
      });

      if (!req.user) {
        return res.status(401).json({ message: 'Usuario no encontrado, token inválido' });
      }

      next();
    } catch (error) {
      console.error('Error de autenticación:', error);
      return res.status(401).json({ message: 'No autorizado, token fallido' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No autorizado, sin token' });
  }
};
