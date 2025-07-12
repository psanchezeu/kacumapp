// Extender la interfaz Window para incluir ENV
declare global {
  interface Window {
    ENV: {
      NEXT_PUBLIC_API_URL?: string;
    };
  }
}

export {}; // Esto es necesario para que TypeScript trate este archivo como un módulo
