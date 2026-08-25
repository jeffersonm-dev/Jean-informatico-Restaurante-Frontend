<!-- src/views/restaurante/ReporteView.vue -->
<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">
        <i class="bi bi-file-earmark-text"></i>
        Reporte
      </h1>
      <div class="page-actions">
        <button class="btn btn-primary" @click="nuevoReporte">
          <i class="bi bi-plus-circle"></i>
          Nuevo Reporte
        </button>
        <button class="btn btn-outline-secondary" @click="exportarReporte">
          <i class="bi bi-download"></i>
          Exportar
        </button>
      </div>
    </div>

    <div class="page-content">
      <div class="card">
        <div class="card-body">
          <div class="alert alert-info">
            <i class="bi bi-info-circle"></i>
            Aquí se mostrará el contenido del reporte
          </div>
          
          <!-- Contenido del reporte -->
          <div class="reporte-content">
            <p class="text-muted">Selecciona un período para ver el reporte...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const nuevoReporte = () => {
  console.log('Crear nuevo reporte')
}

const exportarReporte = () => {
  console.log('Exportar reporte')
}
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

.btn-primary {
  background: #E85D3A;
  border: none;
  color: #fff;
  padding: 8px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-primary:hover {
  background: #c94f2e;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(232, 93, 58, 0.3);
}

.btn-outline-secondary {
  background: transparent;
  border: 1px solid #d1d5db;
  color: #6b7280;
  padding: 8px 20px;
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

.alert-info i {
  font-size: 18px;
}

.reporte-content {
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reporte-content p {
  margin: 0;
  color: #9ca3af;
  font-size: 14px;
}
</style>