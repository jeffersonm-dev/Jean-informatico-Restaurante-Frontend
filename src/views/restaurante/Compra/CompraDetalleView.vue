<!-- src/views/restaurante/Compra/CompraDetalleView.vue -->
<template>
  <div class="page-container">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner"></div>
      <p class="text-muted mt-2">Cargando compra...</p>
    </div>

    <div v-else-if="compra" class="detalle-content">
      <!-- HEADER -->
      <div class="page-header">
        <div class="header-left">
          <div class="header-title">
            <i class="bi bi-cart-check"></i>
            <div>
              <h1>Compra #{{ compra.numero_compra || compra.id }}</h1>
              <p class="text-muted">Detalle completo de la compra</p>
            </div>
          </div>
        </div>
        <div class="header-actions">
          <router-link to="/compras" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left"></i> Volver
          </router-link>
          <button class="btn btn-primary" @click="imprimirCompra">
            <i class="bi bi-printer"></i> Imprimir
          </button>
        </div>
      </div>

      <!-- ESTADO Y ACCIONES -->
      <div class="estado-bar">
        <div class="estado-info">
          <span class="badge" :class="getEstadoClass(compra.estado)">
            <i :class="getEstadoIcon(compra.estado)"></i>
            {{ compra.estado }}
          </span>
          <span class="fecha-info">
            <i class="bi bi-clock"></i>
            {{ formatearFechaCompleta(compra.fecha_compra) }}
          </span>
          <span class="proveedor-info" v-if="compra.proveedor_nombre">
            <i class="bi bi-truck"></i>
            {{ compra.proveedor_nombre }}
          </span>
        </div>
        <div class="estado-actions" v-if="compra.estado !== 'Cancelada' && compra.estado !== 'Recibida'">
          <button class="btn btn-success btn-sm" @click="aprobar" v-if="compra.estado === 'Pendiente'">
            <i class="bi bi-check2"></i> Aprobar
          </button>
          <button class="btn btn-warning btn-sm" @click="recibir" v-if="compra.estado === 'Aprobada'">
            <i class="bi bi-box-seam"></i> Recibir
          </button>
          <button class="btn btn-danger btn-sm" @click="cancelar">
            <i class="bi bi-x-circle"></i> Cancelar
          </button>
        </div>
      </div>

      <!-- DATOS DE LA COMPRA -->
      <div class="detalle-grid">
        <div class="detalle-card">
          <h4><i class="bi bi-truck"></i> Proveedor</h4>
          <p><strong>{{ compra.proveedor_nombre || 'N/A' }}</strong></p>
          <p v-if="compra.proveedor_ruc"><i class="bi bi-card-list"></i> RUC: {{ compra.proveedor_ruc }}</p>
          <p v-if="compra.proveedor_telefono"><i class="bi bi-telephone"></i> {{ compra.proveedor_telefono }}</p>
        </div>

        <div class="detalle-card">
          <h4><i class="bi bi-geo-alt"></i> Ubicación</h4>
          <p><strong>Sede:</strong> {{ compra.sede_nombre || compra.sede_id || 'N/A' }}</p>
          <p v-if="compra.tipo_pago"><strong>Tipo Pago:</strong> {{ compra.tipo_pago }}</p>
          <p v-if="compra.condiciones_pago"><strong>Condiciones:</strong> {{ compra.condiciones_pago }}</p>
        </div>

        <div class="detalle-card">
          <h4><i class="bi bi-calculator"></i> Totales</h4>
          <p><strong>Subtotal:</strong> S/ {{ formatCurrency(calcularSubtotal) }}</p>
          <p v-if="compra.descuento > 0"><strong>Descuento ({{ compra.descuento }}%):</strong> -S/ {{ formatCurrency(calcularDescuento) }}</p>
          <p v-if="compra.impuesto > 0"><strong>Impuesto ({{ compra.impuesto }}%):</strong> +S/ {{ formatCurrency(calcularImpuesto) }}</p>
          <p class="total-destacado"><strong>Total:</strong> S/ {{ formatCurrency(calcularTotal) }}</p>
        </div>

        <div class="detalle-card">
          <h4><i class="bi bi-calendar"></i> Fechas</h4>
          <p><strong>Compra:</strong> {{ formatearFechaCompleta(compra.fecha_compra) }}</p>
          <p v-if="compra.fecha_requerida"><strong>Requerida:</strong> {{ formatearFecha(compra.fecha_requerida) }}</p>
          <p v-if="compra.fecha_recepcion"><strong>Recepción:</strong> {{ formatearFechaCompleta(compra.fecha_recepcion) }}</p>
          <p v-if="compra.fecha_aprobacion"><strong>Aprobación:</strong> {{ formatearFechaCompleta(compra.fecha_aprobacion) }}</p>
        </div>
      </div>

      <!-- NOTA -->
      <div v-if="compra.nota" class="notas-section">
        <div class="nota-item">
          <h5><i class="bi bi-sticky"></i> Nota</h5>
          <p>{{ compra.nota }}</p>
        </div>
      </div>

      <!-- DETALLES DE LA COMPRA -->
      <div class="detalles-section">
        <h3><i class="bi bi-list-ul"></i> Productos</h3>
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Producto</th>
                <th class="text-center">Cantidad</th>
                <th class="text-end">Precio Unit.</th>
                <th class="text-end">Descuento</th>
                <th class="text-end">Subtotal</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(detalle, index) in compra.detalles" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ detalle.producto_nombre || detalle.producto_id }}</td>
                <td class="text-center">{{ detalle.cantidad }}</td>
                <td class="text-end">S/ {{ formatCurrency(detalle.precio_unitario) }}</td>
                <td class="text-end">{{ detalle.descuento || 0 }}%</td>
                <td class="text-end">S/ {{ formatCurrency(detalle.cantidad * detalle.precio_unitario * (1 - (detalle.descuento || 0) / 100)) }}</td>
                <td>{{ detalle.observaciones || '-' }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="5" class="text-end"><strong>Subtotal:</strong></td>
                <td class="text-end">S/ {{ formatCurrency(calcularSubtotal) }}</td>
                <td></td>
              </tr>
              <tr v-if="compra.descuento > 0">
                <td colspan="5" class="text-end"><strong>Descuento ({{ compra.descuento }}%):</strong></td>
                <td class="text-end text-danger">- S/ {{ formatCurrency(calcularDescuento) }}</td>
                <td></td>
              </tr>
              <tr v-if="compra.impuesto > 0">
                <td colspan="5" class="text-end"><strong>Impuesto ({{ compra.impuesto }}%):</strong></td>
                <td class="text-end">+ S/ {{ formatCurrency(calcularImpuesto) }}</td>
                <td></td>
              </tr>
              <tr class="total-row">
                <td colspan="5" class="text-end"><strong>Total:</strong></td>
                <td class="text-end total-compra">S/ {{ formatCurrency(calcularTotal) }}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-5">
      <i class="bi bi-exclamation-triangle fs-1 d-block text-warning"></i>
      <p class="text-muted mt-2">No se encontró la compra</p>
      <router-link to="/compras" class="btn btn-primary">Volver a Compras</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ComprasAPI } from '@/services/api'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const compra = ref(null)

const calcularSubtotal = computed(() => {
  if (!compra.value || !compra.value.detalles) return 0
  return compra.value.detalles.reduce((sum, d) => {
    const desc = (d.descuento || 0) / 100
    return sum + (d.cantidad * d.precio_unitario * (1 - desc))
  }, 0)
})

const calcularDescuento = computed(() => {
  if (!compra.value) return 0
  const desc = parseFloat(compra.value.descuento) || 0
  return (calcularSubtotal.value * desc) / 100
})

const calcularImpuesto = computed(() => {
  if (!compra.value) return 0
  const imp = parseFloat(compra.value.impuesto) || 0
  const base = calcularSubtotal.value - calcularDescuento.value
  return (base * imp) / 100
})

const calcularTotal = computed(() => {
  return calcularSubtotal.value - calcularDescuento.value + calcularImpuesto.value
})

function formatCurrency(value) {
  if (value === null || value === undefined) return '0.00'
  return new Intl.NumberFormat('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

function getEstadoClass(estado) {
  const classes = {
    'Pendiente': 'badge-warning',
    'Aprobada': 'badge-info',
    'Recibida': 'badge-success',
    'Cancelada': 'badge-danger'
  }
  return classes[estado] || 'badge-secondary'
}

function getEstadoIcon(estado) {
  const icons = {
    'Pendiente': 'bi-clock',
    'Aprobada': 'bi-check2-circle',
    'Recibida': 'bi-box-seam',
    'Cancelada': 'bi-x-circle'
  }
  return icons[estado] || 'bi-circle'
}

function formatearFecha(fecha) {
  if (!fecha) return 'N/A'
  try {
    const d = new Date(fecha)
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

async function loadCompra() {
  const id = route.params.id
  if (!id) {
    router.push('/compras')
    return
  }

  loading.value = true
  try {
    const res = await ComprasAPI.getById(id)
    if (res.data && res.data.success) {
      compra.value = res.data.data
    } else if (res.data) {
      compra.value = res.data
    } else {
      compra.value = null
    }
  } catch (error) {
    console.error('Error cargando compra:', error)
    Swal.fire('Error', 'No se pudo cargar la compra', 'error')
    compra.value = null
  } finally {
    loading.value = false
  }
}

async function aprobar() {
  if (!compra.value) return

  const result = await Swal.fire({
    title: 'Aprobar Compra',
    text: `¿Estás seguro de aprobar la compra #${compra.value.numero_compra || compra.value.id}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#22c55e',
    confirmButtonText: 'Sí, aprobar',
    cancelButtonText: 'No'
  })

  if (result.isConfirmed) {
    try {
      await ComprasAPI.aprobar(compra.value.id, {
        usuario_aprobacion: 1,
        fecha_aprobacion: new Date().toISOString()
      })
      Swal.fire('Éxito', 'Compra aprobada correctamente', 'success')
      await loadCompra()
    } catch (error) {
      const msg = error.response?.data?.message || 'No se pudo aprobar la compra'
      Swal.fire('Error', msg, 'error')
    }
  }
}

async function recibir() {
  if (!compra.value) return

  const result = await Swal.fire({
    title: 'Recibir Compra',
    text: `¿Estás seguro de recibir la compra #${compra.value.numero_compra || compra.value.id}? Se actualizará el inventario.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#d97706',
    confirmButtonText: 'Sí, recibir',
    cancelButtonText: 'No'
  })

  if (result.isConfirmed) {
    try {
      await ComprasAPI.recibir(compra.value.id, {
        fecha_recepcion: new Date().toISOString()
      })
      Swal.fire('Éxito', 'Compra recibida. Inventario actualizado.', 'success')
      await loadCompra()
    } catch (error) {
      const msg = error.response?.data?.message || 'No se pudo recibir la compra'
      Swal.fire('Error', msg, 'error')
    }
  }
}

async function cancelar() {
  if (!compra.value) return

  const result = await Swal.fire({
    title: 'Cancelar Compra',
    text: `¿Estás seguro de cancelar la compra #${compra.value.numero_compra || compra.value.id}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'Sí, Cancelar',
    cancelButtonText: 'No'
  })

  if (result.isConfirmed) {
    const { value: motivo } = await Swal.fire({
      title: 'Motivo de cancelación',
      input: 'text',
      inputPlaceholder: 'Ingresa el motivo de cancelación...',
      showCancelButton: true,
      confirmButtonText: 'Cancelar Compra',
      cancelButtonText: 'Volver'
    })

    if (motivo !== undefined) {
      try {
        await ComprasAPI.cancelar(compra.value.id, motivo || 'Cancelada por usuario')
        Swal.fire('Compra cancelada', 'La compra ha sido cancelada', 'success')
        await loadCompra()
      } catch (error) {
        const msg = error.response?.data?.message || 'No se pudo cancelar la compra'
        Swal.fire('Error', msg, 'error')
      }
    }
  }
}

function imprimirCompra() {
  window.print()
}

// ===== LIFECYCLE =====
onMounted(() => {
  loadCompra()
})
</script>

<style scoped>
/* Estilos iguales a los anteriores */
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
.estado-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.badge { display: inline-flex; align-items: center; gap: 4px; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; }
.badge-warning { background: #fef3c7; color: #d97706; }
.badge-info { background: #dbeafe; color: #2563eb; }
.badge-success { background: #dcfce7; color: #16a34a; }
.badge-danger { background: #fecaca; color: #dc2626; }
.badge-secondary { background: #f3f4f6; color: #6b7280; }
.fecha-info { color: #6b7280; font-size: 14px; }
.fecha-info i { margin-right: 4px; }
.proveedor-info { color: #6b7280; font-size: 14px; }
.proveedor-info i { margin-right: 4px; }
.detalle-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.detalle-card { background: #ffffff; padding: 16px 20px; border-radius: 12px; border: 1px solid #e5e7eb; }
.detalle-card h4 { font-size: 14px; font-weight: 600; color: #6b7280; margin: 0 0 8px 0; display: flex; align-items: center; gap: 6px; }
.detalle-card h4 i { color: #2F6FED; }
.detalle-card p { margin: 4px 0; font-size: 14px; color: #374151; }
.detalle-card p strong { color: #111827; }
.total-destacado { font-size: 16px; color: #E85D3A; }
.notas-section { margin-bottom: 24px; }
.nota-item { background: #f8fafc; padding: 16px 20px; border-radius: 12px; border-left: 4px solid #2F6FED; }
.nota-item h5 { font-size: 14px; font-weight: 600; color: #374151; margin: 0 0 4px 0; display: flex; align-items: center; gap: 6px; }
.nota-item p { margin: 0; color: #4b5563; font-size: 14px; }
.detalles-section { background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; padding: 20px; margin-bottom: 24px; }
.detalles-section h3 { font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 16px 0; display: flex; align-items: center; gap: 8px; }
.detalles-section h3 i { color: #2F6FED; }
.table { width: 100%; border-collapse: collapse; }
.table thead { background: #f8fafc; }
.table thead th { padding: 10px 14px; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #6b7280; border-bottom: 1px solid #e5e7eb; }
.table tbody td { padding: 10px 14px; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #374151; }
.table tbody tr:last-child td { border-bottom: none; }
.table tfoot th { padding: 10px 14px; border-top: 2px solid #e5e7eb; font-size: 14px; color: #111827; }
.total-row td { font-size: 16px; border-top: 2px solid #e5e7eb; }
.total-compra { font-size: 20px; font-weight: 700; color: #E85D3A; }
.text-end { text-align: right; }
.text-center { text-align: center; }
.text-danger { color: #dc2626; }
.text-muted { color: #6b7280; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 18px; border: none; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s ease; text-decoration: none; font-family: inherit; white-space: nowrap; }
.btn-sm { padding: 4px 14px; font-size: 13px; }
.btn-primary { background: #2F6FED; color: #ffffff; }
.btn-primary:hover { background: #1a5adf; box-shadow: 0 4px 12px rgba(47,111,237,0.3); }
.btn-outline-secondary { background: transparent; color: #6b7280; border: 1.5px solid #d1d5db; }
.btn-outline-secondary:hover { background: #f9fafb; border-color: #9ca3af; }
.btn-success { background: #22c55e; color: #ffffff; }
.btn-success:hover { background: #16a34a; }
.btn-warning { background: #d97706; color: #ffffff; }
.btn-warning:hover { background: #b45309; }
.btn-danger { background: #dc2626; color: #ffffff; }
.btn-danger:hover { background: #b91c1c; }
.spinner { width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top: 4px solid #2F6FED; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@media print { .header-actions, .estado-actions { display: none; } .page-container { padding: 0; } .page-header, .estado-bar, .detalle-card, .detalles-section, .notas-section { border: 1px solid #e5e7eb; } }
@media (max-width: 1024px) { .detalle-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .page-container { padding: 12px; } .page-header { flex-direction: column; align-items: stretch; padding: 16px; } .header-title h1 { font-size: 18px; } .header-actions { justify-content: stretch; } .header-actions .btn { flex: 1; justify-content: center; } .detalle-grid { grid-template-columns: 1fr; } .estado-bar { flex-direction: column; align-items: stretch; } .estado-actions { justify-content: stretch; } .estado-actions .btn { flex: 1; justify-content: center; } .table { font-size: 13px; } .table thead th, .table tbody td { padding: 6px 10px; } }
@media (max-width: 480px) { .header-title i { font-size: 24px; padding: 8px; } .header-title h1 { font-size: 16px; } .badge { font-size: 11px; padding: 4px 10px; } .btn { font-size: 13px; padding: 6px 12px; } }
</style>