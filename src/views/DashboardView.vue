<template>
  <div class="dashboard-container">
    <!-- ============================================================
    HEADER
    ============================================================ -->
    <div class="dashboard-header">
      <div class="header-left">
        <h1 class="header-title">
          <i class="bi bi-speedometer2"></i>
          {{ auth.isAdmin ? 'Panel de Control' : 'Mi Dashboard' }}
        </h1>
        <p class="header-subtitle">
          <i class="bi bi-calendar3"></i>
          {{ auth.isAdmin ? 'Resumen general - ' + periodoLabel : 'Estado de tu empresa - ' + periodoLabel }}
        </p>
      </div>
      <div class="header-right">
        <span class="period-badge">
          <i class="bi bi-calendar-week"></i>
          {{ periodoLabel }}
        </span>
        <button class="btn-refresh" @click="cargarDatos" :disabled="cargando">
          <i class="bi bi-arrow-clockwise" :class="{ spinning: cargando }"></i>
          <span class="btn-text">{{ cargando ? 'Cargando...' : 'Actualizar' }}</span>
        </button>
      </div>
    </div>

    <!-- ============================================================
    ALERTAS
    ============================================================ -->
    <div v-if="alertas.length" class="alertas-container">
      <div 
        v-for="alerta in alertas" 
        :key="alerta.id"
        class="alert"
        :class="alerta.tipo"
      >
        <i class="bi" :class="alerta.icono"></i>
        <span>{{ alerta.mensaje }}</span>
        <button class="alert-close" @click="cerrarAlerta(alerta.id)">×</button>
      </div>
    </div>

    <!-- ============================================================
    KPI CARDS
    ============================================================ -->
    <div class="kpi-grid">
      <div v-for="(kpi, index) in kpis" :key="index" class="kpi-card">
        <div class="kpi-icon" :class="kpi.color">
          <i :class="'bi bi-' + kpi.icon"></i>
        </div>
        <div class="kpi-content">
          <span class="kpi-value">{{ kpi.value }}</span>
          <span class="kpi-label">{{ kpi.label }}</span>
          <span v-if="kpi.trend" class="kpi-trend">{{ kpi.trend }}</span>
          <small v-if="kpi.subtext" class="kpi-subtext">{{ kpi.subtext }}</small>
        </div>
      </div>
    </div>

    <!-- ============================================================
    CONTENIDO PRINCIPAL
    ============================================================ -->
    <div class="dashboard-grid">
      <!-- Actividad reciente -->
      <div class="card card-activity">
        <div class="card-header">
          <div class="card-header-left">
            <i class="bi bi-activity"></i>
            <h3>Actividad reciente</h3>
          </div>
          <span class="card-badge">{{ actividad.length }} eventos</span>
        </div>
        <div class="card-body">
          <div v-if="cargando" class="loading-state">
            <div class="spinner"></div>
            <p>Cargando actividad...</p>
          </div>
          <div class="activity-list" v-else-if="actividad.length">
            <div class="activity-item" v-for="(a, index) in actividad" :key="a.id || index">
              <span class="activity-dot" :class="a.status"></span>
              <div class="activity-content">
                <div class="activity-main">
                  <span class="activity-empresa">{{ a.empresa_nombre || a.empresa || 'Empresa' }}</span>
                  <span class="activity-action">{{ a.status === 'validado' ? 'validó' : a.status === 'cargado' ? 'cargó' : a.status === 'rechazado' ? 'rechazó' : 'creó' }}</span>
                  <span class="activity-period">{{ formatPeriodo(a.periodo) }}</span>
                </div>
                <div class="activity-bottom">
                  <span class="status-badge" :class="a.status">
                    {{ getStatusLabel(a.status) }}
                  </span>
                  <span class="activity-time">
                    <i class="bi bi-clock"></i>
                    {{ formatDate(a.updated_at || a.created_at) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="empty-state" v-else>
            <i class="bi bi-inbox"></i>
            <p>Aún no hay actividad registrada</p>
          </div>
        </div>
      </div>

      <!-- COLUMNA DERECHA -->
      <div class="right-column">
        <!-- Mis Reportes (Empresa) -->
        <div class="card card-reportes" v-if="!auth.isAdmin">
          <div class="card-header">
            <div class="card-header-left">
              <i class="bi bi-file-earmark-text"></i>
              <h3>Mis Reportes</h3>
            </div>
            <span class="card-badge">{{ misReportes.length }}</span>
          </div>
          <div class="card-body">
            <div v-if="cargando" class="loading-state">
              <div class="spinner small"></div>
              <p>Cargando...</p>
            </div>
            <div class="reportes-list" v-else-if="misReportes.length">
              <div class="reporte-item" v-for="r in misReportes.slice(0, 6)" :key="r.periodo || r.id">
                <span class="reporte-periodo">{{ formatPeriodo(r.periodo) }}</span>
                <span class="status-badge" :class="r.status">
                  {{ getStatusLabel(r.status) }}
                </span>
              </div>
            </div>
            <div class="empty-state small" v-else>
              <i class="bi bi-file-earmark-plus"></i>
              <p>Todavía no has cargado ningún reporte</p>
              <router-link :to="{ name: 'reporte' }" class="btn-primary-sm">
                <i class="bi bi-plus-circle"></i> Cargar
              </router-link>
            </div>
          </div>
        </div>

        <!-- Empresas (Admin) -->
        <div class="card card-empresas" v-if="auth.isAdmin">
          <div class="card-header">
            <div class="card-header-left">
              <i class="bi bi-building"></i>
              <h3>Empresas</h3>
            </div>
            <span class="card-badge">{{ empresas.length }}</span>
          </div>
          <div class="card-body">
            <div v-if="cargando" class="loading-state">
              <div class="spinner small"></div>
              <p>Cargando...</p>
            </div>
            <div class="empresas-list" v-else>
              <div class="empresa-item" v-for="emp in empresas.slice(0, 5)" :key="emp.id">
                <div class="empresa-info">
                  <span class="empresa-avatar" :class="{ active: emp.activo, inactive: !emp.activo }">
                    {{ getInitials(emp.nombre) }}
                  </span>
                  <div>
                    <span class="empresa-nombre">{{ emp.nombre }}</span>
                    <span class="empresa-rif">{{ emp.rif || 'Sin RIF' }}</span>
                  </div>
                </div>
                <span class="empresa-status" :class="{ active: emp.activo, inactive: !emp.activo }">
                  <i class="bi" :class="emp.activo ? 'bi-circle-fill' : 'bi-circle'"></i>
                  {{ emp.activo ? 'Activa' : 'Inactiva' }}
                </span>
              </div>
            </div>
            <router-link :to="{ name: 'empresas' }" class="view-all-link">
              Ver todas <i class="bi bi-chevron-right"></i>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { SedesAPI , ReportesAPI } from '../services/api'

const auth = useAuthStore()
const cargando = ref(false)

const empresas = ref([])
const reportes = ref([])
const misReportes = ref([])
const alertas = ref([])

// ============================================================
// UTILIDADES
// ============================================================
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

function formatPeriodo(periodo) {
  if (!periodo) return ''
  var parts = periodo.split('-')
  if (parts.length < 2) return periodo
  var year = parts[0]
  var month = parseInt(parts[1], 10)
  if (isNaN(month) || month < 1 || month > 12) return periodo
  return MESES[month - 1] + ' ' + year
}

function formatDate(date) {
  if (!date) return ''
  var d = new Date(date)
  return d.toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function getStatusLabel(status) {
  var map = {
    borrador: 'Borrador',
    cargado: 'En revisión',
    validado: 'Validado',
    rechazado: 'Rechazado'
  }
  return map[status] || status
}

function getInitials(nombre) {
  if (!nombre) return 'E'
  var parts = nombre.split(' ')
  if (parts.length === 1) return nombre.substring(0, 2).toUpperCase()
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase()
}

function getPeriodoActual() {
  var now = new Date()
  var year = now.getFullYear()
  var month = String(now.getMonth() + 1).padStart(2, '0')
  return year + '-' + month
}

var periodo = getPeriodoActual()
var periodoLabel = formatPeriodo(periodo)

// ============================================================
// DATOS COMPUTADOS
// ============================================================
var reportesPeriodo = computed(function() {
  return reportes.value.filter(function(r) {
    if (!r.periodo) return false
    return r.periodo.startsWith(periodo)
  })
})

var empresasSinReporte = computed(function() {
  var ids = new Set(reportesPeriodo.value.map(function(r) { return r.empresa_id }))
  return empresas.value.filter(function(e) { return !ids.has(e.id) })
})

var kpis = computed(function() {
  if (auth.isAdmin) {
    var validados = reportesPeriodo.value.filter(function(r) { return r.status === 'validado' }).length
    var cargados = reportesPeriodo.value.filter(function(r) { return r.status === 'cargado' }).length
    var rechazados = reportesPeriodo.value.filter(function(r) { return r.status === 'rechazado' }).length
    var sinReporte = empresasSinReporte.value.length
    
    return [
      { 
        label: 'Empresas', 
        value: empresas.value.length, 
        icon: 'building', 
        color: 'blue',
        trend: '↑',
        subtext: 'registradas'
      },
      { 
        label: 'Validados', 
        value: validados, 
        icon: 'check-circle', 
        color: 'green',
        trend: '↑',
        subtext: 'este período'
      },
      { 
        label: 'Pendientes', 
        value: cargados, 
        icon: 'clock', 
        color: 'orange',
        trend: '↻',
        subtext: 'por validar'
      },
      { 
        label: 'Sin reporte', 
        value: sinReporte, 
        icon: 'exclamation-circle', 
        color: 'red',
        trend: '!',
        subtext: 'pendientes de carga'
      }
    ]
  }
  
  var validados = misReportes.value.filter(function(r) { return r.status === 'validado' }).length
  var cargados = misReportes.value.filter(function(r) { return r.status === 'cargado' }).length
  var rechazados = misReportes.value.filter(function(r) { return r.status === 'rechazado' }).length
  var actual = misReportes.value.find(function(r) { return r.periodo === periodo })
  
  var estadoMap = { 
    borrador: 'Borrador', 
    cargado: 'En revisión', 
    validado: 'Validado',
    rechazado: 'Rechazado'
  }
  
  var estadoColor = 'gray'
  if (actual) {
    if (actual.status === 'validado') estadoColor = 'green'
    else if (actual.status === 'cargado') estadoColor = 'orange'
    else if (actual.status === 'rechazado') estadoColor = 'red'
    else estadoColor = 'gray'
  }
  
  return [
    { 
      label: 'Reportes', 
      value: misReportes.value.length, 
      icon: 'file-earmark', 
      color: 'blue',
      trend: '↑',
      subtext: 'totales'
    },
    { 
      label: 'Validados', 
      value: validados, 
      icon: 'check-circle', 
      color: 'green',
      trend: '↑',
      subtext: 'aprobados'
    },
    { 
      label: 'Pendientes', 
      value: cargados + rechazados, 
      icon: 'clock', 
      color: 'orange',
      trend: '↻',
      subtext: 'en revisión'
    },
    { 
      label: 'Estado actual', 
      value: actual ? estadoMap[actual.status] || actual.status : 'Sin cargar', 
      icon: 'info-circle', 
      color: estadoColor,
      trend: '',
      subtext: actual ? 'Período ' + formatPeriodo(actual.periodo) : 'Carga tu reporte'
    }
  ]
})

var actividad = computed(function() {
  var todos = reportes.value.concat(misReportes.value)
  return todos
    .filter(function(r) { return r.status !== 'borrador' })
    .sort(function(a, b) {
      var fechaA = new Date(a.updated_at || a.created_at || 0)
      var fechaB = new Date(b.updated_at || b.created_at || 0)
      return fechaB - fechaA
    })
    .slice(0, 8)
    .map(function(r) {
      return {
        id: r.id,
        status: r.status,
        periodo: r.periodo,
        empresa_nombre: r.empresa_nombre || r.empresa || 'Empresa',
        updated_at: r.updated_at,
        created_at: r.created_at
      }
    })
})

// ============================================================
// ALERTAS
// ============================================================
function agregarAlerta(tipo, mensaje) {
  var iconos = {
    success: 'bi-check-circle-fill',
    warning: 'bi-exclamation-triangle-fill',
    danger: 'bi-x-circle-fill',
    info: 'bi-info-circle-fill'
  }
  alertas.value.unshift({
    id: Date.now(),
    tipo: tipo,
    mensaje: mensaje,
    icono: iconos[tipo] || 'bi-info-circle-fill'
  })
  setTimeout(function() {
    if (alertas.value.length > 0) {
      cerrarAlerta(alertas.value[0].id)
    }
  }, 5000)
}

function cerrarAlerta(id) {
  var index = alertas.value.findIndex(function(a) { return a.id === id })
  if (index !== -1) alertas.value.splice(index, 1)
}

// ============================================================
// CARGAR DATOS
// ============================================================
async function cargarDatos() {
  try {
    cargando.value = true
    alertas.value = []
    
    if (auth.isAdmin) {
      var [empresasRes, reportesRes] = await Promise.all([
        EmpresasAPI.list(),
        ReportesAPI.list({ limit: 100 })
      ])
      
      empresas.value = empresasRes.data || []
      reportes.value = reportesRes.data || []
      
      agregarAlerta('success', 'Datos actualizados: ' + empresas.value.length + ' empresas, ' + reportes.value.length + ' reportes')
      
    } else if (auth.empresaId) {
      var reportesRes = await ReportesAPI.getByEmpresa(auth.empresaId)
      misReportes.value = reportesRes.data || []
      
      agregarAlerta('info', 'Cargados ' + misReportes.value.length + ' reportes de tu empresa')
    }
    
  } catch (error) {
    console.error('Error cargando dashboard:', error)
    agregarAlerta('danger', 'Error al cargar los datos del dashboard')
  } finally {
    cargando.value = false
  }
}

// ============================================================
// CICLO DE VIDA
// ============================================================
onMounted(function() {
  cargarDatos()
})
</script>

<style scoped>
/* ============================================================
   DASHBOARD CONTAINER
   ============================================================ */
.dashboard-container {
  padding: 1.25rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* ============================================================
   HEADER
   ============================================================ */
.dashboard-header {
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

.header-left {
  flex: 1;
  min-width: 200px;
}

.header-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-title i {
  color: #2F6FED;
}

.header-subtitle {
  color: #6b7280;
  font-size: 0.8rem;
  margin: 0.15rem 0 0 0;
}

.header-subtitle i {
  margin-right: 0.25rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.period-badge {
  background: #eef2ff;
  color: #2F6FED;
  padding: 0.3rem 0.8rem;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.35rem 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #4b5563;
  font-size: 0.8rem;
  font-weight: 500;
}

.btn-refresh:hover {
  background: #e5e7eb;
  border-color: #d1d5db;
  color: #1a1a2e;
}

.btn-refresh:disabled {
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
   ALERTAS
   ============================================================ */
.alertas-container {
  margin-bottom: 1.25rem;
}

.alertas-container .alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 1rem;
  border-radius: 0.6rem;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  border: 1px solid transparent;
}

.alertas-container .alert i {
  font-size: 1.1rem;
  flex-shrink: 0;
}

.alertas-container .alert span {
  flex: 1;
}

.alertas-container .alert .alert-close {
  background: none;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  padding: 0 0.25rem;
  line-height: 1;
}

.alertas-container .alert .alert-close:hover {
  opacity: 1;
}

.alert.success {
  background: #dcfce7;
  border-color: #86efac;
  color: #166534;
}

.alert.warning {
  background: #fef3c7;
  border-color: #fcd34d;
  color: #92400e;
}

.alert.danger {
  background: #fee2e2;
  border-color: #fca5a5;
  color: #991b1b;
}

.alert.info {
  background: #e0f2fe;
  border-color: #7dd3fc;
  color: #075985;
}

/* ============================================================
   KPI GRID
   ============================================================ */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.kpi-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s;
}

.kpi-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  border-color: #d1d5db;
}

.kpi-icon {
  width: 44px;
  height: 44px;
  border-radius: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.kpi-icon.blue { background: #eef2ff; color: #2F6FED; }
.kpi-icon.green { background: #dcfce7; color: #22c55e; }
.kpi-icon.orange { background: #fef3c7; color: #f59e0b; }
.kpi-icon.red { background: #fee2e2; color: #ef4444; }
.kpi-icon.purple { background: #ede9fe; color: #8b5cf6; }
.kpi-icon.gray { background: #f3f4f6; color: #6b7280; }

.kpi-content {
  flex: 1;
  min-width: 0;
}

.kpi-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a1a2e;
  display: block;
  line-height: 1.2;
}

.kpi-label {
  font-size: 0.7rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-weight: 600;
}

.kpi-trend {
  font-size: 0.7rem;
  margin-left: 0.2rem;
}

.kpi-subtext {
  font-size: 0.65rem;
  color: #9ca3af;
  display: block;
}

/* ============================================================
   DASHBOARD GRID
   ============================================================ */
.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.25rem;
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* ============================================================
   CARDS
   ============================================================ */
.card {
  background: #ffffff;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  border-color: #d1d5db;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1.2rem;
  border-bottom: 1px solid #f3f4f6;
}

.card-header-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-header-left i {
  font-size: 1.1rem;
  color: #2F6FED;
}

.card-header h3 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0;
}

.card-badge {
  font-size: 0.65rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 0.15rem 0.7rem;
  border-radius: 1rem;
  font-weight: 500;
}

.card-body {
  padding: 0.8rem 1.2rem 1rem;
}

/* ============================================================
   LOADING STATE
   ============================================================ */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  text-align: center;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #e5e7eb;
  border-top-color: #2F6FED;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 0.5rem;
}

.spinner.small {
  width: 20px;
  height: 20px;
  border-width: 2px;
}

.loading-state p {
  color: #9ca3af;
  font-size: 0.8rem;
  margin: 0;
}

/* ============================================================
   ACTIVITY LIST
   ============================================================ */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  padding: 0.6rem 0.8rem;
  border-radius: 0.5rem;
  transition: background 0.15s;
  border-bottom: 1px solid #f3f4f6;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-item:hover {
  background: #f9fafb;
}

.activity-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 0.3rem;
}

.activity-dot.validado {
  background: #22c55e;
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.3);
}

.activity-dot.cargado {
  background: #f59e0b;
  box-shadow: 0 0 8px rgba(245, 158, 11, 0.3);
}

.activity-dot.borrador {
  background: #6b7280;
}

.activity-dot.rechazado {
  background: #ef4444;
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.3);
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-main {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  flex-wrap: wrap;
}

.activity-empresa {
  font-weight: 600;
  color: #1a1a2e;
  font-size: 0.8rem;
}

.activity-action {
  color: #6b7280;
  font-size: 0.75rem;
}

.activity-period {
  color: #6b7280;
  font-size: 0.7rem;
  background: #f3f4f6;
  padding: 0 0.5rem;
  border-radius: 0.5rem;
}

.activity-bottom {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.15rem;
  flex-wrap: wrap;
}

.activity-time {
  font-size: 0.65rem;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 0.15rem;
}

/* ============================================================
   REPORTES LIST
   ============================================================ */
.reportes-list {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.reporte-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.6rem;
  border-radius: 0.4rem;
  transition: background 0.15s;
  border-bottom: 1px solid #f3f4f6;
}

.reporte-item:last-child {
  border-bottom: none;
}

.reporte-item:hover {
  background: #f9fafb;
}

.reporte-periodo {
  font-weight: 500;
  color: #1a1a2e;
  font-size: 0.8rem;
}

/* ============================================================
   EMPRESAS LIST
   ============================================================ */
.empresas-list {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.empresa-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.6rem;
  border-radius: 0.4rem;
  transition: background 0.15s;
  border-bottom: 1px solid #f3f4f6;
}

.empresa-item:last-child {
  border-bottom: none;
}

.empresa-item:hover {
  background: #f9fafb;
}

.empresa-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.empresa-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.empresa-avatar.active {
  background: #22c55e;
}

.empresa-avatar.inactive {
  background: #9ca3af;
}

.empresa-nombre {
  font-weight: 500;
  color: #1a1a2e;
  font-size: 0.8rem;
}

.empresa-rif {
  font-size: 0.65rem;
  color: #9ca3af;
  display: block;
}

.empresa-status {
  font-size: 0.6rem;
  font-weight: 600;
  padding: 0.1rem 0.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  white-space: nowrap;
}

.empresa-status.active {
  background: #dcfce7;
  color: #166534;
}

.empresa-status.inactive {
  background: #f3f4f6;
  color: #6b7280;
}

.view-all-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.5rem;
  margin-top: 0.5rem;
  color: #2F6FED;
  font-size: 0.8rem;
  font-weight: 500;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: background 0.15s;
}

.view-all-link:hover {
  background: #eef2ff;
}

/* ============================================================
   STATUS BADGE
   ============================================================ */
.status-badge {
  font-size: 0.6rem;
  font-weight: 600;
  padding: 0.1rem 0.6rem;
  border-radius: 0.5rem;
}

.status-badge.borrador {
  background: #f3f4f6;
  color: #6b7280;
}

.status-badge.cargado {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.validado {
  background: #dcfce7;
  color: #166534;
}

.status-badge.rechazado {
  background: #fee2e2;
  color: #991b1b;
}

/* ============================================================
   EMPTY STATE
   ============================================================ */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  text-align: center;
}

.empty-state i {
  font-size: 2rem;
  color: #d1d5db;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #9ca3af;
  font-size: 0.8rem;
  margin: 0 0 0.5rem 0;
}

.empty-state.small {
  padding: 1rem;
}

.empty-state.small i {
  font-size: 1.5rem;
}

.empty-state.small p {
  font-size: 0.75rem;
}

.btn-primary-sm {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.8rem;
  background: #2F6FED;
  color: #fff;
  border: none;
  border-radius: 0.4rem;
  font-size: 0.7rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
}

.btn-primary-sm:hover {
  background: #1a5cdb;
  color: #fff;
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 1200px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 992px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .right-column {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 0.75rem;
  }
  
  .dashboard-header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
  }
  
  .header-title {
    font-size: 1.1rem;
  }
  
  .header-right {
    justify-content: space-between;
  }
  
  .btn-text {
    display: none;
  }
  
  .period-badge {
    font-size: 0.65rem;
    padding: 0.2rem 0.6rem;
  }
  
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  .kpi-card {
    padding: 0.7rem 0.8rem;
  }
  
  .kpi-icon {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
  
  .kpi-value {
    font-size: 1.1rem;
  }
  
  .kpi-label {
    font-size: 0.6rem;
  }
  
  .right-column {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .card-header {
    padding: 0.6rem 0.8rem;
  }
  
  .card-header h3 {
    font-size: 0.8rem;
  }
  
  .card-body {
    padding: 0.6rem 0.8rem 0.8rem;
  }
  
  .activity-item {
    padding: 0.4rem 0.5rem;
    flex-wrap: wrap;
  }
  
  .activity-main {
    flex-wrap: wrap;
  }
  
  .activity-empresa {
    font-size: 0.75rem;
  }
  
  .activity-action {
    font-size: 0.7rem;
  }
  
  .activity-period {
    font-size: 0.65rem;
  }
  
  .activity-bottom {
    flex-wrap: wrap;
    gap: 0.3rem;
  }
  
  .empresa-item,
  .reporte-item {
    flex-wrap: wrap;
    padding: 0.4rem 0.5rem;
    gap: 0.3rem;
  }
  
  .empresa-nombre {
    font-size: 0.75rem;
  }
  
  .empresa-rif {
    font-size: 0.6rem;
  }
  
  .empresa-avatar {
    width: 24px;
    height: 24px;
    font-size: 0.5rem;
  }
}

@media (max-width: 480px) {
  .dashboard-container {
    padding: 0.5rem;
  }
  
  .kpi-grid {
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
  
  .kpi-card {
    padding: 0.5rem 0.6rem;
    gap: 0.5rem;
  }
  
  .kpi-icon {
    width: 30px;
    height: 30px;
    font-size: 0.85rem;
    border-radius: 0.4rem;
  }
  
  .kpi-value {
    font-size: 0.95rem;
  }
  
  .kpi-label {
    font-size: 0.55rem;
  }
  
  .kpi-subtext {
    font-size: 0.5rem;
  }
  
  .header-title {
    font-size: 0.95rem;
  }
  
  .header-subtitle {
    font-size: 0.7rem;
  }
  
  .card-header h3 {
    font-size: 0.75rem;
  }
  
  .card-badge {
    font-size: 0.55rem;
    padding: 0.1rem 0.5rem;
  }
  
  .activity-empresa {
    font-size: 0.7rem;
  }
  
  .activity-action {
    font-size: 0.65rem;
  }
  
  .activity-period {
    font-size: 0.6rem;
  }
  
  .activity-time {
    font-size: 0.55rem;
  }
  
  .status-badge {
    font-size: 0.55rem;
    padding: 0.05rem 0.4rem;
  }
  
  .empresa-status {
    font-size: 0.55rem;
    padding: 0.05rem 0.4rem;
  }
  
  .view-all-link {
    font-size: 0.7rem;
    padding: 0.3rem;
  }
  
  .btn-primary-sm {
    font-size: 0.65rem;
    padding: 0.2rem 0.6rem;
  }
}
</style>