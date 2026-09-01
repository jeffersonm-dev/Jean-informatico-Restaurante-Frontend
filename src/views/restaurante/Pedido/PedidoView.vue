<!-- src/views/restaurante/Pedido/PedidoView.vue -->
<template>
  <div class="page-container">
    <!-- HEADER -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-title">
          <i class="bi bi-cart"></i>
          <div>
            <h1>Pedidos</h1>
            <p class="text-muted">Gestiona los pedidos del restaurante</p>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn btn-outline-secondary" @click="loadData" title="Actualizar">
          <i class="bi bi-arrow-clockwise" :class="{ spin: loading }"></i>
        </button>
        <button class="btn btn-primary" @click="abrirModalNuevo">
          <i class="bi bi-plus-circle"></i> Nuevo Pedido
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
            placeholder="Número, cliente, estado..."
            @input="applyFilters"
            class="form-control"
          >
        </div>
        <div class="filter-item">
          <label><i class="bi bi-tag"></i> Estado</label>
          <select v-model="filters.estado" @change="applyFilters" class="form-control">
            <option value="">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En preparación">En preparación</option>
            <option value="Listo">Listo</option>
            <option value="Entregado">Entregado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
        <div class="filter-item">
          <label><i class="bi bi-people"></i> Cliente</label>
          <select v-model="filters.cliente_id" @change="applyFilters" class="form-control">
            <option value="">Todos</option>
            <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
              {{ cliente.nombre }}
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
          <i class="bi bi-cart"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ totalRecords }}</span>
          <span class="stat-label">Total Pedidos</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon bg-warning">
          <i class="bi bi-clock"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ pedidosPendientes }}</span>
          <span class="stat-label">Pendientes</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon bg-info">
          <i class="bi bi-hourglass-split"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ pedidosPreparacion }}</span>
          <span class="stat-label">En Preparación</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon bg-success">
          <i class="bi bi-check-circle"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ pedidosCompletados }}</span>
          <span class="stat-label">Completados</span>
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
              <th>Cliente</th>
              <th>Mesa</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Tipo</th>
              <th>Fecha</th>
              <th>Sede</th>
              <th class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredItems" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>
                <span class="numero-pedido">#{{ item.numero_pedido || item.id }}</span>
              </td>
              <td>
                <div class="cliente-info">
                  <strong>{{ item.cliente_nombre || 'N/A' }}</strong>
                  <small v-if="item.cliente_telefono" class="text-muted">
                    <i class="bi bi-telephone"></i> {{ item.cliente_telefono }}
                  </small>
                </div>
              </td>
              <td>{{ item.mesa_nombre || item.mesa_id || 'N/A' }}</td>
              <td>
                <span class="total-pedido">S/ {{ formatCurrency(item.total) }}</span>
              </td>
              <td>
                <span class="badge" :class="getEstadoClass(item.estado)">
                  <i :class="getEstadoIcon(item.estado)"></i>
                  {{ item.estado }}
                </span>
              </td>
              <td>
                <span class="badge badge-tipo">
                  {{ item.tipo_pedido || 'Normal' }}
                </span>
              </td>
              <td>{{ formatearFecha(item.fecha_pedido) }}</td>
              <td>{{ item.sede_nombre || item.sede_id || 'N/A' }}</td>
              <td class="text-end">
                <div class="btn-group">
                  <router-link 
                    :to="`/pedidos/${item.id}`" 
                    class="btn btn-icon btn-primary"
                    title="Ver detalle"
                  >
                    <i class="bi bi-eye"></i>
                  </router-link>
                  <router-link 
                    :to="`/pedidos/${item.id}/editar`" 
                    class="btn btn-icon btn-info"
                    title="Editar"
                    v-if="item.estado !== 'Cancelado' && item.estado !== 'Entregado'"
                  >
                    <i class="bi bi-pencil"></i>
                  </router-link>
                  <button 
                    v-if="item.estado === 'Pendiente' || item.estado === 'En preparación'"
                    @click="cambiarEstado(item)" 
                    class="btn btn-icon btn-warning"
                    title="Cambiar estado"
                  >
                    <i class="bi bi-arrow-repeat"></i>
                  </button>
                  <button 
                    @click="cancelarPedido(item)" 
                    class="btn btn-icon btn-danger"
                    title="Cancelar"
                    v-if="item.estado !== 'Cancelado' && item.estado !== 'Entregado'"
                  >
                    <i class="bi bi-x-circle"></i>
                  </button>
                  <button 
                    @click="duplicarPedido(item)" 
                    class="btn btn-icon btn-success"
                    title="Duplicar"
                  >
                    <i class="bi bi-files"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!filteredItems.length">
              <td colspan="10" class="text-center py-5">
                <i class="bi bi-inbox fs-1 d-block text-muted"></i>
                <p class="text-muted mt-2">No hay pedidos registrados</p>
                <button class="btn btn-primary mt-2" @click="abrirModalNuevo">
                  <i class="bi bi-plus-circle"></i> Crear primer pedido
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="loading" class="text-center py-5">
          <div class="spinner"></div>
          <p class="text-muted mt-2">Cargando pedidos...</p>
        </div>
      </div>
    </div>

    <!-- MODAL CAMBIAR ESTADO -->
    <div v-if="showEstadoModal" class="modal-overlay" @click.self="closeEstadoModal">
      <div class="modal">
        <div class="modal-header">
          <h3><i class="bi bi-arrow-repeat text-warning"></i> Cambiar Estado</h3>
          <button class="modal-close" @click="closeEstadoModal">×</button>
        </div>
        <div class="modal-body">
          <p>Pedido: <strong>#{{ pedidoSeleccionado?.numero_pedido || pedidoSeleccionado?.id }}</strong></p>
          <div class="field-group">
            <label>Nuevo Estado <span class="required">*</span></label>
            <select v-model="nuevoEstado" class="form-control">
              <option value="Pendiente">Pendiente</option>
              <option value="En preparación">En preparación</option>
              <option value="Listo">Listo</option>
              <option value="Entregado">Entregado</option>
            </select>
          </div>
          <div class="field-group">
            <label>Nota</label>
            <input 
              type="text" 
              v-model="notaEstado" 
              class="form-control"
              placeholder="Nota sobre el cambio de estado..."
            >
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeEstadoModal">Cancelar</button>
          <button class="btn btn-warning" @click="confirmarCambioEstado" :disabled="cambiandoEstado">
            <i class="bi" :class="cambiandoEstado ? 'bi-arrow-repeat spin' : 'bi-check'"></i>
            {{ cambiandoEstado ? 'Guardando...' : 'Cambiar Estado' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { PedidosAPI, ClientesAPI, SedesAPI } from '@/services/api'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()

// ===== STATE =====
const items = ref([])
const clientes = ref([])
const sedes = ref([])
const loading = ref(false)
const cambiandoEstado = ref(false)
const totalRecords = ref(0)
const pedidoSeleccionado = ref(null)
const showEstadoModal = ref(false)
const nuevoEstado = ref('')
const notaEstado = ref('')

// ===== FILTERS =====
const filters = reactive({
  search: '',
  estado: '',
  cliente_id: '',
  sede_id: ''
})

// ===== COMPUTED =====
const pedidosPendientes = computed(() => items.value.filter(i => i.estado === 'Pendiente').length)
const pedidosPreparacion = computed(() => items.value.filter(i => i.estado === 'En preparación').length)
const pedidosCompletados = computed(() => items.value.filter(i => i.estado === 'Entregado' || i.estado === 'Listo').length)

const filteredItems = computed(() => {
  let result = [...items.value]

  if (filters.search) {
    const search = filters.search.toLowerCase()
    result = result.filter(i =>
      i.numero_pedido?.toLowerCase().includes(search) ||
      i.cliente_nombre?.toLowerCase().includes(search) ||
      i.estado?.toLowerCase().includes(search)
    )
  }

  if (filters.estado) {
    result = result.filter(i => i.estado === filters.estado)
  }

  if (filters.cliente_id) {
    result = result.filter(i => i.cliente_id === parseInt(filters.cliente_id))
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
    const res = await PedidosAPI.list()
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
    console.error('Error cargando pedidos:', error)
    Swal.fire('Error', 'No se pudieron cargar los pedidos', 'error')
    items.value = []
    totalRecords.value = 0
  } finally {
    loading.value = false
  }
}

async function loadClientes() {
  try {
    const res = await ClientesAPI.list()
    clientes.value = res.data.data || []
  } catch (error) {
    console.error('Error cargando clientes:', error)
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
    'En preparación': 'badge-info',
    'Listo': 'badge-success',
    'Entregado': 'badge-success',
    'Cancelado': 'badge-danger'
  }
  return classes[estado] || 'badge-secondary'
}

function getEstadoIcon(estado) {
  const icons = {
    'Pendiente': 'bi-clock',
    'En preparación': 'bi-hourglass-split',
    'Listo': 'bi-check-circle',
    'Entregado': 'bi-check-all',
    'Cancelado': 'bi-x-circle'
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
  filters.cliente_id = ''
  filters.sede_id = ''
}

function abrirModalNuevo() {
  router.push('/pedidos/nuevo')
}

function cambiarEstado(item) {
  pedidoSeleccionado.value = item
  nuevoEstado.value = item.estado
  notaEstado.value = ''
  showEstadoModal.value = true
}

function closeEstadoModal() {
  showEstadoModal.value = false
  pedidoSeleccionado.value = null
  nuevoEstado.value = ''
  notaEstado.value = ''
  cambiandoEstado.value = false
}

async function confirmarCambioEstado() {
  if (!nuevoEstado.value || !pedidoSeleccionado.value) return

  cambiandoEstado.value = true
  try {
    await PedidosAPI.cambiarEstado({
      pedido_id: pedidoSeleccionado.value.id,
      estado: nuevoEstado.value,
      nota: notaEstado.value
    })
    Swal.fire('Éxito', 'Estado actualizado correctamente', 'success')
    await loadData()
    closeEstadoModal()
  } catch (error) {
    const msg = error.response?.data?.message || 'No se pudo cambiar el estado'
    Swal.fire('Error', msg, 'error')
  } finally {
    cambiandoEstado.value = false
  }
}

async function cancelarPedido(item) {
  const result = await Swal.fire({
    title: 'Cancelar Pedido',
    text: `¿Estás seguro de cancelar el pedido #${item.numero_pedido || item.id}?`,
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
      confirmButtonText: 'Cancelar Pedido',
      cancelButtonText: 'Volver'
    })

    if (motivo !== undefined) {
      try {
        await PedidosAPI.cancelar(item.id, motivo || 'Cancelado por usuario')
        Swal.fire('Pedido cancelado', 'El pedido ha sido cancelado exitosamente', 'success')
        await loadData()
      } catch (error) {
        const msg = error.response?.data?.message || 'No se pudo cancelar el pedido'
        Swal.fire('Error', msg, 'error')
      }
    }
  }
}

async function duplicarPedido(item) {
  const result = await Swal.fire({
    title: 'Duplicar Pedido',
    text: `¿Deseas duplicar el pedido #${item.numero_pedido || item.id}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#22c55e',
    confirmButtonText: 'Sí, Duplicar',
    cancelButtonText: 'No'
  })

  if (result.isConfirmed) {
    try {
      const response = await PedidosAPI.duplicar(item.id)
      if (response.data.success) {
        Swal.fire('Éxito', 'Pedido duplicado correctamente', 'success')
        await loadData()
        const nuevoPedido = response.data.data
        if (nuevoPedido) {
          router.push(`/pedidos/${nuevoPedido.id}`)
        }
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'No se pudo duplicar el pedido'
      Swal.fire('Error', msg, 'error')
    }
  }
}

// ===== LIFECYCLE =====
onMounted(() => {
  loadSedes()
  loadClientes()
  loadData()
})
</script>

<style scoped>
/* Estilos iguales a los de KardexView.vue - se omiten por espacio */
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
.stat-icon.bg-info { background: #0891b2; }
.stat-icon.bg-success { background: #22c55e; }
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
.badge-tipo { background: #f3f4f6; color: #6b7280; }
.numero-pedido { font-weight: 700; color: #2F6FED; font-size: 14px; }
.total-pedido { font-weight: 700; color: #E85D3A; font-size: 15px; }
.cliente-info { display: flex; flex-direction: column; }
.cliente-info strong { font-size: 14px; color: #111827; }
.cliente-info small { font-size: 11px; color: #6b7280; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 8px 18px; border: none; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s ease; text-decoration: none; font-family: inherit; white-space: nowrap; }
.btn-primary { background: #2F6FED; color: #ffffff; }
.btn-primary:hover:not(:disabled) { background: #1a5adf; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(47,111,237,0.3); }
.btn-outline-secondary { background: transparent; color: #6b7280; border: 1.5px solid #d1d5db; }
.btn-outline-secondary:hover { background: #f9fafb; border-color: #9ca3af; }
.btn-secondary { background: #e5e7eb; color: #374151; }
.btn-secondary:hover { background: #d1d5db; }
.btn-warning { background: #d97706; color: #ffffff; }
.btn-warning:hover { background: #b45309; }
.btn-danger { background: #dc2626; color: #ffffff; }
.btn-danger:hover { background: #b91c1c; }
.btn-success { background: #22c55e; color: #ffffff; }
.btn-success:hover { background: #16a34a; }
.btn-icon { width: 32px; height: 32px; padding: 0; border-radius: 6px; border: 1px solid #e5e7eb; background: transparent; color: #6b7280; transition: all 0.2s ease; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
.btn-icon:hover:not(:disabled) { background: #f3f4f6; border-color: #d1d5db; }
.btn-icon.btn-primary { color: #2F6FED; border-color: #dbeafe; }
.btn-icon.btn-primary:hover { background: #dbeafe; border-color: #2F6FED; }
.btn-icon.btn-info { color: #0891b2; border-color: #cffafe; }
.btn-icon.btn-info:hover { background: #cffafe; border-color: #0891b2; }
.btn-icon.btn-warning { color: #d97706; border-color: #fef3c7; }
.btn-icon.btn-warning:hover { background: #fef3c7; border-color: #d97706; }
.btn-icon.btn-danger { color: #dc2626; border-color: #fecaca; }
.btn-icon.btn-danger:hover { background: #fecaca; border-color: #dc2626; }
.btn-icon.btn-success { color: #16a34a; border-color: #dcfce7; }
.btn-icon.btn-success:hover { background: #dcfce7; border-color: #16a34a; }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-group { display: inline-flex; gap: 4px; align-items: center; }
.btn-close { background: none; border: none; font-size: 28px; cursor: pointer; color: #6b7280; padding: 0 8px; line-height: 1; transition: color 0.2s; }
.btn-close:hover { color: #111827; }
.spin { animation: spin 1s linear infinite; }
.spinner { width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top: 4px solid #2F6FED; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.form-control { width: 100%; padding: 8px 14px; border: 1.5px solid #d1d5db; border-radius: 8px; font-size: 14px; font-family: inherit; transition: all 0.2s ease; background: #ffffff; color: #111827; }
.form-control:focus { outline: none; border-color: #2F6FED; box-shadow: 0 0 0 3px rgba(47,111,237,0.08); }
.field-group { margin-bottom: 14px; }
.field-group label { display: flex; align-items: center; gap: 6px; font-weight: 500; font-size: 13px; color: #374151; margin-bottom: 4px; }
.required { color: #ef4444; font-weight: 700; margin-left: 2px; }
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.2s ease; backdrop-filter: blur(4px); }
.modal { background: #ffffff; border-radius: 16px; max-width: 500px; width: 92%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3); animation: slideIn 0.3s ease; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; border-bottom: 1px solid #e5e7eb; }
.modal-header h3 { margin: 0; font-size: 18px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 8px; }
.modal-body { padding: 24px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid #e5e7eb; }
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