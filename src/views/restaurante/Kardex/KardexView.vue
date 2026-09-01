<!-- src/views/restaurante/Kardex/KardexView.vue -->
<template>
  <div class="page-container">
    <!-- HEADER -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-title">
          <i class="bi bi-archive"></i>
          <div>
            <h1>Kardex</h1>
            <p class="text-muted">Gestiona los movimientos de inventario</p>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn btn-outline-secondary" @click="loadData" title="Actualizar">
          <i class="bi bi-arrow-clockwise" :class="{ spin: loading }"></i>
        </button>
        <button class="btn btn-primary" @click="abrirModalNuevo">
          <i class="bi bi-plus-circle"></i> Nuevo Movimiento
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
            placeholder="Tipo, motivo, documento..."
            @input="applyFilters"
            class="form-control"
          >
        </div>
        <div class="filter-item">
          <label><i class="bi bi-tag"></i> Tipo</label>
          <select v-model="filters.tipo" @change="applyFilters" class="form-control">
            <option value="">Todos</option>
            <option value="Entrada">Entrada</option>
            <option value="Salida">Salida</option>
            <option value="Ajuste">Ajuste</option>
            <option value="Devolucion">Devolución</option>
          </select>
        </div>
        <div class="filter-item">
          <label><i class="bi bi-box"></i> Producto</label>
          <select v-model="filters.producto_id" @change="applyFilters" class="form-control">
            <option value="">Todos</option>
            <option v-for="p in productos" :key="p.id" :value="p.id">
              {{ p.nombre }}
            </option>
          </select>
        </div>
        <div class="filter-item">
          <label><i class="bi bi-cup-straw"></i> Ingrediente</label>
          <select v-model="filters.ingrediente_id" @change="applyFilters" class="form-control">
            <option value="">Todos</option>
            <option v-for="i in ingredientes" :key="i.id" :value="i.id">
              {{ i.nombre }}
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
          <i class="bi bi-archive"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ totalRecords }}</span>
          <span class="stat-label">Total Movimientos</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon bg-success">
          <i class="bi bi-arrow-up-circle"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ movimientosEntrada }}</span>
          <span class="stat-label">Entradas</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon bg-danger">
          <i class="bi bi-arrow-down-circle"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ movimientosSalida }}</span>
          <span class="stat-label">Salidas</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon bg-warning">
          <i class="bi bi-pencil"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ movimientosAjuste }}</span>
          <span class="stat-label">Ajustes/Devoluciones</span>
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
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Producto/Ingrediente</th>
              <th>Cantidad</th>
              <th>Precio Unit.</th>
              <th>Costo Total</th>
              <th>Saldo</th>
              <th>Motivo</th>
              <th>Documento</th>
              <th>Usuario</th>
              <th class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredItems" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>{{ formatearFecha(item.fecha_movimiento) }}</td>
              <td>
                <span class="badge" :class="getTipoClass(item.tipo_movimiento)">
                  <i :class="getTipoIcon(item.tipo_movimiento)"></i>
                  {{ item.tipo_movimiento }}
                </span>
              </td>
              <td>
                <div class="item-info">
                  <strong>{{ item.producto_nombre || item.ingrediente_nombre || 'N/A' }}</strong>
                  <small v-if="item.producto_codigo || item.ingrediente_codigo" class="text-muted">
                    Cód: {{ item.producto_codigo || item.ingrediente_codigo }}
                  </small>
                </div>
              </td>
              <td>
                <span class="quantity" :class="getCantidadClass(item.tipo_movimiento)">
                  {{ item.tipo_movimiento === 'Salida' || item.tipo_movimiento === 'Ajuste' ? '-' : '+' }}
                  {{ formatNumber(item.cantidad) }}
                </span>
              </td>
              <td>{{ formatCurrency(item.precio_unitario) }}</td>
              <td>{{ formatCurrency(item.costo_total) }}</td>
              <td>
                <span class="stock-value">{{ formatNumber(item.saldo_nuevo) }}</span>
              </td>
              <td>
                <span class="motivo-text">{{ item.motivo || 'N/A' }}</span>
              </td>
              <td>
                <span class="badge badge-documento">
                  {{ item.documento_tipo || 'N/A' }}
                  <small v-if="item.documento_id">#{{ item.documento_id }}</small>
                </span>
              </td>
              <td>{{ item.usuario_nombre || item.usuario_id || 'N/A' }}</td>
              <td class="text-end">
                <div class="btn-group">
                  <button 
                    @click="verDetalle(item)" 
                    class="btn btn-icon btn-primary"
                    title="Ver detalle"
                  >
                    <i class="bi bi-eye"></i>
                  </button>
                  <button 
                    @click="eliminar(item)" 
                    class="btn btn-icon btn-danger"
                    title="Eliminar"
                    v-if="canDelete(item)"
                  >
                    <i class="bi bi-trash3"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!filteredItems.length">
              <td colspan="12" class="text-center py-5">
                <i class="bi bi-inbox fs-1 d-block text-muted"></i>
                <p class="text-muted mt-2">No hay movimientos registrados</p>
                <button class="btn btn-primary mt-2" @click="abrirModalNuevo">
                  <i class="bi bi-plus-circle"></i> Registrar primer movimiento
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="loading" class="text-center py-5">
          <div class="spinner"></div>
          <p class="text-muted mt-2">Cargando movimientos...</p>
        </div>
      </div>
    </div>

    <!-- MODAL NUEVO MOVIMIENTO -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal modal-lg">
        <div class="modal-header">
          <h3><i class="bi bi-plus-circle text-primary"></i> Nuevo Movimiento</h3>
          <button class="modal-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="guardarMovimiento">
            <!-- Tipo de Movimiento -->
            <div class="row">
              <div class="col-md-6">
                <div class="field-group">
                  <label><i class="bi bi-tag"></i> Tipo de Movimiento <span class="required">*</span></label>
                  <select v-model="nuevoMovimiento.tipo_movimiento" class="form-control" required>
                    <option value="">Selecciona un tipo</option>
                    <option value="Entrada">Entrada</option>
                    <option value="Salida">Salida</option>
                    <option value="Ajuste">Ajuste</option>
                    <option value="Devolucion">Devolución</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="field-group">
                  <label><i class="bi bi-building"></i> Sede <span class="required">*</span></label>
                  <select v-model="nuevoMovimiento.sede_id" class="form-control" required>
                    <option value="">Selecciona una sede</option>
                    <option v-for="sede in sedes" :key="sede.id" :value="sede.id">
                      {{ sede.nombre }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Producto o Ingrediente - RADIO BUTTONS -->
            <div class="row">
              <div class="col-md-12">
                <div class="field-group">
                  <label><i class="bi bi-box"></i> Seleccionar tipo de item <span class="required">*</span></label>
                  <div class="radio-group">
                    <label class="radio-label">
                      <input type="radio" v-model="nuevoMovimiento.tipo_item" value="producto">
                      <span><i class="bi bi-box"></i> Producto</span>
                    </label>
                    <label class="radio-label">
                      <input type="radio" v-model="nuevoMovimiento.tipo_item" value="ingrediente">
                      <span><i class="bi bi-cup-straw"></i> Ingrediente</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Producto (si se seleccionó) -->
            <div class="row" v-if="nuevoMovimiento.tipo_item === 'producto'">
              <div class="col-md-12">
                <div class="field-group">
                  <label><i class="bi bi-box"></i> Producto <span class="required">*</span></label>
                  <select v-model="nuevoMovimiento.producto_id" class="form-control" required>
                    <option value="">Selecciona un producto</option>
                    <option v-for="p in productos" :key="p.id" :value="p.id">
                      {{ p.nombre }} ({{ p.codigo }})
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Ingrediente (si se seleccionó) -->
            <div class="row" v-if="nuevoMovimiento.tipo_item === 'ingrediente'">
              <div class="col-md-12">
                <div class="field-group">
                  <label><i class="bi bi-cup-straw"></i> Ingrediente <span class="required">*</span></label>
                  <select v-model="nuevoMovimiento.ingrediente_id" class="form-control" required>
                    <option value="">Selecciona un ingrediente</option>
                    <option v-for="i in ingredientes" :key="i.id" :value="i.id">
                      {{ i.nombre }} ({{ i.codigo }})
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Cantidad y Precio -->
            <div class="row">
              <div class="col-md-4">
                <div class="field-group">
                  <label><i class="bi bi-sort-numeric-up"></i> Cantidad <span class="required">*</span></label>
                  <input 
                    type="number" 
                    v-model="nuevoMovimiento.cantidad" 
                    class="form-control"
                    step="0.01"
                    min="0.01"
                    required
                  >
                </div>
              </div>
              <div class="col-md-4">
                <div class="field-group">
                  <label><i class="bi bi-coin"></i> Precio Unitario</label>
                  <input 
                    type="number" 
                    v-model="nuevoMovimiento.precio_unitario" 
                    class="form-control"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  >
                </div>
              </div>
              <div class="col-md-4">
                <div class="field-group">
                  <label><i class="bi bi-calculator"></i> Costo Total</label>
                  <input 
                    type="text" 
                    :value="calcularCostoTotal" 
                    class="form-control"
                    disabled
                  >
                </div>
              </div>
            </div>

            <!-- Motivo y Documento -->
            <div class="row">
              <div class="col-md-6">
                <div class="field-group">
                  <label><i class="bi bi-file-text"></i> Motivo</label>
                  <input 
                    type="text" 
                    v-model="nuevoMovimiento.motivo" 
                    class="form-control"
                    placeholder="Ej: Compra de inventario"
                  >
                </div>
              </div>
              <div class="col-md-6">
                <div class="field-group">
                  <label><i class="bi bi-file-earmark"></i> Documento</label>
                  <div class="row-inline">
                    <div class="col-half">
                      <select v-model="nuevoMovimiento.documento_tipo" class="form-control">
                        <option value="">Tipo</option>
                        <option value="Compra">Compra</option>
                        <option value="Pedido">Pedido</option>
                        <option value="Inventario">Inventario</option>
                        <option value="Ajuste">Ajuste</option>
                      </select>
                    </div>
                    <div class="col-half">
                      <input 
                        type="number" 
                        v-model="nuevoMovimiento.documento_id" 
                        class="form-control"
                        placeholder="ID"
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Fecha y Observaciones -->
            <div class="row">
              <div class="col-md-6">
                <div class="field-group">
                  <label><i class="bi bi-calendar"></i> Fecha del Movimiento</label>
                  <input 
                    type="datetime-local" 
                    v-model="nuevoMovimiento.fecha_movimiento" 
                    class="form-control"
                  >
                </div>
              </div>
              <div class="col-md-6">
                <div class="field-group">
                  <label><i class="bi bi-chat"></i> Observaciones</label>
                  <input 
                    type="text" 
                    v-model="nuevoMovimiento.observaciones" 
                    class="form-control"
                    placeholder="Observaciones adicionales..."
                  >
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">Cancelar</button>
          <button class="btn btn-primary" @click="guardarMovimiento" :disabled="saving">
            <i class="bi" :class="saving ? 'bi-arrow-repeat spin' : 'bi-save'"></i>
            {{ saving ? 'Guardando...' : 'Guardar Movimiento' }}
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL DETALLE -->
    <div v-if="showDetailModal" class="modal-overlay" @click.self="closeDetailModal">
      <div class="modal">
        <div class="modal-header">
          <h3><i class="bi bi-file-text text-primary"></i> Detalle del Movimiento</h3>
          <button class="modal-close" @click="closeDetailModal">×</button>
        </div>
        <div class="modal-body">
          <div v-if="selectedItem" class="detail-content">
            <div class="detail-row">
              <span class="detail-label">ID:</span>
              <span class="detail-value">#{{ selectedItem.id }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Fecha:</span>
              <span class="detail-value">{{ formatearFechaCompleta(selectedItem.fecha_movimiento) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Tipo:</span>
              <span class="badge" :class="getTipoClass(selectedItem.tipo_movimiento)">
                {{ selectedItem.tipo_movimiento }}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Producto:</span>
              <span class="detail-value">{{ selectedItem.producto_nombre || 'N/A' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Ingrediente:</span>
              <span class="detail-value">{{ selectedItem.ingrediente_nombre || 'N/A' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Cantidad:</span>
              <span class="detail-value">{{ formatNumber(selectedItem.cantidad) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Precio Unitario:</span>
              <span class="detail-value">{{ formatCurrency(selectedItem.precio_unitario) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Costo Total:</span>
              <span class="detail-value">{{ formatCurrency(selectedItem.costo_total) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Saldo Anterior:</span>
              <span class="detail-value">{{ formatNumber(selectedItem.saldo_anterior) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Saldo Nuevo:</span>
              <span class="detail-value">{{ formatNumber(selectedItem.saldo_nuevo) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Motivo:</span>
              <span class="detail-value">{{ selectedItem.motivo || 'N/A' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Documento:</span>
              <span class="detail-value">{{ selectedItem.documento_tipo || 'N/A' }} {{ selectedItem.documento_id ? '#' + selectedItem.documento_id : '' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Usuario:</span>
              <span class="detail-value">{{ selectedItem.usuario_nombre || selectedItem.usuario_id || 'N/A' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Sede:</span>
              <span class="detail-value">{{ selectedItem.sede_nombre || selectedItem.sede_id || 'N/A' }}</span>
            </div>
            <div class="detail-row" v-if="selectedItem.observaciones">
              <span class="detail-label">Observaciones:</span>
              <span class="detail-value">{{ selectedItem.observaciones }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeDetailModal">Cerrar</button>
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
            ¿Está seguro que desea eliminar el movimiento <strong>#{{ itemAEliminar?.id }}</strong>?
          </p>
          <div class="modal-warning">
            <p>
              <i class="bi bi-exclamation-circle"></i>
              Esta acción no se puede deshacer y afectará los saldos del inventario.
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
import { KardexAPI, ProductosAPI, IngredientesAPI, SedesAPI } from '@/services/api'
import Swal from 'sweetalert2'

// ===== STATE =====
const items = ref([])
const productos = ref([])
const ingredientes = ref([])
const sedes = ref([])
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const totalRecords = ref(0)
const selectedItem = ref(null)
const itemAEliminar = ref(null)
const showModal = ref(false)
const showDetailModal = ref(false)
const showDeleteModal = ref(false)

// ===== FILTERS =====
const filters = reactive({
  search: '',
  tipo: '',
  producto_id: '',
  ingrediente_id: '',
  sede_id: ''
})

// ===== NUEVO MOVIMIENTO =====
const nuevoMovimiento = reactive({
  tipo_movimiento: '',
  tipo_item: 'producto',
  producto_id: '',
  ingrediente_id: '',
  cantidad: '',
  precio_unitario: '',
  costo_total: 0,
  saldo_anterior: 0,
  saldo_nuevo: 0,
  costo_promedio_anterior: 0,
  costo_promedio_nuevo: 0,
  motivo: '',
  documento_tipo: '',
  documento_id: '',
  referencia_id: '',
  usuario_id: 1,
  sede_id: '',
  fecha_movimiento: '',
  observaciones: '',
  ip_address: ''
})

// ===== COMPUTED =====
const movimientosEntrada = computed(() => items.value.filter(i => i.tipo_movimiento === 'Entrada').length)
const movimientosSalida = computed(() => items.value.filter(i => i.tipo_movimiento === 'Salida').length)
const movimientosAjuste = computed(() => items.value.filter(i => i.tipo_movimiento === 'Ajuste' || i.tipo_movimiento === 'Devolucion').length)

const calcularCostoTotal = computed(() => {
  const cantidad = parseFloat(nuevoMovimiento.cantidad) || 0
  const precio = parseFloat(nuevoMovimiento.precio_unitario) || 0
  return (cantidad * precio).toFixed(2)
})

const filteredItems = computed(() => {
  let result = [...items.value]

  if (filters.search) {
    const search = filters.search.toLowerCase()
    result = result.filter(i =>
      i.tipo_movimiento?.toLowerCase().includes(search) ||
      i.motivo?.toLowerCase().includes(search) ||
      i.producto_nombre?.toLowerCase().includes(search) ||
      i.ingrediente_nombre?.toLowerCase().includes(search) ||
      i.documento_tipo?.toLowerCase().includes(search)
    )
  }

  if (filters.tipo) {
    result = result.filter(i => i.tipo_movimiento === filters.tipo)
  }

  if (filters.producto_id) {
    result = result.filter(i => i.producto_id === parseInt(filters.producto_id))
  }

  if (filters.ingrediente_id) {
    result = result.filter(i => i.ingrediente_id === parseInt(filters.ingrediente_id))
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
    const res = await KardexAPI.list()
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
    console.error('Error cargando movimientos:', error)
    Swal.fire('Error', 'No se pudieron cargar los movimientos', 'error')
    items.value = []
    totalRecords.value = 0
  } finally {
    loading.value = false
  }
}

async function loadProductos() {
  try {
    const res = await ProductosAPI.list()
    productos.value = res.data.data || []
  } catch (error) {
    console.error('Error cargando productos:', error)
  }
}

async function loadIngredientes() {
  try {
    const res = await IngredientesAPI.list()
    ingredientes.value = res.data.data || []
  } catch (error) {
    console.error('Error cargando ingredientes:', error)
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

function getTipoClass(tipo) {
  const classes = {
    'Entrada': 'badge-success',
    'Salida': 'badge-danger',
    'Ajuste': 'badge-warning',
    'Devolucion': 'badge-info'
  }
  return classes[tipo] || 'badge-secondary'
}

function getTipoIcon(tipo) {
  const icons = {
    'Entrada': 'bi-arrow-up-circle',
    'Salida': 'bi-arrow-down-circle',
    'Ajuste': 'bi-pencil',
    'Devolucion': 'bi-arrow-return-left'
  }
  return icons[tipo] || 'bi-circle'
}

function getCantidadClass(tipo) {
  return tipo === 'Entrada' ? 'text-success' : 'text-danger'
}

function canDelete(item) {
  if (!item) return false
  const fecha = new Date(item.fecha_movimiento)
  const ahora = new Date()
  const diff = (ahora - fecha) / (1000 * 60 * 60 * 24)
  return diff < 1
}

function formatNumber(value) {
  if (value === null || value === undefined) return '0'
  return new Intl.NumberFormat('es-VE').format(value)
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
      minute: '2-digit',
      second: '2-digit'
    })
  } catch {
    return fecha
  }
}

function applyFilters() {}

function clearFilters() {
  filters.search = ''
  filters.tipo = ''
  filters.producto_id = ''
  filters.ingrediente_id = ''
  filters.sede_id = ''
}

function abrirModalNuevo() {
  Object.assign(nuevoMovimiento, {
    tipo_movimiento: '',
    tipo_item: 'producto',
    producto_id: '',
    ingrediente_id: '',
    cantidad: '',
    precio_unitario: '',
    costo_total: 0,
    saldo_anterior: 0,
    saldo_nuevo: 0,
    costo_promedio_anterior: 0,
    costo_promedio_nuevo: 0,
    motivo: '',
    documento_tipo: '',
    documento_id: '',
    referencia_id: '',
    usuario_id: 1,
    sede_id: '',
    fecha_movimiento: new Date().toISOString().slice(0, 16),
    observaciones: '',
    ip_address: ''
  })
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function guardarMovimiento() {
  // Validar tipo de movimiento
  if (!nuevoMovimiento.tipo_movimiento) {
    Swal.fire('Error', 'Selecciona un tipo de movimiento', 'error')
    return
  }

  // Validar cantidad
  if (!nuevoMovimiento.cantidad || parseFloat(nuevoMovimiento.cantidad) <= 0) {
    Swal.fire('Error', 'La cantidad debe ser mayor a 0', 'error')
    return
  }

  // Validar sede
  if (!nuevoMovimiento.sede_id) {
    Swal.fire('Error', 'Selecciona una sede', 'error')
    return
  }

  // ✅ Validar que tenga producto o ingrediente (SOLO UNO)
  const tieneProducto = nuevoMovimiento.producto_id && nuevoMovimiento.producto_id !== ''
  const tieneIngrediente = nuevoMovimiento.ingrediente_id && nuevoMovimiento.ingrediente_id !== ''

  if (!tieneProducto && !tieneIngrediente) {
    Swal.fire('Error', 'Selecciona un producto o un ingrediente', 'error')
    return
  }

  if (tieneProducto && tieneIngrediente) {
    Swal.fire('Error', 'Selecciona solo un producto o un ingrediente, no ambos', 'error')
    return
  }

  saving.value = true
  try {
    const payload = {
      tipo_movimiento: nuevoMovimiento.tipo_movimiento,
      cantidad: parseFloat(nuevoMovimiento.cantidad),
      precio_unitario: parseFloat(nuevoMovimiento.precio_unitario) || 0,
      costo_total: parseFloat(calcularCostoTotal.value) || 0,
      motivo: nuevoMovimiento.motivo || '',
      documento_tipo: nuevoMovimiento.documento_tipo || '',
      documento_id: nuevoMovimiento.documento_id ? parseInt(nuevoMovimiento.documento_id) : null,
      referencia_id: nuevoMovimiento.referencia_id || null,
      usuario_id: nuevoMovimiento.usuario_id || 1,
      sede_id: parseInt(nuevoMovimiento.sede_id),
      fecha_movimiento: nuevoMovimiento.fecha_movimiento || new Date().toISOString(),
      observaciones: nuevoMovimiento.observaciones || '',
      saldo_anterior: 0,
      saldo_nuevo: 0
    }

    // ✅ Enviar SOLO UNO: producto_id O ingrediente_id
    if (tieneProducto) {
      payload.producto_id = parseInt(nuevoMovimiento.producto_id)
    } else if (tieneIngrediente) {
      payload.ingrediente_id = parseInt(nuevoMovimiento.ingrediente_id)
    }

    console.log('📤 Enviando movimiento:', payload)

    await KardexAPI.create(payload)
    Swal.fire('Éxito', 'Movimiento registrado correctamente', 'success')
    await loadData()
    closeModal()
  } catch (error) {
    console.error('Error al guardar movimiento:', error)
    const errorData = error.response?.data
    let msg = 'Error al guardar el movimiento'
    
    if (errorData?.errors) {
      const messages = []
      Object.keys(errorData.errors).forEach(key => {
        if (Array.isArray(errorData.errors[key])) {
          messages.push(...errorData.errors[key])
        } else {
          messages.push(`${key}: ${errorData.errors[key]}`)
        }
      })
      msg = messages.join('\n')
    } else if (errorData?.title) {
      msg = errorData.title
    } else if (errorData?.message) {
      msg = errorData.message
    }
    
    Swal.fire('Error', msg, 'error')
  } finally {
    saving.value = false
  }
}

function verDetalle(item) {
  selectedItem.value = item
  showDetailModal.value = true
}

function closeDetailModal() {
  showDetailModal.value = false
  selectedItem.value = null
}

function eliminar(item) {
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
    await KardexAPI.remove(itemAEliminar.value.id)
    await loadData()
    closeDeleteModal()
    Swal.fire('Eliminado', 'Movimiento eliminado correctamente', 'success')
  } catch (error) {
    const msg = error.response?.data?.message || 'No se pudo eliminar el movimiento'
    Swal.fire('Error', msg, 'error')
  } finally {
    deleting.value = false
  }
}

// ===== LIFECYCLE =====
onMounted(() => {
  loadSedes()
  loadProductos()
  loadIngredientes()
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
.stat-icon.bg-danger { background: #dc2626; }
.stat-icon.bg-warning { background: #d97706; }

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
   BADGES
   ============================================ */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
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

.badge-info {
  background: #dbeafe;
  color: #2563eb;
}

.badge-secondary {
  background: #f3f4f6;
  color: #6b7280;
}

.badge-documento {
  background: #f3f4f6;
  color: #6b7280;
  font-weight: 400;
}

/* ============================================
   ITEM INFO
   ============================================ */
.item-info {
  display: flex;
  flex-direction: column;
}

.item-info strong {
  font-size: 14px;
  color: #111827;
}

.item-info small {
  font-size: 11px;
  color: #6b7280;
}

.quantity {
  font-weight: 700;
  font-size: 14px;
}

.text-success { color: #16a34a; }
.text-danger { color: #dc2626; }
.text-muted { color: #6b7280; }

.stock-value {
  font-weight: 600;
  color: #2F6FED;
}

.motivo-text {
  font-size: 13px;
  color: #4b5563;
  max-width: 120px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ============================================
   RADIO GROUP
   ============================================ */
.radio-group {
  display: flex;
  gap: 24px;
  padding-top: 4px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  color: #374151;
}

.radio-label input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #2F6FED;
}

.radio-label input[type="radio"]:disabled {
  accent-color: #9ca3af;
  cursor: not-allowed;
}

.radio-label span {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* ============================================
   FORM
   ============================================ */
.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 8px;
}

.col-md-12 { grid-column: span 2; }
.col-md-6 { grid-column: span 1; }
.col-md-4 { grid-column: span 1; }
.col-md-3 { grid-column: span 1; }

.row-inline {
  display: flex;
  gap: 10px;
}

.col-half {
  flex: 1;
}

@media (max-width: 768px) {
  .row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .col-md-12, .col-md-6, .col-md-4, .col-md-3 {
    grid-column: span 1;
  }
  .row-inline {
    flex-direction: column;
  }
}

.field-group {
  margin-bottom: 14px;
}

.field-group label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  font-size: 13px;
  color: #374151;
  margin-bottom: 4px;
}

.field-group label i {
  color: #9ca3af;
  font-size: 14px;
}

.required {
  color: #ef4444;
  font-weight: 700;
  margin-left: 2px;
}

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

.form-control:disabled {
  background: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

textarea.form-control {
  resize: vertical;
}

/* ============================================
   BUTTONS
   ============================================ */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 18px;
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

.btn-primary:hover:not(:disabled) {
  background: #1a5adf;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(47, 111, 237, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover {
  background: #d1d5db;
}

.btn-danger {
  background: #dc2626;
  color: #ffffff;
}

.btn-danger:hover:not(:disabled) {
  background: #b91c1c;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.btn-icon.btn-primary {
  color: #2F6FED;
  border-color: #dbeafe;
}

.btn-icon.btn-primary:hover:not(:disabled) {
  background: #dbeafe;
  border-color: #2F6FED;
}

.btn-icon.btn-danger {
  color: #dc2626;
  border-color: #fecaca;
}

.btn-icon.btn-danger:hover:not(:disabled) {
  background: #fecaca;
  border-color: #dc2626;
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
  max-width: 700px;
  width: 92%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease;
}

.modal-lg {
  max-width: 900px;
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
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
}

.modal-icon {
  font-size: 48px;
  margin-bottom: 16px;
  text-align: center;
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

/* ============================================
   DETAIL
   ============================================ */
.detail-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #6b7280;
  font-size: 13px;
}

.detail-value {
  color: #111827;
  font-size: 14px;
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

  .modal-lg {
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

  .table thead th {
    font-size: 10px;
    padding: 8px 10px;
  }

  .table tbody td {
    font-size: 13px;
    padding: 8px 10px;
  }

  .radio-group {
    gap: 12px;
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

  .badge {
    font-size: 10px;
    padding: 2px 8px;
  }

  .btn {
    font-size: 13px;
    padding: 7px 14px;
  }

  .radio-label {
    font-size: 13px;
  }
}
</style>