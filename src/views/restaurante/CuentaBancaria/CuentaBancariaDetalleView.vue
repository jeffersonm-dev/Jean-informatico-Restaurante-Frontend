<!-- src/views/restaurante/CuentaBancaria/CuentaBancariaDetalleView.vue -->
<template>
  <div class="page-container">
    <!-- HEADER -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-title">
          <i class="bi bi-bank"></i>
          <div>
            <h1>Detalle de Cuenta Bancaria</h1>
            <p class="text-muted">Información detallada de la cuenta bancaria</p>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <router-link to="/cuentas-bancarias-empresa" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left"></i> Volver
        </router-link>
        <router-link :to="`/cuentas-bancarias-empresa/${id}/editar`" class="btn btn-primary">
          <i class="bi bi-pencil"></i> Editar
        </router-link>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p class="text-muted mt-2">Cargando información de la cuenta...</p>
    </div>

    <!-- DETALLE -->
    <div v-else-if="item" class="detail-card">
      <!-- HEADER DE LA CUENTA -->
      <div class="detail-header">
        <div class="bank-icon" :class="item.activo ? 'active' : 'inactive'">
          <i class="bi bi-bank"></i>
        </div>
        <div class="bank-title">
          <h2>{{ item.banco }}</h2>
          <p>
            <i class="bi bi-person"></i>
            {{ item.titular_nombre || 'Sin titular' }}
          </p>
        </div>
        <div class="detail-badges">
          <span class="badge" :class="item.activo ? 'badge-success' : 'badge-danger'">
            <i class="bi" :class="item.activo ? 'bi-circle-fill' : 'bi-circle'"></i>
            {{ item.activo ? 'Activa' : 'Inactiva' }}
          </span>
          <span v-if="item.es_principal" class="badge badge-warning">
            <i class="bi bi-star-fill"></i> Principal
          </span>
        </div>
      </div>

      <!-- GRID DE INFORMACIÓN -->
      <div class="detail-grid">
        <div class="detail-item">
          <label><i class="bi bi-hash"></i> Número de Cuenta</label>
          <div class="detail-value">{{ formatAccountNumber(item.numero_cuenta) }}</div>
        </div>
        <div class="detail-item">
          <label><i class="bi bi-tag"></i> Tipo de Cuenta</label>
          <div class="detail-value">
            <span class="badge" :class="getTipoBadge(item.tipo_cuenta)">{{ item.tipo_cuenta }}</span>
          </div>
        </div>
        <div class="detail-item">
          <label><i class="bi bi-card-text"></i> RIF</label>
          <div class="detail-value">{{ item.numero_rif || 'N/A' }}</div>
        </div>
        <div class="detail-item">
          <label><i class="bi bi-person"></i> Titular</label>
          <div class="detail-value">{{ item.titular_nombre || 'N/A' }}</div>
        </div>
        <div class="detail-item">
          <label><i class="bi bi-building"></i> Sede</label>
          <div class="detail-value">{{ getSedeNombre(item.sede_id) }}</div>
        </div>
        <div class="detail-item">
          <label><i class="bi bi-code-square"></i> Código SWIFT</label>
          <div class="detail-value">{{ item.codigo_swift || 'N/A' }}</div>
        </div>
        <div class="detail-item full" v-if="item.observaciones">
          <label><i class="bi bi-card-text"></i> Observaciones</label>
          <div class="detail-value">{{ item.observaciones }}</div>
        </div>
        <div class="detail-item">
          <label><i class="bi bi-calendar-plus"></i> Fecha de Creación</label>
          <div class="detail-value">{{ formatDate(item.fecha_creacion) }}</div>
        </div>
        <div class="detail-item" v-if="item.fecha_actualizacion">
          <label><i class="bi bi-calendar-check"></i> Última Actualización</label>
          <div class="detail-value">{{ formatDate(item.fecha_actualizacion) }}</div>
        </div>
      </div>

      <!-- ACCIONES ADICIONALES -->
      <div class="detail-actions" v-if="item.activo && !item.es_principal">
        <button class="btn btn-warning" @click="setPrincipal">
          <i class="bi bi-star"></i> Establecer como Principal
        </button>
      </div>
    </div>

    <!-- NO ENCONTRADO -->
    <div v-else class="empty-state">
      <i class="bi bi-exclamation-circle"></i>
      <p>No se encontró la cuenta bancaria</p>
      <router-link to="/cuentas-bancarias-empresa" class="btn btn-primary mt-2">
        <i class="bi bi-arrow-left"></i> Volver al listado
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CuentasBancariasAPI, SedesAPI } from '@/services/api'
import Swal from 'sweetalert2'

// ===== ROUTER =====
const route = useRoute()
const router = useRouter()

// ===== STATE =====
const id = ref(route.params.id)
const item = ref(null)
const loading = ref(false)
const sedes = ref([])

// ===== METHODS =====
async function loadSedes() {
  try {
    const res = await SedesAPI.list()
    sedes.value = res.data.data || []
  } catch (error) {
    console.error('Error cargando sedes:', error)
  }
}

function getSedeNombre(id) {
  const sede = sedes.value.find(s => s.id === id)
  return sede ? sede.nombre : 'N/A'
}

function getTipoBadge(tipo) {
  const map = {
    'Corriente': 'badge-primary',
    'Ahorro': 'badge-success',
    'Nómina': 'badge-info',
    'Inversión': 'badge-warning'
  }
  return map[tipo] || 'badge-secondary'
}

function formatAccountNumber(numero) {
  if (!numero) return ''
  const clean = numero.replace(/\D/g, '')
  const groups = clean.match(/.{1,4}/g)
  return groups ? groups.join('-') : numero
}

function formatDate(date) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function loadItem() {
  loading.value = true
  try {
    const res = await CuentasBancariasAPI.getById(id.value)
    item.value = res.data
  } catch (error) {
    Swal.fire('Error', 'No se pudo cargar el detalle de la cuenta', 'error')
    router.push('/cuentas-bancarias-empresa')
  } finally {
    loading.value = false
  }
}

async function setPrincipal() {
  const confirm = await Swal.fire({
    title: 'Establecer como cuenta principal',
    text: `¿Desea establecer ${item.value.banco} como la cuenta principal de la sede?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, establecer',
    cancelButtonText: 'Cancelar'
  })
  
  if (confirm.isConfirmed) {
    try {
      await CuentasBancariasAPI.setPrincipal({
        cuenta_id: item.value.id,
        sede_id: item.value.sede_id
      })
      await loadItem()
      Swal.fire('Éxito', 'Cuenta principal establecida correctamente', 'success')
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'No se pudo establecer como principal', 'error')
    }
  }
}

// ===== LIFECYCLE =====
onMounted(async () => {
  await loadSedes()
  await loadItem()
})
</script>

<style scoped>
/* ============================================
   PAGE CONTAINER
   ============================================ */
.page-container {
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;
}

/* ============================================
   HEADER
   ============================================ */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
  background: #ffffff;
  padding: 20px 24px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-title i {
  font-size: 32px;
  color: #2F6FED;
  background: #e8eeff;
  padding: 12px;
  border-radius: 12px;
}

.header-title h1 {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.header-title .text-muted {
  color: #6b7280;
  font-size: 14px;
  margin: 2px 0 0;
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

/* ============================================
   LOADING
   ============================================ */
.loading-state {
  text-align: center;
  padding: 60px 20px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #2F6FED;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ============================================
   DETAIL CARD
   ============================================ */
.detail-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

/* ============================================
   DETAIL HEADER
   ============================================ */
.detail-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px 32px;
  background: linear-gradient(135deg, #f8fafc 0%, #e8eeff 100%);
  border-bottom: 1px solid #e5e7eb;
  flex-wrap: wrap;
}

.bank-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.bank-icon.active {
  background: #2F6FED;
}

.bank-icon.inactive {
  background: #9ca3af;
}

.bank-icon i {
  font-size: 28px;
  color: #ffffff;
}

.bank-title {
  flex: 1;
  min-width: 150px;
}

.bank-title h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #111827;
}

.bank-title p {
  margin: 4px 0 0;
  color: #6b7280;
  font-size: 14px;
}

.bank-title p i {
  margin-right: 6px;
}

.detail-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* ============================================
   BADGES
   ============================================ */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.badge-success {
  background: #dcfce7;
  color: #16a34a;
}

.badge-danger {
  background: #fecaca;
  color: #dc2626;
}

.badge-warning {
  background: #fef3c7;
  color: #d97706;
}

.badge-primary {
  background: #dbeafe;
  color: #2563eb;
}

.badge-info {
  background: #cffafe;
  color: #0891b2;
}

.badge-secondary {
  background: #f3f4f6;
  color: #6b7280;
}

/* ============================================
   DETAIL GRID
   ============================================ */
.detail-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 0;
}

.detail-item {
  padding: 18px 24px;
  border-bottom: 1px solid #f3f4f6;
  border-right: 1px solid #f3f4f6;
}

.detail-item:nth-child(3n) {
  border-right: none;
}

.detail-item.full {
  grid-column: 1 / -1;
}

.detail-item label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: #9ca3af;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 6px;
}

.detail-item label i {
  font-size: 12px;
}

.detail-value {
  font-size: 15px;
  color: #111827;
  font-weight: 500;
}

/* ============================================
   DETAIL ACTIONS
   ============================================ */
.detail-actions {
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* ============================================
   BUTTONS
   ============================================ */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 9px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  font-family: inherit;
}

.btn-primary {
  background: #2F6FED;
  color: #ffffff;
}

.btn-primary:hover {
  background: #1a5adf;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(47, 111, 237, 0.3);
}

.btn-outline-secondary {
  background: transparent;
  color: #6b7280;
  border: 1.5px solid #d1d5db;
}

.btn-outline-secondary:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn-warning {
  background: #d97706;
  color: #ffffff;
}

.btn-warning:hover {
  background: #b45309;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
}

/* ============================================
   EMPTY STATE
   ============================================ */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.empty-state i {
  font-size: 48px;
  color: #d1d5db;
  display: block;
  margin-bottom: 16px;
}

.empty-state p {
  color: #6b7280;
  font-size: 16px;
  margin: 0;
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 1024px) {
  .detail-grid {
    grid-template-columns: 1fr 1fr;
  }

  .detail-item:nth-child(2n) {
    border-right: none;
  }

  .detail-item:nth-child(3n) {
    border-right: 1px solid #f3f4f6;
  }

  .detail-item.full {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .page-container {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
  }

  .header-title h1 {
    font-size: 18px;
  }

  .header-actions {
    justify-content: stretch;
  }

  .header-actions .btn {
    flex: 1;
    justify-content: center;
  }

  .detail-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 20px;
  }

  .bank-title {
    text-align: center;
  }

  .detail-badges {
    justify-content: center;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .detail-item {
    border-right: none !important;
  }

  .detail-item.full {
    grid-column: 1;
  }

  .detail-item label {
    font-size: 10px;
  }

  .detail-value {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .header-title i {
    font-size: 24px;
    padding: 8px;
  }

  .header-title h1 {
    font-size: 16px;
  }

  .bank-icon {
    width: 48px;
    height: 48px;
  }

  .bank-icon i {
    font-size: 20px;
  }

  .bank-title h2 {
    font-size: 18px;
  }

  .detail-item {
    padding: 14px 16px;
  }

  .detail-actions {
    flex-direction: column;
  }

  .detail-actions .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>