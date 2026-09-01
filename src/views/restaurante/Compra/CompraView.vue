<!-- src/views/restaurante/Compra/CompraView.vue -->
<template>
  <div class="page-container">
    <!-- HEADER -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-title">
          <i class="bi bi-cart-plus"></i>
          <div>
            <h1>Compras</h1>
            <p class="text-muted">Gestiona las compras a proveedores</p>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn btn-outline-secondary" @click="loadData" title="Actualizar">
          <i class="bi bi-arrow-clockwise" :class="{ spin: loading }"></i>
        </button>
        <button class="btn btn-primary" @click="$router.push('/compras/nuevo')">
          <i class="bi bi-plus-circle"></i> Nueva Compra
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
            placeholder="Número, proveedor..."
            @input="applyFilters"
            class="form-control"
          >
        </div>
        <div class="filter-item">
          <label><i class="bi bi-tag"></i> Estado</label>
          <select v-model="filters.estado" @change="applyFilters" class="form-control">
            <option value="">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Aprobada">Aprobada</option>
            <option value="Recibida">Recibida</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>
        <div class="filter-item">
          <label><i class="bi bi-truck"></i> Proveedor</label>
          <select v-model="filters.proveedor_id" @change="applyFilters" class="form-control">
            <option value="">Todos</option>
            <option v-for="prov in proveedores" :key="prov.id" :value="prov.id">
              {{ prov.nombre }}
            </option>
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
          <i class="bi bi-cart-plus"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ totalRecords }}</span>
          <span class="stat-label">Total Compras</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon bg-warning">
          <i class="bi bi-clock"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ comprasPendientes }}</span>
          <span class="stat-label">Pendientes</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon bg-success">
          <i class="bi bi-check-circle"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ comprasRecibidas }}</span>
          <span class="stat-label">Recibidas</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon bg-danger">
          <i class="bi bi-x-circle"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ comprasCanceladas }}</span>
          <span class="stat-label">Canceladas</span>
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
              <th>Proveedor</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Sede</th>
              <th class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredItems" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>
                <span class="numero-compra">#{{ item.numero_compra || item.id }}</span>
              </td>
              <td>
                <div class="proveedor-info">
                  <strong>{{ item.proveedor_nombre || 'N/A' }}</strong>
                  <small v-if="item.proveedor_ruc" class="text-muted">RUC: {{ item.proveedor_ruc }}</small>
                </div>
              </td>
              <td>
                <span class="total-compra">S/ {{ formatCurrency(item.total) }}</span>
              </td>
              <td>
                <span class="badge" :class="getEstadoClass(item.estado)">
                  <i :class="getEstadoIcon(item.estado)"></i>
                  {{ item.estado }}
                </span>
              </td>
              <td>{{ formatearFecha(item.fecha_compra) }}</td>
              <td>{{ item.sede_nombre || item.sede_id || 'N/A' }}</td>
              <td class="text-end">
                <div class="btn-group">
                  <router-link 
                    :to="`/compras/${item.id}`" 
                    class="btn btn-icon btn-primary"
                    title="Ver detalle"
                  >
                    <i class="bi bi-eye"></i>
                  </router-link>
                  <router-link 
                    v-if="item.estado === 'Pendiente'"
                    :to="`/compras/${item.id}/editar`" 
                    class="btn btn-icon btn-info"
                    title="Editar"
                  >
                    <i class="bi bi-pencil"></i>
                  </router-link>
                  <button 
                    v-if="item.estado === 'Pendiente'"
                    @click="aprobarCompra(item)" 
                    class="btn btn-icon btn-success"
                    title="Aprobar"
                  >
                    <i class="bi bi-check2"></i>
                  </button>
                  <button 
                    v-if="item.estado === 'Aprobada'"
                    @click="recibirCompra(item)" 
                    class="btn btn-icon btn-warning"
                    title="Recibir"
                  >
                    <i class="bi bi-box-seam"></i>
                  </button>
                  <button 
                    @click="cancelarCompra(item)" 
                    class="btn btn-icon btn-danger"
                    title="Cancelar"
                    v-if="item.estado !== 'Cancelada' && item.estado !== 'Recibida'"
                  >
                    <i class="bi bi-x-circle"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!filteredItems.length">
              <td colspan="8" class="text-center py-5">
                <i class="bi bi-inbox fs-1 d-block text-muted"></i>
                <p class="text-muted mt-2">No hay compras registradas</p>
                <button class="btn btn-primary mt-2" @click="$router.push('/compras/nuevo')">
                  <i class="bi bi-plus-circle"></i> Crear primera compra
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="loading" class="text-center py-5">
          <div class="spinner"></div>
          <p class="text-muted mt-2">Cargando compras...</p>
        </div>
      </div>
    </div>

    <!-- MODAL APROBAR -->
    <div v-if="showAprobarModal" class="modal-overlay" @click.self="closeAprobarModal">
      <div class="modal">
        <div class="modal-header">
          <h3><i class="bi bi-check2-circle text-success"></i> Aprobar Compra</h3>
          <button class="modal-close" @click="closeAprobarModal">×</button>
        </div>
        <div class="modal-body">
          <p>Compra: <strong>#{{ compraSeleccionada?.numero_compra || compraSeleccionada?.id }}</strong></p>
          <p>Proveedor: <strong>{{ compraSeleccionada?.proveedor_nombre }}</strong></p>
          <p>Total: <strong>S/ {{ formatCurrency(compraSeleccionada?.total) }}</strong></p>
          <div class="field-group">
            <label>Nota de aprobación</label>
            <input 
              type="text" 
              v-model="notaAprobacion" 
              class="form-control"
              placeholder="Nota sobre la aprobación..."
            >
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeAprobarModal">Cancelar</button>
          <button class="btn btn-success" @click="confirmarAprobar" :disabled="aprobando">
            <i class="bi" :class="aprobando ? 'bi-arrow-repeat spin' : 'bi-check2'"></i>
            {{ aprobando ? 'Aprobando...' : 'Aprobar Compra' }}
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL RECIBIR -->
    <div v-if="showRecibirModal" class="modal-overlay" @click.self="closeRecibirModal">
      <div class="modal">
        <div class="modal-header">
          <h3><i class="bi bi-box-seam text-warning"></i> Recibir Compra</h3>
          <button class="modal-close" @click="closeRecibirModal">×</button>
        </div>
        <div class="modal-body">
          <p>Compra: <strong>#{{ compraSeleccionada?.numero_compra || compraSeleccionada?.id }}</strong></p>
          <p>Proveedor: <strong>{{ compraSeleccionada?.proveedor_nombre }}</strong></p>
          <div class="field-group">
            <label>Fecha de Recepción</label>
            <input 
              type="datetime-local" 
              v-model="fechaRecepcion" 
              class="form-control"
            >
          </div>
          <div class="field-group">
            <label>Nota de recepción</label>
            <input 
              type="text" 
              v-model="notaRecepcion" 
              class="form-control"
              placeholder="Nota sobre la recepción..."
            >
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeRecibirModal">Cancelar</button>
          <button class="btn btn-warning" @click="confirmarRecibir" :disabled="recibiendo">
            <i class="bi" :class="recibiendo ? 'bi-arrow-repeat spin' : 'bi-box-seam'"></i>
            {{ recibiendo ? 'Procesando...' : 'Recibir Compra' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ComprasAPI, ProveedoresAPI, SedesAPI } from '@/services/api'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()

// ===== STATE =====
const items = ref([])
const proveedores = ref([])
const sedes = ref([])
const loading = ref(false)
const aprobando = ref(false)
const recibiendo = ref(false)
const totalRecords = ref(0)
const compraSeleccionada = ref(null)
const showAprobarModal = ref(false)
const showRecibirModal = ref(false)
const notaAprobacion = ref('')
const notaRecepcion = ref('')
const fechaRecepcion = ref('')

// ===== FILTERS =====
const filters = reactive({
  search: '',
  estado: '',
  proveedor_id: '',
  sede_id: ''
})

// ===== COMPUTED =====
const comprasPendientes = computed(() => items.value.filter(i => i.estado === 'Pendiente').length)
const comprasRecibidas = computed(() => items.value.filter(i => i.estado === 'Recibida').length)
const comprasCanceladas = computed(() => items.value.filter(i => i.estado === 'Cancelada').length)

const filteredItems = computed(() => {
  let result = [...items.value]

  if (filters.search) {
    const search = filters.search.toLowerCase()
    result = result.filter(i =>
      i.numero_compra?.toLowerCase().includes(search) ||
      i.proveedor_nombre?.toLowerCase().includes(search)
    )
  }

  if (filters.estado) {
    result = result.filter(i => i.estado === filters.estado)
  }

  if (filters.proveedor_id) {
    result = result.filter(i => i.proveedor_id === parseInt(filters.proveedor_id))
  }

  if (filters.sede_id) {
    result = result.filter(i => i.sede_id === parseInt(filters.sede_id))
  }

  return result
})

// ===== METHODS =====
async function loadData() {
  loading.value = true
  try {
    const res = await ComprasAPI.list()
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
    console.error('Error cargando compras:', error)
    Swal.fire('Error', 'No se pudieron cargar las compras', 'error')
    items.value = []
    totalRecords.value = 0
  } finally {
    loading.value = false
  }
}

async function loadProveedores() {
  try {
    const res = await ProveedoresAPI.list()
    proveedores.value = res.data.data || []
  } catch (error) {
    console.error('Error cargando proveedores:', error)
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

function getEstadoClass(estado) {
  const classes = {
    'Pendiente': 'badge-warning',
    'Aprobada': 'badge-info',
    'Recibida': 'badge-success',
    'Cancelada': 'badge-danger'
  }
  return classes[estado] || 'badge-secondary'
}

function getEstadoIcon(estado) {
  const icons = {
    'Pendiente': 'bi-clock',
    'Aprobada': 'bi-check2-circle',
    'Recibida': 'bi-box-seam',
    'Cancelada': 'bi-x-circle'
  }
  return icons[estado] || 'bi-circle'
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

function applyFilters() {}

function clearFilters() {
  filters.search = ''
  filters.estado = ''
  filters.proveedor_id = ''
  filters.sede_id = ''
}

// ===== ACCIONES =====
function aprobarCompra(item) {
  compraSeleccionada.value = item
  notaAprobacion.value = ''
  showAprobarModal.value = true
}

function closeAprobarModal() {
  showAprobarModal.value = false
  compraSeleccionada.value = null
  notaAprobacion.value = ''
  aprobando.value = false
}

async function confirmarAprobar() {
  if (!compraSeleccionada.value) return

  aprobando.value = true
  try {
    const payload = {
      usuario_aprobacion: 1,
      fecha_aprobacion: new Date().toISOString(),
      nota: notaAprobacion.value || 'Compra aprobada'
    }
    await ComprasAPI.aprobar(compraSeleccionada.value.id, payload)
    Swal.fire('Éxito', 'Compra aprobada correctamente', 'success')
    await loadData()
    closeAprobarModal()
  } catch (error) {
    const msg = error.response?.data?.message || 'No se pudo aprobar la compra'
    Swal.fire('Error', msg, 'error')
  } finally {
    aprobando.value = false
  }
}

function recibirCompra(item) {
  compraSeleccionada.value = item
  notaRecepcion.value = ''
  fechaRecepcion.value = new Date().toISOString().slice(0, 16)
  showRecibirModal.value = true
}

function closeRecibirModal() {
  showRecibirModal.value = false
  compraSeleccionada.value = null
  notaRecepcion.value = ''
  fechaRecepcion.value = ''
  recibiendo.value = false
}

async function confirmarRecibir() {
  if (!compraSeleccionada.value) return

  recibiendo.value = true
  try {
    const payload = {
      fecha_recepcion: fechaRecepcion.value || new Date().toISOString(),
      nota: notaRecepcion.value || 'Compra recibida'
    }
    await ComprasAPI.recibir(compraSeleccionada.value.id, payload)
    Swal.fire('Éxito', 'Compra recibida correctamente. Se actualizó el inventario.', 'success')
    await loadData()
    closeRecibirModal()
  } catch (error) {
    const msg = error.response?.data?.message || 'No se pudo recibir la compra'
    Swal.fire('Error', msg, 'error')
  } finally {
    recibiendo.value = false
  }
}

async function cancelarCompra(item) {
  const result = await Swal.fire({
    title: 'Cancelar Compra',
    text: `¿Estás seguro de cancelar la compra #${item.numero_compra || item.id}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'Sí, Cancelar',
    cancelButtonText: 'No'
  })

  if (result.isConfirmed) {
    const { value: motivo } = await Swal.fire({
      title: 'Motivo de cancelación',
      input: 'text',
      inputPlaceholder: 'Ingresa el motivo de cancelación...',
      showCancelButton: true,
      confirmButtonText: 'Cancelar Compra',
      cancelButtonText: 'Volver'
    })

    if (motivo !== undefined) {
      try {
        await ComprasAPI.cancelar(item.id, motivo || 'Cancelada por usuario')
        Swal.fire('Compra cancelada', 'La compra ha sido cancelada exitosamente', 'success')
        await loadData()
      } catch (error) {
        const msg = error.response?.data?.message || 'No se pudo cancelar la compra'
        Swal.fire('Error', msg, 'error')
      }
    }
  }
}

// ===== LIFECYCLE =====
onMounted(() => {
  loadSedes()
  loadProveedores()
  loadData()
})
</script>

<style scoped>
/* Estilos iguales a los anteriores */
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
.stat-icon.bg-warning { background: #d97706; }
.stat-icon.bg-success { background: #22c55e; }
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
.badge-warning { background: #fef3c7; color: #d97706; }
.badge-info { background: #dbeafe; color: #2563eb; }
.badge-success { background: #dcfce7; color: #16a34a; }
.badge-danger { background: #fecaca; color: #dc2626; }
.badge-secondary { background: #f3f4f6; color: #6b7280; }
.numero-compra { font-weight: 700; color: #2F6FED; font-size: 14px; }
.total-compra { font-weight: 700; color: #E85D3A; font-size: 15px; }
.proveedor-info { display: flex; flex-direction: column; }
.proveedor-info strong { font-size: 14px; color: #111827; }
.proveedor-info small { font-size: 11px; color: #6b7280; }
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
.btn-icon { width: 32px; height: 32px; padding: 0; border-radius: 6px; border: 1px solid #e5e7eb; background: transparent; color: #6b7280; transition: all 0.2s ease; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
.btn-icon:hover:not(:disabled) { background: #f3f4f6; border-color: #d1d5db; }
.btn-icon.btn-primary { color: #2F6FED; border-color: #dbeafe; }
.btn-icon.btn-primary:hover { background: #dbeafe; border-color: #2F6FED; }
.btn-icon.btn-info { color: #0891b2; border-color: #cffafe; }
.btn-icon.btn-info:hover { background: #cffafe; border-color: #0891b2; }
.btn-icon.btn-success { color: #16a34a; border-color: #dcfce7; }
.btn-icon.btn-success:hover { background: #dcfce7; border-color: #16a34a; }
.btn-icon.btn-warning { color: #d97706; border-color: #fef3c7; }
.btn-icon.btn-warning:hover { background: #fef3c7; border-color: #d97706; }
.btn-icon.btn-danger { color: #dc2626; border-color: #fecaca; }
.btn-icon.btn-danger:hover { background: #fecaca; border-color: #dc2626; }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-group { display: inline-flex; gap: 4px; align-items: center; }
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.2s ease; backdrop-filter: blur(4px); }
.modal { background: #ffffff; border-radius: 16px; max-width: 500px; width: 92%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3); animation: slideIn 0.3s ease; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; border-bottom: 1px solid #e5e7eb; }
.modal-header h3 { margin: 0; font-size: 18px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 8px; }
.modal-body { padding: 24px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid #e5e7eb; }
.form-control { width: 100%; padding: 8px 14px; border: 1.5px solid #d1d5db; border-radius: 8px; font-size: 14px; font-family: inherit; transition: all 0.2s ease; background: #ffffff; color: #111827; }
.form-control:focus { outline: none; border-color: #2F6FED; box-shadow: 0 0 0 3px rgba(47,111,237,0.08); }
.field-group { margin-bottom: 14px; }
.field-group label { display: flex; align-items: center; gap: 6px; font-weight: 500; font-size: 13px; color: #374151; margin-bottom: 4px; }
.required { color: #ef4444; font-weight: 700; margin-left: 2px; }
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
@media (max-width: 768px) { .page-container { padding: 12px; } .page-header { flex-direction: column; align-items: stretch; padding: 16px; } .header-title h1 { font-size: 18px; } .header-actions { justify-content: stretch; } .header-actions .btn { flex: 1; justify-content: center; } .filter-group { flex-direction: column; } .filter-item { min-width: 100%; max-width: 100%; } .stats-row { grid-template-columns: 1fr 1fr; gap: 8px; } .stat-item { padding: 12px 16px; } .stat-value { font-size: 20px; } .modal { width: 95%; } .btn-group { flex-wrap: wrap; justify-content: flex-end; } .btn-icon { width: 28px; height: 28px; font-size: 13px; } }
@media (max-width: 480px) { .stats-row { grid-template-columns: 1fr; } .header-title i { font-size: 24px; padding: 8px; } .header-title h1 { font-size: 16px; } .badge { font-size: 10px; padding: 2px 8px; } .btn { font-size: 13px; padding: 7px 14px; } }
</style>