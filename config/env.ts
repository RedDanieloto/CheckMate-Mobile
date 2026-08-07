import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Configuración de Entornos para CheckMate API
 * 
 * Para cambiar entre desarrollo y producción:
 * Modifica `IS_DEV` a true o false.
 */

export const IS_DEV = true;

// Obtener la IP dinámica de la máquina local (útil para celulares físicos con Expo Go)
const getLocalDevUrl = (): string => {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip) {
      return `http://${ip}:8000/api/v1`;
    }
  }

  // Fallback según plataforma
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000/api/v1';
  }

  return 'http://localhost:8000/api/v1';
};

const DEV_BASE_URL = getLocalDevUrl();
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
  ALUMNO: {
    PROFILE: '/alumno/profile',
    CLAIMS: '/alumno/claims',
    JUSTIFICATIONS: '/alumno/justifications',
    SUBJECTS: '/alumno/subjects',
  },
  PROFESOR: {
    GROUPS: '/profesor/groups',
    STUDENTS: '/profesor/students',
    SCHEDULE: '/profesor/schedule',
    SCHEDULE_TODAY: '/profesor/schedule/today',
    SESSIONS: '/profesor/sessions',
    INCIDENTS: '/profesor/incidents',
    CLAIMS: '/profesor/claims',
  },
} as const;


