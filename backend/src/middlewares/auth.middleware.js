import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'kacumapp_secret_key';

/**
 * Middleware de autenticación para proteger rutas
 * Verifica el token JWT y carga el usuario en req.user
 */
export const authRequired = (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Acceso denegado',
        message: 'Token no proporcionado o formato inválido'
      });
    }
    
    // Extraer token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Acceso denegado',
        message: 'Token no proporcionado'
      });
    }
    
    // Verificar token
    const decodedToken = jwt.verify(token, JWT_SECRET);
    
    // Agregar usuario a la request
    req.user = decodedToken;
    
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Acceso denegado',
        message: 'Token expirado'
      });
    }
    
    return res.status(401).json({
      error: 'Acceso denegado',
      message: 'Token inválido'
    });
  }
};

/**
 * Middleware para verificar roles
 * @param {string[]} roles - Array de roles permitidos
 */
export const hasRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Acceso denegado',
        message: 'Usuario no autenticado'
      });
    }
    
    const userRole = req.user.role;
    
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        error: 'Acceso denegado',
        message: 'No tiene permisos suficientes para esta acción'
      });
    }
    
    next();
  };
};

export default {
  authRequired,
  hasRole
};
