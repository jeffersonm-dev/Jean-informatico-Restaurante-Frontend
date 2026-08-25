<!-- src/views/restaurante/Cliente/ClienteFormView.vue -->
<template>
  <div class="page-container">
    <!-- HEADER -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-title">
          <i class="bi bi-person-plus"></i>
          <div>
            <h1>{{ isEditing ? 'Editar Cliente' : 'Nuevo Cliente' }}</h1>
            <p class="text-muted">
              {{ isEditing ? 'Modifica los datos del cliente' : 'Registra un nuevo cliente en el sistema' }}
            </p>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <router-link to="/clientes" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left"></i> Volver
        </router-link>
      </div>
    </div>

    <!-- FORMULARIO -->
    <div class="form-card">
      <form @submit.prevent="handleSubmit" novalidate>
        <!-- SECCIÓN: DATOS PERSONALES -->
        <div class="form-section">
          <h3 class="section-title">
            <i class="bi bi-person"></i>
            Datos Personales
          </h3>
          <div class="row">
            <div class="col-md-4">
              <div class="field-group">
                <label>
                  <i class="bi bi-card-text"></i>
                  Cédula <span class="required">*</span>
                </label>
                <input 
                  type="text" 
                  v-model="form.cedula" 
                  placeholder="V-12345678"
                  class="form-control"
                  :class="{ 'error': errors.cedula }"
                  @blur="validateField('cedula')"
                  maxlength="12"
                >
                <span class="error-msg" v-if="errors.cedula">
                  <i class="bi bi-exclamation-circle"></i> {{ errors.cedula }}
                </span>
                <small class="help-text">Formato: V-12345678, E-12345678, J-12345678</small>
              </div>
            </div>
            <div class="col-md-4">
              <div class="field-group">
                <label>
                  <i class="bi bi-person"></i>
                  Nombre <span class="required">*</span>
                </label>
                <input 
                  type="text" 
                  v-model="form.nombre" 
                  placeholder="Nombre del cliente"
                  class="form-control"
                  :class="{ 'error': errors.nombre }"
                  @blur="validateField('nombre')"
                >
                <span class="error-msg" v-if="errors.nombre">
                  <i class="bi bi-exclamation-circle"></i> {{ errors.nombre }}
                </span>
              </div>
            </div>
            <div class="col-md-4">
              <div class="field-group">
                <label>
                  <i class="bi bi-person"></i>
                  Apellido <span class="required">*</span>
                </label>
                <input 
                  type="text" 
                  v-model="form.apellido" 
                  placeholder="Apellido del cliente"
                  class="form-control"
                  :class="{ 'error': errors.apellido }"
                  @blur="validateField('apellido')"
                >
                <span class="error-msg" v-if="errors.apellido">
                  <i class="bi bi-exclamation-circle"></i> {{ errors.apellido }}
                </span>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="field-group">
                <label>
                  <i class="bi bi-calendar"></i>
                  Fecha de Nacimiento
                </label>
                <input 
                  type="date" 
                  v-model="form.fecha_nacimiento" 
                  class="form-control"
                  :max="fechaMaxima"
                >
                <small class="help-text">Opcional</small>
              </div>
            </div>
            <div class="col-md-6">
              <div class="field-group">
                <label>
                  <i class="bi bi-gender-ambiguous"></i>
                  Género
                </label>
                <select v-model="form.genero" class="form-control">
                  <option value="">Selecciona un género</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
                <small class="help-text">Opcional</small>
              </div>
            </div>
          </div>
        </div>

        <!-- SECCIÓN: CONTACTO -->
        <div class="form-section">
          <h3 class="section-title">
            <i class="bi bi-telephone"></i>
            Datos de Contacto
          </h3>
          <div class="row">
            <div class="col-md-6">
              <div class="field-group">
                <label>
                  <i class="bi bi-telephone"></i>
                  Teléfono <span class="required">*</span>
                </label>
                <input 
                  type="text" 
                  v-model="form.telefono" 
                  placeholder="+58 412-1234567"
                  class="form-control"
                  :class="{ 'error': errors.telefono }"
                  @blur="validateField('telefono')"
                >
                <span class="error-msg" v-if="errors.telefono">
                  <i class="bi bi-exclamation-circle"></i> {{ errors.telefono }}
                </span>
              </div>
            </div>
            <div class="col-md-6">
              <div class="field-group">
                <label>
                  <i class="bi bi-envelope"></i>
                  Email <span class="required">*</span>
                </label>
                <input 
                  type="email" 
                  v-model="form.email" 
                  placeholder="cliente@email.com"
                  class="form-control"
                  :class="{ 'error': errors.email }"
                  @blur="validateField('email')"
                >
                <span class="error-msg" v-if="errors.email">
                  <i class="bi bi-exclamation-circle"></i> {{ errors.email }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- SECCIÓN: UBICACIÓN -->
        <div class="form-section">
          <h3 class="section-title">
            <i class="bi bi-geo-alt"></i>
            Ubicación
          </h3>
          <div class="row">
            <div class="col-md-12">
              <div class="field-group">
                <label>
                  <i class="bi bi-map"></i>
                  Dirección
                </label>
                <input 
                  type="text" 
                  v-model="form.direccion" 
                  placeholder="Calle, número, edificio..."
                  class="form-control"
                >
                <small class="help-text">Opcional</small>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="field-group">
                <label>
                  <i class="bi bi-city"></i>
                  Ciudad <span class="required">*</span>
                </label>
                <select 
                  v-model="form.ciudad" 
                  class="form-control"
                  :class="{ 'error': errors.ciudad }"
                  @change="validateField('ciudad')"
                >
                  <option value="">Selecciona una ciudad</option>
                  <option v-for="ciudad in ciudadesFiltradas" :key="ciudad" :value="ciudad">
                    {{ ciudad }}
                  </option>
                </select>
                <span class="error-msg" v-if="errors.ciudad">
                  <i class="bi bi-exclamation-circle"></i> {{ errors.ciudad }}
                </span>
              </div>
            </div>
            <div class="col-md-6">
              <div class="field-group">
                <label>
                  <i class="bi bi-geo-alt"></i>
                  Estado <span class="required">*</span>
                </label>
                <select 
                  v-model="form.estado" 
                  class="form-control"
                  :class="{ 'error': errors.estado }"
                  @change="onEstadoChange"
                >
                  <option value="">Selecciona un estado</option>
                  <option v-for="estado in estados" :key="estado" :value="estado">
                    {{ estado }}
                  </option>
                </select>
                <span class="error-msg" v-if="errors.estado">
                  <i class="bi bi-exclamation-circle"></i> {{ errors.estado }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- SECCIÓN: TIPO Y CRÉDITO -->
        <div class="form-section">
          <h3 class="section-title">
            <i class="bi bi-credit-card"></i>
            Tipo y Crédito
          </h3>
          <div class="row">
            <div class="col-md-4">
              <div class="field-group">
                <label>
                  <i class="bi bi-person"></i>
                  Tipo de Cliente <span class="required">*</span>
                </label>
                <select 
                  v-model="form.tipo_cliente" 
                  class="form-control"
                  :class="{ 'error': errors.tipo_cliente }"
                  @change="validateField('tipo_cliente')"
                >
                  <option value="">Selecciona un tipo</option>
                  <option value="Regular">Regular</option>
                  <option value="VIP">VIP</option>
                  <option value="Corporativo">Corporativo</option>
                  <option value="Frecuente">Frecuente</option>
                </select>
                <span class="error-msg" v-if="errors.tipo_cliente">
                  <i class="bi bi-exclamation-circle"></i> {{ errors.tipo_cliente }}
                </span>
              </div>
            </div>
            <div class="col-md-4">
              <div class="field-group">
                <label>
                  <i class="bi bi-coin"></i>
                  Límite de Crédito
                </label>
                <input 
                  type="number" 
                  v-model="form.limite_credito" 
                  placeholder="0.00"
                  class="form-control"
                  step="0.01"
                  min="0"
                >
                <small class="help-text">Máximo permitido</small>
              </div>
            </div>
            <div class="col-md-4">
              <div class="field-group">
                <label>
                  <i class="bi bi-coin"></i>
                  Crédito Disponible
                </label>
                <input 
                  type="number" 
                  v-model="form.credito_disponible" 
                  placeholder="0.00"
                  class="form-control"
                  step="0.01"
                  min="0"
                >
                <small class="help-text">Crédito disponible actual</small>
              </div>
            </div>
          </div>
        </div>

        <!-- SECCIÓN: PREFERENCIAS Y FOTO -->
        <div class="form-section">
          <h3 class="section-title">
            <i class="bi bi-heart"></i>
            Preferencias y Foto
          </h3>
          <div class="row">
            <div class="col-md-12">
              <div class="field-group">
                <label>
                  <i class="bi bi-card-text"></i>
                  Preferencias
                </label>
                <textarea 
                  v-model="form.preferencias" 
                  rows="3"
                  placeholder="Preferencias del cliente (comidas favoritas, alergias, etc.)"
                  class="form-control"
                ></textarea>
                <small class="help-text">Opcional</small>
              </div>
            </div>
          </div>

          <!-- ⭐ NUEVO: SUBIDA DE FOTO LOCAL -->
          <div class="row">
            <div class="col-md-12">
              <div class="field-group">
                <label>
                  <i class="bi bi-image"></i>
                  Foto del Cliente
                </label>
                <div class="photo-upload">
                  <!-- Preview de la foto -->
                  <div class="photo-preview" v-if="fotoPreview || form.foto_url">
                    <img 
                      :src="fotoPreview || form.foto_url" 
                      alt="Foto del cliente"
                      class="photo-image"
                    >
                    <button 
                      type="button" 
                      class="btn-remove-photo"
                      @click="removerFoto"
                      title="Eliminar foto"
                    >
                      <i class="bi bi-x-circle"></i>
                    </button>
                  </div>
                  <div class="photo-placeholder" v-else>
                    <i class="bi bi-person fs-1 text-muted"></i>
                    <span>Sin foto</span>
                  </div>

                  <!-- Botón de subida -->
                  <div class="photo-actions">
                    <label class="btn btn-outline-secondary">
                      <i class="bi bi-upload"></i> Seleccionar Imagen
                      <input 
                        type="file" 
                        @change="onFileSelected"
                        accept="image/*"
                        style="display: none"
                      >
                    </label>
                    <small class="help-text">Formatos: JPG, PNG, GIF. Máx: 2MB</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SECCIÓN: ESTADO -->
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
                {{ form.activo ? 'Cliente Activo' : 'Cliente Inactivo' }}
              </span>
            </label>
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
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ClientesAPI } from '@/services/api'
import Swal from 'sweetalert2'

// ===== ROUTER =====
const route = useRoute()
const router = useRouter()

// ===== STATE =====
const loading = ref(false)
const isEditing = ref(false)
const fotoPreview = ref(null)
const fotoFile = ref(null)

// ===== LISTA DE ESTADOS =====
const estados = [
  'Amazonas', 'Anzoátegui', 'Apure', 'Aragua', 'Barinas', 'Bolívar',
  'Carabobo', 'Cojedes', 'Delta Amacuro', 'Falcón', 'Guárico', 'Lara',
  'Mérida', 'Miranda', 'Monagas', 'Nueva Esparta', 'Portuguesa', 'Sucre',
  'Táchira', 'Trujillo', 'La Guaira', 'Yaracuy', 'Zulia', 'Distrito Capital'
]

// ===== CIUDADES POR ESTADO =====
const ciudadesPorEstado = {
  'Amazonas': ['Puerto Ayacucho'],
  'Anzoátegui': ['Barcelona', 'Puerto La Cruz', 'Lechería', 'El Tigre', 'Anaco'],
  'Apure': ['San Fernando de Apure', 'Guasdualito'],
  'Aragua': ['Maracay', 'El Limón', 'Turmero', 'La Victoria', 'Cagua'],
  'Barinas': ['Barinas', 'Sabaneta'],
  'Bolívar': ['Ciudad Bolívar', 'Puerto Ordaz', 'Ciudad Guayana', 'Upata'],
  'Carabobo': ['Valencia', 'Puerto Cabello', 'Guacara', 'Los Guayos', 'Naguanagua'],
  'Cojedes': ['San Carlos'],
  'Delta Amacuro': ['Tucupita'],
  'Falcón': ['Coro', 'Punto Fijo'],
  'Guárico': ['Calabozo', 'San Juan de los Morros', 'Valle de la Pascua'],
  'Lara': ['Barquisimeto', 'Carora'],
  'Mérida': ['Mérida', 'Ejido'],
  'Miranda': ['Los Teques', 'Guarenas', 'Guatire', 'Ocumare del Tuy', 'Charallave'],
  'Monagas': ['Maturín'],
  'Nueva Esparta': ['Porlamar', 'Juan Griego'],
  'Portuguesa': ['Guanare', 'Acarigua', 'Araure'],
  'Sucre': ['Cumaná', 'Carúpano'],
  'Táchira': ['San Cristóbal', 'Rubio'],
  'Trujillo': ['Trujillo', 'Valera'],
  'La Guaira': ['La Guaira', 'Maiquetía'],
  'Yaracuy': ['San Felipe'],
  'Zulia': ['Maracaibo', 'Cabimas', 'Ciudad Ojeda'],
  'Distrito Capital': ['Caracas']
}

// ===== CIUDADES FILTRADAS =====
const ciudadesFiltradas = computed(() => {
  if (!form.estado) return []
  return ciudadesPorEstado[form.estado] || []
})

const fechaMaxima = computed(() => {
  const hoy = new Date()
  const year = hoy.getFullYear() - 18
  return `${year}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`
})

// ===== FORM =====
const defaultForm = {
  cedula: '',
  nombre: '',
  apellido: '',
  telefono: '',
  email: '',
  direccion: '',
  ciudad: '',
  estado: '',
  tipo_cliente: '',
  credito_disponible: 0,
  credito_utilizado: 0,
  limite_credito: 0,
  foto_url: '',
  fecha_nacimiento: '',
  genero: '',
  preferencias: '',
  activo: true,
  usuario_creacion: 1
}

const form = reactive({ ...defaultForm })

// ===== ERRORS =====
const errors = reactive({
  cedula: '',
  nombre: '',
  apellido: '',
  telefono: '',
  email: '',
  ciudad: '',
  estado: '',
  tipo_cliente: ''
})

// ===== VALIDACIONES =====
const validations = {
  cedula: (val) => {
    if (!val?.trim()) return 'La cédula es obligatoria'
    if (!/^[VEJ]-?\d{7,9}$/i.test(val.trim())) {
      return 'Formato inválido (Ej: V-12345678)'
    }
    return ''
  },
  nombre: (val) => {
    if (!val?.trim()) return 'El nombre es obligatorio'
    if (val.trim().length < 2) return 'Mínimo 2 caracteres'
    return ''
  },
  apellido: (val) => {
    if (!val?.trim()) return 'El apellido es obligatorio'
    if (val.trim().length < 2) return 'Mínimo 2 caracteres'
    return ''
  },
  telefono: (val) => {
    if (!val?.trim()) return 'El teléfono es obligatorio'
    if (val.trim().length < 7) return 'Mínimo 7 dígitos'
    return ''
  },
  email: (val) => {
    if (!val?.trim()) return 'El email es obligatorio'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) {
      return 'Email inválido (Ej: cliente@email.com)'
    }
    return ''
  },
  ciudad: (val) => {
    if (!val) return 'La ciudad es obligatoria'
    return ''
  },
  estado: (val) => {
    if (!val) return 'El estado es obligatorio'
    return ''
  },
  tipo_cliente: (val) => {
    if (!val) return 'El tipo de cliente es obligatorio'
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

// ===== EVENTOS =====
function onEstadoChange() {
  form.ciudad = ''
  validateField('estado')
  if (errors.ciudad) errors.ciudad = ''
}

// ===== MANEJO DE FOTO =====
function onFileSelected(event) {
  const file = event.target.files[0]
  if (!file) return

  // Validar tamaño (2MB máximo)
  if (file.size > 2 * 1024 * 1024) {
    Swal.fire({
      title: 'Error',
      text: 'La imagen no puede ser mayor a 2MB',
      icon: 'error',
      confirmButtonText: 'Entendido'
    })
    event.target.value = ''
    return
  }

  // Validar tipo
  const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!tiposPermitidos.includes(file.type)) {
    Swal.fire({
      title: 'Error',
      text: 'Formato no permitido. Usa JPG, PNG, GIF o WEBP',
      icon: 'error',
      confirmButtonText: 'Entendido'
    })
    event.target.value = ''
    return
  }

  fotoFile.value = file

  // Crear preview
  const reader = new FileReader()
  reader.onload = (e) => {
    fotoPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

function removerFoto() {
  fotoPreview.value = null
  fotoFile.value = null
  form.foto_url = ''
  // Limpiar el input file
  const fileInput = document.querySelector('input[type="file"]')
  if (fileInput) fileInput.value = ''
}

// ===== LOAD DATA =====
async function loadItem(id) {
  try {
    const res = await ClientesAPI.getById(id)
    const data = res.data
    Object.assign(form, data)
    if (data.foto_url) {
      fotoPreview.value = data.foto_url
    }
    isEditing.value = true
  } catch (error) {
    Swal.fire('Error', 'No se pudo cargar el cliente', 'error')
    router.push('/clientes')
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
    let fotoUrl = form.foto_url || ''

    // Si hay una foto nueva subida, convertir a Base64
    if (fotoFile.value) {
      fotoUrl = await convertirImagenABase64(fotoFile.value)
    }

    const payload = {
      cedula: form.cedula.trim().toUpperCase(),
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      telefono: form.telefono.trim(),
      email: form.email.trim().toLowerCase(),
      direccion: form.direccion?.trim() || '',
      ciudad: form.ciudad || '',
      estado: form.estado || '',
      tipo_cliente: form.tipo_cliente,
      credito_disponible: parseFloat(form.credito_disponible) || 0,
      credito_utilizado: parseFloat(form.credito_utilizado) || 0,
      limite_credito: parseFloat(form.limite_credito) || 0,
      foto_url: fotoUrl,
      fecha_nacimiento: form.fecha_nacimiento || null,
      genero: form.genero || '',
      preferencias: form.preferencias?.trim() || '',
      activo: form.activo,
      usuario_creacion: 1
    }

    if (isEditing.value) {
      await ClientesAPI.update(route.params.id, payload)
      Swal.fire({
        title: '¡Éxito!',
        text: 'Cliente actualizado correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      })
    } else {
      await ClientesAPI.create(payload)
      Swal.fire({
        title: '¡Éxito!',
        text: 'Cliente creado correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      })
    }
    
    router.push('/clientes')
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

// ===== CONVERTIR IMAGEN A BASE64 =====
function convertirImagenABase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function cancelar() {
  router.push('/clientes')
}

// ===== LIFECYCLE =====
onMounted(async () => {
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
   PHOTO UPLOAD
   ============================================ */
.photo-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  background: #f9fafb;
  transition: all 0.2s ease;
}

.photo-upload:hover {
  border-color: #2F6FED;
  background: #f0f4ff;
}

.photo-preview {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #2F6FED;
  flex-shrink: 0;
}

.photo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-remove-photo {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #dc2626;
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s ease;
  padding: 0;
}

.btn-remove-photo:hover {
  transform: scale(1.1);
}

.photo-placeholder {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  border: 3px dashed #d1d5db;
}

.photo-placeholder i {
  font-size: 48px;
}

.photo-placeholder span {
  font-size: 12px;
  margin-top: 4px;
}

.photo-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.photo-actions .btn {
  font-size: 13px;
  padding: 6px 16px;
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
.text-warning { color: #d97706; }

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

  .photo-preview,
  .photo-placeholder {
    width: 120px;
    height: 120px;
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

  .photo-preview,
  .photo-placeholder {
    width: 100px;
    height: 100px;
  }
}
</style>