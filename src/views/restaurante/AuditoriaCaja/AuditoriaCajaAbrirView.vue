<!-- src/views/restaurante/AuditoriaCaja/AuditoriaCajaAbrirView.vue -->
<template>
  <div class="page-container">
    <!-- HEADER -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-title">
          <i class="bi bi-cash-stack"></i>
          <div>
            <h1>Abrir Caja</h1>
            <p class="text-muted">Registra la apertura de una nueva caja</p>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <router-link to="/auditoria-caja" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left"></i> Volver
        </router-link>
      </div>
    </div>

    <!-- ALERTA DE CAJA ABIERTA -->
    <div v-if="cajaAbierta" class="alert-card alert-warning">
      <div class="alert-icon">
        <i class="bi bi-exclamation-triangle-fill"></i>
      </div>
      <div class="alert-content">
        <h4>Ya hay una caja abierta</h4>
        <p>
          La caja fue abierta el {{ formatearFechaCompleta(cajaActual?.fecha_apertura) }} 
          por {{ cajaActual?.usuario_apertura_nombre || 'Usuario' }}
        </p>
      </div>
      <div class="alert-actions">
        <router-link :to="`/auditoria-caja/${cajaActual?.id}/cerrar`" class="btn btn-warning">
          <i class="bi bi-x-circle"></i> Cerrar Caja
        </router-link>
      </div>
    </div>

    <!-- FORMULARIO -->
    <div v-if="!cajaAbierta" class="form-card">
      <form @submit.prevent="handleSubmit">
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
              <label>Usuario Apertura <span class="required">*</span></label>
              <select v-model="form.usuario_apertura" class="form-control" required>
                <option value="">Selecciona un usuario</option>
                <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">
                  {{ usuario.nombre }} {{ usuario.apellido || '' }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="field-group">
              <label>Monto Inicial <span class="required">*</span></label>
              <input 
                type="number" 
                v-model="form.monto_inicial" 
                class="form-control"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
              >
              <small class="help-text">Monto con el que se abre la caja</small>
            </div>
          </div>
          <div class="col-md-6">
            <div class="field-group">
              <label>Fecha Apertura</label>
              <input 
                type="datetime-local" 
                v-model="form.fecha_apertura" 
                class="form-control"
                disabled
              >
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <div class="field-group">
              <label>Observaciones</label>
              <textarea 
                v-model="form.observaciones" 
                class="form-control"
                rows="3"
                placeholder="Observaciones sobre la apertura de caja..."
              ></textarea>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-success" :disabled="loading">
            <i class="bi" :class="loading ? 'bi-arrow-repeat spin' : 'bi-cash-stack'"></i>
            {{ loading ? 'Abriendo...' : 'Abrir Caja' }}
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { AuditoriaCajaAPI, SedesAPI, UsuariosAPI } from '@/services/api'
import Swal from 'sweetalert2'

const router = useRouter()

// ===== STATE =====
const loading = ref(false)
const sedes = ref([])
const usuarios = ref([])
const cajaActual = ref(null)
const cajaAbierta = ref(false)

// ===== FORM =====
const form = reactive({
  sede_id: '',
  usuario_apertura: '',
  monto_inicial: '',
  observaciones: '',
  fecha_apertura: new Date().toISOString().slice(0, 16)
})

// ===== METHODS =====
async function loadSedes() {
  try {
    const res = await SedesAPI.list()
    sedes.value = res.data.data || []
  } catch (error) {
    console.error('Error cargando sedes:', error)
  }
}

async function loadUsuarios() {
  try {
    const res = await UsuariosAPI.list()
    usuarios.value = res.data.data || []
  } catch (error) {
    console.error('Error cargando usuarios:', error)
  }
}

async function verificarCajaActual() {
  const sedeId = form.sede_id || sedes.value[0]?.id
  if (!sedeId) return

  try {
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

async function handleSubmit() {
  if (!form.sede_id) {
    Swal.fire('Error', 'Selecciona una sede', 'error')
    return
  }
  if (!form.usuario_apertura) {
    Swal.fire('Error', 'Selecciona un usuario', 'error')
    return
  }
  if (!form.monto_inicial || parseFloat(form.monto_inicial) < 0) {
    Swal.fire('Error', 'Ingresa un monto inicial válido', 'error')
    return
  }

  // Verificar nuevamente si hay caja abierta
  await verificarCajaActual()
  if (cajaAbierta.value) {
    Swal.fire('Error', 'Ya hay una caja abierta en esta sede', 'error')
    return
  }

  loading.value = true
  try {
    const payload = {
      sede_id: parseInt(form.sede_id),
      usuario_apertura: parseInt(form.usuario_apertura),
      monto_inicial: parseFloat(form.monto_inicial),
      observaciones: form.observaciones || ''
    }

    await AuditoriaCajaAPI.abrir(payload)
    Swal.fire('Éxito', 'Caja abierta correctamente', 'success')
    router.push('/auditoria-caja')
  } catch (error) {
    console.error('Error al abrir caja:', error)
    const errorData = error.response?.data
    let msg = 'Error al abrir la caja'
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
  router.push('/auditoria-caja')
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

// ===== LIFECYCLE =====
onMounted(async () => {
  await loadSedes()
  await loadUsuarios()
  if (sedes.value.length > 0) {
    form.sede_id = sedes.value[0].id
    await verificarCajaActual()
  }
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
.alert-card { display: flex; align-items: center; gap: 16px; padding: 16px 20px; border-radius: 12px; margin-bottom: 20px; border: 1px solid; }
.alert-warning { background: #fffbeb; border-color: #fcd34d; }
.alert-icon { font-size: 28px; color: #d97706; }
.alert-content { flex: 1; }
.alert-content h4 { margin: 0; font-size: 16px; color: #111827; }
.alert-content p { margin: 4px 0 0; font-size: 14px; color: #4b5563; }
.alert-actions { flex-shrink: 0; }
.form-card { background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
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
.form-control:disabled { background: #f3f4f6; color: #6b7280; cursor: not-allowed; }
textarea.form-control { resize: vertical; }
.form-actions { display: flex; gap: 12px; margin-top: 24px; padding-top: 20px; border-top: 1px solid #e5e7eb; flex-wrap: wrap; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 8px 18px; border: none; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s ease; text-decoration: none; font-family: inherit; white-space: nowrap; }
.btn-success { background: #22c55e; color: #ffffff; }
.btn-success:hover:not(:disabled) { background: #16a34a; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(34,197,94,0.3); }
.btn-success:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-outline-secondary { background: transparent; color: #6b7280; border: 1.5px solid #d1d5db; }
.btn-outline-secondary:hover { background: #f9fafb; border-color: #9ca3af; }
.btn-warning { background: #d97706; color: #ffffff; }
.btn-warning:hover { background: #b45309; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.text-muted { color: #6b7280; }
@media (max-width: 768px) { .page-container { padding: 12px; } .page-header { flex-direction: column; align-items: stretch; padding: 16px; } .header-title h1 { font-size: 18px; } .header-actions { justify-content: stretch; } .header-actions .btn { flex: 1; justify-content: center; } .form-card { padding: 20px; } .alert-card { flex-direction: column; text-align: center; } .form-actions { flex-direction: column; } .form-actions .btn { width: 100%; justify-content: center; } }
@media (max-width: 480px) { .header-title i { font-size: 24px; padding: 8px; } .header-title h1 { font-size: 16px; } .form-card { padding: 16px; } }
</style>