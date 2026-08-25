<template>
  <div class="toast" :class="[ui.toast.type, { show: ui.toast.show }]">
    <div class="toast-icon">{{ iconChar }}</div>
    <span>{{ ui.toast.msg }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUiStore } from '../../stores/ui'

const ui = useUiStore()
const iconChar = computed(() => {
  if (ui.toast.type === 'err') return '!'
  if (ui.toast.type === 'info') return 'i'
  return '✓'
})
</script>
