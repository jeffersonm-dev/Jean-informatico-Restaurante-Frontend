<!-- src/views/restaurante/Producto/ProductoView.vue -->
<template>
  <div class="producto-container">
    <!-- Header -->
    <div class="producto-header">
      <div class="header-content">
        <div class="header-title">
          <div class="title-icon">
            <i class="bi bi-box"></i>
          </div>
          <div>
            <h1>Productos</h1>
            <p class="subtitle">Gestiona los productos de tu restaurante</p>
          </div>
        </div>
        <div class="header-stats">
          <div class="stat-card">
            <span class="stat-number">{{ productos.length }}</span>
            <span class="stat-label">Total Productos</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">{{ productosActivos }}</span>
            <span class="stat-label">Activos</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">{{ productosInactivos }}</span>
            <span class="stat-label">Inactivos</span>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn-primary" @click="abrirModalNuevo">
          <i class="bi bi-plus-circle"></i>
          Nuevo Producto
        </button>
      </div>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="filtros-section">
      <div class="search-box">
        <i class="bi bi-search"></i>
        <input 
          type="text" 
          v-model="filtros.buscar" 
          placeholder="Buscar producto por nombre o código..."
          @input="filtrarProductos"
        />
      </div>
      <div class="filter-group">
        <select class="filter-select" v-model="filtros.estado" @change="filtrarProductos">
          <option value="">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
        <select class="filter-select" v-model="filtros.categoria_id" @change="filtrarProductos">
          <option value="">Todas las categorías</option>
          <option 
            v-for="categoria in categorias" 
            :key="categoria.id" 
            :value="categoria.id"
          >
            {{ categoria.nombre }}
          </option>
        </select>
        <button class="btn-clear" @click="limpiarFiltros">
          <i class="bi bi-eraser"></i>
          Limpiar
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="cargando" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando productos...</p>
    </div>

    <!-- Grid de Productos -->
    <div v-else class="productos-grid">
      <div v-if="productosFiltrados.length === 0" class="empty-state">
        <i class="bi bi-box"></i>
        <h3>No hay productos registrados</h3>
        <p>Comienza creando tu primer producto</p>
        <button class="btn-primary" @click="abrirModalNuevo">
          <i class="bi bi-plus-circle"></i>
          Crear primer producto
        </button>
      </div>

      <!-- Productos -->
      <div 
        v-for="producto in productosFiltrados" 
        :key="producto.id" 
        class="producto-card"
        :class="{ inactive: !producto.activo }"
      >
        <div class="card-header">
          <div class="card-status">
            <span class="status-dot" :class="producto.activo ? 'active' : 'inactive'"></span>
            <span class="status-label">{{ producto.activo ? 'Activo' : 'Inactivo' }}</span>
            <span v-if="producto.destacado" class="badge-destacado">Destacado</span>
            <span v-if="producto.es_combo" class="badge-combo">Combo</span>
          </div>
          <div class="card-actions">
            <button class="icon-btn image" @click="abrirModalImagen(producto)" title="Subir imagen">
              <i class="bi bi-image"></i>
            </button>
            <button class="icon-btn edit" @click="abrirModalEditar(producto)" title="Editar">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="icon-btn view" @click="verProducto(producto.id)" title="Ver detalle">
              <i class="bi bi-eye"></i>
            </button>
            <button 
              class="icon-btn toggle" 
              :class="producto.activo ? 'danger' : 'success'"
              @click="toggleEstado(producto)" 
              :title="producto.activo ? 'Desactivar' : 'Activar'"
            >
              <i :class="producto.activo ? 'bi bi-toggle-off' : 'bi bi-toggle-on'"></i>
            </button>
          </div>
        </div>

        <div class="card-body">
          <!-- Imagen del producto -->
          <div class="card-image-container">
            <img 
              v-if="getImagenUrl(producto)" 
              :src="getImagenUrl(producto)" 
              :alt="producto.nombre"
              class="card-image"
              @error="handleImageError"
            />
            <div v-else class="card-image-placeholder">
              <i class="bi bi-image"></i>
              <span>Sin imagen</span>
            </div>
          </div>
          <div class="card-code">{{ producto.codigo }}</div>
          <h3 class="card-title">{{ producto.nombre }}</h3>
          <p class="card-desc">{{ producto.descripcion || 'Sin descripción' }}</p>
          
          <div class="card-price">
            <span class="price">S/ {{ formatearPrecio(producto.precio_venta) }}</span>
            <span v-if="producto.precio_promocion" class="price-old">S/ {{ formatearPrecio(producto.precio_promocion) }}</span>
          </div>

          <div class="card-stats">
            <span class="stat" v-if="producto.categoria_nombre">
              <i class="bi bi-tag"></i>
              {{ producto.categoria_nombre }}
            </span>
            <span class="stat" v-if="producto.stock_actual !== undefined">
              <i class="bi bi-box-seam"></i>
              Stock: {{ producto.stock_actual }}
            </span>
            <span class="stat" v-if="producto.unidad_medida">
              <i class="bi bi-rulers"></i>
              {{ producto.unidad_medida }}
            </span>
          </div>
        </div>

        <div class="card-footer">
          <span class="card-id">ID: #{{ producto.id }}</span>
          <span class="card-sede" v-if="producto.sede_id">
            <i class="bi bi-building"></i>
            Sede: {{ producto.sede_nombre || producto.sede_id }}
          </span>
          <span class="card-date">{{ formatearFechaCorta(producto.fecha_creacion) }}</span>
        </div>
      </div>
    </div>

    <!-- Modal Nuevo/Editar -->
    <ProductoFormModal 
      :show="mostrarModal"
      :editando="isEditando"
      :producto="productoSeleccionado"
      :categorias="categorias"
      :sedes="sedes"
      @close="cerrarModal"
      @save="onSave"
    />

    <!-- Modal de Imagen -->
    <ProductoImagenModal
      :show="mostrarModalImagen"
      :producto="productoSeleccionado"
      @close="cerrarModalImagen"
      @save="onSaveImagen"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ProductosAPI, CategoriasAPI, SedesAPI, ImagenProductoAPI } from '@/services/api'
import Swal from 'sweetalert2'
import ProductoFormModal from './ProductoFormModal.vue'
import ProductoImagenModal from './ProductoImagenModal.vue'

// ✅ IMPORTAR SOLO LA FUNCIÓN QUE NECESITAS
import { getImagenUrl } from '@/services/images'

// ============================================
// STATE
// ============================================
const cargando = ref(false)
const productos = ref([])
const categorias = ref([])
const sedes = ref([])
const isEditando = ref(false)
const productoSeleccionado = ref(null)
const mostrarModal = ref(false)
const mostrarModalImagen = ref(false)

const filtros = ref({
  buscar: '',
  estado: '',
  categoria_id: ''
})

// ============================================
// COMPUTED
// ============================================
const productosActivos = computed(() => productos.value.filter(p => p.activo).length)
const productosInactivos = computed(() => productos.value.filter(p => !p.activo).length)

const productosFiltrados = computed(() => {
  let resultado = [...productos.value]

  if (filtros.value.buscar) {
    const busq = filtros.value.buscar.toLowerCase()
    resultado = resultado.filter(p =>
      p.nombre?.toLowerCase().includes(busq) ||
      p.codigo?.toLowerCase().includes(busq) ||
      p.descripcion?.toLowerCase().includes(busq)
    )
  }

  if (filtros.value.estado) {
    const activo = filtros.value.estado === 'activo'
    resultado = resultado.filter(p => p.activo === activo)
  }

  if (filtros.value.categoria_id) {
    resultado = resultado.filter(p => p.categoria_id === parseInt(filtros.value.categoria_id))
  }

  return resultado
})

// ============================================
// MANEJO DE ERRORES DE IMÁGENES
// ============================================
const handleImageError = (event) => {
  console.warn('❌ Error al cargar imagen:', event.target.src)
  event.target.style.display = 'none'
  const container = event.target.closest('.card-image-container')
  if (container) {
    const placeholder = container.querySelector('.card-image-placeholder')
    if (placeholder) {
      placeholder.style.display = 'flex'
    }
  }
}

// ============================================
// CARGAR DATOS
// ============================================
const cargarProductos = async () => {
  cargando.value = true
  try {
    const response = await ProductosAPI.list()
    if (response.data.success) {
      const productosData = response.data.data || []
      
      for (const producto of productosData) {
        try {
          const imagenesResponse = await ImagenProductoAPI.getByProducto(producto.id)
          if (imagenesResponse.data.success) {
            const imagenes = imagenesResponse.data.data || []
            const principal = imagenes.find(img => img.es_principal === true) || imagenes[0]
            if (principal) {
              let url = principal.url_imagen_completa || principal.url_imagen
              producto.imagen_principal_url = url
              producto.imagenes = imagenes
              console.log(`✅ Imagen cargada para producto ${producto.id}:`, url)
            }
          }
        } catch (error) {
          console.warn(`⚠️ No se pudieron cargar imágenes para producto ${producto.id}`)
        }
      }
      
      productos.value = productosData
    }
  } catch (error) {
    console.error('❌ Error al cargar productos:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error de conexión',
      text: 'No se pudieron cargar los productos.'
    })
  } finally {
    cargando.value = false
  }
}

const cargarCategorias = async () => {
  try {
    const response = await CategoriasAPI.list()
    if (response.data.success) {
      categorias.value = response.data.data || []
    }
  } catch (error) {
    console.error('❌ Error al cargar categorías:', error)
  }
}

const cargarSedes = async () => {
  try {
    const response = await SedesAPI.list()
    if (response.data.success) {
      sedes.value = response.data.data || []
    }
  } catch (error) {
    console.error('❌ Error al cargar sedes:', error)
  }
}

// ============================================
// FILTROS
// ============================================
const filtrarProductos = () => {}

const limpiarFiltros = () => {
  filtros.value = {
    buscar: '',
    estado: '',
    categoria_id: ''
  }
}

// ============================================
// MODALES
// ============================================
const abrirModalNuevo = () => {
  isEditando.value = false
  productoSeleccionado.value = null
  mostrarModal.value = true
}

const abrirModalEditar = (producto) => {
  isEditando.value = true
  productoSeleccionado.value = producto
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  productoSeleccionado.value = null
}

const abrirModalImagen = (producto) => {
  productoSeleccionado.value = producto
  mostrarModalImagen.value = true
}

const cerrarModalImagen = () => {
  mostrarModalImagen.value = false
  productoSeleccionado.value = null
}

const onSave = async () => {
  await cargarProductos()
}

const onSaveImagen = async () => {
  await cargarProductos()
  cerrarModalImagen()
}

// ============================================
// ACCIONES
// ============================================
const verProducto = (id) => {
  const producto = productos.value.find(p => p.id === id)
  if (producto) {
    const imagenUrl = getImagenUrl(producto)
    Swal.fire({
      title: producto.nombre,
      html: `
        <div style="text-align: left;">
          ${imagenUrl ? `<img src="${imagenUrl}" style="max-width: 100%; max-height: 200px; border-radius: 8px; margin-bottom: 12px; object-fit: cover;" />` : ''}
          <p><strong>ID:</strong> #${producto.id}</p>
          <p><strong>Código:</strong> ${producto.codigo || 'N/A'}</p>
          <p><strong>Descripción:</strong> ${producto.descripcion || 'Sin descripción'}</p>
          <p><strong>Precio Venta:</strong> S/ ${formatearPrecio(producto.precio_venta)}</p>
          ${producto.precio_compra ? `<p><strong>Precio Compra:</strong> S/ ${formatearPrecio(producto.precio_compra)}</p>` : ''}
          ${producto.precio_promocion ? `<p><strong>Precio Promoción:</strong> S/ ${formatearPrecio(producto.precio_promocion)}</p>` : ''}
          ${producto.precio_mayorista ? `<p><strong>Precio Mayorista:</strong> S/ ${formatearPrecio(producto.precio_mayorista)}</p>` : ''}
          <p><strong>Estado:</strong> ${producto.activo ? '✅ Activo' : '❌ Inactivo'}</p>
          <p><strong>Categoría:</strong> ${producto.categoria_nombre || 'Sin categoría'}</p>
          <p><strong>Stock Actual:</strong> ${producto.stock_actual || 0}</p>
          <p><strong>Unidad de Medida:</strong> ${producto.unidad_medida || 'N/A'}</p>
          <p><strong>Destacado:</strong> ${producto.destacado ? '⭐ Sí' : 'No'}</p>
          <p><strong>Es Combo:</strong> ${producto.es_combo ? 'Sí' : 'No'}</p>
          <p><strong>Fecha creación:</strong> ${formatearFecha(producto.fecha_creacion)}</p>
        </div>
      `,
      confirmButtonColor: '#E85D3A',
      confirmButtonText: 'Cerrar'
    })
  }
}

const toggleEstado = async (producto) => {
  const estadoTexto = producto.activo ? 'desactivar' : 'activar'
  const result = await Swal.fire({
    title: `¿${estadoTexto === 'desactivar' ? 'Desactivar' : 'Activar'} producto?`,
    text: `¿Estás seguro de ${estadoTexto} el producto "${producto.nombre}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: producto.activo ? '#dc3545' : '#28a745',
    confirmButtonText: `Sí, ${estadoTexto}`,
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    try {
      const response = await ProductosAPI.toggleStatus(producto.id)
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Estado actualizado',
          timer: 1500,
          showConfirmButton: false
        })
        await cargarProductos()
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cambiar el estado del producto'
      })
    }
  }
}

// ============================================
// UTILIDADES
// ============================================
const formatearPrecio = (precio) => {
  if (!precio) return '0.00'
  return parseFloat(precio).toFixed(2)
}

const formatearFecha = (fecha) => {
  if (!fecha) return 'N/A'
  try {
    const d = new Date(fecha)
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return fecha
  }
}

const formatearFechaCorta = (fecha) => {
  if (!fecha) return ''
  try {
    const d = new Date(fecha)
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return fecha
  }
}

// ============================================
// LIFECYCLE
// ============================================
onMounted(() => {
  cargarSedes()
  cargarCategorias()
  cargarProductos()
})
</script>

<style scoped>
/* ============================================
   CONTAINER
   ============================================ */
.producto-container {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* ============================================
   HEADER
   ============================================ */
.producto-header {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: 16px;
  padding: 28px 32px;
  margin-bottom: 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  position: relative;
  overflow: hidden;
}

.producto-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(232, 93, 58, 0.1), transparent 70%);
  border-radius: 50%;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 14px;
}

.title-icon {
  width: 48px;
  height: 48px;
  background: rgba(232, 93, 58, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-icon i {
  font-size: 24px;
  color: #E85D3A;
}

.header-title h1 {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.header-title .subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.header-stats {
  display: flex;
  gap: 16px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 10px 18px;
  text-align: center;
  min-width: 80px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.stat-number {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
}

.stat-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.header-actions {
  position: relative;
  z-index: 1;
}

.btn-primary {
  background: #E85D3A;
  border: none;
  color: #fff;
  padding: 10px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #c94f2e;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(232, 93, 58, 0.35);
}

.btn-primary i {
  font-size: 18px;
}

/* ============================================
   FILTROS
   ============================================ */
.filtros-section {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 14px;
  transition: all 0.3s ease;
}

.search-box:focus-within {
  border-color: #E85D3A;
  box-shadow: 0 0 0 3px rgba(232, 93, 58, 0.1);
}

.search-box i {
  color: #9ca3af;
  font-size: 18px;
}

.search-box input {
  border: none;
  padding: 10px 12px;
  font-size: 14px;
  width: 100%;
  outline: none;
  background: transparent;
  color: #1a1a2e;
}

.search-box input::placeholder {
  color: #9ca3af;
}

.filter-group {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-select {
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  background: #fff;
  color: #1a1a2e;
  cursor: pointer;
  outline: none;
  min-width: 160px;
}

.filter-select:focus {
  border-color: #E85D3A;
  box-shadow: 0 0 0 3px rgba(232, 93, 58, 0.1);
}

.btn-clear {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-clear:hover {
  background: #e5e7eb;
  color: #374151;
}

/* ============================================
   LOADING
   ============================================ */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  background: #fff;
  border-radius: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #E85D3A;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: #6b7280;
  margin-top: 16px;
  font-size: 14px;
}

/* ============================================
   PRODUCTOS GRID
   ============================================ */
.productos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* ============================================
   PRODUCTO CARD
   ============================================ */
.producto-card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.producto-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
  border-color: #d1d5db;
}

.producto-card.inactive {
  opacity: 0.7;
}

.producto-card.inactive .card-title {
  color: #9ca3af;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f6f4;
  border-bottom: 1px solid #e5e7eb;
}

.card-status {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.status-dot.active {
  background: #10b981;
}

.status-dot.inactive {
  background: #ef4444;
}

.status-label {
  font-size: 12px;
  font-weight: 600;
  color: #4b5563;
}

.badge-destacado {
  background: #fef3c7;
  color: #d97706;
  font-size: 10px;
  padding: 2px 10px;
  border-radius: 12px;
  font-weight: 600;
}

.badge-combo {
  background: #dbeafe;
  color: #2563eb;
  font-size: 10px;
  padding: 2px 10px;
  border-radius: 12px;
  font-weight: 600;
}

.card-actions {
  display: flex;
  gap: 4px;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.icon-btn.image {
  background: transparent;
  color: #6b7280;
}

.icon-btn.image:hover {
  background: #ecfdf5;
  color: #10b981;
}

.icon-btn.edit {
  background: transparent;
  color: #6b7280;
}

.icon-btn.edit:hover {
  background: #f3f4f6;
  color: #E85D3A;
}

.icon-btn.view {
  background: transparent;
  color: #6b7280;
}

.icon-btn.view:hover {
  background: #f3f4f6;
  color: #3b82f6;
}

.icon-btn.toggle {
  background: transparent;
  color: #6b7280;
}

.icon-btn.toggle.danger:hover {
  background: #fef2f2;
  color: #ef4444;
}

.icon-btn.toggle.success:hover {
  background: #ecfdf5;
  color: #10b981;
}

.card-body {
  padding: 18px;
  text-align: center;
}

.card-image-container {
  width: 100%;
  height: 150px;
  margin-bottom: 12px;
  border-radius: 8px;
  overflow: hidden;
  background: #f3f4f6;
  position: relative;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  background: #f9fafb;
}

.card-image-placeholder i {
  font-size: 36px;
  margin-bottom: 4px;
}

.card-image-placeholder span {
  font-size: 12px;
}

.card-code {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
  margin-bottom: 8px;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 4px 0;
}

.card-desc {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-price {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.price {
  font-size: 20px;
  font-weight: 700;
  color: #E85D3A;
}

.price-old {
  font-size: 14px;
  color: #9ca3af;
  text-decoration: line-through;
}

.card-stats {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
  flex-wrap: wrap;
}

.card-stats .stat {
  font-size: 12px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-stats .stat i {
  color: #9ca3af;
}

.card-footer {
  padding: 10px 16px;
  background: #f8f6f4;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #9ca3af;
  flex-wrap: wrap;
  gap: 4px;
}

.card-id {
  font-weight: 500;
  color: #6b7280;
}

.card-sede {
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-sede i {
  font-size: 12px;
}

/* ============================================
   EMPTY STATE
   ============================================ */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 20px;
  background: #fff;
  border-radius: 16px;
  border: 2px dashed #e5e7eb;
}

.empty-state i {
  font-size: 48px;
  color: #d1d5db;
}

.empty-state h3 {
  font-size: 20px;
  color: #1a1a2e;
  margin: 16px 0 8px;
}

.empty-state p {
  color: #6b7280;
  margin: 0 0 20px;
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 768px) {
  .producto-container {
    padding: 16px;
  }

  .producto-header {
    padding: 20px;
    flex-direction: column;
    align-items: stretch;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-stats {
    width: 100%;
    justify-content: space-around;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .btn-primary {
    width: 100%;
    justify-content: center;
  }

  .filtros-section {
    flex-direction: column;
  }

  .search-box {
    min-width: auto;
  }

  .filter-group {
    flex-wrap: wrap;
  }

  .filter-select {
    flex: 1;
    min-width: 120px;
  }

  .productos-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .producto-container {
    padding: 12px;
  }

  .producto-header {
    padding: 16px;
  }

  .stat-card {
    padding: 6px 12px;
    min-width: 60px;
  }

  .stat-number {
    font-size: 16px;
  }

  .stat-label {
    font-size: 9px;
  }

  .productos-grid {
    grid-template-columns: 1fr;
  }

  .card-body {
    padding: 14px;
  }

  .card-title {
    font-size: 16px;
  }
}
</style>