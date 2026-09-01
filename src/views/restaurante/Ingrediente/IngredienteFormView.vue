<!-- src/views/restaurante/Ingrediente/IngredienteFormView.vue -->
<template>
  <div class="page-container">
    <!-- HEADER -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-title">
          <i class="bi bi-cup-straw"></i>
          <div>
            <h1>{{ isEditing ? 'Editar Ingrediente' : 'Nuevo Ingrediente' }}</h1>
            <p class="text-muted">
              {{ isEditing ? 'Modifica los datos del ingrediente' : 'Registra un nuevo ingrediente en el inventario' }}
            </p>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <router-link to="/ingredientes" class="btn btn-outline-secondary">
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
                  <i class="bi bi-tag"></i>
                  Nombre <span class="required">*</span>
                </label>
                <input 
                  type="text" 
                  v-model="form.nombre" 
                  placeholder="Nombre del ingrediente"
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
                <label>
                  <i class="bi bi-hash"></i>
                  Código <span class="required">*</span>
                </label>
                <input 
                  type="text" 
                  v-model="form.codigo" 
                  placeholder="Código del ingrediente (Ej: ING-001)"
                  class="form-control"
                  :class="{ 'error': errors.codigo }"
                  @blur="validateField('codigo')"
                >
                <span class="error-msg" v-if="errors.codigo">
                  <i class="bi bi-exclamation-circle"></i> {{ errors.codigo }}
                </span>
                <small class="help-text">Código único para identificar el ingrediente</small>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="field-group">
                <label>
                  <i class="bi bi-tags"></i>
                  Categoría <span class="required">*</span>
                </label>
                <select 
                  v-model="form.categoria_ingrediente" 
                  class="form-control"
                  :class="{ 'error': errors.categoria_ingrediente }"
                  @change="validateField('categoria_ingrediente')"
                >
                  <option value="">Selecciona una categoría</option>
                  <option v-for="cat in categorias" :key="cat" :value="cat">
                    {{ cat }}
                  </option>
                </select>
                <span class="error-msg" v-if="errors.categoria_ingrediente">
                  <i class="bi bi-exclamation-circle"></i> {{ errors.categoria_ingrediente }}
                </span>
              </div>
            </div>
            <div class="col-md-6">
              <div class="field-group">
                <label>
                  <i class="bi bi-rulers"></i>
                  Unidad de Medida <span class="required">*</span>
                </label>
                <select 
                  v-model="form.unidad_medida" 
                  class="form-control"
                  :class="{ 'error': errors.unidad_medida }"
                  @change="validateField('unidad_medida')"
                >
                  <option value="">Selecciona una unidad</option>
                  <option value="Kg">Kg (Kilogramo)</option>
                  <option value="g">g (Gramo)</option>
                  <option value="L">L (Litro)</option>
                  <option value="ml">ml (Mililitro)</option>
                  <option value="Unidad">Unidad</option>
                  <option value="Docena">Docena</option>
                  <option value="Paquete">Paquete</option>
                  <option value="Caja">Caja</option>
                  <option value="Bolsa">Bolsa</option>
                  <option value="Frasco">Frasco</option>
                  <option value="Lata">Lata</option>
                </select>
                <span class="error-msg" v-if="errors.unidad_medida">
                  <i class="bi bi-exclamation-circle"></i> {{ errors.unidad_medida }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- SECCIÓN: STOCK Y PRECIOS -->
        <div class="form-section">
          <h3 class="section-title">
            <i class="bi bi-clipboard-data"></i>
            Stock y Precios
          </h3>
          <div class="row">
            <div class="col-md-3">
              <div class="field-group">
                <label>
                  <i class="bi bi-box"></i>
                  Stock Actual <span class="required">*</span>
                </label>
                <input 
                  type="number" 
                  v-model="form.stock_actual" 
                  placeholder="0.00"
                  class="form-control"
                  :class="{ 'error': errors.stock_actual }"
                  @blur="validateField('stock_actual')"
                  step="0.01"
                  min="0"
                >
                <span class="error-msg" v-if="errors.stock_actual">
                  <i class="bi bi-exclamation-circle"></i> {{ errors.stock_actual }}
                </span>
              </div>
            </div>
            <div class="col-md-3">
              <div class="field-group">
                <label>
                  <i class="bi bi-exclamation-triangle"></i>
                  Stock Mínimo
                </label>
                <input 
                  type="number" 
                  v-model="form.stock_minimo" 
                  placeholder="0.00"
                  class="form-control"
                  step="0.01"
                  min="0"
                >
                <small class="help-text">Alerta de stock bajo</small>
              </div>
            </div>
            <div class="col-md-3">
              <div class="field-group">
                <label>
                  <i class="bi bi-arrow-up"></i>
                  Stock Máximo
                </label>
                <input 
                  type="number" 
                  v-model="form.stock_maximo" 
                  placeholder="0.00"
                  class="form-control"
                  step="0.01"
                  min="0"
                >
                <small class="help-text">Límite de stock</small>
              </div>
            </div>
            <div class="col-md-3">
              <div class="field-group">
                <label>
                  <i class="bi bi-coin"></i>
                  Precio Unitario
                </label>
                <input 
                  type="number" 
                  v-model="form.precio_unitario" 
                  placeholder="0.00"
                  class="form-control"
                  step="0.01"
                  min="0"
                >
                <small class="help-text">Opcional</small>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="field-group">
                <label>
                  <i class="bi bi-calculator"></i>
                  Costo Promedio
                </label>
                <input 
                  type="number" 
                  v-model="form.costo_promedio" 
                  placeholder="0.00"
                  class="form-control"
                  step="0.01"
                  min="0"
                >
                <small class="help-text">Costo promedio del ingrediente</small>
              </div>
            </div>
            <div class="col-md-6">
              <div class="field-group">
                <label>
                  <i class="bi bi-truck"></i>
                  Proveedor
                </label>
                <select v-model="form.proveedor_id" class="form-control">
                  <option value="">Selecciona un proveedor</option>
                  <option v-for="prov in proveedores" :key="prov.id" :value="prov.id">
                    {{ prov.nombre }}
                  </option>
                </select>
                <small class="help-text">Opcional</small>
              </div>
            </div>
          </div>
        </div>

        <!-- SECCIÓN: UBICACIÓN Y LOTE -->
        <div class="form-section">
          <h3 class="section-title">
            <i class="bi bi-geo-alt"></i>
            Ubicación y Lote
          </h3>
          <div class="row">
            <div class="col-md-4">
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
            <div class="col-md-4">
              <div class="field-group">
                <label>
                  <i class="bi bi-geo"></i>
                  Ubicación
                </label>
                <input 
                  type="text" 
                  v-model="form.ubicacion" 
                  placeholder="Estante A1, Pasillo 3..."
                  class="form-control"
                >
                <small class="help-text">Ubicación física en el almacén</small>
              </div>
            </div>
            <div class="col-md-4">
              <div class="field-group">
                <label>
                  <i class="bi bi-upc-scan"></i>
                  Lote
                </label>
                <input 
                  type="text" 
                  v-model="form.lote" 
                  placeholder="LOTE-2024-001"
                  class="form-control"
                >
                <small class="help-text">Número de lote</small>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="field-group">
                <label>
                  <i class="bi bi-calendar"></i>
                  Fecha de Vencimiento
                </label>
                <input 
                  type="date" 
                  v-model="form.fecha_vencimiento" 
                  class="form-control"
                >
                <small class="help-text">Opcional</small>
              </div>
            </div>
          </div>
        </div>

        <!-- SECCIÓN: IMAGEN -->
        <div class="form-section">
          <h3 class="section-title">
            <i class="bi bi-image"></i>
            Imagen del Ingrediente
          </h3>
          <div class="row">
            <div class="col-md-12">
              <div class="field-group">
                <div class="photo-upload">
                  <!-- Preview de la imagen -->
                  <div class="photo-preview" v-if="imagenPreview || form.imagen_url">
                    <img 
                      :src="imagenPreview || form.imagen_url" 
                      alt="Imagen del ingrediente"
                      class="photo-image"
                    >
                    <button 
                      type="button" 
                      class="btn-remove-photo"
                      @click="removerImagen"
                      title="Eliminar imagen"
                    >
                      <i class="bi bi-x-circle"></i>
                    </button>
                  </div>
                  <div class="photo-placeholder" v-else>
                    <i class="bi bi-cup-straw fs-1 text-muted"></i>
                    <span>Sin imagen</span>
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
                    <small class="help-text">Formatos: JPG, PNG, GIF, WEBP. Máx: 2MB</small>
                    <small class="help-text">⚠️ La imagen solo se usa como preview (no se sube al backend)</small>
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
                {{ form.activo ? 'Ingrediente Activo' : 'Ingrediente Inactivo' }}
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
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { IngredientesAPI, SedesAPI, ProveedoresAPI } from '@/services/api'
import Swal from 'sweetalert2'

// ===== ROUTER =====
const route = useRoute()
const router = useRouter()

// ===== STATE =====
const loading = ref(false)
const isEditing = ref(false)
const sedes = ref([])
const proveedores = ref([])
const imagenPreview = ref(null)
const imagenFile = ref(null)

// ===== CATEGORÍAS =====
const categorias = [
  'Carnes', 'Pescados', 'Aves', 'Verduras', 'Frutas',
  'Granos', 'Lácteos', 'Huevos', 'Aceites', 'Especias',
  'Salsas', 'Pastas', 'Panadería', 'Bebidas', 'Otros'
]

// ===== FORM =====
const defaultForm = {
  nombre: '',
  codigo: '',
  categoria_ingrediente: '',
  stock_actual: 0,
  stock_minimo: 0,
  stock_maximo: 0,
  unidad_medida: '',
  precio_unitario: 0,
  costo_promedio: 0,
  sede_id: '',
  proveedor_id: '',
  fecha_vencimiento: '',
  ubicacion: '',
  lote: '',
  imagen_url: '',
  activo: true
}

const form = reactive({ ...defaultForm })

// ===== ERRORS =====
const errors = reactive({
  nombre: '',
  codigo: '',
  categoria_ingrediente: '',
  unidad_medida: '',
  stock_actual: '',
  sede_id: ''
})

// ===== VALIDACIONES =====
const validations = {
  nombre: (val) => {
    if (!val?.trim()) return 'El nombre es obligatorio'
    if (val.trim().length < 2) return 'Mínimo 2 caracteres'
    return ''
  },
  codigo: (val) => {
    if (!val?.trim()) return 'El código es obligatorio'
    if (val.trim().length < 2) return 'Mínimo 2 caracteres'
    return ''
  },
  categoria_ingrediente: (val) => {
    if (!val) return 'La categoría es obligatoria'
    return ''
  },
  unidad_medida: (val) => {
    if (!val) return 'La unidad de medida es obligatoria'
    return ''
  },
  stock_actual: (val) => {
    if (val === '' || val === null || val === undefined) return 'El stock actual es obligatorio'
    if (parseFloat(val) < 0) return 'El stock no puede ser negativo'
    return ''
  },
  sede_id: (val) => {
    if (!val) return 'La sede es obligatoria'
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

// ===== MANEJO DE IMAGEN =====
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

  imagenFile.value = file

  // Crear preview (SOLO para visualizar, NO se guarda en BD)
  const reader = new FileReader()
  reader.onload = (e) => {
    imagenPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

function removerImagen() {
  imagenPreview.value = null
  imagenFile.value = null
  form.imagen_url = ''
  // Limpiar el input file
  const fileInput = document.querySelector('input[type="file"]')
  if (fileInput) fileInput.value = ''
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

async function loadProveedores() {
  try {
    const res = await ProveedoresAPI.list()
    proveedores.value = res.data.data || []
  } catch (error) {
    console.error('Error cargando proveedores:', error)
  }
}

async function loadItem(id) {
  try {
    const res = await IngredientesAPI.getById(id)
    const data = res.data
    Object.assign(form, data)
    if (data.imagen_url) {
      imagenPreview.value = data.imagen_url
    }
    isEditing.value = true
  } catch (error) {
    Swal.fire('Error', 'No se pudo cargar el ingrediente', 'error')
    router.push('/ingredientes')
  }
}

// ===== HANDLE SUBMIT - CORREGIDO =====
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

  // Validar que stock_minimo no sea mayor que stock_maximo
  if (form.stock_minimo && form.stock_maximo && 
      parseFloat(form.stock_minimo) > parseFloat(form.stock_maximo)) {
    Swal.fire({
      title: 'Error',
      text: 'El stock mínimo no puede ser mayor que el stock máximo',
      icon: 'error',
      confirmButtonText: 'Entendido'
    })
    return
  }

  loading.value = true
  try {
    // ✅ IMPORTANTE: NO enviar imagen_url si está vacía
    const payload = {
      nombre: form.nombre.trim(),
      codigo: form.codigo.trim().toUpperCase(),
      categoria_ingrediente: form.categoria_ingrediente,
      stock_actual: parseFloat(form.stock_actual) || 0,
      stock_minimo: parseFloat(form.stock_minimo) || 0,
      stock_maximo: parseFloat(form.stock_maximo) || 0,
      unidad_medida: form.unidad_medida,
      precio_unitario: parseFloat(form.precio_unitario) || 0,
      costo_promedio: parseFloat(form.costo_promedio) || 0,
      sede_id: parseInt(form.sede_id),
      proveedor_id: form.proveedor_id ? parseInt(form.proveedor_id) : null,
      fecha_vencimiento: form.fecha_vencimiento || null,
      ubicacion: form.ubicacion?.trim() || '',
      lote: form.lote?.trim() || '',
      activo: form.activo
    }

    // ✅ Solo agregar imagen_url si tiene un valor válido
    if (form.imagen_url && form.imagen_url.trim() !== '') {
      payload.imagen_url = form.imagen_url.trim()
    }

    console.log('📤 Enviando payload:', payload)

    let response
    if (isEditing.value) {
      response = await IngredientesAPI.update(route.params.id, payload)
      Swal.fire({
        title: '¡Éxito!',
        text: 'Ingrediente actualizado correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      })
    } else {
      response = await IngredientesAPI.create(payload)
      Swal.fire({
        title: '¡Éxito!',
        text: 'Ingrediente creado correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      })
    }
    
    // ✅ Si el ingrediente se creó y hay una imagen seleccionada, mostrar mensaje
    if (!isEditing.value && imagenFile.value && response?.data?.data?.id) {
      Swal.fire({
        title: 'Imagen pendiente',
        text: 'El ingrediente fue creado. La imagen se puede subir desde la vista de detalles.',
        icon: 'info',
        confirmButtonText: 'Entendido'
      })
    }
    
    router.push('/ingredientes')
  } catch (error) {
    console.error('❌ Error al guardar:', error.response?.data)
    const errorData = error.response?.data
    let message = 'Error al guardar el ingrediente'
    
    if (errorData?.errors) {
      const errorsList = errorData.errors
      const messages = []
      Object.keys(errorsList).forEach(key => {
        if (Array.isArray(errorsList[key])) {
          messages.push(...errorsList[key])
        } else {
          messages.push(`${key}: ${errorsList[key]}`)
        }
      })
      message = messages.join('\n')
    } else if (errorData?.title) {
      message = errorData.title
    } else if (errorData?.message) {
      message = errorData.message
    } else if (errorData?.detail) {
      message = errorData.detail
    }
    
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonText: 'Entendido'
    })
  } finally {
    loading.value = false
  }
}

function cancelar() {
  router.push('/ingredientes')
}

// ===== LIFECYCLE =====
onMounted(async () => {
  await Promise.all([loadSedes(), loadProveedores()])
  
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
  border-radius: 12px;
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
  border-radius: 12px;
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