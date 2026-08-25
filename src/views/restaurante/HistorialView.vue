<!-- src/views/restaurante/HistorialView.vue -->
<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">
        <i class="bi bi-clock-history"></i>
        Historial
      </h1>
      <div class="page-actions">
        <button class="btn btn-outline-secondary" @click="recargar">
          <i class="bi bi-arrow-clockwise"></i>
          Recargar
        </button>
      </div>
    </div>

    <div class="page-content">
      <div class="card">
        <div class="card-body">
          <div class="alert alert-info">
            <i class="bi bi-info-circle"></i>
            Historial de reportes y actividades
          </div>
          
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Reporte</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="cargando">
                  <td colspan="5" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                      <span class="visually-hidden">Cargando...</span>
                    </div>
                  </td>
                </tr>
                <tr v-else-if="items.length === 0">
                  <td colspan="5" class="text-center py-4 text-muted">
                    <i class="bi bi-inbox fs-2 d-block"></i>
                    No hay registros en el historial
                  </td>
                </tr>
                <tr v-for="item in items" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>{{ formatFecha(item.fecha) }}</td>
                  <td>{{ item.reporte || 'Reporte' }}</td>
                  <td>
                    <span class="badge" :class="item.estado === 'completado' ? 'bg-success' : 'bg-warning'">
                      {{ item.estado || 'Pendiente' }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary" @click="verDetalle(item.id)">
                      <i class="bi bi-eye"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const cargando = ref(false)
const items = ref([])

const cargarHistorial = async () => {
  cargando.value = true
  try {
    // Aquí va la llamada a la API
    items.value = []
  } catch (error) {
    console.error('Error al cargar historial:', error)
  } finally {
    cargando.value = false
  }
}

const recargar = () => {
  cargarHistorial()
}

const verDetalle = (id) => {
  console.log('Ver detalle:', id)
}

const formatFecha = (fecha) => {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString('es-VE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  cargarHistorial()
})
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
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

.page-actions {
  display: flex;
  gap: 8px;
}

.btn-outline-secondary {
  background: transparent;
  border: 1px solid #d1d5db;
  color: #6b7280;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-outline-secondary:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.card-body {
  padding: 24px;
}

.alert-info {
  background: #eff6ff;
  border-left: 4px solid #3b82f6;
  padding: 12px 16px;
  border-radius: 8px;
  color: #1e40af;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
}

.bg-success {
  background: #10b981 !important;
  color: #fff;
}

.bg-warning {
  background: #f59e0b !important;
  color: #fff;
}

.table {
  margin-bottom: 0;
}

.table th {
  font-weight: 600;
  color: #6b7280;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e5e7eb;
}

.btn-sm {
  padding: 2px 8px;
  font-size: 12px;
}

.btn-outline-primary {
  border: 1px solid #E85D3A;
  color: #E85D3A;
  background: transparent;
}

.btn-outline-primary:hover {
  background: #E85D3A;
  color: #fff;
}
</style>