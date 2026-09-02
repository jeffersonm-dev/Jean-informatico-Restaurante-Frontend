<!-- src/views/restaurante/Categoria/CategoriaFormModal.vue -->
<template>
  <div class="modal-overlay" v-if="show" @click.self="close">
    <div class="modal-box">
      <div class="modal-header">
        <h5 class="modal-title">
          <i :class="editando ? 'bi bi-pencil-square' : 'bi bi-plus-circle'"></i>
          {{ editando ? 'Editar Categoría' : 'Nueva Categoría' }}
        </h5>
        <button type="button" class="btn-close" @click="close">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <form @submit.prevent="guardar">
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label>Nombre *</label>
              <input 
                type="text" 
                v-model="form.nombre" 
                required 
                placeholder="Ej: Bebidas"
                :class="{ 'is-invalid': errors.nombre }"
              />
              <span v-if="errors.nombre" class="error-text">{{ errors.nombre }}</span>
            </div>
            <div class="form-group">
              <label>Icono</label>
              <div class="icon-selector">
                <button 
                  type="button"
                  class="icon-option"
                  :class="{ active: form.icono === icon.value }"
                  v-for="icon in iconosDisponibles"
                  :key="icon.value"
                  @click="form.icono = icon.value"
                  :title="icon.label"
                >
                  <i :class="icon.value"></i>
                </button>
                <button 
                  type="button"
                  class="icon-option clear-icon"
                  :class="{ active: !form.icono }"
                  @click="form.icono = ''"
                  title="Sin icono"
                >
                  <i class="bi bi-x-circle"></i>
                </button>
              </div>
              <small class="helper-text">Selecciona un icono para la categoría</small>
            </div>
          </div>

          <div class="form-group">
            <label>Descripción</label>
            <textarea 
              v-model="form.descripcion" 
              rows="3"
              placeholder="Describe la categoría..."
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Orden</label>
              <input 
                type="number" 
                v-model.number="form.orden" 
                min="0"
                placeholder="0"
              />
            </div>
            <div class="form-group">
              <label>Categoría Padre</label>
              <select v-model="form.padre_id">
                <option :value="0">📁 Ninguna (Categoría Principal)</option>
                <option 
                  v-for="cat in categoriasDisponibles" 
                  :key="cat.id" 
                  :value="cat.id"
                  :disabled="editando && cat.id === form.id"
                >
                  {{ obtenerIndentacion(cat.id) }} {{ cat.nombre }}
                  <span v-if="cat.padre_id !== 0" style="color: #999; font-size: 12px;">
                    (Subcategoría)
                  </span>
                </option>
              </select>
              <small class="helper-text">Selecciona una categoría padre o deja "Ninguna" para crear una categoría principal</small>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Sede *</label>
              <select v-model="form.sede_id" required>
                <option value="">Selecciona una sede</option>
                <option 
                  v-for="sede in sedes" 
                  :key="sede.id" 
                  :value="sede.id"
                >
                  {{ sede.nombre }}
                </option>
              </select>
              <span v-if="errors.sede_id" class="error-text">{{ errors.sede_id }}</span>
            </div>
            <div class="form-group switch-group">
              <label>Estado</label>
              <div class="switch-container">
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
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-secondary" @click="close">Cancelar</button>
          <button type="submit" class="btn-primary" :disabled="guardando">
            <i v-if="guardando" class="bi bi-spinner bi-spin"></i>
            <i v-else :class="editando ? 'bi bi-pencil' : 'bi bi-save'"></i>
            {{ guardando ? 'Guardando...' : (editando ? 'Actualizar' : 'Guardar') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { CategoriasAPI } from '@/services/api'
import Swal from 'sweetalert2'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  editando: {
    type: Boolean,
    default: false
  },
  categoria: {
    type: Object,
    default: null
  },
  sedes: {
    type: Array,
    default: () => []
  },
  categorias: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'save'])

// ============================================
// ICONOS DISPONIBLES (Bootstrap Icons)
// ============================================
const iconosDisponibles = [
  { value: 'bi bi-tag', label: 'Etiqueta' },
  { value: 'bi bi-tags', label: 'Etiquetas' },
  { value: 'bi bi-cup-hot', label: 'Bebida caliente' },
  { value: 'bi bi-cup-straw', label: 'Bebida fría' },
  { value: 'bi bi-egg-fried', label: 'Huevo' },
  { value: 'bi bi-basket', label: 'Canasta' },
  { value: 'bi bi-bag', label: 'Bolsa' },
  { value: 'bi bi-box', label: 'Caja' },
  { value: 'bi bi-box-seam', label: 'Caja sellada' },
  { value: 'bi bi-cake', label: 'Pastel' },
  { value: 'bi bi-cupcake', label: 'Cupcake' },
  { value: 'bi bi-droplet', label: 'Gota' },
  { value: 'bi bi-flower1', label: 'Flor' },
  { value: 'bi bi-flower2', label: 'Flor 2' },
  { value: 'bi bi-flower3', label: 'Flor 3' },
  { value: 'bi bi-fruit', label: 'Fruta' },
  { value: 'bi bi-gem', label: 'Gema' },
  { value: 'bi bi-gift', label: 'Regalo' },
  { value: 'bi bi-handbag', label: 'Bolso' },
  { value: 'bi bi-house', label: 'Casa' },
  { value: 'bi bi-ice-cream', label: 'Helado' },
  { value: 'bi bi-key', label: 'Llave' },
  { value: 'bi bi-lightbulb', label: 'Bombilla' },
  { value: 'bi bi-megaphone', label: 'Megáfono' },
  { value: 'bi bi-music-note', label: 'Nota musical' },
  { value: 'bi bi-palette', label: 'Paleta' },
  { value: 'bi bi-pencil', label: 'Lápiz' },
  { value: 'bi bi-person', label: 'Persona' },
  { value: 'bi bi-phone', label: 'Teléfono' },
  { value: 'bi bi-pizza', label: 'Pizza' },
  { value: 'bi bi-rocket', label: 'Cohete' },
  { value: 'bi bi-scissors', label: 'Tijeras' },
  { value: 'bi bi-shop', label: 'Tienda' },
  { value: 'bi bi-star', label: 'Estrella' },
  { value: 'bi bi-suit-heart', label: 'Corazón' },
  { value: 'bi bi-trophy', label: 'Trofeo' },
  { value: 'bi bi-truck', label: 'Camión' },
  { value: 'bi bi-umbrella', label: 'Paraguas' },
  { value: 'bi bi-wallet', label: 'Cartera' },
  { value: 'bi bi-watch', label: 'Reloj' },
  { value: 'bi bi-wifi', label: 'WiFi' },
  { value: 'bi bi-bicycle', label: 'Bicicleta' },
  { value: 'bi bi-bank', label: 'Banco' },
  { value: 'bi bi-building', label: 'Edificio' },
  { value: 'bi bi-tree', label: 'Árbol' },
  { value: 'bi bi-sun', label: 'Sol' },
  { value: 'bi bi-moon', label: 'Luna' },
  { value: 'bi bi-cloud', label: 'Nube' },
  { value: 'bi bi-rainbow', label: 'Arcoíris' },
  { value: 'bi bi-bug', label: 'Bicho' },
  { value: 'bi bi-database', label: 'Base de datos' },
  { value: 'bi bi-globe', label: 'Globo' },
  { value: 'bi bi-map', label: 'Mapa' },
  { value: 'bi bi-compass', label: 'Brújula' },
  { value: 'bi bi-camera', label: 'Cámara' },
  { value: 'bi bi-video', label: 'Video' },
  { value: 'bi bi-mic', label: 'Micrófono' },
  { value: 'bi bi-headphones', label: 'Audífonos' },
  { value: 'bi bi-laptop', label: 'Laptop' },
  { value: 'bi bi-printer', label: 'Impresora' },
  { value: 'bi bi-book', label: 'Libro' },
  { value: 'bi bi-journal', label: 'Revista' },
  { value: 'bi bi-newspaper', label: 'Periódico' }
]

// ============================================
// STATE
// ============================================
const guardando = ref(false)
const errors = ref({
  nombre: '',
  sede_id: ''
})

const form = ref({
  nombre: '',
  descripcion: '',
  icono: '',
  imagen_url: '',
  orden: 0,
  padre_id: 0,
  activo: true,
  sede_id: ''
})

// ============================================
// COMPUTED
// ============================================
const categoriasDisponibles = computed(() => {
  let disponibles = props.categorias
  
  if (props.editando && props.categoria) {
    const idsHijas = obtenerIdsSubcategorias(props.categoria.id, props.categorias)
    disponibles = disponibles.filter(c => 
      c.id !== props.categoria.id && !idsHijas.includes(c.id)
    )
  }
  
  return disponibles
})

// ============================================
// MÉTODOS
// ============================================
// Función para obtener la indentación visual sin usar HTML dentro de option
const obtenerIndentacion = (categoriaId) => {
  let nivel = 0
  let actual = props.categorias.find(c => c.id === categoriaId)
  while (actual && actual.padre_id !== 0) {
    nivel++
    actual = props.categorias.find(c => c.id === actual.padre_id)
  }
  // Usar guiones y emojis para representar jerarquía
  return '—'.repeat(nivel) + (nivel > 0 ? ' ' : '')
}

const obtenerIdsSubcategorias = (padreId, categoriasList) => {
  const ids = []
  const hijas = categoriasList.filter(c => c.padre_id === padreId)
  hijas.forEach(hija => {
    ids.push(hija.id)
    ids.push(...obtenerIdsSubcategorias(hija.id, categoriasList))
  })
  return ids
}

const resetForm = () => {
  form.value = {
    nombre: '',
    descripcion: '',
    icono: '',
    imagen_url: '',
    orden: 0,
    padre_id: 0,
    activo: true,
    sede_id: ''
  }
}

const validarFormulario = () => {
  let isValid = true
  
  if (!form.value.nombre) {
    errors.value.nombre = 'El nombre es requerido'
    isValid = false
  } else {
    errors.value.nombre = ''
  }

  if (!form.value.sede_id) {
    errors.value.sede_id = 'Selecciona una sede'
    isValid = false
  } else {
    errors.value.sede_id = ''
  }

  return isValid
}

const guardar = async () => {
  if (!validarFormulario()) {
    Swal.fire({
      icon: 'warning',
      title: 'Corrige los errores',
      text: 'Por favor, completa todos los campos requeridos.',
      confirmButtonColor: '#E85D3A'
    })
    return
  }

  guardando.value = true
  try {
    const dataToSend = {
      nombre: form.value.nombre,
      descripcion: form.value.descripcion || null,
      icono: form.value.icono || null,
      imagen_url: form.value.imagen_url || null,
      orden: form.value.orden || 0,
      padre_id: form.value.padre_id || 0,
      activo: form.value.activo,
      sede_id: Number(form.value.sede_id)
    }

    console.log('📤 Enviando datos:', dataToSend)

    let response
    if (props.editando) {
      response = await CategoriasAPI.update(form.value.id, dataToSend)
    } else {
      response = await CategoriasAPI.create(dataToSend)
    }

    if (response.data.success) {
      Swal.fire({
        icon: 'success',
        title: props.editando ? 'Categoría actualizada' : 'Categoría creada',
        timer: 1500,
        showConfirmButton: false
      })
      emit('save')
      emit('close')
    }
  } catch (error) {
    console.error('❌ Error detallado:', error.response?.data)
    
    const errorsData = error.response?.data?.errors
    let errorMsg = error.response?.data?.message || 'Error al guardar la categoría'
    
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

const close = () => {
  emit('close')
}

// ============================================
// WATCHERS
// ============================================
watch(() => props.show, (val) => {
  if (val) {
    if (props.editando && props.categoria) {
      form.value = {
        id: props.categoria.id,
        nombre: props.categoria.nombre || '',
        descripcion: props.categoria.descripcion || '',
        icono: props.categoria.icono || '',
        imagen_url: props.categoria.imagen_url || '',
        orden: props.categoria.orden || 0,
        padre_id: props.categoria.padre_id || 0,
        activo: props.categoria.activo !== false,
        sede_id: props.categoria.sede_id || ''
      }
    } else {
      resetForm()
    }
    errors.value = { nombre: '', sede_id: '' }
  }
})
</script>

<style scoped>
/* ============================================
   MODAL OVERLAY
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
  max-width: 650px;
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

/* ============================================
   MODAL HEADER
   ============================================ */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #f3f4f6;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 10;
  border-radius: 20px 20px 0 0;
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

/* ============================================
   MODAL BODY
   ============================================ */
.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #f3f4f6;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  position: sticky;
  bottom: 0;
  background: #fff;
  border-radius: 0 0 20px 20px;
}

/* ============================================
   FORM
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
.form-group select,
.form-group textarea {
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s ease;
  outline: none;
  background: #fafafa;
  color: #1a1a2e;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #E85D3A;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(232, 93, 58, 0.08);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
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

.helper-text {
  color: #6b7280;
  font-size: 11px;
  margin-top: 2px;
}

/* ============================================
   ICON SELECTOR VISUAL
   ============================================ */
.icon-selector {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  gap: 6px;
  padding: 8px;
  background: #f8f6f4;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  max-height: 150px;
  overflow-y: auto;
}

.icon-option {
  width: 40px;
  height: 40px;
  border: 2px solid transparent;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #4b5563;
  transition: all 0.2s ease;
  padding: 0;
}

.icon-option:hover {
  border-color: #d1d5db;
  transform: scale(1.05);
  background: #f3f4f6;
}

.icon-option.active {
  border-color: #E85D3A;
  background: rgba(232, 93, 58, 0.08);
  color: #E85D3A;
  box-shadow: 0 0 0 3px rgba(232, 93, 58, 0.15);
}

.icon-option.clear-icon {
  color: #9ca3af;
}

.icon-option.clear-icon:hover {
  color: #ef4444;
  border-color: #ef4444;
}

.icon-option.clear-icon.active {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
}

/* Scroll personalizado para el selector de iconos */
.icon-selector::-webkit-scrollbar {
  width: 4px;
}

.icon-selector::-webkit-scrollbar-track {
  background: transparent;
}

.icon-selector::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.icon-selector::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* ============================================
   SWITCH
   ============================================ */
.switch-group {
  justify-content: flex-start;
}

.switch-container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 4px;
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
   BUTTONS
   ============================================ */
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

.btn-primary:hover:not(:disabled) {
  background: #c94f2e;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(232, 93, 58, 0.35);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
   RESPONSIVE
   ============================================ */
@media (max-width: 768px) {
  .modal-box {
    max-width: 100%;
    margin: 10px;
    border-radius: 16px;
  }

  .modal-body {
    padding: 16px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .icon-selector {
    grid-template-columns: repeat(auto-fill, minmax(36px, 1fr));
    max-height: 120px;
  }

  .icon-option {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .modal-header {
    padding: 16px;
  }

  .modal-footer {
    padding: 12px 16px;
    flex-direction: column;
  }

  .modal-footer button {
    width: 100%;
    justify-content: center;
  }

  .icon-selector {
    grid-template-columns: repeat(auto-fill, minmax(32px, 1fr));
    max-height: 100px;
    padding: 6px;
  }

  .icon-option {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
}
</style>