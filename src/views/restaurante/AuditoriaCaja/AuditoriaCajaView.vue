<!-- src/views/restaurante/AuditoriaCaja/AuditoriaCajaView.vue -->
<template>
  <div class="page-container">
    <!-- HEADER -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-title">
          <i class="bi bi-cash-stack"></i>
          <div>
            <h1>Auditoría de Caja</h1>
            <p class="text-muted">Gestiona las aperturas y cierres de caja</p>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn btn-outline-secondary" @click="loadData" title="Actualizar">
          <i class="bi bi-arrow-clockwise" :class="{ spin: loading }"></i>
        </button>
        <button class="btn btn-success" @click="$router.push('/auditoria-caja/abrir')" v-if="!cajaAbierta">
          <i class="bi bi-plus-circle"></i> Abrir Caja
        </button>
        <button class="btn btn-warning" @click="$router.push(`/auditoria-caja/${cajaActual?.id}/cerrar`)" v-if="cajaAbierta">
          <i class="bi bi-x-circle"></i> Cerrar Caja
        </button>
      </div>
    </div>

    <!-- ALERTA DE CAJA ABIERTA -->
    <div v-if="cajaAbierta" class="alert-card alert-success">
      <div class="alert-icon">
        <i class="bi bi-check-circle-fill"></i>
      </div>
      <div class="alert-content">
        <h4>Caja Abierta</h4>
        <p>
          Caja abierta el {{ formatearFechaCompleta(cajaActual?.fecha_apertura) }} 
          por {{ cajaActual?.usuario_apertura_nombre || 'Usuario' }}
          <span class="badge badge-success ms-2">Monto Inicial: S/ {{ formatCurrency(cajaActual?.monto_inicial) }}</span>
        </p>
      </div>
      <div class="alert-actions">
        <button class="btn btn-warning btn-sm" @click="$router.push(`/auditoria-caja/${cajaActual?.id}/cerrar`)">
          <i class="bi bi-x-circle"></i> Cerrar Caja
        </button>
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
            placeholder="Usuario, sede..."
            @input="applyFilters"
            class="form-control"
          >
        </div>
        <div class="filter-item">
          <label><i class="bi bi-tag"></i> Estado</label>
          <select v-model="filters.estado" @change="applyFilters" class="form-control">
            <option value="">Todos</option>
            <option value="Abierta">Abierta</option>
            <option value="Cerrada">Cerrada</option>
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
        <button class="btn btn-outline-secondary" @click="clearFilters">
          <i class="bi bi-eraser"></i> Limpiar
        </button>
      </div>
    </div>

    <!-- ESTADÍSTICAS RÁPIDAS -->
    <div class="stats-row">
      <div class="stat-item">
        <div class="stat-icon bg-primary">
          <i class="bi bi-cash-stack"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ totalRecords }}</span>
          <span class="stat-label">Total Auditorías</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon bg-success">
          <i class="bi bi-check-circle"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ auditoriasAbiertas }}</span>
          <span class="stat-label">Cajas Abiertas</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon bg-danger">
          <i class="bi bi-x-circle"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ auditoriasCerradas }}</span>
          <span class="stat-label">Cajas Cerradas</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon bg-warning">
          <i class="bi bi-cash"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">S/ {{ formatCurrency(montoTotalCajas) }}</span>
          <span class="stat-label">Monto Total</span>
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
              <th>Sede</th>
              <th>Usuario Apertura</th>
              <th>Usuario Cierre</th>
              <th>Monto Inicial</th>
              <th>Monto Real</th>
              <th>Diferencia</th>
              <th>Estado</th>
              <th>Fecha Apertura</th>
              <th>Fecha Cierre</th>
              <th class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredItems" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>{{ item.sede_nombre || item.sede_id || 'N/A' }}</td>
              <td>{{ item.usuario_apertura_nombre || item.usuario_apertura || 'N/A' }}</td>
              <td>{{ item.usuario_cierre_nombre || item.usuario_cierre || 'N/A' }}</td>
              <td>S/ {{ formatCurrency(item.monto_inicial) }}</td>
              <td>S/ {{ formatCurrency(item.monto_real) }}</td>
              <td>
                <span :class="calcularDiferencia(item) >= 0 ? 'text-success' : 'text-danger'">
                  S/ {{ formatCurrency(calcularDiferencia(item)) }}
                </span>
              </td>
              <td>
                <span class="badge" :class="item.estado === 'Abierta' ? 'badge-success' : 'badge-secondary'">
                  <i :class="item.estado === 'Abierta' ? 'bi-check-circle' : 'bi-x-circle'"></i>
                  {{ item.estado }}
                </span>
              </td>
              <td>{{ formatearFecha(item.fecha_apertura) }}</td>
              <td>{{ item.fecha_cierre ? formatearFecha(item.fecha_cierre) : '-' }}</td>
              <td class="text-end">
                <div class="btn-group">
                  <router-link 
                    :to="`/auditoria-caja/${item.id}`" 
                    class="btn btn-icon btn-primary"
                    title="Ver detalle"
                  >
                    <i class="bi bi-eye"></i>
                  </router-link>
                  <button 
                    v-if="item.estado === 'Abierta'"
                    @click="$router.push(`/auditoria-caja/${item.id}/cerrar`)" 
                    class="btn btn-icon btn-warning"
                    title="Cerrar caja"
                  >
                    <i class="bi bi-x-circle"></i>
                  </button>
                  <button 
                    @click="eliminarAuditoria(item)" 
                    class="btn btn-icon btn-danger"
                    title="Eliminar"
                    v-if="item.estado === 'Cerrada'"
                  >
                    <i class="bi bi-trash3"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!filteredItems.length">
              <td colspan="11" class="text-center py-5">
                <i class="bi bi-inbox fs-1 d-block text-muted"></i>
                <p class="text-muted mt-2">No hay auditorías de caja registradas</p>
                <button class="btn btn-success mt-2" @click="$router.push('/auditoria-caja/abrir')" v-if="!cajaAbierta">
                  <i class="bi bi-plus-circle"></i> Abrir primera caja
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="loading" class="text-center py-5">
          <div class="spinner"></div>
          <p class="text-muted mt-2">Cargando auditorías...</p>
        </div>
      </div>
    </div>

    <!-- MODAL ELIMINAR -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
      <div class="modal">
        <div class="modal-header">
          <h3><i class="bi bi-exclamation-triangle text-danger"></i> Confirmar Eliminación</h3>
          <button class="modal-close" @click="closeDeleteModal">×</button>
        </div>
        <div class="modal-body">
          <div class="modal-icon">
            <i class="bi bi-trash3 text-danger"></i>
          </div>
          <p>
            ¿Está seguro que desea eliminar la auditoría de caja 
            <strong>#{{ itemAEliminar?.id }}</strong>?
          </p>
          <div class="modal-warning">
            <p>
              <i class="bi bi-exclamation-circle"></i>
              Esta acción no se puede deshacer.
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeDeleteModal">Cancelar</button>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { AuditoriaCajaAPI, SedesAPI } from '@/services/api'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()

// ===== STATE =====
const items = ref([])
const sedes = ref([])
const loading = ref(false)
const deleting = ref(false)
const totalRecords = ref(0)
const itemAEliminar = ref(null)
const showDeleteModal = ref(false)
const cajaActual = ref(null)
const cajaAbierta = ref(false)

// ===== FILTERS =====
const filters = reactive({
  search: '',
  estado: '',
  sede_id: ''
})

// ===== COMPUTED =====
const auditoriasAbiertas = computed(() => items.value.filter(i => i.estado === 'Abierta').length)
const auditoriasCerradas = computed(() => items.value.filter(i => i.estado === 'Cerrada').length)
const montoTotalCajas = computed(() => items.value.reduce((sum, i) => sum + (i.monto_inicial || 0), 0))

const filteredItems = computed(() => {
  let result = [...items.value]

  if (filters.search) {
    const search = filters.search.toLowerCase()
    result = result.filter(i =>
      i.usuario_apertura_nombre?.toLowerCase().includes(search) ||
      i.usuario_cierre_nombre?.toLowerCase().includes(search) ||
      i.sede_nombre?.toLowerCase().includes(search)
    )
  }

  if (filters.estado) {
    result = result.filter(i => i.estado === filters.estado)
  }

  if (filters.sede_id) {
    result = result.filter(i => i.sede_id === parseInt(filters.sede_id))
  }

  return result
})

// ===== METHODS =====
function calcularDiferencia(item) {
  return (item.monto_real || 0) - (item.monto_inicial || 0)
}

async function loadData() {
  loading.value = true
  try {
    const res = await AuditoriaCajaAPI.list()
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
    console.error('Error cargando auditorías:', error)
    Swal.fire('Error', 'No se pudieron cargar las auditorías', 'error')
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

async function verificarCajaActual() {
  try {
    // Obtener la primera sede (o la seleccionada)
    const sedeId = filters.sede_id || sedes.value[0]?.id
    if (!sedeId) return

    const res = await AuditoriaCajaAPI.hasAbierta(sedeId)
    if (res.data && res.data.success) {
      cajaAbierta.value = res.data.data?.has_abierta || false
      if (cajaAbierta.value) {
        const actualRes = await AuditoriaCajaAPI.getActual(sedeId)
        if (actualRes.data && actualRes.data.success) {
          cajaActual.value = actualRes.data.data
        }
      }
    }
  } catch (error) {
    console.error('Error verificando caja actual:', error)
  }
}

function getEstadoClass(estado) {
  return estado === 'Abierta' ? 'badge-success' : 'badge-secondary'
}

function formatCurrency(value) {
  if (value === null || value === undefined) return '0.00'
  return new Intl.NumberFormat('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

function formatearFecha(fecha) {
  if (!fecha) return 'N/A'
  try {
    const d = new Date(fecha)
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return fecha
  }
}

function formatearFechaCompleta(fecha) {
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

function applyFilters() {
  verificarCajaActual()
}

function clearFilters() {
  filters.search = ''
  filters.estado = ''
  filters.sede_id = ''
  verificarCajaActual()
}

function eliminarAuditoria(item) {
  if (item.estado === 'Abierta') {
    Swal.fire('Error', 'No se puede eliminar una caja abierta', 'error')
    return
  }
  itemAEliminar.value = item
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  itemAEliminar.value = null
  deleting.value = false
}

async function confirmDelete() {
  if (!itemAEliminar.value) return

  deleting.value = true
  try {
    await AuditoriaCajaAPI.remove(itemAEliminar.value.id)
    await loadData()
    closeDeleteModal()
    Swal.fire('Eliminado', 'Auditoría eliminada correctamente', 'success')
  } catch (error) {
    const msg = error.response?.data?.message || 'No se pudo eliminar la auditoría'
    Swal.fire('Error', msg, 'error')
  } finally {
    deleting.value = false
  }
}

// ===== LIFECYCLE =====
onMounted(async () => {
  await loadSedes()
  await loadData()
  await verificarCajaActual()
})
</script>

<style scoped>
.page-container { padding: 24px; max-width: 1400px; margin: 0 auto; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; background: #ffffff; padding: 20px 24px; border-radius: 12px; border: 1px solid #e5e7eb; }
.header-left { display: flex; align-items: center; }
.header-title { display: flex; align-items: center; gap: 14px; }
.header-title i { font-size: 32px; color: #2F6FED; background: #e8eeff; padding: 12px; border-radius: 12px; }
.header-title h1 { font-size: 22px; font-weight: 700; color: #111827; margin: 0; }
.header-title .text-muted { color: #6b7280; font-size: 14px; margin: 2px 0 0; }
.header-actions { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.alert-card { display: flex; align-items: center; gap: 16px; padding: 16px 20px; border-radius: 12px; margin-bottom: 20px; border: 1px solid; }
.alert-success { background: #ecfdf5; border-color: #86efac; }
.alert-icon { font-size: 28px; color: #16a34a; }
.alert-content { flex: 1; }
.alert-content h4 { margin: 0; font-size: 16px; color: #111827; }
.alert-content p { margin: 4px 0 0; font-size: 14px; color: #4b5563; }
.alert-actions { flex-shrink: 0; }
.ms-2 { margin-left: 8px; }
.filters-card { background: #ffffff; padding: 16px 20px; border-radius: 12px; border: 1px solid #e5e7eb; margin-bottom: 20px; }
.filter-group { display: flex; gap: 12px; flex-wrap: wrap; align-items: flex-end; }
.filter-item { flex: 1; min-width: 150px; max-width: 250px; }
.filter-item label { font-size: 12px; font-weight: 600; color: #6b7280; display: block; margin-bottom: 4px; }
.filter-item label i { font-size: 12px; margin-right: 4px; }
.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; }
.stat-item { background: #ffffff; border-radius: 12px; padding: 16px 20px; border: 1px solid #e5e7eb; display: flex; align-items: center; gap: 16px; transition: all 0.2s ease; }
.stat-item:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.05); transform: translateY(-2px); }
.stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-icon i { font-size: 22px; color: #ffffff; }
.stat-icon.bg-primary { background: #2F6FED; }
.stat-icon.bg-success { background: #22c55e; }
.stat-icon.bg-danger { background: #dc2626; }
.stat-icon.bg-warning { background: #d97706; }
.stat-info { display: flex; flex-direction: column; }
.stat-value { font-size: 24px; font-weight: 700; color: #111827; line-height: 1.2; }
.stat-label { font-size: 13px; color: #6b7280; }
.table-card { background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; }
.table-responsive { overflow-x: auto; }
.table { margin: 0; width: 100%; border-collapse: collapse; }
.table thead { background: #f8fafc; }
.table thead th { padding: 12px 16px; font-size: 11px; font-weight: 600; text-transform: uppercase; color: #6b7280; border-bottom: 1px solid #e5e7eb; letter-spacing: 0.3px; white-space: nowrap; }
.table tbody td { padding: 12px 16px; vertical-align: middle; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #374151; }
.table tbody tr:hover { background: #f9fafb; }
.table tbody tr:last-child td { border-bottom: none; }
.badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.3px; }
.badge-success { background: #dcfce7; color: #16a34a; }
.badge-secondary { background: #f3f4f6; color: #6b7280; }
.text-success { color: #16a34a; }
.text-danger { color: #dc2626; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 8px 18px; border: none; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s ease; text-decoration: none; font-family: inherit; white-space: nowrap; }
.btn-primary { background: #2F6FED; color: #ffffff; }
.btn-primary:hover:not(:disabled) { background: #1a5adf; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(47,111,237,0.3); }
.btn-outline-secondary { background: transparent; color: #6b7280; border: 1.5px solid #d1d5db; }
.btn-outline-secondary:hover { background: #f9fafb; border-color: #9ca3af; }
.btn-secondary { background: #e5e7eb; color: #374151; }
.btn-secondary:hover { background: #d1d5db; }
.btn-success { background: #22c55e; color: #ffffff; }
.btn-success:hover { background: #16a34a; }
.btn-warning { background: #d97706; color: #ffffff; }
.btn-warning:hover { background: #b45309; }
.btn-danger { background: #dc2626; color: #ffffff; }
.btn-danger:hover { background: #b91c1c; }
.btn-sm { padding: 4px 12px; font-size: 13px; }
.btn-icon { width: 32px; height: 32px; padding: 0; border-radius: 6px; border: 1px solid #e5e7eb; background: transparent; color: #6b7280; transition: all 0.2s ease; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
.btn-icon:hover:not(:disabled) { background: #f3f4f6; border-color: #d1d5db; }
.btn-icon.btn-primary { color: #2F6FED; border-color: #dbeafe; }
.btn-icon.btn-primary:hover { background: #dbeafe; border-color: #2F6FED; }
.btn-icon.btn-warning { color: #d97706; border-color: #fef3c7; }
.btn-icon.btn-warning:hover { background: #fef3c7; border-color: #d97706; }
.btn-icon.btn-danger { color: #dc2626; border-color: #fecaca; }
.btn-icon.btn-danger:hover { background: #fecaca; border-color: #dc2626; }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-group { display: inline-flex; gap: 4px; align-items: center; }
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.2s ease; backdrop-filter: blur(4px); }
.modal { background: #ffffff; border-radius: 16px; max-width: 450px; width: 92%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3); animation: slideIn 0.3s ease; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; border-bottom: 1px solid #e5e7eb; }
.modal-header h3 { margin: 0; font-size: 18px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 8px; }
.modal-body { padding: 24px; text-align: center; }
.modal-icon { font-size: 48px; margin-bottom: 16px; }
.modal-warning { background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 12px 16px; margin-top: 12px; }
.modal-warning p { margin: 0; color: #92400e; font-size: 14px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid #e5e7eb; }
.modal-close { background: none; border: none; font-size: 28px; cursor: pointer; color: #6b7280; padding: 0 8px; line-height: 1; transition: color 0.2s; }
.modal-close:hover { color: #111827; }
.spin { animation: spin 1s linear infinite; }
.spinner { width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top: 4px solid #2F6FED; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideIn { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
.text-muted { color: #6b7280; }
.text-end { text-align: right; }
.text-center { text-align: center; }
.d-block { display: block; }
.fs-1 { font-size: 36px; }
.mt-2 { margin-top: 8px; }
.py-5 { padding: 48px 0; }
@media (max-width: 1024px) { .stats-row { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .page-container { padding: 12px; } .page-header { flex-direction: column; align-items: stretch; padding: 16px; } .header-title h1 { font-size: 18px; } .header-actions { justify-content: stretch; } .header-actions .btn { flex: 1; justify-content: center; } .filter-group { flex-direction: column; } .filter-item { min-width: 100%; max-width: 100%; } .alert-card { flex-direction: column; text-align: center; } .stats-row { grid-template-columns: 1fr 1fr; gap: 8px; } .stat-item { padding: 12px 16px; } .stat-value { font-size: 20px; } .modal { width: 95%; } .btn-group { flex-wrap: wrap; justify-content: flex-end; } .btn-icon { width: 28px; height: 28px; font-size: 13px; } }
@media (max-width: 480px) { .stats-row { grid-template-columns: 1fr; } .header-title i { font-size: 24px; padding: 8px; } .header-title h1 { font-size: 16px; } .badge { font-size: 10px; padding: 2px 8px; } .btn { font-size: 13px; padding: 7px 14px; } }
</style>