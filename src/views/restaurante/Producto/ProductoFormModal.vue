<!-- src/views/restaurante/Producto/ProductoFormModal.vue -->
<template>
  <div class="modal-overlay" v-if="show" @click.self="close">
    <div class="modal-box">
      <div class="modal-header">
        <h5 class="modal-title">
          <i :class="editando ? 'bi bi-pencil-square' : 'bi bi-plus-circle'"></i>
          {{ editando ? 'Editar Producto' : 'Nuevo Producto' }}
        </h5>
        <button type="button" class="btn-close" @click="close">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <form @submit.prevent="guardar">
        <div class="modal-body">
          <!-- Código y Nombre -->
          <div class="form-row">
            <div class="form-group">
              <label>Código *</label>
              <input 
                type="text" 
                v-model="form.codigo" 
                required 
                placeholder="Ej: PROD-001"
                :class="{ 'is-invalid': errors.codigo }"
              />
              <span v-if="errors.codigo" class="error-text">{{ errors.codigo }}</span>
            </div>
            <div class="form-group">
              <label>Nombre *</label>
              <input 
                type="text" 
                v-model="form.nombre" 
                required 
                placeholder="Ej: Café Americano"
                :class="{ 'is-invalid': errors.nombre }"
              />
              <span v-if="errors.nombre" class="error-text">{{ errors.nombre }}</span>
            </div>
          </div>

          <!-- Descripción -->
          <div class="form-group">
            <label>Descripción</label>
            <textarea 
              v-model="form.descripcion" 
              rows="2"
              placeholder="Describe el producto..."
            ></textarea>
          </div>

          <!-- Precios -->
          <div class="form-row">
            <div class="form-group">
              <label>Precio Compra</label>
              <input 
                type="number" 
                v-model.number="form.precio_compra" 
                step="0.01"
                min="0"
                placeholder="0.00"
              />
            </div>
            <div class="form-group">
              <label>Precio Venta *</label>
              <input 
                type="number" 
                v-model.number="form.precio_venta" 
                required 
                step="0.01"
                min="0.01"
                placeholder="0.00"
                :class="{ 'is-invalid': errors.precio_venta }"
              />
              <span v-if="errors.precio_venta" class="error-text">{{ errors.precio_venta }}</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Precio Mayorista</label>
              <input 
                type="number" 
                v-model.number="form.precio_mayorista" 
                step="0.01"
                min="0"
                placeholder="0.00"
              />
            </div>
            <div class="form-group">
              <label>Precio Promoción</label>
              <input 
                type="number" 
                v-model.number="form.precio_promocion" 
                step="0.01"
                min="0"
                placeholder="0.00"
              />
            </div>
          </div>

          <!-- Stock -->
          <div class="form-row">
            <div class="form-group">
              <label>Stock Actual</label>
              <input 
                type="number" 
                v-model.number="form.stock_actual" 
                step="0.01"
                min="0"
                placeholder="0"
              />
            </div>
            <div class="form-group">
              <label>Unidad de Medida</label>
              <select v-model="form.unidad_medida">
                <option value="">Selecciona una unidad</option>
                <option value="Unidad">Unidad</option>
                <option value="Kilogramo">Kilogramo</option>
                <option value="Gramo">Gramo</option>
                <option value="Litro">Litro</option>
                <option value="Mililitro">Mililitro</option>
                <option value="Paquete">Paquete</option>
                <option value="Caja">Caja</option>
                <option value="Docena">Docena</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Stock Mínimo</label>
              <input 
                type="number" 
                v-model.number="form.stock_minimo" 
                step="0.01"
                min="0"
                placeholder="0"
              />
            </div>
            <div class="form-group">
              <label>Stock Máximo</label>
              <input 
                type="number" 
                v-model.number="form.stock_maximo" 
                step="0.01"
                min="0"
                placeholder="0"
              />
            </div>
          </div>

          <!-- Peso y Volumen -->
          <div class="form-row">
            <div class="form-group">
              <label>Peso</label>
              <input 
                type="number" 
                v-model.number="form.peso" 
                step="0.01"
                min="0"
                placeholder="0.00"
              />
            </div>
            <div class="form-group">
              <label>Volumen</label>
              <input 
                type="number" 
                v-model.number="form.volumen" 
                step="0.01"
                min="0"
                placeholder="0.00"
              />
            </div>
          </div>

          <!-- Categoría, Sede y Usuario -->
          <div class="form-row">
            <div class="form-group">
              <label>Categoría *</label>
              <select v-model="form.categoria_id" required>
                <option value="">Selecciona una categoría</option>
                <option 
                  v-for="categoria in categorias" 
                  :key="categoria.id" 
                  :value="categoria.id"
                >
                  {{ categoria.nombre }}
                </option>
              </select>
              <span v-if="errors.categoria_id" class="error-text">{{ errors.categoria_id }}</span>
            </div>
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
          </div>

          <!-- Usuario Creación -->
          <div class="form-row">
            <div class="form-group">
              <label>Usuario de Creación</label>
              <select v-model="form.usuario_creacion">
                <option value="">Selecciona un usuario</option>
                <option 
                  v-for="usuario in usuarios" 
                  :key="usuario.id" 
                  :value="usuario.id"
                >
                  {{ usuario.nombre || usuario.username || usuario.email || `Usuario #${usuario.id}` }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Tiempo de Preparación (min)</label>
              <input 
                type="number" 
                v-model.number="form.tiempo_preparacion" 
                min="0"
                placeholder="0"
              />
            </div>
          </div>

          <!-- Switches -->
          <div class="form-row">
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
            <div class="form-group switch-group">
              <label>Es Combo</label>
              <div class="switch-container">
                <label class="switch">
                  <input type="checkbox" v-model="form.es_combo" />
                  <span class="slider"></span>
                </label>
                <span class="switch-label">
                  {{ form.es_combo ? 'Sí' : 'No' }}
                </span>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group switch-group">
              <label>Requiere Preparación</label>
              <div class="switch-container">
                <label class="switch">
                  <input type="checkbox" v-model="form.requiere_preparacion" />
                  <span class="slider"></span>
                </label>
                <span class="switch-label">
                  {{ form.requiere_preparacion ? 'Sí' : 'No' }}
                </span>
              </div>
            </div>
            <div class="form-group switch-group">
              <label>Visible en Web</label>
              <div class="switch-container">
                <label class="switch">
                  <input type="checkbox" v-model="form.visible_en_web" />
                  <span class="slider"></span>
                </label>
                <span class="switch-label">
                  {{ form.visible_en_web ? 'Sí' : 'No' }}
                </span>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group switch-group">
              <label>Visible en App</label>
              <div class="switch-container">
                <label class="switch">
                  <input type="checkbox" v-model="form.visible_en_app" />
                  <span class="slider"></span>
                </label>
                <span class="switch-label">
                  {{ form.visible_en_app ? 'Sí' : 'No' }}
                </span>
              </div>
            </div>
            <div class="form-group switch-group">
              <label>Destacado</label>
              <div class="switch-container">
                <label class="switch">
                  <input type="checkbox" v-model="form.destacado" />
                  <span class="slider"></span>
                </label>
                <span class="switch-label">
                  <i :class="form.destacado ? 'bi bi-star-fill text-warning' : 'bi bi-star text-muted'"></i>
                  {{ form.destacado ? 'Destacado' : 'No destacado' }}
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
import { ref, watch, onMounted } from 'vue'
import { ProductosAPI, CategoriasAPI, SedesAPI, UsuariosAPI } from '@/services/api'
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
  producto: {
    type: Object,
    default: null
  },
  categorias: {
    type: Array,
    default: () => []
  },
  sedes: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'save'])

// ============================================
// STATE
// ============================================
const guardando = ref(false)
const usuarios = ref([])
const cargandoUsuarios = ref(false)

const errors = ref({
  codigo: '',
  nombre: '',
  precio_venta: '',
  categoria_id: '',
  sede_id: ''
})

const form = ref({
  codigo: '',
  nombre: '',
  descripcion: '',
  categoria_id: '',
  sede_id: '',
  precio_compra: 0,
  precio_venta: 0,
  precio_mayorista: 0,
  precio_promocion: 0,
  stock_actual: 0,
  stock_minimo: 0,
  stock_maximo: 0,
  unidad_medida: '',
  peso: 0,
  volumen: 0,
  activo: true,
  es_combo: false,
  requiere_preparacion: false,
  tiempo_preparacion: 0,
  visible_en_web: true,
  visible_en_app: true,
  destacado: false,
  usuario_creacion: '',
  ingredientes: []
})

// ============================================
// MÉTODOS
// ============================================
const cargarUsuarios = async () => {
  cargandoUsuarios.value = true
  try {
    const response = await UsuariosAPI.list()
    if (response.data.success) {
      usuarios.value = response.data.data || []
    }
  } catch (error) {
    console.error('❌ Error al cargar usuarios:', error)
  } finally {
    cargandoUsuarios.value = false
  }
}

// ============================================
// WATCHERS
// ============================================
watch(() => props.show, (val) => {
  if (val) {
    if (props.editando && props.producto) {
      form.value = {
        id: props.producto.id,
        codigo: props.producto.codigo || '',
        nombre: props.producto.nombre || '',
        descripcion: props.producto.descripcion || '',
        categoria_id: props.producto.categoria_id || '',
        sede_id: props.producto.sede_id || '',
        precio_compra: props.producto.precio_compra || 0,
        precio_venta: props.producto.precio_venta || 0,
        precio_mayorista: props.producto.precio_mayorista || 0,
        precio_promocion: props.producto.precio_promocion || 0,
        stock_actual: props.producto.stock_actual || 0,
        stock_minimo: props.producto.stock_minimo || 0,
        stock_maximo: props.producto.stock_maximo || 0,
        unidad_medida: props.producto.unidad_medida || '',
        peso: props.producto.peso || 0,
        volumen: props.producto.volumen || 0,
        activo: props.producto.activo !== false,
        es_combo: props.producto.es_combo || false,
        requiere_preparacion: props.producto.requiere_preparacion || false,
        tiempo_preparacion: props.producto.tiempo_preparacion || 0,
        visible_en_web: props.producto.visible_en_web !== false,
        visible_en_app: props.producto.visible_en_app !== false,
        destacado: props.producto.destacado || false,
        usuario_creacion: props.producto.usuario_creacion || '',
        ingredientes: props.producto.ingredientes || []
      }
    } else {
      resetForm()
    }
    errors.value = { codigo: '', nombre: '', precio_venta: '', categoria_id: '', sede_id: '' }
  }
})

// ============================================
// MÉTODOS
// ============================================
const resetForm = () => {
  form.value = {
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria_id: '',
    sede_id: '',
    precio_compra: 0,
    precio_venta: 0,
    precio_mayorista: 0,
    precio_promocion: 0,
    stock_actual: 0,
    stock_minimo: 0,
    stock_maximo: 0,
    unidad_medida: '',
    peso: 0,
    volumen: 0,
    activo: true,
    es_combo: false,
    requiere_preparacion: false,
    tiempo_preparacion: 0,
    visible_en_web: true,
    visible_en_app: true,
    destacado: false,
    usuario_creacion: '',
    ingredientes: []
  }
}

const validarFormulario = () => {
  let isValid = true
  
  if (!form.value.codigo) {
    errors.value.codigo = 'El código es obligatorio'
    isValid = false
  } else {
    errors.value.codigo = ''
  }

  if (!form.value.nombre) {
    errors.value.nombre = 'El nombre es obligatorio'
    isValid = false
  } else {
    errors.value.nombre = ''
  }

  if (!form.value.precio_venta || form.value.precio_venta <= 0) {
    errors.value.precio_venta = 'El precio de venta debe ser mayor a 0'
    isValid = false
  } else {
    errors.value.precio_venta = ''
  }

  if (!form.value.categoria_id) {
    errors.value.categoria_id = 'Selecciona una categoría'
    isValid = false
  } else {
    errors.value.categoria_id = ''
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
      codigo: form.value.codigo,
      nombre: form.value.nombre,
      descripcion: form.value.descripcion || null,
      categoria_id: parseInt(form.value.categoria_id),
      sede_id: parseInt(form.value.sede_id),
      precio_compra: parseFloat(form.value.precio_compra) || 0,
      precio_venta: parseFloat(form.value.precio_venta),
      precio_mayorista: parseFloat(form.value.precio_mayorista) || 0,
      precio_promocion: parseFloat(form.value.precio_promocion) || 0,
      stock_actual: parseFloat(form.value.stock_actual) || 0,
      stock_minimo: parseFloat(form.value.stock_minimo) || 0,
      stock_maximo: parseFloat(form.value.stock_maximo) || 0,
      unidad_medida: form.value.unidad_medida || null,
      peso: parseFloat(form.value.peso) || 0,
      volumen: parseFloat(form.value.volumen) || 0,
      activo: form.value.activo,
      es_combo: form.value.es_combo,
      requiere_preparacion: form.value.requiere_preparacion,
      tiempo_preparacion: parseInt(form.value.tiempo_preparacion) || 0,
      visible_en_web: form.value.visible_en_web,
      visible_en_app: form.value.visible_en_app,
      usuario_creacion: form.value.usuario_creacion ? parseInt(form.value.usuario_creacion) : 0,
      ingredientes: form.value.ingredientes || []
    }

    console.log('📤 Enviando datos:', dataToSend)

    let response
    if (props.editando) {
      response = await ProductosAPI.update(form.value.id, dataToSend)
    } else {
      response = await ProductosAPI.create(dataToSend)
    }

    if (response.data.success) {
      Swal.fire({
        icon: 'success',
        title: props.editando ? 'Producto actualizado' : 'Producto creado',
        timer: 1500,
        showConfirmButton: false
      })
      emit('save')
      emit('close')
    }
  } catch (error) {
    console.error('❌ Error detallado:', error.response?.data)
    
    const errorsData = error.response?.data?.errors
    let errorMsg = error.response?.data?.message || 'Error al guardar el producto'
    
    if (errorsData) {
      const errorMessages = []
      Object.keys(errorsData).forEach(key => {
        if (Array.isArray(errorsData[key])) {
          errorMessages.push(`${key}: ${errorsData[key].join(', ')}`)
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
// LIFECYCLE
// ============================================
onMounted(() => {
  cargarUsuarios()
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
  min-height: 60px;
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

.text-warning {
  color: #f59e0b !important;
}

.text-muted {
  color: #6b7280 !important;
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
}
</style> 