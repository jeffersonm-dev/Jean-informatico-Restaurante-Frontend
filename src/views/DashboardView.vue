<template>
  <div class="dashboard-container">
    <!-- ============================================================
    HEADER CON EFECTOS
    ============================================================ -->
    <div class="dashboard-header glass-effect">
      <div class="header-left">
        <div class="header-logo">
          <div class="logo-icon">
            <i class="bi bi-shop"></i>
            <span class="logo-pulse"></span>
          </div>
          <div>
            <h1 class="header-title">
              {{ auth.isAdmin ? '🍽️ Panel de Control' : '👨‍🍳 Mi Dashboard' }}
              <span class="title-badge">LIVE</span>
            </h1>
            <p class="header-subtitle">
              <i class="bi bi-calendar3"></i>
              {{ auth.isAdmin ? 'Resumen ejecutivo - ' + periodoLabel : 'Estado de tu restaurante - ' + periodoLabel }}
            </p>
          </div>
        </div>
      </div>
      <div class="header-right">
        <div class="status-indicator">
          <span class="status-dot"></span>
          <span class="status-text">Sistema en línea</span>
        </div>
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
    ALERTAS ANIMADAS
    ============================================================ -->
    <div v-if="alertas.length" class="alertas-container">
      <div 
        v-for="alerta in alertas" 
        :key="alerta.id"
        class="alert slide-in"
        :class="alerta.tipo"
      >
        <i class="bi" :class="alerta.icono"></i>
        <span>{{ alerta.mensaje }}</span>
        <button class="alert-close" @click="cerrarAlerta(alerta.id)">×</button>
      </div>
    </div>

    <!-- ============================================================
    KPI CARDS CON EFECTOS 3D
    ============================================================ -->
    <div class="kpi-grid">
      <div v-for="(kpi, index) in kpis" :key="index" 
           class="kpi-card glass-effect" 
           :class="'kpi-' + kpi.color"
           :style="{ animationDelay: (index * 0.1) + 's' }">
        <div class="kpi-icon-wrapper">
          <div class="kpi-icon" :class="kpi.color">
            <i :class="'bi bi-' + kpi.icon"></i>
          </div>
          <div class="kpi-ring"></div>
        </div>
        <div class="kpi-content">
          <span class="kpi-value">{{ kpi.value }}</span>
          <span class="kpi-label">{{ kpi.label }}</span>
          <div class="kpi-footer">
            <span v-if="kpi.trend" class="kpi-trend" :class="kpi.trendClass">
              <i class="bi" :class="kpi.trendIcon"></i>
              {{ kpi.trend }}
            </span>
            <small v-if="kpi.subtext" class="kpi-subtext">{{ kpi.subtext }}</small>
          </div>
        </div>
        <div class="kpi-progress">
          <div class="progress-bar" :style="{ width: kpi.percentage + '%' }"></div>
        </div>
        <div class="kpi-glow"></div>
      </div>
    </div>

    <!-- ============================================================
    MEGA GRÁFICOS - FILA 1
    ============================================================ -->
    <div class="charts-row">
      <!-- Gráfico de Ventas con Área -->
      <div class="card chart-card glass-effect">
        <div class="card-header">
          <div class="card-header-left">
            <div class="header-icon pulse-icon">
              <i class="bi bi-graph-up-arrow"></i>
            </div>
            <div>
              <h3>Ventas Diarias</h3>
              <span class="card-subtitle">Últimos 30 días</span>
            </div>
          </div>
          <div class="card-actions">
            <span class="card-badge trend-up">↑ 12.5%</span>
            <div class="dropdown-indicator">
              <i class="bi bi-three-dots-vertical"></i>
            </div>
          </div>
        </div>
        <div class="card-body">
          <canvas ref="ventasChart"></canvas>
        </div>
        <div class="chart-stats">
          <div class="stat-item">
            <span class="stat-label">Total</span>
            <span class="stat-value">2,847</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Promedio</span>
            <span class="stat-value">94.9</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Máximo</span>
            <span class="stat-value">142</span>
          </div>
        </div>
      </div>

      <!-- Gráfico de Radar - Rendimiento -->
      <div class="card chart-card glass-effect">
        <div class="card-header">
          <div class="card-header-left">
            <div class="header-icon pulse-icon">
              <i class="bi bi-radar"></i>
            </div>
            <div>
              <h3>Rendimiento del Restaurante</h3>
              <span class="card-subtitle">Calidad en todas las áreas</span>
            </div>
          </div>
          <span class="card-badge">Excelente</span>
        </div>
        <div class="card-body">
          <canvas ref="radarChart"></canvas>
        </div>
      </div>
    </div>

    <!-- ============================================================
    GRÁFICOS - FILA 2 (3 columnas)
    ============================================================ -->
    <div class="charts-row-three">
      <!-- Gráfico de Dona - Categorías -->
      <div class="card chart-card glass-effect">
        <div class="card-header">
          <div class="card-header-left">
            <div class="header-icon pulse-icon">
              <i class="bi bi-pie-chart-fill"></i>
            </div>
            <div>
              <h3>Órdenes por Categoría</h3>
              <span class="card-subtitle">Distribución de ventas</span>
            </div>
          </div>
          <span class="card-badge">{{ totalOrdenes }} total</span>
        </div>
        <div class="card-body">
          <canvas ref="categoriasChart"></canvas>
        </div>
      </div>

      <!-- Gráfico de Barras - Ingresos -->
      <div class="card chart-card glass-effect">
        <div class="card-header">
          <div class="card-header-left">
            <div class="header-icon pulse-icon">
              <i class="bi bi-bar-chart-fill"></i>
            </div>
            <div>
              <h3>Ingresos Mensuales</h3>
              <span class="card-subtitle">2024</span>
            </div>
          </div>
          <span class="card-badge trend-up">↑ 15.3%</span>
        </div>
        <div class="card-body">
          <canvas ref="ingresosChart"></canvas>
        </div>
      </div>

      <!-- Gráfico de Barras Horizontal - Calificaciones -->
      <div class="card chart-card glass-effect">
        <div class="card-header">
          <div class="card-header-left">
            <div class="header-icon pulse-icon">
              <i class="bi bi-star-fill"></i>
            </div>
            <div>
              <h3>Calificación de Platos</h3>
              <span class="card-subtitle">⭐ {{ promedioCalificacion }} promedio</span>
            </div>
          </div>
          <span class="card-badge">Top rated</span>
        </div>
        <div class="card-body">
          <canvas ref="calificacionChart"></canvas>
        </div>
      </div>
    </div>

    <!-- ============================================================
    GRÁFICOS - FILA 3 (4 columnas)
    ============================================================ -->
    <div class="charts-row-four">
      <!-- Horas Pico -->
      <div class="card chart-card glass-effect">
        <div class="card-header">
          <div class="card-header-left">
            <div class="header-icon pulse-icon">
              <i class="bi bi-clock-history"></i>
            </div>
            <h3>Horas Pico</h3>
          </div>
          <span class="card-badge">📈 {{ horaPico }}</span>
        </div>
        <div class="card-body small-chart">
          <canvas ref="horasChart"></canvas>
        </div>
      </div>

      <!-- Métodos de Pago -->
      <div class="card chart-card glass-effect">
        <div class="card-header">
          <div class="card-header-left">
            <div class="header-icon pulse-icon">
              <i class="bi bi-credit-card"></i>
            </div>
            <h3>Métodos de Pago</h3>
          </div>
          <span class="card-badge">{{ metodosPago.length }} métodos</span>
        </div>
        <div class="card-body small-chart">
          <canvas ref="pagosChart"></canvas>
        </div>
      </div>

      <!-- Satisfacción del Cliente -->
      <div class="card chart-card glass-effect">
        <div class="card-header">
          <div class="card-header-left">
            <div class="header-icon pulse-icon">
              <i class="bi bi-emoji-smile"></i>
            </div>
            <h3>Satisfacción</h3>
          </div>
          <span class="card-badge">😊 94%</span>
        </div>
        <div class="card-body small-chart">
          <canvas ref="satisfaccionChart"></canvas>
        </div>
      </div>

      <!-- Tiempo de Espera -->
      <div class="card chart-card glass-effect">
        <div class="card-header">
          <div class="card-header-left">
            <div class="header-icon pulse-icon">
              <i class="bi bi-hourglass-split"></i>
            </div>
            <h3>Tiempo de Espera</h3>
          </div>
          <span class="card-badge">⏱️ {{ tiempoEsperaPromedio }} min</span>
        </div>
        <div class="card-body small-chart">
          <canvas ref="tiempoChart"></canvas>
        </div>
      </div>
    </div>

    <!-- ============================================================
    GRÁFICOS ADICIONALES - FILA 4
    ============================================================ -->
    <div class="charts-row-two">
      <!-- Progreso de Metas -->
      <div class="card chart-card glass-effect">
        <div class="card-header">
          <div class="card-header-left">
            <div class="header-icon pulse-icon">
              <i class="bi bi-bullseye"></i>
            </div>
            <div>
              <h3>Metas del Mes</h3>
              <span class="card-subtitle">Progreso hacia objetivos</span>
            </div>
          </div>
          <span class="card-badge">75% completado</span>
        </div>
        <div class="card-body">
          <canvas ref="metasChart"></canvas>
        </div>
      </div>

      <!-- Comparativa de Meses -->
      <div class="card chart-card glass-effect">
        <div class="card-header">
          <div class="card-header-left">
            <div class="header-icon pulse-icon">
              <i class="bi bi-arrow-left-right"></i>
            </div>
            <div>
              <h3>Comparativa Mensual</h3>
              <span class="card-subtitle">2024 vs 2023</span>
            </div>
          </div>
          <span class="card-badge trend-up">↑ 22%</span>
        </div>
        <div class="card-body">
          <canvas ref="comparativaChart"></canvas>
        </div>
      </div>
    </div>

    <!-- ============================================================
    CONTENIDO PRINCIPAL CON MÁS DETALLES
    ============================================================ -->
    <div class="dashboard-grid">
      <!-- Actividad reciente con más detalles -->
      <div class="card card-activity glass-effect">
        <div class="card-header">
          <div class="card-header-left">
            <div class="header-icon pulse-icon">
              <i class="bi bi-activity"></i>
            </div>
            <div>
              <h3>Actividad Reciente</h3>
              <span class="card-subtitle">Últimas órdenes</span>
            </div>
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
              <span class="activity-dot" :class="a.status">
                <span class="dot-pulse"></span>
              </span>
              <div class="activity-content">
                <div class="activity-main">
                  <span class="activity-empresa">{{ a.cliente || 'Cliente' }}</span>
                  <span class="activity-action">{{ a.accion || 'realizó' }}</span>
                  <span class="activity-period">{{ a.detalle || 'una orden' }}</span>
                </div>
                <div class="activity-bottom">
                  <span class="status-badge" :class="a.status">
                    {{ getStatusLabel(a.status) }}
                  </span>
                  <span class="activity-time">
                    <i class="bi bi-clock"></i>
                    {{ formatDate(a.created_at || a.fecha) }}
                  </span>
                  <span class="activity-price" v-if="a.precio">
                    ${{ a.precio }}
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

      <!-- COLUMNA DERECHA CON MÁS INFO -->
      <div class="right-column">
        <!-- Platos Más Vendidos con progreso -->
        <div class="card card-platos glass-effect">
          <div class="card-header">
            <div class="card-header-left">
              <div class="header-icon pulse-icon">
                <i class="bi bi-trophy"></i>
              </div>
              <div>
                <h3>Platos Más Vendidos</h3>
                <span class="card-subtitle">Top 5 de la semana</span>
              </div>
            </div>
            <span class="card-badge">🏆 Top 5</span>
          </div>
          <div class="card-body">
            <div v-if="cargando" class="loading-state">
              <div class="spinner small"></div>
              <p>Cargando...</p>
            </div>
            <div class="platos-list" v-else>
              <div class="plato-item" v-for="(plato, index) in platosTop" :key="index">
                <div class="plato-rank-wrapper">
                  <span class="plato-rank">{{ index + 1 }}</span>
                  <div class="rank-medal" v-if="index < 3">
                    <i class="bi" :class="['bi-trophy-fill', 'medal-' + (index + 1)]"></i>
                  </div>
                </div>
                <div class="plato-info">
                  <span class="plato-nombre">{{ plato.nombre }}</span>
                  <span class="plato-categoria">{{ plato.categoria }}</span>
                </div>
                <div class="plato-stats">
                  <div class="plato-ventas-bar">
                    <div class="bar-fill" :style="{ width: (plato.ventas / platosTop[0].ventas * 100) + '%' }"></div>
                  </div>
                  <div class="plato-numbers">
                    <span class="plato-ventas">{{ plato.ventas }} ventas</span>
                    <span class="plato-ingresos">${{ plato.ingresos }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen del Día mejorado -->
        <div class="card card-resumen glass-effect">
          <div class="card-header">
            <div class="card-header-left">
              <div class="header-icon pulse-icon">
                <i class="bi bi-clipboard-data"></i>
              </div>
              <div>
                <h3>Resumen del Día</h3>
                <span class="card-subtitle">Datos en tiempo real</span>
              </div>
            </div>
            <span class="card-badge">🟢 Hoy</span>
          </div>
          <div class="card-body">
            <div class="resumen-grid">
              <div class="resumen-item" v-for="(item, key) in resumenDia" :key="key">
                <span class="resumen-label">{{ key }}</span>
                <span class="resumen-value" :class="{ highlight: key === 'ganancia' || key === 'ticketPromedio' }">
                  {{ typeof item === 'number' && key !== 'ticketPromedio' ? '$' + item : item }}
                </span>
                <div class="resumen-trend" v-if="key === 'ordenes' || key === 'ingresos'">
                  <span class="trend-up">↑ 8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Clientes Frecuentes -->
        <div class="card card-clientes glass-effect">
          <div class="card-header">
            <div class="card-header-left">
              <div class="header-icon pulse-icon">
                <i class="bi bi-people-fill"></i>
              </div>
              <div>
                <h3>Clientes Frecuentes</h3>
                <span class="card-subtitle">Top clientes</span>
              </div>
            </div>
            <span class="card-badge">👥 12</span>
          </div>
          <div class="card-body">
            <div class="clientes-list">
              <div class="cliente-item" v-for="cliente in clientesFrecuentes" :key="cliente.id">
                <div class="cliente-avatar" :style="{ background: cliente.color }">
                  {{ cliente.iniciales }}
                </div>
                <div class="cliente-info">
                  <span class="cliente-nombre">{{ cliente.nombre }}</span>
                  <span class="cliente-visitas">{{ cliente.visitas }} visitas</span>
                </div>
                <div class="cliente-gasto">${{ cliente.gasto }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import Chart from 'chart.js/auto'
import { SedesAPI, ReportesAPI } from '../services/api'

const auth = useAuthStore()
const cargando = ref(false)

const empresas = ref([])
const reportes = ref([])
const misReportes = ref([])
const alertas = ref([])

// Referencias a los canvas
const ventasChart = ref(null)
const categoriasChart = ref(null)
const ingresosChart = ref(null)
const calificacionChart = ref(null)
const horasChart = ref(null)
const pagosChart = ref(null)
const radarChart = ref(null)
const satisfaccionChart = ref(null)
const tiempoChart = ref(null)
const metasChart = ref(null)
const comparativaChart = ref(null)

// Instancias de gráficos
let ventasChartInstance = null
let categoriasChartInstance = null
let ingresosChartInstance = null
let calificacionChartInstance = null
let horasChartInstance = null
let pagosChartInstance = null
let radarChartInstance = null
let satisfaccionChartInstance = null
let tiempoChartInstance = null
let metasChartInstance = null
let comparativaChartInstance = null

// ============================================================
// DATOS DE EJEMPLO - RESTAURANTE (MÁS COMPLETOS)
// ============================================================
const datosRestaurante = {
  ventasDiarias: [45, 52, 38, 61, 78, 55, 42, 67, 83, 71, 58, 44, 69, 86, 74, 59, 47, 72, 88, 76, 62, 49, 68, 85, 73, 56, 43, 64, 79, 66],
  categorias: [
    { nombre: 'Entradas', ventas: 120, color: '#2F6FED' },
    { nombre: 'Platos Principales', ventas: 280, color: '#22c55e' },
    { nombre: 'Bebidas', ventas: 190, color: '#f59e0b' },
    { nombre: 'Postres', ventas: 85, color: '#ef4444' },
    { nombre: 'Guarniciones', ventas: 65, color: '#8b5cf6' }
  ],
  ingresosMensuales: [8500, 9200, 7800, 10500, 11800, 9900, 11200, 12800, 13500, 14200, 15800, 16500],
  calificaciones: [
    { nombre: 'Lasaña', calificacion: 4.8 },
    { nombre: 'Pizza', calificacion: 4.6 },
    { nombre: 'Ensalada', calificacion: 4.2 },
    { nombre: 'Pasta', calificacion: 4.9 },
    { nombre: 'Sopa', calificacion: 4.0 },
    { nombre: 'Tarta', calificacion: 4.7 }
  ],
  horasPico: {
    labels: ['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm'],
    data: [5, 8, 12, 18, 35, 42, 38, 25, 20, 28, 45, 52, 48, 35, 22]
  },
  metodosPago: [
    { metodo: 'Efectivo', porcentaje: 35 },
    { metodo: 'Tarjeta Débito', porcentaje: 30 },
    { metodo: 'Tarjeta Crédito', porcentaje: 20 },
    { metodo: 'Transferencia', porcentaje: 10 },
    { metodo: 'App', porcentaje: 5 }
  ],
  platosTop: [
    { nombre: 'Pasta al Pesto', categoria: 'Platos Principales', ventas: 156, ingresos: 2340 },
    { nombre: 'Pizza Margherita', categoria: 'Platos Principales', ventas: 142, ingresos: 1988 },
    { nombre: 'Lasaña', categoria: 'Platos Principales', ventas: 128, ingresos: 2048 },
    { nombre: 'Tiramisú', categoria: 'Postres', ventas: 98, ingresos: 1176 },
    { nombre: 'Limonada', categoria: 'Bebidas', ventas: 87, ingresos: 435 }
  ],
  resumenDia: {
    'Órdenes': 78,
    'Ingresos': 2340,
    'Clientes': 156,
    'Gastos': 936,
    'Ganancia': 1404,
    'Ticket Promedio': 30
  },
  radarData: {
    labels: ['Calidad', 'Servicio', 'Ambiente', 'Precio', 'Ubicación', 'Variedad'],
    values: [4.8, 4.5, 4.7, 4.2, 4.3, 4.6]
  },
  satisfaccion: {
    excelente: 45,
    bueno: 35,
    regular: 15,
    malo: 5
  },
  tiempoEspera: {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    data: [25, 22, 28, 24, 35, 42, 30]
  },
  metas: {
    labels: ['Ventas', 'Clientes', 'Satisfacción', 'Fidelización', 'Eficiencia'],
    actual: [78, 82, 94, 65, 88],
    meta: [100, 100, 100, 100, 100]
  },
  comparativa: {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    actual: [8500, 9200, 7800, 10500, 11800, 9900],
    anterior: [7200, 8100, 6900, 9100, 10200, 8700]
  },
  clientesFrecuentes: [
    { id: 1, nombre: 'María González', iniciales: 'MG', color: '#2F6FED', visitas: 24, gasto: 1240 },
    { id: 2, nombre: 'Carlos Pérez', iniciales: 'CP', color: '#22c55e', visitas: 18, gasto: 980 },
    { id: 3, nombre: 'Ana Rodríguez', iniciales: 'AR', color: '#f59e0b', visitas: 15, gasto: 760 },
    { id: 4, nombre: 'Luis Martínez', iniciales: 'LM', color: '#ef4444', visitas: 12, gasto: 540 },
    { id: 5, nombre: 'Laura Sánchez', iniciales: 'LS', color: '#8b5cf6', visitas: 10, gasto: 480 }
  ]
}

// ============================================================
// UTILIDADES
// ============================================================
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

function formatPeriodo(periodo) {
  if (!periodo) return ''
  const parts = periodo.split('-')
  if (parts.length < 2) return periodo
  const year = parts[0]
  const month = parseInt(parts[1], 10)
  if (isNaN(month) || month < 1 || month > 12) return periodo
  return MESES[month - 1] + ' ' + year
}

function formatDate(date) {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function getStatusLabel(status) {
  const map = {
    completada: '✅ Completada',
    pendiente: '⏳ Pendiente',
    en_preparacion: '👨‍🍳 En preparación',
    entregada: '🚀 Entregada',
    cancelada: '❌ Cancelada'
  }
  return map[status] || status
}

function getPeriodoActual() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return year + '-' + month
}

const periodo = getPeriodoActual()
const periodoLabel = formatPeriodo(periodo)

// ============================================================
// DATOS COMPUTADOS
// ============================================================
const totalOrdenes = computed(() => {
  return datosRestaurante.categorias.reduce((sum, cat) => sum + cat.ventas, 0)
})

const ingresosTotales = computed(() => {
  return datosRestaurante.ingresosMensuales.reduce((sum, val) => sum + val, 0).toLocaleString()
})

const promedioCalificacion = computed(() => {
  const sum = datosRestaurante.calificaciones.reduce((s, c) => s + c.calificacion, 0)
  return (sum / datosRestaurante.calificaciones.length).toFixed(1)
})

const horaPico = computed(() => {
  const max = Math.max(...datosRestaurante.horasPico.data)
  const idx = datosRestaurante.horasPico.data.indexOf(max)
  return datosRestaurante.horasPico.labels[idx]
})

const tiempoEsperaPromedio = computed(() => {
  const sum = datosRestaurante.tiempoEspera.data.reduce((s, v) => s + v, 0)
  return Math.round(sum / datosRestaurante.tiempoEspera.data.length)
})

const metodosPago = computed(() => datosRestaurante.metodosPago)
const platosTop = computed(() => datosRestaurante.platosTop)
const resumenDia = computed(() => datosRestaurante.resumenDia)
const clientesFrecuentes = computed(() => datosRestaurante.clientesFrecuentes)

const kpis = computed(() => {
  const ventasTotales = datosRestaurante.ventasDiarias.reduce((s, v) => s + v, 0)
  const promedio = Math.round(ventasTotales / datosRestaurante.ventasDiarias.length)
  
  return [
    { 
      label: 'Ventas Totales', 
      value: ventasTotales, 
      icon: 'cash-stack', 
      color: 'blue',
      trend: '+23%',
      trendClass: 'up',
      trendIcon: 'bi-arrow-up',
      subtext: 'últimos 30 días',
      percentage: 87
    },
    { 
      label: 'Ingresos Mensuales', 
      value: '$' + ingresosTotales.value, 
      icon: 'graph-up', 
      color: 'green',
      trend: '+15%',
      trendClass: 'up',
      trendIcon: 'bi-arrow-up',
      subtext: 'vs mes anterior',
      percentage: 92
    },
    { 
      label: 'Ticket Promedio', 
      value: '$' + resumenDia.value['Ticket Promedio'], 
      icon: 'receipt', 
      color: 'purple',
      trend: '+8%',
      trendClass: 'up',
      trendIcon: 'bi-arrow-up',
      subtext: 'por cliente',
      percentage: 78
    },
    { 
      label: 'Clientes Atendidos', 
      value: resumenDia.value['Clientes'], 
      icon: 'people', 
      color: 'orange',
      trend: '+12%',
      trendClass: 'up',
      trendIcon: 'bi-arrow-up',
      subtext: 'hoy',
      percentage: 95
    },
    { 
      label: 'Calificación', 
      value: '⭐ ' + promedioCalificacion.value, 
      icon: 'star-fill', 
      color: 'yellow',
      trend: '+0.3',
      trendClass: 'up',
      trendIcon: 'bi-arrow-up',
      subtext: 'de 5 estrellas',
      percentage: 96
    },
    { 
      label: 'Órdenes Pendientes', 
      value: '12', 
      icon: 'clock-history', 
      color: 'red',
      trend: '-5%',
      trendClass: 'down',
      trendIcon: 'bi-arrow-down',
      subtext: 'por preparar',
      percentage: 60
    }
  ]
})

const actividad = computed(() => {
  const actividades = [
    { id: 1, cliente: 'María González', accion: 'ordenó', detalle: 'Pizza Margherita + Limonada', status: 'completada', created_at: new Date(Date.now() - 1000 * 60 * 5), precio: 28.50 },
    { id: 2, cliente: 'Carlos Pérez', accion: 'ordenó', detalle: 'Pasta al Pesto + Tiramisú', status: 'entregada', created_at: new Date(Date.now() - 1000 * 60 * 25), precio: 34.00 },
    { id: 3, cliente: 'Ana Rodríguez', accion: 'reservó', detalle: 'Mesa para 4 personas', status: 'pendiente', created_at: new Date(Date.now() - 1000 * 60 * 45), precio: null },
    { id: 4, cliente: 'Luis Martínez', accion: 'ordenó', detalle: 'Lasaña + Ensalada', status: 'completada', created_at: new Date(Date.now() - 1000 * 60 * 70), precio: 26.00 },
    { id: 5, cliente: 'Laura Sánchez', accion: 'canceló', detalle: 'Orden #245', status: 'cancelada', created_at: new Date(Date.now() - 1000 * 60 * 90), precio: null },
    { id: 6, cliente: 'Pedro Gómez', accion: 'ordenó', detalle: 'Sopa + Pan + Postre', status: 'en_preparacion', created_at: new Date(Date.now() - 1000 * 60 * 15), precio: 22.50 },
    { id: 7, cliente: 'Sofía Torres', accion: 'calificó', detalle: '5 estrellas - Excelente servicio', status: 'completada', created_at: new Date(Date.now() - 1000 * 60 * 120), precio: null },
    { id: 8, cliente: 'Jorge Ramírez', accion: 'ordenó', detalle: 'Pizza Pepperoni + Bebida', status: 'entregada', created_at: new Date(Date.now() - 1000 * 60 * 35), precio: 32.00 }
  ]
  return actividades
})

// ============================================================
// FUNCIONES DE GRÁFICOS MEJORADAS
// ============================================================
function initCharts() {
  initVentasChart()
  initCategoriasChart()
  initIngresosChart()
  initCalificacionChart()
  initHorasChart()
  initPagosChart()
  initRadarChart()
  initSatisfaccionChart()
  initTiempoChart()
  initMetasChart()
  initComparativaChart()
}

function createGradient(ctx, color1, color2) {
  const gradient = ctx.createLinearGradient(0, 0, 0, 400)
  gradient.addColorStop(0, color1)
  gradient.addColorStop(1, color2)
  return gradient
}

function initVentasChart() {
  if (ventasChartInstance) ventasChartInstance.destroy()
  const ctx = ventasChart.value?.getContext('2d')
  if (!ctx) return
  
  const gradient = createGradient(ctx, 'rgba(47, 111, 237, 0.3)', 'rgba(47, 111, 237, 0.01)')
  
  ventasChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19', '21', '23', '25', '27', '29'],
      datasets: [{
        label: 'Ventas',
        data: datosRestaurante.ventasDiarias,
        borderColor: '#2F6FED',
        borderWidth: 3,
        backgroundColor: gradient,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#2F6FED',
        pointBorderColor: '#fff',
        pointBorderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#2F6FED'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 2000, easing: 'easeInOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          cornerRadius: 12,
          padding: 12,
          callbacks: {
            label: function(context) {
              return '📊 Ventas: ' + context.parsed.y
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: { stepSize: 20 }
        },
        x: {
          grid: { display: false },
          ticks: { maxTicksLimit: 10 }
        }
      }
    }
  })
}

function initRadarChart() {
  if (radarChartInstance) radarChartInstance.destroy()
  const ctx = radarChart.value?.getContext('2d')
  if (!ctx) return
  
  radarChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: datosRestaurante.radarData.labels,
      datasets: [{
        label: 'Rendimiento',
        data: datosRestaurante.radarData.values,
        backgroundColor: 'rgba(47, 111, 237, 0.2)',
        borderColor: '#2F6FED',
        borderWidth: 3,
        pointBackgroundColor: '#2F6FED',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 2000 },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          cornerRadius: 12,
          padding: 12
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 5,
          ticks: { stepSize: 1 }
        }
      }
    }
  })
}

function initCategoriasChart() {
  if (categoriasChartInstance) categoriasChartInstance.destroy()
  const ctx = categoriasChart.value?.getContext('2d')
  if (!ctx) return
  
  categoriasChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: datosRestaurante.categorias.map(c => c.nombre),
      datasets: [{
        data: datosRestaurante.categorias.map(c => c.ventas),
        backgroundColor: ['#2F6FED', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'],
        borderColor: '#fff',
        borderWidth: 3,
        hoverOffset: 15
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { animateRotate: true, duration: 2000 },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 15,
            usePointStyle: true,
            pointStyle: 'circle',
            font: { size: 11 }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          cornerRadius: 12,
          padding: 12,
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percentage = ((context.parsed / total) * 100).toFixed(1)
              return context.label + ': ' + context.parsed + ' (' + percentage + '%)'
            }
          }
        }
      },
      cutout: '65%'
    }
  })
}

function initIngresosChart() {
  if (ingresosChartInstance) ingresosChartInstance.destroy()
  const ctx = ingresosChart.value?.getContext('2d')
  if (!ctx) return
  
  const gradient = ctx.createLinearGradient(0, 0, 0, 400)
  gradient.addColorStop(0, 'rgba(47, 111, 237, 0.8)')
  gradient.addColorStop(1, 'rgba(47, 111, 237, 0.3)')
  
  ingresosChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      datasets: [{
        label: 'Ingresos',
        data: datosRestaurante.ingresosMensuales,
        backgroundColor: gradient,
        borderColor: '#2F6FED',
        borderWidth: 2,
        borderRadius: 8,
        barPercentage: 0.6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 2000 },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          cornerRadius: 12,
          padding: 12,
          callbacks: {
            label: function(context) {
              return '💰 $' + context.parsed.y.toLocaleString()
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: {
            callback: function(value) { return '$' + value.toLocaleString() }
          }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  })
}

function initCalificacionChart() {
  if (calificacionChartInstance) calificacionChartInstance.destroy()
  const ctx = calificacionChart.value?.getContext('2d')
  if (!ctx) return
  
  const colors = ['#f59e0b', '#fbbf24', '#fcd34d', '#f59e0b', '#d97706', '#fbbf24']
  
  calificacionChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: datosRestaurante.calificaciones.map(c => c.nombre),
      datasets: [{
        label: 'Calificación',
        data: datosRestaurante.calificaciones.map(c => c.calificacion),
        backgroundColor: colors.map(c => c + 'CC'),
        borderColor: colors,
        borderWidth: 2,
        borderRadius: 8,
        barPercentage: 0.6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      animation: { duration: 2000 },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          cornerRadius: 12,
          padding: 12,
          callbacks: {
            label: function(context) {
              return '⭐ ' + context.parsed.x.toFixed(1) + ' / 5.0'
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 5,
          grid: { color: 'rgba(0,0,0,0.05)' }
        },
        y: {
          grid: { display: false }
        }
      }
    }
  })
}

function initHorasChart() {
  if (horasChartInstance) horasChartInstance.destroy()
  const ctx = horasChart.value?.getContext('2d')
  if (!ctx) return
  
  const gradient = createGradient(ctx, 'rgba(139, 92, 246, 0.3)', 'rgba(139, 92, 246, 0.01)')
  
  horasChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: datosRestaurante.horasPico.labels,
      datasets: [{
        label: 'Órdenes',
        data: datosRestaurante.horasPico.data,
        borderColor: '#8b5cf6',
        borderWidth: 3,
        backgroundColor: gradient,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 2000 },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          cornerRadius: 12,
          padding: 12
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0,0,0,0.05)' }
        },
        x: {
          grid: { display: false },
          ticks: { maxTicksLimit: 10 }
        }
      }
    }
  })
}

function initPagosChart() {
  if (pagosChartInstance) pagosChartInstance.destroy()
  const ctx = pagosChart.value?.getContext('2d')
  if (!ctx) return
  
  pagosChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: datosRestaurante.metodosPago.map(m => m.metodo),
      datasets: [{
        data: datosRestaurante.metodosPago.map(m => m.porcentaje),
        backgroundColor: ['#22c55e', '#2F6FED', '#8b5cf6', '#f59e0b', '#ef4444'],
        borderColor: '#fff',
        borderWidth: 2,
        hoverOffset: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { animateRotate: true, duration: 2000 },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 10,
            usePointStyle: true,
            pointStyle: 'circle',
            font: { size: 10 }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          cornerRadius: 12,
          padding: 12,
          callbacks: {
            label: function(context) {
              return context.label + ': ' + context.parsed + '%'
            }
          }
        }
      },
      cutout: '60%'
    }
  })
}

function initSatisfaccionChart() {
  if (satisfaccionChartInstance) satisfaccionChartInstance.destroy()
  const ctx = satisfaccionChart.value?.getContext('2d')
  if (!ctx) return
  
  satisfaccionChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Excelente', 'Bueno', 'Regular', 'Malo'],
      datasets: [{
        data: [45, 35, 15, 5],
        backgroundColor: ['#22c55e', '#f59e0b', '#fbbf24', '#ef4444'],
        borderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { animateRotate: true, duration: 2000 },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 8,
            usePointStyle: true,
            pointStyle: 'circle',
            font: { size: 9 }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          cornerRadius: 12,
          padding: 12,
          callbacks: {
            label: function(context) {
              return context.label + ': ' + context.parsed + '%'
            }
          }
        }
      },
      cutout: '55%'
    }
  })
}

function initTiempoChart() {
  if (tiempoChartInstance) tiempoChartInstance.destroy()
  const ctx = tiempoChart.value?.getContext('2d')
  if (!ctx) return
  
  const gradient = createGradient(ctx, 'rgba(239, 68, 68, 0.3)', 'rgba(239, 68, 68, 0.01)')
  
  tiempoChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: datosRestaurante.tiempoEspera.labels,
      datasets: [{
        label: 'Minutos',
        data: datosRestaurante.tiempoEspera.data,
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: '#ef4444',
        borderWidth: 2,
        borderRadius: 6,
        barPercentage: 0.5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 2000 },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          cornerRadius: 12,
          padding: 12,
          callbacks: {
            label: function(context) {
              return '⏱️ ' + context.parsed.y + ' min'
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0,0,0,0.05)' }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  })
}

function initMetasChart() {
  if (metasChartInstance) metasChartInstance.destroy()
  const ctx = metasChart.value?.getContext('2d')
  if (!ctx) return
  
  metasChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: datosRestaurante.metas.labels,
      datasets: [
        {
          label: 'Actual',
          data: datosRestaurante.metas.actual,
          backgroundColor: 'rgba(47, 111, 237, 0.7)',
          borderColor: '#2F6FED',
          borderWidth: 2,
          borderRadius: 6,
          barPercentage: 0.4
        },
        {
          label: 'Meta',
          data: datosRestaurante.metas.meta,
          backgroundColor: 'rgba(34, 197, 94, 0.3)',
          borderColor: '#22c55e',
          borderWidth: 2,
          borderRadius: 6,
          borderDash: [5, 5],
          barPercentage: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 2000 },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            font: { size: 11 }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          cornerRadius: 12,
          padding: 12,
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': ' + context.parsed.y + '%'
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: {
            callback: function(value) { return value + '%' }
          }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  })
}

function initComparativaChart() {
  if (comparativaChartInstance) comparativaChartInstance.destroy()
  const ctx = comparativaChart.value?.getContext('2d')
  if (!ctx) return
  
  comparativaChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: datosRestaurante.comparativa.labels,
      datasets: [
        {
          label: '2024',
          data: datosRestaurante.comparativa.actual,
          backgroundColor: 'rgba(47, 111, 237, 0.7)',
          borderColor: '#2F6FED',
          borderWidth: 2,
          borderRadius: 6,
          barPercentage: 0.4
        },
        {
          label: '2023',
          data: datosRestaurante.comparativa.anterior,
          backgroundColor: 'rgba(139, 92, 246, 0.5)',
          borderColor: '#8b5cf6',
          borderWidth: 2,
          borderRadius: 6,
          barPercentage: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 2000 },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            font: { size: 11 }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          cornerRadius: 12,
          padding: 12,
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': $' + context.parsed.y.toLocaleString()
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: {
            callback: function(value) { return '$' + value.toLocaleString() }
          }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  })
}

// ============================================================
// ALERTAS
// ============================================================
function agregarAlerta(tipo, mensaje) {
  const iconos = {
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
  setTimeout(() => {
    if (alertas.value.length > 0) {
      cerrarAlerta(alertas.value[0].id)
    }
  }, 5000)
}

function cerrarAlerta(id) {
  const index = alertas.value.findIndex(a => a.id === id)
  if (index !== -1) alertas.value.splice(index, 1)
}

// ============================================================
// CARGAR DATOS
// ============================================================
async function cargarDatos() {
  try {
    cargando.value = true
    alertas.value = []
    
    await new Promise(resolve => setTimeout(resolve, 500))
    await nextTick()
    initCharts()
    
    agregarAlerta('success', '🍽️ Dashboard actualizado - ¡Bienvenido a tu restaurante!')
    
  } catch (error) {
    console.error('Error cargando dashboard:', error)
    agregarAlerta('danger', '❌ Error al cargar los datos del dashboard')
  } finally {
    cargando.value = false
  }
}

// ============================================================
// CICLO DE VIDA
// ============================================================
onMounted(() => {
  cargarDatos()
})

// Limpiar gráficos al desmontar
watch(() => [ventasChart, categoriasChart, ingresosChart, calificacionChart, horasChart, pagosChart, radarChart, satisfaccionChart, tiempoChart, metasChart, comparativaChart], () => {
  const instances = [ventasChartInstance, categoriasChartInstance, ingresosChartInstance, calificacionChartInstance, horasChartInstance, pagosChartInstance, radarChartInstance, satisfaccionChartInstance, tiempoChartInstance, metasChartInstance, comparativaChartInstance]
  instances.forEach(instance => {
    if (instance) {
      instance.destroy()
    }
  })
})
</script>

<style scoped>
/* ============================================================
   VARIABLES Y ESTILOS GLOBALES
   ============================================================ */
.dashboard-container {
  padding: 1.25rem;
  max-width: 1800px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
  min-height: 100vh;
}

/* ============================================================
   GLASS EFFECT
   ============================================================ */
.glass-effect {
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08) !important;
}

/* ============================================================
   HEADER CON EFECTOS
   ============================================================ */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 1.25rem 1.5rem;
  border-radius: 1.5rem;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  position: relative;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #2F6FED, #1a5cdb);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.5rem;
  box-shadow: 0 4px 12px rgba(47, 111, 237, 0.3);
}

.logo-pulse {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  border: 2px solid rgba(47, 111, 237, 0.3);
  animation: pulse-ring 2s ease-in-out infinite;
}

@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}

.header-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a1a2e;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.title-badge {
  font-size: 0.5rem;
  font-weight: 700;
  text-transform: uppercase;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  padding: 0.15rem 0.6rem;
  border-radius: 0.5rem;
  animation: blink-badge 2s infinite;
}

@keyframes blink-badge {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.header-subtitle {
  color: #6b7280;
  font-size: 0.85rem;
  margin: 0.15rem 0 0 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(34, 197, 94, 0.1);
  padding: 0.3rem 0.8rem;
  border-radius: 2rem;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  animation: pulse-dot 1.5s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.5); }
}

.status-text {
  font-size: 0.7rem;
  font-weight: 600;
  color: #166534;
}

/* ============================================================
   KPI CARDS CON EFECTOS 3D
   ============================================================ */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.kpi-card {
  border-radius: 1.25rem;
  padding: 1.2rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.6s ease both;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.kpi-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12) !important;
}

.kpi-card .kpi-glow {
  position: absolute;
  top: -50%;
  right: -30%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(47, 111, 237, 0.05) 0%, transparent 70%);
  pointer-events: none;
}

.kpi-card.kpi-blue .kpi-glow { background: radial-gradient(circle, rgba(47, 111, 237, 0.1) 0%, transparent 70%); }
.kpi-card.kpi-green .kpi-glow { background: radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%); }
.kpi-card.kpi-purple .kpi-glow { background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%); }
.kpi-card.kpi-orange .kpi-glow { background: radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%); }
.kpi-card.kpi-yellow .kpi-glow { background: radial-gradient(circle, rgba(234, 179, 8, 0.1) 0%, transparent 70%); }
.kpi-card.kpi-red .kpi-glow { background: radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%); }

.kpi-icon-wrapper {
  position: relative;
  flex-shrink: 0;
}

.kpi-icon {
  width: 52px;
  height: 52px;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  position: relative;
  z-index: 1;
}

.kpi-ring {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 1.25rem;
  border: 2px solid rgba(47, 111, 237, 0.1);
  animation: spin-ring 4s linear infinite;
}

@keyframes spin-ring {
  to { transform: rotate(360deg); }
}

.kpi-content {
  flex: 1;
  min-width: 0;
  position: relative;
  z-index: 1;
}

.kpi-value {
  font-size: 1.6rem;
  font-weight: 800;
  color: #1a1a2e;
  display: block;
  line-height: 1.2;
}

.kpi-label {
  font-size: 0.7rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.kpi-footer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.15rem;
}

.kpi-trend {
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.kpi-trend.up { color: #22c55e; }
.kpi-trend.down { color: #ef4444; }

.kpi-subtext {
  font-size: 0.6rem;
  color: #9ca3af;
}

.kpi-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 0 0 1.25rem 1.25rem;
  overflow: hidden;
  z-index: 2;
}

.kpi-progress .progress-bar {
  height: 100%;
  border-radius: 0 0 1.25rem 1.25rem;
  transition: width 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.kpi-card.kpi-blue .progress-bar { background: linear-gradient(90deg, #2F6FED, #1a5cdb); }
.kpi-card.kpi-green .progress-bar { background: linear-gradient(90deg, #22c55e, #16a34a); }
.kpi-card.kpi-purple .progress-bar { background: linear-gradient(90deg, #8b5cf6, #7c3aed); }
.kpi-card.kpi-orange .progress-bar { background: linear-gradient(90deg, #f59e0b, #d97706); }
.kpi-card.kpi-yellow .progress-bar { background: linear-gradient(90deg, #eab308, #ca8a04); }
.kpi-card.kpi-red .progress-bar { background: linear-gradient(90deg, #ef4444, #dc2626); }

/* ============================================================
   CHART GRIDS
   ============================================================ */
.charts-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

.charts-row-three {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

.charts-row-four {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

.charts-row-two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

/* ============================================================
   CARDS
   ============================================================ */
.card {
  border-radius: 1.25rem;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1) !important;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.card-header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, rgba(47, 111, 237, 0.1), rgba(47, 111, 237, 0.05));
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2F6FED;
  font-size: 1rem;
}

.pulse-icon {
  animation: pulse-icon 2s ease-in-out infinite;
}

@keyframes pulse-icon {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.card-header h3 {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
}

.card-subtitle {
  font-size: 0.7rem;
  color: #6b7280;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-badge {
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.2rem 0.8rem;
  border-radius: 1rem;
  background: rgba(0, 0, 0, 0.05);
  color: #4b5563;
}

.card-badge.trend-up {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.card-badge.trend-down {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.card-body {
  padding: 0.8rem 1.5rem 1.5rem;
  height: 300px;
  position: relative;
}

.card-body.small-chart {
  height: 200px;
}

.card-body canvas {
  width: 100% !important;
  height: 100% !important;
}

/* ============================================================
   CHART STATS
   ============================================================ */
.chart-stats {
  display: flex;
  justify-content: space-around;
  padding: 0.8rem 1.5rem 1.2rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 0.6rem;
  color: #6b7280;
  text-transform: uppercase;
  display: block;
}

.stat-value {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1a1a2e;
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
   ACTIVITY LIST
   ============================================================ */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  max-height: 400px;
  overflow-y: auto;
}

.activity-list::-webkit-scrollbar {
  width: 4px;
}

.activity-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.activity-list::-webkit-scrollbar-thumb {
  background: #2F6FED;
  border-radius: 4px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  padding: 0.6rem 0.8rem;
  border-radius: 0.75rem;
  transition: all 0.2s;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.activity-item:hover {
  background: rgba(47, 111, 237, 0.05);
}

.activity-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 0.3rem;
  position: relative;
}

.dot-pulse {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  animation: dot-pulse 1.5s ease-in-out infinite;
}

@keyframes dot-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(2); opacity: 0; }
}

.activity-dot.completada { background: #22c55e; }
.activity-dot.en_preparacion { background: #f59e0b; }
.activity-dot.pendiente { background: #8b5cf6; }
.activity-dot.entregada { background: #2F6FED; }
.activity-dot.cancelada { background: #ef4444; }

.activity-price {
  font-weight: 700;
  color: #22c55e;
  font-size: 0.75rem;
}

/* ============================================================
   PLATOS LIST
   ============================================================ */
.platos-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.plato-item {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.6rem 0.8rem;
  border-radius: 0.75rem;
  transition: all 0.2s;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.plato-item:hover {
  background: rgba(47, 111, 237, 0.05);
}

.plato-rank-wrapper {
  position: relative;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.plato-rank {
  font-size: 0.7rem;
  font-weight: 800;
  color: #9ca3af;
}

.rank-medal {
  position: absolute;
  top: -6px;
  right: -6px;
  font-size: 0.6rem;
}

.medal-1 { color: #f59e0b; }
.medal-2 { color: #9ca3af; }
.medal-3 { color: #d97706; }

.plato-info {
  flex: 1;
  min-width: 0;
}

.plato-nombre {
  font-weight: 600;
  color: #1a1a2e;
  font-size: 0.85rem;
  display: block;
}

.plato-categoria {
  font-size: 0.6rem;
  color: #9ca3af;
}

.plato-stats {
  flex: 1;
  min-width: 100px;
}

.plato-ventas-bar {
  height: 4px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #2F6FED, #22c55e);
  border-radius: 4px;
  transition: width 1s ease;
}

.plato-numbers {
  display: flex;
  justify-content: space-between;
  margin-top: 0.2rem;
}

.plato-ventas {
  font-size: 0.65rem;
  color: #6b7280;
}

.plato-ingresos {
  font-size: 0.7rem;
  font-weight: 700;
  color: #22c55e;
}

/* ============================================================
   RESUMEN
   ============================================================ */
.resumen-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.resumen-item {
  background: rgba(0, 0, 0, 0.02);
  padding: 0.6rem 0.8rem;
  border-radius: 0.75rem;
  text-align: center;
  transition: all 0.2s;
  position: relative;
}

.resumen-item:hover {
  background: rgba(47, 111, 237, 0.05);
  transform: scale(1.02);
}

.resumen-label {
  font-size: 0.55rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
}

.resumen-value {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a1a2e;
  display: block;
  margin-top: 0.15rem;
}

.resumen-value.highlight {
  color: #2F6FED;
}

.resumen-trend {
  font-size: 0.55rem;
  margin-top: 0.1rem;
}

.trend-up { color: #22c55e; }

/* ============================================================
   CLIENTES
   ============================================================ */
.clientes-list {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.cliente-item {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.5rem 0.6rem;
  border-radius: 0.75rem;
  transition: all 0.2s;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.cliente-item:hover {
  background: rgba(47, 111, 237, 0.05);
}

.cliente-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.cliente-info {
  flex: 1;
}

.cliente-nombre {
  font-weight: 600;
  color: #1a1a2e;
  font-size: 0.8rem;
  display: block;
}

.cliente-visitas {
  font-size: 0.6rem;
  color: #6b7280;
}

.cliente-gasto {
  font-weight: 700;
  color: #2F6FED;
  font-size: 0.8rem;
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

.status-badge.completada {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.status-badge.en_preparacion {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.status-badge.pendiente {
  background: rgba(139, 92, 246, 0.1);
  color: #7c3aed;
}

.status-badge.entregada {
  background: rgba(47, 111, 237, 0.1);
  color: #1a5cdb;
}

.status-badge.cancelada {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

/* ============================================================
   ALERTAS
   ============================================================ */
.alertas-container {
  margin-bottom: 1.25rem;
}

.alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 1.2rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  border: 1px solid transparent;
  animation: slideIn 0.5s ease;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

.alert.success {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.2);
  color: #166534;
}

.alert.warning {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.2);
  color: #92400e;
}

.alert.danger {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.2);
  color: #991b1b;
}

.alert.info {
  background: rgba(47, 111, 237, 0.1);
  border-color: rgba(47, 111, 237, 0.2);
  color: #075985;
}

.alert-close {
  background: none;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  padding: 0 0.25rem;
  line-height: 1;
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 1400px) {
  .kpi-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1200px) {
  .charts-row {
    grid-template-columns: 1fr;
  }
  
  .charts-row-three {
    grid-template-columns: 1fr 1fr;
  }
  
  .charts-row-four {
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
  
  .charts-row-two {
    grid-template-columns: 1fr;
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
    padding: 1rem;
  }
  
  .header-right {
    justify-content: space-between;
  }
  
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  .charts-row-three {
    grid-template-columns: 1fr;
  }
  
  .charts-row-four {
    grid-template-columns: 1fr 1fr;
  }
  
  .right-column {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .card-body {
    height: 250px;
    padding: 0.6rem 1rem 1rem;
  }
  
  .card-body.small-chart {
    height: 180px;
  }
  
  .resumen-grid {
    grid-template-columns: repeat(3, 1fr);
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
    padding: 0.8rem 1rem;
  }
  
  .kpi-icon {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .kpi-value {
    font-size: 1.2rem;
  }
  
  .charts-row-four {
    grid-template-columns: 1fr;
  }
  
  .card-body {
    height: 200px;
  }
  
  .card-body.small-chart {
    height: 160px;
  }
  
  .resumen-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .header-title {
    font-size: 1.1rem;
  }
  
  .logo-icon {
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
  }
}
</style>