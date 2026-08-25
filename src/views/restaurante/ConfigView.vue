<!-- src/views/restaurante/ConfigView.vue -->
<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">
        <i class="bi bi-gear"></i>
        Configuración
      </h1>
    </div>

    <div class="page-content">
      <div class="row g-4">
        <!-- Perfil -->
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title">
                <i class="bi bi-person-circle"></i>
                Mi Perfil
              </h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <label class="form-label">Nombre</label>
                <input type="text" class="form-control" :value="userName" disabled />
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" :value="userEmail" disabled />
              </div>
              <div class="mb-3">
                <label class="form-label">Rol</label>
                <input type="text" class="form-control" :value="userRole" disabled />
              </div>
              <button class="btn btn-primary" @click="editarPerfil">
                <i class="bi bi-pencil"></i>
                Editar Perfil
              </button>
            </div>
          </div>
        </div>

        <!-- Seguridad -->
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title">
                <i class="bi bi-shield-lock"></i>
                Seguridad
              </h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <label class="form-label">Contraseña actual</label>
                <input type="password" class="form-control" v-model="currentPassword" />
              </div>
              <div class="mb-3">
                <label class="form-label">Nueva contraseña</label>
                <input type="password" class="form-control" v-model="newPassword" />
              </div>
              <div class="mb-3">
                <label class="form-label">Confirmar contraseña</label>
                <input type="password" class="form-control" v-model="confirmPassword" />
              </div>
              <button class="btn btn-warning" @click="cambiarPassword">
                <i class="bi bi-key"></i>
                Cambiar Contraseña
              </button>
            </div>
          </div>
        </div>

        <!-- Preferencias -->
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title">
                <i class="bi bi-sliders2"></i>
                Preferencias
              </h5>
            </div>
            <div class="card-body">
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="notificaciones" v-model="notificaciones" />
                <label class="form-check-label" for="notificaciones">
                  Recibir notificaciones por email
                </label>
              </div>
              <div class="form-check form-switch mt-2">
                <input class="form-check-input" type="checkbox" id="whatsapp" v-model="notificacionesWhatsapp" />
                <label class="form-check-label" for="whatsapp">
                  Recibir notificaciones por WhatsApp
                </label>
              </div>
              <div class="form-check form-switch mt-2">
                <input class="form-check-input" type="checkbox" id="tema" v-model="temaOscuro" />
                <label class="form-check-label" for="tema">
                  Tema oscuro
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import Swal from 'sweetalert2'

const auth = useAuthStore()

// Datos del usuario
const userName = computed(() => auth.user?.nombre || auth.user?.email || 'Usuario')
const userEmail = computed(() => auth.user?.email || '')
const userRole = computed(() => auth.user?.rol_nombre || '')

// Formulario de contraseña
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// Preferencias
const notificaciones = ref(true)
const notificacionesWhatsapp = ref(false)
const temaOscuro = ref(false)

// Métodos
const editarPerfil = () => {
  Swal.fire({
    icon: 'info',
    title: 'Editar Perfil',
    text: 'Función en desarrollo',
    confirmButtonColor: '#E85D3A'
  })
}

const cambiarPassword = async () => {
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    await Swal.fire({
      icon: 'warning',
      title: 'Campos requeridos',
      text: 'Por favor, completa todos los campos',
      confirmButtonColor: '#E85D3A'
    })
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Las contraseñas no coinciden',
      confirmButtonColor: '#E85D3A'
    })
    return
  }

  try {
    await auth.changePassword(currentPassword.value, newPassword.value)
    await Swal.fire({
      icon: 'success',
      title: 'Contraseña actualizada',
      text: 'Tu contraseña se ha actualizado correctamente',
      confirmButtonColor: '#E85D3A'
    })
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Error al cambiar la contraseña',
      confirmButtonColor: '#E85D3A'
    })
  }
}
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #2d1810;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-title i {
  color: #E85D3A;
}

.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.card-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  background: #fafafa;
}

.card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-title i {
  color: #E85D3A;
}

.card-body {
  padding: 20px;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.form-control {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  width: 100%;
}

.form-control:disabled {
  background: #f3f4f6;
  color: #6b7280;
}

.btn {
  padding: 8px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-primary {
  background: #E85D3A;
  color: #fff;
}

.btn-primary:hover {
  background: #c94f2e;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(232, 93, 58, 0.3);
}

.btn-warning {
  background: #f59e0b;
  color: #fff;
}

.btn-warning:hover {
  background: #d97706;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.form-check {
  padding-left: 2.5rem;
}

.form-check-input {
  width: 40px;
  height: 20px;
  margin-left: -2.5rem;
  cursor: pointer;
}

.form-check-input:checked {
  background-color: #E85D3A;
  border-color: #E85D3A;
}

.form-check-label {
  font-size: 14px;
  color: #374151;
  cursor: pointer;
}
</style>