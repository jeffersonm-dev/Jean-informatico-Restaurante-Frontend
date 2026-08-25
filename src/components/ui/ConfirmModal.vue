<template>
  <div v-if="ui.confirmModal" class="modal-overlay" @click.self="ui.closeConfirm()">
    <div class="modal-card">
      <h3>Confirmar acción</h3>
      <p style="color:var(--text-dim);font-size:13.5px;line-height:1.5;">{{ ui.confirmModal.message }}</p>
      <div class="modal-actions">
        <button class="btn btn-ghost btn-sm" @click="ui.closeConfirm()">Cancelar</button>
        <button class="btn btn-red btn-sm" @click="confirm">Confirmar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUiStore } from '../../stores/ui'
const ui = useUiStore()

function confirm() {
  const cb = ui.confirmModal?.onConfirm
  ui.closeConfirm()
  cb && cb()
}
</script>
