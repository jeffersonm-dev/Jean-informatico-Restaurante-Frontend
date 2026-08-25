<!-- src/views/restaurante/CuentaBancaria/CuentaBancariaView.vue -->
<template>
  <div class="page-container">
    <!-- HEADER -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-title">
          <i class="bi bi-bank"></i>
          <div>
            <h1>Cuentas Bancarias</h1>
            <p class="text-muted">Gestiona las cuentas bancarias de la empresa</p>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn btn-outline-secondary" @click="loadData" title="Actualizar">
          <i class="bi bi-arrow-clockwise" :class="{ spin: loading }"></i>
        </button>
        <router-link to="/cuentas-bancarias-empresa/nuevo" class="btn btn-primary">
          <i class="bi bi-plus-circle"></i> Nueva Cuenta
        </router-link>
      </div>
    </div>

    <!-- FILTROS -->
    <div class="filters-card">
      <div class="filter-group">
        <div class="filter-item">
          <label><i class="bi bi-search"></i> Buscar</label>
          <input 
            type="text" 
            v-model="filters.search" 
            placeholder="Banco, número, titular..."
            @input="applyFilters"
            class="form-control"
          >
        </div>
        <div class="filter-item">
          <label><i class="bi bi-toggle-on"></i> Estado</label>
          <select v-model="filters.estado" @change="applyFilters" class="form-control">
            <option value="">Todos</option>
            <option value="true">Activas</option>
            <option value="false">Inactivas</option>
          </select>
        </div>
        <div class="filter-item">
          <label><i class="bi bi-star"></i> Principal</label>
          <select v-model="filters.principal" @change="applyFilters" class="form-control">
            <option value="">Todos</option>
            <option value="true">Principales</option>
            <option value="false">Secundarias</option>
          </select>
        </div>
        <div class="filter-item">
          <label><i class="bi bi-building"></i> Sede</label>
          <select v-model="filters.sede_id" @change="applyFilters" class="form-control">
            <option value="">Todas</option>
            <option v-for="sede in sedes" :key="sede.id" :value="sede.id">
              {{ sede.nombre }}
            </option>
          </select>
        </div>
        <button class="btn btn-outline-secondary" @click="clearFilters">
          <i class="bi bi-eraser"></i> Limpiar
        </button>
      </div>
    </div>

    <!-- TABLA -->
    <div class="table-card">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Banco</th>
              <th>Número de Cuenta</th>
              <th>Tipo</th>
              <th>Titular</th>
              <th>RIF</th>
              <th>Sede</th>
              <th>Estado</th>
              <th>Principal</th>
              <th class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="item.id">
              <td>{{ ((page - 1) * pageSize) + index + 1 }}</td>
              <td>
                <div class="bank-info">
                  <strong>{{ item.banco }}</strong>
                  <small class="text-muted" v-if="item.codigo_swift">SWIFT: {{ item.codigo_swift }}</small>
                </div>
              </td>
              <td>
                <span class="account-number">{{ formatAccountNumber(item.numero_cuenta) }}</span>
              </td>
              <td>
                <span class="badge" :class="getTipoBadge(item.tipo_cuenta)">
                  {{ item.tipo_cuenta }}
                </span>
              </td>
              <td>{{ item.titular_nombre || 'N/A' }}</td>
              <td>
                <span v-if="item.numero_rif" class="rif-text">{{ item.numero_rif }}</span>
                <span v-else class="text-muted">N/A</span>
              </td>
              <td>{{ getSedeNombre(item.sede_id) }}</td>
              <td>
                <span class="badge" :class="item.activo ? 'badge-success' : 'badge-danger'">
                  {{ item.activo ? 'Activa' : 'Inactiva' }}
                </span>
              </td>
              <td>
                <span v-if="item.es_principal" class="badge badge-warning">
                  <i class="bi bi-star-fill"></i> Principal
                </span>
                <span v-else class="text-muted">-</span>
              </td>
              <td class="text-end">
                <div class="btn-group">
                  <button 
                    v-if="!item.es_principal && item.activo"
                    @click="setPrincipal(item)" 
                    class="btn btn-icon btn-warning"
                    title="Establecer como principal"
                  >
                    <i class="bi bi-star"></i>
                  </button>
                  <router-link 
                    :to="`/cuentas-bancarias-empresa/${item.id}`" 
                    class="btn btn-icon btn-primary"
                    title="Ver detalle"
                  >
                    <i class="bi bi-eye"></i>
                  </router-link>
                  <router-link 
                    :to="`/cuentas-bancarias-empresa/${item.id}/editar`" 
                    class="btn btn-icon btn-info"
                    title="Editar"
                  >
                    <i class="bi bi-pencil"></i>
                  </router-link>
                  <button 
                    @click="toggleStatus(item)" 
                    class="btn btn-icon" 
                    :class="item.activo ? 'btn-warning' : 'btn-success'"
                    :title="item.activo ? 'Desactivar' : 'Activar'"
                  >
                    <i class="bi" :class="item.activo ? 'bi-toggle-on' : 'bi-toggle-off'"></i>
                  </button>
                  <button 
                    @click="eliminar(item)" 
                    class="btn btn-icon btn-danger"
                    title="Eliminar"
                  >
                    <i class="bi bi-trash3"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!loading && !items.length">
              <td colspan="10" class="text-center py-5">
                <i class="bi bi-inbox fs-1 d-block text-muted"></i>
                <p class="text-muted mt-2">No hay cuentas bancarias registradas</p>
                <router-link to="/cuentas-bancarias-empresa/nuevo" class="btn btn-primary mt-2">
                  <i class="bi bi-plus-circle"></i> Crear primera cuenta
                </router-link>
              </td>
            </tr>
            <tr v-if="loading">
              <td colspan="10" class="text-center py-5">
                <div class="spinner"></div>
                <p class="text-muted mt-2">Cargando cuentas bancarias...</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PAGINACIÓN -->
      <div class="table-footer" v-if="totalPages > 1">
        <span class="text-muted">
          Mostrando {{ items.length }} de {{ totalRecords }} registros
        </span>
        <div class="pagination">
          <button 
            @click="changePage(page - 1)" 
            :disabled="page <= 1"
            class="btn btn-sm btn-outline-secondary"
          >
            <i class="bi bi-chevron-left"></i>
          </button>
          <span class="page-info">{{ page }} / {{ totalPages }}</span>
          <button 
            @click="changePage(page + 1)" 
            :disabled="page >= totalPages"
            class="btn btn-sm btn-outline-secondary"
          >
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL ELIMINAR -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3><i class="bi bi-exclamation-triangle text-danger"></i> Confirmar Eliminación</h3>
          <button class="modal-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="modal-icon">
            <i class="bi bi-trash3 text-danger"></i>
          </div>
          <p>
            ¿Está seguro que desea eliminar la cuenta bancaria 
            <strong>"{{ itemAEliminar?.banco }}"</strong>?
          </p>
          <div class="modal-warning">
            <p>
              <i class="bi bi-exclamation-circle"></i>
              Esta acción no se puede deshacer y eliminará permanentemente la cuenta.
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">Cancelar</button>
          <button class="btn btn-danger" @click="confirmDelete" :disabled="deleting">
            <i class="bi" :class="deleting ? 'bi-arrow-repeat spin' : 'bi-trash3'"></i>
            {{ deleting ? 'Eliminando...' : 'Sí, Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { CuentasBancariasAPI, SedesAPI } from '@/services/api'
import Swal from 'sweetalert2'

// ===== STATE =====
const items = ref([])
const sedes = ref([])
const loading = ref(false)
const deleting = ref(false)
const page = ref(1)
const pageSize = ref(10)
const totalRecords = ref(0)
const showDeleteModal = ref(false)
const itemAEliminar = ref(null)

// ===== FILTERS =====
const filters = reactive({
  search: '',
  estado: '',
  principal: '',
  sede_id: ''
})

// ===== COMPUTED =====
const totalPages = computed(() => Math.ceil(totalRecords.value / pageSize.value))

// ===== METHODS =====
async function loadData() {
  loading.value = true
  try {
    const params = {
      page: page.value,
      pageSize: pageSize.value,
      search: filters.search || undefined,
      activo: filters.estado !== '' ? filters.estado === 'true' : undefined,
      es_principal: filters.principal !== '' ? filters.principal === 'true' : undefined,
      sede_id: filters.sede_id || undefined
    }
    
    const res = await CuentasBancariasAPI.listPaginated(params)
    items.value = res.data.data || []
    totalRecords.value = res.data.total_records || 0
  } catch (error) {
    console.error('Error cargando cuentas bancarias:', error)
    Swal.fire('Error', 'No se pudieron cargar las cuentas bancarias', 'error')
  } finally {
    loading.value = false
  }
}

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

function applyFilters() {
  page.value = 1
  loadData()
}

function clearFilters() {
  filters.search = ''
  filters.estado = ''
  filters.principal = ''
  filters.sede_id = ''
  applyFilters()
}

function changePage(newPage) {
  if (newPage < 1 || newPage > totalPages.value) return
  page.value = newPage
  loadData()
}

async function setPrincipal(item) {
  const confirm = await Swal.fire({
    title: 'Establecer como cuenta principal',
    text: `¿Desea establecer ${item.banco} como la cuenta principal?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, establecer',
    cancelButtonText: 'Cancelar'
  })
  
  if (confirm.isConfirmed) {
    try {
      await CuentasBancariasAPI.setPrincipal({
        cuenta_id: item.id,
        sede_id: item.sede_id
      })
      await loadData()
      Swal.fire('Éxito', 'Cuenta principal establecida correctamente', 'success')
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'No se pudo establecer como principal', 'error')
    }
  }
}

async function toggleStatus(item) {
  const confirm = await Swal.fire({
    title: `${item.activo ? 'Desactivar' : 'Activar'} cuenta bancaria`,
    text: `¿Está seguro de ${item.activo ? 'desactivar' : 'activar'} la cuenta ${item.banco}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar'
  })
  
  if (confirm.isConfirmed) {
    try {
      await CuentasBancariasAPI.toggleStatus(item.id)
      await loadData()
      Swal.fire('Éxito', `Cuenta ${item.activo ? 'desactivada' : 'activada'} correctamente`, 'success')
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'No se pudo cambiar el estado', 'error')
    }
  }
}

function eliminar(item) {
  itemAEliminar.value = item
  showDeleteModal.value = true
}

function closeModal() {
  showDeleteModal.value = false
  itemAEliminar.value = null
  deleting.value = false
}

async function confirmDelete() {
  if (!itemAEliminar.value) return
  
  deleting.value = true
  try {
    await CuentasBancariasAPI.remove(itemAEliminar.value.id)
    await loadData()
    closeModal()
    Swal.fire('Eliminado', 'Cuenta bancaria eliminada correctamente', 'success')
  } catch (error) {
    Swal.fire('Error', error.response?.data?.message || 'No se pudo eliminar la cuenta', 'error')
  } finally {
    deleting.value = false
  }
}

// ===== LIFECYCLE =====
onMounted(() => {
  loadSedes()
  loadData()
})
</script>

<style scoped>
/* ============================================
   PAGE CONTAINER
   ============================================ */
.page-container {
  padding: 24px;
  max-width: 1400px;
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
   FILTERS
   ============================================ */
.filters-card {
  background: #ffffff;
  padding: 16px 20px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: flex-end;
}

.filter-item {
  flex: 1;
  min-width: 150px;
  max-width: 250px;
}

.filter-item label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  display: block;
  margin-bottom: 4px;
}

.filter-item label i {
  font-size: 12px;
  margin-right: 4px;
}

/* ============================================
   TABLE
   ============================================ */
.table-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.table-responsive {
  overflow-x: auto;
}

.table {
  margin: 0;
  width: 100%;
  border-collapse: collapse;
}

.table thead {
  background: #f8fafc;
}

.table thead th {
  padding: 12px 16px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.table tbody td {
  padding: 12px 16px;
  vertical-align: middle;
  border-bottom: 1px solid #f3f4f6;
  font-size: 14px;
  color: #374151;
}

.table tbody tr:hover {
  background: #f9fafb;
}

.table tbody tr:last-child td {
  border-bottom: none;
}

/* ============================================
   BANK INFO
   ============================================ */
.bank-info {
  display: flex;
  flex-direction: column;
}

.bank-info strong {
  font-weight: 600;
  color: #111827;
}

.bank-info small {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 2px;
}

.account-number {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #1a1a2e;
}

.rif-text {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  background: #f3f4f6;
  padding: 2px 8px;
  border-radius: 4px;
}

/* ============================================
   BADGES
   ============================================ */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 12px;
  border-radius: 20px;
  font-size: 11px;
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
  white-space: nowrap;
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

.btn-icon {
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: transparent;
  color: #6b7280;
  transition: all 0.2s ease;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.btn-icon.btn-primary {
  color: #2F6FED;
  border-color: #dbeafe;
}

.btn-icon.btn-primary:hover {
  background: #dbeafe;
  border-color: #2F6FED;
}

.btn-icon.btn-warning {
  color: #d97706;
  border-color: #fef3c7;
}

.btn-icon.btn-warning:hover {
  background: #fef3c7;
  border-color: #d97706;
}

.btn-icon.btn-info {
  color: #0891b2;
  border-color: #cffafe;
}

.btn-icon.btn-info:hover {
  background: #cffafe;
  border-color: #0891b2;
}

.btn-icon.btn-success {
  color: #16a34a;
  border-color: #dcfce7;
}

.btn-icon.btn-success:hover {
  background: #dcfce7;
  border-color: #16a34a;
}

.btn-icon.btn-danger {
  color: #dc2626;
  border-color: #fecaca;
}

.btn-icon.btn-danger:hover {
  background: #fecaca;
  border-color: #dc2626;
}

.btn-sm {
  padding: 6px 14px;
  font-size: 13px;
}

.btn-danger {
  background: #dc2626;
  color: #ffffff;
}

.btn-danger:hover:not(:disabled) {
  background: #b91c1c;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover {
  background: #d1d5db;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-group {
  display: inline-flex;
  gap: 4px;
  align-items: center;
}

/* ============================================
   PAGINATION
   ============================================ */
.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
  flex-wrap: wrap;
  gap: 8px;
}

.table-footer .text-muted {
  font-size: 13px;
  color: #6b7280;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-info {
  font-size: 14px;
  color: #6b7280;
  padding: 0 8px;
}

/* ============================================
   MODAL
   ============================================ */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
  backdrop-filter: blur(4px);
}

.modal {
  background: #ffffff;
  border-radius: 16px;
  max-width: 450px;
  width: 92%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-close {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #6b7280;
  padding: 0 8px;
  line-height: 1;
  transition: color 0.2s;
}

.modal-close:hover {
  color: #111827;
}

.modal-body {
  padding: 24px;
  text-align: center;
}

.modal-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.modal-body p {
  margin: 0 0 12px;
  font-size: 15px;
  color: #374151;
  line-height: 1.6;
}

.modal-body strong {
  color: #111827;
}

.modal-warning {
  background: #fef3c7;
  border: 1px solid #fcd34d;
  border-radius: 8px;
  padding: 12px 16px;
  margin-top: 12px;
}

.modal-warning p {
  margin: 0;
  color: #92400e;
  font-size: 14px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
}

/* ============================================
   SPINNER
   ============================================ */
.spin {
  animation: spin 1s linear infinite;
}

.spinner {
  width: 40px;
  height: 40px;
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

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from {
    transform: translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* ============================================
   FORM CONTROLS
   ============================================ */
.form-control {
  width: 100%;
  padding: 8px 14px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s ease;
  background: #ffffff;
  color: #111827;
}

.form-control:focus {
  outline: none;
  border-color: #2F6FED;
  box-shadow: 0 0 0 3px rgba(47, 111, 237, 0.08);
}

.form-control::placeholder {
  color: #9ca3af;
}

/* ============================================
   TEXT UTILITIES
   ============================================ */
.text-muted { color: #6b7280; }
.text-danger { color: #dc2626; }
.text-success { color: #16a34a; }
.text-warning { color: #d97706; }
.text-end { text-align: right; }
.text-center { text-align: center; }

.d-block { display: block; }
.fs-1 { font-size: 36px; }
.mt-2 { margin-top: 8px; }
.py-5 { padding: 48px 0; }

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 1024px) {
  .filter-item {
    min-width: 120px;
    max-width: 200px;
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

  .filter-group {
    flex-direction: column;
  }

  .filter-item {
    min-width: 100%;
    max-width: 100%;
  }

  .table-footer {
    flex-direction: column;
    align-items: center;
  }

  .modal {
    width: 95%;
  }

  .btn-group {
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .btn-icon {
    width: 28px;
    height: 28px;
    font-size: 13px;
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

  .table thead th {
    font-size: 10px;
    padding: 8px 10px;
  }

  .table tbody td {
    font-size: 13px;
    padding: 8px 10px;
  }

  .account-number {
    font-size: 12px;
  }

  .badge {
    font-size: 10px;
    padding: 2px 8px;
  }

  .btn {
    font-size: 13px;
    padding: 7px 14px;
  }
}
</style>