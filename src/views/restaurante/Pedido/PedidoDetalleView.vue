<!-- src/views/restaurante/Pedido/PedidoDetalleView.vue -->
<template>
  <div class="page-container">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner"></div>
      <p class="text-muted mt-2">Cargando pedido...</p>
    </div>

    <div v-else-if="pedido" class="detalle-content">
      <!-- HEADER -->
      <div class="page-header">
        <div class="header-left">
          <div class="header-title">
            <i class="bi bi-cart-check"></i>
            <div>
              <h1>Pedido #{{ pedido.numero_pedido || pedido.id }}</h1>
              <p class="text-muted">Detalle completo del pedido</p>
            </div>
          </div>
        </div>
        <div class="header-actions">
          <router-link to="/pedidos" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left"></i> Volver
          </router-link>
          <button class="btn btn-primary" @click="imprimirPedido">
            <i class="bi bi-printer"></i> Imprimir
          </button>
        </div>
      </div>

      <!-- ESTADO Y ACCIONES -->
      <div class="estado-bar">
        <div class="estado-info">
          <span class="badge" :class="getEstadoClass(pedido.estado)">
            <i :class="getEstadoIcon(pedido.estado)"></i>
            {{ pedido.estado }}
          </span>
          <span class="fecha-info">
            <i class="bi bi-clock"></i>
            {{ formatearFechaCompleta(pedido.fecha_pedido) }}
          </span>
          <span class="prioridad-info" v-if="pedido.prioridad">
            <i class="bi bi-flag"></i>
            Prioridad: {{ pedido.prioridad }}
          </span>
        </div>
        <div class="estado-actions" v-if="pedido.estado !== 'Cancelado' && pedido.estado !== 'Entregado'">
          <button class="btn btn-warning btn-sm" @click="cambiarEstado('En preparación')" v-if="pedido.estado === 'Pendiente'">
            <i class="bi bi-hourglass-split"></i> Preparar
          </button>
          <button class="btn btn-info btn-sm" @click="cambiarEstado('Listo')" v-if="pedido.estado === 'En preparación'">
            <i class="bi bi-check-circle"></i> Marcar Listo
          </button>
          <button class="btn btn-success btn-sm" @click="cambiarEstado('Entregado')" v-if="pedido.estado === 'Listo'">
            <i class="bi bi-check-all"></i> Entregar
          </button>
          <button class="btn btn-danger btn-sm" @click="cancelarPedido">
            <i class="bi bi-x-circle"></i> Cancelar
          </button>
        </div>
      </div>

      <!-- DATOS DEL PEDIDO -->
      <div class="detalle-grid">
        <div class="detalle-card">
          <h4><i class="bi bi-person"></i> Cliente</h4>
          <p><strong>{{ pedido.cliente_nombre || 'N/A' }}</strong></p>
          <p v-if="pedido.cliente_telefono"><i class="bi bi-telephone"></i> {{ pedido.cliente_telefono }}</p>
          <p v-if="pedido.cliente_email"><i class="bi bi-envelope"></i> {{ pedido.cliente_email }}</p>
        </div>

        <div class="detalle-card">
          <h4><i class="bi bi-geo-alt"></i> Ubicación</h4>
          <p><strong>Sede:</strong> {{ pedido.sede_nombre || pedido.sede_id || 'N/A' }}</p>
          <p v-if="pedido.mesa_nombre"><strong>Mesa:</strong> {{ pedido.mesa_nombre }}</p>
          <p v-if="pedido.tipo_pedido"><strong>Tipo:</strong> {{ pedido.tipo_pedido }}</p>
          <p v-if="pedido.direccion_entrega"><strong>Dirección:</strong> {{ pedido.direccion_entrega }}</p>
        </div>

        <div class="detalle-card">
          <h4><i class="bi bi-credit-card"></i> Pago</h4>
          <p v-if="pedido.metodo_pago"><strong>Método:</strong> {{ pedido.metodo_pago }}</p>
          <p v-if="pedido.referencia_pago"><strong>Referencia:</strong> {{ pedido.referencia_pago }}</p>
          <p v-if="pedido.comision_delivery"><strong>Comisión Delivery:</strong> S/ {{ formatCurrency(pedido.comision_delivery) }}</p>
        </div>

        <div class="detalle-card">
          <h4><i class="bi bi-calendar"></i> Fechas</h4>
          <p><strong>Pedido:</strong> {{ formatearFechaCompleta(pedido.fecha_pedido) }}</p>
          <p v-if="pedido.fecha_entrega"><strong>Entrega:</strong> {{ formatearFechaCompleta(pedido.fecha_entrega) }}</p>
          <p v-if="pedido.fecha_estimada_entrega"><strong>Estimada:</strong> {{ formatearFechaCompleta(pedido.fecha_estimada_entrega) }}</p>
        </div>
      </div>

      <!-- NOTAS -->
      <div v-if="pedido.nota || pedido.instrucciones_especiales" class="notas-section">
        <div v-if="pedido.nota" class="nota-item">
          <h5><i class="bi bi-sticky"></i> Nota</h5>
          <p>{{ pedido.nota }}</p>
        </div>
        <div v-if="pedido.instrucciones_especiales" class="nota-item">
          <h5><i class="bi bi-exclamation-triangle"></i> Instrucciones Especiales</h5>
          <p>{{ pedido.instrucciones_especiales }}</p>
        </div>
      </div>

      <!-- DETALLES DEL PEDIDO -->
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
                <th class="text-end">Subtotal</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(detalle, index) in pedido.detalles" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ detalle.producto_nombre || detalle.producto_id }}</td>
                <td class="text-center">{{ detalle.cantidad }}</td>
                <td class="text-end">S/ {{ formatCurrency(detalle.precio_unitario) }}</td>
                <td class="text-end">S/ {{ formatCurrency(detalle.cantidad * detalle.precio_unitario) }}</td>
                <td>{{ detalle.observaciones || '-' }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" class="text-end"><strong>Subtotal:</strong></td>
                <td class="text-end">S/ {{ formatCurrency(calcularSubtotal) }}</td>
                <td></td>
              </tr>
              <tr v-if="pedido.descuento > 0">
                <td colspan="4" class="text-end"><strong>Descuento ({{ pedido.descuento }}%):</strong></td>
                <td class="text-end text-danger">- S/ {{ formatCurrency(calcularDescuento) }}</td>
                <td></td>
              </tr>
              <tr v-if="pedido.impuesto > 0">
                <td colspan="4" class="text-end"><strong>Impuesto ({{ pedido.impuesto }}%):</strong></td>
                <td class="text-end">+ S/ {{ formatCurrency(calcularImpuesto) }}</td>
                <td></td>
              </tr>
              <tr class="total-row">
                <td colspan="4" class="text-end"><strong>Total:</strong></td>
                <td class="text-end total-pedido">S/ {{ formatCurrency(calcularTotal) }}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- CALIFICACIÓN -->
      <div v-if="pedido.calificacion" class="calificacion-section">
        <h3><i class="bi bi-star"></i> Calificación</h3>
        <div class="calificacion-info">
          <span class="estrellas">
            <i v-for="i in 5" :key="i" class="bi bi-star-fill" :class="i <= pedido.calificacion ? 'star-active' : 'star-inactive'"></i>
          </span>
          <span class="calificacion-texto">{{ pedido.calificacion }}/5</span>
          <p v-if="pedido.comentario_cliente" class="comentario">{{ pedido.comentario_cliente }}</p>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-5">
      <i class="bi bi-exclamation-triangle fs-1 d-block text-warning"></i>
      <p class="text-muted mt-2">No se encontró el pedido</p>
      <router-link to="/pedidos" class="btn btn-primary">Volver a Pedidos</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PedidosAPI } from '@/services/api'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const pedido = ref(null)

const calcularSubtotal = computed(() => {
  if (!pedido.value || !pedido.value.detalles) return 0
  return pedido.value.detalles.reduce((sum, d) => sum + (d.cantidad * d.precio_unitario), 0)
})

const calcularDescuento = computed(() => {
  if (!pedido.value) return 0
  const desc = parseFloat(pedido.value.descuento) || 0
  return (calcularSubtotal.value * desc) / 100
})

const calcularImpuesto = computed(() => {
  if (!pedido.value) return 0
  const imp = parseFloat(pedido.value.impuesto) || 0
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
    'En preparación': 'badge-info',
    'Listo': 'badge-success',
    'Entregado': 'badge-success',
    'Cancelado': 'badge-danger'
  }
  return classes[estado] || 'badge-secondary'
}

function getEstadoIcon(estado) {
  const icons = {
    'Pendiente': 'bi-clock',
    'En preparación': 'bi-hourglass-split',
    'Listo': 'bi-check-circle',
    'Entregado': 'bi-check-all',
    'Cancelado': 'bi-x-circle'
  }
  return icons[estado] || 'bi-circle'
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
      minute: '2-digit',
      second: '2-digit'
    })
  } catch {
    return fecha
  }
}

async function loadPedido() {
  const id = route.params.id
  if (!id) {
    router.push('/pedidos')
    return
  }

  loading.value = true
  try {
    const res = await PedidosAPI.getById(id)
    if (res.data && res.data.success) {
      pedido.value = res.data.data
    } else if (res.data) {
      pedido.value = res.data
    } else {
      pedido.value = null
    }
  } catch (error) {
    console.error('Error cargando pedido:', error)
    Swal.fire('Error', 'No se pudo cargar el pedido', 'error')
    pedido.value = null
  } finally {
    loading.value = false
  }
}

async function cambiarEstado(estado) {
  if (!pedido.value) return

  const result = await Swal.fire({
    title: `Cambiar estado a "${estado}"`,
    text: `¿Estás seguro de cambiar el estado del pedido #${pedido.value.numero_pedido || pedido.value.id}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#2F6FED',
    confirmButtonText: 'Sí, cambiar',
    cancelButtonText: 'No'
  })

  if (result.isConfirmed) {
    try {
      await PedidosAPI.cambiarEstado({
        pedido_id: pedido.value.id,
        estado: estado,
        nota: `Estado cambiado a "${estado}" por usuario`
      })
      Swal.fire('Éxito', `Estado actualizado a "${estado}"`, 'success')
      await loadPedido()
    } catch (error) {
      const msg = error.response?.data?.message || 'No se pudo cambiar el estado'
      Swal.fire('Error', msg, 'error')
    }
  }
}

async function cancelarPedido() {
  if (!pedido.value) return

  const result = await Swal.fire({
    title: 'Cancelar Pedido',
    text: `¿Estás seguro de cancelar el pedido #${pedido.value.numero_pedido || pedido.value.id}?`,
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
      confirmButtonText: 'Cancelar Pedido',
      cancelButtonText: 'Volver'
    })

    if (motivo !== undefined) {
      try {
        await PedidosAPI.cancelar(pedido.value.id, motivo || 'Cancelado por usuario')
        Swal.fire('Pedido cancelado', 'El pedido ha sido cancelado exitosamente', 'success')
        await loadPedido()
      } catch (error) {
        const msg = error.response?.data?.message || 'No se pudo cancelar el pedido'
        Swal.fire('Error', msg, 'error')
      }
    }
  }
}

function imprimirPedido() {
  window.print()
}

// ===== LIFECYCLE =====
onMounted(() => {
  loadPedido()
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
.estado-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.badge { display: inline-flex; align-items: center; gap: 4px; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; }
.badge-warning { background: #fef3c7; color: #d97706; }
.badge-info { background: #dbeafe; color: #2563eb; }
.badge-success { background: #dcfce7; color: #16a34a; }
.badge-danger { background: #fecaca; color: #dc2626; }
.badge-secondary { background: #f3f4f6; color: #6b7280; }
.fecha-info, .prioridad-info { color: #6b7280; font-size: 14px; }
.fecha-info i, .prioridad-info i { margin-right: 4px; }
.detalle-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.detalle-card { background: #ffffff; padding: 16px 20px; border-radius: 12px; border: 1px solid #e5e7eb; }
.detalle-card h4 { font-size: 14px; font-weight: 600; color: #6b7280; margin: 0 0 8px 0; display: flex; align-items: center; gap: 6px; }
.detalle-card h4 i { color: #2F6FED; }
.detalle-card p { margin: 4px 0; font-size: 14px; color: #374151; }
.detalle-card p strong { color: #111827; }
.notas-section { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
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
.total-pedido { font-size: 20px; font-weight: 700; color: #E85D3A; }
.text-end { text-align: right; }
.text-center { text-align: center; }
.text-danger { color: #dc2626; }
.text-muted { color: #6b7280; }
.calificacion-section { background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; padding: 20px; margin-bottom: 24px; }
.calificacion-section h3 { font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px; }
.calificacion-section h3 i { color: #d97706; }
.estrellas { font-size: 20px; }
.star-active { color: #d97706; }
.star-inactive { color: #d1d5db; }
.calificacion-texto { font-weight: 600; color: #374151; margin-left: 8px; }
.comentario { margin-top: 8px; color: #4b5563; font-style: italic; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 18px; border: none; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s ease; text-decoration: none; font-family: inherit; white-space: nowrap; }
.btn-sm { padding: 4px 14px; font-size: 13px; }
.btn-primary { background: #2F6FED; color: #ffffff; }
.btn-primary:hover { background: #1a5adf; box-shadow: 0 4px 12px rgba(47,111,237,0.3); }
.btn-outline-secondary { background: transparent; color: #6b7280; border: 1.5px solid #d1d5db; }
.btn-outline-secondary:hover { background: #f9fafb; border-color: #9ca3af; }
.btn-warning { background: #d97706; color: #ffffff; }
.btn-warning:hover { background: #b45309; }
.btn-info { background: #0891b2; color: #ffffff; }
.btn-info:hover { background: #0e7490; }
.btn-success { background: #22c55e; color: #ffffff; }
.btn-success:hover { background: #16a34a; }
.btn-danger { background: #dc2626; color: #ffffff; }
.btn-danger:hover { background: #b91c1c; }
.spinner { width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top: 4px solid #2F6FED; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.spin { animation: spin 1s linear infinite; }
@media print { .header-actions, .estado-actions { display: none; } .page-container { padding: 0; } .page-header, .estado-bar, .detalle-card, .detalles-section, .notas-section { border: 1px solid #e5e7eb; } }
@media (max-width: 1024px) { .detalle-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .page-container { padding: 12px; } .page-header { flex-direction: column; align-items: stretch; padding: 16px; } .header-title h1 { font-size: 18px; } .header-actions { justify-content: stretch; } .header-actions .btn { flex: 1; justify-content: center; } .detalle-grid { grid-template-columns: 1fr; } .notas-section { grid-template-columns: 1fr; } .estado-bar { flex-direction: column; align-items: stretch; } .estado-actions { justify-content: stretch; } .estado-actions .btn { flex: 1; justify-content: center; } .table { font-size: 13px; } .table thead th, .table tbody td { padding: 6px 10px; } }
@media (max-width: 480px) { .header-title i { font-size: 24px; padding: 8px; } .header-title h1 { font-size: 16px; } .badge { font-size: 11px; padding: 4px 10px; } .btn { font-size: 13px; padding: 6px 12px; } }
</style>