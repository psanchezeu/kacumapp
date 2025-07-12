# KacumApp - Aplicación Full-Stack con Autenticación Google OAuth

## 1. Descripción General

KacumApp es una aplicación web full-stack moderna diseñada como una plantilla robusta y escalable. Incluye un sistema de autenticación seguro mediante Google OAuth 2.0, gestión de sesiones con JWT, y una arquitectura limpia que separa el frontend del backend.

Este proyecto sirve como una base sólida para construir aplicaciones complejas que requieran autenticación de usuarios y una API segura.

## 2. Arquitectura y Tecnologías

La aplicación está dividida en dos componentes principales: un backend de Node.js y un frontend de React.

### Backend

- **Framework:** Node.js con Express.js
- **Base de Datos:** PostgreSQL
- **ORM:** Prisma
- **Autenticación:** Passport.js (Estrategia Google OAuth 2.0)
- **Gestión de Sesiones:** JSON Web Tokens (JWT)
- **Módulos:** ES Modules (`import`/`export`)
- **Documentación API:** Swagger (OpenAPI)
- **Variables de Entorno:** `dotenv`

### Frontend

- **Framework:** React 18
- **Bundler:** Vite
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Routing:** React Router DOM
- **Gestión de Estado:** React Context API
- **Cliente HTTP:** Axios

## 3. Características Principales

- **Autenticación Segura:** Flujo completo de inicio de sesión con Google OAuth 2.0.
- **Gestión de Sesiones con JWT:** El backend genera un token JWT que el frontend almacena para autenticar las solicitudes a rutas protegidas.
- **Rutas Protegidas:** Middleware en el backend para proteger endpoints que requieren un usuario autenticado.
- **Base de Datos con Prisma:** Modelo de datos de usuario y migraciones gestionadas con Prisma.
- **Arquitectura Limpia:** Separación clara de responsabilidades entre el frontend y el backend.
- **Configuración Moderna:** Uso de ES Modules en el backend y Vite en el frontend para un desarrollo rápido y eficiente.

## 4. Estructura del Proyecto

```
kacumapp/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma       # Esquema de la base de datos
│   ├── src/
│   │   ├── config/
│   │   │   └── passport.js     # Configuración de Passport.js
│   │   ├── lib/
│   │   │   └── prisma.js       # Instancia del cliente de Prisma
│   │   ├── middleware/
│   │   │   └── auth.js         # Middleware para proteger rutas
│   │   ├── routes/
│   │   │   ├── auth.js         # Rutas de autenticación (/auth)
│   │   │   └── user.js         # Rutas de usuario (/api)
│   │   └── app.js              # Archivo principal del servidor Express
│   ├── .env.example            # Plantilla de variables de entorno
│   └── package.json
│
└── src/                        # Código fuente del frontend (React)
    ├── components/
    │   └── auth/               # Componentes de autenticación
    ├── contexts/
    │   └── AuthContext.tsx     # Contexto para gestionar la autenticación
    ├── services/
    │   └── api.ts              # Cliente Axios para la API
    ├── App.tsx                 # Componente principal y enrutador
    └── main.tsx                # Punto de entrada del frontend
```

## 5. Instalación y Configuración

Sigue estos pasos para poner en marcha el proyecto en tu entorno local.

### Prerrequisitos

- Node.js (v18 o superior)
- npm o yarn
- Una instancia de PostgreSQL en ejecución

### Pasos

1.  **Clonar el repositorio.**

2.  **Configurar el Backend:**
    ```bash
    cd backend
    npm install
    ```
    - Renombra `.env.example` a `.env` y rellena las variables:
      ```env
      # URL de conexión a tu base de datos PostgreSQL
      DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

      # Credenciales de Google OAuth 2.0
      GOOGLE_CLIENT_ID="TU_CLIENT_ID_DE_GOOGLE"
      GOOGLE_CLIENT_SECRET="TU_CLIENT_SECRET_DE_GOOGLE"

      # Secretos para sesiones y tokens
      JWT_SECRET="UN_SECRETO_LARGO_Y_ALEATORIO_PARA_JWT"
      SESSION_SECRET="UN_SECRETO_DIFERENTE_PARA_LA_SESION"

      # URL del frontend (para redirecciones)
      FRONTEND_URL="http://localhost:5173"
      ```
    - Ejecuta las migraciones de la base de datos:
      ```bash
      npx prisma migrate dev --name init
      npx prisma generate
      ```

3.  **Configurar el Frontend:**
    ```bash
    cd .. 
    npm install
    ```
    - El frontend no requiere un archivo `.env` ya que la URL de la API se configura directamente en `src/services/api.ts`.

## 6. Ejecución de la Aplicación

Debes tener dos terminales abiertas, una para el backend y otra para el frontend.

- **Iniciar el servidor del Backend:**
  ```bash
  cd backend
  npm run dev
  ```
  El servidor estará disponible en `http://localhost:3001`.

- **Iniciar la aplicación del Frontend:**
  ```bash
  # Desde la raíz del proyecto
  npm run dev
  ```
  La aplicación estará disponible en `http://localhost:5173`.

## 7. Endpoints de la API

- `GET /auth/google`: Inicia el flujo de autenticación con Google.
- `GET /auth/google/callback`: URL de callback que procesa la respuesta de Google y genera el JWT.
- `GET /api/profile`: (Ruta protegida) Devuelve los datos del usuario autenticado.
