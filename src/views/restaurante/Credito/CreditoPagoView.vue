<!-- src/views/restaurante/Credito/CreditoPagoView.vue -->
<template>
  <div class="page-container">
    <!-- HEADER -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-title">
          <i class="bi bi-cash"></i>
          <div>
            <h1>Registrar Pago</h1>
            <p class="text-muted">Registra un pago para el crédito del cliente</p>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <router-link to="/creditos" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left"></i> Volver
        </router-link>
      </div>
    </div>

    <!-- INFORMACIÓN DEL CRÉDITO -->
    <div v-if="credito" class="credito-info">
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Cliente</span>
          <span class="info-value">{{ credito.cliente_nombre || 'N/A' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Total Crédito</span>
          <span class="info-value">S/ {{ formatCurrency(credito.monto_total) }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Monto Pagado</span>
          <span class="info-value">S/ {{ formatCurrency(credito.monto_pagado) }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Saldo Pendiente</span>
          <span class="info-value saldo-pendiente">S/ {{ formatCurrency(calcularSaldo) }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Cuotas</span>
          <span class="info-value">{{ credito.cuotas_pagadas || 0 }}/{{ credito.cuotas || 0 }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Estado</span>
          <span class="badge" :class="getEstadoClass(credito.estado)">
            {{ credito.estado }}
          </span>
        </div>
      </div>
    </div>

    <div v-else-if="loading" class="text-center py-5">
      <div class="spinner"></div>
      <p class="text-muted mt-2">Cargando crédito...</p>
    </div>

    <div v-else class="text-center py-5">
      <i class="bi bi-exclamation-triangle fs-1 d-block text-warning"></i>
      <p class="text-muted mt-2">No se encontró el crédito</p>
      <router-link to="/creditos" class="btn btn-primary">Volver a Créditos</router-link>
    </div>

    <!-- FORMULARIO DE PAGO -->
    <div v-if="credito" class="form-card">
      <h3 class="section-title">
        <i class="bi bi-cash"></i>
        Datos del Pago
      </h3>
      
      <form @submit.prevent="handleSubmit">
        <div class="row">
          <div class="col-md-6">
            <div class="field-group">
              <label>Monto a Pagar <span class="required">*</span></label>
              <input 
                type="number" 
                v-model="pagoForm.monto" 
                class="form-control"
                step="0.01"
                min="0.01"
                :max="calcularSaldo"
                required
                placeholder="0.00"
              >
              <small class="help-text">Máximo: S/ {{ formatCurrency(calcularSaldo) }}</small>
            </div>
          </div>
          <div class="col-md-6">
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
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <div class="field-group">
              <label>Referencia</label>
              <input 
                type="text" 
                v-model="pagoForm.referencia" 
                class="form-control"
                placeholder="Número de referencia del pago..."
              >
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <div class="field-group">
              <label>Observaciones</label>
              <textarea 
                v-model="pagoForm.observaciones" 
                class="form-control"
                rows="2"
                placeholder="Observaciones sobre el pago..."
              ></textarea>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-success" :disabled="loading || pagoForm.monto <= 0 || !pagoForm.metodo_pago">
            <i class="bi" :class="loading ? 'bi-arrow-repeat spin' : 'bi-cash'"></i>
            {{ loading ? 'Procesando...' : 'Registrar Pago' }}
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CreditosAPI } from '@/services/api'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()

// ===== STATE =====
const loading = ref(false)
const credito = ref(null)

const pagoForm = reactive({
  credito_id: '',
  monto: '',
  metodo_pago: '',
  referencia: '',
  observaciones: '',
  usuario_id: 1
})

// ===== COMPUTED =====
const calcularSaldo = computed(() => {
  if (!credito.value) return 0
  return (credito.value.monto_total || 0) - (credito.value.monto_pagado || 0)
})

// ===== METHODS =====
function formatCurrency(value) {
  if (value === null || value === undefined) return '0.00'
  return new Intl.NumberFormat('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
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

async function loadCredito() {
  const id = route.params.id
  if (!id) {
    router.push('/creditos')
    return
  }

  loading.value = true
  try {
    const res = await CreditosAPI.getById(id)
    if (res.data && res.data.success) {
      credito.value = res.data.data
      pagoForm.credito_id = credito.value.id
      pagoForm.monto = calcularSaldo.value
    } else if (res.data) {
      credito.value = res.data
      pagoForm.credito_id = credito.value.id
      pagoForm.monto = calcularSaldo.value
    } else {
      credito.value = null
    }
  } catch (error) {
    console.error('Error cargando crédito:', error)
    Swal.fire('Error', 'No se pudo cargar el crédito', 'error')
    credito.value = null
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  if (!pagoForm.monto || parseFloat(pagoForm.monto) <= 0) {
    Swal.fire('Error', 'Ingresa un monto válido', 'error')
    return
  }
  if (!pagoForm.metodo_pago) {
    Swal.fire('Error', 'Selecciona un método de pago', 'error')
    return
  }

  const saldo = calcularSaldo.value
  if (parseFloat(pagoForm.monto) > saldo) {
    Swal.fire('Error', `El monto no puede exceder el saldo pendiente (S/ ${formatCurrency(saldo)})`, 'error')
    return
  }

  loading.value = true
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
    router.push('/creditos')
  } catch (error) {
    console.error('Error al registrar pago:', error)
    const errorData = error.response?.data
    let msg = 'Error al registrar el pago'
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
onMounted(() => {
  loadCredito()
})
</script>

<style scoped>
.page-container { padding: 24px; max-width: 800px; margin: 0 auto; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; background: #ffffff; padding: 20px 24px; border-radius: 12px; border: 1px solid #e5e7eb; }
.header-left { display: flex; align-items: center; }
.header-title { display: flex; align-items: center; gap: 14px; }
.header-title i { font-size: 32px; color: #2F6FED; background: #e8eeff; padding: 12px; border-radius: 12px; }
.header-title h1 { font-size: 22px; font-weight: 700; color: #111827; margin: 0; }
.header-title .text-muted { color: #6b7280; font-size: 14px; margin: 2px 0 0; }
.header-actions { display: flex; gap: 10px; align-items: center; }
.credito-info { background: #ffffff; border-radius: 12px; padding: 20px 24px; border: 1px solid #e5e7eb; margin-bottom: 24px; }
.info-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; }
.info-item { display: flex; flex-direction: column; }
.info-label { font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.3px; }
.info-value { font-size: 16px; font-weight: 600; color: #111827; margin-top: 2px; }
.saldo-pendiente { color: #E85D3A; }
.form-card { background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
.section-title { font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 20px 0; display: flex; align-items: center; gap: 8px; }
.section-title i { color: #2F6FED; }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 8px; }
.col-md-12 { grid-column: span 2; }
.col-md-6 { grid-column: span 1; }
@media (max-width: 768px) { .row { grid-template-columns: 1fr; gap: 0; } .col-md-12, .col-md-6 { grid-column: span 1; } }
.field-group { margin-bottom: 14px; }
.field-group label { display: flex; align-items: center; gap: 6px; font-weight: 500; font-size: 13px; color: #374151; margin-bottom: 4px; }
.field-group label i { color: #9ca3af; font-size: 14px; }
.required { color: #ef4444; font-weight: 700; margin-left: 2px; }
.help-text { color: #9ca3af; font-size: 12px; display: block; margin-top: 4px; }
.form-control { width: 100%; padding: 8px 14px; border: 1.5px solid #d1d5db; border-radius: 8px; font-size: 14px; font-family: inherit; transition: all 0.2s ease; background: #ffffff; color: #111827; }
.form-control:focus { outline: none; border-color: #2F6FED; box-shadow: 0 0 0 3px rgba(47,111,237,0.08); }
textarea.form-control { resize: vertical; }
.form-actions { display: flex; gap: 12px; margin-top: 24px; padding-top: 20px; border-top: 1px solid #e5e7eb; flex-wrap: wrap; }
.badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; letter-spacing: 0.3px; }
.badge-success { background: #dcfce7; color: #16a34a; }
.badge-info { background: #dbeafe; color: #2563eb; }
.badge-danger { background: #fecaca; color: #dc2626; }
.badge-secondary { background: #f3f4f6; color: #6b7280; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 8px 18px; border: none; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s ease; text-decoration: none; font-family: inherit; white-space: nowrap; }
.btn-success { background: #22c55e; color: #ffffff; }
.btn-success:hover:not(:disabled) { background: #16a34a; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(34,197,94,0.3); }
.btn-success:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-outline-secondary { background: transparent; color: #6b7280; border: 1.5px solid #d1d5db; }
.btn-outline-secondary:hover { background: #f9fafb; border-color: #9ca3af; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.spinner { width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top: 4px solid #2F6FED; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
.text-muted { color: #6b7280; }
.text-center { text-align: center; }
.mt-2 { margin-top: 8px; }
.py-5 { padding: 48px 0; }
@media (max-width: 768px) { .page-container { padding: 12px; } .page-header { flex-direction: column; align-items: stretch; padding: 16px; } .header-title h1 { font-size: 18px; } .header-actions { justify-content: stretch; } .header-actions .btn { flex: 1; justify-content: center; } .info-grid { grid-template-columns: repeat(3, 1fr); } .form-card { padding: 20px; } .form-actions { flex-direction: column; } .form-actions .btn { width: 100%; justify-content: center; } }
@media (max-width: 480px) { .header-title i { font-size: 24px; padding: 8px; } .header-title h1 { font-size: 16px; } .info-grid { grid-template-columns: repeat(2, 1fr); } .form-card { padding: 16px; } }
</style>