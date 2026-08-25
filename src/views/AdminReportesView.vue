<template>
  <div class="admin-reportes">
    <!-- ============================================================
    HEADER
    ============================================================ -->
    <div class="panel-header">
      <div>
        <div class="panel-title">
          <i class="bi bi-file-earmark-text"></i>
          Reportes de Empresas
        </div>
        <div class="panel-sub">
          <i class="bi bi-info-circle"></i>
          Filtra por período, empresa o estado para revisar y validar.
        </div>
      </div>
      <div class="header-right">
        <span class="period-badge">
          <i class="bi bi-calendar3"></i>
          {{ fechaActualizacion || 'Actualizado' }}
        </span>
      </div>
    </div>

    <!-- ============================================================
    FILTROS
    ============================================================ -->
    <div class="filter-group">
      <div class="filter-item">
        <span class="filter-icon">📅</span>
        <select v-model="filtroAnio" @change="cargarReportes">
          <option value="todos">Todos los años</option>
          <option v-for="a in añosDisponibles" :key="a" :value="a">{{ a }}</option>
        </select>
      </div>
      <div class="filter-item">
        <span class="filter-icon">📆</span>
        <select v-model="filtroMes" @change="cargarReportes">
          <option value="todos">Todos los meses</option>
          <option v-for="(m, i) in meses" :key="i" :value="i + 1">{{ m }}</option>
        </select>
      </div>
      <div class="filter-item">
        <span class="filter-icon">🏢</span>
        <select v-model="filtroEmpresa" @change="cargarReportes">
          <option value="todas">Todas las empresas</option>
          <option v-for="emp in empresas" :key="emp.id" :value="emp.id">{{ emp.nombre }}</option>
        </select>
      </div>
      <div class="filter-item">
        <span class="filter-icon">📊</span>
        <select v-model="filtroStatus" @change="cargarReportes">
          <option value="todos">Todos los estados</option>
          <option value="borrador">Borrador</option>
          <option value="cargado">Cargado</option>
          <option value="validado">Validado</option>
          <option value="rechazado">Rechazado</option>
        </select>
      </div>
      <button class="btn-refresh" @click="cargarReportes" :disabled="cargando">
        <i class="bi bi-arrow-clockwise" :class="{ spinning: cargando }"></i>
        <span class="btn-text">{{ cargando ? 'Cargando...' : 'Actualizar' }}</span>
      </button>
      <button class="btn-clear" @click="limpiarFiltros" :disabled="cargando" title="Limpiar filtros">
        <i class="bi bi-eraser"></i>
        <span class="btn-text">Limpiar</span>
      </button>
    </div>

    <!-- ============================================================
    KPI CARDS
    ============================================================ -->
    <div class="kpi-row">
      <div class="kpi-card">
        <div class="kpi-icon blue">
          <i class="bi bi-file-earmark"></i>
        </div>
        <div class="kpi-content">
          <span class="kpi-value">{{ reportesFiltrados.length }}</span>
          <span class="kpi-label">Total reportes</span>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon green">
          <i class="bi bi-check-circle"></i>
        </div>
        <div class="kpi-content">
          <span class="kpi-value" style="color: #22c55e;">{{ reportesFiltrados.filter(function(r) { return r.status === 'validado' }).length }}</span>
          <span class="kpi-label">Validados</span>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon orange">
          <i class="bi bi-clock"></i>
        </div>
        <div class="kpi-content">
          <span class="kpi-value" style="color: #f59e0b;">{{ reportesFiltrados.filter(function(r) { return r.status === 'cargado' }).length }}</span>
          <span class="kpi-label">Pendientes</span>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon red">
          <i class="bi bi-x-circle"></i>
        </div>
        <div class="kpi-content">
          <span class="kpi-value" style="color: #ef4444;">{{ reportesFiltrados.filter(function(r) { return r.status === 'borrador' || r.status === 'rechazado' }).length }}</span>
          <span class="kpi-label">Sin validar</span>
        </div>
      </div>
    </div>

    <!-- ============================================================
    TABLA DE REPORTES
    ============================================================ -->
    <div class="admin-table-wrap">
      <div class="thead-row">
        <div class="thead-left">
          <i class="bi bi-list-ul"></i>
          <h3>Reportes</h3>
          <span class="count-badge">{{ reportesFiltrados.length }}</span>
        </div>
        <span class="update-badge">
          <i class="bi bi-clock"></i>
          {{ fechaActualizacion || 'Actualizando...' }}
        </span>
      </div>

      <!-- VERSIÓN MÓVIL: Tarjetas -->
      <div class="mobile-cards" v-if="reportesFiltrados.length > 0">
        <div class="mobile-card" v-for="r in reportesFiltrados" :key="r.id">
          <div class="mobile-card-header">
            <div class="company-info">
              <span class="company-dot" :style="{ background: getStatusColor(r.status) }"></span>
              <span class="company-name">{{ r.empresa_nombre || r.empresa || 'Sin empresa' }}</span>
            </div>
            <span class="stamp-mark" :class="r.status">
              {{ getStatusLabel(r.status) }}
            </span>
          </div>
          <div class="mobile-card-body">
            <div class="mobile-field">
              <span class="field-label">Período</span>
              <span class="field-value">{{ periodoLabel(r.periodo) }}</span>
            </div>
            <div class="mobile-field">
              <span class="field-label">Archivos</span>
              <span class="field-value">
                <span v-if="r.total_archivos > 0" class="file-chip">
                  <i class="bi bi-paperclip"></i>
                  {{ r.total_archivos }}
                </span>
                <span v-else style="color: #9ca3af;">Sin archivo</span>
              </span>
            </div>
            <div class="mobile-field">
              <span class="field-label">Enviado</span>
              <span class="field-value">{{ r.cargado_por_nombre || r.cargado_por || '-' }}</span>
            </div>
            <div class="mobile-field">
              <span class="field-label">Validado</span>
              <span class="field-value">{{ r.validado_por_nombre || r.validado_por || '-' }}</span>
            </div>
          </div>
          <div class="mobile-card-actions">
            <button class="btn btn-ghost btn-sm" @click="verReporte(r.id)" title="Ver detalle">
              <i class="bi bi-eye"></i>
            </button>
            <button 
              v-if="r.status === 'cargado'" 
              class="btn btn-teal btn-sm" 
              @click="validarReporte(r.id)"
              title="Validar"
            >
              <i class="bi bi-check-circle"></i>
            </button>
            <button 
              v-if="r.status === 'cargado'" 
              class="btn btn-red btn-sm" 
              @click="rechazarReporte(r.id)"
              title="Rechazar"
            >
              <i class="bi bi-x-circle"></i>
            </button>
            <button 
              v-if="r.status === 'validado' || r.status === 'rechazado'" 
              class="btn btn-ghost btn-sm" 
              @click="reabrirReporteAdmin(r.id)"
              title="Reabrir"
            >
              <i class="bi bi-arrow-counterclockwise"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- VERSIÓN ESCRITORIO: Tabla -->
      <div class="table-wrapper" v-if="reportesFiltrados.length > 0">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Empresa</th>
              <th>Período</th>
              <th>Estado</th>
              <th>Archivo</th>
              <th>Enviado</th>
              <th>Validado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in reportesFiltrados" :key="r.id">
              <td>
                <div class="company-name-cell">
                  <span class="company-dot" :style="{ background: getStatusColor(r.status) }"></span>
                  {{ r.empresa_nombre || r.empresa || 'Sin empresa' }}
                </div>
              </td>
              <td>{{ periodoLabel(r.periodo) }}</td>
              <td>
                <span class="stamp-mark" :class="r.status">
                  {{ getStatusLabel(r.status) }}
                </span>
              </td>
              <td>
                <span v-if="r.total_archivos > 0" class="file-chip">
                  <i class="bi bi-paperclip"></i>
                  {{ r.total_archivos }}
                </span>
                <span v-else style="color: #9ca3af; font-size: 12px;">Sin archivo</span>
              </td>
              <td>{{ r.cargado_por_nombre || r.cargado_por || '-' }}</td>
              <td>{{ r.validado_por_nombre || r.validado_por || '-' }}</td>
              <td>
                <div class="action-group">
                  <button class="btn btn-ghost btn-sm" @click="verReporte(r.id)" title="Ver detalle">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button 
                    v-if="r.status === 'cargado'" 
                    class="btn btn-teal btn-sm" 
                    @click="validarReporte(r.id)"
                    title="Validar"
                  >
                    <i class="bi bi-check-circle"></i>
                  </button>
                  <button 
                    v-if="r.status === 'cargado'" 
                    class="btn btn-red btn-sm" 
                    @click="rechazarReporte(r.id)"
                    title="Rechazar"
                  >
                    <i class="bi bi-x-circle"></i>
                  </button>
                  <button 
                    v-if="r.status === 'validado' || r.status === 'rechazado'" 
                    class="btn btn-ghost btn-sm" 
                    @click="reabrirReporteAdmin(r.id)"
                    title="Reabrir"
                  >
                    <i class="bi bi-arrow-counterclockwise"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- EMPTY STATE -->
      <div v-if="!cargando && reportesFiltrados.length === 0" class="empty-state">
        <i class="bi bi-inbox"></i>
        <p>No hay reportes que coincidan con los filtros</p>
        <button class="btn btn-primary btn-sm" @click="limpiarFiltros">
          <i class="bi bi-eraser"></i> Limpiar filtros
        </button>
      </div>

      <!-- LOADING -->
      <div v-if="cargando" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando reportes...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { periodoLabel, MESES } from '@/stores/data'
import Swal from 'sweetalert2'
import { ReportesAPI, EmpresasAPI } from '@/services/api'

var router = useRouter()

// ============================================================
// ESTADO
// ============================================================
var cargando = ref(false)
var reportes = ref([])
var empresas = ref([])
var meses = MESES
var fechaActualizacion = ref('')

// Filtros
var filtroAnio = ref('todos')
var filtroMes = ref('todos')
var filtroEmpresa = ref('todas')
var filtroStatus = ref('todos')

// ============================================================
// COMPUTED
// ============================================================
var añosDisponibles = computed(function() {
  var años = new Set()
  reportes.value.forEach(function(r) {
    if (r.periodo) {
      var año = parseInt(r.periodo.split('-')[0])
      años.add(año)
    }
  })
  return Array.from(años).sort(function(a, b) { return b - a })
})

var reportesFiltrados = computed(function() {
  var lista = reportes.value.slice()
  
  if (filtroAnio.value !== 'todos') {
    lista = lista.filter(function(r) {
      return r.periodo && parseInt(r.periodo.split('-')[0]) === parseInt(filtroAnio.value)
    })
  }
  
  if (filtroMes.value !== 'todos') {
    lista = lista.filter(function(r) {
      return r.periodo && parseInt(r.periodo.split('-')[1]) === parseInt(filtroMes.value)
    })
  }
  
  if (filtroEmpresa.value !== 'todas') {
    lista = lista.filter(function(r) {
      return r.empresa_id === filtroEmpresa.value
    })
  }
  
  if (filtroStatus.value !== 'todos') {
    lista = lista.filter(function(r) {
      return r.status === filtroStatus.value
    })
  }
  
  return lista
})

// ============================================================
// MÉTODOS
// ============================================================
function getStatusLabel(status) {
  var map = { 
    borrador: 'Borrador', 
    cargado: 'En revisión', 
    validado: 'Validado', 
    rechazado: 'Rechazado' 
  }
  return map[status] || 'Borrador'
}

function getStatusColor(status) {
  var map = { 
    borrador: '#6b7280', 
    cargado: '#f59e0b', 
    validado: '#22c55e', 
    rechazado: '#ef4444' 
  }
  return map[status] || '#6b7280'
}

function limpiarFiltros() {
  filtroAnio.value = 'todos'
  filtroMes.value = 'todos'
  filtroEmpresa.value = 'todas'
  filtroStatus.value = 'todos'
  cargarReportes()
}

async function cargarReportes() {
  cargando.value = true
  try {
    if (empresas.value.length === 0) {
      var empRes = await EmpresasAPI.list()
      empresas.value = empRes.data || []
    }
    
    var response = await ReportesAPI.list()
    reportes.value = response.data || []
    
    var ahora = new Date()
    fechaActualizacion.value = ahora.toLocaleDateString('es-VE', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    
  } catch (error) {
    console.error('Error cargando reportes:', error)
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los reportes' })
  } finally {
    cargando.value = false
  }
}

function verReporte(id) {
  router.push({ name: 'reporte_detalle', params: { id: id } })
}

async function validarReporte(id) {
  try {
    var result = await Swal.fire({
      title: '✅ Validar reporte',
      text: 'Agrega una nota opcional para la empresa:',
      input: 'textarea',
      inputPlaceholder: 'Ej. Reporte validado correctamente.',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#6b7280',
      confirmButtonText: '✅ Validar',
      cancelButtonText: 'Cancelar'
    })
    
    if (result.isConfirmed) {
      var notas = result.value || ''
      await ReportesAPI.validate(id, notas)
      await cargarReportes()
      Swal.fire({ 
        icon: 'success', 
        title: '✅ Reporte validado', 
        text: 'El reporte ha sido validado correctamente.' 
      })
    }
  } catch (error) {
    console.error('Error validando reporte:', error)
    Swal.fire({ 
      icon: 'error', 
      title: 'Error', 
      text: error.response?.data?.message || 'No se pudo validar el reporte' 
    })
  }
}

async function rechazarReporte(id) {
  try {
    var result = await Swal.fire({
      title: '❌ Rechazar reporte',
      text: 'Indica el motivo del rechazo:',
      input: 'textarea',
      inputPlaceholder: 'Ej. Faltan documentos de soporte.',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: '❌ Rechazar',
      cancelButtonText: 'Cancelar',
      inputValidator: function(value) {
        if (!value || value.trim() === '') {
          return 'Debes agregar un motivo para rechazar el reporte'
        }
        return null
      }
    })
    
    if (result.isConfirmed && result.value) {
      await ReportesAPI.reject(id, result.value)
      await cargarReportes()
      Swal.fire({ 
        icon: 'success', 
        title: '❌ Reporte rechazado', 
        text: 'El reporte ha sido rechazado y devuelto a la empresa.' 
      })
    }
  } catch (error) {
    console.error('Error rechazando reporte:', error)
    Swal.fire({ 
      icon: 'error', 
      title: 'Error', 
      text: error.response?.data?.message || 'No se pudo rechazar el reporte' 
    })
  }
}

async function reabrirReporteAdmin(id) {
  try {
    var result = await Swal.fire({
      title: '🔄 ¿Reabrir reporte?',
      text: 'La empresa podrá editar el reporte nuevamente.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2F6FED',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, reabrir',
      cancelButtonText: 'Cancelar'
    })
    
    if (result.isConfirmed) {
      await ReportesAPI.reabrir(id)
      await cargarReportes()
      Swal.fire({ 
        icon: 'success', 
        title: '✅ Reporte reabierto', 
        text: 'El reporte ha sido reabierto para edición.' 
      })
    }
  } catch (error) {
    console.error('Error reabriendo reporte:', error)
    Swal.fire({ 
      icon: 'error', 
      title: 'Error', 
      text: error.response?.data?.message || 'No se pudo reabrir el reporte' 
    })
  }
}

// ============================================================
// CICLO DE VIDA
// ============================================================
onMounted(function() {
  cargarReportes()
})
</script>

<style scoped>
/* ============================================================
   DASHBOARD CONTAINER
   ============================================================ */
.admin-reportes {
  padding: 1.25rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* ============================================================
   HEADER
   ============================================================ */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 1rem 1.25rem;
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
}

.panel-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a2e;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.panel-title i {
  color: #2F6FED;
}

.panel-sub {
  color: #6b7280;
  font-size: 0.8rem;
  margin: 0.15rem 0 0 0;
}

.panel-sub i {
  margin-right: 0.25rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.period-badge {
  background: #eef2ff;
  color: #2F6FED;
  padding: 0.3rem 0.8rem;
  border-radius: 2rem;
  font-size: 0.7rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;
}

/* ============================================================
   FILTROS
   ============================================================ */
.filter-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.1rem 0.3rem 0.1rem 0.6rem;
  flex: 1 1 auto;
  min-width: 120px;
}

.filter-item .filter-icon {
  font-size: 0.8rem;
}

.filter-item select {
  border: none;
  background: transparent;
  padding: 0.3rem 0.2rem;
  font-size: 0.75rem;
  color: #1a1a2e;
  width: 100%;
  outline: none;
  cursor: pointer;
}

.filter-item select:focus {
  outline: none;
}

.btn-refresh,
.btn-clear {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  border: none;
  border-radius: 0.5rem;
  padding: 0.3rem 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

.btn-refresh {
  background: #2F6FED;
  color: #fff;
}

.btn-refresh:hover {
  background: #1a5cdb;
}

.btn-refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-clear {
  background: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;
}

.btn-clear:hover {
  background: #e5e7eb;
  color: #1a1a2e;
}

.btn-clear:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-text {
  display: inline;
}

.spinning {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ============================================================
   KPI ROW
   ============================================================ */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.kpi-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s;
}

.kpi-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-color: #d1d5db;
}

.kpi-icon {
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.kpi-icon.blue { background: #eef2ff; color: #2F6FED; }
.kpi-icon.green { background: #dcfce7; color: #22c55e; }
.kpi-icon.orange { background: #fef3c7; color: #f59e0b; }
.kpi-icon.red { background: #fee2e2; color: #ef4444; }

.kpi-content {
  flex: 1;
  min-width: 0;
}

.kpi-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a1a2e;
  display: block;
  line-height: 1.2;
}

.kpi-label {
  font-size: 0.65rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-weight: 600;
}

/* ============================================================
   TABLA
   ============================================================ */
.admin-table-wrap {
  background: #ffffff;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.thead-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1.2rem;
  border-bottom: 1px solid #f3f4f6;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.thead-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.thead-left i {
  color: #2F6FED;
  font-size: 1.1rem;
}

.thead-left h3 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0;
}

.count-badge {
  background: #eef2ff;
  color: #2F6FED;
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.1rem 0.5rem;
  border-radius: 1rem;
}

.update-badge {
  font-size: 0.65rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

/* ============================================================
   TABLA ESCRITORIO
   ============================================================ */
.table-wrapper {
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
}

.admin-table thead tr {
  background: #f8fafc;
  border-bottom: 2px solid #e5e7eb;
}

.admin-table th {
  text-align: left;
  padding: 0.6rem 1rem;
  font-weight: 600;
  color: #4b5563;
  text-transform: uppercase;
  font-size: 0.65rem;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.admin-table td {
  padding: 0.6rem 1rem;
  border-bottom: 1px solid #f3f4f6;
  color: #1a1a2e;
  vertical-align: middle;
}

.admin-table tbody tr:hover {
  background: #f8fafc;
}

.admin-table tbody tr:last-child td {
  border-bottom: none;
}

.company-name-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.company-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.stamp-mark {
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.1rem 0.6rem;
  border-radius: 0.5rem;
  white-space: nowrap;
}

.stamp-mark.borrador {
  background: #f3f4f6;
  color: #6b7280;
}

.stamp-mark.cargado {
  background: #fef3c7;
  color: #92400e;
}

.stamp-mark.validado {
  background: #dcfce7;
  color: #166534;
}

.stamp-mark.rechazado {
  background: #fee2e2;
  color: #991b1b;
}

.file-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.65rem;
  color: #4b5563;
  background: #f3f4f6;
  padding: 0.1rem 0.5rem;
  border-radius: 1rem;
}

.action-group {
  display: flex;
  gap: 0.2rem;
  flex-wrap: wrap;
}

/* ============================================================
   BOTONES
   ============================================================ */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  border: none;
  border-radius: 0.4rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.btn-sm {
  padding: 0.2rem 0.5rem;
  font-size: 0.7rem;
}

.btn-ghost {
  background: transparent;
  color: #6b7280;
}

.btn-ghost:hover {
  background: #f3f4f6;
  color: #1a1a2e;
}

.btn-teal {
  background: #22c55e;
  color: #fff;
}

.btn-teal:hover {
  background: #16a34a;
}

.btn-red {
  background: #ef4444;
  color: #fff;
}

.btn-red:hover {
  background: #dc2626;
}

.btn-primary {
  background: #2F6FED;
  color: #fff;
}

.btn-primary:hover {
  background: #1a5cdb;
}

/* ============================================================
   TARJETAS MÓVILES
   ============================================================ */
.mobile-cards {
  display: none;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
}

.mobile-card {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.75rem;
}

.mobile-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.company-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.company-name {
  font-weight: 600;
  font-size: 0.8rem;
  color: #1a1a2e;
}

.mobile-card-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.3rem 0.75rem;
  margin-bottom: 0.5rem;
}

.mobile-field {
  display: flex;
  flex-direction: column;
}

.mobile-field .field-label {
  font-size: 0.55rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.mobile-field .field-value {
  font-size: 0.75rem;
  color: #1a1a2e;
  font-weight: 500;
}

.mobile-card-actions {
  display: flex;
  gap: 0.3rem;
  justify-content: flex-end;
  border-top: 1px solid #e5e7eb;
  padding-top: 0.5rem;
}

/* ============================================================
   LOADING & EMPTY
   ============================================================ */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1rem;
  text-align: center;
}

.loading-state .spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #2F6FED;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 0.5rem;
}

.loading-state p {
  color: #9ca3af;
  font-size: 0.85rem;
  margin: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1rem;
  text-align: center;
}

.empty-state i {
  font-size: 2.5rem;
  color: #d1d5db;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #9ca3af;
  font-size: 0.85rem;
  margin: 0 0 0.75rem 0;
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 992px) {
  .kpi-row {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .admin-table-wrap {
    overflow: hidden;
  }
  
  .table-wrapper {
    display: none;
  }
  
  .mobile-cards {
    display: flex;
  }
}

@media (max-width: 768px) {
  .admin-reportes {
    padding: 0.75rem;
  }
  
  .panel-header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
  }
  
  .panel-title {
    font-size: 1.05rem;
  }
  
  .panel-sub {
    font-size: 0.7rem;
  }
  
  .filter-group {
    padding: 0.5rem;
    gap: 0.4rem;
  }
  
  .filter-item {
    min-width: 80px;
    flex: 1 1 calc(50% - 0.4rem);
  }
  
  .filter-item select {
    font-size: 0.7rem;
    padding: 0.2rem 0;
  }
  
  .btn-refresh .btn-text,
  .btn-clear .btn-text {
    display: none;
  }
  
  .btn-refresh,
  .btn-clear {
    padding: 0.3rem 0.5rem;
    font-size: 0.7rem;
  }
  
  .kpi-row {
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
  
  .kpi-card {
    padding: 0.5rem 0.6rem;
  }
  
  .kpi-icon {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }
  
  .kpi-value {
    font-size: 1rem;
  }
  
  .kpi-label {
    font-size: 0.55rem;
  }
  
  .thead-row {
    padding: 0.5rem 0.75rem;
  }
  
  .thead-left h3 {
    font-size: 0.8rem;
  }
  
  .update-badge {
    font-size: 0.55rem;
  }
  
  .mobile-card-body {
    grid-template-columns: 1fr 1fr;
  }
  
  .mobile-field .field-label {
    font-size: 0.5rem;
  }
  
  .mobile-field .field-value {
    font-size: 0.7rem;
  }
  
  .stamp-mark {
    font-size: 0.6rem;
    padding: 0.05rem 0.4rem;
  }
  
  .action-group .btn-sm,
  .mobile-card-actions .btn-sm {
    padding: 0.15rem 0.4rem;
    font-size: 0.65rem;
  }
  
  .btn-sm {
    padding: 0.15rem 0.4rem;
    font-size: 0.65rem;
  }
}

@media (max-width: 480px) {
  .admin-reportes {
    padding: 0.5rem;
  }
  
  .panel-title {
    font-size: 0.9rem;
  }
  
  .panel-sub {
    font-size: 0.65rem;
  }
  
  .period-badge {
    font-size: 0.6rem;
    padding: 0.2rem 0.6rem;
  }
  
  .filter-item {
    flex: 1 1 100%;
    min-width: 60px;
  }
  
  .filter-item select {
    font-size: 0.65rem;
  }
  
  .btn-refresh,
  .btn-clear {
    padding: 0.2rem 0.4rem;
    font-size: 0.6rem;
  }
  
  .kpi-row {
    grid-template-columns: 1fr 1fr;
    gap: 0.4rem;
  }
  
  .kpi-card {
    padding: 0.4rem 0.5rem;
    gap: 0.4rem;
  }
  
  .kpi-icon {
    width: 28px;
    height: 28px;
    font-size: 0.75rem;
  }
  
  .kpi-value {
    font-size: 0.85rem;
  }
  
  .kpi-label {
    font-size: 0.5rem;
  }
  
  .mobile-card {
    padding: 0.5rem;
  }
  
  .mobile-card-body {
    grid-template-columns: 1fr 1fr;
    gap: 0.2rem 0.5rem;
  }
  
  .mobile-field .field-label {
    font-size: 0.45rem;
  }
  
  .mobile-field .field-value {
    font-size: 0.65rem;
  }
  
  .company-name {
    font-size: 0.7rem;
  }
  
  .stamp-mark {
    font-size: 0.55rem;
    padding: 0.05rem 0.35rem;
  }
  
  .file-chip {
    font-size: 0.55rem;
    padding: 0.05rem 0.35rem;
  }
  
  .action-group .btn-sm,
  .mobile-card-actions .btn-sm {
    padding: 0.1rem 0.35rem;
    font-size: 0.6rem;
  }
  
  .btn-sm {
    padding: 0.1rem 0.35rem;
    font-size: 0.6rem;
  }
}
</style>