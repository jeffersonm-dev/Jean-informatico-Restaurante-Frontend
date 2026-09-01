<!-- src/views/restaurante/Configuracion/ConfiguracionEmailView.vue -->
<template>
  <div class="page-container">
    <!-- HEADER -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-title">
          <i class="bi bi-envelope"></i>
          <div>
            <h1>Configuración de Email</h1>
            <p class="text-muted">Gestiona las configuraciones de correo electrónico</p>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn btn-outline-secondary" @click="loadData" title="Actualizar">
          <i class="bi bi-arrow-clockwise" :class="{ spin: loading }"></i>
        </button>
        <button class="btn btn-primary" @click="abrirModalNuevo">
          <i class="bi bi-plus-circle"></i> Nueva Configuración
        </button>
      </div>
    </div>

    <!-- FILTROS -->
    <div class="filters-card">
      <div class="filter-group">
        <div class="filter-item">
          <label><i class="bi bi-search"></i> Buscar</label>
          <input 
            type="text" 
            v-model="filters.search" 
            placeholder="Host, usuario, sede..."
            @input="applyFilters"
            class="form-control"
          >
        </div>
        <div class="filter-item">
          <label><i class="bi bi-building"></i> Sede</label>
          <select v-model="filters.sede_id" @change="applyFilters" class="form-control">
            <option value="">Todas</option>
            <option v-for="sede in sedes" :key="sede.id" :value="sede.id">
              {{ sede.nombre }}
            </option>
          </select>
        </div>
        <div class="filter-item">
          <label><i class="bi bi-toggle-on"></i> Estado</label>
          <select v-model="filters.activo" @change="applyFilters" class="form-control">
            <option value="">Todos</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
        </div>
        <button class="btn btn-outline-secondary" @click="clearFilters">
          <i class="bi bi-eraser"></i> Limpiar
        </button>
      </div>
    </div>

    <!-- ESTADÍSTICAS RÁPIDAS -->
    <div class="stats-row">
      <div class="stat-item">
        <div class="stat-icon bg-primary">
          <i class="bi bi-envelope"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ totalRecords }}</span>
          <span class="stat-label">Total Configuraciones</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon bg-success">
          <i class="bi bi-check-circle"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ configuracionesActivas }}</span>
          <span class="stat-label">Activas</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon bg-danger">
          <i class="bi bi-x-circle"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ configuracionesInactivas }}</span>
          <span class="stat-label">Inactivas</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon bg-warning">
          <i class="bi bi-check2-circle"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ configuracionesValidas }}</span>
          <span class="stat-label">Validadas</span>
        </div>
      </div>
    </div>

    <!-- TABLA -->
    <div class="table-card">
      <div class="table-responsive">
        <table class="table" v-if="!loading">
          <thead>
            <tr>
              <th>#</th>
              <th>Sede</th>
              <th>Host</th>
              <th>Puerto</th>
              <th>Usuario</th>
              <th>SSL/TLS</th>
              <th>Estado</th>
              <th>Validado</th>
              <th class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredItems" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>{{ item.sede_nombre || item.sede_id || 'N/A' }}</td>
              <td><code>{{ item.smtp_host }}</code></td>
              <td>{{ item.smtp_port }}</td>
              <td>{{ item.smtp_user }}</td>
              <td>
                <span class="badge" :class="item.usar_ssl ? 'badge-success' : 'badge-secondary'">
                  {{ item.usar_ssl ? 'SSL' : 'No' }}
                </span>
                <span v-if="item.usar_tls" class="badge badge-info ms-1">TLS</span>
              </td>
              <td>
                <span class="badge" :class="item.activo ? 'badge-success' : 'badge-danger'">
                  <i :class="item.activo ? 'bi-check-circle' : 'bi-x-circle'"></i>
                  {{ item.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>
                <span v-if="item.validado" class="badge badge-success">
                  <i class="bi bi-check-circle"></i> Validado
                </span>
                <span v-else class="badge badge-warning">
                  <i class="bi bi-clock"></i> Pendiente
                </span>
              </td>
              <td class="text-end">
                <div class="btn-group">
                  <button 
                    @click="verDetalle(item)" 
                    class="btn btn-icon btn-primary"
                    title="Ver detalle"
                  >
                    <i class="bi bi-eye"></i>
                  </button>
                  <button 
                    @click="editarConfiguracion(item)" 
                    class="btn btn-icon btn-info"
                    title="Editar"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button 
                    @click="probarConfiguracion(item)" 
                    class="btn btn-icon btn-warning"
                    title="Probar"
                  >
                    <i class="bi bi-send"></i>
                  </button>
                  <button 
                    @click="toggleEstado(item)" 
                    class="btn btn-icon"
                    :class="item.activo ? 'btn-danger' : 'btn-success'"
                    :title="item.activo ? 'Desactivar' : 'Activar'"
                  >
                    <i :class="item.activo ? 'bi-toggle-off' : 'bi-toggle-on'"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!filteredItems.length">
              <td colspan="9" class="text-center py-5">
                <i class="bi bi-inbox fs-1 d-block text-muted"></i>
                <p class="text-muted mt-2">No hay configuraciones de email registradas</p>
                <button class="btn btn-primary mt-2" @click="abrirModalNuevo">
                  <i class="bi bi-plus-circle"></i> Crear primera configuración
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="loading" class="text-center py-5">
          <div class="spinner"></div>
          <p class="text-muted mt-2">Cargando configuraciones...</p>
        </div>
      </div>
    </div>

    <!-- MODAL NUEVA CONFIGURACIÓN -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal modal-lg">
        <div class="modal-header">
          <h3><i class="bi bi-envelope-plus text-primary"></i> {{ isEditing ? 'Editar Configuración' : 'Nueva Configuración' }}</h3>
          <button class="modal-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="guardarConfiguracion">
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
                  <label>Nombre de la Configuración <span class="required">*</span></label>
                  <input 
                    type="text" 
                    v-model="form.nombre" 
                    class="form-control"
                    placeholder="Ej: Email Principal"
                    required
                  >
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="field-group">
                  <label>Host SMTP <span class="required">*</span></label>
                  <input 
                    type="text" 
                    v-model="form.smtp_host" 
                    class="form-control"
                    placeholder="smtp.gmail.com"
                    required
                  >
                </div>
              </div>
              <div class="col-md-6">
                <div class="field-group">
                  <label>Puerto SMTP <span class="required">*</span></label>
                  <input 
                    type="number" 
                    v-model="form.smtp_port" 
                    class="form-control"
                    placeholder="587"
                    required
                  >
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="field-group">
                  <label>Usuario SMTP <span class="required">*</span></label>
                  <input 
                    type="email" 
                    v-model="form.smtp_user" 
                    class="form-control"
                    placeholder="correo@gmail.com"
                    required
                  >
                </div>
              </div>
              <div class="col-md-6">
                <div class="field-group">
                  <label>Contraseña SMTP <span class="required">*</span></label>
                  <input 
                    type="password" 
                    v-model="form.smtp_pass" 
                    class="form-control"
                    placeholder="********"
                    required
                  >
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="field-group">
                  <label>Email desde <span class="required">*</span></label>
                  <input 
                    type="email" 
                    v-model="form.email_from" 
                    class="form-control"
                    placeholder="envios@gmail.com"
                    required
                  >
                </div>
              </div>
              <div class="col-md-6">
                <div class="field-group">
                  <label>Nombre del remitente</label>
                  <input 
                    type="text" 
                    v-model="form.nombre_remitente" 
                    class="form-control"
                    placeholder="Restaurante Gourmet"
                  >
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-4">
                <div class="field-group checkbox-group">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="form.usar_ssl">
                    <span>Usar SSL</span>
                  </label>
                </div>
              </div>
              <div class="col-md-4">
                <div class="field-group checkbox-group">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="form.usar_tls">
                    <span>Usar TLS</span>
                  </label>
                </div>
              </div>
              <div class="col-md-4">
                <div class="field-group checkbox-group">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="form.activo">
                    <span class="toggle-text">
                      <i class="bi" :class="form.activo ? 'bi-toggle-on text-success' : 'bi-toggle-off text-muted'"></i>
                      {{ form.activo ? 'Activa' : 'Inactiva' }}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">Cancelar</button>
          <button class="btn btn-primary" @click="guardarConfiguracion" :disabled="saving">
            <i class="bi" :class="saving ? 'bi-arrow-repeat spin' : 'bi-save'"></i>
            {{ saving ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ConfiguracionEmailAPI, SedesAPI } from '@/services/api'
import Swal from 'sweetalert2'

// ===== STATE =====
const items = ref([])
const sedes = ref([])
const loading = ref(false)
const saving = ref(false)
const totalRecords = ref(0)
const isEditing = ref(false)
const showModal = ref(false)

// ===== FILTERS =====
const filters = reactive({
  search: '',
  sede_id: '',
  activo: ''
})

// ===== FORM =====
const defaultForm = {
  sede_id: '',
  nombre: '',
  smtp_host: '',
  smtp_port: 587,
  smtp_user: '',
  smtp_pass: '',
  email_from: '',
  nombre_remitente: '',
  usar_ssl: true,
  usar_tls: false,
  activo: true,
  validado: false
}

const form = reactive({ ...defaultForm })

// ===== COMPUTED =====
const configuracionesActivas = computed(() => items.value.filter(i => i.activo === true).length)
const configuracionesInactivas = computed(() => items.value.filter(i => i.activo === false).length)
const configuracionesValidas = computed(() => items.value.filter(i => i.validado === true).length)

const filteredItems = computed(() => {
  let result = [...items.value]

  if (filters.search) {
    const search = filters.search.toLowerCase()
    result = result.filter(i =>
      i.nombre?.toLowerCase().includes(search) ||
      i.smtp_host?.toLowerCase().includes(search) ||
      i.smtp_user?.toLowerCase().includes(search)
    )
  }

  if (filters.sede_id) {
    result = result.filter(i => i.sede_id === parseInt(filters.sede_id))
  }

  if (filters.activo !== '') {
    result = result.filter(i => i.activo === (filters.activo === 'true'))
  }

  return result
})

// ===== METHODS =====
async function loadData() {
  loading.value = true
  try {
    const res = await ConfiguracionEmailAPI.list()
    if (res.data && res.data.success && Array.isArray(res.data.data)) {
      items.value = res.data.data
      totalRecords.value = res.data.data.length
    } else if (Array.isArray(res.data)) {
      items.value = res.data
      totalRecords.value = res.data.length
    } else {
      items.value = []
      totalRecords.value = 0
    }
  } catch (error) {
    console.error('Error cargando configuraciones:', error)
    Swal.fire('Error', 'No se pudieron cargar las configuraciones', 'error')
    items.value = []
    totalRecords.value = 0
  } finally {
    loading.value = false
  }
}

async function loadSedes() {
  try {
    const res = await SedesAPI.list()
    sedes.value = res.data.data || []
  } catch (error) {
    console.error('Error cargando sedes:', error)
  }
}

function applyFilters() {}

function clearFilters() {
  filters.search = ''
  filters.sede_id = ''
  filters.activo = ''
}

function abrirModalNuevo() {
  isEditing.value = false
  Object.assign(form, defaultForm)
  showModal.value = true
}

function editarConfiguracion(item) {
  isEditing.value = true
  Object.assign(form, item)
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  isEditing.value = false
  saving.value = false
}

async function guardarConfiguracion() {
  if (!form.sede_id) {
    Swal.fire('Error', 'Selecciona una sede', 'error')
    return
  }
  if (!form.nombre?.trim()) {
    Swal.fire('Error', 'El nombre es obligatorio', 'error')
    return
  }
  if (!form.smtp_host?.trim()) {
    Swal.fire('Error', 'El host SMTP es obligatorio', 'error')
    return
  }
  if (!form.smtp_port) {
    Swal.fire('Error', 'El puerto SMTP es obligatorio', 'error')
    return
  }
  if (!form.smtp_user?.trim()) {
    Swal.fire('Error', 'El usuario SMTP es obligatorio', 'error')
    return
  }
  if (!form.smtp_pass?.trim()) {
    Swal.fire('Error', 'La contraseña SMTP es obligatoria', 'error')
    return
  }
  if (!form.email_from?.trim()) {
    Swal.fire('Error', 'El email desde es obligatorio', 'error')
    return
  }

  saving.value = true
  try {
    const payload = {
      sede_id: parseInt(form.sede_id),
      nombre: form.nombre.trim(),
      smtp_host: form.smtp_host.trim(),
      smtp_port: parseInt(form.smtp_port),
      smtp_user: form.smtp_user.trim(),
      smtp_pass: form.smtp_pass,
      email_from: form.email_from.trim(),
      nombre_remitente: form.nombre_remitente?.trim() || '',
      usar_ssl: form.usar_ssl || false,
      usar_tls: form.usar_tls || false,
      activo: form.activo !== undefined ? form.activo : true,
      validado: false
    }

    if (isEditing.value) {
      await ConfiguracionEmailAPI.update(form.id, payload)
    } else {
      await ConfiguracionEmailAPI.create(payload)
    }

    Swal.fire('Éxito', isEditing.value ? 'Configuración actualizada' : 'Configuración creada correctamente', 'success')
    await loadData()
    closeModal()
  } catch (error) {
    console.error('Error al guardar:', error)
    const errorData = error.response?.data
    let msg = 'Error al guardar la configuración'
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
    saving.value = false
  }
}

async function probarConfiguracion(item) {
  const result = await Swal.fire({
    title: 'Probar Configuración',
    text: `¿Deseas enviar un email de prueba con la configuración "${item.nombre}"?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#d97706',
    confirmButtonText: 'Sí, probar',
    cancelButtonText: 'No'
  })

  if (result.isConfirmed) {
    try {
      await ConfiguracionEmailAPI.test(item.id)
      Swal.fire('Éxito', 'Email de prueba enviado correctamente', 'success')
      await loadData()
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al enviar el email de prueba'
      Swal.fire('Error', msg, 'error')
    }
  }
}

async function toggleEstado(item) {
  const accion = item.activo ? 'desactivar' : 'activar'
  const result = await Swal.fire({
    title: `${accion === 'desactivar' ? 'Desactivar' : 'Activar'} configuración`,
    text: `¿Estás seguro de ${accion} la configuración "${item.nombre}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: item.activo ? '#dc3545' : '#28a745',
    confirmButtonText: `Sí, ${accion}`,
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    try {
      await ConfiguracionEmailAPI.toggleStatus(item.id)
      Swal.fire('Éxito', `Configuración ${accion === 'desactivar' ? 'desactivada' : 'activada'} correctamente`, 'success')
      await loadData()
    } catch (error) {
      const msg = error.response?.data?.message || `No se pudo ${accion} la configuración`
      Swal.fire('Error', msg, 'error')
    }
  }
}

function verDetalle(item) {
  Swal.fire({
    title: `Configuración de Email - ${item.nombre}`,
    html: `
      <div style="text-align: left;">
        <p><strong>Sede:</strong> ${item.sede_nombre || item.sede_id}</p>
        <p><strong>Host SMTP:</strong> ${item.smtp_host}</p>
        <p><strong>Puerto:</strong> ${item.smtp_port}</p>
        <p><strong>Usuario:</strong> ${item.smtp_user}</p>
        <p><strong>Email desde:</strong> ${item.email_from}</p>
        <p><strong>Remitente:</strong> ${item.nombre_remitente || 'N/A'}</p>
        <p><strong>SSL:</strong> ${item.usar_ssl ? '✅ Sí' : '❌ No'}</p>
        <p><strong>TLS:</strong> ${item.usar_tls ? '✅ Sí' : '❌ No'}</p>
        <p><strong>Estado:</strong> ${item.activo ? '✅ Activo' : '❌ Inactivo'}</p>
        <p><strong>Validado:</strong> ${item.validado ? '✅ Sí' : '❌ No'}</p>
      </div>
    `,
    confirmButtonColor: '#2F6FED',
    confirmButtonText: 'Cerrar'
  })
}

// ===== LIFECYCLE =====
onMounted(() => {
  loadSedes()
  loadData()
})
</script>

<style scoped>
.page-container { padding: 24px; max-width: 1400px; margin: 0 auto; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; background: #ffffff; padding: 20px 24px; border-radius: 12px; border: 1px solid #e5e7eb; }
.header-left { display: flex; align-items: center; }
.header-title { display: flex; align-items: center; gap: 14px; }
.header-title i { font-size: 32px; color: #2F6FED; background: #e8eeff; padding: 12px; border-radius: 12px; }
.header-title h1 { font-size: 22px; font-weight: 700; color: #111827; margin: 0; }
.header-title .text-muted { color: #6b7280; font-size: 14px; margin: 2px 0 0; }
.header-actions { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.filters-card { background: #ffffff; padding: 16px 20px; border-radius: 12px; border: 1px solid #e5e7eb; margin-bottom: 20px; }
.filter-group { display: flex; gap: 12px; flex-wrap: wrap; align-items: flex-end; }
.filter-item { flex: 1; min-width: 150px; max-width: 250px; }
.filter-item label { font-size: 12px; font-weight: 600; color: #6b7280; display: block; margin-bottom: 4px; }
.filter-item label i { font-size: 12px; margin-right: 4px; }
.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; }
.stat-item { background: #ffffff; border-radius: 12px; padding: 16px 20px; border: 1px solid #e5e7eb; display: flex; align-items: center; gap: 16px; transition: all 0.2s ease; }
.stat-item:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.05); transform: translateY(-2px); }
.stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-icon i { font-size: 22px; color: #ffffff; }
.stat-icon.bg-primary { background: #2F6FED; }
.stat-icon.bg-success { background: #22c55e; }
.stat-icon.bg-danger { background: #dc2626; }
.stat-icon.bg-warning { background: #d97706; }
.stat-info { display: flex; flex-direction: column; }
.stat-value { font-size: 24px; font-weight: 700; color: #111827; line-height: 1.2; }
.stat-label { font-size: 13px; color: #6b7280; }
.table-card { background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; }
.table-responsive { overflow-x: auto; }
.table { margin: 0; width: 100%; border-collapse: collapse; }
.table thead { background: #f8fafc; }
.table thead th { padding: 12px 16px; font-size: 11px; font-weight: 600; text-transform: uppercase; color: #6b7280; border-bottom: 1px solid #e5e7eb; letter-spacing: 0.3px; white-space: nowrap; }
.table tbody td { padding: 12px 16px; vertical-align: middle; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #374151; }
.table tbody tr:hover { background: #f9fafb; }
.table tbody tr:last-child td { border-bottom: none; }
.badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.3px; }
.badge-success { background: #dcfce7; color: #16a34a; }
.badge-danger { background: #fecaca; color: #dc2626; }
.badge-warning { background: #fef3c7; color: #d97706; }
.badge-info { background: #dbeafe; color: #2563eb; }
.badge-secondary { background: #f3f4f6; color: #6b7280; }
code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
.ms-1 { margin-left: 4px; }
.text-muted { color: #6b7280; }
.text-end { text-align: right; }
.text-center { text-align: center; }
.d-block { display: block; }
.fs-1 { font-size: 36px; }
.mt-2 { margin-top: 8px; }
.py-5 { padding: 48px 0; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 8px 18px; border: none; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s ease; text-decoration: none; font-family: inherit; white-space: nowrap; }
.btn-primary { background: #2F6FED; color: #ffffff; }
.btn-primary:hover:not(:disabled) { background: #1a5adf; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(47,111,237,0.3); }
.btn-outline-secondary { background: transparent; color: #6b7280; border: 1.5px solid #d1d5db; }
.btn-outline-secondary:hover { background: #f9fafb; border-color: #9ca3af; }
.btn-secondary { background: #e5e7eb; color: #374151; }
.btn-secondary:hover { background: #d1d5db; }
.btn-warning { background: #d97706; color: #ffffff; }
.btn-warning:hover { background: #b45309; }
.btn-danger { background: #dc2626; color: #ffffff; }
.btn-danger:hover { background: #b91c1c; }
.btn-success { background: #22c55e; color: #ffffff; }
.btn-success:hover { background: #16a34a; }
.btn-icon { width: 32px; height: 32px; padding: 0; border-radius: 6px; border: 1px solid #e5e7eb; background: transparent; color: #6b7280; transition: all 0.2s ease; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
.btn-icon:hover:not(:disabled) { background: #f3f4f6; border-color: #d1d5db; }
.btn-icon.btn-primary { color: #2F6FED; border-color: #dbeafe; }
.btn-icon.btn-primary:hover { background: #dbeafe; border-color: #2F6FED; }
.btn-icon.btn-info { color: #0891b2; border-color: #cffafe; }
.btn-icon.btn-info:hover { background: #cffafe; border-color: #0891b2; }
.btn-icon.btn-warning { color: #d97706; border-color: #fef3c7; }
.btn-icon.btn-warning:hover { background: #fef3c7; border-color: #d97706; }
.btn-icon.btn-danger { color: #dc2626; border-color: #fecaca; }
.btn-icon.btn-danger:hover { background: #fecaca; border-color: #dc2626; }
.btn-icon.btn-success { color: #16a34a; border-color: #dcfce7; }
.btn-icon.btn-success:hover { background: #dcfce7; border-color: #16a34a; }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-group { display: inline-flex; gap: 4px; align-items: center; }
.spin { animation: spin 1s linear infinite; }
.spinner { width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top: 4px solid #2F6FED; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.2s ease; backdrop-filter: blur(4px); }
.modal { background: #ffffff; border-radius: 16px; max-width: 700px; width: 92%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3); animation: slideIn 0.3s ease; }
.modal-lg { max-width: 800px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; border-bottom: 1px solid #e5e7eb; }
.modal-header h3 { margin: 0; font-size: 18px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 8px; }
.modal-body { padding: 24px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid #e5e7eb; }
.modal-close { background: none; border: none; font-size: 28px; cursor: pointer; color: #6b7280; padding: 0 8px; line-height: 1; transition: color 0.2s; }
.modal-close:hover { color: #111827; }
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
.checkbox-group { margin-top: 4px; }
.checkbox-label { display: flex; align-items: center; gap: 10px; cursor: pointer; font-weight: 400; font-size: 14px; color: #374151; }
.checkbox-label input[type="checkbox"] { width: 18px; height: 18px; margin: 0; cursor: pointer; accent-color: #2F6FED; flex-shrink: 0; }
.toggle-text { display: flex; align-items: center; gap: 6px; }
.text-success { color: #22c55e; }
.text-muted { color: #6b7280; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideIn { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
@media (max-width: 768px) { .page-container { padding: 12px; } .page-header { flex-direction: column; align-items: stretch; padding: 16px; } .header-title h1 { font-size: 18px; } .header-actions { justify-content: stretch; } .header-actions .btn { flex: 1; justify-content: center; } .filter-group { flex-direction: column; } .filter-item { min-width: 100%; max-width: 100%; } .stats-row { grid-template-columns: 1fr 1fr; gap: 8px; } .stat-item { padding: 12px 16px; } .stat-value { font-size: 20px; } .modal { width: 95%; } .modal-lg { max-width: 95%; } .btn-group { flex-wrap: wrap; justify-content: flex-end; } .btn-icon { width: 28px; height: 28px; font-size: 13px; } }
@media (max-width: 480px) { .stats-row { grid-template-columns: 1fr; } .header-title i { font-size: 24px; padding: 8px; } .header-title h1 { font-size: 16px; } .badge { font-size: 10px; padding: 2px 8px; } .btn { font-size: 13px; padding: 7px 14px; } }
</style>