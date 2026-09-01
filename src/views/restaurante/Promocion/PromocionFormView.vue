<!-- src/views/restaurante/Promocion/PromocionFormView.vue -->
<template>
  <div class="page-container">
    <!-- HEADER -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-title">
          <i class="bi bi-tags"></i>
          <div>
            <h1>{{ isEditing ? 'Editar Promoción' : 'Nueva Promoción' }}</h1>
            <p class="text-muted">
              {{ isEditing ? 'Modifica los datos de la promoción' : 'Registra una nueva promoción' }}
            </p>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <router-link to="/promociones" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left"></i> Volver
        </router-link>
      </div>
    </div>

    <!-- FORMULARIO -->
    <div class="form-card">
      <form @submit.prevent="handleSubmit" novalidate>
        <!-- DATOS GENERALES -->
        <div class="form-section">
          <h3 class="section-title">
            <i class="bi bi-info-circle"></i>
            Datos Generales
          </h3>

          <div class="row">
            <div class="col-md-6">
              <div class="field-group">
                <label>Nombre <span class="required">*</span></label>
                <input 
                  type="text" 
                  v-model="form.nombre" 
                  class="form-control"
                  placeholder="Nombre de la promoción"
                  required
                >
              </div>
            </div>
            <div class="col-md-6">
              <div class="field-group">
                <label>Código <span class="required">*</span></label>
                <input 
                  type="text" 
                  v-model="form.codigo" 
                  class="form-control"
                  placeholder="Código único de la promoción"
                  required
                >
                <small class="help-text">Código único para identificar la promoción</small>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12">
              <div class="field-group">
                <label>Descripción</label>
                <textarea 
                  v-model="form.descripcion" 
                  class="form-control"
                  rows="2"
                  placeholder="Descripción detallada de la promoción..."
                ></textarea>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-4">
              <div class="field-group">
                <label>Tipo <span class="required">*</span></label>
                <select v-model="form.tipo" class="form-control" required @change="onTipoChange">
                  <option value="">Selecciona un tipo</option>
                  <option value="Porcentaje">Porcentaje</option>
                  <option value="Monto Fijo">Monto Fijo</option>
                  <option value="2x1">2x1</option>
                  <option value="Combo">Combo</option>
                </select>
              </div>
            </div>
            <div class="col-md-4" v-if="form.tipo === 'Porcentaje'">
              <div class="field-group">
                <label>Porcentaje de Descuento <span class="required">*</span></label>
                <input 
                  type="number" 
                  v-model="form.porcentaje_descuento" 
                  class="form-control"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="0"
                  required
                >
              </div>
            </div>
            <div class="col-md-4" v-if="form.tipo === 'Monto Fijo'">
              <div class="field-group">
                <label>Monto de Descuento <span class="required">*</span></label>
                <input 
                  type="number" 
                  v-model="form.monto_descuento" 
                  class="form-control"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  required
                >
              </div>
            </div>
          </div>
        </div>

        <!-- CONFIGURACIÓN -->
        <div class="form-section">
          <h3 class="section-title">
            <i class="bi bi-gear"></i>
            Configuración
          </h3>

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
                <label>Prioridad</label>
                <select v-model="form.prioridad" class="form-control">
                  <option :value="1">1 - Baja</option>
                  <option :value="5">5 - Media</option>
                  <option :value="8">8 - Alta</option>
                  <option :value="10">10 - Prioritaria</option>
                </select>
                <small class="help-text">Mayor número = mayor prioridad</small>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-4">
              <div class="field-group">
                <label>Cantidad Mínima</label>
                <input 
                  type="number" 
                  v-model="form.cantidad_minima" 
                  class="form-control"
                  min="0"
                  placeholder="0"
                >
              </div>
            </div>
            <div class="col-md-4">
              <div class="field-group">
                <label>Cantidad Máxima</label>
                <input 
                  type="number" 
                  v-model="form.cantidad_maxima" 
                  class="form-control"
                  min="0"
                  placeholder="0"
                >
              </div>
            </div>
            <div class="col-md-4">
              <div class="field-group">
                <label>Límite de Usos</label>
                <input 
                  type="number" 
                  v-model="form.uso_limite" 
                  class="form-control"
                  min="0"
                  placeholder="0 = Ilimitado"
                >
                <small class="help-text">0 = Ilimitado</small>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="field-group">
                <label>Fecha Inicio <span class="required">*</span></label>
                <input 
                  type="datetime-local" 
                  v-model="form.fecha_inicio" 
                  class="form-control"
                  required
                >
              </div>
            </div>
            <div class="col-md-6">
              <div class="field-group">
                <label>Fecha Fin <span class="required">*</span></label>
                <input 
                  type="datetime-local" 
                  v-model="form.fecha_fin" 
                  class="form-control"
                  required
                >
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="field-group">
                <label>Días de la Semana</label>
                <div class="dias-container">
                  <label v-for="dia in diasSemana" :key="dia.value" class="dia-checkbox">
                    <input 
                      type="checkbox" 
                      :value="dia.value" 
                      v-model="diasSeleccionados"
                    >
                    {{ dia.label }}
                  </label>
                </div>
                <small class="help-text">Selecciona los días en que aplica la promoción</small>
              </div>
            </div>
            <div class="col-md-6">
              <div class="row">
                <div class="col-md-6">
                  <div class="field-group">
                    <label>Horario Inicio</label>
                    <input 
                      type="time" 
                      v-model="form.horario_inicio" 
                      class="form-control"
                    >
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="field-group">
                    <label>Horario Fin</label>
                    <input 
                      type="time" 
                      v-model="form.horario_fin" 
                      class="form-control"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RESTRICCIONES -->
        <div class="form-section">
          <h3 class="section-title">
            <i class="bi bi-shield-lock"></i>
            Restricciones
          </h3>

          <div class="row">
            <div class="col-md-6">
              <div class="field-group">
                <label>Producto Específico</label>
                <select v-model="form.producto_id" class="form-control">
                  <option value="">Todos los productos</option>
                  <option v-for="producto in productos" :key="producto.id" :value="producto.id">
                    {{ producto.nombre }}
                  </option>
                </select>
              </div>
            </div>
            <div class="col-md-6">
              <div class="field-group">
                <label>Categoría Específica</label>
                <select v-model="form.categoria_id" class="form-control">
                  <option value="">Todas las categorías</option>
                  <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
                    {{ categoria.nombre }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="field-group checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="form.cliente_especifico">
                  <span>Cliente Específico</span>
                </label>
              </div>
            </div>
            <div class="col-md-6" v-if="form.cliente_especifico">
              <div class="field-group">
                <label>Cliente <span class="required">*</span></label>
                <select v-model="form.cliente_id" class="form-control" required>
                  <option value="">Selecciona un cliente</option>
                  <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
                    {{ cliente.nombre }}
                  </option>
                </select>
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
                {{ form.activo ? 'Promoción Activa' : 'Promoción Inactiva' }}
              </span>
            </label>
          </div>
        </div>

        <!-- BOTONES -->
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <i class="bi" :class="loading ? 'bi-arrow-repeat spin' : 'bi-save'"></i>
            {{ loading ? 'Guardando...' : (isEditing ? 'Actualizar Promoción' : 'Crear Promoción') }}
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
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PromocionesAPI, SedesAPI, ProductosAPI, CategoriasAPI, ClientesAPI } from '@/services/api'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()

// ===== STATE =====
const loading = ref(false)
const isEditing = ref(false)
const sedes = ref([])
const productos = ref([])
const categorias = ref([])
const clientes = ref([])
const diasSeleccionados = ref([])

const diasSemana = [
  { label: 'Lun', value: 'Lunes' },
  { label: 'Mar', value: 'Martes' },
  { label: 'Mié', value: 'Miércoles' },
  { label: 'Jue', value: 'Jueves' },
  { label: 'Vie', value: 'Viernes' },
  { label: 'Sáb', value: 'Sábado' },
  { label: 'Dom', value: 'Domingo' }
]

// ===== FORM =====
const form = reactive({
  nombre: '',
  descripcion: '',
  tipo: '',
  codigo: '',
  sede_id: '',
  producto_id: '',
  categoria_id: '',
  porcentaje_descuento: 0,
  monto_descuento: 0,
  cantidad_minima: 0,
  cantidad_maxima: 0,
  fecha_inicio: '',
  fecha_fin: '',
  dias_semana: '',
  horario_inicio: '',
  horario_fin: '',
  cliente_especifico: false,
  cliente_id: '',
  activo: true,
  prioridad: 5,
  uso_limite: 0,
  usos_actuales: 0,
  creado_por: 1
})

// ===== WATCHERS =====
watch(diasSeleccionados, (val) => {
  form.dias_semana = val.join(',')
})

// ===== METHODS =====
function onTipoChange() {
  if (form.tipo === 'Porcentaje') {
    form.monto_descuento = 0
  } else if (form.tipo === 'Monto Fijo') {
    form.porcentaje_descuento = 0
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

async function loadProductos() {
  try {
    const res = await ProductosAPI.list()
    productos.value = res.data.data || []
  } catch (error) {
    console.error('Error cargando productos:', error)
  }
}

async function loadCategorias() {
  try {
    const res = await CategoriasAPI.list()
    categorias.value = res.data.data || []
  } catch (error) {
    console.error('Error cargando categorías:', error)
  }
}

async function loadClientes() {
  try {
    const res = await ClientesAPI.list()
    clientes.value = res.data.data || []
  } catch (error) {
    console.error('Error cargando clientes:', error)
  }
}

async function loadPromocion(id) {
  try {
    const res = await PromocionesAPI.getById(id)
    const data = res.data
    Object.assign(form, data)
    isEditing.value = true
    
    // Convertir días de la semana a array
    if (data.dias_semana) {
      diasSeleccionados.value = data.dias_semana.split(',').filter(d => d)
    }
    
    // Formatear fechas para input datetime-local
    form.fecha_inicio = data.fecha_inicio ? new Date(data.fecha_inicio).toISOString().slice(0, 16) : ''
    form.fecha_fin = data.fecha_fin ? new Date(data.fecha_fin).toISOString().slice(0, 16) : ''
  } catch (error) {
    Swal.fire('Error', 'No se pudo cargar la promoción', 'error')
    router.push('/promociones')
  }
}

async function handleSubmit() {
  if (!form.nombre?.trim()) {
    Swal.fire('Error', 'El nombre es obligatorio', 'error')
    return
  }
  if (!form.codigo?.trim()) {
    Swal.fire('Error', 'El código es obligatorio', 'error')
    return
  }
  if (!form.tipo) {
    Swal.fire('Error', 'Selecciona un tipo de promoción', 'error')
    return
  }
  if (!form.sede_id) {
    Swal.fire('Error', 'Selecciona una sede', 'error')
    return
  }
  if (!form.fecha_inicio) {
    Swal.fire('Error', 'Selecciona una fecha de inicio', 'error')
    return
  }
  if (!form.fecha_fin) {
    Swal.fire('Error', 'Selecciona una fecha de fin', 'error')
    return
  }

  // Validar fechas
  const inicio = new Date(form.fecha_inicio)
  const fin = new Date(form.fecha_fin)
  if (inicio >= fin) {
    Swal.fire('Error', 'La fecha de fin debe ser mayor a la fecha de inicio', 'error')
    return
  }

  // Validar descuentos
  if (form.tipo === 'Porcentaje' && (!form.porcentaje_descuento || form.porcentaje_descuento <= 0)) {
    Swal.fire('Error', 'Ingresa un porcentaje de descuento válido', 'error')
    return
  }
  if (form.tipo === 'Monto Fijo' && (!form.monto_descuento || form.monto_descuento <= 0)) {
    Swal.fire('Error', 'Ingresa un monto de descuento válido', 'error')
    return
  }

  // Validar cliente específico
  if (form.cliente_especifico && !form.cliente_id) {
    Swal.fire('Error', 'Selecciona un cliente', 'error')
    return
  }

  loading.value = true
  try {
    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion?.trim() || '',
      tipo: form.tipo,
      codigo: form.codigo.trim().toUpperCase(),
      sede_id: parseInt(form.sede_id),
      producto_id: form.producto_id ? parseInt(form.producto_id) : null,
      categoria_id: form.categoria_id ? parseInt(form.categoria_id) : null,
      porcentaje_descuento: parseFloat(form.porcentaje_descuento) || 0,
      monto_descuento: parseFloat(form.monto_descuento) || 0,
      cantidad_minima: parseInt(form.cantidad_minima) || 0,
      cantidad_maxima: parseInt(form.cantidad_maxima) || 0,
      fecha_inicio: form.fecha_inicio,
      fecha_fin: form.fecha_fin,
      dias_semana: form.dias_semana || '',
      horario_inicio: form.horario_inicio || '',
      horario_fin: form.horario_fin || '',
      cliente_especifico: form.cliente_especifico || false,
      cliente_id: form.cliente_especifico ? parseInt(form.cliente_id) : null,
      activo: form.activo !== undefined ? form.activo : true,
      prioridad: parseInt(form.prioridad) || 5,
      uso_limite: parseInt(form.uso_limite) || 0,
      usos_actuales: parseInt(form.usos_actuales) || 0,
      creado_por: form.creado_por || 1
    }

    let response
    if (isEditing.value) {
      response = await PromocionesAPI.update(route.params.id, payload)
    } else {
      response = await PromocionesAPI.create(payload)
    }

    if (response.data.success) {
      Swal.fire('Éxito', isEditing.value ? 'Promoción actualizada' : 'Promoción creada correctamente', 'success')
      router.push('/promociones')
    }
  } catch (error) {
    console.error('Error al guardar:', error)
    const errorData = error.response?.data
    let msg = 'Error al guardar la promoción'
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
  router.push('/promociones')
}

// ===== LIFECYCLE =====
onMounted(async () => {
  await Promise.all([
    loadSedes(),
    loadProductos(),
    loadCategorias(),
    loadClientes()
  ])

  const id = route.params.id
  if (id && id !== 'nuevo') {
    await loadPromocion(id)
  } else {
    // Fechas por defecto
    const ahora = new Date()
    const dentro7Dias = new Date()
    dentro7Dias.setDate(ahora.getDate() + 7)
    
    form.fecha_inicio = ahora.toISOString().slice(0, 16)
    form.fecha_fin = dentro7Dias.toISOString().slice(0, 16)
  }
})
</script>

<style scoped>
.page-container { padding: 24px; max-width: 900px; margin: 0 auto; }
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
.help-text { color: #9ca3af; font-size: 12px; display: block; margin-top: 4px; }
.form-control { width: 100%; padding: 8px 14px; border: 1.5px solid #d1d5db; border-radius: 8px; font-size: 14px; font-family: inherit; transition: all 0.2s ease; background: #ffffff; color: #111827; }
.form-control:focus { outline: none; border-color: #2F6FED; box-shadow: 0 0 0 3px rgba(47,111,237,0.08); }
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
.dias-container { display: flex; gap: 8px; flex-wrap: wrap; padding-top: 4px; }
.dia-checkbox { display: flex; align-items: center; gap: 4px; font-size: 13px; color: #374151; cursor: pointer; }
.dia-checkbox input[type="checkbox"] { width: 16px; height: 16px; cursor: pointer; accent-color: #2F6FED; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@media (max-width: 768px) { .page-container { padding: 12px; } .page-header { flex-direction: column; align-items: stretch; padding: 16px; } .form-card { padding: 20px; } .header-title h1 { font-size: 18px; } .header-actions { justify-content: stretch; } .header-actions .btn { flex: 1; justify-content: center; } .form-actions { flex-direction: column; } .form-actions .btn { width: 100%; justify-content: center; } .dias-container { gap: 4px; } .dia-checkbox { font-size: 12px; } }
@media (max-width: 480px) { .header-title i { font-size: 24px; padding: 8px; } .header-title h1 { font-size: 16px; } .form-card { padding: 16px; } }
</style>