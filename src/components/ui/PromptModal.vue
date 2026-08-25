<template>
  <div v-if="ui.promptModal" class="modal-overlay" @click.self="ui.closePrompt()">
    <div class="modal-card">
      <h3>{{ ui.promptModal.label }}</h3>
      <div class="field-row">
        <input type="text" v-model="value" autofocus @keyup.enter="submit">
      </div>
      <div class="modal-actions">
        <button class="btn btn-ghost btn-sm" @click="ui.closePrompt()">Cancelar</button>
        <button class="btn btn-primary btn-sm" style="width:auto;margin-top:0;" @click="submit">Guardar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useUiStore } from '../../stores/ui'

const ui = useUiStore()
const value = ref('')

watch(() => ui.promptModal, (m) => { value.value = m?.defaultValue || '' })

function submit() {
  const cb = ui.promptModal?.onSubmit
  const v = value.value
  ui.closePrompt()
  cb && cb(v)
}
</script>
