export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:30000';
export const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 10000; 

// Vite exposes only variables prefixed with VITE_
export const OPEN_API_DOC_URL = import.meta.env.VITE_OPEN_API_DOC_URL || 'http://localhost:8080/api-docs';