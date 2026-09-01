<!-- src/views/restaurante/Promocion/PromocionView.vue -->
<template>
  <div class="page-container">
    <!-- HEADER -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-title">
          <i class="bi bi-tags"></i>
          <div>
            <h1>Promociones</h1>
            <p class="text-muted">Gestiona las promociones y descuentos</p>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn btn-outline-secondary" @click="loadData" title="Actualizar">
          <i class="bi bi-arrow-clockwise" :class="{ spin: loading }"></i>
        </button>
        <button class="btn btn-primary" @click="$router.push('/promociones/nuevo')">
          <i class="bi bi-plus-circle"></i> Nueva Promoción
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
            placeholder="Nombre, código, tipo..."
            @input="applyFilters"
            class="form-control"
          >
        </div>
        <div class="filter-item">
          <label><i class="bi bi-tag"></i> Tipo</label>
          <select v-model="filters.tipo" @change="applyFilters" class="form-control">
            <option value="">Todos</option>
            <option value="Porcentaje">Porcentaje</option>
            <option value="Monto Fijo">Monto Fijo</option>
            <option value="2x1">2x1</option>
            <option value="Combo">Combo</option>
          </select>
        </div>
        <div class="filter-item">
          <label><i class="bi bi-toggle-on"></i> Estado</label>
          <select v-model="filters.activo" @change="applyFilters" class="form-control">
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
        <button class="btn btn-outline-secondary" @click="clearFilters">
          <i class="bi bi-eraser"></i> Limpiar
        </button>
      </div>
    </div>

    <!-- ESTADÍSTICAS RÁPIDAS -->
    <div class="stats-row">
      <div class="stat-item">
        <div class="stat-icon bg-primary">
          <i class="bi bi-tags"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ totalRecords }}</span>
          <span class="stat-label">Total Promociones</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon bg-success">
          <i class="bi bi-check-circle"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ promocionesActivas }}</span>
          <span class="stat-label">Activas</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon bg-warning">
          <i class="bi bi-clock"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ promocionesVigentes }}</span>
          <span class="stat-label">Vigentes</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon bg-danger">
          <i class="bi bi-x-circle"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ promocionesInactivas }}</span>
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
              <th>Nombre</th>
              <th>Código</th>
              <th>Tipo</th>
              <th>Descuento</th>
              <th>Vigencia</th>
              <th>Usos</th>
              <th>Estado</th>
              <th>Sede</th>
              <th class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredItems" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="promocion-nombre">
                  <strong>{{ item.nombre }}</strong>
                  <small class="text-muted d-block">{{ item.descripcion || 'Sin descripción' }}</small>
                </div>
              </td>
              <td>
                <span class="badge badge-codigo">{{ item.codigo || 'N/A' }}</span>
              </td>
              <td>
                <span class="badge" :class="getTipoClass(item.tipo)">
                  {{ item.tipo || 'N/A' }}
                </span>
              </td>
              <td>
                <span v-if="item.tipo === 'Porcentaje'" class="descuento-porcentaje">
                  {{ item.porcentaje_descuento }}%
                </span>
                <span v-else-if="item.tipo === 'Monto Fijo'" class="descuento-monto">
                  S/ {{ formatCurrency(item.monto_descuento) }}
                </span>
                <span v-else class="descuento-especial">
                  {{ item.tipo }}
                </span>
              </td>
              <td>
                <div class="vigencia">
                  <span class="fecha-inicio">{{ formatFecha(item.fecha_inicio) }}</span>
                  <span class="fecha-separador">→</span>
                  <span class="fecha-fin">{{ formatFecha(item.fecha_fin) }}</span>
                  <span v-if="estaVigente(item)" class="badge badge-vigente">Vigente</span>
                  <span v-else class="badge badge-expirada">Expirada</span>
                </div>
              </td>
              <td>
                <span class="usos-info">
                  {{ item.usos_actuales || 0 }}/{{ item.uso_limite || '∞' }}
                </span>
              </td>
              <td>
                <span class="badge" :class="item.activo ? 'badge-success' : 'badge-danger'">
                  <i :class="item.activo ? 'bi-check-circle' : 'bi-x-circle'"></i>
                  {{ item.activo ? 'Activa' : 'Inactiva' }}
                </span>
              </td>
              <td>{{ item.sede_nombre || item.sede_id || 'N/A' }}</td>
              <td class="text-end">
                <div class="btn-group">
                  <router-link 
                    :to="`/promociones/${item.id}`" 
                    class="btn btn-icon btn-primary"
                    title="Ver detalle"
                  >
                    <i class="bi bi-eye"></i>
                  </router-link>
                  <router-link 
                    :to="`/promociones/${item.id}/editar`" 
                    class="btn btn-icon btn-info"
                    title="Editar"
                  >
                    <i class="bi bi-pencil"></i>
                  </router-link>
                  <button 
                    @click="toggleEstado(item)" 
                    class="btn btn-icon"
                    :class="item.activo ? 'btn-warning' : 'btn-success'"
                    :title="item.activo ? 'Desactivar' : 'Activar'"
                  >
                    <i :class="item.activo ? 'bi-toggle-off' : 'bi-toggle-on'"></i>
                  </button>
                  <button 
                    @click="eliminarPromocion(item)" 
                    class="btn btn-icon btn-danger"
                    title="Eliminar"
                    v-if="!item.has_usos"
                  >
                    <i class="bi bi-trash3"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!filteredItems.length">
              <td colspan="10" class="text-center py-5">
                <i class="bi bi-inbox fs-1 d-block text-muted"></i>
                <p class="text-muted mt-2">No hay promociones registradas</p>
                <button class="btn btn-primary mt-2" @click="$router.push('/promociones/nuevo')">
                  <i class="bi bi-plus-circle"></i> Crear primera promoción
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="loading" class="text-center py-5">
          <div class="spinner"></div>
          <p class="text-muted mt-2">Cargando promociones...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { PromocionesAPI, SedesAPI } from '@/services/api'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()

// ===== STATE =====
const items = ref([])
const sedes = ref([])
const loading = ref(false)
const totalRecords = ref(0)
const itemAEliminar = ref(null)
const showDeleteModal = ref(false)
const deleting = ref(false)

// ===== FILTERS =====
const filters = reactive({
  search: '',
  tipo: '',
  activo: '',
  sede_id: ''
})

// ===== COMPUTED =====
const promocionesActivas = computed(() => items.value.filter(i => i.activo === true).length)
const promocionesInactivas = computed(() => items.value.filter(i => i.activo === false).length)
const promocionesVigentes = computed(() => {
  const hoy = new Date()
  return items.value.filter(i => {
    if (!i.activo) return false
    const inicio = new Date(i.fecha_inicio)
    const fin = new Date(i.fecha_fin)
    return hoy >= inicio && hoy <= fin
  }).length
})

const filteredItems = computed(() => {
  let result = [...items.value]

  if (filters.search) {
    const search = filters.search.toLowerCase()
    result = result.filter(i =>
      i.nombre?.toLowerCase().includes(search) ||
      i.codigo?.toLowerCase().includes(search) ||
      i.descripcion?.toLowerCase().includes(search)
    )
  }

  if (filters.tipo) {
    result = result.filter(i => i.tipo === filters.tipo)
  }

  if (filters.activo !== '') {
    result = result.filter(i => i.activo === (filters.activo === 'true'))
  }

  if (filters.sede_id) {
    result = result.filter(i => i.sede_id === parseInt(filters.sede_id))
  }

  return result
})

// ===== METHODS =====
function estaVigente(item) {
  const hoy = new Date()
  const inicio = new Date(item.fecha_inicio)
  const fin = new Date(item.fecha_fin)
  return item.activo && hoy >= inicio && hoy <= fin
}

function getTipoClass(tipo) {
  const classes = {
    'Porcentaje': 'badge-info',
    'Monto Fijo': 'badge-warning',
    '2x1': 'badge-success',
    'Combo': 'badge-primary'
  }
  return classes[tipo] || 'badge-secondary'
}

async function loadData() {
  loading.value = true
  try {
    const res = await PromocionesAPI.list()
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
    console.error('Error cargando promociones:', error)
    Swal.fire('Error', 'No se pudieron cargar las promociones', 'error')
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

function formatCurrency(value) {
  if (value === null || value === undefined) return '0.00'
  return new Intl.NumberFormat('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

function formatFecha(fecha) {
  if (!fecha) return 'N/A'
  try {
    const d = new Date(fecha)
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short'
    })
  } catch {
    return fecha
  }
}

function applyFilters() {}

function clearFilters() {
  filters.search = ''
  filters.tipo = ''
  filters.activo = ''
  filters.sede_id = ''
}

async function toggleEstado(item) {
  const accion = item.activo ? 'desactivar' : 'activar'
  const result = await Swal.fire({
    title: `${accion === 'desactivar' ? 'Desactivar' : 'Activar'} promoción`,
    text: `¿Estás seguro de ${accion} la promoción "${item.nombre}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: item.activo ? '#dc3545' : '#28a745',
    confirmButtonText: `Sí, ${accion}`,
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    try {
      await PromocionesAPI.toggleStatus(item.id)
      Swal.fire('Éxito', `Promoción ${accion === 'desactivar' ? 'desactivada' : 'activada'} correctamente`, 'success')
      await loadData()
    } catch (error) {
      const msg = error.response?.data?.message || `No se pudo ${accion} la promoción`
      Swal.fire('Error', msg, 'error')
    }
  }
}

async function eliminarPromocion(item) {
  const result = await Swal.fire({
    title: 'Eliminar Promoción',
    text: `¿Estás seguro de eliminar la promoción "${item.nombre}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'Sí, Eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    try {
      await PromocionesAPI.remove(item.id)
      Swal.fire('Éxito', 'Promoción eliminada correctamente', 'success')
      await loadData()
    } catch (error) {
      const msg = error.response?.data?.message || 'No se pudo eliminar la promoción'
      Swal.fire('Error', msg, 'error')
    }
  }
}

// ===== LIFECYCLE =====
onMounted(() => {
  loadSedes()
  loadData()
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
.stat-icon.bg-warning { background: #d97706; }
.stat-icon.bg-danger { background: #dc2626; }
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
.badge-danger { background: #fecaca; color: #dc2626; }
.badge-warning { background: #fef3c7; color: #d97706; }
.badge-info { background: #dbeafe; color: #2563eb; }
.badge-primary { background: #dbeafe; color: #2563eb; }
.badge-secondary { background: #f3f4f6; color: #6b7280; }
.badge-codigo { background: #f3f4f6; color: #6b7280; font-family: 'Courier New', monospace; }
.badge-vigente { background: #dcfce7; color: #16a34a; font-size: 9px; }
.badge-expirada { background: #fecaca; color: #dc2626; font-size: 9px; }
.promocion-nombre strong { font-size: 14px; color: #111827; }
.promocion-nombre small { font-size: 11px; color: #6b7280; }
.descuento-porcentaje { font-weight: 700; color: #2563eb; }
.descuento-monto { font-weight: 700; color: #d97706; }
.descuento-especial { font-weight: 600; color: #16a34a; }
.vigencia { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
.fecha-inicio, .fecha-fin { font-size: 12px; color: #6b7280; }
.fecha-separador { color: #d1d5db; }
.usos-info { font-weight: 600; color: #6b7280; font-size: 13px; }
.text-muted { color: #6b7280; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 8px 18px; border: none; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s ease; text-decoration: none; font-family: inherit; white-space: nowrap; }
.btn-primary { background: #2F6FED; color: #ffffff; }
.btn-primary:hover:not(:disabled) { background: #1a5adf; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(47,111,237,0.3); }
.btn-outline-secondary { background: transparent; color: #6b7280; border: 1.5px solid #d1d5db; }
.btn-outline-secondary:hover { background: #f9fafb; border-color: #9ca3af; }
.btn-warning { background: #d97706; color: #ffffff; }
.btn-warning:hover { background: #b45309; }
.btn-success { background: #22c55e; color: #ffffff; }
.btn-success:hover { background: #16a34a; }
.btn-danger { background: #dc2626; color: #ffffff; }
.btn-danger:hover { background: #b91c1c; }
.btn-icon { width: 32px; height: 32px; padding: 0; border-radius: 6px; border: 1px solid #e5e7eb; background: transparent; color: #6b7280; transition: all 0.2s ease; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
.btn-icon:hover:not(:disabled) { background: #f3f4f6; border-color: #d1d5db; }
.btn-icon.btn-primary { color: #2F6FED; border-color: #dbeafe; }
.btn-icon.btn-primary:hover { background: #dbeafe; border-color: #2F6FED; }
.btn-icon.btn-info { color: #0891b2; border-color: #cffafe; }
.btn-icon.btn-info:hover { background: #cffafe; border-color: #0891b2; }
.btn-icon.btn-warning { color: #d97706; border-color: #fef3c7; }
.btn-icon.btn-warning:hover { background: #fef3c7; border-color: #d97706; }
.btn-icon.btn-success { color: #16a34a; border-color: #dcfce7; }
.btn-icon.btn-success:hover { background: #dcfce7; border-color: #16a34a; }
.btn-icon.btn-danger { color: #dc2626; border-color: #fecaca; }
.btn-icon.btn-danger:hover { background: #fecaca; border-color: #dc2626; }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-group { display: inline-flex; gap: 4px; align-items: center; }
.spin { animation: spin 1s linear infinite; }
.spinner { width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top: 4px solid #2F6FED; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.text-end { text-align: right; }
.text-center { text-align: center; }
.d-block { display: block; }
.fs-1 { font-size: 36px; }
.mt-2 { margin-top: 8px; }
.py-5 { padding: 48px 0; }
@media (max-width: 1024px) { .stats-row { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .page-container { padding: 12px; } .page-header { flex-direction: column; align-items: stretch; padding: 16px; } .header-title h1 { font-size: 18px; } .header-actions { justify-content: stretch; } .header-actions .btn { flex: 1; justify-content: center; } .filter-group { flex-direction: column; } .filter-item { min-width: 100%; max-width: 100%; } .stats-row { grid-template-columns: 1fr 1fr; gap: 8px; } .stat-item { padding: 12px 16px; } .stat-value { font-size: 20px; } .btn-group { flex-wrap: wrap; justify-content: flex-end; } .btn-icon { width: 28px; height: 28px; font-size: 13px; } }
@media (max-width: 480px) { .stats-row { grid-template-columns: 1fr; } .header-title i { font-size: 24px; padding: 8px; } .header-title h1 { font-size: 16px; } .badge { font-size: 10px; padding: 2px 8px; } .btn { font-size: 13px; padding: 7px 14px; } }
</style>