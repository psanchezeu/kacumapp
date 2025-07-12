import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuraciones
import './config/passport.js';

// Rutas
import authRoutes from './routes/auth.js';
import apiRoutes from './routes/index.js'; // Usar el router consolidado

const app = express();
const port = process.env.PORT || 3001;

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(origin => origin.trim());

// Configuración de CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'El origen de la petición no está permitido por CORS';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Parsear JSON y cookies
app.use(express.json());
app.use(cookieParser());

// Configuración de la sesión de Express
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' },
  })
);

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Kacum',
      version: '1.0.0',
      description: 'Documentación de la API de Kacum',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Servidor de desarrollo',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// --- RUTAS DE LA APLICACIÓN ---
// Primero, las rutas de la API y de autenticación
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// --- SERVIR FRONTEND EN PRODUCCIÓN ---
// Este bloque debe ir DESPUÉS de las rutas de la API
if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const frontendDistPath = path.join(__dirname, '..', '..', 'dist');

  // Sirve los archivos estáticos de la app de React
  app.use(express.static(frontendDistPath));

  // El manejador "catchall": para cualquier petición que no coincida con una ruta de la API o un archivo estático,
  // envía de vuelta el archivo index.html de React.
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
  console.log(`Documentación de la API disponible en http://localhost:${port}/api-docs`);
});

export default app;
