<!-- src/views/restaurante/Pedido/PedidoFormView.vue -->
<template>
  <div class="page-container">
    <!-- HEADER -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-title">
          <i class="bi bi-cart-plus"></i>
          <div>
            <h1>{{ isEditing ? 'Editar Pedido' : 'Nuevo Pedido' }}</h1>
            <p class="text-muted">
              {{ isEditing ? 'Modifica los datos del pedido' : 'Registra un nuevo pedido' }}
            </p>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <router-link to="/pedidos" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left"></i> Volver
        </router-link>
      </div>
    </div>

    <!-- FORMULARIO -->
    <div class="form-card">
      <form @submit.prevent="handleSubmit" novalidate>
        <!-- DATOS DEL PEDIDO -->
        <div class="form-section">
          <h3 class="section-title">
            <i class="bi bi-info-circle"></i>
            Datos del Pedido
          </h3>
          <div class="row">
            <div class="col-md-4">
              <div class="field-group">
                <label>Tipo de Pedido <span class="required">*</span></label>
                <select v-model="form.tipo_pedido" class="form-control" required>
                  <option value="">Selecciona un tipo</option>
                  <option value="Mesa">Mesa</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Para llevar">Para llevar</option>
                </select>
              </div>
            </div>
            <div class="col-md-4">
              <div class="field-group">
                <label>Cliente <span class="required">*</span></label>
                <select v-model="form.cliente_id" class="form-control" required>
                  <option value="">Selecciona un cliente</option>
                  <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
                    {{ cliente.nombre }} {{ cliente.apellido || '' }}
                  </option>
                </select>
              </div>
            </div>
            <div class="col-md-4">
              <div class="field-group">
                <label>Mesa</label>
                <select v-model="form.mesa_id" class="form-control">
                  <option value="">Selecciona una mesa</option>
                  <option v-for="mesa in mesas" :key="mesa.id" :value="mesa.id">
                    {{ mesa.nombre }} ({{ mesa.estado || 'Disponible' }})
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-4">
              <div class="field-group">
                <label>Sede <span class="required">*</span></label>
                <select v-model="form.sede_id" class="form-control" required>
                  <option value="">Selecciona una sede</option>
                  <option v-for="sede in sedes" :key="sede.id" :value="sede.id">
                    {{ sede.nombre }}
                  </option>
                </select>
              </div>
            </div>
            <div class="col-md-4">
              <div class="field-group">
                <label>Prioridad</label>
                <select v-model="form.prioridad" class="form-control">
                  <option :value="1">1 - Baja</option>
                  <option :value="5">5 - Media</option>
                  <option :value="8">8 - Alta</option>
                  <option :value="10">10 - Urgente</option>
                </select>
              </div>
            </div>
            <div class="col-md-4">
              <div class="field-group">
                <label>Fecha Pedido</label>
                <input 
                  type="datetime-local" 
                  v-model="form.fecha_pedido" 
                  class="form-control"
                >
              </div>
            </div>
          </div>

          <div class="row" v-if="form.tipo_pedido === 'Delivery'">
            <div class="col-md-12">
              <div class="field-group">
                <label>Dirección de Entrega <span class="required">*</span></label>
                <input 
                  type="text" 
                  v-model="form.direccion_entrega" 
                  class="form-control"
                  placeholder="Dirección completa de entrega..."
                >
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-4">
              <div class="field-group">
                <label>Descuento (%)</label>
                <input 
                  type="number" 
                  v-model="form.descuento" 
                  class="form-control"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="0"
                >
              </div>
            </div>
            <div class="col-md-4">
              <div class="field-group">
                <label>Impuesto (%)</label>
                <input 
                  type="number" 
                  v-model="form.impuesto" 
                  class="form-control"
                  step="0.01"
                  min="0"
                  placeholder="0"
                >
              </div>
            </div>
            <div class="col-md-4">
              <div class="field-group">
                <label>Comisión Delivery</label>
                <input 
                  type="number" 
                  v-model="form.comision_delivery" 
                  class="form-control"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                >
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="field-group">
                <label>Nota</label>
                <input 
                  type="text" 
                  v-model="form.nota" 
                  class="form-control"
                  placeholder="Nota adicional..."
                >
              </div>
            </div>
            <div class="col-md-6">
              <div class="field-group">
                <label>Instrucciones Especiales</label>
                <input 
                  type="text" 
                  v-model="form.instrucciones_especiales" 
                  class="form-control"
                  placeholder="Instrucciones especiales para la cocina..."
                >
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="field-group">
                <label>Método de Pago</label>
                <select v-model="form.metodo_pago" class="form-control">
                  <option value="">Selecciona un método</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta Débito">Tarjeta Débito</option>
                  <option value="Tarjeta Crédito">Tarjeta Crédito</option>
                  <option value="Pago Móvil">Pago Móvil</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Cashea">Cashea</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>
            <div class="col-md-6">
              <div class="field-group">
                <label>Referencia de Pago</label>
                <input 
                  type="text" 
                  v-model="form.referencia_pago" 
                  class="form-control"
                  placeholder="Número de referencia..."
                >
              </div>
            </div>
          </div>
        </div>

        <!-- DETALLES DEL PEDIDO -->
        <div class="form-section">
          <h3 class="section-title">
            <i class="bi bi-list-ul"></i>
            Detalles del Pedido
          </h3>
          
          <div class="detalle-row">
            <div class="row-inline">
              <div class="col-4">
                <select v-model="nuevoDetalle.producto_id" class="form-control">
                  <option value="">Selecciona un producto</option>
                  <option v-for="producto in productos" :key="producto.id" :value="producto.id">
                    {{ producto.nombre }} (S/ {{ formatCurrency(producto.precio_venta) }})
                  </option>
                </select>
              </div>
              <div class="col-2">
                <input 
                  type="number" 
                  v-model="nuevoDetalle.cantidad" 
                  class="form-control"
                  placeholder="Cant."
                  min="1"
                >
              </div>
              <div class="col-3">
                <input 
                  type="number" 
                  v-model="nuevoDetalle.precio_unitario" 
                  class="form-control"
                  placeholder="Precio"
                  step="0.01"
                >
              </div>
              <div class="col-2">
                <span class="detalle-subtotal">S/ {{ calcularSubtotalDetalle() }}</span>
              </div>
              <div class="col-1">
                <button type="button" class="btn btn-success btn-sm" @click="agregarDetalle">
                  <i class="bi bi-plus"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Tabla de detalles -->
          <div class="detalles-table" v-if="form.detalles.length">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th class="text-center">Cant.</th>
                  <th class="text-end">Precio</th>
                  <th class="text-end">Subtotal</th>
                  <th class="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(detalle, index) in form.detalles" :key="index">
                  <td>{{ getProductoNombre(detalle.producto_id) }}</td>
                  <td class="text-center">{{ detalle.cantidad }}</td>
                  <td class="text-end">S/ {{ formatCurrency(detalle.precio_unitario) }}</td>
                  <td class="text-end">S/ {{ formatCurrency(detalle.cantidad * detalle.precio_unitario) }}</td>
                  <td class="text-center">
                    <button type="button" class="btn btn-danger btn-sm" @click="eliminarDetalle(index)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th colspan="3" class="text-end">Subtotal:</th>
                  <th class="text-end">S/ {{ formatCurrency(calcularSubtotal) }}</th>
                  <th></th>
                </tr>
                <tr v-if="form.descuento > 0">
                  <th colspan="3" class="text-end">Descuento ({{ form.descuento }}%):</th>
                  <th class="text-end">- S/ {{ formatCurrency(calcularDescuento) }}</th>
                  <th></th>
                </tr>
                <tr v-if="form.impuesto > 0">
                  <th colspan="3" class="text-end">Impuesto ({{ form.impuesto }}%):</th>
                  <th class="text-end">+ S/ {{ formatCurrency(calcularImpuesto) }}</th>
                  <th></th>
                </tr>
                <tr>
                  <th colspan="3" class="text-end">Total:</th>
                  <th class="text-end total-pedido">S/ {{ formatCurrency(calcularTotal) }}</th>
                  <th></th>
                </tr>
              </tfoot>
            </table>
          </div>
          <div v-else class="empty-detalles">
            <p class="text-muted">No hay productos agregados al pedido</p>
          </div>
        </div>

        <!-- BOTONES -->
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="loading || form.detalles.length === 0">
            <i class="bi" :class="loading ? 'bi-arrow-repeat spin' : 'bi-save'"></i>
            {{ loading ? 'Guardando...' : (isEditing ? 'Actualizar Pedido' : 'Crear Pedido') }}
          </button>
          <button type="button" class="btn btn-outline-secondary" @click="cancelar">
            <i class="bi bi-x-circle"></i> Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PedidosAPI, ClientesAPI, SedesAPI, MesasAPI, ProductosAPI } from '@/services/api'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()

// ===== STATE =====
const loading = ref(false)
const isEditing = ref(false)
const clientes = ref([])
const sedes = ref([])
const mesas = ref([])
const productos = ref([])

// ===== FORM =====
const form = reactive({
  cliente_id: '',
  mesa_id: '',
  sede_id: '',
  tipo_pedido: '',
  estado: 'Pendiente',
  prioridad: 5,
  descuento: 0,
  impuesto: 0,
  nota: '',
  instrucciones_especiales: '',
  fecha_pedido: '',
  fecha_entrega: '',
  fecha_estimada_entrega: '',
  direccion_entrega: '',
  metodo_pago: '',
  referencia_pago: '',
  comision_delivery: 0,
  detalles: []
})

const nuevoDetalle = reactive({
  producto_id: '',
  cantidad: 1,
  precio_unitario: 0
})

// ===== COMPUTED =====
const calcularSubtotal = computed(() => {
  return form.detalles.reduce((sum, d) => sum + (d.cantidad * d.precio_unitario), 0)
})

const calcularDescuento = computed(() => {
  const desc = parseFloat(form.descuento) || 0
  return (calcularSubtotal.value * desc) / 100
})

const calcularImpuesto = computed(() => {
  const imp = parseFloat(form.impuesto) || 0
  const base = calcularSubtotal.value - calcularDescuento.value
  return (base * imp) / 100
})

const calcularTotal = computed(() => {
  return calcularSubtotal.value - calcularDescuento.value + calcularImpuesto.value
})

// ===== METHODS =====
function calcularSubtotalDetalle() {
  const cant = parseFloat(nuevoDetalle.cantidad) || 0
  const precio = parseFloat(nuevoDetalle.precio_unitario) || 0
  return (cant * precio).toFixed(2)
}

function formatCurrency(value) {
  if (value === null || value === undefined) return '0.00'
  return new Intl.NumberFormat('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

function getProductoNombre(id) {
  const prod = productos.value.find(p => p.id === id)
  return prod ? prod.nombre : 'Producto eliminado'
}

function agregarDetalle() {
  if (!nuevoDetalle.producto_id) {
    Swal.fire('Error', 'Selecciona un producto', 'error')
    return
  }
  if (!nuevoDetalle.cantidad || parseInt(nuevoDetalle.cantidad) < 1) {
    Swal.fire('Error', 'La cantidad debe ser mayor a 0', 'error')
    return
  }

  const producto = productos.value.find(p => p.id === parseInt(nuevoDetalle.producto_id))
  const precio = parseFloat(nuevoDetalle.precio_unitario) || producto?.precio_venta || 0

  form.detalles.push({
    producto_id: parseInt(nuevoDetalle.producto_id),
    cantidad: parseInt(nuevoDetalle.cantidad),
    precio_unitario: precio,
    observaciones: ''
  })

  nuevoDetalle.producto_id = ''
  nuevoDetalle.cantidad = 1
  nuevoDetalle.precio_unitario = 0
}

function eliminarDetalle(index) {
  form.detalles.splice(index, 1)
}

async function loadData() {
  try {
    const [clientesRes, sedesRes, mesasRes, productosRes] = await Promise.all([
      ClientesAPI.list(),
      SedesAPI.list(),
      MesasAPI.list(),
      ProductosAPI.list()
    ])

    clientes.value = clientesRes.data.data || []
    sedes.value = sedesRes.data.data || []
    mesas.value = mesasRes.data.data || []
    productos.value = productosRes.data.data || []
  } catch (error) {
    console.error('Error cargando datos:', error)
  }
}

async function loadPedido(id) {
  try {
    const res = await PedidosAPI.getById(id)
    const data = res.data
    Object.assign(form, data)
    isEditing.value = true
    form.fecha_pedido = data.fecha_pedido ? new Date(data.fecha_pedido).toISOString().slice(0, 16) : ''
    form.fecha_entrega = data.fecha_entrega ? new Date(data.fecha_entrega).toISOString().slice(0, 16) : ''
    form.fecha_estimada_entrega = data.fecha_estimada_entrega ? new Date(data.fecha_estimada_entrega).toISOString().slice(0, 16) : ''
  } catch (error) {
    Swal.fire('Error', 'No se pudo cargar el pedido', 'error')
    router.push('/pedidos')
  }
}

async function handleSubmit() {
  if (!form.cliente_id) {
    Swal.fire('Error', 'Selecciona un cliente', 'error')
    return
  }
  if (!form.sede_id) {
    Swal.fire('Error', 'Selecciona una sede', 'error')
    return
  }
  if (!form.tipo_pedido) {
    Swal.fire('Error', 'Selecciona un tipo de pedido', 'error')
    return
  }
  if (form.detalles.length === 0) {
    Swal.fire('Error', 'Agrega al menos un producto al pedido', 'error')
    return
  }

  loading.value = true
  try {
    const payload = {
      cliente_id: parseInt(form.cliente_id),
      mesa_id: form.mesa_id ? parseInt(form.mesa_id) : null,
      sede_id: parseInt(form.sede_id),
      tipo_pedido: form.tipo_pedido,
      estado: form.estado || 'Pendiente',
      prioridad: parseInt(form.prioridad) || 5,
      descuento: parseFloat(form.descuento) || 0,
      impuesto: parseFloat(form.impuesto) || 0,
      nota: form.nota || '',
      instrucciones_especiales: form.instrucciones_especiales || '',
      fecha_pedido: form.fecha_pedido || new Date().toISOString(),
      fecha_entrega: form.fecha_entrega || null,
      fecha_estimada_entrega: form.fecha_estimada_entrega || null,
      direccion_entrega: form.direccion_entrega || '',
      metodo_pago: form.metodo_pago || '',
      referencia_pago: form.referencia_pago || '',
      comision_delivery: parseFloat(form.comision_delivery) || 0,
      detalles: form.detalles.map(d => ({
        producto_id: d.producto_id,
        cantidad: d.cantidad,
        precio_unitario: d.precio_unitario,
        observaciones: d.observaciones || ''
      }))
    }

    let response
    if (isEditing.value) {
      response = await PedidosAPI.update(route.params.id, payload)
    } else {
      response = await PedidosAPI.create(payload)
    }

    if (response.data.success) {
      Swal.fire('Éxito', isEditing.value ? 'Pedido actualizado' : 'Pedido creado correctamente', 'success')
      router.push('/pedidos')
    }
  } catch (error) {
    console.error('Error al guardar:', error)
    const errorData = error.response?.data
    let msg = 'Error al guardar el pedido'
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
    }
    Swal.fire('Error', msg, 'error')
  } finally {
    loading.value = false
  }
}

function cancelar() {
  router.push('/pedidos')
}

// ===== LIFECYCLE =====
onMounted(async () => {
  await loadData()
  const id = route.params.id
  if (id && id !== 'nuevo') {
    await loadPedido(id)
  } else {
    form.fecha_pedido = new Date().toISOString().slice(0, 16)
  }
})
</script>

<style scoped>
/* Estilos iguales a los anteriores */
.page-container { padding: 24px; max-width: 1000px; margin: 0 auto; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; background: #ffffff; padding: 20px 24px; border-radius: 12px; border: 1px solid #e5e7eb; }
.header-left { display: flex; align-items: center; }
.header-title { display: flex; align-items: center; gap: 14px; }
.header-title i { font-size: 32px; color: #2F6FED; background: #e8eeff; padding: 12px; border-radius: 12px; }
.header-title h1 { font-size: 22px; font-weight: 700; color: #111827; margin: 0; }
.header-title .text-muted { color: #6b7280; font-size: 14px; margin: 2px 0 0; }
.header-actions { display: flex; gap: 10px; align-items: center; }
.form-card { background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
.form-section { margin-bottom: 32px; padding-bottom: 32px; border-bottom: 1px solid #f3f4f6; }
.form-section:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
.section-title { font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 20px 0; display: flex; align-items: center; gap: 8px; }
.section-title i { color: #2F6FED; }
.row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 8px; }
.col-md-12 { grid-column: span 3; }
.col-md-6 { grid-column: span 1; }
.col-md-4 { grid-column: span 1; }
.col-md-3 { grid-column: span 1; }
@media (max-width: 768px) { .row { grid-template-columns: 1fr; gap: 0; } .col-md-12, .col-md-6, .col-md-4, .col-md-3 { grid-column: span 1; } }
.field-group { margin-bottom: 14px; }
.field-group label { display: flex; align-items: center; gap: 6px; font-weight: 500; font-size: 13px; color: #374151; margin-bottom: 4px; }
.field-group label i { color: #9ca3af; font-size: 14px; }
.required { color: #ef4444; font-weight: 700; margin-left: 2px; }
.form-control { width: 100%; padding: 8px 14px; border: 1.5px solid #d1d5db; border-radius: 8px; font-size: 14px; font-family: inherit; transition: all 0.2s ease; background: #ffffff; color: #111827; }
.form-control:focus { outline: none; border-color: #2F6FED; box-shadow: 0 0 0 3px rgba(47,111,237,0.08); }
.form-actions { display: flex; gap: 12px; margin-top: 24px; padding-top: 20px; border-top: 1px solid #e5e7eb; flex-wrap: wrap; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 8px 18px; border: none; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s ease; text-decoration: none; font-family: inherit; white-space: nowrap; }
.btn-primary { background: #2F6FED; color: #ffffff; }
.btn-primary:hover:not(:disabled) { background: #1a5adf; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(47,111,237,0.3); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-outline-secondary { background: transparent; color: #6b7280; border: 1.5px solid #d1d5db; }
.btn-outline-secondary:hover { background: #f9fafb; border-color: #9ca3af; }
.btn-sm { padding: 4px 12px; font-size: 13px; }
.btn-success { background: #22c55e; color: #ffffff; }
.btn-success:hover { background: #16a34a; }
.btn-danger { background: #dc2626; color: #ffffff; }
.btn-danger:hover { background: #b91c1c; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.row-inline { display: flex; gap: 10px; align-items: center; margin-bottom: 12px; }
.col-1 { flex: 0 0 8.333%; }
.col-2 { flex: 0 0 16.666%; }
.col-3 { flex: 0 0 25%; }
.col-4 { flex: 0 0 33.333%; }
.col-12 { flex: 0 0 100%; }
.detalle-subtotal { font-weight: 600; color: #2F6FED; }
.detalles-table { margin-top: 16px; }
.detalles-table .table { width: 100%; border-collapse: collapse; }
.detalles-table .table th { background: #f8fafc; padding: 8px 12px; font-size: 12px; text-transform: uppercase; color: #6b7280; border-bottom: 1px solid #e5e7eb; }
.detalles-table .table td { padding: 8px 12px; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
.detalles-table .table tfoot th { padding: 8px 12px; font-weight: 600; color: #111827; border-top: 2px solid #e5e7eb; }
.total-pedido { font-size: 18px; color: #E85D3A; }
.empty-detalles { text-align: center; padding: 30px 0; }
.empty-detalles p { color: #6b7280; }
.text-end { text-align: right; }
.text-center { text-align: center; }
.text-muted { color: #6b7280; }
@media (max-width: 768px) { .page-container { padding: 12px; } .page-header { flex-direction: column; align-items: stretch; padding: 16px; } .form-card { padding: 20px; } .header-title h1 { font-size: 18px; } .header-actions { justify-content: stretch; } .header-actions .btn { flex: 1; justify-content: center; } .form-actions { flex-direction: column; } .form-actions .btn { width: 100%; justify-content: center; } .row-inline { flex-wrap: wrap; } .col-1, .col-2, .col-3, .col-4 { flex: 0 0 100%; } .detalles-table { overflow-x: auto; } }
@media (max-width: 480px) { .header-title i { font-size: 24px; padding: 8px; } .header-title h1 { font-size: 16px; } .form-card { padding: 16px; } }
</style>