<!-- src/views/restaurante/Producto/ProductoFormView.vue -->
<template>
  <div class="form-container">
    <div class="form-header">
      <div class="header-left">
        <router-link :to="{ name: 'productos' }" class="btn-back">
          <i class="bi bi-arrow-left"></i>
          Volver
        </router-link>
        <h1>{{ isEditando ? 'Editar Producto' : 'Nuevo Producto' }}</h1>
      </div>
    </div>

    <div class="form-card">
      <form @submit.prevent="guardar">
        <div class="form-row">
          <div class="form-group">
            <label>Nombre *</label>
            <input 
              type="text" 
              v-model="form.nombre" 
              required 
              placeholder="Ej: Café Americano"
            />
          </div>
          <div class="form-group">
            <label>Precio *</label>
            <input 
              type="number" 
              v-model.number="form.precio" 
              required 
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>
        </div>

        <div class="form-group">
          <label>Descripción</label>
          <textarea 
            v-model="form.descripcion" 
            rows="3"
            placeholder="Describe el producto..."
          ></textarea>
        </div>

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
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Stock</label>
            <input 
              type="number" 
              v-model.number="form.stock" 
              min="0"
              placeholder="0"
            />
          </div>
          <div class="form-group">
            <label>Precio Oferta</label>
            <input 
              type="number" 
              v-model.number="form.precio_oferta" 
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="cancelar">
            Cancelar
          </button>
          <button type="submit" class="btn-primary" :disabled="guardando">
            <i v-if="guardando" class="bi bi-spinner bi-spin"></i>
            {{ guardando ? 'Guardando...' : 'Guardar Producto' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ProductosAPI, CategoriasAPI, SedesAPI } from '@/services/api'
import Swal from 'sweetalert2'

const router = useRouter()
const route = useRoute()

const guardando = ref(false)
const isEditando = ref(false)
const categorias = ref([])
const sedes = ref([])

const form = ref({
  nombre: '',
  descripcion: '',
  precio: 0,
  precio_oferta: null,
  stock: 0,
  categoria_id: '',
  sede_id: '',
  activo: true,
  destacado: false
})

const cargarCategorias = async () => {
  try {
    const response = await CategoriasAPI.list()
    if (response.data.success) {
      categorias.value = response.data.data || []
    }
  } catch (error) {
    console.error('Error cargando categorías:', error)
  }
}

const cargarSedes = async () => {
  try {
    const response = await SedesAPI.list()
    if (response.data.success) {
      sedes.value = response.data.data || []
    }
  } catch (error) {
    console.error('Error cargando sedes:', error)
  }
}

const cargarProducto = async (id) => {
  try {
    const response = await ProductosAPI.get(id)
    if (response.data.success) {
      const producto = response.data.data
      form.value = {
        id: producto.id,
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        precio: producto.precio || 0,
        precio_oferta: producto.precio_oferta || null,
        stock: producto.stock || 0,
        categoria_id: producto.categoria_id || '',
        sede_id: producto.sede_id || '',
        activo: producto.activo !== false,
        destacado: producto.destacado || false
      }
    }
  } catch (error) {
    console.error('Error cargando producto:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo cargar el producto'
    })
  }
}

const cancelar = () => {
  router.push({ name: 'productos' })
}

const guardar = async () => {
  guardando.value = true
  try {
    const dataToSend = {
      nombre: form.value.nombre,
      descripcion: form.value.descripcion || null,
      precio: form.value.precio,
      precio_oferta: form.value.precio_oferta || null,
      stock: form.value.stock || 0,
      categoria_id: form.value.categoria_id,
      sede_id: form.value.sede_id,
      activo: form.value.activo,
      destacado: form.value.destacado
    }

    let response
    if (isEditando.value) {
      response = await ProductosAPI.update(form.value.id, dataToSend)
    } else {
      response = await ProductosAPI.create(dataToSend)
    }

    if (response.data.success) {
      Swal.fire({
        icon: 'success',
        title: isEditando.value ? 'Producto actualizado' : 'Producto creado',
        timer: 1500,
        showConfirmButton: false
      })
      router.push({ name: 'productos' })
    }
  } catch (error) {
    console.error('Error:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Error al guardar el producto'
    })
  } finally {
    guardando.value = false
  }
}

onMounted(async () => {
  await cargarCategorias()
  await cargarSedes()
  
  const id = route.params.id
  if (id) {
    isEditando.value = true
    await cargarProducto(id)
  }
})
</script>

<style scoped>
.form-container {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: #ffffff;
  padding: 20px 24px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s;
}

.btn-back:hover {
  background: #f3f4f6;
  color: #374151;
}

.form-header h1 {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.form-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 24px;
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
  min-height: 80px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.btn-primary {
  background: #E85D3A;
  border: none;
  color: #fff;
  padding: 10px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
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
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>