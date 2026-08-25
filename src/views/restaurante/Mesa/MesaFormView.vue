<!-- src/views/restaurante/Mesa/MesaFormView.vue -->
<template>
  <div class="page-container">
    <!-- HEADER -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-title">
          <i class="bi bi-table"></i>
          <div>
            <h1>{{ isEditing ? 'Editar Mesa' : 'Nueva Mesa' }}</h1>
            <p class="text-muted">
              {{ isEditing ? 'Modifica los datos de la mesa' : 'Registra una nueva mesa en el sistema' }}
            </p>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <router-link to="/mesas" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left"></i> Volver
        </router-link>
      </div>
    </div>

    <!-- FORMULARIO -->
    <div class="form-card">
      <form @submit.prevent="handleSubmit" novalidate>
        <!-- SECCIÓN: DATOS GENERALES -->
        <div class="form-section">
          <h3 class="section-title">
            <i class="bi bi-info-circle"></i>
            Datos Generales
          </h3>
          <div class="row">
            <div class="col-md-6">
              <div class="field-group">
                <label>
                  <i class="bi bi-hash"></i>
                  Número de Mesa <span class="required">*</span>
                </label>
                <input 
                  type="text" 
                  v-model="form.numero" 
                  placeholder="Ej: 1, 2A, 3B..."
                  class="form-control"
                  :class="{ 'error': errors.numero }"
                  @blur="validateField('numero')"
                >
                <span class="error-msg" v-if="errors.numero">
                  <i class="bi bi-exclamation-circle"></i> {{ errors.numero }}
                </span>
                <small class="help-text">Identificador único de la mesa</small>
              </div>
            </div>
            <div class="col-md-6">
              <div class="field-group">
                <label>
                  <i class="bi bi-person"></i>
                  Capacidad <span class="required">*</span>
                </label>
                <select 
                  v-model="form.capacidad" 
                  class="form-control"
                  :class="{ 'error': errors.capacidad }"
                  @change="validateField('capacidad')"
                >
                  <option value="">Selecciona capacidad</option>
                  <option value="1">1 persona</option>
                  <option value="2">2 personas</option>
                  <option value="3">3 personas</option>
                  <option value="4">4 personas</option>
                  <option value="5">5 personas</option>
                  <option value="6">6 personas</option>
                  <option value="8">8 personas</option>
                  <option value="10">10 personas</option>
                  <option value="12">12 personas</option>
                  <option value="15">15 personas</option>
                  <option value="20">20 personas</option>
                </select>
                <span class="error-msg" v-if="errors.capacidad">
                  <i class="bi bi-exclamation-circle"></i> {{ errors.capacidad }}
                </span>
                <small class="help-text">Número máximo de personas por mesa</small>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="field-group">
                <label>
                  <i class="bi bi-building"></i>
                  Sede <span class="required">*</span>
                </label>
                <select 
                  v-model="form.sede_id" 
                  class="form-control"
                  :class="{ 'error': errors.sede_id }"
                  @change="validateField('sede_id')"
                >
                  <option value="">Selecciona una sede</option>
                  <option v-for="sede in sedes" :key="sede.id" :value="sede.id">
                    {{ sede.nombre }}
                  </option>
                </select>
                <span class="error-msg" v-if="errors.sede_id">
                  <i class="bi bi-exclamation-circle"></i> {{ errors.sede_id }}
                </span>
              </div>
            </div>
            <div class="col-md-6">
              <div class="field-group">
                <label>
                  <i class="bi bi-geo-alt"></i>
                  Ubicación <span class="required">*</span>
                </label>
                <select 
                  v-model="form.ubicacion" 
                  class="form-control"
                  :class="{ 'error': errors.ubicacion }"
                  @change="validateField('ubicacion')"
                >
                  <option value="">Selecciona ubicación</option>
                  <option value="Terraza">Terraza</option>
                  <option value="Interior">Interior</option>
                  <option value="Salón Principal">Salón Principal</option>
                  <option value="Salón Privado">Salón Privado</option>
                  <option value="Jardín">Jardín</option>
                  <option value="Barra">Barra</option>
                  <option value="VIP">VIP</option>
                  <option value="Exterior">Exterior</option>
                </select>
                <span class="error-msg" v-if="errors.ubicacion">
                  <i class="bi bi-exclamation-circle"></i> {{ errors.ubicacion }}
                </span>
                <small class="help-text">Ubicación física de la mesa</small>
              </div>
            </div>
          </div>
        </div>

        <!-- SECCIÓN: ESTADO DE LA MESA -->
        <div class="form-section">
          <h3 class="section-title">
            <i class="bi bi-toggle-on"></i>
            Estado de la Mesa
          </h3>
          <div class="row">
            <div class="col-md-6">
              <div class="field-group">
                <label>
                  <i class="bi bi-circle"></i>
                  Estado <span class="required">*</span>
                </label>
                <select 
                  v-model="form.estado" 
                  class="form-control"
                  :class="{ 'error': errors.estado }"
                  @change="validateField('estado')"
                >
                  <option value="">Selecciona un estado</option>
                  <option value="Disponible">🟢 Disponible</option>
                  <option value="Ocupada">🔴 Ocupada</option>
                  <option value="Reservada">🟡 Reservada</option>
                  <option value="Mantenimiento">⚪ Mantenimiento</option>
                </select>
                <span class="error-msg" v-if="errors.estado">
                  <i class="bi bi-exclamation-circle"></i> {{ errors.estado }}
                </span>
                <small class="help-text">Estado actual de la mesa</small>
              </div>
            </div>
            <div class="col-md-6">
              <div class="field-group">
                <label>
                  <i class="bi bi-qr-code"></i>
                  Código QR
                </label>
                <div class="qr-input-group">
                  <input 
                    type="text" 
                    v-model="form.codigo_qr" 
                    placeholder="Código QR automático o manual"
                    class="form-control"
                  >
                  <button type="button" class="btn btn-outline-secondary" @click="generarQR">
                    <i class="bi bi-arrow-repeat"></i> Generar
                  </button>
                </div>
                <small class="help-text">Código QR para acceder a la mesa (opcional)</small>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12">
              <div class="field-group checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="form.activo">
                  <span class="toggle-text">
                    <i class="bi" :class="form.activo ? 'bi-toggle-on text-success' : 'bi-toggle-off text-muted'"></i>
                    {{ form.activo ? 'Mesa Activa' : 'Mesa Inactiva' }}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- VISTA PREVIA DE LA MESA -->
        <div class="form-section" v-if="form.numero">
          <h3 class="section-title">
            <i class="bi bi-eye"></i>
            Vista Previa
          </h3>
          <div class="preview-card">
            <div class="preview-table" :class="getEstadoClase(form.estado)">
              <div class="preview-number">Mesa {{ form.numero }}</div>
              <div class="preview-details">
                <span><i class="bi bi-person"></i> {{ form.capacidad || '?' }} personas</span>
                <span><i class="bi bi-geo-alt"></i> {{ form.ubicacion || 'Sin ubicación' }}</span>
                <span class="preview-status">
                  <i class="bi" :class="getEstadoIcon(form.estado)"></i>
                  {{ form.estado || 'Sin estado' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- BOTONES -->
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <i class="bi" :class="loading ? 'bi-arrow-repeat spin' : 'bi-save'"></i>
            {{ loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear') }}
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
import { useRoute, useRouter } from 'vue-router'
import { MesasAPI, SedesAPI } from '@/services/api'
import Swal from 'sweetalert2'

// ===== ROUTER =====
const route = useRoute()
const router = useRouter()

// ===== STATE =====
const loading = ref(false)
const isEditing = ref(false)
const sedes = ref([])

// ===== FORM =====
const defaultForm = {
  sede_id: '',
  numero: '',
  capacidad: '',
  ubicacion: '',
  codigo_qr: '',
  estado: 'Disponible',
  activo: true
}

const form = reactive({ ...defaultForm })

// ===== ERRORS =====
const errors = reactive({
  numero: '',
  capacidad: '',
  ubicacion: '',
  sede_id: '',
  estado: ''
})

// ===== VALIDACIONES =====
const validations = {
  numero: (val) => {
    if (!val?.trim()) return 'El número de mesa es obligatorio'
    if (val.trim().length < 1) return 'Mínimo 1 caracter'
    return ''
  },
  capacidad: (val) => {
    if (!val) return 'La capacidad es obligatoria'
    if (val < 1) return 'La capacidad debe ser mayor a 0'
    return ''
  },
  ubicacion: (val) => {
    if (!val) return 'La ubicación es obligatoria'
    return ''
  },
  sede_id: (val) => {
    if (!val) return 'La sede es obligatoria'
    return ''
  },
  estado: (val) => {
    if (!val) return 'El estado es obligatorio'
    return ''
  }
}

function validateField(field) {
  const validator = validations[field]
  if (validator) errors[field] = validator(form[field])
}

function validateAll() {
  let isValid = true
  for (const field of Object.keys(validations)) {
    validateField(field)
    if (errors[field]) isValid = false
  }
  return isValid
}

// ===== ESTADOS DE MESA =====
function getEstadoClase(estado) {
  const map = {
    'Disponible': 'preview-available',
    'Ocupada': 'preview-occupied',
    'Reservada': 'preview-reserved',
    'Mantenimiento': 'preview-maintenance'
  }
  return map[estado] || ''
}

function getEstadoIcon(estado) {
  const map = {
    'Disponible': 'bi-check-circle',
    'Ocupada': 'bi-person-fill',
    'Reservada': 'bi-clock',
    'Mantenimiento': 'bi-tools'
  }
  return map[estado] || 'bi-circle'
}

// ===== GENERAR QR =====
function generarQR() {
  const numero = form.numero || 'MESA'
  const sede = form.sede_id || 'SEDE'
  const codigo = `MESA-${numero}-${sede}-${Date.now().toString().slice(-6)}`
  form.codigo_qr = codigo
  Swal.fire({
    title: '✅ Código QR Generado',
    text: `Código: ${codigo}`,
    icon: 'success',
    timer: 2000,
    showConfirmButton: false
  })
}

// ===== LOAD DATA =====
async function loadSedes() {
  try {
    const res = await SedesAPI.list()
    sedes.value = res.data.data || []
  } catch (error) {
    console.error('Error cargando sedes:', error)
  }
}

async function loadItem(id) {
  try {
    const res = await MesasAPI.getById(id)
    const data = res.data
    Object.assign(form, data)
    isEditing.value = true
  } catch (error) {
    Swal.fire('Error', 'No se pudo cargar la mesa', 'error')
    router.push('/mesas')
  }
}

// ===== HANDLE SUBMIT =====
async function handleSubmit() {
  if (!validateAll()) {
    Swal.fire({
      title: 'Error de validación',
      text: 'Corrige los campos marcados en rojo',
      icon: 'error',
      confirmButtonText: 'Entendido'
    })
    return
  }

  loading.value = true
  try {
    const payload = {
      sede_id: parseInt(form.sede_id),
      numero: form.numero.trim(),
      capacidad: parseInt(form.capacidad),
      ubicacion: form.ubicacion,
      codigo_qr: form.codigo_qr?.trim() || '',
      estado: form.estado,
      activo: form.activo
    }

    if (isEditing.value) {
      await MesasAPI.update(route.params.id, payload)
      Swal.fire({
        title: '¡Éxito!',
        text: 'Mesa actualizada correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      })
    } else {
      await MesasAPI.create(payload)
      Swal.fire({
        title: '¡Éxito!',
        text: 'Mesa creada correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      })
    }
    
    router.push('/mesas')
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data?.errors || 'Error al guardar'
    Swal.fire({
      title: 'Error',
      text: typeof message === 'string' ? message : JSON.stringify(message),
      icon: 'error',
      confirmButtonText: 'Entendido'
    })
  } finally {
    loading.value = false
  }
}

function cancelar() {
  router.push('/mesas')
}

// ===== LIFECYCLE =====
onMounted(async () => {
  await loadSedes()
  
  const id = route.params.id
  if (id && id !== 'nuevo') {
    isEditing.value = true
    await loadItem(id)
  }
})
</script>

<style scoped>
/* ============================================
   PAGE CONTAINER
   ============================================ */
.page-container {
  padding: 24px;
  max-width: 1000px;
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
}

/* ============================================
   FORM CARD
   ============================================ */
.form-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 32px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.form-section {
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid #f3f4f6;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title i {
  color: #2F6FED;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 768px) {
  .row {
    grid-template-columns: 1fr;
    gap: 0;
  }
}

/* ============================================
   FIELD GROUP
   ============================================ */
.field-group {
  margin-bottom: 18px;
}

.field-group label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  font-size: 13px;
  color: #374151;
  margin-bottom: 6px;
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
  padding: 10px 16px;
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

.form-control.error {
  border-color: #ef4444;
  background: #fef2f2;
}

.form-control.error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.08);
}

select.form-control {
  appearance: auto;
  cursor: pointer;
}

.error-msg {
  color: #ef4444;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}

.error-msg i {
  font-size: 14px;
}

.help-text {
  color: #9ca3af;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  font-style: italic;
}

/* ============================================
   QR INPUT GROUP
   ============================================ */
.qr-input-group {
  display: flex;
  gap: 8px;
}

.qr-input-group .form-control {
  flex: 1;
}

.qr-input-group .btn {
  flex-shrink: 0;
}

/* ============================================
   CHECKBOX
   ============================================ */
.checkbox-group {
  margin-top: 4px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-weight: 400;
  font-size: 14px;
  color: #374151;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  margin: 0;
  cursor: pointer;
  accent-color: #2F6FED;
  flex-shrink: 0;
}

.toggle-text {
  display: flex;
  align-items: center;
  gap: 6px;
}

.text-success { color: #22c55e; }
.text-muted { color: #9ca3af; }

/* ============================================
   PREVIEW
   ============================================ */
.preview-card {
  display: flex;
  justify-content: center;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
}

.preview-table {
  width: 100%;
  max-width: 300px;
  padding: 30px 20px;
  border-radius: 16px;
  text-align: center;
  border: 3px solid #d1d5db;
  transition: all 0.3s ease;
}

.preview-table.preview-available {
  border-color: #22c55e;
  background: #f0fdf4;
}

.preview-table.preview-occupied {
  border-color: #dc2626;
  background: #fef2f2;
}

.preview-table.preview-reserved {
  border-color: #d97706;
  background: #fffbeb;
}

.preview-table.preview-maintenance {
  border-color: #6b7280;
  background: #f3f4f6;
}

.preview-number {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
}

.preview-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: #6b7280;
}

.preview-details span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.preview-status {
  font-weight: 600;
  color: #111827;
}

/* ============================================
   BUTTONS
   ============================================ */
.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  font-family: inherit;
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

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ============================================
   RESPONSIVE
   ============================================ */
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

  .form-card {
    padding: 20px;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .btn {
    width: 100%;
    justify-content: center;
  }

  .form-section {
    margin-bottom: 20px;
    padding-bottom: 20px;
  }

  .qr-input-group {
    flex-direction: column;
  }

  .preview-table {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .header-title i {
    font-size: 24px;
    padding: 8px;
  }

  .header-title h1 {
    font-size: 16px;
  }

  .form-card {
    padding: 16px;
  }

  .form-control {
    font-size: 13px;
    padding: 8px 12px;
  }

  .preview-number {
    font-size: 22px;
  }
}
</style>