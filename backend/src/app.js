import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
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
import userRoutes from './routes/user.js';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(origin => origin.trim());

// Configuración de CORS
app.use(cors({
  origin: function (origin, callback) {
    // Permitir solicitudes sin 'origin' (como aplicaciones móviles o curl)
    if (!origin) return callback(null, true);
    
    // Verificar si el origen está permitido
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'El origen de la petición no está permitido por CORS';
      console.error(msg, { origin, allowedOrigins });
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Manejar solicitudes OPTIONS (necesario para CORS preflight)
app.options('*', cors());

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
      description: 'API para el envío de correos electrónicos desde el formulario de contacto',
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

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Ruta para enviar correo
/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Envía un correo electrónico de contacto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Correo enviado exitosamente
 *       500:
 *         description: Error al enviar el correo
 */
// Rutas de la API
app.use('/auth', authRoutes);
app.use('/api', userRoutes);

// Servir frontend en producción ANTES de las rutas catch-all
if (process.env.NODE_ENV === 'production') {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Servir archivos estáticos del build de React
    app.use(express.static(path.join(__dirname, '../../dist')));

    // Para cualquier otra ruta no definida en la API, servir el index.html de React
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../../dist', 'index.html'));
    });
}

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: `Nuevo mensaje de contacto de ${name}`,
      text: `
        Nombre: ${name}
        Email: ${email}
        Teléfono: ${phone || 'No proporcionado'}
        
        Mensaje:
        ${message}
      `,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
        <h3>Mensaje:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Mensaje enviado correctamente' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al enviar el mensaje',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});



// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
  console.log(`Documentación de la API disponible en http://localhost:${port}/api-docs`);
});

export default app;
