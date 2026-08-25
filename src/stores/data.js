// stores/data.js
import { defineStore } from 'pinia'
import { 
  SedesAPI,        // ⭐ Cambiado: EmpresasAPI → SedesAPI
  UsuariosAPI, 
  ReportesAPI, 
  RolesAPI,
  PermisosAPI,
  // ArchivosAPI,   // ⭐ Comentado: No existe en tu API de restaurante
  DashboardAPI,
  LogsAPI,
  ConfigAPI,
  NotificacionesAPI,
  ProductosAPI,    // ⭐ Nuevo
  PedidosAPI,      // ⭐ Nuevo
  CreditosAPI,     // ⭐ Nuevo
  InventarioAPI,   // ⭐ Nuevo
  SedesAPI as EmpresasAPI  // ⭐ Alias para compatibilidad
} from '../services/api'

// ============================================
// UTILIDADES
// ============================================
export const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

export function periodoLabel(p) {
  if (!p) return ''
  const [y, m] = p.split('-')
  return `${MESES[parseInt(m, 10) - 1]} ${y}`
}

export function currentPeriodo() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function formatearFecha(fecha) {
  if (!fecha) return ''
  const d = new Date(fecha)
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

export function formatearMoneda(valor) {
  if (valor === null || valor === undefined) return '$0.00'
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(valor)
}

export function formatearNumero(valor) {
  if (valor === null || valor === undefined) return '0'
  return new Intl.NumberFormat('es-VE').format(valor)
}

export function getStatusLabel(status) {
  const map = {
    'borrador': 'Borrador',
    'cargado': 'Cargado',
    'validado': 'Validado',
    'rechazado': 'Rechazado',
    'pendiente': 'Pendiente',
    'activo': 'Activo',
    'inactivo': 'Inactivo',
    'pagado': 'Pagado',
    'pendiente_pago': 'Pendiente de Pago',
    'entregado': 'Entregado',
    'cancelado': 'Cancelado'
  }
  return map[status] || status
}

export function getStatusColor(status) {
  const map = {
    'borrador': '#FFA500',
    'cargado': '#1E90FF',
    'validado': '#28A745',
    'rechazado': '#DC3545',
    'pendiente': '#6C757D',
    'activo': '#28A745',
    'inactivo': '#DC3545',
    'pagado': '#28A745',
    'pendiente_pago': '#FFA500',
    'entregado': '#1E90FF',
    'cancelado': '#DC3545'
  }
  return map[status] || '#6C757D'
}

// ============================================
// STORE PRINCIPAL
// ============================================
export const useDataStore = defineStore('data', {
  state: () => ({
    // Datos principales
    sedes: [],
    empresas: [],      // ⭐ Alias para compatibilidad
    usuarios: [],
    reportes: [],
    roles: [],
    permisos: [],
    logs: [],
    configuraciones: [],
    notificaciones: [],
    dashboard: null,
    
    // ⭐ Nuevos datos para restaurante
    productos: [],
    pedidos: [],
    creditos: [],
    inventario: [],
    categorias: [],
    clientes: [],
    proveedores: [],
    mesas: [],
    compras: [],
    
    // Estados de carga
    loading: false,
    loadingSedes: false,
    loadingEmpresas: false,
    loadingUsuarios: false,
    loadingReportes: false,
    loadingRoles: false,
    loadingPermisos: false,
    loadingLogs: false,
    loadingConfig: false,
    loadingDashboard: false,
    loadingNotificaciones: false,
    
    // ⭐ Nuevos estados de carga
    loadingProductos: false,
    loadingPedidos: false,
    loadingCreditos: false,
    loadingInventario: false,
    loadingCategorias: false,
    loadingClientes: false,
    loadingProveedores: false,
    loadingMesas: false,
    loadingCompras: false,
    
    // Errores
    error: null,
    
    // Filtros
    filtrosReportes: {},
    filtrosLogs: {},
    filtrosNotificaciones: {},
    filtrosProductos: {},
    filtrosPedidos: {},
    filtrosCreditos: {},
    filtrosInventario: {},
    filtrosCategorias: {},
    filtrosClientes: {},
    filtrosProveedores: {},
    filtrosMesas: {},
    filtrosCompras: {}
  }),
  
  // ============================================
  // GETTERS
  // ============================================
  getters: {
    // Sedes / Empresas
    sedeById: (state) => (id) => state.sedes.find(e => e.id === id),
    empresaById: (state) => (id) => state.empresas.find(e => e.id === id) || state.sedes.find(e => e.id === id),
    sedesActivas: (state) => state.sedes.filter(e => e.activo !== false),
    empresasActivas: (state) => state.empresas.filter(e => e.activo !== false) || state.sedes.filter(e => e.activo !== false),
    sedesInactivas: (state) => state.sedes.filter(e => e.activo === false),
    
    // Usuarios
    usuarioById: (state) => (id) => state.usuarios.find(u => u.id === id),
    usuariosActivos: (state) => state.usuarios.filter(u => u.activo !== false),
    usuariosInactivos: (state) => state.usuarios.filter(u => u.activo === false),
    usuariosPorSede: (state) => (sedeId) => state.usuarios.filter(u => u.sede_id === sedeId),
    
    // Reportes
    reporteById: (state) => (id) => state.reportes.find(r => r.id === id),
    reportesPorSede: (state) => (sedeId) => state.reportes.filter(r => r.sede_id === sedeId),
    reportesPorPeriodo: (state) => (periodo) => state.reportes.filter(r => r.periodo === periodo),
    reportesPorStatus: (state) => (status) => state.reportes.filter(r => r.status === status),
    reportesValidados: (state) => state.reportes.filter(r => r.status === 'validado'),
    reportesPendientes: (state) => state.reportes.filter(r => r.status === 'cargado' || r.status === 'pendiente'),
    
    // Roles
    rolById: (state) => (id) => state.roles.find(r => r.id === id),
    rolByNombre: (state) => (nombre) => state.roles.find(r => r.nombre?.toLowerCase() === nombre?.toLowerCase()),
    
    // Permisos
    permisoById: (state) => (id) => state.permisos.find(p => p.id === id),
    permisosPorModulo: (state) => (modulo) => state.permisos.filter(p => p.modulo === modulo),
    
    // ⭐ Productos
    productoById: (state) => (id) => state.productos.find(p => p.id === id),
    productosPorCategoria: (state) => (categoriaId) => state.productos.filter(p => p.categoria_id === categoriaId),
    productosPorSede: (state) => (sedeId) => state.productos.filter(p => p.sede_id === sedeId),
    productosActivos: (state) => state.productos.filter(p => p.activo !== false),
    
    // ⭐ Pedidos
    pedidoById: (state) => (id) => state.pedidos.find(p => p.id === id),
    pedidosPorCliente: (state) => (clienteId) => state.pedidos.filter(p => p.cliente_id === clienteId),
    pedidosPorEstado: (state) => (estado) => state.pedidos.filter(p => p.estado === estado),
    pedidosPendientes: (state) => state.pedidos.filter(p => p.estado === 'pendiente' || p.estado === 'procesando'),
    pedidosEntregados: (state) => state.pedidos.filter(p => p.estado === 'entregado'),
    
    // ⭐ Créditos
    creditoById: (state) => (id) => state.creditos.find(c => c.id === id),
    creditosPorCliente: (state) => (clienteId) => state.creditos.filter(c => c.cliente_id === clienteId),
    creditosPendientes: (state) => state.creditos.filter(c => c.estado === 'pendiente'),
    creditosPagados: (state) => state.creditos.filter(c => c.estado === 'pagado'),
    
    // ⭐ Inventario
    inventarioPorProducto: (state) => (productoId) => state.inventario.filter(i => i.producto_id === productoId),
    inventarioPorSede: (state) => (sedeId) => state.inventario.filter(i => i.sede_id === sedeId),
    inventarioBajo: (state) => state.inventario.filter(i => i.stock <= i.stock_minimo),
    
    // ⭐ Categorías
    categoriaById: (state) => (id) => state.categorias.find(c => c.id === id),
    categoriasPorSede: (state) => (sedeId) => state.categorias.filter(c => c.sede_id === sedeId),
    categoriasPadre: (state) => state.categorias.filter(c => c.padre_id === null || c.padre_id === undefined),
    subcategorias: (state) => (padreId) => state.categorias.filter(c => c.padre_id === padreId),
    
    // ⭐ Clientes
    clienteById: (state) => (id) => state.clientes.find(c => c.id === id),
    clientesActivos: (state) => state.clientes.filter(c => c.activo !== false),
    
    // ⭐ Proveedores
    proveedorById: (state) => (id) => state.proveedores.find(p => p.id === id),
    proveedoresActivos: (state) => state.proveedores.filter(p => p.activo !== false),
    
    // ⭐ Mesas
    mesaById: (state) => (id) => state.mesas.find(m => m.id === id),
    mesasDisponibles: (state) => state.mesas.filter(m => m.estado === 'disponible'),
    mesasOcupadas: (state) => state.mesas.filter(m => m.estado === 'ocupada'),
    
    // ⭐ Compras
    compraById: (state) => (id) => state.compras.find(c => c.id === id),
    comprasPorProveedor: (state) => (proveedorId) => state.compras.filter(c => c.proveedor_id === proveedorId),
    comprasPorEstado: (state) => (estado) => state.compras.filter(c => c.estado === estado),
    
    // Dashboard
    totalSedes: (state) => state.sedes.length,
    totalEmpresas: (state) => state.empresas.length || state.sedes.length,
    totalUsuarios: (state) => state.usuarios.length,
    totalReportes: (state) => state.reportes.length,
    totalProductos: (state) => state.productos.length,
    totalPedidos: (state) => state.pedidos.length,
    totalCreditos: (state) => state.creditos.length,
    totalClientes: (state) => state.clientes.length,
    
    // Estadísticas
    estadisticasReportes: (state) => {
      const stats = { total: state.reportes.length }
      state.reportes.forEach(r => {
        stats[r.status] = (stats[r.status] || 0) + 1
      })
      return stats
    },
    estadisticasSedes: (state) => {
      const activas = state.sedes.filter(e => e.activo !== false).length
      const inactivas = state.sedes.filter(e => e.activo === false).length
      return { total: state.sedes.length, activas, inactivas }
    },
    estadisticasPedidos: (state) => {
      const stats = { total: state.pedidos.length }
      state.pedidos.forEach(p => {
        stats[p.estado] = (stats[p.estado] || 0) + 1
      })
      return stats
    },
    
    // Notificaciones
    notificacionesNoLeidas: (state) => state.notificaciones.filter(n => n.leido === false),
    totalNotificacionesNoLeidas: (state) => state.notificaciones.filter(n => n.leido === false).length
  },
  
  // ============================================
  // ACTIONS
  // ============================================
  actions: {
    // ========================================
    // SEDES / EMPRESAS
    // ========================================
    async fetchSedes() {
      this.loadingSedes = true
      this.error = null
      try {
        const { data } = await SedesAPI.list()
        this.sedes = data || []
        this.empresas = data || []  // ⭐ Alias para compatibilidad
        return data
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al cargar sedes'
        throw error
      } finally {
        this.loadingSedes = false
      }
    },

    // ⭐ Alias para compatibilidad con código antiguo
    async fetchEmpresas() {
      return this.fetchSedes()
    },

    async createSede(data) {
      this.error = null
      try {
        const response = await SedesAPI.create(data)
        await this.fetchSedes()
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al crear sede'
        throw error
      }
    },

    async updateSede(id, data) {
      this.error = null
      try {
        const response = await SedesAPI.update(id, data)
        await this.fetchSedes()
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al actualizar sede'
        throw error
      }
    },

    async deleteSede(id) {
      this.error = null
      try {
        const response = await SedesAPI.remove(id)
        await this.fetchSedes()
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al eliminar sede'
        throw error
      }
    },

    async toggleSedeStatus(id) {
      this.error = null
      try {
        const response = await SedesAPI.toggleStatus(id)
        await this.fetchSedes()
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al cambiar estado'
        throw error
      }
    },

    // ========================================
    // USUARIOS
    // ========================================
    async fetchUsuarios() {
      this.loadingUsuarios = true
      this.error = null
      try {
        const { data } = await UsuariosAPI.list()
        this.usuarios = data || []
        return data
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al cargar usuarios'
        throw error
      } finally {
        this.loadingUsuarios = false
      }
    },

    async createUsuario(data) {
      this.error = null
      try {
        const response = await UsuariosAPI.create(data)
        await this.fetchUsuarios()
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al crear usuario'
        throw error
      }
    },

    async updateUsuario(id, data) {
      this.error = null
      try {
        const response = await UsuariosAPI.update(id, data)
        await this.fetchUsuarios()
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al actualizar usuario'
        throw error
      }
    },

    async deleteUsuario(id) {
      this.error = null
      try {
        const response = await UsuariosAPI.remove(id)
        await this.fetchUsuarios()
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al eliminar usuario'
        throw error
      }
    },

    async toggleUsuarioStatus(id) {
      this.error = null
      try {
        const response = await UsuariosAPI.toggleStatus(id)
        await this.fetchUsuarios()
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al cambiar estado'
        throw error
      }
    },

    // ========================================
    // REPORTES
    // ========================================
    async fetchReportes(params = {}) {
      this.loadingReportes = true
      this.error = null
      this.filtrosReportes = params
      try {
        const { data } = await ReportesAPI.list(params)
        this.reportes = data || []
        return data
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al cargar reportes'
        throw error
      } finally {
        this.loadingReportes = false
      }
    },

    async createReporte(data) {
      this.error = null
      try {
        const response = await ReportesAPI.create(data)
        await this.fetchReportes(this.filtrosReportes)
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al crear reporte'
        throw error
      }
    },

    async updateReporte(id, data) {
      this.error = null
      try {
        const response = await ReportesAPI.update(id, data)
        await this.fetchReportes(this.filtrosReportes)
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al actualizar reporte'
        throw error
      }
    },

    async deleteReporte(id) {
      this.error = null
      try {
        const response = await ReportesAPI.remove(id)
        await this.fetchReportes(this.filtrosReportes)
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al eliminar reporte'
        throw error
      }
    },

    // ========================================
    // ROLES
    // ========================================
    async fetchRoles() {
      this.loadingRoles = true
      this.error = null
      try {
        const { data } = await RolesAPI.list()
        this.roles = data || []
        return data
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al cargar roles'
        throw error
      } finally {
        this.loadingRoles = false
      }
    },

    async createRol(data) {
      this.error = null
      try {
        const response = await RolesAPI.create(data)
        await this.fetchRoles()
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al crear rol'
        throw error
      }
    },

    async updateRol(id, data) {
      this.error = null
      try {
        const response = await RolesAPI.update(id, data)
        await this.fetchRoles()
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al actualizar rol'
        throw error
      }
    },

    async deleteRol(id) {
      this.error = null
      try {
        const response = await RolesAPI.remove(id)
        await this.fetchRoles()
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al eliminar rol'
        throw error
      }
    },

    async assignPermisos(rolId, permisosIds) {
      this.error = null
      try {
        const response = await RolesAPI.assignPermisos(rolId, permisosIds)
        await this.fetchRoles()
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al asignar permisos'
        throw error
      }
    },

    // ========================================
    // PERMISOS
    // ========================================
    async fetchPermisos() {
      this.loadingPermisos = true
      this.error = null
      try {
        const { data } = await PermisosAPI.list()
        this.permisos = data || []
        return data
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al cargar permisos'
        throw error
      } finally {
        this.loadingPermisos = false
      }
    },

    // ========================================
    // ⭐ PRODUCTOS
    // ========================================
    async fetchProductos(params = {}) {
      this.loadingProductos = true
      this.error = null
      this.filtrosProductos = params
      try {
        const { data } = await ProductosAPI.list(params)
        this.productos = data || []
        return data
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al cargar productos'
        throw error
      } finally {
        this.loadingProductos = false
      }
    },

    async createProducto(data) {
      this.error = null
      try {
        const response = await ProductosAPI.create(data)
        await this.fetchProductos(this.filtrosProductos)
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al crear producto'
        throw error
      }
    },

    async updateProducto(id, data) {
      this.error = null
      try {
        const response = await ProductosAPI.update(id, data)
        await this.fetchProductos(this.filtrosProductos)
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al actualizar producto'
        throw error
      }
    },

    async deleteProducto(id) {
      this.error = null
      try {
        const response = await ProductosAPI.remove(id)
        await this.fetchProductos(this.filtrosProductos)
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al eliminar producto'
        throw error
      }
    },

    // ========================================
    // ⭐ PEDIDOS
    // ========================================
    async fetchPedidos(params = {}) {
      this.loadingPedidos = true
      this.error = null
      this.filtrosPedidos = params
      try {
        const { data } = await PedidosAPI.list(params)
        this.pedidos = data || []
        return data
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al cargar pedidos'
        throw error
      } finally {
        this.loadingPedidos = false
      }
    },

    async createPedido(data) {
      this.error = null
      try {
        const response = await PedidosAPI.create(data)
        await this.fetchPedidos(this.filtrosPedidos)
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al crear pedido'
        throw error
      }
    },

    async updatePedido(id, data) {
      this.error = null
      try {
        const response = await PedidosAPI.update(id, data)
        await this.fetchPedidos(this.filtrosPedidos)
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al actualizar pedido'
        throw error
      }
    },

    async deletePedido(id) {
      this.error = null
      try {
        const response = await PedidosAPI.remove(id)
        await this.fetchPedidos(this.filtrosPedidos)
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al eliminar pedido'
        throw error
      }
    },

    async changePedidoStatus(id, status) {
      this.error = null
      try {
        const response = await PedidosAPI.changeStatus(id, status)
        await this.fetchPedidos(this.filtrosPedidos)
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al cambiar estado'
        throw error
      }
    },

    // ========================================
    // ⭐ CRÉDITOS
    // ========================================
    async fetchCreditos(params = {}) {
      this.loadingCreditos = true
      this.error = null
      this.filtrosCreditos = params
      try {
        const { data } = await CreditosAPI.list(params)
        this.creditos = data || []
        return data
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al cargar créditos'
        throw error
      } finally {
        this.loadingCreditos = false
      }
    },

    async createCredito(data) {
      this.error = null
      try {
        const response = await CreditosAPI.create(data)
        await this.fetchCreditos(this.filtrosCreditos)
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al crear crédito'
        throw error
      }
    },

    async updateCredito(id, data) {
      this.error = null
      try {
        const response = await CreditosAPI.update(id, data)
        await this.fetchCreditos(this.filtrosCreditos)
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al actualizar crédito'
        throw error
      }
    },

    async cobrarCredito(id, monto, metodo_pago) {
      this.error = null
      try {
        const response = await CreditosAPI.cobrar(id, monto, metodo_pago)
        await this.fetchCreditos(this.filtrosCreditos)
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al cobrar crédito'
        throw error
      }
    },

    // ========================================
    // ⭐ INVENTARIO
    // ========================================
    async fetchInventario(params = {}) {
      this.loadingInventario = true
      this.error = null
      this.filtrosInventario = params
      try {
        const { data } = await InventarioAPI.list(params)
        this.inventario = data || []
        return data
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al cargar inventario'
        throw error
      } finally {
        this.loadingInventario = false
      }
    },

    async ajustarInventario(id, cantidad, motivo) {
      this.error = null
      try {
        const response = await InventarioAPI.ajustar(id, cantidad, motivo)
        await this.fetchInventario(this.filtrosInventario)
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al ajustar inventario'
        throw error
      }
    },

    // ========================================
    // LOGS
    // ========================================
    async fetchLogs(params = {}) {
      this.loadingLogs = true
      this.error = null
      this.filtrosLogs = params
      try {
        const { data } = await LogsAPI.list(params)
        this.logs = data || []
        return data
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al cargar logs'
        throw error
      } finally {
        this.loadingLogs = false
      }
    },

    // ========================================
    // NOTIFICACIONES
    // ========================================
    async fetchNotificaciones(params = {}) {
      this.loadingNotificaciones = true
      this.error = null
      this.filtrosNotificaciones = params
      try {
        const { data } = await NotificacionesAPI.list(params)
        this.notificaciones = data || []
        return data
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al cargar notificaciones'
        throw error
      } finally {
        this.loadingNotificaciones = false
      }
    },

    async markNotificacionAsRead(id) {
      try {
        const response = await NotificacionesAPI.markAsRead(id)
        await this.fetchNotificaciones(this.filtrosNotificaciones)
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al marcar notificación como leída'
        throw error
      }
    },

    // ========================================
    // DASHBOARD
    // ========================================
    async fetchDashboard() {
      this.loadingDashboard = true
      this.error = null
      try {
        const { data } = await DashboardAPI.getGeneral()
        this.dashboard = data
        return data
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al cargar dashboard'
        throw error
      } finally {
        this.loadingDashboard = false
      }
    },

    // ========================================
    // CONFIGURACIÓN
    // ========================================
    async fetchConfiguraciones() {
      this.loadingConfig = true
      this.error = null
      try {
        const { data } = await ConfigAPI.list()
        this.configuraciones = data || []
        return data
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al cargar configuraciones'
        throw error
      } finally {
        this.loadingConfig = false
      }
    },

    async updateConfiguracion(id, data) {
      this.error = null
      try {
        const response = await ConfigAPI.update(id, data)
        await this.fetchConfiguraciones()
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al actualizar configuración'
        throw error
      }
    },

    // ========================================
    // UTILIDADES
    // ========================================
    clearStore() {
      this.sedes = []
      this.empresas = []
      this.usuarios = []
      this.reportes = []
      this.roles = []
      this.permisos = []
      this.logs = []
      this.configuraciones = []
      this.notificaciones = []
      this.dashboard = null
      this.productos = []
      this.pedidos = []
      this.creditos = []
      this.inventario = []
      this.categorias = []
      this.clientes = []
      this.proveedores = []
      this.mesas = []
      this.compras = []
      this.error = null
    },

    // Cargar todos los datos iniciales
    async loadInitialData() {
      await Promise.all([
        this.fetchSedes(),
        this.fetchUsuarios(),
        this.fetchRoles(),
        this.fetchPermisos(),
        this.fetchDashboard()
      ])
    }
  }
})