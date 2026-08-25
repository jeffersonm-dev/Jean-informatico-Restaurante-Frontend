<!-- src/views/restaurante/Sede/SedeView.vue -->
<template>
  <div class="sede-container">
    <!-- Header -->
    <div class="sede-header">
      <div class="header-content">
        <div class="header-title">
          <div class="title-icon">
            <i class="bi bi-buildings"></i>
          </div>
          <div>
            <h1>Sedes</h1>
            <p class="subtitle">Gestiona las sedes de tu restaurante</p>
          </div>
        </div>
        <div class="header-stats">
          <div class="stat-card">
            <span class="stat-number">{{ sedes.length }}</span>
            <span class="stat-label">Total Sedes</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">{{ sedesActivas }}</span>
            <span class="stat-label">Activas</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">{{ sedesInactivas }}</span>
            <span class="stat-label">Inactivas</span>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn-primary" @click="abrirModalNuevo">
          <i class="bi bi-plus-circle"></i>
          Nueva Sede
        </button>
      </div>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="filtros-section">
      <div class="search-box">
        <i class="bi bi-search"></i>
        <input 
          type="text" 
          v-model="filtros.buscar" 
          placeholder="Buscar sede por nombre, código o ciudad..."
          @input="filtrarSedes"
        />
      </div>
      <div class="filter-group">
        <select class="filter-select" v-model="filtros.estado" @change="filtrarSedes">
          <option value="">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
        <button class="btn-clear" @click="limpiarFiltros">
          <i class="bi bi-eraser"></i>
          Limpiar
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="cargando" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando sedes...</p>
    </div>

    <!-- Grid de Sedes -->
    <div v-else class="sedes-grid">
      <div v-if="sedesFiltradas.length === 0" class="empty-state">
        <i class="bi bi-building"></i>
        <h3>No hay sedes registradas</h3>
        <p>Comienza creando tu primera sede</p>
        <button class="btn-primary" @click="abrirModalNuevo">
          <i class="bi bi-plus-circle"></i>
          Crear primera sede
        </button>
      </div>

      <div 
        v-for="sede in sedesFiltradas" 
        :key="sede.id" 
        class="sede-card"
        :class="{ inactive: !sede.activo }"
      >
        <div class="card-header">
          <div class="card-status">
            <span class="status-dot" :class="sede.activo ? 'active' : 'inactive'"></span>
            <span class="status-label">{{ sede.activo ? 'Activo' : 'Inactivo' }}</span>
          </div>
          <div class="card-actions">
            <button class="icon-btn edit" @click="abrirModalEditar(sede)" title="Editar">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="icon-btn view" @click="verSede(sede.id)" title="Ver detalle">
              <i class="bi bi-eye"></i>
            </button>
            <button 
              class="icon-btn toggle" 
              :class="sede.activo ? 'danger' : 'success'"
              @click="toggleEstado(sede)" 
              :title="sede.activo ? 'Desactivar' : 'Activar'"
            >
              <i :class="sede.activo ? 'bi bi-toggle-off' : 'bi bi-toggle-on'"></i>
            </button>
          </div>
        </div>

        <div class="card-body">
          <div class="card-icon">
            <i class="bi bi-building"></i>
          </div>
          <h3 class="card-title">{{ sede.nombre }}</h3>
          <p class="card-code">{{ sede.codigo || 'Sin código' }}</p>
          
          <div class="card-details">
            <div class="detail-item" v-if="sede.ciudad || sede.estado">
              <i class="bi bi-geo-alt"></i>
              <span>{{ sede.ciudad || '' }} {{ sede.estado ? ', ' + sede.estado : '' }}</span>
            </div>
            <div class="detail-item" v-if="sede.telefono">
              <i class="bi bi-telephone"></i>
              <span>{{ sede.telefono }}</span>
            </div>
            <div class="detail-item" v-if="sede.email">
              <i class="bi bi-envelope"></i>
              <span>{{ sede.email }}</span>
            </div>
            <div class="detail-item" v-if="sede.horario_apertura">
              <i class="bi bi-clock"></i>
              <span>{{ sede.horario_apertura }} - {{ sede.horario_cierre }}</span>
            </div>
            <div class="detail-item" v-if="sede.dias_atencion">
              <i class="bi bi-calendar-week"></i>
              <span>{{ sede.dias_atencion }}</span>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <span class="card-id">ID: #{{ sede.id }}</span>
          <span class="card-date">{{ formatearFechaCorta(sede.fecha_creacion) }}</span>
        </div>
      </div>
    </div>

    <!-- ============================================
         MODAL NUEVO / EDITAR
    ============================================ -->
    <div class="modal-overlay" v-if="mostrarModal" @click.self="cerrarModal">
      <div class="modal-box">
        <div class="modal-header">
          <h5 class="modal-title">
            <i :class="isEditando ? 'bi bi-pencil-square' : 'bi bi-plus-circle'"></i>
            {{ isEditando ? 'Editar Sede' : 'Nueva Sede' }}
          </h5>
          <button type="button" class="btn-close" @click="cerrarModal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <form @submit.prevent="guardarSede" novalidate>
          <div class="modal-body">
            <!-- Nombre y Código -->
            <div class="form-row">
              <div class="form-group">
                <label>Nombre *</label>
                <input 
                  type="text" 
                  v-model="form.nombre" 
                  required 
                  placeholder="Ej: Sede Principal"
                  :class="{ 'is-invalid': errors.nombre }"
                />
                <span v-if="errors.nombre" class="error-text">{{ errors.nombre }}</span>
              </div>
              <div class="form-group">
                <label>Código</label>
                <input type="text" v-model="form.codigo" placeholder="Ej: SEDE001" />
              </div>
            </div>

            <!-- Dirección -->
            <div class="form-group">
              <label>Dirección</label>
              <input type="text" v-model="form.direccion" placeholder="Ej: Av. Principal #123" />
            </div>

            <!-- Estado y Ciudad -->
            <div class="form-row">
              <div class="form-group">
                <label>Estado *</label>
                <select v-model="form.estado" required @change="onEstadoChange">
                  <option value="">Selecciona un estado</option>
                  <option v-for="estado in estados" :key="estado" :value="estado">
                    {{ estado }}
                  </option>
                </select>
                <span v-if="errors.estado" class="error-text">{{ errors.estado }}</span>
              </div>
              <div class="form-group">
                <label>Ciudad *</label>
                <select v-model="form.ciudad" required :disabled="!form.estado">
                  <option value="">Selecciona una ciudad</option>
                  <option v-for="ciudad in ciudadesFiltradas" :key="ciudad" :value="ciudad">
                    {{ ciudad }}
                  </option>
                </select>
                <span v-if="errors.ciudad" class="error-text">{{ errors.ciudad }}</span>
              </div>
            </div>

            <!-- País -->
            <div class="form-group">
              <label>País</label>
              <input type="text" v-model="form.pais" placeholder="Venezuela" disabled />
            </div>

            <!-- Teléfono y Email -->
            <div class="form-row">
              <div class="form-group">
                <label>Teléfono</label>
                <input 
                  type="tel" 
                  v-model="form.telefono" 
                  placeholder="+58-212-555-0000"
                  @input="validarTelefono"
                />
                <span v-if="errors.telefono" class="error-text">{{ errors.telefono }}</span>
              </div>
              <div class="form-group">
                <label>Email *</label>
                <input 
                  type="email" 
                  v-model="form.email" 
                  required
                  placeholder="info@restaurante.com"
                  @input="validarEmail"
                />
                <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
              </div>
            </div>

            <!-- Horarios -->
            <div class="form-row">
              <div class="form-group">
                <label>Hora apertura</label>
                <input type="time" v-model="form.horario_apertura" step="1" />
              </div>
              <div class="form-group">
                <label>Hora cierre</label>
                <input type="time" v-model="form.horario_cierre" step="1" />
              </div>
            </div>

            <!-- Días de atención -->
            <div class="form-group">
              <label>Días de atención *</label>
              <select v-model="form.dias_atencion" required>
                <option value="">Selecciona los días de atención</option>
                <option v-for="dia in diasAtencion" :key="dia" :value="dia">
                  {{ dia }}
                </option>
              </select>
              <span v-if="errors.dias_atencion" class="error-text">{{ errors.dias_atencion }}</span>
            </div>

            <!-- Activo -->
            <div class="form-group switch-group">
              <label class="switch">
                <input type="checkbox" v-model="form.activo" />
                <span class="slider"></span>
              </label>
              <span class="switch-label">
                <i :class="form.activo ? 'bi bi-check-circle text-success' : 'bi bi-x-circle text-danger'"></i>
                {{ form.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="cerrarModal">Cancelar</button>
            <button type="submit" class="btn-primary" :disabled="guardando">
              <i v-if="guardando" class="bi bi-spinner bi-spin"></i>
              <i v-else :class="isEditando ? 'bi bi-pencil' : 'bi bi-save'"></i>
              {{ guardando ? 'Guardando...' : (isEditando ? 'Actualizar' : 'Guardar') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ============================================
         MODAL VER DETALLE
    ============================================ -->
    <div class="modal-overlay" v-if="mostrarModalVer" @click.self="cerrarModalVer">
      <div class="modal-box modal-sm">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="bi bi-building"></i>
            Detalle de Sede
          </h5>
          <button type="button" class="btn-close" @click="cerrarModalVer">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body" v-if="sedeSeleccionada">
          <div class="detail-card">
            <div class="detail-header">
              <span class="detail-status" :class="sedeSeleccionada.activo ? 'active' : 'inactive'">
                {{ sedeSeleccionada.activo ? 'Activo' : 'Inactivo' }}
              </span>
              <span class="detail-id">#{{ sedeSeleccionada.id }}</span>
            </div>
            <h3 class="detail-name">{{ sedeSeleccionada.nombre }}</h3>
            <p class="detail-code" v-if="sedeSeleccionada.codigo">
              <i class="bi bi-tag"></i> {{ sedeSeleccionada.codigo }}
            </p>

            <div class="detail-grid">
              <div class="detail-item" v-if="sedeSeleccionada.direccion">
                <i class="bi bi-geo-alt"></i>
                <div>
                  <label>Dirección</label>
                  <span>{{ sedeSeleccionada.direccion }}</span>
                </div>
              </div>
              <div class="detail-item" v-if="sedeSeleccionada.ciudad || sedeSeleccionada.estado">
                <i class="bi bi-map"></i>
                <div>
                  <label>Ubicación</label>
                  <span>
                    {{ sedeSeleccionada.ciudad || 'N/A' }}
                    <span v-if="sedeSeleccionada.estado">, {{ sedeSeleccionada.estado }}</span>
                    <span v-if="sedeSeleccionada.pais">, {{ sedeSeleccionada.pais }}</span>
                  </span>
                </div>
              </div>
              <div class="detail-item" v-if="sedeSeleccionada.telefono">
                <i class="bi bi-telephone"></i>
                <div>
                  <label>Teléfono</label>
                  <span>{{ sedeSeleccionada.telefono }}</span>
                </div>
              </div>
              <div class="detail-item" v-if="sedeSeleccionada.email">
                <i class="bi bi-envelope"></i>
                <div>
                  <label>Email</label>
                  <span>{{ sedeSeleccionada.email }}</span>
                </div>
              </div>
              <div class="detail-item" v-if="sedeSeleccionada.horario_apertura">
                <i class="bi bi-clock"></i>
                <div>
                  <label>Horario</label>
                  <span>{{ sedeSeleccionada.horario_apertura }} - {{ sedeSeleccionada.horario_cierre }}</span>
                </div>
              </div>
              <div class="detail-item" v-if="sedeSeleccionada.dias_atencion">
                <i class="bi bi-calendar-week"></i>
                <div>
                  <label>Días de atención</label>
                  <span>{{ sedeSeleccionada.dias_atencion }}</span>
                </div>
              </div>
              <div class="detail-item">
                <i class="bi bi-calendar3"></i>
                <div>
                  <label>Fecha de creación</label>
                  <span>{{ formatearFecha(sedeSeleccionada.fecha_creacion) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-secondary" @click="cerrarModalVer">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { SedesAPI } from '@/services/api'
import Swal from 'sweetalert2'

// ============================================
// DATA - Estados y Ciudades de Venezuela
// ============================================
const estadosYciudades = {
  'Amazonas': ['Puerto Ayacucho'],
  'Anzoátegui': ['Barcelona', 'Puerto La Cruz', 'El Tigre', 'Anaco'],
  'Apure': ['San Fernando de Apure'],
  'Aragua': ['Maracay', 'Turmero', 'El Limón', 'La Victoria'],
  'Barinas': ['Barinas'],
  'Bolívar': ['Ciudad Guayana', 'Ciudad Bolívar', 'Upata'],
  'Carabobo': ['Valencia', 'Puerto Cabello', 'Guacara', 'Naguanagua'],
  'Cojedes': ['San Carlos'],
  'Delta Amacuro': ['Tucupita'],
  'Distrito Capital': ['Caracas'],
  'Falcón': ['Coro', 'Punto Fijo'],
  'Guárico': ['San Juan de los Morros', 'Calabozo'],
  'Lara': ['Barquisimeto', 'Cabudare'],
  'Mérida': ['Mérida'],
  'Miranda': ['Los Teques', 'Guarenas', 'Guatire', 'Ocumare del Tuy'],
  'Monagas': ['Maturín'],
  'Nueva Esparta': ['Porlamar'],
  'Portuguesa': ['Acarigua', 'Guanare'],
  'Sucre': ['Cumaná', 'Carúpano'],
  'Táchira': ['San Cristóbal'],
  'Trujillo': ['Trujillo', 'Valera'],
  'La Guaira': ['La Guaira', 'Macuto'],
  'Yaracuy': ['San Felipe'],
  'Zulia': ['Maracaibo', 'Cabimas', 'Ciudad Ojeda']
}

const estados = Object.keys(estadosYciudades).sort()

const diasAtencion = [
  'Lunes a Viernes',
  'Lunes a Sábado',
  'Lunes a Domingo',
  'Martes a Domingo',
  'Sábado y Domingo',
  'Todos los días'
]

// ============================================
// STATE
// ============================================
const cargando = ref(false)
const guardando = ref(false)
const sedes = ref([])
const isEditando = ref(false)
const sedeSeleccionada = ref(null)
const mostrarModal = ref(false)
const mostrarModalVer = ref(false)

const errors = ref({
  nombre: '',
  estado: '',
  ciudad: '',
  email: '',
  telefono: '',
  dias_atencion: ''
})

const form = ref({
  nombre: '',
  codigo: '',
  direccion: '',
  ciudad: '',
  estado: '',
  pais: 'Venezuela',
  telefono: '',
  email: '',
  horario_apertura: '08:00',
  horario_cierre: '22:00',
  dias_atencion: 'Lunes a Domingo',
  activo: true
})

const filtros = ref({
  buscar: '',
  estado: '',
  ciudad: ''
})

// ============================================
// COMPUTED
// ============================================
const sedesActivas = computed(() => sedes.value.filter(s => s.activo).length)
const sedesInactivas = computed(() => sedes.value.filter(s => !s.activo).length)

const sedesFiltradas = computed(() => {
  let resultado = [...sedes.value]

  if (filtros.value.buscar) {
    const busq = filtros.value.buscar.toLowerCase()
    resultado = resultado.filter(s =>
      s.nombre?.toLowerCase().includes(busq) ||
      s.codigo?.toLowerCase().includes(busq) ||
      s.ciudad?.toLowerCase().includes(busq) ||
      s.direccion?.toLowerCase().includes(busq)
    )
  }

  if (filtros.value.estado) {
    const activo = filtros.value.estado === 'activo'
    resultado = resultado.filter(s => s.activo === activo)
  }

  return resultado
})

const ciudadesFiltradas = computed(() => {
  if (!form.value.estado) return []
  return estadosYciudades[form.value.estado] || []
})

// ============================================
// VALIDACIONES
// ============================================
const validarEmail = () => {
  const email = form.value.email
  if (!email) {
    errors.value.email = 'El email es requerido'
    return false
  }
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  if (!regex.test(email)) {
    errors.value.email = 'Ingresa un email válido (ej: usuario@dominio.com)'
    return false
  }
  errors.value.email = ''
  return true
}

const validarTelefono = () => {
  const telefono = form.value.telefono
  if (!telefono) {
    errors.value.telefono = ''
    return true
  }
  const regex = /^(\+?\d{1,3}[-.]?)?\d{10,15}$/
  if (!regex.test(telefono.replace(/[\s-]/g, ''))) {
    errors.value.telefono = 'Ingresa un teléfono válido (ej: +58-212-555-0000)'
    return false
  }
  errors.value.telefono = ''
  return true
}

const validarFormulario = () => {
  let isValid = true
  
  if (!form.value.nombre) {
    errors.value.nombre = 'El nombre es requerido'
    isValid = false
  } else {
    errors.value.nombre = ''
  }

  if (!form.value.estado) {
    errors.value.estado = 'Selecciona un estado'
    isValid = false
  } else {
    errors.value.estado = ''
  }

  if (!form.value.ciudad) {
    errors.value.ciudad = 'Selecciona una ciudad'
    isValid = false
  } else {
    errors.value.ciudad = ''
  }

  if (!form.value.dias_atencion) {
    errors.value.dias_atencion = 'Selecciona los días de atención'
    isValid = false
  } else {
    errors.value.dias_atencion = ''
  }

  if (!validarEmail()) isValid = false
  if (!validarTelefono()) isValid = false

  return isValid
}

const onEstadoChange = () => {
  form.value.ciudad = ''
  errors.value.ciudad = ''
}

// ============================================
// MÉTODOS
// ============================================
const cargarSedes = async () => {
  cargando.value = true
  try {
    const response = await SedesAPI.list()
    if (response.data.success) {
      sedes.value = response.data.data || []
    }
  } catch (error) {
    console.error('❌ Error al cargar sedes:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error de conexión',
      text: 'No se pudieron cargar las sedes.'
    })
  } finally {
    cargando.value = false
  }
}

const filtrarSedes = () => {}

const limpiarFiltros = () => {
  filtros.value = {
    buscar: '',
    estado: '',
    ciudad: ''
  }
}

const resetForm = () => {
  form.value = {
    nombre: '',
    codigo: '',
    direccion: '',
    ciudad: '',
    estado: '',
    pais: 'Venezuela',
    telefono: '',
    email: '',
    horario_apertura: '08:00',
    horario_cierre: '22:00',
    dias_atencion: 'Lunes a Domingo',
    activo: true
  }
  errors.value = {
    nombre: '',
    estado: '',
    ciudad: '',
    email: '',
    telefono: '',
    dias_atencion: ''
  }
  isEditando.value = false
}

const abrirModalNuevo = () => {
  resetForm()
  isEditando.value = false
  mostrarModal.value = true
}

const abrirModalEditar = (sede) => {
  const apertura = sede.horario_apertura?.slice(0, 5) || '08:00'
  const cierre = sede.horario_cierre?.slice(0, 5) || '22:00'
  
  form.value = {
    id: sede.id,
    nombre: sede.nombre || '',
    codigo: sede.codigo || '',
    direccion: sede.direccion || '',
    ciudad: sede.ciudad || '',
    estado: sede.estado || '',
    pais: sede.pais || 'Venezuela',
    telefono: sede.telefono || '',
    email: sede.email || '',
    horario_apertura: apertura,
    horario_cierre: cierre,
    dias_atencion: sede.dias_atencion || 'Lunes a Domingo',
    activo: sede.activo !== false
  }
  errors.value = {
    nombre: '',
    estado: '',
    ciudad: '',
    email: '',
    telefono: '',
    dias_atencion: ''
  }
  isEditando.value = true
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
}

const cerrarModalVer = () => {
  mostrarModalVer.value = false
}

const guardarSede = async () => {
  if (!validarFormulario()) {
    Swal.fire({
      icon: 'warning',
      title: 'Corrige los errores',
      text: 'Por favor, completa todos los campos requeridos correctamente.',
      confirmButtonColor: '#E85D3A'
    })
    return
  }

  guardando.value = true
  try {
    const dataToSend = {
      nombre: form.value.nombre,
      codigo: form.value.codigo || null,
      direccion: form.value.direccion || null,
      ciudad: form.value.ciudad,
      estado: form.value.estado,
      pais: form.value.pais || 'Venezuela',
      telefono: form.value.telefono || null,
      email: form.value.email,
      horario_apertura: form.value.horario_apertura ? form.value.horario_apertura + ':00' : null,
      horario_cierre: form.value.horario_cierre ? form.value.horario_cierre + ':00' : null,
      dias_atencion: form.value.dias_atencion,
      activo: form.value.activo
    }

    console.log('📤 Enviando datos:', dataToSend)

    let response
    if (isEditando.value) {
      response = await SedesAPI.update(form.value.id, dataToSend)
    } else {
      response = await SedesAPI.create(dataToSend)
    }

    if (response.data.success) {
      Swal.fire({
        icon: 'success',
        title: isEditando.value ? 'Sede actualizada' : 'Sede creada',
        timer: 1500,
        showConfirmButton: false
      })
      cerrarModal()
      await cargarSedes()
    }
  } catch (error) {
    console.error('❌ Error detallado:', error.response?.data)
    
    const errorsData = error.response?.data?.errors
    let errorMsg = error.response?.data?.message || 'Error al guardar la sede'
    
    if (errorsData) {
      const errorMessages = []
      Object.keys(errorsData).forEach(key => {
        if (Array.isArray(errorsData[key])) {
          errorMessages.push(...errorsData[key])
        } else {
          errorMessages.push(`${key}: ${errorsData[key]}`)
        }
      })
      errorMsg = errorMessages.join('\n')
    }
    
    Swal.fire({
      icon: 'error',
      title: 'Error de validación',
      text: errorMsg,
      confirmButtonColor: '#E85D3A'
    })
  } finally {
    guardando.value = false
  }
}

const verSede = (id) => {
  const sede = sedes.value.find(s => s.id === id)
  if (sede) {
    sedeSeleccionada.value = sede
    mostrarModalVer.value = true
  }
}

const toggleEstado = async (sede) => {
  const estadoTexto = sede.activo ? 'desactivar' : 'activar'
  const result = await Swal.fire({
    title: `¿${estadoTexto === 'desactivar' ? 'Desactivar' : 'Activar'} sede?`,
    text: `¿Estás seguro de ${estadoTexto} la sede "${sede.nombre}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: sede.activo ? '#dc3545' : '#28a745',
    confirmButtonText: `Sí, ${estadoTexto}`,
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    try {
      const response = await SedesAPI.toggleStatus(sede.id)
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Estado actualizado',
          timer: 1500,
          showConfirmButton: false
        })
        await cargarSedes()
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cambiar el estado de la sede'
      })
    }
  }
}

const formatearFecha = (fecha) => {
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

const formatearFechaCorta = (fecha) => {
  if (!fecha) return ''
  try {
    const d = new Date(fecha)
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return fecha
  }
}

// ============================================
// LIFECYCLE
// ============================================
onMounted(() => {
  cargarSedes()
})
</script>

<style scoped>
/* ============================================
   CONTAINER
   ============================================ */
.sede-container {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* ============================================
   HEADER
   ============================================ */
.sede-header {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: 16px;
  padding: 28px 32px;
  margin-bottom: 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  position: relative;
  overflow: hidden;
}

.sede-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(232, 93, 58, 0.1), transparent 70%);
  border-radius: 50%;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 14px;
}

.title-icon {
  width: 48px;
  height: 48px;
  background: rgba(232, 93, 58, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-icon i {
  font-size: 24px;
  color: #E85D3A;
}

.header-title h1 {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.header-title .subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.header-stats {
  display: flex;
  gap: 16px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 10px 18px;
  text-align: center;
  min-width: 80px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.stat-number {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
}

.stat-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.header-actions {
  position: relative;
  z-index: 1;
}

.btn-primary {
  background: #E85D3A;
  border: none;
  color: #fff;
  padding: 10px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #c94f2e;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(232, 93, 58, 0.35);
}

.btn-primary i {
  font-size: 18px;
}

/* ============================================
   FILTROS
   ============================================ */
.filtros-section {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 14px;
  transition: all 0.3s ease;
}

.search-box:focus-within {
  border-color: #E85D3A;
  box-shadow: 0 0 0 3px rgba(232, 93, 58, 0.1);
}

.search-box i {
  color: #9ca3af;
  font-size: 18px;
}

.search-box input {
  border: none;
  padding: 10px 12px;
  font-size: 14px;
  width: 100%;
  outline: none;
  background: transparent;
  color: #1a1a2e;
}

.search-box input::placeholder {
  color: #9ca3af;
}

.filter-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.filter-select {
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  background: #fff;
  color: #1a1a2e;
  cursor: pointer;
  outline: none;
  min-width: 160px;
}

.filter-select:focus {
  border-color: #E85D3A;
  box-shadow: 0 0 0 3px rgba(232, 93, 58, 0.1);
}

.btn-clear {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-clear:hover {
  background: #e5e7eb;
  color: #374151;
}

/* ============================================
   LOADING
   ============================================ */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  background: #fff;
  border-radius: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #E85D3A;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: #6b7280;
  margin-top: 16px;
  font-size: 14px;
}

/* ============================================
   SEDES GRID
   ============================================ */
.sedes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

/* ============================================
   SEDE CARD
   ============================================ */
.sede-card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.sede-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
  border-color: #d1d5db;
}

.sede-card.inactive {
  opacity: 0.7;
}

.sede-card.inactive .card-title {
  color: #9ca3af;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: #f8f6f4;
  border-bottom: 1px solid #e5e7eb;
}

.card-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.status-dot.active {
  background: #10b981;
}

.status-dot.inactive {
  background: #ef4444;
}

.status-label {
  font-size: 12px;
  font-weight: 600;
  color: #4b5563;
}

.card-actions {
  display: flex;
  gap: 4px;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.icon-btn.edit {
  background: transparent;
  color: #6b7280;
}

.icon-btn.edit:hover {
  background: #f3f4f6;
  color: #E85D3A;
}

.icon-btn.view {
  background: transparent;
  color: #6b7280;
}

.icon-btn.view:hover {
  background: #f3f4f6;
  color: #3b82f6;
}

.icon-btn.toggle {
  background: transparent;
  color: #6b7280;
}

.icon-btn.toggle.danger:hover {
  background: #fef2f2;
  color: #ef4444;
}

.icon-btn.toggle.success:hover {
  background: #ecfdf5;
  color: #10b981;
}

.card-body {
  padding: 18px;
  text-align: center;
}

.card-icon {
  width: 48px;
  height: 48px;
  background: rgba(232, 93, 58, 0.08);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}

.card-icon i {
  font-size: 22px;
  color: #E85D3A;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 4px 0;
}

.card-code {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 12px 0;
}

.card-details {
  text-align: left;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  font-size: 13px;
  color: #4b5563;
}

.detail-item i {
  color: #9ca3af;
  font-size: 14px;
  min-width: 18px;
}

.detail-item span {
  word-break: break-word;
}

.card-footer {
  padding: 10px 18px;
  background: #f8f6f4;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #9ca3af;
}

.card-id {
  font-weight: 500;
  color: #6b7280;
}

/* ============================================
   EMPTY STATE
   ============================================ */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 20px;
  background: #fff;
  border-radius: 16px;
  border: 2px dashed #e5e7eb;
}

.empty-state i {
  font-size: 48px;
  color: #d1d5db;
}

.empty-state h3 {
  font-size: 20px;
  color: #1a1a2e;
  margin: 16px 0 8px;
}

.empty-state p {
  color: #6b7280;
  margin: 0 0 20px;
}

/* ============================================
   FORM / MODAL
   ============================================ */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  animation: fadeIn 0.3s ease;
  backdrop-filter: blur(4px);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-box {
  background: #fff;
  border-radius: 20px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-box.modal-sm {
  max-width: 500px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #f3f4f6;
}

.modal-title {
  font-weight: 700;
  color: #1a1a2e;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 18px;
}

.modal-title i {
  color: #E85D3A;
}

.btn-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #6b7280;
  font-size: 20px;
  transition: color 0.2s;
}

.btn-close:hover {
  color: #1a1a2e;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #f3f4f6;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-secondary {
  background: #f3f4f6;
  border: none;
  color: #4b5563;
  padding: 10px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

/* ============================================
   FORM FIELDS
   ============================================ */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-group label {
  font-weight: 600;
  font-size: 13px;
  color: #374151;
}

.form-group input,
.form-group select {
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s ease;
  outline: none;
  background: #fafafa;
  color: #1a1a2e;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #E85D3A;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(232, 93, 58, 0.08);
}

.form-group input:disabled,
.form-group select:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.6;
}

.form-group input.is-invalid,
.form-group select.is-invalid {
  border-color: #ef4444;
}

.error-text {
  color: #ef4444;
  font-size: 12px;
  margin-top: 2px;
}

.switch-group {
  flex-direction: row;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
  flex-shrink: 0;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #d1d5db;
  transition: 0.3s;
  border-radius: 26px;
}

.slider::before {
  content: '';
  position: absolute;
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background: #fff;
  transition: 0.3s;
  border-radius: 50%;
}

.switch input:checked + .slider {
  background: #E85D3A;
}

.switch input:checked + .slider::before {
  transform: translateX(22px);
}

.switch-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 6px;
}

.text-success {
  color: #10b981 !important;
}

.text-danger {
  color: #ef4444 !important;
}

/* ============================================
   DETAIL MODAL
   ============================================ */
.detail-card {
  padding: 4px 0;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.detail-status {
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.detail-status.active {
  background: #ecfdf5;
  color: #10b981;
}

.detail-status.inactive {
  background: #fef2f2;
  color: #ef4444;
}

.detail-id {
  font-size: 13px;
  color: #6b7280;
}

.detail-name {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 4px 0;
}

.detail-code {
  color: #6b7280;
  font-size: 14px;
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.detail-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item i {
  font-size: 18px;
  color: #9ca3af;
  min-width: 24px;
  margin-top: 2px;
}

.detail-item div {
  flex: 1;
}

.detail-item label {
  display: block;
  font-size: 11px;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  margin-bottom: 2px;
}

.detail-item span {
  font-size: 14px;
  color: #1a1a2e;
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 768px) {
  .sede-container {
    padding: 16px;
  }

  .sede-header {
    padding: 20px;
    flex-direction: column;
    align-items: stretch;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-stats {
    width: 100%;
    justify-content: space-around;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .btn-primary {
    width: 100%;
    justify-content: center;
  }

  .filtros-section {
    flex-direction: column;
  }

  .search-box {
    min-width: auto;
  }

  .filter-group {
    flex-wrap: wrap;
  }

  .filter-select {
    flex: 1;
    min-width: 120px;
  }

  .sedes-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-box {
    max-width: 100%;
    margin: 10px;
    border-radius: 16px;
  }

  .modal-body {
    padding: 16px;
  }

  .header-title h1 {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .sede-container {
    padding: 12px;
  }

  .sede-header {
    padding: 16px;
  }

  .stat-card {
    padding: 6px 12px;
    min-width: 60px;
  }

  .stat-number {
    font-size: 16px;
  }

  .stat-label {
    font-size: 9px;
  }

  .card-body {
    padding: 14px;
  }

  .card-title {
    font-size: 16px;
  }

  .detail-item {
    font-size: 12px;
  }

  .detail-item i {
    font-size: 14px;
  }
}
</style>