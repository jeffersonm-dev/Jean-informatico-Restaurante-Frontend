// services/images.js

/**
 * Obtiene la URL base para imágenes según el entorno
 */
function getImagesBaseUrl() {
  // 1. Usar variable de entorno (prioridad)
  if (import.meta.env.VITE_IMAGES_URL) {
    console.log('🌐 Usando VITE_IMAGES_URL:', import.meta.env.VITE_IMAGES_URL)
    return import.meta.env.VITE_IMAGES_URL
  }

  // 2. Usar API_URL como fallback
  if (import.meta.env.VITE_API_URL) {
    const apiUrl = import.meta.env.VITE_API_URL.replace(/\/api$/, '')
    console.log('🌐 Usando VITE_API_URL (sin /api):', apiUrl)
    return apiUrl
  }

  // 3. Detección automática por hostname
  const hostname = window.location.hostname
  
  if (hostname.includes('onrender.com')) {
    const apiUrl = 'https://restaurante-api-uam4.onrender.com'
    console.log('🌐 Render detectado, usando:', apiUrl)
    return apiUrl
  }

  // 4. Desarrollo local
  console.log('🌐 Desarrollo detectado, usando: http://localhost:5218')
  return 'http://localhost:5218'
}

const IMAGES_BASE_URL = getImagesBaseUrl()
console.log('🔧 IMAGES_BASE_URL:', IMAGES_BASE_URL)

/**
 * Construye la URL completa de una imagen
 * @param {string} url - Ruta relativa o absoluta
 * @returns {string} URL completa
 */
export function construirUrlImagen(url) {
  if (!url) return null
  
  // Si ya es URL completa, devolverla
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // Limpiar la URL
  let cleanUrl = url
  
  // Eliminar wwwroot
  if (cleanUrl.includes('wwwroot')) {
    cleanUrl = cleanUrl.replace('wwwroot', '')
  }
  
  // Eliminar /api/ si existe
  if (cleanUrl.includes('/api/')) {
    cleanUrl = cleanUrl.replace('/api/', '/')
  }
  if (cleanUrl.includes('api/')) {
    cleanUrl = cleanUrl.replace('api/', '')
  }
  
  // Asegurar que comience con /
  if (!cleanUrl.startsWith('/')) {
    cleanUrl = '/' + cleanUrl
  }
  
  // Eliminar // dobles
  cleanUrl = cleanUrl.replace(/\/\//g, '/')
  
  // Construir URL final
  const base = IMAGES_BASE_URL.replace(/\/+$/, '')
  const finalUrl = `${base}${cleanUrl}`
  
  console.log('🔍 Construyendo URL:', { original: url, clean: cleanUrl, final: finalUrl })
  return finalUrl
}

/**
 * Obtiene la URL de la imagen principal de un producto
 * @param {Object} producto - Objeto producto
 * @returns {string|null} URL de la imagen o null
 */
export function getImagenUrl(producto) {
  if (!producto) return null
  
  // Si el producto tiene imagen_principal_url directamente
  if (producto.imagen_principal_url) {
    return construirUrlImagen(producto.imagen_principal_url)
  }
  
  // Buscar en el array de imágenes
  if (producto.imagenes && producto.imagenes.length > 0) {
    const principal = producto.imagenes.find(img => img.es_principal === true) || producto.imagenes[0]
    if (principal) {
      const url = principal.url_imagen_completa || principal.url_imagen
      return construirUrlImagen(url)
    }
  }
  
  // Si tiene imagen_principal
  if (producto.imagen_principal) {
    return construirUrlImagen(producto.imagen_principal)
  }
  
  return null
}

/**
 * Obtiene la URL de una imagen por su nombre
 * @param {string} nombreImagen - Nombre del archivo
 * @param {string} subcarpeta - Subcarpeta (ej: 'productos')
 * @returns {string} URL completa
 */
export function getImageUrl(nombreImagen, subcarpeta = 'productos') {
  if (!nombreImagen) return '/placeholder-image.png'
  return construirUrlImagen(`/images/${subcarpeta}/${nombreImagen}`)
}

export default {
  IMAGES_BASE_URL,
  construirUrlImagen,
  getImagenUrl,
  getImageUrl
}