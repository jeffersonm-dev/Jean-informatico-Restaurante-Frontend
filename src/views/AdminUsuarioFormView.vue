<template>
  <div class="admin-form">
    <h2>{{ isEdit ? 'Editar Usuario' : 'Nuevo Usuario' }}</h2>
    
    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <label>Nombre de usuario *</label>
        <input v-model="form.username" type="text" required />
      </div>
      
      <div class="form-group">
        <label>Nombre *</label>
        <input v-model="form.nombre" type="text" required />
      </div>
      
      <div class="form-group">
        <label>Apellido</label>
        <input v-model="form.apellido" type="text" />
      </div>
      
      <div v-if="!isEdit" class="form-group">
        <label>Contraseña *</label>
        <input v-model="form.password" type="password" required minlength="6" />
      </div>
      
      <div class="form-group">
        <label>Email</label>
        <input v-model="form.email" type="email" />
      </div>
      
      <div class="form-group">
        <label>Teléfono</label>
        <input v-model="form.telefono" type="text" />
      </div>
      
      <div class="form-group">
        <label>Rol *</label>
        <select v-model="form.rol_id" required>
          <option v-for="rol in roles" :key="rol.id" :value="rol.id">
            {{ rol.nombre }}
          </option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Empresa</label>
        <select v-model="form.empresa_id">
          <option value="">Sin empresa</option>
          <option v-for="emp in empresas" :key="emp.id" :value="emp.id">
            {{ emp.nombre }}
          </option>
        </select>
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
        <router-link :to="{ name: 'usuarios' }" class="btn btn-secondary">
          Cancelar
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { UsuariosAPI, RolesAPI, EmpresasAPI } from '@/services/api'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const roles = ref([])
const empresas = ref([])

const isEdit = computed(() => !!route.params.id)
const form = ref({
  username: '',
  password: '',
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  rol_id: null,
  empresa_id: '',
  activo: true
})

async function loadData() {
  try {
    const [rolesRes, empresasRes] = await Promise.all([
      RolesAPI.list(),
      EmpresasAPI.list()
    ])
    roles.value = rolesRes.data || []
    empresas.value = empresasRes.data || []
  } catch (error) {
    console.error('Error cargando datos:', error)
  }
}

async function onSubmit() {
  loading.value = true
  try {
    if (isEdit.value) {
      await UsuariosAPI.update(route.params.id, form.value)
    } else {
      await UsuariosAPI.create(form.value)
    }
    router.push({ name: 'usuarios' })
  } catch (error) {
    console.error('Error guardando usuario:', error)
    alert(error.response?.data?.message || 'Error al guardar el usuario')
  } finally {
    loading.value = false
  }
}

async function loadUsuario() {
  if (isEdit.value) {
    try {
      const { data } = await UsuariosAPI.getById(route.params.id)
      form.value = { ...form.value, ...data }
    } catch (error) {
      console.error('Error cargando usuario:', error)
    }
  }
}

onMounted(async () => {
  await loadData()
  await loadUsuario()
})
</script>

<style scoped>
.admin-form { max-width: 600px; margin: 0 auto; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; margin-bottom: 4px; font-weight: 500; }
.form-group input, .form-group select { 
  width: 100%; 
  padding: 8px 12px; 
  border: 1px solid #ddd; 
  border-radius: 4px;
  background: #fff;
}
.form-actions { display: flex; gap: 12px; margin-top: 20px; }
.btn { padding: 10px 24px; border: none; border-radius: 4px; cursor: pointer; }
.btn-primary { background: #2F6FED; color: #fff; }
.btn-primary:disabled { opacity: 0.6; }
.btn-secondary { background: #e5e7eb; color: #374151; }
</style>