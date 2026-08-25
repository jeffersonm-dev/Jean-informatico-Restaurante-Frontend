<template>
  <div class="kpi-card">
    <div class="top-row">
      <span class="label">{{ label }}</span>
      <span class="icon-badge" :class="color"><Icon :name="icon" :size="16" /></span>
    </div>
    <div class="value">{{ value }}</div>
  </div>
</template>

<script setup>
import Icon from './Icon.vue'

defineProps({
  label: String,
  value: [String, Number],
  icon: { type: String, default: 'chart' },
  color: { type: String, default: 'blue' }
})
</script>
