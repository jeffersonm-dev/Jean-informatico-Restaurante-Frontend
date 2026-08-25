<template>
  <div class="panel-header">
    <div>
      <div class="panel-title">Configuración</div>
      <div class="panel-sub">Administra tu acceso al sistema.</div>
    </div>
  </div>

  <div class="card" style="max-width:480px;">
    <h3>Cambiar contraseña</h3>
    <div class="card-sub">Usa una contraseña segura y que solo tú conozcas.</div>
    <div class="field-row">
      <label>Contraseña actual</label>
      <input type="password" v-model="current" placeholder="••••••••">
    </div>
    <div class="field-row">
      <label>Nueva contraseña</label>
      <input type="password" v-model="next" placeholder="Mínimo 4 caracteres">
    </div>
    <button class="btn btn-primary" style="width:auto;" :disabled="loading" @click="submit">
      {{ loading ? 'Guardando…' : 'Actualizar contraseña' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUiStore } from '../stores/ui'
import { AuthAPI } from '../services/api'

const ui = useUiStore()
const current = ref('')
const next = ref('')
const loading = ref(false)

async function submit() {
  if (!current.value || !next.value || next.value.length < 4) {
    ui.showError('La nueva contraseña debe tener al menos 4 caracteres.')
    return
  }
  loading.value = true
  try {
    await AuthAPI.changePassword(current.value, next.value)
    current.value = ''
    next.value = ''
    ui.showToast('Contraseña actualizada correctamente.')
  } catch (e) {
    ui.showError(e?.response?.data?.message || 'No se pudo actualizar la contraseña.')
  } finally {
    loading.value = false
  }
}
</script>
