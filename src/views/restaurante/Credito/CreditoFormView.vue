<!-- src/views/restaurante/Credito/CreditoFormView.vue -->
<template>
  <div class="page-container">
    <!-- HEADER -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-title">
          <i class="bi bi-credit-card"></i>
          <div>
            <h1>{{ isEditing ? 'Editar Crédito' : 'Nuevo Crédito' }}</h1>
            <p class="text-muted">
              {{ isEditing ? 'Modifica los datos del crédito' : 'Registra un nuevo crédito para un cliente' }}
            </p>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <router-link to="/creditos" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left"></i> Volver
        </router-link>
      </div>
    </div>

    <!-- FORMULARIO -->
    <div class="form-card">
      <form @submit.prevent="handleSubmit" novalidate>
        <!-- DATOS DEL CRÉDITO -->
        <div class="form-section">
          <h3 class="section-title">
            <i class="bi bi-info-circle"></i>
            Datos del Crédito
          </h3>
          
          <div class="row">
            <div class="col-md-6">
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
            <div class="col-md-6">
              <div class="field-group">
                <label>Pedido</label>
                <select v-model="form.pedido_id" class="form-control">
                  <option value="">Selecciona un pedido (opcional)</option>
                  <option v-for="pedido in pedidos" :key="pedido.id" :value="pedido.id">
                    #{{ pedido.numero_pedido || pedido.id }} - {{ pedido.cliente_nombre }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-4">
              <div class="field-group">
                <label>Monto Total <span class="required">*</span></label>
                <input 
                  type="number" 
                  v-model="form.monto_total" 
                  class="form-control"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="0.00"
                >
              </div>
            </div>
            <div class="col-md-4">
              <div class="field-group">
                <label>Número de Cuotas <span class="required">*</span></label>
                <input 
                  type="number" 
                  v-model="form.cuotas" 
                  class="form-control"
                  min="1"
                  required
                  placeholder="1"
                >
              </div>
            </div>
            <div class="col-md-4">
              <div class="field-group">
                <label>Monto por Cuota</label>
                <input 
                  type="text" 
                  :value="calcularMontoCuota" 
                  class="form-control"
                  disabled
                >
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-4">
              <div class="field-group">
                <label>Frecuencia <span class="required">*</span></label>
                <select v-model="form.frecuencia" class="form-control" required>
                  <option value="">Selecciona una frecuencia</option>
                  <option value="Diario">Diario</option>
                  <option value="Semanal">Semanal</option>
                  <option value="Quincenal">Quincenal</option>
                  <option value="Mensual">Mensual</option>
                  <option value="Bimestral">Bimestral</option>
                </select>
              </div>
            </div>
            <div class="col-md-4">
              <div class="field-group">
                <label>Fecha Inicio <span class="required">*</span></label>
                <input 
                  type="date" 
                  v-model="form.fecha_inicio" 
                  class="form-control"
                  required
                >
              </div>
            </div>
            <div class="col-md-4">
              <div class="field-group">
                <label>Fecha Vencimiento <span class="required">*</span></label>
                <input 
                  type="date" 
                  v-model="form.fecha_vencimiento" 
                  class="form-control"
                  required
                >
              </div>
            </div>
          </div>

          <div class="row">
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
                </select>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="field-group">
                <label>Interés (%)</label>
                <input 
                  type="number" 
                  v-model="form.interes" 
                  class="form-control"
                  step="0.01"
                  min="0"
                  placeholder="0"
                >
              </div>
            </div>
            <div class="col-md-6">
              <div class="field-group">
                <label>Total con Interés</label>
                <input 
                  type="text" 
                  :value="calcularTotalConInteres" 
                  class="form-control"
                  disabled
                >
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12">
              <div class="field-group">
                <label>Referencia Cashea</label>
                <input 
                  type="text" 
                  v-model="form.referencia_cashea" 
                  class="form-control"
                  placeholder="Código de referencia Cashea..."
                >
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12">
              <div class="field-group">
                <label>Notas</label>
                <textarea 
                  v-model="form.notas" 
                  class="form-control"
                  rows="2"
                  placeholder="Notas adicionales sobre el crédito..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- ESTADO -->
        <div class="form-section">
          <h3 class="section-title">
            <i class="bi bi-toggle-on"></i>
            Estado
          </h3>
          <div class="field-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.activo">
              <span class="toggle-text">
                <i class="bi" :class="form.activo ? 'bi-toggle-on text-success' : 'bi-toggle-off text-muted'"></i>
                {{ form.activo ? 'Crédito Activo' : 'Crédito Inactivo' }}
              </span>
            </label>
          </div>
        </div>

        <!-- BOTONES -->
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <i class="bi" :class="loading ? 'bi-arrow-repeat spin' : 'bi-save'"></i>
            {{ loading ? 'Guardando...' : (isEditing ? 'Actualizar Crédito' : 'Crear Crédito') }}
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
import { CreditosAPI, ClientesAPI, SedesAPI, PedidosAPI } from '@/services/api'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()

// ===== STATE =====
const loading = ref(false)
const isEditing = ref(false)
const clientes = ref([])
const sedes = ref([])
const pedidos = ref([])

// ===== FORM =====
const form = reactive({
  cliente_id: '',
  pedido_id: '',
  sede_id: '',
  monto_total: '',
  monto_pagado: 0,
  cuotas: 1,
  monto_cuota: 0,
  frecuencia: '',
  fecha_inicio: '',
  fecha_vencimiento: '',
  estado: 'Activo',
  metodo_pago: '',
  referencia_cashea: '',
  interes: 0,
  total_interes: 0,
  monto_total_con_interes: 0,
  dias_mora: 0,
  monto_mora: 0,
  notas: '',
  activo: true,
  usuario_id: 1
})

// ===== COMPUTED =====
const calcularMontoCuota = computed(() => {
  const total = parseFloat(form.monto_total) || 0
  const cuotas = parseInt(form.cuotas) || 1
  const interes = parseFloat(form.interes) || 0
  const totalConInteres = total * (1 + (interes / 100))
  return (totalConInteres / cuotas).toFixed(2)
})

const calcularTotalConInteres = computed(() => {
  const total = parseFloat(form.monto_total) || 0
  const interes = parseFloat(form.interes) || 0
  return (total * (1 + (interes / 100))).toFixed(2)
})

// ===== METHODS =====
function formatCurrency(value) {
  if (value === null || value === undefined) return '0.00'
  return new Intl.NumberFormat('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

async function loadData() {
  try {
    const [clientesRes, sedesRes, pedidosRes] = await Promise.all([
      ClientesAPI.list(),
      SedesAPI.list(),
      PedidosAPI.list()
    ])

    clientes.value = clientesRes.data.data || []
    sedes.value = sedesRes.data.data || []
    pedidos.value = pedidosRes.data.data || []
  } catch (error) {
    console.error('Error cargando datos:', error)
  }
}

async function loadCredito(id) {
  try {
    const res = await CreditosAPI.getById(id)
    const data = res.data
    Object.assign(form, data)
    isEditing.value = true
    form.fecha_inicio = data.fecha_inicio || ''
    form.fecha_vencimiento = data.fecha_vencimiento || ''
  } catch (error) {
    Swal.fire('Error', 'No se pudo cargar el crédito', 'error')
    router.push('/creditos')
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
  if (!form.monto_total || parseFloat(form.monto_total) <= 0) {
    Swal.fire('Error', 'Ingresa un monto total válido', 'error')
    return
  }
  if (!form.cuotas || parseInt(form.cuotas) < 1) {
    Swal.fire('Error', 'El número de cuotas debe ser al menos 1', 'error')
    return
  }
  if (!form.frecuencia) {
    Swal.fire('Error', 'Selecciona una frecuencia', 'error')
    return
  }
  if (!form.fecha_inicio) {
    Swal.fire('Error', 'Selecciona una fecha de inicio', 'error')
    return
  }
  if (!form.fecha_vencimiento) {
    Swal.fire('Error', 'Selecciona una fecha de vencimiento', 'error')
    return
  }

  loading.value = true
  try {
    const total = parseFloat(form.monto_total) || 0
    const interes = parseFloat(form.interes) || 0
    const totalConInteres = total * (1 + (interes / 100))
    const cuotas = parseInt(form.cuotas) || 1

    const payload = {
      cliente_id: parseInt(form.cliente_id),
      pedido_id: form.pedido_id ? parseInt(form.pedido_id) : null,
      sede_id: parseInt(form.sede_id),
      monto_total: total,
      monto_pagado: parseFloat(form.monto_pagado) || 0,
      cuotas: cuotas,
      monto_cuota: totalConInteres / cuotas,
      frecuencia: form.frecuencia,
      fecha_inicio: form.fecha_inicio,
      fecha_vencimiento: form.fecha_vencimiento,
      estado: form.estado || 'Activo',
      metodo_pago: form.metodo_pago || '',
      referencia_cashea: form.referencia_cashea || '',
      interes: interes,
      total_interes: totalConInteres - total,
      monto_total_con_interes: totalConInteres,
      dias_mora: parseInt(form.dias_mora) || 0,
      monto_mora: parseFloat(form.monto_mora) || 0,
      notas: form.notas || '',
      activo: form.activo !== undefined ? form.activo : true,
      usuario_id: form.usuario_id || 1
    }

    let response
    if (isEditing.value) {
      response = await CreditosAPI.update(route.params.id, payload)
    } else {
      response = await CreditosAPI.create(payload)
    }

    if (response.data.success) {
      Swal.fire('Éxito', isEditing.value ? 'Crédito actualizado' : 'Crédito creado correctamente', 'success')
      router.push('/creditos')
    }
  } catch (error) {
    console.error('Error al guardar:', error)
    const errorData = error.response?.data
    let msg = 'Error al guardar el crédito'
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
  router.push('/creditos')
}

// ===== LIFECYCLE =====
onMounted(async () => {
  await loadData()
  const id = route.params.id
  if (id && id !== 'nuevo') {
    await loadCredito(id)
  } else {
    form.fecha_inicio = new Date().toISOString().slice(0, 10)
    form.fecha_vencimiento = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  }
})
</script>

<style scoped>
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
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 8px; }
.col-md-12 { grid-column: span 2; }
.col-md-6 { grid-column: span 1; }
.col-md-4 { grid-column: span 1; }
@media (max-width: 768px) { .row { grid-template-columns: 1fr; gap: 0; } .col-md-12, .col-md-6, .col-md-4 { grid-column: span 1; } }
.field-group { margin-bottom: 14px; }
.field-group label { display: flex; align-items: center; gap: 6px; font-weight: 500; font-size: 13px; color: #374151; margin-bottom: 4px; }
.field-group label i { color: #9ca3af; font-size: 14px; }
.required { color: #ef4444; font-weight: 700; margin-left: 2px; }
.form-control { width: 100%; padding: 8px 14px; border: 1.5px solid #d1d5db; border-radius: 8px; font-size: 14px; font-family: inherit; transition: all 0.2s ease; background: #ffffff; color: #111827; }
.form-control:focus { outline: none; border-color: #2F6FED; box-shadow: 0 0 0 3px rgba(47,111,237,0.08); }
.form-control:disabled { background: #f3f4f6; color: #6b7280; cursor: not-allowed; }
textarea.form-control { resize: vertical; }
.form-actions { display: flex; gap: 12px; margin-top: 24px; padding-top: 20px; border-top: 1px solid #e5e7eb; flex-wrap: wrap; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 8px 18px; border: none; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s ease; text-decoration: none; font-family: inherit; white-space: nowrap; }
.btn-primary { background: #2F6FED; color: #ffffff; }
.btn-primary:hover:not(:disabled) { background: #1a5adf; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(47,111,237,0.3); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-outline-secondary { background: transparent; color: #6b7280; border: 1.5px solid #d1d5db; }
.btn-outline-secondary:hover { background: #f9fafb; border-color: #9ca3af; }
.checkbox-group { margin-top: 4px; }
.checkbox-label { display: flex; align-items: center; gap: 10px; cursor: pointer; font-weight: 400; font-size: 14px; color: #374151; }
.checkbox-label input[type="checkbox"] { width: 18px; height: 18px; margin: 0; cursor: pointer; accent-color: #2F6FED; flex-shrink: 0; }
.toggle-text { display: flex; align-items: center; gap: 6px; }
.text-success { color: #22c55e; }
.text-muted { color: #6b7280; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@media (max-width: 768px) { .page-container { padding: 12px; } .page-header { flex-direction: column; align-items: stretch; padding: 16px; } .form-card { padding: 20px; } .header-title h1 { font-size: 18px; } .header-actions { justify-content: stretch; } .header-actions .btn { flex: 1; justify-content: center; } .form-actions { flex-direction: column; } .form-actions .btn { width: 100%; justify-content: center; } }
@media (max-width: 480px) { .header-title i { font-size: 24px; padding: 8px; } .header-title h1 { font-size: 16px; } .form-card { padding: 16px; } }
</style>