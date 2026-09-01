<!-- src/views/restaurante/Compra/CompraFormView.vue -->
<template>
  <div class="page-container">
    <!-- HEADER -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-title">
          <i class="bi bi-cart-plus"></i>
          <div>
            <h1>{{ isEditing ? 'Editar Compra' : 'Nueva Compra' }}</h1>
            <p class="text-muted">
              {{ isEditing ? 'Modifica los datos de la compra' : 'Registra una nueva compra a proveedor' }}
            </p>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <router-link to="/compras" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left"></i> Volver
        </router-link>
      </div>
    </div>

    <!-- FORMULARIO -->
    <div class="form-card">
      <form @submit.prevent="handleSubmit" novalidate>
        <!-- DATOS DE LA COMPRA -->
        <div class="form-section">
          <h3 class="section-title">
            <i class="bi bi-info-circle"></i>
            Datos de la Compra
          </h3>
          <div class="row">
            <div class="col-md-6">
              <div class="field-group">
                <label>Proveedor <span class="required">*</span></label>
                <select v-model="form.proveedor_id" class="form-control" required>
                  <option value="">Selecciona un proveedor</option>
                  <option v-for="prov in proveedores" :key="prov.id" :value="prov.id">
                    {{ prov.nombre }} ({{ prov.ruc || 'Sin RUC' }})
                  </option>
                </select>
              </div>
            </div>
            <div class="col-md-6">
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
          </div>

          <div class="row">
            <div class="col-md-4">
              <div class="field-group">
                <label>Tipo de Pago</label>
                <select v-model="form.tipo_pago" class="form-control">
                  <option value="">Selecciona un tipo</option>
                  <option value="Contado">Contado</option>
                  <option value="Crédito">Crédito</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Transferencia">Transferencia</option>
                </select>
              </div>
            </div>
            <div class="col-md-4">
              <div class="field-group">
                <label>Condiciones de Pago</label>
                <input 
                  type="text" 
                  v-model="form.condiciones_pago" 
                  class="form-control"
                  placeholder="Ej: 30 días"
                >
              </div>
            </div>
            <div class="col-md-4">
              <div class="field-group">
                <label>Fecha Compra</label>
                <input 
                  type="datetime-local" 
                  v-model="form.fecha_compra" 
                  class="form-control"
                >
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-4">
              <div class="field-group">
                <label>Fecha Requerida</label>
                <input 
                  type="date" 
                  v-model="form.fecha_requerida" 
                  class="form-control"
                >
              </div>
            </div>
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
          </div>

          <div class="row">
            <div class="col-md-12">
              <div class="field-group">
                <label>Nota</label>
                <input 
                  type="text" 
                  v-model="form.nota" 
                  class="form-control"
                  placeholder="Nota adicional sobre la compra..."
                >
              </div>
            </div>
          </div>
        </div>

        <!-- DETALLES DE LA COMPRA -->
        <div class="form-section">
          <h3 class="section-title">
            <i class="bi bi-list-ul"></i>
            Detalles de la Compra
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
              <div class="col-2">
                <input 
                  type="number" 
                  v-model="nuevoDetalle.precio_unitario" 
                  class="form-control"
                  placeholder="Precio"
                  step="0.01"
                >
              </div>
              <div class="col-2">
                <input 
                  type="number" 
                  v-model="nuevoDetalle.descuento" 
                  class="form-control"
                  placeholder="Desc %"
                  step="0.01"
                  min="0"
                  max="100"
                >
              </div>
              <div class="col-1">
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
                  <th class="text-end">Desc %</th>
                  <th class="text-end">Subtotal</th>
                  <th class="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(detalle, index) in form.detalles" :key="index">
                  <td>{{ getProductoNombre(detalle.producto_id) }}</td>
                  <td class="text-center">{{ detalle.cantidad }}</td>
                  <td class="text-end">S/ {{ formatCurrency(detalle.precio_unitario) }}</td>
                  <td class="text-end">{{ detalle.descuento || 0 }}%</td>
                  <td class="text-end">S/ {{ formatCurrency(calcularSubtotalDetalleItem(detalle)) }}</td>
                  <td class="text-center">
                    <button type="button" class="btn btn-danger btn-sm" @click="eliminarDetalle(index)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th colspan="4" class="text-end">Subtotal:</th>
                  <th class="text-end">S/ {{ formatCurrency(calcularSubtotal) }}</th>
                  <th></th>
                </tr>
                <tr v-if="form.descuento > 0">
                  <th colspan="4" class="text-end">Descuento ({{ form.descuento }}%):</th>
                  <th class="text-end text-danger">- S/ {{ formatCurrency(calcularDescuento) }}</th>
                  <th></th>
                </tr>
                <tr v-if="form.impuesto > 0">
                  <th colspan="4" class="text-end">Impuesto ({{ form.impuesto }}%):</th>
                  <th class="text-end">+ S/ {{ formatCurrency(calcularImpuesto) }}</th>
                  <th></th>
                </tr>
                <tr>
                  <th colspan="4" class="text-end">Total:</th>
                  <th class="text-end total-compra">S/ {{ formatCurrency(calcularTotal) }}</th>
                  <th></th>
                </tr>
              </tfoot>
            </table>
          </div>
          <div v-else class="empty-detalles">
            <p class="text-muted">No hay productos agregados a la compra</p>
          </div>
        </div>

        <!-- BOTONES -->
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="loading || form.detalles.length === 0">
            <i class="bi" :class="loading ? 'bi-arrow-repeat spin' : 'bi-save'"></i>
            {{ loading ? 'Guardando...' : (isEditing ? 'Actualizar Compra' : 'Crear Compra') }}
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
import { ComprasAPI, ProveedoresAPI, SedesAPI, ProductosAPI } from '@/services/api'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()

// ===== STATE =====
const loading = ref(false)
const isEditing = ref(false)
const proveedores = ref([])
const sedes = ref([])
const productos = ref([])

// ===== FORM =====
const form = reactive({
  proveedor_id: '',
  sede_id: '',
  fecha_compra: '',
  fecha_requerida: '',
  fecha_recepcion: null,
  descuento: 0,
  impuesto: 0,
  estado: 'Pendiente',
  tipo_pago: '',
  nota: '',
  condiciones_pago: '',
  usuario_aprobacion: null,
  fecha_aprobacion: null,
  detalles: []
})

const nuevoDetalle = reactive({
  producto_id: '',
  cantidad: 1,
  precio_unitario: 0,
  descuento: 0
})

// ===== COMPUTED =====
const calcularSubtotal = computed(() => {
  return form.detalles.reduce((sum, d) => {
    const desc = (d.descuento || 0) / 100
    return sum + (d.cantidad * d.precio_unitario * (1 - desc))
  }, 0)
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
  const desc = (parseFloat(nuevoDetalle.descuento) || 0) / 100
  return (cant * precio * (1 - desc)).toFixed(2)
}

function calcularSubtotalDetalleItem(detalle) {
  const desc = (detalle.descuento || 0) / 100
  return detalle.cantidad * detalle.precio_unitario * (1 - desc)
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
    descuento: parseFloat(nuevoDetalle.descuento) || 0,
    observaciones: ''
  })

  nuevoDetalle.producto_id = ''
  nuevoDetalle.cantidad = 1
  nuevoDetalle.precio_unitario = 0
  nuevoDetalle.descuento = 0
}

function eliminarDetalle(index) {
  form.detalles.splice(index, 1)
}

async function loadData() {
  try {
    const [proveedoresRes, sedesRes, productosRes] = await Promise.all([
      ProveedoresAPI.list(),
      SedesAPI.list(),
      ProductosAPI.list()
    ])

    proveedores.value = proveedoresRes.data.data || []
    sedes.value = sedesRes.data.data || []
    productos.value = productosRes.data.data || []
  } catch (error) {
    console.error('Error cargando datos:', error)
  }
}

async function loadCompra(id) {
  try {
    const res = await ComprasAPI.getById(id)
    const data = res.data
    Object.assign(form, data)
    isEditing.value = true
    form.fecha_compra = data.fecha_compra ? new Date(data.fecha_compra).toISOString().slice(0, 16) : ''
    form.fecha_requerida = data.fecha_requerida || ''
  } catch (error) {
    Swal.fire('Error', 'No se pudo cargar la compra', 'error')
    router.push('/compras')
  }
}

async function handleSubmit() {
  if (!form.proveedor_id) {
    Swal.fire('Error', 'Selecciona un proveedor', 'error')
    return
  }
  if (!form.sede_id) {
    Swal.fire('Error', 'Selecciona una sede', 'error')
    return
  }
  if (form.detalles.length === 0) {
    Swal.fire('Error', 'Agrega al menos un producto a la compra', 'error')
    return
  }

  loading.value = true
  try {
    const payload = {
      proveedor_id: parseInt(form.proveedor_id),
      sede_id: parseInt(form.sede_id),
      fecha_compra: form.fecha_compra || new Date().toISOString(),
      fecha_requerida: form.fecha_requerida || null,
      descuento: parseFloat(form.descuento) || 0,
      impuesto: parseFloat(form.impuesto) || 0,
      estado: 'Pendiente',
      tipo_pago: form.tipo_pago || '',
      nota: form.nota || '',
      condiciones_pago: form.condiciones_pago || '',
      usuario_aprobacion: null,
      fecha_aprobacion: null,
      detalles: form.detalles.map(d => ({
        producto_id: d.producto_id,
        cantidad: d.cantidad,
        precio_unitario: d.precio_unitario,
        descuento: d.descuento || 0,
        observaciones: d.observaciones || ''
      }))
    }

    let response
    if (isEditing.value) {
      response = await ComprasAPI.update(route.params.id, payload)
    } else {
      response = await ComprasAPI.create(payload)
    }

    if (response.data.success) {
      Swal.fire('Éxito', isEditing.value ? 'Compra actualizada' : 'Compra creada correctamente', 'success')
      router.push('/compras')
    }
  } catch (error) {
    console.error('Error al guardar:', error)
    const errorData = error.response?.data
    let msg = 'Error al guardar la compra'
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
  router.push('/compras')
}

// ===== LIFECYCLE =====
onMounted(async () => {
  await loadData()
  const id = route.params.id
  if (id && id !== 'nuevo') {
    await loadCompra(id)
  } else {
    form.fecha_compra = new Date().toISOString().slice(0, 16)
  }
})
</script>

<style scoped>
/* Estilos iguales a los anteriores - se mantienen por consistencia */
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
@media (max-width: 768px) { .row { grid-template-columns: 1fr; gap: 0; } .col-md-12, .col-md-6, .col-md-4 { grid-column: span 1; } }
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
.detalle-subtotal { font-weight: 600; color: #2F6FED; }
.detalles-table { margin-top: 16px; }
.detalles-table .table { width: 100%; border-collapse: collapse; }
.detalles-table .table th { background: #f8fafc; padding: 8px 12px; font-size: 12px; text-transform: uppercase; color: #6b7280; border-bottom: 1px solid #e5e7eb; }
.detalles-table .table td { padding: 8px 12px; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
.detalles-table .table tfoot th { padding: 8px 12px; font-weight: 600; color: #111827; border-top: 2px solid #e5e7eb; }
.total-compra { font-size: 18px; color: #E85D3A; }
.empty-detalles { text-align: center; padding: 30px 0; }
.empty-detalles p { color: #6b7280; }
.text-end { text-align: right; }
.text-center { text-align: center; }
.text-danger { color: #dc2626; }
.text-muted { color: #6b7280; }
@media (max-width: 768px) { .page-container { padding: 12px; } .page-header { flex-direction: column; align-items: stretch; padding: 16px; } .form-card { padding: 20px; } .header-title h1 { font-size: 18px; } .header-actions { justify-content: stretch; } .header-actions .btn { flex: 1; justify-content: center; } .form-actions { flex-direction: column; } .form-actions .btn { width: 100%; justify-content: center; } .row-inline { flex-wrap: wrap; } .col-1, .col-2, .col-3, .col-4 { flex: 0 0 100%; } .detalles-table { overflow-x: auto; } }
@media (max-width: 480px) { .header-title i { font-size: 24px; padding: 8px; } .header-title h1 { font-size: 16px; } .form-card { padding: 16px; } }
</style>