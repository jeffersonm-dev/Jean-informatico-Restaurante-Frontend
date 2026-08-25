<template>
  <div class="admin-logs">
    <h2>Bitácora de Actividad</h2>
    
    <div class="filters">
      <input v-model="filters.usuario_id" placeholder="Filtrar por usuario" />
      <input v-model="filters.accion" placeholder="Filtrar por acción" />
      <button class="btn btn-primary" @click="loadLogs">Buscar</button>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Rol</th>
          <th>Acción</th>
          <th>Detalle</th>
          <th>Empresa</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="log in logs" :key="log.id">
          <td>{{ log.usuario_nombre }}</td>
          <td>{{ log.usuario_rol }}</td>
          <td><span class="badge">{{ log.accion }}</span></td>
          <td>{{ log.detalle || '-' }}</td>
          <td>{{ log.empresa_nombre || '-' }}</td>
          <td>{{ formatDate(log.created_at) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { LogsAPI } from '@/services/api'

const logs = ref([])
const filters = ref({ usuario_id: '', accion: '' })

function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleString('es-VE')
}

async function loadLogs() {
  try {
    const params = new URLSearchParams()
    if (filters.value.usuario_id) params.append('usuario_id', filters.value.usuario_id)
    if (filters.value.accion) params.append('accion', filters.value.accion)
    params.append('limite', '50')
    
    const { data } = await LogsAPI.list(params)
    logs.value = data.dataList || []
  } catch (error) {
    console.error('Error cargando logs:', error)
  }
}

onMounted(loadLogs)
</script>

<style scoped>
.admin-logs { padding: 20px; }
.filters { display: flex; gap: 12px; margin: 16px 0; }
.filters input { 
  padding: 8px 12px; 
  border: 1px solid #ddd; 
  border-radius: 4px; 
  flex: 1;
}
.table { width: 100%; border-collapse: collapse; }
.table th, .table td { padding: 10px; border: 1px solid #e5e7eb; text-align: left; }
.table th { background: #f9fafb; font-weight: 600; }
.badge { 
  background: #dbeafe; 
  color: #1e40af; 
  padding: 2px 10px; 
  border-radius: 12px; 
  font-size: 12px; 
}
.btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
.btn-primary { background: #2F6FED; color: #fff; }
</style>