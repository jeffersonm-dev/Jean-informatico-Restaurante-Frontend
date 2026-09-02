<!-- src/views/restaurante/Categoria/CategoriaView.vue -->
<template>
  <div class="categoria-container">
    <!-- Header -->
    <div class="categoria-header">
      <div class="header-content">
        <div class="header-title">
          <div class="title-icon">
            <i class="bi bi-tags"></i>
          </div>
          <div>
            <h1>Categorías</h1>
            <p class="subtitle">Gestiona las categorías de tu restaurante</p>
          </div>
        </div>
        <div class="header-stats">
          <div class="stat-card">
            <span class="stat-number">{{ categorias.length }}</span>
            <span class="stat-label">Total Categorías</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">{{ categoriasActivas }}</span>
            <span class="stat-label">Activas</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">{{ categoriasInactivas }}</span>
            <span class="stat-label">Inactivas</span>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn-primary" @click="abrirModalNuevo">
          <i class="bi bi-plus-circle"></i>
          Nueva Categoría
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
          placeholder="Buscar categoría por nombre..."
          @input="filtrarCategorias"
        />
      </div>
      <div class="filter-group">
        <select class="filter-select" v-model="filtros.estado" @change="filtrarCategorias">
          <option value="">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
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
      <p>Cargando categorías...</p>
    </div>

    <!-- Grid de Categorías -->
    <div v-else class="categorias-grid">
      <div v-if="categoriasFiltradas.length === 0" class="empty-state">
        <i class="bi bi-tags"></i>
        <h3>No hay categorías registradas</h3>
        <p>Comienza creando tu primera categoría</p>
        <button class="btn-primary" @click="abrirModalNuevo">
          <i class="bi bi-plus-circle"></i>
          Crear primera categoría
        </button>
      </div>

      <!-- Categorías -->
      <div 
        v-for="categoria in categoriasFiltradas" 
        :key="categoria.id" 
        class="categoria-card"
        :class="{ inactive: !categoria.activo }"
      >
        <div class="card-header">
          <div class="card-status">
            <span class="status-dot" :class="categoria.activo ? 'active' : 'inactive'"></span>
            <span class="status-label">{{ categoria.activo ? 'Activo' : 'Inactivo' }}</span>
            <span v-if="categoria.padre_id === 0" class="badge-padre">Principal</span>
            <span v-else class="badge-sub">Subcategoría</span>
          </div>
          <div class="card-actions">
            <button class="icon-btn edit" @click="abrirModalEditar(categoria)" title="Editar">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="icon-btn view" @click="verCategoria(categoria.id)" title="Ver detalle">
              <i class="bi bi-eye"></i>
            </button>
            <button 
              class="icon-btn toggle" 
              :class="categoria.activo ? 'danger' : 'success'"
              @click="toggleEstado(categoria)" 
              :title="categoria.activo ? 'Desactivar' : 'Activar'"
            >
              <i :class="categoria.activo ? 'bi bi-toggle-off' : 'bi bi-toggle-on'"></i>
            </button>
          </div>
        </div>

        <div class="card-body">
          <div class="card-icon">
            <i :class="categoria.icono || 'bi bi-tag'"></i>
          </div>
          <h3 class="card-title">{{ categoria.nombre }}</h3>
          <p class="card-desc">{{ categoria.descripcion || 'Sin descripción' }}</p>
          
          <div class="card-stats">
            <span class="stat">
              <i class="bi bi-box"></i>
              {{ categoria.total_productos || 0 }} productos
            </span>
            <span class="stat" v-if="categoria.subcategorias_count !== undefined">
              <i class="bi bi-diagram-2"></i>
              {{ categoria.subcategorias_count || 0 }} subcategorías
            </span>
          </div>
        </div>

        <div class="card-footer">
          <span class="card-id">ID: #{{ categoria.id }}</span>
          <span class="card-sede" v-if="categoria.sede_id">
            <i class="bi bi-building"></i>
            Sede: {{ obtenerNombreSede(categoria.sede_id) }}
          </span>
          <span class="card-date">{{ formatearFechaCorta(categoria.fecha_creacion) }}</span>
        </div>
      </div>
    </div>

    <!-- ============================================
         MODAL NUEVO / EDITAR
    ============================================ -->
    <CategoriaFormModal 
      :show="mostrarModal"
      :editando="isEditando"
      :categoria="categoriaSeleccionada"
      :sedes="sedes"
      :categorias="categorias"
      @close="cerrarModal"
      @save="onSave"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { CategoriasAPI, SedesAPI } from '@/services/api'
import Swal from 'sweetalert2'
import CategoriaFormModal from './CategoriaFormModal.vue'

// ============================================
// STATE
// ============================================
const cargando = ref(false)
const categorias = ref([])
const sedes = ref([])
const isEditando = ref(false)
const categoriaSeleccionada = ref(null)
const mostrarModal = ref(false)

const filtros = ref({
  buscar: '',
  estado: ''
})

// ============================================
// COMPUTED
// ============================================
const categoriasActivas = computed(() => categorias.value.filter(c => c.activo).length)
const categoriasInactivas = computed(() => categorias.value.filter(c => !c.activo).length)

const categoriasFiltradas = computed(() => {
  let resultado = [...categorias.value]

  if (filtros.value.buscar) {
    const busq = filtros.value.buscar.toLowerCase()
    resultado = resultado.filter(c =>
      c.nombre?.toLowerCase().includes(busq) ||
      c.descripcion?.toLowerCase().includes(busq)
    )
  }

  if (filtros.value.estado) {
    const activo = filtros.value.estado === 'activo'
    resultado = resultado.filter(c => c.activo === activo)
  }

  return resultado
})

// ============================================
// MÉTODOS
// ============================================
const cargarCategorias = async () => {
  cargando.value = true
  try {
    const response = await CategoriasAPI.list()
    if (response.data.success) {
      categorias.value = response.data.data || []
    }
  } catch (error) {
    console.error('❌ Error al cargar categorías:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error de conexión',
      text: 'No se pudieron cargar las categorías.'
    })
  } finally {
    cargando.value = false
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

const obtenerNombreSede = (sedeId) => {
  const sede = sedes.value.find(s => s.id === sedeId)
  return sede ? sede.nombre : 'Sin sede'
}

const filtrarCategorias = () => {}

const limpiarFiltros = () => {
  filtros.value = {
    buscar: '',
    estado: ''
  }
}

const abrirModalNuevo = () => {
  isEditando.value = false
  categoriaSeleccionada.value = null
  mostrarModal.value = true
}

const abrirModalEditar = (categoria) => {
  isEditando.value = true
  categoriaSeleccionada.value = categoria
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  categoriaSeleccionada.value = null
}

const onSave = async () => {
  await cargarCategorias()
}

const verCategoria = (id) => {
  const categoria = categorias.value.find(c => c.id === id)
  if (categoria) {
    const nombrePadre = categoria.padre_id 
      ? categorias.value.find(c => c.id === categoria.padre_id)?.nombre || 'Ninguna'
      : 'Ninguna (Principal)'
    
    Swal.fire({
      title: categoria.nombre,
      html: `
        <div style="text-align: left;">
          <p><strong>ID:</strong> #${categoria.id}</p>
          <p><strong>Descripción:</strong> ${categoria.descripcion || 'Sin descripción'}</p>
          <p><strong>Icono:</strong> <i class="${categoria.icono || 'bi bi-tag'}"></i> ${categoria.icono || 'Ninguno'}</p>
          <p><strong>Estado:</strong> ${categoria.activo ? '✅ Activo' : '❌ Inactivo'}</p>
          <p><strong>Categoría Padre:</strong> ${nombrePadre}</p>
          <p><strong>Orden:</strong> ${categoria.orden || 0}</p>
          <p><strong>Productos:</strong> ${categoria.total_productos || 0}</p>
          <p><strong>Subcategorías:</strong> ${categoria.subcategorias_count || 0}</p>
          <p><strong>Sede:</strong> ${obtenerNombreSede(categoria.sede_id)}</p>
          <p><strong>Fecha creación:</strong> ${formatearFecha(categoria.fecha_creacion)}</p>
        </div>
      `,
      confirmButtonColor: '#E85D3A',
      confirmButtonText: 'Cerrar'
    })
  }
}

const toggleEstado = async (categoria) => {
  const estadoTexto = categoria.activo ? 'desactivar' : 'activar'
  const result = await Swal.fire({
    title: `¿${estadoTexto === 'desactivar' ? 'Desactivar' : 'Activar'} categoría?`,
    text: `¿Estás seguro de ${estadoTexto} la categoría "${categoria.nombre}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: categoria.activo ? '#dc3545' : '#28a745',
    confirmButtonText: `Sí, ${estadoTexto}`,
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    try {
      const response = await CategoriasAPI.toggleStatus(categoria.id)
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Estado actualizado',
          timer: 1500,
          showConfirmButton: false
        })
        await cargarCategorias()
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cambiar el estado de la categoría'
      })
    }
  }
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
})
</script>

<style scoped>
/* ============================================
   CONTAINER
   ============================================ */
.categoria-container {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* ============================================
   HEADER
   ============================================ */
.categoria-header {
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

.categoria-header::before {
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
   CATEGORIAS GRID
   ============================================ */
.categorias-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* ============================================
   CATEGORIA CARD
   ============================================ */
.categoria-card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.categoria-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
  border-color: #d1d5db;
}

.categoria-card.inactive {
  opacity: 0.7;
}

.categoria-card.inactive .card-title {
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

.badge-padre {
  background: #dbeafe;
  color: #2563eb;
  font-size: 10px;
  padding: 2px 10px;
  border-radius: 12px;
  font-weight: 600;
}

.badge-sub {
  background: #fef3c7;
  color: #d97706;
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

.card-icon {
  width: 56px;
  height: 56px;
  background: rgba(232, 93, 58, 0.08);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  font-size: 24px;
  color: #E85D3A;
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

.card-stats {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
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
  .categoria-container {
    padding: 16px;
  }

  .categoria-header {
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

  .categorias-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .categoria-container {
    padding: 12px;
  }

  .categoria-header {
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

  .categorias-grid {
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