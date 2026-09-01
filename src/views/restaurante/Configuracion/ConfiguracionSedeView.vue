<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-left">
        <div class="header-title">
          <i class="bi bi-gear"></i>
          <div>
            <h1>Configuración de Sede</h1>
            <p class="text-muted">Gestiona la configuración de las sedes</p>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn btn-outline-secondary" @click="loadData">
          <i class="bi bi-arrow-clockwise" :class="{ spin: loading }"></i>
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner"></div>
      <p class="text-muted mt-2">Cargando configuración...</p>
    </div>

    <div v-else class="config-grid">
      <div class="config-card" v-for="sede in sedes" :key="sede.id">
        <div class="config-header">
          <h3><i class="bi bi-building"></i> {{ sede.nombre }}</h3>
          <span class="badge" :class="sede.activo ? 'badge-success' : 'badge-danger'">
            {{ sede.activo ? 'Activa' : 'Inactiva' }}
          </span>
        </div>
        <div class="config-body">
          <div class="config-item">
            <span class="config-label">Dirección:</span>
            <span class="config-value">{{ sede.direccion || 'No especificada' }}</span>
          </div>
          <div class="config-item">
            <span class="config-label">Teléfono:</span>
            <span class="config-value">{{ sede.telefono || 'No especificado' }}</span>
          </div>
          <div class="config-item">
            <span class="config-label">Email:</span>
            <span class="config-value">{{ sede.email || 'No especificado' }}</span>
          </div>
          <div class="config-item">
            <span class="config-label">Moneda:</span>
            <span class="config-value">{{ sede.moneda || 'Bs' }}</span>
          </div>
        </div>
        <div class="config-footer">
          <button class="btn btn-primary btn-sm" @click="editarSede(sede.id)">
            <i class="bi bi-pencil"></i> Editar
          </button>
          <button class="btn btn-outline-secondary btn-sm" @click="verDetalle(sede.id)">
            <i class="bi bi-eye"></i> Ver
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()
const loading = ref(false)
const sedes = ref([])

async function loadData() {
  loading.value = true
  try {
    // Aquí iría la llamada a la API
    // const res = await ConfiguracionSedeAPI.list()
    // sedes.value = res.data.data || []
    sedes.value = []
  } catch (error) {
    console.error('Error cargando configuración:', error)
    Swal.fire('Error', 'No se pudo cargar la configuración', 'error')
  } finally {
    loading.value = false
  }
}

function editarSede(id) {
  router.push(`/configuracion/sede/${id}/editar`)
}

function verDetalle(id) {
  router.push(`/configuracion/sede/${id}`)
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.page-container { padding: 24px; max-width: 1400px; margin: 0 auto; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; background: #ffffff; padding: 20px 24px; border-radius: 12px; border: 1px solid #e5e7eb; }
.header-left { display: flex; align-items: center; }
.header-title { display: flex; align-items: center; gap: 14px; }
.header-title i { font-size: 32px; color: #2F6FED; background: #e8eeff; padding: 12px; border-radius: 12px; }
.header-title h1 { font-size: 22px; font-weight: 700; color: #111827; margin: 0; }
.header-title .text-muted { color: #6b7280; font-size: 14px; margin: 2px 0 0; }
.header-actions { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.config-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px; }
.config-card { background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; transition: all 0.3s ease; }
.config-card:hover { transform: translateY(-4px); box-shadow: 0 8px 30px rgba(0,0,0,0.08); }
.config-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; background: #f8fafc; border-bottom: 1px solid #e5e7eb; }
.config-header h3 { margin: 0; font-size: 16px; font-weight: 600; color: #111827; }
.config-header h3 i { color: #2F6FED; margin-right: 8px; }
.config-body { padding: 16px 20px; }
.config-item { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f3f4f6; }
.config-item:last-child { border-bottom: none; }
.config-label { font-weight: 500; color: #6b7280; font-size: 13px; }
.config-value { color: #111827; font-size: 13px; }
.config-footer { padding: 12px 20px; border-top: 1px solid #e5e7eb; display: flex; gap: 8px; }
.badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; }
.badge-success { background: #dcfce7; color: #16a34a; }
.badge-danger { background: #fecaca; color: #dc2626; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 6px 16px; border: none; border-radius: 8px; font-weight: 600; font-size: 13px; cursor: pointer; transition: all 0.2s ease; text-decoration: none; font-family: inherit; }
.btn-primary { background: #2F6FED; color: #ffffff; }
.btn-primary:hover { background: #1a5adf; box-shadow: 0 4px 12px rgba(47,111,237,0.3); }
.btn-outline-secondary { background: transparent; color: #6b7280; border: 1.5px solid #d1d5db; }
.btn-outline-secondary:hover { background: #f9fafb; border-color: #9ca3af; }
.btn-sm { padding: 4px 12px; font-size: 12px; }
.spin { animation: spin 1s linear infinite; }
.spinner { width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top: 4px solid #2F6FED; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.text-muted { color: #6b7280; }
.text-center { text-align: center; }
.mt-2 { margin-top: 8px; }
.py-5 { padding: 48px 0; }
@media (max-width: 768px) { .page-container { padding: 12px; } .page-header { flex-direction: column; align-items: stretch; padding: 16px; } .header-title h1 { font-size: 18px; } .header-actions { justify-content: stretch; } .header-actions .btn { flex: 1; justify-content: center; } .config-grid { grid-template-columns: 1fr; } }
</style>