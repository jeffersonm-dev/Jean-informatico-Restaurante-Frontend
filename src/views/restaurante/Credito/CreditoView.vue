<!-- src/views/restaurante/Credito/CreditoView.vue -->
<template>
  <div class="page-container">
    <!-- HEADER -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-title">
          <i class="bi bi-credit-card"></i>
          <div>
            <h1>Créditos</h1>
            <p class="text-muted">Gestiona los créditos de tus clientes</p>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn btn-outline-secondary" @click="loadData" title="Actualizar">
          <i class="bi bi-arrow-clockwise" :class="{ spin: loading }"></i>
        </button>
        <button class="btn btn-primary" @click="$router.push('/creditos/nuevo')">
          <i class="bi bi-plus-circle"></i> Nuevo Crédito
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
            placeholder="Cliente, referencia..."
            @input="applyFilters"
            class="form-control"
          >
        </div>
        <div class="filter-item">
          <label><i class="bi bi-tag"></i> Estado</label>
          <select v-model="filters.estado" @change="applyFilters" class="form-control">
            <option value="">Todos</option>
            <option value="Activo">Activo</option>
            <option value="Pagado">Pagado</option>
            <option value="Vencido">Vencido</option>
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
          <i class="bi bi-credit-card"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ totalRecords }}</span>
          <span class="stat-label">Total Créditos</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon bg-success">
          <i class="bi bi-check-circle"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ creditosActivos }}</span>
          <span class="stat-label">Activos</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon bg-danger">
          <i class="bi bi-exclamation-circle"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ creditosVencidos }}</span>
          <span class="stat-label">Vencidos</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon bg-warning">
          <i class="bi bi-clock"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ creditosPorVencer }}</span>
          <span class="stat-label">Por Vencer</span>
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
              <th>Cliente</th>
              <th>Total</th>
              <th>Pagado</th>
              <th>Saldo</th>
              <th>Cuotas</th>
              <th>Estado</th>
              <th>Fecha Venc.</th>
              <th>Sede</th>
              <th class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredItems" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="cliente-info">
                  <strong>{{ item.cliente_nombre || 'N/A' }}</strong>
                  <small v-if="item.cliente_telefono" class="text-muted">
                    <i class="bi bi-telephone"></i> {{ item.cliente_telefono }}
                  </small>
                </div>
              </td>
              <td>
                <span class="total-credito">S/ {{ formatCurrency(item.monto_total) }}</span>
              </td>
              <td>S/ {{ formatCurrency(item.monto_pagado) }}</td>
              <td>
                <span class="saldo-pendiente" :class="getSaldoClass(item)">
                  S/ {{ formatCurrency(calcularSaldo(item)) }}
                </span>
              </td>
              <td>{{ item.cuotas_pagadas || 0 }}/{{ item.cuotas || 0 }}</td>
              <td>
                <span class="badge" :class="getEstadoClass(item.estado)">
                  <i :class="getEstadoIcon(item.estado)"></i>
                  {{ item.estado }}
                </span>
              </td>
              <td>{{ formatearFecha(item.fecha_vencimiento) }}</td>
              <td>{{ item.sede_nombre || item.sede_id || 'N/A' }}</td>
              <td class="text-end">
                <div class="btn-group">
                  <router-link 
                    :to="`/creditos/${item.id}`" 
                    class="btn btn-icon btn-primary"
                    title="Ver detalle"
                  >
                    <i class="bi bi-eye"></i>
                  </router-link>
                  <router-link 
                    :to="`/creditos/${item.id}/editar`" 
                    class="btn btn-icon btn-info"
                    title="Editar"
                    v-if="item.estado !== 'Pagado' && item.estado !== 'Cancelado'"
                  >
                    <i class="bi bi-pencil"></i>
                  </router-link>
                  <button 
                    @click="abrirModalPago(item)" 
                    class="btn btn-icon btn-success"
                    title="Registrar pago"
                    v-if="item.estado !== 'Pagado' && item.estado !== 'Cancelado'"
                  >
                    <i class="bi bi-cash"></i>
                  </button>
                  <button 
                    @click="verificarVencido(item)" 
                    class="btn btn-icon btn-warning"
                    title="Verificar vencido"
                  >
                    <i class="bi bi-clock"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!filteredItems.length">
              <td colspan="10" class="text-center py-5">
                <i class="bi bi-inbox fs-1 d-block text-muted"></i>
                <p class="text-muted mt-2">No hay créditos registrados</p>
                <button class="btn btn-primary mt-2" @click="$router.push('/creditos/nuevo')">
                  <i class="bi bi-plus-circle"></i> Crear primer crédito
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="loading" class="text-center py-5">
          <div class="spinner"></div>
          <p class="text-muted mt-2">Cargando créditos...</p>
        </div>
      </div>
    </div>

    <!-- MODAL PAGO -->
    <div v-if="showPagoModal" class="modal-overlay" @click.self="closePagoModal">
      <div class="modal">
        <div class="modal-header">
          <h3><i class="bi bi-cash text-success"></i> Registrar Pago</h3>
          <button class="modal-close" @click="closePagoModal">×</button>
        </div>
        <div class="modal-body">
          <p><strong>Cliente:</strong> {{ creditoSeleccionado?.cliente_nombre }}</p>
          <p><strong>Saldo Pendiente:</strong> S/ {{ formatCurrency(calcularSaldo(creditoSeleccionado)) }}</p>
          
          <div class="field-group">
            <label>Monto a Pagar <span class="required">*</span></label>
            <input 
              type="number" 
              v-model="pagoForm.monto" 
              class="form-control"
              step="0.01"
              min="0.01"
              :max="calcularSaldo(creditoSeleccionado)"
              required
              placeholder="0.00"
            >
          </div>

          <div class="field-group">
            <label>Método de Pago <span class="required">*</span></label>
            <select v-model="pagoForm.metodo_pago" class="form-control" required>
              <option value="">Selecciona un método</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta Débito">Tarjeta Débito</option>
              <option value="Tarjeta Crédito">Tarjeta Crédito</option>
              <option value="Pago Móvil">Pago Móvil</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Cashea">Cashea</option>
            </select>
          </div>

          <div class="field-group">
            <label>Referencia</label>
            <input 
              type="text" 
              v-model="pagoForm.referencia" 
              class="form-control"
              placeholder="Número de referencia..."
            >
          </div>

          <div class="field-group">
            <label>Observaciones</label>
            <input 
              type="text" 
              v-model="pagoForm.observaciones" 
              class="form-control"
              placeholder="Observaciones del pago..."
            >
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closePagoModal">Cancelar</button>
          <button class="btn btn-success" @click="confirmarPago" :disabled="pagando || !pagoForm.monto || !pagoForm.metodo_pago">
            <i class="bi" :class="pagando ? 'bi-arrow-repeat spin' : 'bi-cash'"></i>
            {{ pagando ? 'Procesando...' : 'Registrar Pago' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { CreditosAPI, ClientesAPI, SedesAPI } from '@/services/api'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()

// ===== STATE =====
const items = ref([])
const clientes = ref([])
const sedes = ref([])
const loading = ref(false)
const pagando = ref(false)
const totalRecords = ref(0)
const creditoSeleccionado = ref(null)
const showPagoModal = ref(false)

const pagoForm = reactive({
  credito_id: '',
  monto: '',
  metodo_pago: '',
  referencia: '',
  observaciones: '',
  usuario_id: 1
})

// ===== FILTERS =====
const filters = reactive({
  search: '',
  estado: '',
  cliente_id: '',
  sede_id: ''
})

// ===== COMPUTED =====
const creditosActivos = computed(() => items.value.filter(i => i.estado === 'Activo').length)
const creditosVencidos = computed(() => items.value.filter(i => i.estado === 'Vencido').length)
const creditosPorVencer = computed(() => {
  const hoy = new Date()
  const dentro7Dias = new Date()
  dentro7Dias.setDate(hoy.getDate() + 7)
  return items.value.filter(i => {
    if (i.estado !== 'Activo') return false
    const fechaVen = new Date(i.fecha_vencimiento)
    return fechaVen >= hoy && fechaVen <= dentro7Dias
  }).length
})

const filteredItems = computed(() => {
  let result = [...items.value]

  if (filters.search) {
    const search = filters.search.toLowerCase()
    result = result.filter(i =>
      i.cliente_nombre?.toLowerCase().includes(search) ||
      i.referencia_cashea?.toLowerCase().includes(search)
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
function calcularSaldo(item) {
  if (!item) return 0
  return (item.monto_total || 0) - (item.monto_pagado || 0)
}

function getSaldoClass(item) {
  const saldo = calcularSaldo(item)
  if (saldo <= 0) return 'text-success'
  if (item.estado === 'Vencido') return 'text-danger'
  return 'text-warning'
}

async function loadData() {
  loading.value = true
  try {
    const res = await CreditosAPI.list()
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
    console.error('Error cargando créditos:', error)
    Swal.fire('Error', 'No se pudieron cargar los créditos', 'error')
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
    'Activo': 'badge-success',
    'Pagado': 'badge-info',
    'Vencido': 'badge-danger',
    'Cancelado': 'badge-secondary'
  }
  return classes[estado] || 'badge-secondary'
}

function getEstadoIcon(estado) {
  const icons = {
    'Activo': 'bi-check-circle',
    'Pagado': 'bi-check-all',
    'Vencido': 'bi-exclamation-circle',
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
      year: 'numeric'
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

function abrirModalPago(item) {
  const saldo = calcularSaldo(item)
  if (saldo <= 0) {
    Swal.fire('Información', 'Este crédito ya está totalmente pagado', 'info')
    return
  }
  creditoSeleccionado.value = item
  pagoForm.credito_id = item.id
  pagoForm.monto = saldo
  pagoForm.metodo_pago = ''
  pagoForm.referencia = ''
  pagoForm.observaciones = ''
  showPagoModal.value = true
}

function closePagoModal() {
  showPagoModal.value = false
  creditoSeleccionado.value = null
  pagoForm.credito_id = ''
  pagoForm.monto = ''
  pagoForm.metodo_pago = ''
  pagoForm.referencia = ''
  pagoForm.observaciones = ''
  pagando.value = false
}

async function confirmarPago() {
  if (!pagoForm.monto || parseFloat(pagoForm.monto) <= 0) {
    Swal.fire('Error', 'Ingresa un monto válido', 'error')
    return
  }
  if (!pagoForm.metodo_pago) {
    Swal.fire('Error', 'Selecciona un método de pago', 'error')
    return
  }

  const saldo = calcularSaldo(creditoSeleccionado.value)
  if (parseFloat(pagoForm.monto) > saldo) {
    Swal.fire('Error', `El monto no puede exceder el saldo pendiente (S/ ${formatCurrency(saldo)})`, 'error')
    return
  }

  pagando.value = true
  try {
    const payload = {
      credito_id: pagoForm.credito_id,
      monto: parseFloat(pagoForm.monto),
      metodo_pago: pagoForm.metodo_pago,
      referencia: pagoForm.referencia || '',
      observaciones: pagoForm.observaciones || '',
      usuario_id: pagoForm.usuario_id || 1
    }

    await CreditosAPI.registrarPago(payload)
    Swal.fire('Éxito', 'Pago registrado correctamente', 'success')
    await loadData()
    closePagoModal()
  } catch (error) {
    const msg = error.response?.data?.message || 'No se pudo registrar el pago'
    Swal.fire('Error', msg, 'error')
  } finally {
    pagando.value = false
  }
}

async function verificarVencido(item) {
  try {
    await CreditosAPI.verificarVencidos()
    Swal.fire('Éxito', 'Verificación de vencidos completada', 'success')
    await loadData()
  } catch (error) {
    const msg = error.response?.data?.message || 'Error al verificar vencidos'
    Swal.fire('Error', msg, 'error')
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
.badge-info { background: #dbeafe; color: #2563eb; }
.badge-danger { background: #fecaca; color: #dc2626; }
.badge-secondary { background: #f3f4f6; color: #6b7280; }
.cliente-info { display: flex; flex-direction: column; }
.cliente-info strong { font-size: 14px; color: #111827; }
.cliente-info small { font-size: 11px; color: #6b7280; }
.total-credito { font-weight: 700; color: #E85D3A; font-size: 15px; }
.saldo-pendiente { font-weight: 700; font-size: 14px; }
.text-success { color: #16a34a; }
.text-danger { color: #dc2626; }
.text-warning { color: #d97706; }
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
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-group { display: inline-flex; gap: 4px; align-items: center; }
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.2s ease; backdrop-filter: blur(4px); }
.modal { background: #ffffff; border-radius: 16px; max-width: 500px; width: 92%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3); animation: slideIn 0.3s ease; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; border-bottom: 1px solid #e5e7eb; }
.modal-header h3 { margin: 0; font-size: 18px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 8px; }
.modal-body { padding: 24px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid #e5e7eb; }
.modal-close { background: none; border: none; font-size: 28px; cursor: pointer; color: #6b7280; padding: 0 8px; line-height: 1; transition: color 0.2s; }
.modal-close:hover { color: #111827; }
.field-group { margin-bottom: 14px; }
.field-group label { display: flex; align-items: center; gap: 6px; font-weight: 500; font-size: 13px; color: #374151; margin-bottom: 4px; }
.required { color: #ef4444; font-weight: 700; margin-left: 2px; }
.form-control { width: 100%; padding: 8px 14px; border: 1.5px solid #d1d5db; border-radius: 8px; font-size: 14px; font-family: inherit; transition: all 0.2s ease; background: #ffffff; color: #111827; }
.form-control:focus { outline: none; border-color: #2F6FED; box-shadow: 0 0 0 3px rgba(47,111,237,0.08); }
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