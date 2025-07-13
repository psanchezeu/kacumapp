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


// Middleware
const allowedOrigins = [process.env.FRONTEND_URL, ...(process.env.ALLOWED_ORIGINS?.split(',').map(origin => origin.trim()) || [])];

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
        url: `/`,
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

// El frontend ahora se despliega como un servicio separado.

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});



export default app;
