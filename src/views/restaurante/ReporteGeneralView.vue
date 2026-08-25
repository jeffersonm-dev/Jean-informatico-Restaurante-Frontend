<!-- src/views/restaurante/ReporteGeneralView.vue -->
<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">
        <i class="bi bi-bar-chart"></i>
        Reporte General
      </h1>
      <div class="page-actions">
        <button class="btn btn-primary" @click="generarReporte">
          <i class="bi bi-file-earmark-pdf"></i>
          Generar PDF
        </button>
      </div>
    </div>

    <div class="page-content">
      <div class="card">
        <div class="card-body">
          <div class="alert alert-info">
            <i class="bi bi-info-circle"></i>
            Reporte consolidado de todas las sedes
          </div>
          
          <div class="reporte-content">
            <p class="text-muted">Aquí se mostrará el reporte general...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const generarReporte = () => {
  console.log('Generar reporte PDF')
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
  padding: 40px;
  background: #f9fafb;
  border-radius: 8px;
  min-height: 300px;
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