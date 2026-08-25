<template>
  <div class="card">
    <h3>Archivo del reporte</h3>
    <div class="card-sub">Sube el Excel con el detalle financiero del período (.xlsx, .xls, .csv — máx. {{ maxMb }}MB).</div>

    <div v-if="!file" class="dropzone" :class="{ drag: dragging }"
         @click="!locked && $refs.input.click()"
         @dragover.prevent="dragging = true"
         @dragleave.prevent="dragging = false"
         @drop.prevent="onDrop">
      <Icon name="upload" :size="30" />
      <div class="dz-title">{{ locked ? 'No se puede modificar (reporte validado)' : 'Arrastra tu archivo aquí' }}</div>
      <div class="dz-sub" v-if="!locked">o haz clic para seleccionarlo desde tu equipo</div>
    </div>

    <div v-else class="file-card">
      <div class="file-icon">XLS</div>
      <div class="file-info">
        <div class="file-name">{{ file.nombre || file.name }}</div>
        <div class="file-meta">{{ fmtBytes(file.tamano || file.size) }} · {{ fmtDate(file.subidoEn) }}</div>
      </div>
      <div class="file-actions">
        <button v-if="downloadUrl" class="btn btn-ghost btn-sm" @click="download">
          <Icon name="download" :size="14" /> Descargar
        </button>
        <button v-if="!locked" class="btn btn-ghost btn-sm" @click="$refs.input.click()">Reemplazar</button>
        <button v-if="!locked" class="btn btn-red btn-sm" @click="$emit('remove')">Quitar</button>
      </div>
    </div>

    <input ref="input" type="file" accept=".xlsx,.xls,.xlsm,.csv" class="hidden" @change="onPick">
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Icon from './Icon.vue'

const props = defineProps({
  file: { type: Object, default: null },
  locked: { type: Boolean, default: false },
  maxMb: { type: Number, default: 8 },
  downloadUrl: { type: String, default: '' }
})
const emit = defineEmits(['select', 'remove'])

const dragging = ref(false)

function validateAndEmit(f) {
  if (!f) return
  if (f.size > props.maxMb * 1024 * 1024) {
    alert(`El archivo supera el límite de ${props.maxMb}MB.`)
    return
  }
  emit('select', f)
}

function onPick(e) {
  const f = e.target.files?.[0]
  validateAndEmit(f)
  e.target.value = ''
}

function onDrop(e) {
  dragging.value = false
  const f = e.dataTransfer.files?.[0]
  validateAndEmit(f)
}

function download() {
  window.open(props.downloadUrl, '_blank')
}

function fmtBytes(b) {
  if (!b) return '0 B'
  if (b < 1024) return b + ' B'
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB'
  return (b / (1024 * 1024)).toFixed(2) + ' MB'
}
function fmtDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleString('es-VE')
}
</script>
