<!-- src/views/restaurante/CuentaBancaria/CuentaBancariaFormView.vue -->
<template>
  <div class="page-container">
    <!-- HEADER -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-title">
          <i class="bi bi-bank"></i>
          <div>
            <h1>{{ isEditing ? 'Editar Cuenta Bancaria' : 'Nueva Cuenta Bancaria' }}</h1>
            <p class="text-muted">
              {{ isEditing ? 'Modifica los datos de la cuenta bancaria' : 'Registra una nueva cuenta bancaria para la empresa' }}
            </p>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <router-link to="/cuentas-bancarias-empresa" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left"></i> Volver
        </router-link>
      </div>
    </div>

    <!-- FORMULARIO -->
    <div class="form-card">
      <form @submit.prevent="handleSubmit" novalidate>
        <div class="row">
          <!-- Banco -->
          <div class="col-md-6">
            <div class="field-group">
              <label>
                <i class="bi bi-building"></i>
                Banco <span class="required">*</span>
              </label>
              <select 
                v-model="form.banco" 
                class="form-control"
                :class="{ 'error': errors.banco }"
                @blur="validateField('banco')"
              >
                <option value="">Selecciona un banco</option>
                <option v-for="banco in bancos" :key="banco" :value="banco">
                  {{ banco }}
                </option>
              </select>
              <span class="error-msg" v-if="errors.banco">
                <i class="bi bi-exclamation-circle"></i> {{ errors.banco }}
              </span>
            </div>
          </div>

          <!-- Tipo de Cuenta -->
          <div class="col-md-6">
            <div class="field-group">
              <label>
                <i class="bi bi-tag"></i>
                Tipo de Cuenta <span class="required">*</span>
              </label>
              <select 
                v-model="form.tipo_cuenta" 
                class="form-control"
                :class="{ 'error': errors.tipo_cuenta }"
                @blur="validateField('tipo_cuenta')"
              >
                <option value="">Selecciona un tipo</option>
                <option v-for="tipo in tipos" :key="tipo" :value="tipo">
                  {{ tipo }}
                </option>
              </select>
              <span class="error-msg" v-if="errors.tipo_cuenta">
                <i class="bi bi-exclamation-circle"></i> {{ errors.tipo_cuenta }}
              </span>
            </div>
          </div>
        </div>

        <div class="row">
          <!-- Número de Cuenta -->
          <div class="col-md-6">
            <div class="field-group">
              <label>
                <i class="bi bi-hash"></i>
                Número de Cuenta <span class="required">*</span>
              </label>
              <input 
                type="text" 
                v-model="form.numero_cuenta" 
                placeholder="Ej. 0102 0123 45 0000123456"
                class="form-control"
                :class="{ 'error': errors.numero_cuenta }"
                @blur="validateField('numero_cuenta')"
              >
              <span class="error-msg" v-if="errors.numero_cuenta">
                <i class="bi bi-exclamation-circle"></i> {{ errors.numero_cuenta }}
              </span>
              <small class="help-text">Ingresa el número de cuenta sin espacios ni guiones</small>
            </div>
          </div>

          <!-- RIF -->
          <div class="col-md-6">
            <div class="field-group">
              <label>
                <i class="bi bi-card-text"></i>
                Número RIF
              </label>
              <input 
                type="text" 
                v-model="form.numero_rif" 
                placeholder="Ej. J-12345678-9"
                class="form-control"
              >
              <small class="help-text">Registro de Información Fiscal (opcional)</small>
            </div>
          </div>
        </div>

        <div class="row">
          <!-- Titular Nombre -->
          <div class="col-md-6">
            <div class="field-group">
              <label>
                <i class="bi bi-person"></i>
                Titular Nombre <span class="required">*</span>
              </label>
              <input 
                type="text" 
                v-model="form.titular_nombre" 
                placeholder="Nombre del titular de la cuenta"
                class="form-control"
                :class="{ 'error': errors.titular_nombre }"
                @blur="validateField('titular_nombre')"
              >
              <span class="error-msg" v-if="errors.titular_nombre">
                <i class="bi bi-exclamation-circle"></i> {{ errors.titular_nombre }}
              </span>
            </div>
          </div>

          <!-- Código SWIFT -->
          <div class="col-md-6">
            <div class="field-group">
              <label>
                <i class="bi bi-code-square"></i>
                Código SWIFT
              </label>
              <input 
                type="text" 
                v-model="form.codigo_swift" 
                placeholder="Ej. BNSOVCBB"
                class="form-control"
              >
              <small class="help-text">Código internacional para transferencias (opcional)</small>
            </div>
          </div>
        </div>

        <div class="row">
          <!-- Sede -->
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
                @blur="validateField('sede_id')"
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
            <div class="field-group" style="margin-top: 28px;">
              <label class="checkbox-label">
                <input type="checkbox" v-model="form.es_principal">
                <span class="toggle-text">
                  <i class="bi" :class="form.es_principal ? 'bi-star-fill text-warning' : 'bi-star text-muted'"></i>
                  {{ form.es_principal ? 'Cuenta Principal' : 'Establecer como Principal' }}
                </span>
              </label>
              <small class="help-text" v-if="form.es_principal">Esta cuenta será la principal de la sede</small>
            </div>
          </div>
        </div>

        <!-- Observaciones -->
        <div class="field-group">
          <label>
            <i class="bi bi-card-text"></i>
            Observaciones
          </label>
          <textarea 
            v-model="form.observaciones" 
            rows="3"
            placeholder="Observaciones adicionales de la cuenta (opcional)"
            class="form-control"
          ></textarea>
        </div>

        <!-- Activo -->
        <div class="field-group checkbox-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="form.activo">
            <span class="toggle-text">
              <i class="bi" :class="form.activo ? 'bi-toggle-on text-success' : 'bi-toggle-off text-muted'"></i>
              {{ form.activo ? 'Cuenta Activa' : 'Cuenta Inactiva' }}
            </span>
          </label>
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
import { CuentasBancariasAPI, SedesAPI } from '@/services/api'
import Swal from 'sweetalert2'

// ===== ROUTER =====
const route = useRoute()
const router = useRouter()

// ===== STATE =====
const loading = ref(false)
const isEditing = ref(false)
const sedes = ref([])
const bancos = ref([])
const tipos = ref([])

// ===== FORM =====
const defaultForm = {
  sede_id: '',
  banco: '',
  tipo_cuenta: '',
  numero_cuenta: '',
  numero_rif: '',
  titular_nombre: '',
  codigo_swift: '',
  activo: true,
  es_principal: false,
  observaciones: ''
}

const form = reactive({ ...defaultForm })

// ===== ERRORS =====
const errors = reactive({
  banco: '',
  tipo_cuenta: '',
  numero_cuenta: '',
  titular_nombre: '',
  sede_id: ''
})

// ===== VALIDATIONS =====
const validations = {
  banco: (val) => !val ? 'El banco es obligatorio' : '',
  tipo_cuenta: (val) => !val ? 'El tipo de cuenta es obligatorio' : '',
  numero_cuenta: (val) => !val?.trim() ? 'El número de cuenta es obligatorio' : '',
  titular_nombre: (val) => !val?.trim() ? 'El nombre del titular es obligatorio' : '',
  sede_id: (val) => !val ? 'La sede es obligatoria' : ''
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

// ===== LOAD DATA =====
async function loadSedes() {
  try {
    const res = await SedesAPI.list()
    sedes.value = res.data.data || []
  } catch (error) {
    console.error('Error cargando sedes:', error)
  }
}

async function loadBancos() {
  try {
    const res = await CuentasBancariasAPI.getBancos()
    bancos.value = res.data || []
  } catch (error) {
    console.error('Error cargando bancos:', error)
    // Fallback
    bancos.value = ['Banesco', 'Mercantil', 'Provincial', 'Venezuela', 'BOD', 'Banplus', 'Del Tesoro', 'Caribe', 'Exterior', 'Nacional', 'Bicentenario', 'Sofitasa', 'Otro']
  }
}

async function loadTipos() {
  try {
    const res = await CuentasBancariasAPI.getTipos()
    tipos.value = res.data || []
  } catch (error) {
    console.error('Error cargando tipos:', error)
    // Fallback
    tipos.value = ['Corriente', 'Ahorro', 'Nómina', 'Inversión']
  }
}

async function loadItem(id) {
  try {
    const res = await CuentasBancariasAPI.getById(id)
    const data = res.data
    Object.assign(form, data)
    isEditing.value = true
  } catch (error) {
    Swal.fire('Error', 'No se pudo cargar la cuenta bancaria', 'error')
    router.push('/cuentas-bancarias-empresa')
  }
}

// ===== HANDLE SUBMIT =====
async function handleSubmit() {
  if (!validateAll()) {
    Swal.fire('Error', 'Corrige los campos marcados', 'error')
    return
  }

  loading.value = true
  try {
    const payload = {
      sede_id: form.sede_id,
      banco: form.banco,
      tipo_cuenta: form.tipo_cuenta,
      numero_cuenta: form.numero_cuenta.trim(),
      numero_rif: form.numero_rif?.trim() || '',
      titular_nombre: form.titular_nombre.trim(),
      codigo_swift: form.codigo_swift?.trim() || '',
      activo: form.activo,
      es_principal: form.es_principal,
      observaciones: form.observaciones?.trim() || '',
      fecha_creacion: new Date().toISOString()
    }

    if (isEditing.value) {
      await CuentasBancariasAPI.update(route.params.id, payload)
      Swal.fire('Éxito', 'Cuenta bancaria actualizada correctamente', 'success')
    } else {
      await CuentasBancariasAPI.create(payload)
      Swal.fire('Éxito', 'Cuenta bancaria creada correctamente', 'success')
    }
    
    router.push('/cuentas-bancarias-empresa')
  } catch (error) {
    Swal.fire('Error', error.response?.data?.message || 'Error al guardar', 'error')
  } finally {
    loading.value = false
  }
}

function cancelar() {
  router.push('/cuentas-bancarias-empresa')
}

// ===== LIFECYCLE =====
onMounted(async () => {
  await Promise.all([loadSedes(), loadBancos(), loadTipos()])
  
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
  max-width: 900px;
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

textarea.form-control {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
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
.text-warning { color: #d97706; }
.text-muted { color: #9ca3af; }

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
}
</style>