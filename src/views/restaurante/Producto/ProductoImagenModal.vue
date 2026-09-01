<!-- src/views/restaurante/Producto/ProductoImagenModal.vue -->
<template>
  <div class="modal-overlay" v-if="show" @click.self="close">
    <div class="modal-box">
      <div class="modal-header">
        <h5 class="modal-title">
          <i class="bi bi-image"></i>
          Subir Imagen - {{ producto?.nombre || 'Producto' }}
        </h5>
        <button type="button" class="btn-close" @click="close">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="modal-body">
        <!-- Vista previa de la imagen -->
        <div class="image-preview-container">
          <div 
            class="image-preview"
            :class="{ 'has-image': previewImage }"
            @dragover.prevent
            @drop.prevent="handleDrop"
            @click="abrirSelectorArchivos"
          >
            <img 
              v-if="previewImage" 
              :src="previewImage" 
              alt="Vista previa"
              class="preview-image"
            />
            <div v-else class="preview-placeholder">
              <i class="bi bi-cloud-upload"></i>
              <p>Arrastra y suelta una imagen aquí</p>
              <span>o haz clic para seleccionar</span>
              <span class="formats-hint">Formatos: JPG, PNG, GIF, WEBP</span>
            </div>
          </div>
          
          <input 
            type="file" 
            ref="fileInput"
            accept="image/*"
            class="file-input"
            @change="handleFileSelect"
          />
        </div>

        <!-- Información del archivo -->
        <div v-if="archivoSeleccionado" class="file-info">
          <i class="bi bi-file-image"></i>
          <span>{{ archivoSeleccionado.name }}</span>
          <span class="file-size">{{ formatearBytes(archivoSeleccionado.size) }}</span>
          <button type="button" class="btn-remove-file" @click="eliminarArchivo">
            <i class="bi bi-x-circle"></i>
          </button>
        </div>

        <!-- Campos del formulario -->
        <div class="form-row">
          <div class="form-group">
            <label>¿Es imagen principal?</label>
            <div class="switch-container">
              <label class="switch">
                <input type="checkbox" v-model="form.es_principal" />
                <span class="slider"></span>
              </label>
              <span class="switch-label">
                {{ form.es_principal ? 'Principal' : 'Secundaria' }}
              </span>
            </div>
          </div>
          <div class="form-group">
            <label>Orden</label>
            <input 
              type="number" 
              v-model.number="form.orden" 
              min="0"
              placeholder="0"
            />
          </div>
        </div>

        <div class="form-group">
          <label>Descripción de la imagen</label>
          <input 
            type="text" 
            v-model="form.descripcion" 
            placeholder="Ej: Foto principal del producto"
          />
        </div>

        <div v-if="archivoSeleccionado" class="form-row">
          <div class="form-group">
            <label>Formato</label>
            <input 
              type="text" 
              :value="form.formato || 'N/A'"
              disabled
            />
          </div>
          <div class="form-group">
            <label>Tamaño</label>
            <input 
              type="text" 
              :value="form.tamano_bytes ? formatearBytes(form.tamano_bytes) : '0 bytes'"
              disabled
            />
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn-secondary" @click="close">Cancelar</button>
        <button 
          type="button" 
          class="btn-primary" 
          @click="subirImagen" 
          :disabled="subiendo || !archivoSeleccionado"
        >
          <i v-if="subiendo" class="bi bi-spinner bi-spin"></i>
          <i v-else class="bi bi-upload"></i>
          {{ subiendo ? 'Subiendo...' : 'Subir Imagen' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ImagenProductoAPI } from '@/services/api'
import Swal from 'sweetalert2'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  producto: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

// ============================================
// STATE
// ============================================
const subiendo = ref(false)
const fileInput = ref(null)
const archivoSeleccionado = ref(null)
const previewImage = ref('')

const form = ref({
  producto_id: 0,
  es_principal: false,
  orden: 0,
  descripcion: '',
  tamano_bytes: 0,
  formato: '',
  usuario_subida: 1 // Cambia esto por el ID del usuario logueado
})

// ============================================
// WATCHERS
// ============================================
watch(() => props.show, (val) => {
  if (val && props.producto) {
    form.value.producto_id = props.producto.id
    form.value.es_principal = false
    form.value.orden = 0
    form.value.descripcion = `Imagen de ${props.producto.nombre || 'producto'}`
    form.value.tamano_bytes = 0
    form.value.formato = ''
    archivoSeleccionado.value = null
    previewImage.value = ''
  }
})

// ============================================
// MÉTODOS
// ============================================
const abrirSelectorArchivos = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    procesarArchivo(file)
  }
}

const handleDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file) {
    procesarArchivo(file)
  }
}

const procesarArchivo = (file) => {
  // Validar tipo de archivo
  if (!file.type.startsWith('image/')) {
    Swal.fire({
      icon: 'error',
      title: 'Archivo no válido',
      text: 'Por favor, selecciona una imagen (jpg, png, gif, webp, etc.)'
    })
    return
  }

  // Validar tamaño (máximo 5MB)
  if (file.size > 5 * 1024 * 1024) {
    Swal.fire({
      icon: 'error',
      title: 'Archivo demasiado grande',
      text: 'La imagen no debe superar los 5MB'
    })
    return
  }

  archivoSeleccionado.value = file
  
  // Crear vista previa
  const reader = new FileReader()
  reader.onload = (e) => {
    previewImage.value = e.target.result
  }
  reader.readAsDataURL(file)

  // Actualizar campos
  form.value.tamano_bytes = file.size
  form.value.formato = file.type.split('/')[1] || ''

  if (!form.value.descripcion || form.value.descripcion === '') {
    form.value.descripcion = `Imagen de ${props.producto?.nombre || 'producto'}`
  }
}

const eliminarArchivo = () => {
  archivoSeleccionado.value = null
  previewImage.value = ''
  form.value.tamano_bytes = 0
  form.value.formato = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatearBytes = (bytes) => {
  if (bytes === 0) return '0 bytes'
  const k = 1024
  const sizes = ['bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const subirImagen = async () => {
  if (!archivoSeleccionado.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Selecciona una imagen',
      text: 'Por favor, selecciona una imagen para subir.'
    })
    return
  }

  subiendo.value = true
  try {
    console.log('📤 Subiendo imagen como archivo:', {
      producto_id: form.value.producto_id,
      nombre: archivoSeleccionado.value.name,
      tamaño: archivoSeleccionado.value.size,
      tipo: archivoSeleccionado.value.type,
      es_principal: form.value.es_principal
    })

    // ✅ Usar el método uploadFile que envía multipart/form-data
    const response = await ImagenProductoAPI.uploadFile(
      form.value.producto_id,
      archivoSeleccionado.value,
      form.value.es_principal,
      form.value.descripcion,
      form.value.usuario_subida
    )

    if (response.data.success) {
      Swal.fire({
        icon: 'success',
        title: '✅ Imagen subida exitosamente',
        timer: 1500,
        showConfirmButton: false
      })
      emit('save')
      emit('close')
    }
  } catch (error) {
    console.error('❌ Error al subir imagen:', error)
    console.error('Detalle:', error.response?.data)
    
    let errorMsg = error.response?.data?.message || 'Ocurrió un error al subir la imagen'
    
    if (error.response?.data?.errors) {
      const errorsData = error.response.data.errors
      const messages = []
      Object.keys(errorsData).forEach(key => {
        if (Array.isArray(errorsData[key])) {
          messages.push(...errorsData[key])
        } else {
          messages.push(`${key}: ${errorsData[key]}`)
        }
      })
      if (messages.length > 0) {
        errorMsg = messages.join('\n')
      }
    }
    
    Swal.fire({
      icon: 'error',
      title: '❌ Error al subir la imagen',
      text: errorMsg,
      confirmButtonColor: '#E85D3A'
    })
  } finally {
    subiendo.value = false
  }
}

const close = () => {
  emit('close')
}
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
  max-width: 600px;
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

/* ============================================
   IMAGE PREVIEW
   ============================================ */
.image-preview-container {
  margin-bottom: 20px;
}

.image-preview {
  width: 100%;
  height: 250px;
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  background: #fafafa;
  position: relative;
}

.image-preview:hover {
  border-color: #E85D3A;
  background: #fef2ed;
}

.image-preview.has-image {
  border-color: #10b981;
  background: #ecfdf5;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.preview-placeholder {
  text-align: center;
  color: #9ca3af;
}

.preview-placeholder i {
  font-size: 48px;
  color: #d1d5db;
}

.preview-placeholder p {
  margin: 8px 0 4px;
  font-weight: 500;
}

.preview-placeholder span {
  font-size: 13px;
}

.preview-placeholder .formats-hint {
  display: block;
  font-size: 11px;
  color: #9ca3af;
  margin-top: 4px;
}

.file-input {
  display: none;
}

/* ============================================
   FILE INFO
   ============================================ */
.file-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 8px;
  margin-bottom: 16px;
}

.file-info i {
  color: #22c55e;
  font-size: 20px;
}

.file-info span {
  font-size: 14px;
  color: #1a1a2e;
}

.file-info .file-size {
  color: #6b7280;
  font-size: 12px;
  margin-left: auto;
}

.btn-remove-file {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 18px;
  padding: 0 4px;
  transition: color 0.2s;
}

.btn-remove-file:hover {
  color: #dc2626;
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
.form-group select {
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
.form-group select:focus {
  border-color: #E85D3A;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(232, 93, 58, 0.08);
}

.form-group input:disabled {
  background: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
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

  .image-preview {
    height: 180px;
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