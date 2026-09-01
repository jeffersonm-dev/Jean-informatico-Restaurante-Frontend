<!-- src/views/restaurante/AuditoriaCaja/AuditoriaCajaDetalleView.vue -->
<template>
  <div class="page-container">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner"></div>
      <p class="text-muted mt-2">Cargando auditoría...</p>
    </div>

    <div v-else-if="auditoria" class="detalle-content">
      <!-- HEADER -->
      <div class="page-header">
        <div class="header-left">
          <div class="header-title">
            <i class="bi bi-cash-stack"></i>
            <div>
              <h1>Auditoría de Caja #{{ auditoria.id }}</h1>
              <p class="text-muted">Detalle completo de la auditoría</p>
            </div>
          </div>
        </div>
        <div class="header-actions">
          <router-link to="/auditoria-caja" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left"></i> Volver
          </router-link>
          <button class="btn btn-primary" @click="imprimirReporte" v-if="auditoria.estado === 'Cerrada'">
            <i class="bi bi-printer"></i> Imprimir
          </button>
          <router-link 
            :to="`/auditoria-caja/${auditoria.id}/cerrar`" 
            class="btn btn-warning"
            v-if="auditoria.estado === 'Abierta'"
          >
            <i class="bi bi-x-circle"></i> Cerrar Caja
          </router-link>
        </div>
      </div>

      <!-- ESTADO -->
      <div class="estado-bar">
        <div class="estado-info">
          <span class="badge" :class="auditoria.estado === 'Abierta' ? 'badge-success' : 'badge-secondary'">
            <i :class="auditoria.estado === 'Abierta' ? 'bi-check-circle' : 'bi-x-circle'"></i>
            {{ auditoria.estado }}
          </span>
          <span class="fecha-info">
            <i class="bi bi-clock"></i>
            Apertura: {{ formatearFechaCompleta(auditoria.fecha_apertura) }}
          </span>
          <span v-if="auditoria.fecha_cierre" class="fecha-info">
            <i class="bi bi-clock-history"></i>
            Cierre: {{ formatearFechaCompleta(auditoria.fecha_cierre) }}
          </span>
        </div>
      </div>

      <!-- DATOS DE LA AUDITORÍA -->
      <div class="detalle-grid">
        <div class="detalle-card">
          <h4><i class="bi bi-building"></i> Sede</h4>
          <p><strong>{{ auditoria.sede_nombre || auditoria.sede_id || 'N/A' }}</strong></p>
        </div>

        <div class="detalle-card">
          <h4><i class="bi bi-person"></i> Usuario Apertura</h4>
          <p><strong>{{ auditoria.usuario_apertura_nombre || auditoria.usuario_apertura || 'N/A' }}</strong></p>
        </div>

        <div class="detalle-card" v-if="auditoria.usuario_cierre">
          <h4><i class="bi bi-person-check"></i> Usuario Cierre</h4>
          <p><strong>{{ auditoria.usuario_cierre_nombre || auditoria.usuario_cierre || 'N/A' }}</strong></p>
        </div>

        <div class="detalle-card">
          <h4><i class="bi bi-cash"></i> Montos</h4>
          <p><strong>Inicial:</strong> S/ {{ formatCurrency(auditoria.monto_inicial) }}</p>
          <p v-if="auditoria.monto_real"><strong>Real:</strong> S/ {{ formatCurrency(auditoria.monto_real) }}</p>
          <p v-if="auditoria.monto_real" class="diferencia" :class="calcularDiferencia >= 0 ? 'text-success' : 'text-danger'">
            <strong>Diferencia:</strong> S/ {{ formatCurrency(calcularDiferencia) }}
          </p>
        </div>
      </div>

      <!-- OBSERVACIONES -->
      <div v-if="auditoria.observaciones" class="notas-section">
        <div class="nota-item">
          <h5><i class="bi bi-sticky"></i> Observaciones</h5>
          <p>{{ auditoria.observaciones }}</p>
        </div>
      </div>

      <!-- MOVIMIENTOS ASOCIADOS (si existen) -->
      <div v-if="auditoria.movimientos && auditoria.movimientos.length" class="movimientos-section">
        <h3><i class="bi bi-list-ul"></i> Movimientos Asociados</h3>
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Tipo</th>
                <th>Monto</th>
                <th>Fecha</th>
                <th>Usuario</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(mov, index) in auditoria.movimientos" :key="index">
                <td>{{ index + 1 }}</td>
                <td>
                  <span class="badge" :class="mov.tipo === 'Ingreso' ? 'badge-success' : 'badge-danger'">
                    {{ mov.tipo }}
                  </span>
                </td>
                <td>S/ {{ formatCurrency(mov.monto) }}</td>
                <td>{{ formatearFecha(mov.fecha) }}</td>
                <td>{{ mov.usuario_nombre || mov.usuario_id }}</td>
                <td>{{ mov.descripcion || '-' }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td colspan="2" class="text-end"><strong>Total Ingresos:</strong></td>
                <td class="text-success">S/ {{ formatCurrency(totalIngresos) }}</td>
                <td colspan="3"></td>
              </tr>
              <tr class="total-row">
                <td colspan="2" class="text-end"><strong>Total Egresos:</strong></td>
                <td class="text-danger">S/ {{ formatCurrency(totalEgresos) }}</td>
                <td colspan="3"></td>
              </tr>
              <tr class="total-row">
                <td colspan="2" class="text-end"><strong>Saldo:</strong></td>
                <td class="total-saldo">S/ {{ formatCurrency(totalIngresos - totalEgresos) }}</td>
                <td colspan="3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-5">
      <i class="bi bi-exclamation-triangle fs-1 d-block text-warning"></i>
      <p class="text-muted mt-2">No se encontró la auditoría</p>
      <router-link to="/auditoria-caja" class="btn btn-primary">Volver a Auditorías</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AuditoriaCajaAPI } from '@/services/api'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const auditoria = ref(null)

const calcularDiferencia = computed(() => {
  if (!auditoria.value) return 0
  return (auditoria.value.monto_real || 0) - (auditoria.value.monto_inicial || 0)
})

const totalIngresos = computed(() => {
  if (!auditoria.value?.movimientos) return 0
  return auditoria.value.movimientos
    .filter(m => m.tipo === 'Ingreso')
    .reduce((sum, m) => sum + (m.monto || 0), 0)
})

const totalEgresos = computed(() => {
  if (!auditoria.value?.movimientos) return 0
  return auditoria.value.movimientos
    .filter(m => m.tipo === 'Egreso')
    .reduce((sum, m) => sum + (m.monto || 0), 0)
})

function formatCurrency(value) {
  if (value === null || value === undefined) return '0.00'
  return new Intl.NumberFormat('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

function formatearFecha(fecha) {
  if (!fecha) return 'N/A'
  try {
    const d = new Date(fecha)
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return fecha
  }
}

function formatearFechaCompleta(fecha) {
  if (!fecha) return 'N/A'
  try {
    const d = new Date(fecha)
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return fecha
  }
}

async function loadAuditoria() {
  const id = route.params.id
  if (!id) {
    router.push('/auditoria-caja')
    return
  }

  loading.value = true
  try {
    const res = await AuditoriaCajaAPI.getById(id)
    if (res.data && res.data.success) {
      auditoria.value = res.data.data
    } else if (res.data) {
      auditoria.value = res.data
    } else {
      auditoria.value = null
    }
  } catch (error) {
    console.error('Error cargando auditoría:', error)
    Swal.fire('Error', 'No se pudo cargar la auditoría', 'error')
    auditoria.value = null
  } finally {
    loading.value = false
  }
}

function imprimirReporte() {
  window.print()
}

// ===== LIFECYCLE =====
onMounted(() => {
  loadAuditoria()
})
</script>

<style scoped>
.page-container { padding: 24px; max-width: 1200px; margin: 0 auto; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; background: #ffffff; padding: 20px 24px; border-radius: 12px; border: 1px solid #e5e7eb; }
.header-left { display: flex; align-items: center; }
.header-title { display: flex; align-items: center; gap: 14px; }
.header-title i { font-size: 32px; color: #2F6FED; background: #e8eeff; padding: 12px; border-radius: 12px; }
.header-title h1 { font-size: 22px; font-weight: 700; color: #111827; margin: 0; }
.header-title .text-muted { color: #6b7280; font-size: 14px; margin: 2px 0 0; }
.header-actions { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.estado-bar { display: flex; justify-content: space-between; align-items: center; background: #ffffff; padding: 16px 24px; border-radius: 12px; border: 1px solid #e5e7eb; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.estado-info { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.badge { display: inline-flex; align-items: center; gap: 4px; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; }
.badge-success { background: #dcfce7; color: #16a34a; }
.badge-secondary { background: #f3f4f6; color: #6b7280; }
.badge-danger { background: #fecaca; color: #dc2626; }
.fecha-info { color: #6b7280; font-size: 14px; }
.fecha-info i { margin-right: 4px; }
.detalle-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.detalle-card { background: #ffffff; padding: 16px 20px; border-radius: 12px; border: 1px solid #e5e7eb; }
.detalle-card h4 { font-size: 14px; font-weight: 600; color: #6b7280; margin: 0 0 8px 0; display: flex; align-items: center; gap: 6px; }
.detalle-card h4 i { color: #2F6FED; }
.detalle-card p { margin: 4px 0; font-size: 14px; color: #374151; }
.detalle-card p strong { color: #111827; }
.diferencia { font-size: 16px; margin-top: 4px; }
.text-success { color: #16a34a; }
.text-danger { color: #dc2626; }
.notas-section { margin-bottom: 24px; }
.nota-item { background: #f8fafc; padding: 16px 20px; border-radius: 12px; border-left: 4px solid #2F6FED; }
.nota-item h5 { font-size: 14px; font-weight: 600; color: #374151; margin: 0 0 4px 0; display: flex; align-items: center; gap: 6px; }
.nota-item p { margin: 0; color: #4b5563; font-size: 14px; }
.movimientos-section { background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; padding: 20px; margin-bottom: 24px; }
.movimientos-section h3 { font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 16px 0; display: flex; align-items: center; gap: 8px; }
.movimientos-section h3 i { color: #2F6FED; }
.table { width: 100%; border-collapse: collapse; }
.table thead { background: #f8fafc; }
.table thead th { padding: 10px 14px; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #6b7280; border-bottom: 1px solid #e5e7eb; }
.table tbody td { padding: 10px 14px; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #374151; }
.table tbody tr:last-child td { border-bottom: none; }
.table tfoot th { padding: 10px 14px; border-top: 2px solid #e5e7eb; font-size: 14px; color: #111827; }
.total-row td { font-size: 16px; border-top: 2px solid #e5e7eb; }
.total-saldo { font-size: 18px; font-weight: 700; color: #2F6FED; }
.text-end { text-align: right; }
.text-center { text-align: center; }
.text-muted { color: #6b7280; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 18px; border: none; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s ease; text-decoration: none; font-family: inherit; white-space: nowrap; }
.btn-primary { background: #2F6FED; color: #ffffff; }
.btn-primary:hover { background: #1a5adf; box-shadow: 0 4px 12px rgba(47,111,237,0.3); }
.btn-outline-secondary { background: transparent; color: #6b7280; border: 1.5px solid #d1d5db; }
.btn-outline-secondary:hover { background: #f9fafb; border-color: #9ca3af; }
.btn-warning { background: #d97706; color: #ffffff; }
.btn-warning:hover { background: #b45309; }
.spinner { width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top: 4px solid #2F6FED; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@media print { .header-actions { display: none; } .page-container { padding: 0; } .page-header, .estado-bar, .detalle-card, .movimientos-section { border: 1px solid #e5e7eb; } }
@media (max-width: 1024px) { .detalle-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .page-container { padding: 12px; } .page-header { flex-direction: column; align-items: stretch; padding: 16px; } .header-title h1 { font-size: 18px; } .header-actions { justify-content: stretch; } .header-actions .btn { flex: 1; justify-content: center; } .detalle-grid { grid-template-columns: 1fr; } .estado-bar { flex-direction: column; align-items: stretch; } .table { font-size: 13px; } .table thead th, .table tbody td { padding: 6px 10px; } }
@media (max-width: 480px) { .header-title i { font-size: 24px; padding: 8px; } .header-title h1 { font-size: 16px; } .badge { font-size: 11px; padding: 4px 10px; } .btn { font-size: 13px; padding: 6px 12px; } }
</style>