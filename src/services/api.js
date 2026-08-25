// services/api.js
import http from './http'

// ============================================
// AUTH - Autenticación
// ============================================
export const AuthAPI = {
  login(email, password) {
    return http.post('/Usuario/login', { email, password })
  },
  
  changePassword(id, currentPassword, newPassword) {
    return http.post(`/Usuario/change-password/${id}`, {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: newPassword
    })
  },
  
  getMe() {
    return http.get('/Usuario/me')
  },
  
  logout(token) {
    return http.post('/Sesion/logout', { token })
  }
}

// ============================================
// USUARIOS
// ============================================
export const UsuariosAPI = {
  list() {
    return http.get('/Usuario')
  },
  
  getById(id) {
    return http.get(`/Usuario/${id}`)
  },
  
  create(data) {
    return http.post('/Usuario', data)
  },
  
  update(id, data) {
    return http.put(`/Usuario/${id}`, data)
  },
  
  remove(id) {
    return http.delete(`/Usuario/${id}`)
  },
  
  toggleStatus(id) {
    return http.patch(`/Usuario/${id}/toggle-status`)
  },
  
  verify(id) {
    return http.patch(`/Usuario/${id}/verificar`)
  },
  
  resetIntentos(id) {
    return http.patch(`/Usuario/${id}/reset-intentos`)
  }
}

// ============================================
// ROLES
// ============================================
export const RolesAPI = {
  list() {
    return http.get('/Role')
  },
  
  getById(id) {
    return http.get(`/Role/${id}`)
  },
  
  create(data) {
    return http.post('/Role', data)
  },
  
  update(id, data) {
    return http.put(`/Role/${id}`, data)
  },
  
  remove(id) {
    return http.delete(`/Role/${id}`)
  },
  
  toggleStatus(id) {
    return http.patch(`/Role/${id}/toggle-status`)
  },
  
  assignPermisos(id, permisosIds) {
    return http.post(`/Role/${id}/permisos`, { permisos_ids: permisosIds })
  },
  
  getPermisos(id) {
    return http.get(`/Role/${id}/permisos`)
  }
}

// ============================================
// PERMISOS
// ============================================
export const PermisosAPI = {
  list() {
    return http.get('/Permiso')
  },
  
  getById(id) {
    return http.get(`/Permiso/${id}`)
  },
  
  create(data) {
    return http.post('/Permiso', data)
  },
  
  update(id, data) {
    return http.put(`/Permiso/${id}`, data)
  },
  
  remove(id) {
    return http.delete(`/Permiso/${id}`)
  },
  
  getByModulo(modulo) {
    return http.get(`/Permiso/modulo/${modulo}`)
  },
  
  getAgrupados() {
    return http.get('/Permiso/agrupados')
  }
}

// ============================================
// ROLES PERMISOS (Relación)
// ============================================
export const RolesPermisosAPI = {
  list() {
    return http.get('/RolesPermiso')
  },
  
  assign(rolId, permisoId) {
    return http.post('/RolesPermiso', { rol_id: rolId, permiso_id: permisoId })
  },
  
  remove(rolId, permisoId) {
    return http.delete(`/RolesPermiso/${rolId}/${permisoId}`)
  },
  
  getByRol(rolId) {
    return http.get(`/RolesPermiso/rol/${rolId}`)
  }
}

// ============================================
// SEDES (Empresas)
// ============================================
export const SedesAPI = {
  list() {
    return http.get('/Sede')
  },
  
  getById(id) {
    return http.get(`/Sede/${id}`)
  },
  
  create(data) {
    return http.post('/Sede', data)
  },
  
  update(id, data) {
    return http.put(`/Sede/${id}`, data)
  },
  
  remove(id) {
    return http.delete(`/Sede/${id}`)
  },
  
  toggleStatus(id) {
    return http.patch(`/Sede/${id}/toggle-status`)
  },
  
  getByUsuario(usuarioId) {
    return http.get(`/Sede/usuario/${usuarioId}`)
  }
}

// ============================================
// CATEGORÍAS
// ============================================
export const CategoriasAPI = {
  list(params = {}) {
    return http.get('/Categoria', { params })
  },
  
  getById(id) {
    return http.get(`/Categoria/${id}`)
  },
  
  create(data) {
    return http.post('/Categoria', data)
  },
  
  update(id, data) {
    return http.put(`/Categoria/${id}`, data)
  },
  
  remove(id) {
    return http.delete(`/Categoria/${id}`)
  },
  
  toggleStatus(id) {
    return http.patch(`/Categoria/${id}/estado`)
  },
  
  getBySede(sedeId) {
    return http.get(`/Categoria/sede/${sedeId}`)
  },
  
  getArbol(sedeId) {
    return http.get(`/Categoria/sede/${sedeId}/arbol`)
  }
}

// ============================================
// PRODUCTOS
// ============================================
export const ProductosAPI = {
  list(params = {}) {
    return http.get('/Producto', { params })
  },
  
  getById(id) {
    return http.get(`/Producto/${id}`)
  },
  
  create(data) {
    return http.post('/Producto', data)
  },
  
  update(id, data) {
    return http.put(`/Producto/${id}`, data)
  },
  
  remove(id) {
    return http.delete(`/Producto/${id}`)
  },
  
  toggleStatus(id) {
    return http.patch(`/Producto/${id}/toggle-status`)
  },
  
  getBySede(sedeId) {
    return http.get(`/Producto/sede/${sedeId}`)
  },
  
  getByCategoria(categoriaId) {
    return http.get(`/Producto/categoria/${categoriaId}`)
  }
}

// ============================================
// INGREDIENTES
// ============================================
export const IngredientesAPI = {
  list(params = {}) {
    return http.get('/Ingrediente', { params })
  },
  
  getById(id) {
    return http.get(`/Ingrediente/${id}`)
  },
  
  create(data) {
    return http.post('/Ingrediente', data)
  },
  
  update(id, data) {
    return http.put(`/Ingrediente/${id}`, data)
  },
  
  remove(id) {
    return http.delete(`/Ingrediente/${id}`)
  },
  
  toggleStatus(id) {
    return http.patch(`/Ingrediente/${id}/estado`)
  },
  
  getBySede(sedeId) {
    return http.get(`/Ingrediente/sede/${sedeId}`)
  }
}

// ============================================
// KARDEX (Inventario)
// ============================================
export const KardexAPI = {
  list(params = {}) {
    return http.get('/Kardex', { params })
  },
  
  getById(id) {
    return http.get(`/Kardex/${id}`)
  },
  
  getByProducto(productoId) {
    return http.get(`/Kardex/producto/${productoId}`)
  },
  
  getByIngrediente(ingredienteId) {
    return http.get(`/Kardex/ingrediente/${ingredienteId}`)
  },
  
  entrada(data) {
    return http.post('/Kardex/entrada', data)
  },
  
  salida(data) {
    return http.post('/Kardex/salida', data)
  },
  
  ajuste(data) {
    return http.post('/Kardex/ajuste', data)
  }
}

// ============================================
// ⭐ PROVEEDORES (COMPLETO)
// ============================================
export const ProveedoresAPI = {
  // Listar todos los proveedores
  list() {
    return http.get('/Proveedor')
  },
  
  // Listar con paginación
  listPaginated(params) {
    return http.get('/Proveedor/paginated', { params })
  },
  
  // Obtener por ID
  getById(id) {
    return http.get(`/Proveedor/${id}`)
  },
  
  // Crear proveedor
  create(data) {
    return http.post('/Proveedor', data)
  },
  
  // Actualizar proveedor
  update(id, data) {
    return http.put(`/Proveedor/${id}`, data)
  },
  
  // Eliminar proveedor
  remove(id) {
    return http.delete(`/Proveedor/${id}`)
  },
  
  // Obtener proveedores destacados
  getDestacados() {
    return http.get('/Proveedor/destacados')
  },
  
  // Obtener proveedores por calificación
  getByCalificacion(calificacion) {
    return http.get(`/Proveedor/calificacion/${calificacion}`)
  },
  
  // Obtener resumen de un proveedor
  getResumen(id) {
    return http.get(`/Proveedor/${id}/resumen`)
  },
  
  // Estadísticas generales
  getEstadisticas() {
    return http.get('/Proveedor/estadisticas')
  },
  
  // Proveedores por ciudad
  getPorCiudad() {
    return http.get('/Proveedor/por-ciudad')
  },
  
  // Proveedores por estado
  getPorEstado() {
    return http.get('/Proveedor/por-estado')
  },
  
  // Proveedores por calificación
  getPorCalificacion() {
    return http.get('/Proveedor/por-calificacion')
  },
  
  // Tipos de persona disponibles
  getTiposPersona() {
    return http.get('/Proveedor/tipos-persona')
  },
  
  // Términos de pago disponibles
  getTerminosPago() {
    return http.get('/Proveedor/terminos-pago')
  },
  
  // Calificar proveedor
  calificar(data) {
    return http.post('/Proveedor/calificar', data)
  },
  
  // Cambiar estado
  toggleStatus(id) {
    return http.patch(`/Proveedor/${id}/estado`)
  },
  
  // Limpiar proveedores inactivos
  limpiarInactivos() {
    return http.delete('/Proveedor/limpiar-inactivos')
  },
  
  // Verificar si existe RUC
  checkRuc(ruc) {
    return http.get(`/Proveedor/check-ruc?ruc=${ruc}`)
  },
  
  // Verificar si existe nombre
  checkNombre(nombre) {
    return http.get(`/Proveedor/check-nombre?nombre=${nombre}`)
  },
  
  // Verificar si tiene compras
  hasCompras(id) {
    return http.get(`/Proveedor/${id}/has-compras`)
  }
}

// ============================================
// COMPRAS
// ============================================
export const ComprasAPI = {
  list(params = {}) {
    return http.get('/Compra', { params })
  },
  
  getById(id) {
    return http.get(`/Compra/${id}`)
  },
  
  create(data) {
    return http.post('/Compra', data)
  },
  
  update(id, data) {
    return http.put(`/Compra/${id}`, data)
  },
  
  remove(id) {
    return http.delete(`/Compra/${id}`)
  },
  
  cambiarEstado(id, estado) {
    return http.post(`/Compra/cambiar-estado`, { id, estado })
  },
  
  getByProveedor(proveedorId) {
    return http.get(`/Compra/proveedor/${proveedorId}`)
  },
  
  getBySede(sedeId) {
    return http.get(`/Compra/sede/${sedeId}`)
  }
}

// ============================================
// MESAS
// ============================================
export const MesasAPI = {
  list(params = {}) {
    return http.get('/Mesa', { params })
  },
  
  getById(id) {
    return http.get(`/Mesa/${id}`)
  },
  
  create(data) {
    return http.post('/Mesa', data)
  },
  
  update(id, data) {
    return http.put(`/Mesa/${id}`, data)
  },
  
  remove(id) {
    return http.delete(`/Mesa/${id}`)
  },
  
  cambiarEstado(id, estado) {
    return http.post(`/Mesa/cambiar-estado`, { id, estado })
  },
  
  getBySede(sedeId) {
    return http.get(`/Mesa/sede/${sedeId}`)
  },
  
  getDisponibles() {
    return http.get('/Mesa/disponibles')
  }
}

// ============================================
// CLIENTES
// ============================================
export const ClientesAPI = {
  list(params = {}) {
    return http.get('/Cliente', { params })
  },
  
  getById(id) {
    return http.get(`/Cliente/${id}`)
  },
  
  create(data) {
    return http.post('/Cliente', data)
  },
  
  update(id, data) {
    return http.put(`/Cliente/${id}`, data)
  },
  
  remove(id) {
    return http.delete(`/Cliente/${id}`)
  },
  
  toggleStatus(id) {
    return http.patch(`/Cliente/${id}/estado`)
  },
  
  getByTipo(tipo) {
    return http.get(`/Cliente/tipo/${tipo}`)
  },
  
  getConCredito() {
    return http.get('/Cliente/con-credito')
  }
}

// ============================================
// PEDIDOS
// ============================================
export const PedidosAPI = {
  list(params = {}) {
    return http.get('/Pedido', { params })
  },
  
  getById(id) {
    return http.get(`/Pedido/${id}`)
  },
  
  create(data) {
    return http.post('/Pedido', data)
  },
  
  update(id, data) {
    return http.put(`/Pedido/${id}`, data)
  },
  
  remove(id) {
    return http.delete(`/Pedido/${id}`)
  },
  
  changeStatus(id, status) {
    return http.patch(`/Pedido/${id}/status`, { status })
  },
  
  cancel(id, motivo) {
    return http.post(`/Pedido/${id}/cancelar`, { motivo })
  },
  
  getBySede(sedeId) {
    return http.get(`/Pedido/sede/${sedeId}`)
  },
  
  getByCliente(clienteId) {
    return http.get(`/Pedido/cliente/${clienteId}`)
  },
  
  getByMesa(mesaId) {
    return http.get(`/Pedido/mesa/${mesaId}`)
  },
  
  getByEstado(estado) {
    return http.get(`/Pedido/estado/${estado}`)
  }
}

// ============================================
// CRÉDITOS
// ============================================
export const CreditosAPI = {
  list(params = {}) {
    return http.get('/Credito', { params })
  },
  
  getById(id) {
    return http.get(`/Credito/${id}`)
  },
  
  create(data) {
    return http.post('/Credito', data)
  },
  
  update(id, data) {
    return http.put(`/Credito/${id}`, data)
  },
  
  remove(id) {
    return http.delete(`/Credito/${id}`)
  },
  
  cobrar(id, monto, metodo_pago) {
    return http.post(`/Credito/${id}/cobrar`, { monto, metodo_pago })
  },
  
  getByCliente(clienteId) {
    return http.get(`/Credito/cliente/${clienteId}`)
  },
  
  getBySede(sedeId) {
    return http.get(`/Credito/sede/${sedeId}`)
  },
  
  getVencidos() {
    return http.get('/Credito/vencidos')
  }
}

// ============================================
// AUDITORÍA DE CAJA
// ============================================
export const AuditoriaCajaAPI = {
  list(params = {}) {
    return http.get('/AuditoriaCaja', { params })
  },
  
  getById(id) {
    return http.get(`/AuditoriaCaja/${id}`)
  },
  
  abrir(data) {
    return http.post('/AuditoriaCaja/abrir', data)
  },
  
  cerrar(data) {
    return http.post('/AuditoriaCaja/cerrar', data)
  },
  
  getBySede(sedeId) {
    return http.get(`/AuditoriaCaja/sede/${sedeId}`)
  },
  
  getActual(sedeId) {
    return http.get(`/AuditoriaCaja/sede/${sedeId}/actual`)
  },
  
  getEstadisticas(sedeId) {
    return http.get(`/AuditoriaCaja/sede/${sedeId}/estadisticas`)
  }
}

// ============================================
// PROMOCIONES
// ============================================
export const PromocionesAPI = {
  list(params = {}) {
    return http.get('/Promocion', { params })
  },
  
  getById(id) {
    return http.get(`/Promocion/${id}`)
  },
  
  create(data) {
    return http.post('/Promocion', data)
  },
  
  update(id, data) {
    return http.put(`/Promocion/${id}`, data)
  },
  
  remove(id) {
    return http.delete(`/Promocion/${id}`)
  },
  
  toggleStatus(id) {
    return http.patch(`/Promocion/${id}/estado`)
  }
}

// ============================================
// REPORTES
// ============================================
export const ReportesAPI = {
  ventas(params = {}) {
    return http.get('/Reporte/ventas', { params })
  },
  
  inventario(params = {}) {
    return http.get('/Reporte/inventario', { params })
  },
  
  creditos(params = {}) {
    return http.get('/Reporte/creditos', { params })
  },
  
  pedidos(params = {}) {
    return http.get('/Reporte/pedidos', { params })
  },
  
  general(params = {}) {
    return http.get('/Reporte/general', { params })
  },
  
  exportar(tipo, params = {}) {
    return http.get(`/Reporte/exportar/${tipo}`, { 
      params,
      responseType: 'blob'
    })
  }
}

// ============================================
// REPORTES GUARDADOS
// ============================================
export const ReportesGuardadosAPI = {
  list(params = {}) {
    return http.get('/ReporteGuardado', { params })
  },
  
  getById(id) {
    return http.get(`/ReporteGuardado/${id}`)
  },
  
  create(data) {
    return http.post('/ReporteGuardado', data)
  },
  
  update(id, data) {
    return http.put(`/ReporteGuardado/${id}`, data)
  },
  
  remove(id) {
    return http.delete(`/ReporteGuardado/${id}`)
  }
}

// ============================================
// CONFIGURACIÓN
// ============================================
export const ConfigAPI = {
  list() {
    return http.get('/Configuracion')
  },
  
  getByClave(clave) {
    return http.get(`/Configuracion/${clave}`)
  },
  
  update(id, data) {
    return http.put(`/Configuracion/${id}`, data)
  },
  
  updateByClave(clave, valor) {
    return http.put(`/Configuracion/clave/${clave}`, { valor })
  },
  
  inicializar() {
    return http.post('/Configuracion/inicializar')
  }
}

// ============================================
// CONFIGURACIÓN DE SEDE
// ============================================
export const ConfiguracionSedeAPI = {
  getBySede(sedeId) {
    return http.get(`/ConfiguracionSede/sede/${sedeId}`)
  },
  
  getByClave(sedeId, clave) {
    return http.get(`/ConfiguracionSede/sede/${sedeId}/clave/${clave}`)
  },
  
  update(sedeId, data) {
    return http.put(`/ConfiguracionSede/sede/${sedeId}`, data)
  },
  
  updateValor(sedeId, clave, valor) {
    return http.patch(`/ConfiguracionSede/valor`, { sedeId, clave, valor })
  }
}

// ============================================
// CONFIGURACIÓN DE EMAIL
// ============================================
export const ConfiguracionEmailAPI = {
  list() {
    return http.get('/ConfiguracionEmail')
  },
  
  getById(id) {
    return http.get(`/ConfiguracionEmail/${id}`)
  },
  
  getBySede(sedeId) {
    return http.get(`/ConfiguracionEmail/sede/${sedeId}`)
  },
  
  create(data) {
    return http.post('/ConfiguracionEmail', data)
  },
  
  update(id, data) {
    return http.put(`/ConfiguracionEmail/${id}`, data)
  },
  
  remove(id) {
    return http.delete(`/ConfiguracionEmail/${id}`)
  },
  
  test(id) {
    return http.post(`/ConfiguracionEmail/test/${id}`)
  }
}

// ============================================
// CONFIGURACIÓN DE WHATSAPP
// ============================================
export const ConfiguracionWhatsappAPI = {
  list() {
    return http.get('/ConfiguracionWhatsapp')
  },
  
  getById(id) {
    return http.get(`/ConfiguracionWhatsapp/${id}`)
  },
  
  getBySede(sedeId) {
    return http.get(`/ConfiguracionWhatsapp/sede/${sedeId}`)
  },
  
  create(data) {
    return http.post('/ConfiguracionWhatsapp', data)
  },
  
  update(id, data) {
    return http.put(`/ConfiguracionWhatsapp/${id}`, data)
  },
  
  remove(id) {
    return http.delete(`/ConfiguracionWhatsapp/${id}`)
  },
  
  test(id) {
    return http.post(`/ConfiguracionWhatsapp/test/${id}`)
  }
}

// ============================================
// ACTIVIDAD LOGS
// ============================================
export const LogsAPI = {
  list(params = {}) {
    return http.get('/ActividadLog', { params })
  },
  
  getById(id) {
    return http.get(`/ActividadLog/${id}`)
  },
  
  getByUsuario(usuarioId) {
    return http.get(`/ActividadLog/usuario/${usuarioId}`)
  },
  
  registrar(data) {
    return http.post('/ActividadLog', data)
  },
  
  deleteOld(dias) {
    return http.delete(`/ActividadLog/old/${dias}`)
  },
  
  getResumen() {
    return http.get('/ActividadLog/resumen')
  }
}

// ============================================
// DASHBOARD
// ============================================
export const DashboardAPI = {
  getGeneral() {
    return http.get('/Dashboard/general')
  },
  
  getBySede(sedeId) {
    return http.get(`/Dashboard/sede/${sedeId}`)
  },
  
  getByPeriodo(periodo) {
    return http.get(`/Dashboard/periodo/${periodo}`)
  },
  
  getVentas(params = {}) {
    return http.get('/Dashboard/ventas', { params })
  }
}

// ============================================
// NOTIFICACIONES
// ============================================
export const NotificacionesAPI = {
  list(params = {}) {
    return http.get('/Notificacion', { params })
  },
  
  getById(id) {
    return http.get(`/Notificacion/${id}`)
  },
  
  getByUsuario(usuarioId) {
    return http.get(`/Notificacion/usuario/${usuarioId}`)
  },
  
  create(data) {
    return http.post('/Notificacion', data)
  },
  
  markAsRead(id) {
    return http.patch(`/Notificacion/${id}/leida`)
  },
  
  markAllAsRead(usuarioId) {
    return http.patch(`/Notificacion/usuario/${usuarioId}/todas-leidas`)
  },
  
  remove(id) {
    return http.delete(`/Notificacion/${id}`)
  },
  
  getContador(usuarioId) {
    return http.get(`/Notificacion/usuario/${usuarioId}/contador`)
  }
}

// ============================================
// SESIONES ACTIVAS
// ============================================
export const SesionesAPI = {
  list() {
    return http.get('/Sesion')
  },
  
  listPaginated(params) {
    return http.get('/Sesion/paginated', { params })
  },
  
  getById(id) {
    return http.get(`/Sesion/${id}`)
  },
  
  getByToken(token) {
    return http.get(`/Sesion/token/${token}`)
  },
  
  create(data) {
    return http.post('/Sesion', data)
  },
  
  update(id, data) {
    return http.put(`/Sesion/${id}`, data)
  },
  
  remove(id) {
    return http.delete(`/Sesion/${id}`)
  },
  
  getByUser(usuarioId) {
    return http.get(`/Sesion/user/${usuarioId}`)
  },
  
  getUserDetails(usuarioId) {
    return http.get(`/Sesion/user/${usuarioId}/details`)
  },
  
  hasActive(usuarioId) {
    return http.get(`/Sesion/user/${usuarioId}/has-active`)
  },
  
  activeCount(usuarioId) {
    return http.get(`/Sesion/user/${usuarioId}/active-count`)
  },
  
  validar(data) {
    return http.post('/Sesion/validate', data)
  },
  
  renovar(data) {
    return http.post('/Sesion/renew', data)
  },
  
  logout(data) {
    return http.post('/Sesion/logout', data)
  },
  
  logoutAll(usuarioId) {
    return http.post(`/Sesion/logout-all/${usuarioId}`)
  },
  
  updateActivity(data) {
    return http.post('/Sesion/update-activity', data)
  },
  
  toggleActive(id) {
    return http.patch(`/Sesion/${id}/toggle-active`)
  },
  
  cleanExpired() {
    return http.delete('/Sesion/clean-expired')
  },
  
  cleanOld(dias) {
    return http.delete(`/Sesion/clean-old?dias=${dias}`)
  },
  
  estadisticas() {
    return http.get('/Sesion/estadisticas')
  },
  
  checkExists(token) {
    return http.get(`/Sesion/check-exists?token=${token}`)
  }
}

// ============================================
// TOKENS DE RECUPERACIÓN
// ============================================
export const TokensAPI = {
  list() {
    return http.get('/TokenRecuperacion')
  },
  
  listPaginated(params) {
    return http.get('/TokenRecuperacion/paginated', { params })
  },
  
  getById(id) {
    return http.get(`/TokenRecuperacion/${id}`)
  },
  
  getByToken(token) {
    return http.get(`/TokenRecuperacion/token/${token}`)
  },
  
  create(data) {
    return http.post('/TokenRecuperacion', data)
  },
  
  update(id, data) {
    return http.put(`/TokenRecuperacion/${id}`, data)
  },
  
  remove(id) {
    return http.delete(`/TokenRecuperacion/${id}`)
  },
  
  getByUser(usuarioId) {
    return http.get(`/TokenRecuperacion/user/${usuarioId}`)
  },
  
  getByType(tipo) {
    return http.get(`/TokenRecuperacion/type/${tipo}`)
  },
  
  getValidByUser(usuarioId, tipo) {
    return http.get(`/TokenRecuperacion/user/${usuarioId}/valid/${tipo}`)
  },
  
  countByUser(usuarioId) {
    return http.get(`/TokenRecuperacion/user/${usuarioId}/count`)
  },
  
  generate(data) {
    return http.post('/TokenRecuperacion/generate', data)
  },
  
  validate(data) {
    return http.post('/TokenRecuperacion/validate', data)
  },
  
  use(data) {
    return http.post('/TokenRecuperacion/use', data)
  },
  
  toggleUsed(id) {
    return http.patch(`/TokenRecuperacion/${id}/toggle-used`)
  },
  
  extend(token, minutos) {
    return http.patch(`/TokenRecuperacion/extend/${token}?minutos=${minutos}`)
  },
  
  revoke(token) {
    return http.post(`/TokenRecuperacion/revoke/${token}`)
  },
  
  revokeUser(usuarioId) {
    return http.post(`/TokenRecuperacion/revoke-user/${usuarioId}`)
  },
  
  clean(data) {
    return http.post('/TokenRecuperacion/clean', data)
  },
  
  cleanExpired() {
    return http.delete('/TokenRecuperacion/clean-expired')
  },
  
  cleanUsedOld(dias) {
    return http.delete(`/TokenRecuperacion/clean-used-old?dias=${dias}`)
  },
  
  estadisticas() {
    return http.get('/TokenRecuperacion/estadisticas')
  },
  
  checkExists(token) {
    return http.get(`/TokenRecuperacion/check-exists?token=${token}`)
  },
  
  checkValid(token, tipo) {
    return http.get(`/TokenRecuperacion/check-valid?token=${token}&tipo=${tipo}`)
  }
}

// ============================================
// CUENTAS BANCARIAS
// ============================================
export const CuentasBancariasAPI = {
  list() {
    return http.get('/CuentaBancaria')
  },
  
  listPaginated(params) {
    return http.get('/CuentaBancaria/paginated', { params })
  },
  
  getById(id) {
    return http.get(`/CuentaBancaria/${id}`)
  },
  
  create(data) {
    return http.post('/CuentaBancaria', data)
  },
  
  update(id, data) {
    return http.put(`/CuentaBancaria/${id}`, data)
  },
  
  remove(id) {
    return http.delete(`/CuentaBancaria/${id}`)
  },
  
  getBySede(sedeId) {
    return http.get(`/CuentaBancaria/sede/${sedeId}`)
  },
  
  getActivasBySede(sedeId) {
    return http.get(`/CuentaBancaria/sede/${sedeId}/activas`)
  },
  
  getPrincipalBySede(sedeId) {
    return http.get(`/CuentaBancaria/sede/${sedeId}/principal`)
  },
  
  getResumenBySede(sedeId) {
    return http.get(`/CuentaBancaria/sede/${sedeId}/resumen`)
  },
  
  hasCuentas(sedeId) {
    return http.get(`/CuentaBancaria/sede/${sedeId}/has-cuentas`)
  },
  
  countBySede(sedeId) {
    return http.get(`/CuentaBancaria/sede/${sedeId}/count`)
  },
  
  hasPrincipal(sedeId) {
    return http.get(`/CuentaBancaria/sede/${sedeId}/has-principal`)
  },
  
  setPrincipal(data) {
    return http.post('/CuentaBancaria/principal', data)
  },
  
  copy(data) {
    return http.post('/CuentaBancaria/copiar', data)
  },
  
  toggleStatus(id) {
    return http.patch(`/CuentaBancaria/${id}/estado`)
  },
  
  estadisticas() {
    return http.get('/CuentaBancaria/estadisticas')
  },
  
  getByBanco() {
    return http.get('/CuentaBancaria/por-banco')
  },
  
  getByTipo() {
    return http.get('/CuentaBancaria/por-tipo')
  },
  
  getBySedeResumen() {
    return http.get('/CuentaBancaria/por-sede')
  },
  
  getBancos() {
    return http.get('/CuentaBancaria/bancos')
  },
  
  getTipos() {
    return http.get('/CuentaBancaria/tipos')
  },
  
  desactivarBySede(sedeId) {
    return http.delete(`/CuentaBancaria/desactivar-sede/${sedeId}`)
  },
  
  limpiarInactivas() {
    return http.delete('/CuentaBancaria/limpiar-inactivas')
  },
  
  checkExists(params) {
    return http.get('/CuentaBancaria/check-exists', { params })
  }
}

// ============================================
// ALIAS PARA COMPATIBILIDAD
// ============================================
export const EmpresasAPI = SedesAPI
export const EmpresaAPI = SedesAPI
export const ArchivosAPI = {
  upload() {
    console.warn('⚠️ ArchivosAPI.upload - Función no implementada')
    return Promise.reject({ message: 'Función no implementada' })
  },
  getByReporte() {
    console.warn('⚠️ ArchivosAPI.getByReporte - Función no implementada')
    return Promise.resolve({ data: [] })
  },
  getById() {
    console.warn('⚠️ ArchivosAPI.getById - Función no implementada')
    return Promise.resolve({ data: null })
  },
  downloadUrl() {
    console.warn('⚠️ ArchivosAPI.downloadUrl - Función no implementada')
    return '#'
  },
  remove() {
    console.warn('⚠️ ArchivosAPI.remove - Función no implementada')
    return Promise.reject({ message: 'Función no implementada' })
  }
}