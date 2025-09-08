import axios from 'axios';

// Lee la URL PÚBLICA del servidor desde las variables de entorno.
const serverUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!serverUrl) {
  console.error(
    'CRITICAL ERROR: The NEXT_PUBLIC_API_BASE_URL environment variable is not defined. Please check your .env.local file.'
  );
}

const fullBaseURL = `${serverUrl}/api/v1`;

const api = axios.create({
  baseURL: fullBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Interceptor de Peticiones (Sin cambios) ---
api.interceptors.request.use(
  (config) => {
    const finalUrl = axios.getUri(config);
    console.log(`[API Request] -> ${config.method?.toUpperCase()} ${finalUrl}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// --- Función Centralizada y Definitiva para Resolver URLs de Recursos ---
export const resolveApiAssetUrl = (path: string | null | undefined): string | null | undefined => {
  if (!path || !serverUrl) {
    return path;
  }

  const internalPort = ':8000';
  let publicPort = '';
  try {
    const publicUrl = new URL(serverUrl);
    publicPort = publicUrl.port ? `:${publicUrl.port}` : '';
  } catch (e) {
    // Si la URL base no es válida, no podemos hacer mucho.
    return path;
  }

  // Caso 1: Es una URL completa pero con el puerto interno del backend (ej: http://localhost:8000/...)
  if (path.startsWith('http') && path.includes(internalPort)) {
    return path.replace(internalPort, publicPort);
  }

  // Caso 2: Es una ruta relativa (ej: /storage/...)
  if (path.startsWith('/')) {
    return `${serverUrl}${path}`;
  }

  // Si no es ninguno de los casos anteriores, devolver la ruta tal cual.
  return path;
};

// --- Interceptor de Respuestas con Corrección de URLs ---
const recursiveUrlCorrection = (data: any): any => {
  if (!data) return data;

  if (Array.isArray(data)) {
    return data.map(recursiveUrlCorrection);
  }

  if (typeof data === 'object') {
    return Object.entries(data).reduce((acc, [key, value]) => {
      const urlKeys = ['avatar_url', 'full_avatar_url', 'url', 'file_path', 'flag'];
      
      if (urlKeys.includes(key) && typeof value === 'string') {
        acc[key] = resolveApiAssetUrl(value);
      } else {
        acc[key] = recursiveUrlCorrection(value);
      }
      return acc;
    }, {} as { [key: string]: any });
  }

  return data;
};

api.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = recursiveUrlCorrection(response.data);
    }
    return response;
  },
  (error) => {
    console.error('[API Response Error]', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

console.log(`[API] Axios client initialized for baseURL: ${fullBaseURL}`);
console.log('[API] Final response interceptor for asset URL resolution is active.');

export default api;
