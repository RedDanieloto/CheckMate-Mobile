/**
 * Configuración de Entornos para CheckMate API
 * 
 * Para cambiar entre desarrollo y producción:
 * Modifica `IS_DEV` a true o false.
 */

// Alternar entre entorno local (dev) y producción (prod)
export const IS_DEV = true;

// URLs base de la API
// Para desarrollo en dispositivo físico o emulador:
// - Android Emulator: 'http://10.0.2.2:8000/api/v1'
// - iOS Simulator / Web / Localhost: 'http://localhost:8000/api/v1'
const DEV_BASE_URL = 'http://10.0.2.2:8000/api/v1';
const PROD_BASE_URL = 'https://api.checkmate.org/api/v1';

export const ENV_CONFIG = {
  isDev: IS_DEV,
  isProd: !IS_DEV,
  baseUrl: IS_DEV ? DEV_BASE_URL : PROD_BASE_URL,
  timeoutMs: 10000,
};

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER_USER: '/auth/users',
  },
} as const;
