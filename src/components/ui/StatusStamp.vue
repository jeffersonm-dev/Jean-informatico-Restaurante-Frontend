<template>
  <span class="stamp-mark" :class="status">{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ status: { type: String, default: 'borrador' } })

const label = computed(() => ({
  borrador: 'Borrador',
  cargado: 'Cargado',
  validado: 'Validado'
}[props.status] || props.status))
</script>
