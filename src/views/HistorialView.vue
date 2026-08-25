<template>
  <div class="historial">
    <div class="panel-header">
      <div>
        <div class="panel-title">📋 Historial de Reportes</div>
        <div class="panel-sub">Todos los períodos cargados por <b>{{ empresaNombre }}</b></div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="filter-group" style="margin-bottom: 20px;">
      <div class="filter-item">
        <span class="filter-icon">🔍</span>
        <select v-model="filtroStatus" @change="cargarHistorial">
          <option value="todos">Todos los estados</option>
          <option value="borrador">📝 Borrador</option>
          <option value="cargado">⏳ Cargado</option>
          <option value="validado">✅ Validado</option>
          <option value="rechazado">❌ Rechazado</option>
        </select>
      </div>
      <div class="filter-item">
        <span class="filter-icon">📅</span>
        <select v-model="filtroAnio" @change="cargarHistorial">
          <option value="todos">Todos los años</option>
          <option v-for="a in añosDisponibles" :key="a" :value="a">{{ a }}</option>
        </select>
      </div>
      <button class="btn btn-ghost btn-sm" @click="cargarHistorial" :disabled="cargando">
        <i class="bi bi-arrow-clockwise"></i> Actualizar
      </button>
    </div>

    <!-- Tabla -->
    <div class="admin-table-wrap">
      <div class="thead-row">
        <h3>📊 Reportes enviados</h3>
        <span class="card-badge">{{ reportes.length }} reporte(s)</span>
      </div>
      <table class="admin-table">
        <thead>
          <tr>
            <th>Período</th>
            <th>Estado</th>
            <th>Archivos</th>
            <th>Ingresos $</th>
            <th>Gastos $</th>
            <th>Flujo $</th>
            <th>Cargado por</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="cargando">
            <td colspan="8" style="text-align: center; padding: 40px;">
              <div class="spinner"></div>
              <p style="margin-top: 8px; color: var(--text-dim);">Cargando historial...</p>
            </td>
          </tr>
          <tr v-else-if="reportes.length === 0">
            <td colspan="8" style="text-align: center; padding: 40px;">
              <i class="bi bi-inbox" style="font-size: 32px; color: var(--text-faint);"></i>
              <p style="margin-top: 8px; color: var(--text-faint);">No hay reportes cargados todavía</p>
              <p style="font-size: 12px; color: var(--text-faint);">
                Sube tu primer reporte desde el menú "Reporte Financiero"
              </p>
            </td>
          </tr>
          <tr v-for="r in reportes" :key="r.id">
            <td><b>{{ periodoLabel(r.periodo) }}</b></td>
            <td>
              <span class="stamp-mark" :class="r.status">
                {{ getStatusLabel(r.status) }}
              </span>
            </td>
            <td>
              <span v-if="r.cantidad_archivos > 0" class="file-chip">
                <i class="bi bi-paperclip"></i>
                {{ r.cantidad_archivos }} archivo(s)
              </span>
              <span v-else style="color: var(--text-faint); font-size: 12px;">Sin archivo</span>
            </td>
            <td class="number-cell">$ {{ formatNumber(r.total_ingresos || 0) }}</td>
            <td class="number-cell">$ {{ formatNumber(r.total_gastos || 0) }}</td>
            <td class="number-cell" :class="(r.flujo_neto || 0) >= 0 ? 'positive' : 'negative'">
              $ {{ formatNumber(r.flujo_neto || 0) }}
            </td>
            <td>
              <span v-if="r.cargado_por_nombre || r.cargado_por" class="user-chip-sm">
                <i class="bi bi-person"></i>
                {{ r.cargado_por_nombre || r.cargado_por || '—' }}
              </span>
              <span v-else class="text-muted">—</span>
            </td>
            <td>
              <button class="btn btn-primary btn-sm" @click="verReporte(r.id)">
                <i class="bi bi-eye"></i> Ver
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { ReportesAPI } from '@/services/api'
import Swal from 'sweetalert2'

const auth = useAuthStore()
const router = useRouter()

// ============================================
// CONSTANTES
// ============================================
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

// ============================================
// ESTADO
// ============================================
const reportes = ref([])
const cargando = ref(false)
const filtroStatus = ref('todos')
const filtroAnio = ref('todos')

// ============================================
// COMPUTED
// ============================================
const empresaNombre = computed(() => auth.user?.empresa_nombre || auth.user?.empresa || 'Mi empresa')

const añosDisponibles = computed(() => {
  const años = new Set()
  reportes.value.forEach(r => {
    if (r.periodo) {
      const año = parseInt(r.periodo.split('-')[0])
      if (!isNaN(año)) años.add(año)
    }
  })
  return Array.from(años).sort((a, b) => b - a)
})

// ============================================
// FUNCIONES
// ============================================
function periodoLabel(p) {
  if (!p) return ''
  const [year, month] = p.split('-')
  const mesIndex = parseInt(month, 10) - 1
  return MESES[mesIndex] + ' ' + year
}

function getStatusLabel(status) {
  const map = { 
    borrador: '📝 Borrador', 
    cargado: '⏳ Cargado', 
    validado: '✅ Validado', 
    rechazado: '❌ Rechazado' 
  }
  return map[status] || '📝 Borrador'
}

function formatNumber(num) {
  if (num === undefined || num === null) return '0.00'
  return Number(num).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

async function cargarHistorial() {
  try {
    cargando.value = true
    
    if (!auth.empresaId) {
      console.log('⚠️ No hay empresa ID')
      reportes.value = []
      return
    }

    console.log('📋 Cargando historial para empresa:', auth.empresaId)

    // ⭐ USAR EL MISMO ENDPOINT QUE ReporteFinancieroView
    const response = await ReportesAPI.getByEmpresa(auth.empresaId)
    let datos = response.data?.data || response.data || []
    
    console.log('📋 Datos recibidos:', datos.length, 'reportes')

    // ⭐ Asegurar que los datos tengan la estructura correcta
    datos = datos.map(r => ({
      ...r,
      cargado_por_nombre: r.cargado_por || r.cargado_por_nombre || null,
      validado_por_nombre: r.validado_por || r.validado_por_nombre || null,
      cantidad_archivos: r.total_archivos || r.cantidad_archivos || 0
    }))
    
    // Filtrar por estado
    if (filtroStatus.value !== 'todos') {
      datos = datos.filter(r => r.status === filtroStatus.value)
    }
    
    // Filtrar por año
    if (filtroAnio.value !== 'todos') {
      datos = datos.filter(r => {
        if (!r.periodo) return false
        const año = parseInt(r.periodo.split('-')[0])
        return año === parseInt(filtroAnio.value)
      })
    }
    
    // Ordenar por período (más reciente primero)
    reportes.value = datos.sort((a, b) => {
      if (!a.periodo) return 1
      if (!b.periodo) return -1
      return b.periodo.localeCompare(a.periodo)
    })
    
    console.log('📋 Historial cargado:', reportes.value.length, 'reportes')
  } catch (error) {
    console.error('❌ Error cargando historial:', error)
    Swal.fire({ 
      icon: 'error', 
      title: 'Error', 
      text: error.response?.data?.message || 'No se pudo cargar el historial' 
    })
  } finally {
    cargando.value = false
  }
}

function verReporte(id) {
  router.push({ name: 'reporte_detalle', params: { id } })
}

// ============================================
// CICLO DE VIDA
// ============================================
onMounted(() => {
  cargarHistorial()
})
</script>

<style scoped>
.historial {
  max-width: 1320px;
  margin: 0 auto;
}

/* ⭐ PANEL HEADER */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 22px;
}

.panel-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 23px;
  font-weight: 700;
}

.panel-sub {
  color: var(--text-dim);
  font-size: 13.5px;
  margin-top: 4px;
}

/* ⭐ FILTER GROUP */
.filter-group {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 8px 12px;
  box-shadow: var(--shadow-card);
}

.filter-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: var(--text-dim);
}

.filter-item select {
  border: none;
  outline: none;
  background: transparent;
  padding: 0;
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  width: 100%;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
}

/* ⭐ SPINNER */
.spinner {
  display: inline-block;
  width: 30px;
  height: 30px;
  border: 3px solid var(--border);
  border-top: 3px solid var(--blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* ⭐ ADMIN TABLE */
.admin-table-wrap {
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 16px;
  overflow-x: auto;
  margin-bottom: 24px;
  box-shadow: var(--shadow-card);
}

.admin-table-wrap .thead-row {
  padding: 18px 22px;
  border-bottom: 1px solid var(--border-soft);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.admin-table-wrap h3 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 16px;
  font-weight: 600;
}

.card-badge {
  background: var(--blue-soft);
  color: var(--blue);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

table.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
  min-width: 700px;
}

table.admin-table thead th {
  text-align: left;
  padding: 10px 18px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .05em;
  color: var(--text-faint);
  border-bottom: 1px solid var(--border-soft);
  white-space: nowrap;
}

table.admin-table tbody td {
  padding: 12px 18px;
  border-bottom: 1px solid var(--border-soft);
  vertical-align: middle;
}

table.admin-table tbody tr:last-child td {
  border-bottom: none;
}

table.admin-table tbody tr:hover {
  background: #FBFAF6;
}

/* ⭐ STAMP MARK */
.stamp-mark {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: .06em;
  padding: 4px 10px;
  border-radius: 100px;
  border: 1px solid var(--border);
  text-transform: uppercase;
}

.stamp-mark.borrador {
  color: var(--text-dim);
  border-color: var(--border);
  background: #FAF8F3;
}

.stamp-mark.cargado {
  color: var(--orange);
  border-color: #F0D3A0;
  background: var(--orange-soft);
}

.stamp-mark.validado {
  color: var(--green);
  border-color: #BEE6CE;
  background: var(--green-soft);
}

.stamp-mark.rechazado {
  color: var(--red);
  border-color: #F3D2D0;
  background: var(--red-soft);
}

.stamp-mark::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

/* ⭐ FILE CHIP */
.file-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-dim);
  background: var(--blue-soft);
  padding: 2px 10px;
  border-radius: 12px;
}

/* ⭐ NUMBERS */
.number-cell {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12.5px;
}

.number-cell.positive {
  color: var(--green);
}

.number-cell.negative {
  color: var(--red);
}

/* ⭐ USER CHIP */
.user-chip-sm {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text);
  font-weight: 500;
  background: #F6F4EF;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid var(--border-soft);
}

.text-muted {
  color: var(--text-faint);
}

/* ⭐ BOTONES */
.btn {
  border: none;
  border-radius: 10px;
  padding: 11px 18px;
  font-size: 13.5px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: transform .1s ease, filter .15s, background .15s, box-shadow .15s;
  letter-spacing: .01em;
  white-space: nowrap;
  cursor: pointer;
}

.btn:active {
  transform: scale(.98);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--blue);
  color: #fff;
  box-shadow: 0 8px 20px -8px rgba(47,111,237,.55);
}

.btn-primary:hover:not(:disabled) {
  background: var(--blue-dim);
}

.btn-ghost {
  background: #fff;
  color: var(--text-dim);
  border: 1px solid var(--border);
}

.btn-ghost:hover {
  color: var(--text);
  border-color: #D8D2C4;
}

.btn-sm {
  padding: 7px 12px;
  font-size: 12.5px;
  border-radius: 8px;
}

/* ⭐ RESPONSIVE */
@media (max-width: 768px) {
  .filter-group {
    flex-direction: column;
    width: 100%;
  }
  
  .filter-item {
    width: 100%;
  }
  
  table.admin-table {
    font-size: 12px;
    min-width: 100%;
  }
  
  table.admin-table thead {
    display: none;
  }
  
  table.admin-table, 
  table.admin-table tbody, 
  table.admin-table tr, 
  table.admin-table td {
    display: block;
    width: 100%;
  }
  
  table.admin-table tr {
    padding: 12px 16px;
    border-bottom: 2px solid var(--border-soft);
  }
  
  table.admin-table td {
    padding: 6px 0;
    border: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  table.admin-table td::before {
    content: attr(data-label);
    font-weight: 600;
    color: var(--text-dim);
    font-size: 11px;
    text-transform: uppercase;
  }
  
  table.admin-table td:last-child {
    justify-content: flex-end;
  }
}
</style>