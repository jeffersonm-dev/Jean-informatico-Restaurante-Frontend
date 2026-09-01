<!-- src/views/restaurante/Proveedor/ProveedorFormView.vue -->
<template>
  <div class="page-container">
    <!-- HEADER -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-title">
          <i class="bi bi-truck"></i>
          <div>
            <h1>{{ isEditing ? 'Editar Proveedor' : 'Nuevo Proveedor' }}</h1>
            <p class="text-muted">
              {{ isEditing ? 'Modifica los datos del proveedor' : 'Registra un nuevo proveedor en el sistema' }}
            </p>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <router-link to="/proveedores" class="btn btn-outline-secondary">
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
                <label for="nombre">
                  <i class="bi bi-building"></i>
                  Nombre <span class="required">*</span>
                </label>
                <input 
                  id="nombre"
                  type="text" 
                  v-model="form.nombre" 
                  placeholder="Nombre del proveedor"
                  class="form-control"
                  :class="{ 'error': errors.nombre }"
                  @blur="validateField('nombre')"
                >
                <span class="error-msg" v-if="errors.nombre">
                  <i class="bi bi-exclamation-circle"></i> {{ errors.nombre }}
                </span>
              </div>
            </div>
            <div class="col-md-6">
              <div class="field-group">
                <label for="razonSocial">
                  <i class="bi bi-card-text"></i>
                  Razón Social
                </label>
                <input 
                  id="razonSocial"
                  type="text" 
                  v-model="form.razon_social" 
                  placeholder="Razón social del proveedor"
                  class="form-control"
                >
                <small class="help-text">Nombre legal de la empresa (opcional)</small>
              </div>
            </div>
          </div>

          <!-- RIF con SELECT y FORMATO AUTOMÁTICO -->
          <div class="row">
            <div class="col-md-6">
              <div class="field-group">
                <label for="tipoRif">
                  <i class="bi bi-person-badge"></i>
                  Tipo de RIF <span class="required">*</span>
                </label>
                <div class="rif-select-group">
                  <select 
                    id="tipoRif"
                    v-model="form.tipo_rif" 
                    class="form-control rif-tipo-select"
                    :class="{ 'error': errors.ruc }"
                    @change="onTipoRifChange"
                    aria-describedby="rif-help"
                  >
                    <option value="">Selecciona tipo</option>
                    <option value="V">V - Persona Natural Venezolana</option>
                    <option value="E">E - Persona Natural Extranjera</option>
                    <option value="J">J - Persona Jurídica</option>
                    <option value="G">G - Entidad Gubernamental</option>
                    <option value="P">P - Titular de Pasaporte</option>
                  </select>
                </div>
                <small class="help-text">Tipo de contribuyente según el SENIAT</small>
              </div>
            </div>
            <div class="col-md-6">
              <div class="field-group">
                <label for="rifNumero">
                  <i class="bi bi-hash"></i>
                  Número de RIF <span class="required">*</span>
                </label>
                <div class="rif-input-group">
                  <span class="rif-prefix">{{ form.tipo_rif || '?' }}</span>
                  <span class="rif-separator">-</span>
                  <input 
                    id="rifNumero"
                    type="text" 
                    v-model="form.rif_numero" 
                    placeholder="12345678"
                    class="form-control rif-numero-input"
                    :class="{ 'error': errors.ruc, 'valid': rifValido && form.rif_numero }"
                    @input="onRifNumeroInput"
                    @blur="validateField('ruc')"
                    maxlength="8"
                    inputmode="numeric"
                    pattern="[0-9]*"
                    aria-describedby="rif-error rif-help"
                  >
                  <span class="rif-separator">-</span>
                  <span class="rif-digito">{{ digitoVerificador || '?' }}</span>
                </div>
                <span id="rif-error" class="error-msg" v-if="errors.ruc" role="alert">
                  <i class="bi bi-exclamation-circle"></i> {{ errors.ruc }}
                </span>
                <span id="rif-success" class="success-msg" v-else-if="rifValido && form.rif_numero" role="status">
                  <i class="bi bi-check-circle-fill"></i> RIF válido: <strong>{{ rifFormateado }}</strong>
                </span>
                <small id="rif-help" class="help-text">
                  Ingresa los 8 dígitos del RIF (ej: 12345678)
                </small>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-4">
              <div class="field-group">
                <label for="tipoPersona">
                  <i class="bi bi-people"></i>
                  Tipo de Persona <span class="required">*</span>
                </label>
                <select 
                  id="tipoPersona"
                  v-model="form.tipo_persona" 
                  class="form-control"
                  :class="{ 'error': errors.tipo_persona }"
                  @change="validateField('tipo_persona')"
                >
                  <option value="">Selecciona un tipo</option>
                  <option value="Física">Física</option>
                  <option value="Jurídica">Jurídica</option>
                </select>
                <span class="error-msg" v-if="errors.tipo_persona">
                  <i class="bi bi-exclamation-circle"></i> {{ errors.tipo_persona }}
                </span>
              </div>
            </div>
            <div class="col-md-4">
              <div class="field-group">
                <label for="terminosPago">
                  <i class="bi bi-tag"></i>
                  Términos de Pago
                </label>
                <select id="terminosPago" v-model="form.terminos_pago" class="form-control">
                  <option value="">Selecciona un término</option>
                  <option value="Contado">Contado</option>
                  <option value="15 días">15 días</option>
                  <option value="30 días">30 días</option>
                  <option value="45 días">45 días</option>
                  <option value="60 días">60 días</option>
                  <option value="90 días">90 días</option>
                </select>
                <small class="help-text">Condiciones de pago acordadas</small>
              </div>
            </div>
            <div class="col-md-4">
              <div class="field-group">
                <label for="diasCredito">
                  <i class="bi bi-calendar-check"></i>
                  Días de Crédito
                </label>
                <input 
                  id="diasCredito"
                  type="number" 
                  v-model="form.dias_credito" 
                  placeholder="30"
                  class="form-control"
                  min="0"
                  max="365"
                >
                <small class="help-text">Días de crédito otorgados</small>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12">
              <div class="field-group">
                <label>
                  <i class="bi bi-star"></i>
                  Calificación
                </label>
                <div class="rating-input">
                  <span 
                    v-for="n in 5" 
                    :key="n" 
                    class="star-rating"
                    :class="{ active: n <= form.calificacion }"
                    @click="form.calificacion = n"
                    @mouseenter="hoverRating = n"
                    @mouseleave="hoverRating = 0"
                  >
                    ⭐
                  </span>
                  <span class="rating-label">{{ form.calificacion || 0 }} / 5</span>
                </div>
                <small class="help-text">Calificación del proveedor (1-5 estrellas)</small>
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
                <label for="telefono">
                  <i class="bi bi-telephone"></i>
                  Teléfono <span class="required">*</span>
                </label>
                <input 
                  id="telefono"
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
                <label for="telefonoAlternativo">
                  <i class="bi bi-telephone"></i>
                  Teléfono Alternativo
                </label>
                <input 
                  id="telefonoAlternativo"
                  type="text" 
                  v-model="form.telefono_alternativo" 
                  placeholder="+58 412-7654321"
                  class="form-control"
                >
                <small class="help-text">Opcional</small>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="field-group">
                <label for="email">
                  <i class="bi bi-envelope"></i>
                  Email <span class="required">*</span>
                </label>
                <input 
                  id="email"
                  type="email" 
                  v-model="form.email" 
                  placeholder="proveedor@empresa.com"
                  class="form-control"
                  :class="{ 'error': errors.email }"
                  @blur="validateField('email')"
                >
                <span class="error-msg" v-if="errors.email">
                  <i class="bi bi-exclamation-circle"></i> {{ errors.email }}
                </span>
              </div>
            </div>
            <div class="col-md-6">
              <div class="field-group">
                <label for="emailAlternativo">
                  <i class="bi bi-envelope"></i>
                  Email Alternativo
                </label>
                <input 
                  id="emailAlternativo"
                  type="email" 
                  v-model="form.email_alternativo" 
                  placeholder="contacto@empresa.com"
                  class="form-control"
                >
                <small class="help-text">Opcional</small>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12">
              <div class="field-group">
                <label for="sitioWeb">
                  <i class="bi bi-globe2"></i>
                  Sitio Web
                </label>
                <input 
                  id="sitioWeb"
                  type="url" 
                  v-model="form.sitio_web" 
                  placeholder="https://www.proveedor.com"
                  class="form-control"
                >
                <small class="help-text">Opcional</small>
              </div>
            </div>
          </div>
        </div>

        <!-- SECCIÓN: PERSONA DE CONTACTO -->
        <div class="form-section">
          <h3 class="section-title">
            <i class="bi bi-person"></i>
            Persona de Contacto
          </h3>
          <div class="row">
            <div class="col-md-4">
              <div class="field-group">
                <label for="contactoNombre">
                  <i class="bi bi-person"></i>
                  Nombre
                </label>
                <input 
                  id="contactoNombre"
                  type="text" 
                  v-model="form.contacto_nombre" 
                  placeholder="Nombre del contacto"
                  class="form-control"
                >
                <small class="help-text">Opcional</small>
              </div>
            </div>
            <div class="col-md-4">
              <div class="field-group">
                <label for="contactoTelefono">
                  <i class="bi bi-telephone"></i>
                  Teléfono
                </label>
                <input 
                  id="contactoTelefono"
                  type="text" 
                  v-model="form.contacto_telefono" 
                  placeholder="+58 412-1234567"
                  class="form-control"
                >
                <small class="help-text">Opcional</small>
              </div>
            </div>
            <div class="col-md-4">
              <div class="field-group">
                <label for="contactoEmail">
                  <i class="bi bi-envelope"></i>
                  Email
                </label>
                <input 
                  id="contactoEmail"
                  type="email" 
                  v-model="form.contacto_email" 
                  placeholder="contacto@empresa.com"
                  class="form-control"
                >
                <small class="help-text">Opcional</small>
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
                <label for="direccion">
                  <i class="bi bi-map"></i>
                  Dirección
                </label>
                <input 
                  id="direccion"
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
                <label for="ciudad">
                  <i class="bi bi-city"></i>
                  Ciudad <span class="required">*</span>
                </label>
                <select 
                  id="ciudad"
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
                <label for="estado">
                  <i class="bi bi-geo-alt"></i>
                  Estado <span class="required">*</span>
                </label>
                <select 
                  id="estado"
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

        <!-- SECCIÓN: INFORMACIÓN BANCARIA -->
        <div class="form-section">
          <h3 class="section-title">
            <i class="bi bi-bank"></i>
            Información Bancaria
          </h3>
          <div class="field-group">
            <label for="cuentaBancaria">
              <i class="bi bi-credit-card"></i>
              Cuenta Bancaria
            </label>
            <input 
              id="cuentaBancaria"
              type="text" 
              v-model="form.cuenta_bancaria" 
              placeholder="Número de cuenta bancaria"
              class="form-control"
            >
            <small class="help-text">Número de cuenta para transferencias (opcional)</small>
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
                {{ form.activo ? 'Proveedor Activo' : 'Proveedor Inactivo' }}
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
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ProveedoresAPI } from '@/services/api'
import Swal from 'sweetalert2'

// ===== ROUTER =====
const route = useRoute()
const router = useRouter()

// ===== STATE =====
const loading = ref(false)
const isEditing = ref(false)
const hoverRating = ref(0)
const rifValido = ref(false)
const digitoVerificador = ref('?')

// ===== LISTA DE ESTADOS DE VENEZUELA =====
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

// ===== FORM =====
const defaultForm = {
  nombre: '',
  ruc: '',
  tipo_rif: '',      // V, E, J, G, P
  rif_numero: '',    // 8 dígitos
  razon_social: '',
  tipo_persona: '',
  direccion: '',
  ciudad: '',
  estado: '',
  telefono: '',
  telefono_alternativo: '',
  email: '',
  email_alternativo: '',
  sitio_web: '',
  contacto_nombre: '',
  contacto_telefono: '',
  contacto_email: '',
  cuenta_bancaria: '',
  terminos_pago: '',
  dias_credito: null,
  calificacion: 0,
  activo: true
}

const form = reactive({ ...defaultForm })

// ===== RIF FORMATEADO =====
const rifFormateado = computed(() => {
  if (!form.tipo_rif || !form.rif_numero || form.rif_numero.length !== 8) {
    return ''
  }
  const digito = digitoVerificador.value !== '?' ? digitoVerificador.value : 'X'
  return `${form.tipo_rif}-${form.rif_numero}-${digito}`
})

// ===== ALGORITMO DEL RIF (Módulo 11) =====
function calcularDigitoVerificador(numeros) {
  if (!numeros || numeros.length !== 8) return '?'
  
  const base = [4, 3, 2, 7, 6, 5, 4, 3, 2]
  let suma = 0
  
  for (let i = 0; i < 8; i++) {
    const digito = parseInt(numeros[i] || 0)
    suma += digito * base[i]
  }
  
  const residuo = suma % 11
  const digitoVerificadorCalc = 11 - residuo
  
  if (digitoVerificadorCalc === 11) return 0
  if (digitoVerificadorCalc === 10) return 9
  return digitoVerificadorCalc
}

function validarRIF() {
  const tipo = form.tipo_rif
  const numero = form.rif_numero
  
  if (!tipo) {
    rifValido.value = false
    errors.ruc = 'Selecciona un tipo de RIF'
    return false
  }
  
  if (!numero || numero.length !== 8) {
    rifValido.value = false
    errors.ruc = 'Ingresa los 8 dígitos del RIF'
    return false
  }
  
  if (!/^\d{8}$/.test(numero)) {
    rifValido.value = false
    errors.ruc = 'Solo se permiten números (8 dígitos)'
    return false
  }
  
  const digito = calcularDigitoVerificador(numero)
  digitoVerificador.value = digito
  
  rifValido.value = true
  errors.ruc = ''
  return true
}

// ===== EVENTOS DEL RIF =====
function onTipoRifChange() {
  if (form.rif_numero && form.rif_numero.length === 8) {
    validarRIF()
  }
  // Actualizar el RUC completo
  actualizarRUC()
}

function onRifNumeroInput(event) {
  // Solo permitir números
  let value = event.target.value.replace(/\D/g, '')
  if (value.length > 8) value = value.substring(0, 8)
  form.rif_numero = value
  event.target.value = value
  
  if (value.length === 8 && form.tipo_rif) {
    validarRIF()
  } else {
    rifValido.value = false
    digitoVerificador.value = '?'
    if (value.length > 0) {
      errors.ruc = `Faltan ${8 - value.length} dígito(s)`
    } else {
      errors.ruc = ''
    }
  }
  
  actualizarRUC()
}

function actualizarRUC() {
  if (form.tipo_rif && form.rif_numero && form.rif_numero.length === 8) {
    const digito = digitoVerificador.value !== '?' ? digitoVerificador.value : '0'
    form.ruc = `${form.tipo_rif}${form.rif_numero}${digito}`
  } else if (form.tipo_rif && form.rif_numero) {
    form.ruc = `${form.tipo_rif}${form.rif_numero}`
  } else if (form.tipo_rif) {
    form.ruc = form.tipo_rif
  } else {
    form.ruc = ''
  }
}

// ===== ERRORS =====
const errors = reactive({
  nombre: '',
  ruc: '',
  tipo_persona: '',
  telefono: '',
  email: '',
  ciudad: '',
  estado: ''
})

// ===== VALIDACIONES =====
const validations = {
  nombre: (val) => {
    if (!val?.trim()) return 'El nombre es obligatorio'
    if (val.trim().length < 2) return 'Mínimo 2 caracteres'
    return ''
  },
  ruc: (val) => {
    if (!val?.trim()) return 'El RIF es obligatorio'
    // Validar formato completo
    if (!/^[JVE]\d{9}$/.test(val.trim())) {
      return 'RIF inválido (ej: J123456789)'
    }
    return ''
  },
  tipo_persona: (val) => {
    if (!val) return 'El tipo de persona es obligatorio'
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
      return 'Email inválido (ej: proveedor@empresa.com)'
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
  }
}

function validateField(field) {
  if (field === 'ruc') {
    // Primero validamos el RIF con nuestro validador
    if (!validarRIF()) {
      // Si el validador ya puso un error, no sobrescribir
      if (!errors.ruc) {
        errors.ruc = validations.ruc(form.ruc)
      }
    }
    return
  }
  const validator = validations[field]
  if (validator) errors[field] = validator(form[field])
}

function validateAll() {
  let isValid = true
  
  // Validar RIF primero
  if (!validarRIF()) {
    isValid = false
  }
  
  // Validar el resto
  for (const field of Object.keys(validations)) {
    if (field === 'ruc') continue
    validateField(field)
    if (errors[field]) isValid = false
  }
  
  return isValid
}

// ===== EVENTO: Cambio de Estado =====
function onEstadoChange() {
  form.ciudad = ''
  validateField('estado')
  if (errors.ciudad) errors.ciudad = ''
}

// ===== LOAD DATA =====
async function loadItem(id) {
  try {
    const res = await ProveedoresAPI.getById(id)
    const data = res.data
    Object.assign(form, data)
    isEditing.value = true
    
    // Si tiene RUC, extraer tipo y número
    if (form.ruc) {
      const rucLimpio = form.ruc.replace(/[-\s]/g, '').toUpperCase()
      if (rucLimpio.length >= 9) {
        form.tipo_rif = rucLimpio[0]
        form.rif_numero = rucLimpio.substring(1, 9)
        // Calcular dígito verificador
        const digito = calcularDigitoVerificador(form.rif_numero)
        digitoVerificador.value = digito
        rifValido.value = true
      }
    }
  } catch (error) {
    Swal.fire('Error', 'No se pudo cargar el proveedor', 'error')
    router.push('/proveedores')
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
      nombre: form.nombre.trim(),
      ruc: form.ruc.trim().toUpperCase(),
      razon_social: form.razon_social?.trim() || null,
      tipo_persona: form.tipo_persona,
      direccion: form.direccion?.trim() || null,
      ciudad: form.ciudad || null,
      estado: form.estado || null,
      telefono: form.telefono.trim(),
      telefono_alternativo: form.telefono_alternativo?.trim() || null,
      email: form.email.trim().toLowerCase(),
      email_alternativo: form.email_alternativo?.trim().toLowerCase() || null,
      sitio_web: form.sitio_web?.trim() || null,
      contacto_nombre: form.contacto_nombre?.trim() || null,
      contacto_telefono: form.contacto_telefono?.trim() || null,
      contacto_email: form.contacto_email?.trim().toLowerCase() || null,
      cuenta_bancaria: form.cuenta_bancaria?.trim() || null,
      terminos_pago: form.terminos_pago || null,
      dias_credito: form.dias_credito ? parseInt(form.dias_credito) : null,
      calificacion: form.calificacion || 0,
      activo: form.activo,
      usuario_creacion: 1
    }

    if (isEditing.value) {
      await ProveedoresAPI.update(route.params.id, payload)
      Swal.fire({
        title: '¡Éxito!',
        text: 'Proveedor actualizado correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      })
    } else {
      await ProveedoresAPI.create(payload)
      Swal.fire({
        title: '¡Éxito!',
        text: 'Proveedor creado correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      })
    }
    
    router.push('/proveedores')
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
  router.push('/proveedores')
}

// ===== WATCH =====
watch(() => form.tipo_rif, () => {
  if (form.rif_numero && form.rif_numero.length === 8) {
    validarRIF()
  }
  actualizarRUC()
})

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

.form-control.valid {
  border-color: #22c55e;
  background: #f0fdf4;
}

.form-control.valid:focus {
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.08);
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

.success-msg {
  color: #22c55e;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}

.success-msg i {
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
   RIF INPUT GROUP
   ============================================ */
.rif-select-group {
  display: flex;
  gap: 8px;
}

.rif-select-group .rif-tipo-select {
  flex: 1;
}

.rif-input-group {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #ffffff;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  padding: 0 4px;
  transition: all 0.2s ease;
}

.rif-input-group:focus-within {
  border-color: #2F6FED;
  box-shadow: 0 0 0 3px rgba(47, 111, 237, 0.08);
}

.rif-input-group .rif-prefix {
  font-weight: 700;
  font-size: 16px;
  color: #2F6FED;
  padding: 8px 4px 8px 8px;
  min-width: 20px;
  text-align: center;
}

.rif-input-group .rif-separator {
  color: #9ca3af;
  font-weight: 300;
  font-size: 18px;
}

.rif-input-group .rif-digito {
  font-weight: 700;
  font-size: 16px;
  color: #22c55e;
  padding: 8px 8px 8px 4px;
  min-width: 20px;
  text-align: center;
}

.rif-input-group .rif-numero-input {
  border: none;
  padding: 8px 4px;
  font-size: 16px;
  font-family: 'Courier New', monospace;
  background: transparent;
  width: 100%;
  min-width: 120px;
  letter-spacing: 2px;
}

.rif-input-group .rif-numero-input:focus {
  outline: none;
  box-shadow: none;
}

.rif-input-group .rif-numero-input.error {
  background: transparent;
}

.rif-input-group.error {
  border-color: #ef4444;
  background: #fef2f2;
}

.rif-input-group.error:focus-within {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.08);
}

.rif-input-group .rif-numero-input::placeholder {
  letter-spacing: 0;
  font-family: inherit;
  font-size: 14px;
  color: #9ca3af;
}

/* ============================================
   RATING INPUT
   ============================================ */
.rating-input {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 0;
}

.star-rating {
  font-size: 28px;
  cursor: pointer;
  opacity: 0.3;
  transition: all 0.2s ease;
  line-height: 1;
}

.star-rating:hover,
.star-rating.active {
  opacity: 1;
  transform: scale(1.1);
}

.rating-label {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-left: 8px;
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

  .star-rating {
    font-size: 24px;
  }

  .rif-input-group {
    flex-wrap: wrap;
  }

  .rif-input-group .rif-numero-input {
    min-width: 80px;
    font-size: 14px;
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

  .star-rating {
    font-size: 20px;
  }

  .rif-input-group .rif-prefix,
  .rif-input-group .rif-digito {
    font-size: 14px;
    padding: 6px 4px;
  }

  .rif-input-group .rif-numero-input {
    font-size: 13px;
    min-width: 60px;
    letter-spacing: 1px;
  }
}
</style>