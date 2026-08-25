<template>
  <div class="admin-form">
    <h2>{{ isEdit ? 'Editar Empresa' : 'Nueva Empresa' }}</h2>
    
    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <label>Nombre</label>
        <input v-model="form.nombre" type="text" required />
      </div>
      
      <div class="form-group">
        <label>RIF</label>
        <input v-model="form.rif" type="text" />
      </div>
      
      <div class="form-group">
        <label>Dirección</label>
        <input v-model="form.direccion" type="text" />
      </div>
      
      <div class="form-group">
        <label>Teléfono</label>
        <input v-model="form.telefono" type="text" />
      </div>
      
      <div class="form-group">
        <label>Email</label>
        <input v-model="form.email" type="email" />
      </div>
      
      <div class="form-group">
        <label>
          <input v-model="form.activo" type="checkbox" />
          Activo
        </label>
      </div>
      
      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Guardando...' : 'Guardar' }}
        </button>
        <router-link :to="{ name: 'empresas' }" class="btn btn-secondary">
          Cancelar
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { EmpresasAPI } from '@/services/api'

const route = useRoute()
const router = useRouter()
const loading = ref(false)

const isEdit = computed(() => !!route.params.id)
const form = ref({
  nombre: '',
  rif: '',
  direccion: '',
  telefono: '',
  email: '',
  activo: true
})

async function onSubmit() {
  loading.value = true
  try {
    if (isEdit.value) {
      await EmpresasAPI.update(route.params.id, form.value)
    } else {
      await EmpresasAPI.create(form.value)
    }
    router.push({ name: 'empresas' })
  } catch (error) {
    console.error('Error guardando empresa:', error)
    alert(error.response?.data?.message || 'Error al guardar la empresa')
  } finally {
    loading.value = false
  }
}

async function loadEmpresa() {
  if (isEdit.value) {
    try {
      const { data } = await EmpresasAPI.getById(route.params.id)
      form.value = data
    } catch (error) {
      console.error('Error cargando empresa:', error)
    }
  }
}

onMounted(loadEmpresa)
</script>

<style scoped>
.admin-form { max-width: 600px; margin: 0 auto; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; margin-bottom: 4px; font-weight: 500; }
.form-group input { width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; }
.form-actions { display: flex; gap: 12px; margin-top: 20px; }
.btn { padding: 10px 24px; border: none; border-radius: 4px; cursor: pointer; }
.btn-primary { background: #2F6FED; color: #fff; }
.btn-primary:disabled { opacity: 0.6; }
.btn-secondary { background: #e5e7eb; color: #374151; }
</style>