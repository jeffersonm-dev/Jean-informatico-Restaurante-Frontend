<template>
  <div class="reporte-general" ref="reporteRef">
    <!-- ============================================ -->
    <!-- HEADER CON ANIMACIÓN -->
    <!-- ============================================ -->
    <div class="panel-header fade-in">
      <div>
        <div class="panel-title-group">
          <span class="title-icon">📊</span>
          <div>
            <div class="panel-title">Reporte General</div>
            <div class="panel-sub">
              <i class="bi bi-calendar3"></i>
              Consolidado de todas las empresas para <strong>{{ periodoLabel }}</strong>
            </div>
          </div>
        </div>
      </div>
      <div class="filter-group">
        <div class="filter-item">
          <i class="bi bi-calendar3"></i>
          <select v-model.number="mes" @change="loadData">
            <option v-for="(m, i) in MESES" :key="m" :value="i + 1">{{ m }}</option>
          </select>
        </div>
        <div class="filter-item">
          <i class="bi bi-calendar"></i>
          <select v-model.number="anio" @change="loadData">
            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
        <div class="filter-actions">
          <button class="btn btn-primary btn-sm" @click="exportPDF" :disabled="cargando">
            <i class="bi bi-file-pdf"></i> PDF
          </button>
          <button class="btn btn-success btn-sm" @click="exportExcel" :disabled="cargando">
            <i class="bi bi-file-earmark-excel"></i> Excel
          </button>
          <button class="btn btn-ghost btn-sm" @click="loadData" :disabled="cargando">
            <i class="bi bi-arrow-clockwise" :class="{ spinning: cargando }"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- TARJETAS DE MÉTRICAS -->
    <!-- ============================================ -->
    <div class="metrics-grid">
      <div class="metric-card animate-up" style="animation-delay: 0.05s">
        <div class="metric-icon" style="background: #dbeafe; color: #2563eb;">
          <i class="bi bi-building"></i>
        </div>
        <div class="metric-content">
          <span class="metric-label">Empresas</span>
          <span class="metric-value">{{ empresas.length }}</span>
          <span class="metric-sub">{{ empresasConReporte }} con reporte</span>
        </div>
      </div>

      <div class="metric-card animate-up" style="animation-delay: 0.1s">
        <div class="metric-icon" style="background: #dcfce7; color: #16a34a;">
          <i class="bi bi-check-circle"></i>
        </div>
        <div class="metric-content">
          <span class="metric-label">Validados</span>
          <span class="metric-value">{{ conteo.validado }}</span>
          <span class="metric-sub">{{ pctCompletado }}% completado</span>
        </div>
      </div>

      <div class="metric-card animate-up" style="animation-delay: 0.15s">
        <div class="metric-icon" style="background: #fef3c7; color: #d97706;">
          <i class="bi bi-clock"></i>
        </div>
        <div class="metric-content">
          <span class="metric-label">Pendientes</span>
          <span class="metric-value">{{ conteo.sinreporte }}</span>
          <span class="metric-sub">sin cargar</span>
        </div>
      </div>

      <div class="metric-card animate-up" style="animation-delay: 0.2s">
        <div class="metric-icon" style="background: #fce4ec; color: #dc2626;">
          <i class="bi bi-exclamation-triangle"></i>
        </div>
        <div class="metric-content">
          <span class="metric-label">Rechazados</span>
          <span class="metric-value">{{ conteo.rechazado || 0 }}</span>
          <span class="metric-sub">requieren revisión</span>
        </div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- GRÁFICOS -->
    <!-- ============================================ -->
    <div class="charts-row">
      <div class="chart-card animate-up" style="animation-delay: 0.25s">
        <div class="chart-header">
          <div class="chart-title">
            <i class="bi bi-bar-chart-fill"></i>
            Ingresos por Empresa
          </div>
          <span class="chart-badge">TOP {{ empresasConIngresos.length }}</span>
        </div>
        <div class="chart-wrapper">
          <canvas ref="barChartCanvas"></canvas>
        </div>
      </div>

      <div class="chart-card animate-up" style="animation-delay: 0.3s">
        <div class="chart-header">
          <div class="chart-title">
            <i class="bi bi-pie-chart-fill"></i>
            Distribución de Estados
          </div>
          <span class="chart-badge">{{ empresas.length }} empresas</span>
        </div>
        <div class="chart-wrapper">
          <canvas ref="doughnutChartCanvas"></canvas>
        </div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- COMPARATIVA POR INDICADOR (un gráfico por métrica) -->
    <!-- ============================================ -->
    <div class="section-header animate-up" style="animation-delay: 0.32s; margin-top: 8px;">
      <h4>
        <i class="bi bi-bar-chart-line"></i>
        Comparativa por Indicador
        <span class="section-chip">{{ empresas.length }} empresas</span>
      </h4>
    </div>
    <div class="metric-charts-grid">
      <div
        v-for="(metrica, i) in METRICAS"
        :key="metrica.key"
        class="chart-card animate-up"
        :style="{ animationDelay: `${0.35 + i * 0.03}s` }"
      >
        <div class="chart-header">
          <div class="chart-title">
            <i class="bi" :class="metrica.icon"></i>
            {{ metrica.label }}
          </div>
        </div>
        <div class="chart-wrapper compact">
          <canvas :ref="el => setMetricChartRef(el, i)"></canvas>
        </div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- RESUMEN FINANCIERO CONSOLIDADO -->
    <!-- ============================================ -->
    <div class="finan-card animate-up" style="animation-delay: 0.35s">
      <div class="finan-header">
        <div class="finan-title">
          <i class="bi bi-wallet2"></i>
          Resumen Financiero Consolidado
        </div>
        <span class="finan-badge">{{ periodoLabel }}</span>
      </div>
      <div class="finan-grid">
        <div class="finan-item">
          <span class="finan-label">
            <i class="bi bi-arrow-up-circle" style="color: #22c55e;"></i>
            Ingresos
          </span>
          <span class="finan-value">$ {{ formatNumber(totales.totalIngresos) }}</span>
        </div>
        <div class="finan-item">
          <span class="finan-label">
            <i class="bi bi-arrow-down-circle" style="color: #ef4444;"></i>
            Gastos + Costos
          </span>
          <span class="finan-value">$ {{ formatNumber(totales.totalGastos + totales.totalCostos) }}</span>
        </div>
        <div class="finan-item highlight">
          <span class="finan-label">
            <i class="bi bi-currency-dollar" style="color: #60a5fa;"></i>
            Flujo Neto
          </span>
          <span class="finan-value" :class="flujoNeto >= 0 ? 'positive' : 'negative'">
            $ {{ formatNumber(flujoNeto) }}
          </span>
        </div>
        <div class="finan-item">
          <span class="finan-label">
            <i class="bi bi-receipt" style="color: #60a5fa;"></i>
            Cuentas por cobrar
          </span>
          <span class="finan-value">$ {{ formatNumber(totales.totalCuentasCobrar) }}</span>
        </div>
        <div class="finan-item">
          <span class="finan-label">
            <i class="bi bi-receipt-cutoff" style="color: #ef4444;"></i>
            Cuentas por pagar
          </span>
          <span class="finan-value">$ {{ formatNumber(totales.totalCuentasPagar) }}</span>
        </div>
        <div class="finan-item">
          <span class="finan-label">
            <i class="bi bi-graph-up" style="color: #22c55e;"></i>
            Utilidad bruta
          </span>
          <span class="finan-value">$ {{ formatNumber(totales.totalUtilidadBruta) }}</span>
        </div>
        <div class="finan-item">
          <span class="finan-label">
            <i class="bi bi-pie-chart" style="color: #60a5fa;"></i>
            Utilidad a distribuir
          </span>
          <span class="finan-value">$ {{ formatNumber(totales.totalUtilidadDistribuir) }}</span>
        </div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- TABLA DE EMPRESAS -->
    <!-- ============================================ -->
    <div class="company-section animate-up" style="animation-delay: 0.4s">
      <div class="section-header">
        <h4>
          <i class="bi bi-building"></i>
          Detalle por Empresa
          <span class="section-chip">{{ empresas.length }}</span>
        </h4>
        <div class="section-actions">
          <button class="btn btn-ghost btn-sm" @click="toggleExpandAll">
            <i class="bi" :class="expandAll ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
            {{ expandAll ? 'Colapsar' : 'Expandir' }} todo
          </button>
        </div>
      </div>

      <!-- TABLA PARA EL PDF -->
      <div class="table-responsive" id="tabla-reporte">
        <table class="report-table">
          <thead>
            <tr>
              <th>#</th>
              <th class="sticky-col">Empresa</th>
              <th>RIF</th>
              <th>Estado</th>
              <th class="text-right">Ingresos ($)</th>
              <th class="text-right">Gastos ($)</th>
              <th class="text-right">Costos ($)</th>
              <th class="text-right">Saldo ($)</th>
              <th class="text-right">Cuentas x Cobrar ($)</th>
              <th class="text-right">Cuentas x Pagar ($)</th>
              <th class="text-right">Utilidad Bruta ($)</th>
              <th class="text-right">Utilidad a Distribuir ($)</th>
              <th class="text-right">Flujo Neto ($)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(e, index) in empresas" :key="e.id">
              <td>{{ index + 1 }}</td>
              <td class="sticky-col">{{ e.nombre || 'Sin nombre' }}</td>
              <td>{{ e.rif || 'N/A' }}</td>
              <td>
                <span class="status-badge" :class="estadoDe(e.id)">
                  {{ estadoLabel(estadoDe(e.id)) }}
                </span>
              </td>
              <td class="text-right">$ {{ formatNumber(reporteDe(e.id)?.total_ingresos || 0) }}</td>
              <td class="text-right">$ {{ formatNumber(reporteDe(e.id)?.total_gastos || 0) }}</td>
              <td class="text-right">$ {{ formatNumber(reporteDe(e.id)?.total_costos || 0) }}</td>
              <td class="text-right">$ {{ formatNumber(reporteDe(e.id)?.saldo_banco_caja || 0) }}</td>
              <td class="text-right">$ {{ formatNumber(reporteDe(e.id)?.cuentas_cobrar || 0) }}</td>
              <td class="text-right">$ {{ formatNumber(reporteDe(e.id)?.cuentas_pagar || 0) }}</td>
              <td class="text-right">$ {{ formatNumber(reporteDe(e.id)?.utilidad_bruta || 0) }}</td>
              <td class="text-right">$ {{ formatNumber(reporteDe(e.id)?.utilidad_distribuir || 0) }}</td>
              <td class="text-right" :class="flujoDe(e.id) >= 0 ? 'positive' : 'negative'">
                $ {{ formatNumber(flujoDe(e.id)) }}
              </td>
            </tr>
            <!-- FILA DE TOTALES -->
            <tr class="total-row">
              <td colspan="4"><strong>TOTALES</strong></td>
              <td class="text-right"><strong>$ {{ formatNumber(totales.totalIngresos) }}</strong></td>
              <td class="text-right"><strong>$ {{ formatNumber(totales.totalGastos) }}</strong></td>
              <td class="text-right"><strong>$ {{ formatNumber(totales.totalCostos) }}</strong></td>
              <td class="text-right"><strong>$ {{ formatNumber(totales.totalIngresos - totales.totalGastos - totales.totalCostos) }}</strong></td>
              <td class="text-right"><strong>$ {{ formatNumber(totales.totalCuentasCobrar) }}</strong></td>
              <td class="text-right"><strong>$ {{ formatNumber(totales.totalCuentasPagar) }}</strong></td>
              <td class="text-right"><strong>$ {{ formatNumber(totales.totalUtilidadBruta) }}</strong></td>
              <td class="text-right"><strong>$ {{ formatNumber(totales.totalUtilidadDistribuir) }}</strong></td>
              <td class="text-right" :class="flujoNeto >= 0 ? 'positive' : 'negative'">
                <strong>$ {{ formatNumber(flujoNeto) }}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="scroll-hint">
        <i class="bi bi-arrow-left-right"></i> Desliza para ver todas las columnas
      </p>

      <div v-if="cargando" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando datos financieros...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useAuthStore } from '../stores/auth'
import { EmpresasAPI, ReportesAPI } from '../services/api'
import Chart from 'chart.js/auto'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const auth = useAuthStore()
const reporteRef = ref(null)
const cargando = ref(false)
const expandAll = ref(false)
const expandedItems = ref(new Set())

// Referencias para los gráficos
const barChartCanvas = ref(null)
const doughnutChartCanvas = ref(null)
let barChartInstance = null
let doughnutChartInstance = null

// ============================================
// CONSTANTES
// ============================================
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

// ============================================
// ESTADO
// ============================================
const now = new Date()
const mes = ref(now.getMonth() + 1)
const anio = ref(now.getFullYear())
const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i)

const empresas = ref([])
const reportes = ref([])

// Un gráfico de barras por indicador financiero, comparando todas las
// empresas. Mismo color por empresa en los 8 gráficos (la identidad es la
// empresa, no la métrica), asignado por orden fijo — paleta categórica
// validada (colorblind-safe, ver skill dataviz) contra el fondo blanco
// de las tarjetas de esta vista.
const METRICAS = [
  { key: 'total_ingresos', label: 'Total Ingresos', icon: 'bi-arrow-up-circle' },
  { key: 'total_gastos', label: 'Total Gastos', icon: 'bi-arrow-down-circle' },
  { key: 'total_costos', label: 'Total Costos', icon: 'bi-cash-stack' },
  { key: 'saldo_banco_caja', label: 'Saldo Banco/Caja', icon: 'bi-bank' },
  { key: 'cuentas_cobrar', label: 'Cuentas por Cobrar', icon: 'bi-receipt' },
  { key: 'cuentas_pagar', label: 'Cuentas por Pagar', icon: 'bi-receipt-cutoff' },
  { key: 'utilidad_bruta', label: 'Utilidad Bruta', icon: 'bi-graph-up-arrow' },
  { key: 'utilidad_distribuir', label: 'Utilidad a Distribuir', icon: 'bi-pie-chart' }
]
const EMPRESA_COLORS = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948']
function colorForEmpresaIndex(i) {
  return EMPRESA_COLORS[i % EMPRESA_COLORS.length]
}

const metricChartCanvases = ref([])
function setMetricChartRef(el, i) {
  if (el) metricChartCanvases.value[i] = el
}
let metricChartInstances = []

// ============================================
// COMPUTED - Match por nombre de empresa
// ============================================
const periodo = computed(() => `${anio.value}-${String(mes.value).padStart(2, '0')}`)

const periodoLabel = computed(() => {
  const m = MESES[mes.value - 1]
  return `${m} ${anio.value}`
})

// Filtra reportes por periodo
const reportesPeriodo = computed(() => {
  const periodoStr = periodo.value // ej: "2026-08"

  return reportes.value.filter(r => {
    if (!r.periodo) return false

    const rPeriodo = String(r.periodo)

    // Comparar periodo (YYYY-MM)
    let matchPeriodo = false
    if (rPeriodo.length >= 7) {
      const rPeriodoShort = rPeriodo.substring(0, 7)
      matchPeriodo = rPeriodoShort === periodoStr
    } else {
      matchPeriodo = rPeriodo === periodoStr
    }

    return matchPeriodo
  })
})

// 🔥 NUEVO: Buscar reporte por nombre de empresa (NO por ID)
function reporteDe(empresaId) {
  const empresa = empresas.value.find(e => e.id === empresaId)
  if (!empresa) return null

  // Buscar por nombre de empresa (match exacto ignorando mayúsculas/minúsculas y espacios)
  return reportesPeriodo.value.find(r => {
    const nombreReporte = r.empresa_nombre?.trim().toLowerCase()
    const nombreEmpresa = empresa.nombre?.trim().toLowerCase()
    return nombreReporte === nombreEmpresa
  })
}

function estadoDe(empresaId) {
  const r = reporteDe(empresaId)
  if (!r) return 'sinreporte'
  return r.status || 'borrador'
}

function estadoLabel(estado) {
  const map = {
    validado: '✅ Validado',
    cargado: '⏳ Cargado',
    borrador: '📝 Borrador',
    rechazado: '❌ Rechazado',
    sinreporte: '📭 Sin reporte'
  }
  return map[estado] || estado
}

function flujoDe(empresaId) {
  const r = reporteDe(empresaId)
  if (!r) return 0
  return (parseFloat(r.total_ingresos) || 0) -
         (parseFloat(r.total_gastos) || 0) -
         (parseFloat(r.total_costos) || 0)
}

const empresasConReporte = computed(() => {
  return reportesPeriodo.value.filter(r => r.status !== 'borrador' && r.status !== 'rechazado').length
})

const empresasConIngresos = computed(() => {
  return empresas.value
    .map(e => ({
      ...e,
      ingresos: parseFloat(reporteDe(e.id)?.total_ingresos) || 0
    }))
    .filter(e => e.ingresos > 0)
    .sort((a, b) => b.ingresos - a.ingresos)
    .slice(0, 10)
})

const pctCompletado = computed(() => {
  if (!empresas.value.length) return 0
  return Math.round((empresasConReporte.value / empresas.value.length) * 100)
})

const conteo = computed(() => {
  const validado = reportesPeriodo.value.filter(r => r.status === 'validado').length
  const cargado = reportesPeriodo.value.filter(r => r.status === 'cargado').length
  const rechazado = reportesPeriodo.value.filter(r => r.status === 'rechazado').length
  const sinreporte = Math.max(empresas.value.length - validado - cargado - rechazado, 0)
  return { validado, cargado, rechazado, sinreporte }
})

const totales = computed(() => {
  return reportesPeriodo.value.reduce((acc, r) => {
    acc.totalIngresos += parseFloat(r.total_ingresos) || 0
    acc.totalGastos += parseFloat(r.total_gastos) || 0
    acc.totalCostos += parseFloat(r.total_costos) || 0
    acc.totalCuentasCobrar += parseFloat(r.cuentas_cobrar) || 0
    acc.totalCuentasPagar += parseFloat(r.cuentas_pagar) || 0
    acc.totalUtilidadBruta += parseFloat(r.utilidad_bruta) || 0
    acc.totalUtilidadDistribuir += parseFloat(r.utilidad_distribuir) || 0
    return acc
  }, {
    totalIngresos: 0, totalGastos: 0, totalCostos: 0,
    totalCuentasCobrar: 0, totalCuentasPagar: 0, totalUtilidadBruta: 0, totalUtilidadDistribuir: 0
  })
})

const flujoNeto = computed(() => {
  return totales.value.totalIngresos - totales.value.totalGastos - totales.value.totalCostos
})

// ============================================
// FUNCIONES UTILITARIAS
// ============================================
function formatNumber(num) {
  if (num === undefined || num === null || isNaN(num)) return '0.00'
  return Number(num).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function toggleExpand(id) {
  if (expandedItems.value.has(id)) {
    expandedItems.value.delete(id)
  } else {
    expandedItems.value.add(id)
  }
}

function isExpanded(id) {
  return expandedItems.value.has(id)
}

function toggleExpandAll() {
  expandAll.value = !expandAll.value
  if (expandAll.value) {
    empresas.value.forEach(e => expandedItems.value.add(e.id))
  } else {
    expandedItems.value.clear()
  }
}

// ============================================
// GRÁFICOS
// ============================================
function renderCharts() {
  nextTick(() => {
    // --- BAR CHART ---
    if (barChartCanvas.value) {
      if (barChartInstance) {
        barChartInstance.destroy()
      }

      const ctx = barChartCanvas.value.getContext('2d')
      const data = empresasConIngresos.value

      barChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.map(e => e.nombre?.substring(0, 20) || 'Empresa'),
          datasets: [{
            label: 'Ingresos ($)',
            data: data.map(e => e.ingresos),
            backgroundColor: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#1d4ed8', '#1e40af', '#1e3a5f', '#2d6fb0', '#4a8bf7'],
            borderRadius: 6,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => '$' + value.toLocaleString()
              }
            }
          }
        }
      })
    }

    // --- DOUGHNUT CHART ---
    if (doughnutChartCanvas.value) {
      if (doughnutChartInstance) {
        doughnutChartInstance.destroy()
      }

      const ctx = doughnutChartCanvas.value.getContext('2d')

      doughnutChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Validado', 'Cargado', 'Sin reporte', 'Rechazado'],
          datasets: [{
            data: [conteo.value.validado, conteo.value.cargado, conteo.value.sinreporte, conteo.value.rechazado || 0],
            backgroundColor: ['#22c55e', '#f59e0b', '#d1d5db', '#ef4444'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 16,
                usePointStyle: true,
                pointStyle: 'circle'
              }
            }
          },
          cutout: '65%'
        }
      })
    }

    // --- GRÁFICOS POR INDICADOR (uno por métrica, comparando empresas) ---
    metricChartInstances.forEach(c => c?.destroy())
    metricChartInstances = METRICAS.map((metrica, i) => {
      const canvas = metricChartCanvases.value[i]
      if (!canvas) return null

      const labels = empresas.value.map(e => e.nombre?.substring(0, 18) || 'Empresa')
      const data = empresas.value.map(e => parseFloat(reporteDe(e.id)?.[metrica.key]) || 0)
      const colors = empresas.value.map((_, idx) => colorForEmpresaIndex(idx))

      return new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: metrica.label,
            data,
            backgroundColor: colors,
            borderRadius: 4,
            borderSkipped: false,
            maxBarThickness: 40
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ' $' + formatNumber(ctx.parsed.y)
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: (value) => '$' + value.toLocaleString() },
              grid: { color: '#f0ebe0' }
            },
            x: {
              grid: { display: false }
            }
          }
        }
      })
    })
  })
}

// ============================================
// EXPORTAR PDF
// ============================================
function exportPDF() {
  try {
    const doc = new jsPDF('l', 'mm', 'a4')

    // --- TITULO ---
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(37, 99, 235)
    doc.text('REPORTE GENERAL', doc.internal.pageSize.getWidth() / 2, 18, { align: 'center' })

    // --- SUBTITULO ---
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(80, 80, 80)
    doc.text(`Periodo: ${periodoLabel.value}`, doc.internal.pageSize.getWidth() / 2, 26, { align: 'center' })

    // --- FECHA ---
    doc.setFontSize(9)
    doc.setTextColor(150, 150, 150)
    const dateStr = new Date().toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    doc.text(`Generado: ${dateStr}`, doc.internal.pageSize.getWidth() - 20, 10, { align: 'right' })

    // --- RESUMEN EJECUTIVO ---
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    let yPos = 36

    // Cuadro de resumen
    doc.setFillColor(245, 247, 250)
    doc.rect(14, yPos - 2, doc.internal.pageSize.getWidth() - 28, 26, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)

    // Columna 1
    doc.text(`Total Empresas: ${empresas.value.length}`, 20, yPos + 5)
    doc.text(`Con Reporte: ${empresasConReporte.value}`, 20, yPos + 11)
    doc.text(`Completado: ${pctCompletado.value}%`, 20, yPos + 17)
    doc.text(`Sin Reporte: ${conteo.value.sinreporte}`, 20, yPos + 23)

    // Columna 2
    doc.text(`Ingresos: $ ${formatNumber(totales.value.totalIngresos)}`, 100, yPos + 5)
    doc.text(`Gastos: $ ${formatNumber(totales.value.totalGastos)}`, 100, yPos + 11)
    doc.text(`Costos: $ ${formatNumber(totales.value.totalCostos)}`, 100, yPos + 17)
    doc.text(`Flujo Neto: $ ${formatNumber(flujoNeto.value)}`, 100, yPos + 23)

    // Columna 3
    doc.text(`Validados: ${conteo.value.validado}`, 190, yPos + 5)
    doc.text(`Cargados: ${conteo.value.cargado}`, 190, yPos + 11)
    doc.text(`Rechazados: ${conteo.value.rechazado || 0}`, 190, yPos + 17)

    yPos += 32

    // --- TABLA DE EMPRESAS ---
    const estadoMap = {
      'validado': 'Validado',
      'cargado': 'Cargado',
      'borrador': 'Borrador',
      'rechazado': 'Rechazado',
      'sinreporte': 'Sin reporte'
    }

    const tableData = empresas.value.map((e, index) => {
      const r = reporteDe(e.id)
      const estado = estadoDe(e.id)

      return [
        index + 1,
        e.nombre || 'Sin nombre',
        e.rif || 'N/A',
        estadoMap[estado] || estado,
        parseFloat(r?.total_ingresos || 0),
        parseFloat(r?.total_gastos || 0),
        parseFloat(r?.total_costos || 0),
        parseFloat(r?.saldo_banco_caja || 0),
        parseFloat(r?.cuentas_cobrar || 0),
        parseFloat(r?.cuentas_pagar || 0),
        parseFloat(r?.utilidad_bruta || 0),
        parseFloat(r?.utilidad_distribuir || 0),
        flujoDe(e.id)
      ]
    })

    // Agregar fila de totales
    tableData.push([
      '',
      'TOTALES',
      '',
      '',
      totales.value.totalIngresos,
      totales.value.totalGastos,
      totales.value.totalCostos,
      totales.value.totalIngresos - totales.value.totalGastos - totales.value.totalCostos,
      totales.value.totalCuentasCobrar,
      totales.value.totalCuentasPagar,
      totales.value.totalUtilidadBruta,
      totales.value.totalUtilidadDistribuir,
      flujoNeto.value
    ])

    autoTable(doc, {
      startY: yPos,
      head: [['#', 'Empresa', 'RIF', 'Estado', 'Ingresos ($)', 'Gastos ($)', 'Costos ($)', 'Saldo ($)', 'Cx Cobrar ($)', 'Cx Pagar ($)', 'Util. Bruta ($)', 'Util. Distribuir ($)', 'Flujo Neto ($)']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7
      },
      bodyStyles: {
        fontSize: 6
      },
      columnStyles: {
        0: { cellWidth: 8, halign: 'center' },
        1: { cellWidth: 30 },
        2: { cellWidth: 18 },
        3: { cellWidth: 18 },
        4: { cellWidth: 20, halign: 'right' },
        5: { cellWidth: 20, halign: 'right' },
        6: { cellWidth: 20, halign: 'right' },
        7: { cellWidth: 20, halign: 'right' },
        8: { cellWidth: 20, halign: 'right' },
        9: { cellWidth: 20, halign: 'right' },
        10: { cellWidth: 20, halign: 'right' },
        11: { cellWidth: 22, halign: 'right' },
        12: { cellWidth: 22, halign: 'right' }
      },
      didParseCell: function(data) {
        if (data.row.raw && data.row.raw[1] === 'TOTALES') {
          data.cell.styles.fillColor = [220, 230, 250]
          data.cell.styles.fontStyle = 'bold'
        }
        if (data.column.index === 12) {
          const valor = parseFloat(data.cell.raw)
          if (typeof valor === 'number' && !isNaN(valor)) {
            if (valor < 0) {
              data.cell.styles.textColor = [220, 38, 38]
            } else if (valor > 0) {
              data.cell.styles.textColor = [22, 163, 74]
            }
          }
        }
      }
    })

    // --- PIE DE PAGINA ---
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(
        `Libro de Carga - Control Financiero | Pagina ${i} de ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      )
    }

    doc.save(`Reporte_General_${periodo.value}.pdf`)
    console.log('✅ PDF exportado exitosamente')

  } catch (error) {
    console.error('❌ Error exportando PDF:', error)
    alert('Error al generar el PDF. Por favor, intenta nuevamente.')
  }
}

// ============================================
// EXPORTAR EXCEL
// ============================================
function exportExcel() {
  const url = `${import.meta.env.VITE_API_URL || '/api'}/ReporteFinanciero/exportar?periodo=${periodo.value}`
  window.open(url, '_blank')
}

// ============================================
// CARGAR DATOS DESDE LA API
// ============================================
async function loadData() {
  try {
    cargando.value = true

    const [empresasRes, reportesRes] = await Promise.all([
      EmpresasAPI.list(),
      ReportesAPI.list({ limit: 500 })
    ])

    empresas.value = empresasRes.data || []
    reportes.value = reportesRes.data || []

    console.log('✅ Empresas cargadas:', empresas.value.length)
    console.log('📋 Empresas:', empresas.value.map(e => e.nombre))
    console.log('✅ Reportes cargados:', reportes.value.length)
    console.log('📋 Reportes:', reportes.value.map(r => ({ empresa: r.empresa_nombre, periodo: r.periodo, status: r.status })))
    console.log(`📋 Periodo seleccionado: ${periodo.value}`)
    console.log('📋 Reportes del periodo:', reportesPeriodo.value)

    await nextTick()
    renderCharts()

  } catch (error) {
    console.error('❌ Error cargando datos desde API:', error)
  } finally {
    cargando.value = false
  }
}

// ============================================
// WATCHERS
// ============================================
watch([mes, anio], () => {
  loadData()
})

// ============================================
// CICLO DE VIDA
// ============================================
onMounted(() => {
  loadData()
})
</script>

<style scoped>
@import 'bootstrap-icons/font/bootstrap-icons.css';

/* ============================================
   BASE
   ============================================ */
* {
  box-sizing: border-box;
}

.reporte-general {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 4px;
  width: 100%;
}

/* ============================================
   ANIMACIONES
   ============================================ */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.4s ease-out;
}

.animate-up {
  opacity: 0;
  animation: slideUp 0.5s ease-out forwards;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinning {
  animation: spin 0.8s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .fade-in,
  .animate-up,
  .spinning {
    animation: none !important;
    opacity: 1 !important;
  }
}

/* ============================================
   PANEL HEADER
   ============================================ */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 28px;
  padding: 20px 24px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.panel-title-group {
  display: flex;
  align-items: center;
  gap: 14px;
}

.title-icon {
  font-size: clamp(24px, 4vw, 32px);
  line-height: 1;
}

.panel-title {
  font-size: clamp(19px, 2.5vw, 24px);
  font-weight: 700;
  color: #1a1a2e;
  letter-spacing: -0.02em;
}

.panel-sub {
  font-size: 13px;
  color: #6b7280;
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.panel-sub strong {
  color: #1a1a2e;
}

.filter-group {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  max-width: 100%;
}

.filter-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 6px 14px;
  transition: border-color 0.2s;
}

.filter-item:focus-within {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.filter-item i {
  color: #9ca3af;
  font-size: 14px;
}

.filter-item select {
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  padding: 4px 0;
  cursor: pointer;
  color: #1a1a2e;
  font-weight: 500;
  min-width: 80px;
}

/* ============================================
   BOTONES
   ============================================ */
.btn {
  border: none;
  border-radius: 10px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.btn:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.btn-sm {
  padding: 6px 14px;
  font-size: 12px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-ghost {
  background: #f3f4f6;
  color: #374151;
}

.btn-ghost:hover:not(:disabled) {
  background: #e5e7eb;
}

.btn-primary {
  background: #2563eb;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-success {
  background: #16a34a;
  color: #fff;
}

.btn-success:hover:not(:disabled) {
  background: #15803d;
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
}

/* ============================================
   METRICAS GRID
   ============================================ */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.metric-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  min-width: 0;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
  border-color: #d1d5db;
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.metric-content {
  flex: 1;
  min-width: 0;
}

.metric-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.metric-value {
  font-size: clamp(22px, 3vw, 28px);
  font-weight: 800;
  color: #1a1a2e;
  line-height: 1.2;
  margin-top: 2px;
  display: block;
}

.metric-sub {
  font-size: 12px;
  color: #9ca3af;
  display: block;
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ============================================
   CHARTS ROW
   ============================================ */
.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.chart-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px 24px 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  min-width: 0;
}

.chart-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 8px;
}

.chart-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
}

.chart-title i {
  color: #2563eb;
}

.chart-badge {
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  background: #f3f4f6;
  padding: 2px 12px;
  border-radius: 12px;
  white-space: nowrap;
}

.chart-wrapper {
  position: relative;
  height: 260px;
}

.chart-wrapper.compact {
  height: 190px;
}

.metric-charts-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

/* ============================================
   FINANCIAL CARD
   ============================================ */
.finan-card {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 16px;
  padding: 24px 28px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.finan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 8px;
}

.finan-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
  font-size: 17px;
  font-weight: 600;
}

.finan-title i {
  color: #60a5fa;
}

.finan-badge {
  color: rgba(255, 255, 255, 0.4);
  font-size: 12px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.06);
  padding: 4px 14px;
  border-radius: 20px;
  white-space: nowrap;
}

.finan-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.finan-item {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 14px 18px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  min-width: 0;
}

.finan-item.highlight {
  background: rgba(37, 99, 235, 0.15);
  border-color: rgba(37, 99, 235, 0.2);
}

.finan-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.finan-value {
  display: block;
  font-size: clamp(17px, 2.4vw, 22px);
  font-weight: 700;
  color: #fff;
  margin-top: 4px;
  overflow-wrap: break-word;
}

.finan-value.positive {
  color: #22c55e;
}

.finan-value.negative {
  color: #ef4444;
}

/* ============================================
   COMPANY SECTION
   ============================================ */
.company-section {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 8px;
}

.section-header h4 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0;
  flex-wrap: wrap;
}

.section-chip {
  background: #eef2ff;
  color: #2563eb;
  padding: 2px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
}

.section-actions {
  display: flex;
  gap: 8px;
}

/* ============================================
   TABLA DE REPORTE
   ============================================ */
.table-responsive {
  overflow-x: auto;
  margin-top: 4px;
  -webkit-overflow-scrolling: touch;
  border-radius: 8px;
}

.report-table {
  width: 100%;
  min-width: 920px;
  border-collapse: collapse;
  font-size: 13px;
}

.report-table thead th {
  background: #1a1a2e;
  color: #fff;
  padding: 10px 12px;
  text-align: left;
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.report-table tbody td {
  padding: 8px 12px;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
}

.report-table tbody tr:hover {
  background: #f8fafc;
}

.report-table .text-right {
  text-align: right;
}

.report-table .positive {
  color: #16a34a;
}

.report-table .negative {
  color: #dc2626;
}

.report-table .total-row {
  background: #eef2ff !important;
  font-weight: 600;
}

.report-table .total-row td {
  border-top: 2px solid #2563eb;
  padding: 10px 12px;
}

/* Columna "Empresa" fija al hacer scroll horizontal en pantallas chicas */
.report-table .sticky-col {
  position: sticky;
  left: 0;
  background: #fff;
  z-index: 1;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.04);
}

.report-table thead th.sticky-col {
  background: #1a1a2e;
  z-index: 2;
}

.report-table .total-row .sticky-col {
  background: #eef2ff;
}

.status-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.status-badge.validado {
  background: #dcfce7;
  color: #166534;
}

.status-badge.cargado {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.borrador {
  background: #f3f4f6;
  color: #6b7280;
}

.status-badge.sinreporte {
  background: #f3f4f6;
  color: #9ca3af;
}

.status-badge.rechazado {
  background: #fee2e2;
  color: #991b1b;
}

.scroll-hint {
  display: none;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #9ca3af;
  margin: 8px 2px 0;
}

/* ============================================
   LOADING
   ============================================ */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

.loading-state p {
  color: #9ca3af;
  font-size: 14px;
  margin: 0;
}

/* ============================================
   RESPONSIVE — de escritorio grande a móvil chico
   ============================================ */

/* Laptops / pantallas medianas */
@media (max-width: 1300px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .metric-charts-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Tablets grandes */
@media (max-width: 1100px) {
  .metric-charts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Tablets / laptops chicas */
@media (max-width: 1024px) {
  .charts-row {
    grid-template-columns: 1fr;
  }

  .finan-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Tablets verticales */
@media (max-width: 900px) {
  .finan-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .chart-wrapper {
    height: 230px;
  }
}

/* Móviles grandes / tablets chicas */
@media (max-width: 768px) {
  .reporte-general {
    padding: 0 2px;
  }

  .panel-header {
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
    gap: 14px;
  }

  .filter-group {
    justify-content: stretch;
  }

  .filter-item {
    flex: 1 1 45%;
    min-width: 130px;
  }

  .filter-item select {
    width: 100%;
  }

  .filter-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .filter-actions .btn {
    flex: 1;
    justify-content: center;
  }

  .metrics-grid {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .metric-card {
    padding: 16px;
    gap: 12px;
  }

  .metric-icon {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  .metric-charts-grid {
    grid-template-columns: 1fr;
  }

  .chart-card {
    padding: 16px;
  }

  .chart-wrapper {
    height: 220px;
  }

  .chart-wrapper.compact {
    height: 200px;
  }

  .company-section {
    padding: 16px;
  }

  .report-table {
    font-size: 11px;
  }

  .report-table thead th,
  .report-table tbody td {
    padding: 6px 8px;
  }

  .scroll-hint {
    display: flex;
  }
}

/* Móviles medianos */
@media (max-width: 600px) {
  .finan-grid {
    grid-template-columns: 1fr;
  }

  .finan-card {
    padding: 18px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .section-actions {
    width: 100%;
  }

  .section-actions .btn {
    width: 100%;
    justify-content: center;
  }
}

/* Móviles chicos */
@media (max-width: 480px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .metric-value {
    font-size: 24px;
  }

  .filter-item {
    flex: 1 1 100%;
  }

  .filter-actions {
    flex-direction: column;
  }

  .filter-actions .btn {
    width: 100%;
  }

  .chart-wrapper {
    height: 200px;
  }

  .company-section {
    padding: 14px 12px;
  }

  .report-table {
    min-width: 760px;
  }
}

/* Móviles muy chicos (320–380px) */
@media (max-width: 380px) {
  .panel-title {
    font-size: 18px;
  }

  .panel-sub {
    font-size: 12px;
  }

  .metric-value {
    font-size: 22px;
  }

  .finan-value {
    font-size: 17px;
  }

  .report-table {
    min-width: 680px;
    font-size: 10px;
  }
}
</style>