<!-- src/views/restaurante/Mesa/MesaView.vue -->
<template>
  <div class="page-container">
    <!-- HEADER -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-title">
          <i class="bi bi-table"></i>
          <div>
            <h1>Mesas</h1>
            <p class="text-muted">Gestiona las mesas del restaurante</p>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn btn-outline-secondary" @click="loadData" title="Actualizar">
          <i class="bi bi-arrow-clockwise" :class="{ spin: loading }"></i>
        </button>
        <router-link to="/mesas/nuevo" class="btn btn-primary">
          <i class="bi bi-plus-circle"></i> Nueva Mesa
        </router-link>
      </div>
    </div>

    <!-- FILTROS -->
    <div class="filters-card">
      <div class="filter-group">
        <div class="filter-item">
          <label><i class="bi bi-search"></i> Buscar</label>
          <input 
            type="text" 
            v-model="filters.search" 
            placeholder="Número, ubicación..."
            @input="applyFilters"
            class="form-control"
          >
        </div>
        <div class="filter-item">
          <label><i class="bi bi-toggle-on"></i> Estado</label>
          <select v-model="filters.estado" @change="applyFilters" class="form-control">
            <option value="">Todos</option>
            <option value="true">Activas</option>
            <option value="false">Inactivas</option>
          </select>
        </div>
        <div class="filter-item">
          <label><i class="bi bi-building"></i> Sede</label>
          <select v-model="filters.sede_id" @change="applyFilters" class="form-control">
            <option value="">Todas</option>
            <option v-for="sede in sedes" :key="sede.id" :value="sede.id">
              {{ sede.nombre }}
            </option>
          </select>
        </div>
        <div class="filter-item">
          <label><i class="bi bi-person"></i> Capacidad</label>
          <select v-model="filters.capacidad" @change="applyFilters" class="form-control">
            <option value="">Todas</option>
            <option value="1">1 persona</option>
            <option value="2">2 personas</option>
            <option value="4">4 personas</option>
            <option value="6">6 personas</option>
            <option value="8">8 personas</option>
            <option value="10">10 personas</option>
            <option value="12">12+ personas</option>
          </select>
        </div>
        <button class="btn btn-outline-secondary" @click="clearFilters">
          <i class="bi bi-eraser"></i> Limpiar
        </button>
      </div>
    </div>

    <!-- ESTADÍSTICAS RÁPIDAS -->
    <div class="stats-row">
      <div class="stat-item">
        <div class="stat-icon bg-primary">
          <i class="bi bi-table"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ totalRecords }}</span>
          <span class="stat-label">Total Mesas</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon bg-success">
          <i class="bi bi-check-circle"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ mesasActivas }}</span>
          <span class="stat-label">Activas</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon bg-warning">
          <i class="bi bi-person"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ capacidadTotal }}</span>
          <span class="stat-label">Capacidad Total</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon bg-danger">
          <i class="bi bi-exclamation-triangle"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ mesasInactivas }}</span>
          <span class="stat-label">Inactivas</span>
        </div>
      </div>
    </div>

    <!-- TABLA -->
    <div class="table-card">
      <div class="table-responsive">
        <table class="table" v-if="!loading">
          <thead>
            <tr>
              <th>#</th>
              <th>Número</th>
              <th>Capacidad</th>
              <th>Ubicación</th>
              <th>Sede</th>
              <th>Estado</th>
              <th>QR</th>
              <th class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredItems" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="table-number">
                  <strong>Mesa {{ item.numero }}</strong>
                </div>
              </td>
              <td>
                <span class="badge badge-info">
                  <i class="bi bi-person"></i> {{ item.capacidad }}
                </span>
              </td>
              <td>
                <span class="location-text" v-if="item.ubicacion">
                  <i class="bi bi-geo-alt"></i> {{ item.ubicacion }}
                </span>
                <span v-else class="text-muted">N/A</span>
              </td>
              <td>{{ getSedeNombre(item.sede_id) }}</td>
              <td>
                <span class="badge" :class="getEstadoBadge(item.estado)">
                  <i class="bi" :class="getEstadoIcon(item.estado)"></i>
                  {{ getEstadoTexto(item.estado) }}
                </span>
              </td>
              <td>
                <button 
                  v-if="item.codigo_qr" 
                  class="btn btn-icon btn-primary btn-sm" 
                  @click="verQR(item)"
                  title="Ver código QR"
                >
                  <i class="bi bi-qr-code"></i>
                </button>
                <span v-else class="text-muted">N/A</span>
              </td>
              <td class="text-end">
                <div class="btn-group">
                  <button 
                    @click="toggleStatus(item)" 
                    class="btn btn-icon" 
                    :class="item.activo ? 'btn-warning' : 'btn-success'"
                    :title="item.activo ? 'Desactivar' : 'Activar'"
                  >
                    <i class="bi" :class="item.activo ? 'bi-toggle-on' : 'bi-toggle-off'"></i>
                  </button>
                  <router-link 
                    :to="`/mesas/${item.id}`" 
                    class="btn btn-icon btn-primary"
                    title="Ver detalle"
                  >
                    <i class="bi bi-eye"></i>
                  </router-link>
                  <router-link 
                    :to="`/mesas/${item.id}/editar`" 
                    class="btn btn-icon btn-info"
                    title="Editar"
                  >
                    <i class="bi bi-pencil"></i>
                  </router-link>
                  <button 
                    @click="eliminar(item)" 
                    class="btn btn-icon btn-danger"
                    title="Eliminar"
                  >
                    <i class="bi bi-trash3"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!filteredItems.length">
              <td colspan="8" class="text-center py-5">
                <i class="bi bi-inbox fs-1 d-block text-muted"></i>
                <p class="text-muted mt-2">No hay mesas registradas</p>
                <router-link to="/mesas/nuevo" class="btn btn-primary mt-2">
                  <i class="bi bi-plus-circle"></i> Crear primera mesa
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="loading" class="text-center py-5">
          <div class="spinner"></div>
          <p class="text-muted mt-2">Cargando mesas...</p>
        </div>
      </div>
    </div>

    <!-- MODAL QR -->
    <div v-if="showQRModal" class="modal-overlay" @click.self="closeQRModal">
      <div class="modal modal-qr">
        <div class="modal-header">
          <h3><i class="bi bi-qr-code text-primary"></i> Código QR - Mesa {{ qrItem?.numero }}</h3>
          <button class="modal-close" @click="closeQRModal">×</button>
        </div>
        <div class="modal-body text-center">
          <div class="qr-container">
            <img 
              v-if="qrImage" 
              :src="qrImage" 
              alt="Código QR" 
              class="qr-image"
            >
            <div v-else class="qr-loading">
              <div class="spinner"></div>
              <p class="text-muted mt-2">Generando código QR...</p>
            </div>
          </div>
          <div class="qr-info">
            <p><strong>Código:</strong> {{ qrItem?.codigo_qr }}</p>
            <p class="text-muted">Escanea este código QR para acceder a la mesa</p>
            <button class="btn btn-primary" @click="descargarQR">
              <i class="bi bi-download"></i> Descargar QR
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeQRModal">Cerrar</button>
        </div>
      </div>
    </div>

    <!-- MODAL ELIMINAR -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3><i class="bi bi-exclamation-triangle text-danger"></i> Confirmar Eliminación</h3>
          <button class="modal-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="modal-icon">
            <i class="bi bi-trash3 text-danger"></i>
          </div>
          <p>
            ¿Está seguro que desea eliminar la mesa 
            <strong>"Mesa {{ itemAEliminar?.numero }}"</strong>?
          </p>
          <div class="modal-warning">
            <p>
              <i class="bi bi-exclamation-circle"></i>
              Esta acción no se puede deshacer y eliminará permanentemente la mesa.
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">Cancelar</button>
          <button class="btn btn-danger" @click="confirmDelete" :disabled="deleting">
            <i class="bi" :class="deleting ? 'bi-arrow-repeat spin' : 'bi-trash3'"></i>
            {{ deleting ? 'Eliminando...' : 'Sí, Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { MesasAPI, SedesAPI } from '@/services/api'
import Swal from 'sweetalert2'
import QRCode from 'qrcode'

// ===== STATE =====
const items = ref([])
const sedes = ref([])
const loading = ref(false)
const deleting = ref(false)
const totalRecords = ref(0)
const showDeleteModal = ref(false)
const showQRModal = ref(false)
const itemAEliminar = ref(null)
const qrItem = ref(null)
const qrImage = ref('')

// ===== FILTERS =====
const filters = reactive({
  search: '',
  estado: '',
  sede_id: '',
  capacidad: ''
})

// ===== COMPUTED =====
const mesasActivas = computed(() => items.value.filter(m => m.activo).length)
const mesasInactivas = computed(() => items.value.filter(m => !m.activo).length)
const capacidadTotal = computed(() => items.value.reduce((sum, m) => sum + (m.capacidad || 0), 0))

const filteredItems = computed(() => {
  let result = [...items.value]
  
  if (filters.search) {
    const search = filters.search.toLowerCase()
    result = result.filter(m => 
      m.numero?.toString().includes(search) ||
      m.ubicacion?.toLowerCase().includes(search)
    )
  }
  
  if (filters.estado !== '') {
    result = result.filter(m => m.activo === (filters.estado === 'true'))
  }
  
  if (filters.sede_id) {
    result = result.filter(m => m.sede_id === parseInt(filters.sede_id))
  }
  
  if (filters.capacidad) {
    const cap = parseInt(filters.capacidad)
    if (cap >= 12) {
      result = result.filter(m => m.capacidad >= 12)
    } else {
      result = result.filter(m => m.capacidad === cap)
    }
  }
  
  return result
})

// ===== ESTADOS DE MESA =====
const estadosMesa = {
  'Disponible': { badge: 'badge-success', icon: 'bi-check-circle', texto: 'Disponible' },
  'Ocupada': { badge: 'badge-danger', icon: 'bi-person-fill', texto: 'Ocupada' },
  'Reservada': { badge: 'badge-warning', icon: 'bi-clock', texto: 'Reservada' },
  'Mantenimiento': { badge: 'badge-secondary', icon: 'bi-tools', texto: 'Mantenimiento' }
}

function getEstadoBadge(estado) {
  return estadosMesa[estado]?.badge || 'badge-secondary'
}

function getEstadoIcon(estado) {
  return estadosMesa[estado]?.icon || 'bi-circle'
}

function getEstadoTexto(estado) {
  return estadosMesa[estado]?.texto || estado || 'N/A'
}

// ===== METHODS =====
async function loadData() {
  loading.value = true
  try {
    const res = await MesasAPI.list()
    
    if (res.data && res.data.success && Array.isArray(res.data.data)) {
      items.value = res.data.data
      totalRecords.value = res.data.data.length
    } else if (Array.isArray(res.data)) {
      items.value = res.data
      totalRecords.value = res.data.length
    } else {
      items.value = []
      totalRecords.value = 0
    }
  } catch (error) {
    console.error('Error cargando mesas:', error)
    Swal.fire('Error', 'No se pudieron cargar las mesas', 'error')
    items.value = []
    totalRecords.value = 0
  } finally {
    loading.value = false
  }
}

async function loadSedes() {
  try {
    const res = await SedesAPI.list()
    sedes.value = res.data.data || []
  } catch (error) {
    console.error('Error cargando sedes:', error)
  }
}

function getSedeNombre(id) {
  const sede = sedes.value.find(s => s.id === id)
  return sede ? sede.nombre : 'N/A'
}

function applyFilters() {
  // Los filtros se aplican automáticamente en filteredItems
}

function clearFilters() {
  filters.search = ''
  filters.estado = ''
  filters.sede_id = ''
  filters.capacidad = ''
}

async function toggleStatus(item) {
  const confirm = await Swal.fire({
    title: `${item.activo ? 'Desactivar' : 'Activar'} mesa`,
    text: `¿Está seguro de ${item.activo ? 'desactivar' : 'activar'} la Mesa ${item.numero}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar'
  })
  
  if (confirm.isConfirmed) {
    try {
      await MesasAPI.toggleStatus(item.id)
      await loadData()
      Swal.fire('Éxito', `Mesa ${item.activo ? 'desactivada' : 'activada'} correctamente`, 'success')
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'No se pudo cambiar el estado', 'error')
    }
  }
}

// ===== GENERAR Y VER QR =====
async function verQR(item) {
  qrItem.value = item
  showQRModal.value = true
  qrImage.value = ''
  
  try {
    // Generar QR como imagen base64
    const qrData = JSON.stringify({
      mesa: item.numero,
      sede: item.sede_id,
      id: item.id
    })
    
    qrImage.value = await QRCode.toDataURL(qrData, {
      width: 300,
      margin: 2,
      color: {
        dark: '#1a1a2e',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
  } catch (error) {
    console.error('Error generando QR:', error)
    Swal.fire('Error', 'No se pudo generar el código QR', 'error')
  }
}

function closeQRModal() {
  showQRModal.value = false
  qrItem.value = null
  qrImage.value = ''
}

function descargarQR() {
  if (!qrImage.value) return
  
  const link = document.createElement('a')
  link.download = `QR-Mesa-${qrItem.value?.numero}.png`
  link.href = qrImage.value
  link.click()
}

function eliminar(item) {
  itemAEliminar.value = item
  showDeleteModal.value = true
}

function closeModal() {
  showDeleteModal.value = false
  itemAEliminar.value = null
  deleting.value = false
}

async function confirmDelete() {
  if (!itemAEliminar.value) return
  
  deleting.value = true
  try {
    await MesasAPI.remove(itemAEliminar.value.id)
    await loadData()
    closeModal()
    Swal.fire('Eliminado', 'Mesa eliminada correctamente', 'success')
  } catch (error) {
    Swal.fire('Error', error.response?.data?.message || 'No se pudo eliminar la mesa', 'error')
  } finally {
    deleting.value = false
  }
}

// ===== LIFECYCLE =====
onMounted(() => {
  loadSedes()
  loadData()
})
</script>

<style scoped>
/* ============================================
   PAGE CONTAINER
   ============================================ */
.page-container {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* ============================================
   HEADER
   ============================================ */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
  background: #ffffff;
  padding: 20px 24px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-title i {
  font-size: 32px;
  color: #2F6FED;
  background: #e8eeff;
  padding: 12px;
  border-radius: 12px;
}

.header-title h1 {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.header-title .text-muted {
  color: #6b7280;
  font-size: 14px;
  margin: 2px 0 0;
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

/* ============================================
   FILTERS
   ============================================ */
.filters-card {
  background: #ffffff;
  padding: 16px 20px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: flex-end;
}

.filter-item {
  flex: 1;
  min-width: 150px;
  max-width: 250px;
}

.filter-item label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  display: block;
  margin-bottom: 4px;
}

.filter-item label i {
  font-size: 12px;
  margin-right: 4px;
}

/* ============================================
   STATS ROW
   ============================================ */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-item {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px 20px;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.2s ease;
}

.stat-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon i {
  font-size: 22px;
  color: #ffffff;
}

.stat-icon.bg-primary { background: #2F6FED; }
.stat-icon.bg-success { background: #22c55e; }
.stat-icon.bg-warning { background: #d97706; }
.stat-icon.bg-danger { background: #dc2626; }

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
}

/* ============================================
   TABLE
   ============================================ */
.table-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.table-responsive {
  overflow-x: auto;
}

.table {
  margin: 0;
  width: 100%;
  border-collapse: collapse;
}

.table thead {
  background: #f8fafc;
}

.table thead th {
  padding: 12px 16px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.table tbody td {
  padding: 12px 16px;
  vertical-align: middle;
  border-bottom: 1px solid #f3f4f6;
  font-size: 14px;
  color: #374151;
}

.table tbody tr:hover {
  background: #f9fafb;
}

.table tbody tr:last-child td {
  border-bottom: none;
}

/* ============================================
   TABLE NUMBER
   ============================================ */
.table-number strong {
  font-size: 15px;
  color: #111827;
}

.location-text {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #374151;
}

/* ============================================
   BADGES
   ============================================ */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.badge-success {
  background: #dcfce7;
  color: #16a34a;
}

.badge-danger {
  background: #fecaca;
  color: #dc2626;
}

.badge-warning {
  background: #fef3c7;
  color: #d97706;
}

.badge-primary {
  background: #dbeafe;
  color: #2563eb;
}

.badge-info {
  background: #cffafe;
  color: #0891b2;
}

.badge-secondary {
  background: #f3f4f6;
  color: #6b7280;
}

/* ============================================
   BUTTONS
   ============================================ */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 9px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  font-family: inherit;
  white-space: nowrap;
}

.btn-primary {
  background: #2F6FED;
  color: #ffffff;
}

.btn-primary:hover {
  background: #1a5adf;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(47, 111, 237, 0.3);
}

.btn-outline-secondary {
  background: transparent;
  color: #6b7280;
  border: 1.5px solid #d1d5db;
}

.btn-outline-secondary:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn-icon {
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: transparent;
  color: #6b7280;
  transition: all 0.2s ease;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.btn-icon:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-icon.btn-primary {
  color: #2F6FED;
  border-color: #dbeafe;
}

.btn-icon.btn-primary:hover:not(:disabled) {
  background: #dbeafe;
  border-color: #2F6FED;
}

.btn-icon.btn-warning {
  color: #d97706;
  border-color: #fef3c7;
}

.btn-icon.btn-warning:hover:not(:disabled) {
  background: #fef3c7;
  border-color: #d97706;
}

.btn-icon.btn-info {
  color: #0891b2;
  border-color: #cffafe;
}

.btn-icon.btn-info:hover:not(:disabled) {
  background: #cffafe;
  border-color: #0891b2;
}

.btn-icon.btn-success {
  color: #16a34a;
  border-color: #dcfce7;
}

.btn-icon.btn-success:hover:not(:disabled) {
  background: #dcfce7;
  border-color: #16a34a;
}

.btn-icon.btn-danger {
  color: #dc2626;
  border-color: #fecaca;
}

.btn-icon.btn-danger:hover:not(:disabled) {
  background: #fecaca;
  border-color: #dc2626;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 13px;
  width: 28px;
  height: 28px;
}

.btn-danger {
  background: #dc2626;
  color: #ffffff;
}

.btn-danger:hover:not(:disabled) {
  background: #b91c1c;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover {
  background: #d1d5db;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-group {
  display: inline-flex;
  gap: 4px;
  align-items: center;
}

/* ============================================
   FORM CONTROLS
   ============================================ */
.form-control {
  width: 100%;
  padding: 8px 14px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s ease;
  background: #ffffff;
  color: #111827;
}

.form-control:focus {
  outline: none;
  border-color: #2F6FED;
  box-shadow: 0 0 0 3px rgba(47, 111, 237, 0.08);
}

.form-control::placeholder {
  color: #9ca3af;
}

/* ============================================
   MODAL
   ============================================ */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
  backdrop-filter: blur(4px);
}

.modal {
  background: #ffffff;
  border-radius: 16px;
  max-width: 450px;
  width: 92%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease;
}

.modal-qr {
  max-width: 500px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-close {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #6b7280;
  padding: 0 8px;
  line-height: 1;
  transition: color 0.2s;
}

.modal-close:hover {
  color: #111827;
}

.modal-body {
  padding: 24px;
  text-align: center;
}

.modal-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.modal-body p {
  margin: 0 0 12px;
  font-size: 15px;
  color: #374151;
  line-height: 1.6;
}

.modal-body strong {
  color: #111827;
}

.modal-warning {
  background: #fef3c7;
  border: 1px solid #fcd34d;
  border-radius: 8px;
  padding: 12px 16px;
  margin-top: 12px;
}

.modal-warning p {
  margin: 0;
  color: #92400e;
  font-size: 14px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
}

/* ============================================
   QR MODAL
   ============================================ */
.qr-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  border: 2px dashed #e5e7eb;
  min-height: 200px;
}

.qr-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.qr-loading {
  text-align: center;
}

.qr-info {
  margin-top: 16px;
}

.qr-info p {
  margin: 4px 0;
}

/* ============================================
   SPINNER
   ============================================ */
.spin {
  animation: spin 1s linear infinite;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #2F6FED;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from {
    transform: translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* ============================================
   TEXT UTILITIES
   ============================================ */
.text-muted { color: #6b7280; }
.text-danger { color: #dc2626; }
.text-success { color: #16a34a; }
.text-warning { color: #d97706; }
.text-end { text-align: right; }
.text-center { text-align: center; }

.d-block { display: block; }
.fs-1 { font-size: 36px; }
.mt-2 { margin-top: 8px; }
.py-5 { padding: 48px 0; }

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 1024px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .filter-item {
    min-width: 120px;
    max-width: 200px;
  }
}

@media (max-width: 768px) {
  .page-container {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
  }

  .header-title h1 {
    font-size: 18px;
  }

  .header-actions {
    justify-content: stretch;
  }

  .header-actions .btn {
    flex: 1;
    justify-content: center;
  }

  .filter-group {
    flex-direction: column;
  }

  .filter-item {
    min-width: 100%;
    max-width: 100%;
  }

  .stats-row {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .stat-item {
    padding: 12px 16px;
  }

  .stat-value {
    font-size: 20px;
  }

  .modal {
    width: 95%;
  }

  .modal-qr {
    max-width: 95%;
  }

  .btn-group {
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .btn-icon {
    width: 28px;
    height: 28px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .stats-row {
    grid-template-columns: 1fr;
  }

  .header-title i {
    font-size: 24px;
    padding: 8px;
  }

  .header-title h1 {
    font-size: 16px;
  }

  .table thead th {
    font-size: 10px;
    padding: 8px 10px;
  }

  .table tbody td {
    font-size: 13px;
    padding: 8px 10px;
  }

  .badge {
    font-size: 10px;
    padding: 2px 8px;
  }

  .btn {
    font-size: 13px;
    padding: 7px 14px;
  }

  .qr-container {
    min-height: 150px;
    padding: 12px;
  }
}
</style>