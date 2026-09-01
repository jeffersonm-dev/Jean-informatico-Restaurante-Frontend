// services/http.js
import axios from 'axios'

// ============================================
// CONFIGURACIÓN DE URL BASE POR ENTORNO
// ============================================

/**
 * Determina la URL base de la API según el entorno
 * Prioridad:
 * 1. Variable de entorno VITE_API_URL (configurada en .env.production)
 * 2. Detección automática por hostname
 * 3. Localhost por defecto (desarrollo)
 */
function getApiBaseUrl() {
  // 1. Usar variable de entorno (configurada en .env.production o .env.development)
  if (import.meta.env.VITE_API_URL) {
    console.log('🌐 Usando VITE_API_URL:', import.meta.env.VITE_API_URL)
    return import.meta.env.VITE_API_URL
  }

  // 2. Detección automática por hostname
  const hostname = window.location.hostname
  
  // Producción: Render
  if (hostname.includes('onrender.com') || 
      hostname === 'restaurante-frontend.onrender.com') {
    const apiUrl = 'https://restaurante-api-uam4.onrender.com/api'
    console.log('🌐 Render detectado, usando:', apiUrl)
    return apiUrl
  }

  // Producción: Dominio personalizado
  if (hostname === 'financial.centroopticovicente.com') {
    const apiUrl = 'https://api-financial.centroopticovicente.com/api'
    console.log('🌐 Dominio personalizado detectado, usando:', apiUrl)
    return apiUrl
  }

  // 3. Localhost / Desarrollo
  console.log('🌐 Desarrollo detectado, usando: http://localhost:5218/api')
  return 'http://localhost:5218/api'
}

// ============================================
// CONFIGURACIÓN DE AXIOS
// ============================================

const API_BASE = getApiBaseUrl()

console.log('🔧 API Base URL configurada:', API_BASE)

const http = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000 // 30 segundos
})

// ============================================
// INTERCEPTOR DE REQUEST - CORREGIDO
// ============================================

http.interceptors.request.use(
  (config) => {
    // Agregar token de autenticación
    const token = localStorage.getItem('lc_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // ⭐ IMPORTANTE: Si es FormData, eliminar Content-Type 
    // para que axios lo configure automáticamente con el boundary correcto
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
      console.log('📤 Enviando FormData - Content-Type eliminado para que axios lo configure')
    }
    
    // Log de peticiones en desarrollo
    if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
      console.log(`📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
    }
    
    return config
  },
  (error) => {
    console.error('❌ Error en request interceptor:', error)
    return Promise.reject(error)
  }
)

// ============================================
// INTERCEPTOR DE RESPONSE
// ============================================

http.interceptors.response.use(
  (response) => {
    // Log de respuestas exitosas en desarrollo
    if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`)
    }
    return response
  },
  (error) => {
    // Log de errores
    if (error.response) {
      console.error(`❌ Error ${error.response.status}: ${error.config?.url}`, error.response.data)
    } else if (error.request) {
      console.error('❌ No se recibió respuesta del servidor:', error.request)
    } else {
      console.error('❌ Error en la configuración:', error.message)
    }
    
    // Manejar error 401 (No autorizado)
    if (error.response?.status === 401) {
      localStorage.removeItem('lc_token')
      localStorage.removeItem('lc_user')
      // Redirigir al login si no está ya en login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    
    // Manejar error 403 (Prohibido)
    if (error.response?.status === 403) {
      console.warn('⚠️ Acceso denegado. Permisos insuficientes.')
    }
    
    // Manejar error 415 (Unsupported Media Type) - FormData mal configurado
    if (error.response?.status === 415) {
      console.error('⚠️ Error 415: Verifica que el Content-Type sea multipart/form-data')
      console.error('📋 Config:', {
        method: error.config?.method,
        url: error.config?.url,
        headers: error.config?.headers,
        isFormData: error.config?.data instanceof FormData
      })
    }
    
    // Manejar error 500 (Error del servidor)
    if (error.response?.status >= 500) {
      console.error('🔥 Error interno del servidor')
    }
    
    return Promise.reject(error)
  }
)

// ============================================
// EXPORTAR INSTANCIA CONFIGURADA
// ============================================

export default http

// ============================================
// FUNCIONES ÚTILES PARA USAR CON HTTP
// ============================================

/**
 * Obtiene la URL base actual de la API
 */
export function getApiBase() {
  return API_BASE
}

/**
 * Verifica si la API está configurada para producción
 */
export function isProduction() {
  return API_BASE.includes('onrender.com') || 
         API_BASE.includes('centroopticovicente.com')
}

/**
 * Verifica si la API está configurada para desarrollo
 */
export function isDevelopment() {
  return !isProduction() && API_BASE.includes('localhost')
}