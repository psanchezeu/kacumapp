import multer from 'multer';
import path from 'path';

// Configuración de almacenamiento en memoria (luego lo guardaremos correctamente en el sistema de archivos)
const storage = multer.memoryStorage();

// Función para filtrar tipos de archivos
const fileFilter = (req, file, cb) => {
  // Permitir solo imágenes
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no soportado. Solo se permiten imágenes.'), false);
  }
};

// Exportar middleware con límites configurados
export const uploadImage = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  }
});

// Middleware para manejar errores de multer
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Un error de Multer ocurrió durante la subida
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'Archivo demasiado grande',
        message: 'El tamaño máximo permitido es 5MB'
      });
    }
    return res.status(400).json({
      error: 'Error en la subida de archivo',
      message: err.message
    });
  } else if (err) {
    // Un error desconocido ocurrió
    return res.status(400).json({
      error: 'Error en la subida de archivo',
      message: err.message
    });
  }
  
  // Si no hay error, continúa
  next();
};

export default {
  uploadImage,
  handleMulterError
};
