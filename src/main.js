// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// ============================================
// ESTILOS GLOBALES
// ============================================
import './assets/main.css'

// ============================================
// BOOTSTRAP ICONS - COMENTADO (usamos CDN en index.html)
// ============================================
// import 'bootstrap-icons/font/bootstrap-icons.css'

// ============================================
// FONT AWESOME - Para iconos adicionales (opcional)
// ============================================
import '@fortawesome/fontawesome-free/css/all.min.css'

// ============================================
// SWEETALERT2 - Para alertas bonitas
// ============================================
import Swal from 'sweetalert2'

// ============================================
// AXIOS - Para peticiones HTTP
// ============================================
import axios from 'axios'

// ============================================
// CONFIGURACIÓN DE AXIOS
// ============================================
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5231/api'

axios.defaults.baseURL = API_URL
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.timeout = 30000

// Interceptor para agregar el token a todas las peticiones
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lc_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor para manejar errores de autenticación
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lc_token')
      localStorage.removeItem('lc_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ============================================
// CREAR APLICACIÓN
// ============================================
const app = createApp(App)

// ============================================
// PINIA - Store
// ============================================
const pinia = createPinia()
app.use(pinia)

// ============================================
// ROUTER
// ============================================
app.use(router)

// ============================================
// PROPIEDADES GLOBALES
// ============================================
app.config.globalProperties.$swal = Swal
app.config.globalProperties.$axios = axios

// ============================================
// ERROR HANDLER GLOBAL
// ============================================
app.config.errorHandler = (err, vm, info) => {
  console.error('Error global:', err)
  console.error('Info:', info)
  
  // Mostrar error con SweetAlert2 si es un error de la aplicación
  if (err?.response?.status === 500) {
    Swal.fire({
      icon: 'error',
      title: 'Error del servidor',
      text: 'Ocurrió un error inesperado. Por favor, intenta nuevamente.',
      confirmButtonColor: '#2F6FED'
    })
  }
}

// ============================================
// MONTAJE DE LA APLICACIÓN
// ============================================
app.mount('#app')