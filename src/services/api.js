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
// IMÁGENES DE PRODUCTOS
// ============================================
export const ImagenProductoAPI = {
  // Listar todas las imágenes
  list() {
    return http.get('/ImagenProducto')
  },
  
  // Listar con paginación
  listPaginated(params) {
    return http.get('/ImagenProducto/paginated', { params })
  },
  
  // Obtener una imagen por ID
  getById(id) {
    return http.get(`/ImagenProducto/${id}`)
  },
  
  // ✅ SUBIR IMAGEN COMO ARCHIVO (multipart/form-data)
  uploadFile(productoId, archivo, esPrincipal = false, descripcion = '', usuarioSubida = null) {
    const formData = new FormData()
    formData.append('producto_id', productoId)
    formData.append('archivo', archivo)
    formData.append('es_principal', esPrincipal ? 'true' : 'false')
    formData.append('descripcion', descripcion || '')
    if (usuarioSubida) {
      formData.append('usuario_subida', usuarioSubida)
    }

    return http.post('/ImagenProducto/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  // ✅ SUBIR MÚLTIPLES IMÁGENES
  uploadMultiple(productoId, archivos, usuarioSubida = null) {
    const formData = new FormData()
    formData.append('producto_id', productoId)
    archivos.forEach((archivo) => {
      formData.append('archivos', archivo)
    })
    if (usuarioSubida) {
      formData.append('usuario_subida', usuarioSubida)
    }

    return http.post('/ImagenProducto/upload-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  // Crear imagen (con URL - para casos especiales)
  create(data) {
    return http.post('/ImagenProducto', data)
  },
  
  // Actualizar una imagen
  update(id, data) {
    return http.put(`/ImagenProducto/${id}`, data)
  },
  
  // Eliminar una imagen
  remove(id) {
    return http.delete(`/ImagenProducto/${id}`)
  },
  
  // Obtener imágenes de un producto
  getByProducto(productoId) {
    return http.get(`/ImagenProducto/producto/${productoId}`)
  },
  
  // Eliminar todas las imágenes de un producto
  removeByProducto(productoId) {
    return http.delete(`/ImagenProducto/producto/${productoId}`)
  },
  
  // Obtener imagen principal de un producto
  getPrincipal(productoId) {
    return http.get(`/ImagenProducto/producto/${productoId}/principal`)
  },
  
  // Obtener resumen de imágenes de un producto
  getResumen(productoId) {
    return http.get(`/ImagenProducto/producto/${productoId}/resumen`)
  },
  
  // Estadísticas generales
  getEstadisticas() {
    return http.get('/ImagenProducto/estadisticas')
  },
  
  // Imágenes por formato
  getPorFormato() {
    return http.get('/ImagenProducto/por-formato')
  },
  
  // Imágenes por producto
  getPorProducto() {
    return http.get('/ImagenProducto/por-producto')
  },
  
  // Verificar si un producto tiene imágenes
  hasImagenes(productoId) {
    return http.get(`/ImagenProducto/producto/${productoId}/has-imagenes`)
  },
  
  // Contar imágenes de un producto
  countByProducto(productoId) {
    return http.get(`/ImagenProducto/producto/${productoId}/count`)
  },
  
  // Establecer imagen como principal
  setPrincipal(imagenId, productoId) {
    return http.post('/ImagenProducto/principal', { imagen_id: imagenId, producto_id: productoId })
  },
  
  // Reordenar imagen (individual)
  reordenar(imagenId, nuevoOrden, productoId = null) {
    return http.post('/ImagenProducto/reordenar', { imagen_id: imagenId, nuevo_orden: nuevoOrden, producto_id: productoId })
  },
  
  // Reordenar imágenes (masivo)
  reordenarMasivo(productoId, ordenIds) {
    return http.post('/ImagenProducto/reordenar-masivo', { producto_id: productoId, orden_ids: ordenIds })
  },
  
  // Duplicar imagen a otro producto
  duplicar(id, nuevoProductoId) {
    return http.post(`/ImagenProducto/${id}/duplicar/${nuevoProductoId}`)
  },
  
  // Limpiar imágenes huérfanas
  limpiarHuerfanas() {
    return http.delete('/ImagenProducto/limpiar-huerfanas')
  },
  
  // Verificar si existe
  checkExists(productoId, url, excludeId = null) {
    return http.get('/ImagenProducto/check-exists', { params: { productoId, url, excludeId } })
  },
  
  // Verificar si tiene imagen principal
  hasPrincipal(productoId) {
    return http.get(`/ImagenProducto/producto/${productoId}/has-principal`)
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
  // Listar todos los movimientos
  list(params = {}) {
    return http.get('/Kardex', { params })
  },
  
  // Listar con paginación
  listPaginated(params) {
    return http.get('/Kardex/paginated', { params })
  },
  
  // Obtener un movimiento por ID
  getById(id) {
    return http.get(`/Kardex/${id}`)
  },
  
  // Obtener movimientos por producto
  getByProducto(productoId, params = {}) {
    return http.get(`/Kardex/producto/${productoId}`, { params })
  },
  
  // Obtener movimientos por ingrediente
  getByIngrediente(ingredienteId, params = {}) {
    return http.get(`/Kardex/ingrediente/${ingredienteId}`, { params })
  },
  
  // Obtener saldo de un producto
  getSaldoProducto(productoId) {
    return http.get(`/Kardex/producto/${productoId}/saldo`)
  },
  
  // Obtener saldo de un ingrediente
  getSaldoIngrediente(ingredienteId) {
    return http.get(`/Kardex/ingrediente/${ingredienteId}/saldo`)
  },
  
  // Crear movimiento
  create(data) {
    return http.post('/Kardex', data)
  },
  
  // Actualizar movimiento
  update(id, data) {
    return http.put(`/Kardex/${id}`, data)
  },
  
  // Eliminar movimiento
  remove(id) {
    return http.delete(`/Kardex/${id}`)
  },
  
  // Registrar entrada
  entrada(data) {
    return http.post('/Kardex/entrada', data)
  },
  
  // Registrar salida
  salida(data) {
    return http.post('/Kardex/salida', data)
  },
  
  // Registrar ajuste
  ajuste(data) {
    return http.post('/Kardex/ajuste', data)
  },
  
  // Registrar devolución
  devolucion(data) {
    return http.post('/Kardex/devolucion', data)
  },
  
  // Obtener estadísticas
  getEstadisticas() {
    return http.get('/Kardex/estadisticas')
  },
  
  // Obtener estadísticas de un producto
  getEstadisticasProducto(productoId) {
    return http.get(`/Kardex/producto/${productoId}/estadisticas`)
  },
  
  // Obtener estadísticas de un ingrediente
  getEstadisticasIngrediente(ingredienteId) {
    return http.get(`/Kardex/ingrediente/${ingredienteId}/estadisticas`)
  },
  
  // Productos más movidos
  getProductosMasMovidos() {
    return http.get('/Kardex/productos-mas-movidos')
  },
  
  // Ingredientes más movidos
  getIngredientesMasMovidos() {
    return http.get('/Kardex/ingredientes-mas-movidos')
  },
  
  // Resumen de un producto
  getResumenProducto(productoId) {
    return http.get(`/Kardex/producto/${productoId}/resumen`)
  },
  
  // Resumen de un ingrediente
  getResumenIngrediente(ingredienteId) {
    return http.get(`/Kardex/ingrediente/${ingredienteId}/resumen`)
  },
  
  // Resumen de todos los productos
  getResumenProductos() {
    return http.get('/Kardex/resumen-productos')
  },
  
  // Resumen de todos los ingredientes
  getResumenIngredientes() {
    return http.get('/Kardex/resumen-ingredientes')
  },
  
  // Calcular saldos de un movimiento
  calcularSaldos(id) {
    return http.get(`/Kardex/${id}/calcular-saldos`)
  },
  
  // Corregir saldos
  corregirSaldos(data) {
    return http.post('/Kardex/corregir-saldos', data)
  },
  
  // Recalcular producto
  recalcularProducto(productoId) {
    return http.post(`/Kardex/recalcular/producto/${productoId}`)
  },
  
  // Recalcular ingrediente
  recalcularIngrediente(ingredienteId) {
    return http.post(`/Kardex/recalcular/ingrediente/${ingredienteId}`)
  },
  
  // Validar existencia
  validarExistencia(data) {
    return http.post('/Kardex/validar-existencia', data)
  },
  
  // Limpiar movimientos antiguos
  limpiarAntiguos(dias) {
    return http.delete(`/Kardex/limpiar-antiguos?dias=${dias}`)
  },
  
  // Obtener movimientos por documento
  getByDocumento(tipo, id) {
    return http.get(`/Kardex/documento?tipo=${tipo}&id=${id}`)
  }
}

// ============================================
// PROVEEDORES
// ============================================
export const ProveedoresAPI = {
  list() {
    return http.get('/Proveedor')
  },
  
  listPaginated(params) {
    return http.get('/Proveedor/paginated', { params })
  },
  
  getById(id) {
    return http.get(`/Proveedor/${id}`)
  },
  
  create(data) {
    return http.post('/Proveedor', data)
  },
  
  update(id, data) {
    return http.put(`/Proveedor/${id}`, data)
  },
  
  remove(id) {
    return http.delete(`/Proveedor/${id}`)
  },
  
  getDestacados() {
    return http.get('/Proveedor/destacados')
  },
  
  getByCalificacion(calificacion) {
    return http.get(`/Proveedor/calificacion/${calificacion}`)
  },
  
  getResumen(id) {
    return http.get(`/Proveedor/${id}/resumen`)
  },
  
  getEstadisticas() {
    return http.get('/Proveedor/estadisticas')
  },
  
  getPorCiudad() {
    return http.get('/Proveedor/por-ciudad')
  },
  
  getPorEstado() {
    return http.get('/Proveedor/por-estado')
  },
  
  getPorCalificacion() {
    return http.get('/Proveedor/por-calificacion')
  },
  
  getTiposPersona() {
    return http.get('/Proveedor/tipos-persona')
  },
  
  getTerminosPago() {
    return http.get('/Proveedor/terminos-pago')
  },
  
  calificar(data) {
    return http.post('/Proveedor/calificar', data)
  },
  
  toggleStatus(id) {
    return http.patch(`/Proveedor/${id}/estado`)
  },
  
  limpiarInactivos() {
    return http.delete('/Proveedor/limpiar-inactivos')
  },
  
  checkRuc(ruc) {
    return http.get(`/Proveedor/check-ruc?ruc=${ruc}`)
  },
  
  checkNombre(nombre) {
    return http.get(`/Proveedor/check-nombre?nombre=${nombre}`)
  },
  
  hasCompras(id) {
    return http.get(`/Proveedor/${id}/has-compras`)
  }
}

// ============================================
// COMPRAS
// ============================================
export const ComprasAPI = {
  // Listar todas las compras
  list(params = {}) {
    return http.get('/Compra', { params })
  },
  
  // Listar con paginación
  listPaginated(params) {
    return http.get('/Compra/paginated', { params })
  },
  
  // Obtener una compra por ID
  getById(id) {
    return http.get(`/Compra/${id}`)
  },
  
  // Obtener compra por número
  getByNumero(numeroCompra) {
    return http.get(`/Compra/numero/${numeroCompra}`)
  },
  
  // Crear compra
  create(data) {
    return http.post('/Compra', data)
  },
  
  // Actualizar compra
  update(id, data) {
    return http.put(`/Compra/${id}`, data)
  },
  
  // Eliminar compra
  remove(id) {
    return http.delete(`/Compra/${id}`)
  },
  
  // Obtener compras por proveedor
  getByProveedor(proveedorId) {
    return http.get(`/Compra/proveedor/${proveedorId}`)
  },
  
  // Obtener compras por sede
  getBySede(sedeId) {
    return http.get(`/Compra/sede/${sedeId}`)
  },
  
  // Obtener compras por estado
  getByEstado(estado) {
    return http.get(`/Compra/estado/${estado}`)
  },
  
  // Obtener resumen de una compra
  getResumen(id) {
    return http.get(`/Compra/${id}/resumen`)
  },
  
  // Obtener estadísticas
  getEstadisticas() {
    return http.get('/Compra/estadisticas')
  },
  
  // Obtener compras por estado (agrupados)
  getPorEstado() {
    return http.get('/Compra/por-estado')
  },
  
  // Obtener compras por proveedor (agrupados)
  getPorProveedor() {
    return http.get('/Compra/por-proveedor')
  },
  
  // Obtener gastos por proveedor
  getGastosPorProveedor() {
    return http.get('/Compra/gastos-por-proveedor')
  },
  
  // Calcular total
  calcularTotal(id) {
    return http.get(`/Compra/calcular-total?id=${id}`)
  },
  
  // Verificar si tiene detalles
  hasDetalles(id) {
    return http.get(`/Compra/${id}/has-detalles`)
  },
  
  // Verificar si está aprobada
  isAprobada(id) {
    return http.get(`/Compra/${id}/is-aprobada`)
  },
  
  // Verificar si está recibida
  isRecibida(id) {
    return http.get(`/Compra/${id}/is-recibida`)
  },
  
  // Cambiar estado
  cambiarEstado(data) {
    return http.post('/Compra/cambiar-estado', data)
  },
  
  // Aprobar compra
  aprobar(id, data) {
    return http.post(`/Compra/aprobar?id=${id}`, data)
  },
  
  // Recibir compra
  recibir(id, data) {
    return http.post(`/Compra/recibir?id=${id}`, data)
  },
  
  // Cancelar compra
  cancelar(id, motivo) {
    return http.post(`/Compra/cancelar/${id}`, { motivo })
  },
  
  // Generar número de compra
  generarNumero() {
    return http.post('/Compra/generar-numero')
  },
  
  // Recalcular totales
  recalcularTotales(id) {
    return http.post(`/Compra/recalcular-totales/${id}`)
  },
  
  // Limpiar compras antiguas
  limpiarAntiguas(dias) {
    return http.delete(`/Compra/limpiar-antiguas?dias=${dias}`)
  },
  
  // Verificar número de compra
  checkNumero(numero) {
    return http.get(`/Compra/check-numero?numero=${numero}`)
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
  // Listar todos los pedidos
  list(params = {}) {
    return http.get('/Pedido', { params })
  },
  
  // Listar con paginación
  listPaginated(params) {
    return http.get('/Pedido/paginated', { params })
  },
  
  // Obtener un pedido por ID
  getById(id) {
    return http.get(`/Pedido/${id}`)
  },
  
  // Obtener pedido por número
  getByNumero(numeroPedido) {
    return http.get(`/Pedido/numero/${numeroPedido}`)
  },
  
  // Crear pedido
  create(data) {
    return http.post('/Pedido', data)
  },
  
  // Actualizar pedido
  update(id, data) {
    return http.put(`/Pedido/${id}`, data)
  },
  
  // Eliminar pedido
  remove(id) {
    return http.delete(`/Pedido/${id}`)
  },
  
  // Obtener pedidos por cliente
  getByCliente(clienteId) {
    return http.get(`/Pedido/cliente/${clienteId}`)
  },
  
  // Obtener pedidos por mesa
  getByMesa(mesaId) {
    return http.get(`/Pedido/mesa/${mesaId}`)
  },
  
  // Obtener pedidos por sede
  getBySede(sedeId) {
    return http.get(`/Pedido/sede/${sedeId}`)
  },
  
  // Obtener pedidos por estado
  getByEstado(estado) {
    return http.get(`/Pedido/estado/${estado}`)
  },
  
  // Obtener pedidos por fecha
  getByFecha(params) {
    return http.get('/Pedido/fecha', { params })
  },
  
  // Obtener resumen de un pedido
  getResumen(id) {
    return http.get(`/Pedido/${id}/resumen`)
  },
  
  // Obtener estadísticas
  getEstadisticas() {
    return http.get('/Pedido/estadisticas')
  },
  
  // Obtener pedidos por estado (agrupados)
  getPorEstado() {
    return http.get('/Pedido/por-estado')
  },
  
  // Obtener pedidos por tipo
  getPorTipo() {
    return http.get('/Pedido/por-tipo')
  },
  
  // Obtener pedidos por sede
  getPorSede() {
    return http.get('/Pedido/por-sede')
  },
  
  // Obtener ingresos
  getIngresos(params) {
    return http.get('/Pedido/ingresos', { params })
  },
  
  // Verificar si está pagado
  isPagado(id) {
    return http.get(`/Pedido/${id}/is-pagado`)
  },
  
  // Verificar si tiene detalles
  hasDetalles(id) {
    return http.get(`/Pedido/${id}/has-detalles`)
  },
  
  // Cambiar estado
  cambiarEstado(data) {
    return http.post('/Pedido/cambiar-estado', data)
  },
  
  // Calificar pedido
  calificar(data) {
    return http.post('/Pedido/calificar', data)
  },
  
  // Agregar pago
  agregarPago(data) {
    return http.post('/Pedido/agregar-pago', data)
  },
  
  // Cancelar pedido
  cancelar(id, motivo) {
    return http.post(`/Pedido/cancelar/${id}`, { motivo })
  },
  
  // Duplicar pedido
  duplicar(id) {
    return http.post(`/Pedido/${id}/duplicar`)
  },
  
  // Generar número de pedido
  generarNumero() {
    return http.post('/Pedido/generar-numero')
  },
  
  // Limpiar pedidos antiguos
  limpiarAntiguos(dias) {
    return http.delete(`/Pedido/limpiar-antiguos?dias=${dias}`)
  },
  
  // Verificar número de pedido
  checkNumero(numero) {
    return http.get(`/Pedido/check-numero?numero=${numero}`)
  }
}
// ============================================
// CRÉDITOS
// ============================================
export const CreditosAPI = {
  // Listar todos los créditos
  list(params = {}) {
    return http.get('/Credito', { params })
  },
  
  // Listar con paginación
  listPaginated(params) {
    return http.get('/Credito/paginated', { params })
  },
  
  // Obtener un crédito por ID
  getById(id) {
    return http.get(`/Credito/${id}`)
  },
  
  // Crear crédito
  create(data) {
    return http.post('/Credito', data)
  },
  
  // Actualizar crédito
  update(id, data) {
    return http.put(`/Credito/${id}`, data)
  },
  
  // Eliminar crédito
  remove(id) {
    return http.delete(`/Credito/${id}`)
  },
  
  // Obtener créditos por cliente
  getByCliente(clienteId) {
    return http.get(`/Credito/cliente/${clienteId}`)
  },
  
  // Obtener créditos por pedido
  getByPedido(pedidoId) {
    return http.get(`/Credito/pedido/${pedidoId}`)
  },
  
  // Obtener créditos por sede
  getBySede(sedeId) {
    return http.get(`/Credito/sede/${sedeId}`)
  },
  
  // Obtener créditos vencidos
  getVencidos() {
    return http.get('/Credito/vencidos')
  },
  
  // Obtener créditos próximos a vencer
  getProximosVencer() {
    return http.get('/Credito/proximos-vencer')
  },
  
  // Obtener resumen de un cliente
  getResumenCliente(clienteId) {
    return http.get(`/Credito/cliente/${clienteId}/resumen`)
  },
  
  // Obtener estadísticas
  getEstadisticas() {
    return http.get('/Credito/estadisticas')
  },
  
  // Obtener créditos por estado (agrupados)
  getPorEstado() {
    return http.get('/Credito/por-estado')
  },
  
  // Obtener créditos por método de pago
  getPorMetodoPago() {
    return http.get('/Credito/por-metodo-pago')
  },
  
  // Obtener créditos por cliente (agrupados)
  getPorCliente() {
    return http.get('/Credito/por-cliente')
  },
  
  // Obtener saldo pendiente
  getSaldoPendiente(id) {
    return http.get(`/Credito/${id}/saldo-pendiente`)
  },
  
  // Verificar si está pagado
  isPagado(id) {
    return http.get(`/Credito/${id}/is-pagado`)
  },
  
  // Verificar si tiene pagos
  hasPagos(id) {
    return http.get(`/Credito/${id}/has-pagos`)
  },
  
  // Registrar pago
  registrarPago(data) {
    return http.post('/Credito/registrar-pago', data)
  },
  
  // Cancelar crédito
  cancelar(data) {
    return http.post('/Credito/cancelar', data)
  },
  
  // Calcular interés
  calcularInteres(data) {
    return http.post('/Credito/calcular-interes', data)
  },
  
  // Generar plan de pagos
  generarPlanPagos(id) {
    return http.post(`/Credito/generar-plan-pagos/${id}`)
  },
  
  // Verificar vencidos
  verificarVencidos() {
    return http.post('/Credito/verificar-vencidos')
  },
  
  // Aplicar mora
  aplicarMora(data) {
    return http.post('/Credito/aplicar-mora', data)
  },
  
  // Actualizar estado
  updateEstado(id, estado) {
    return http.patch(`/Credito/${id}/estado`, { estado })
  },
  
  // Actualizar cuotas pagadas
  updateCuotasPagadas(id, cuotasPagadas) {
    return http.patch(`/Credito/${id}/cuotas-pagadas`, { cuotas_pagadas: cuotasPagadas })
  },
  
  // Limpiar créditos antiguos
  limpiarAntiguos(dias) {
    return http.delete(`/Credito/limpiar-antiguos?dias=${dias}`)
  },
  
  // Verificar existencia
  checkExists(params) {
    return http.get('/Credito/check-exists', { params })
  },
  
  // Calcular mora
  calcularMora(id) {
    return http.get(`/Credito/${id}/calcular-mora`)
  }
}

// ============================================
// AUDITORÍA DE CAJA
// ============================================
export const AuditoriaCajaAPI = {
  // Listar todas las auditorías
  list(params = {}) {
    return http.get('/AuditoriaCaja', { params })
  },
  
  // Listar con paginación
  listPaginated(params) {
    return http.get('/AuditoriaCaja/paginated', { params })
  },
  
  // Obtener una auditoría por ID
  getById(id) {
    return http.get(`/AuditoriaCaja/${id}`)
  },
  
  // Actualizar auditoría
  update(id, data) {
    return http.put(`/AuditoriaCaja/${id}`, data)
  },
  
  // Eliminar auditoría
  remove(id) {
    return http.delete(`/AuditoriaCaja/${id}`)
  },
  
  // Obtener auditoría actual de una sede
  getActual(sedeId) {
    return http.get(`/AuditoriaCaja/sede/${sedeId}/actual`)
  },
  
  // Obtener auditorías por sede
  getBySede(sedeId) {
    return http.get(`/AuditoriaCaja/sede/${sedeId}`)
  },
  
  // Obtener auditorías por usuario
  getByUsuario(usuarioId) {
    return http.get(`/AuditoriaCaja/usuario/${usuarioId}`)
  },
  
  // Obtener auditorías por estado
  getByEstado(estado) {
    return http.get(`/AuditoriaCaja/estado/${estado}`)
  },
  
  // Obtener reporte de cierre
  getReporteCierre(id) {
    return http.get(`/AuditoriaCaja/${id}/reporte-cierre`)
  },
  
  // Obtener estadísticas
  getEstadisticas() {
    return http.get('/AuditoriaCaja/estadisticas')
  },
  
  // Obtener estadísticas por sede
  getEstadisticasBySede(sedeId) {
    return http.get(`/AuditoriaCaja/sede/${sedeId}/estadisticas`)
  },
  
  // Obtener resumen por sede
  getResumenBySede(sedeId) {
    return http.get(`/AuditoriaCaja/sede/${sedeId}/resumen`)
  },
  
  // Obtener resumen de todas las sedes
  getResumenTodasSedes() {
    return http.get('/AuditoriaCaja/resumen-todas-sedes')
  },
  
  // Verificar si tiene caja abierta
  hasAbierta(sedeId) {
    return http.get(`/AuditoriaCaja/sede/${sedeId}/has-abierta`)
  },
  
  // Verificar si puede cerrar
  puedeCerrar(id) {
    return http.get(`/AuditoriaCaja/${id}/puede-cerrar`)
  },
  
  // Obtener monto esperado
  getMontoEsperado(id) {
    return http.get(`/AuditoriaCaja/${id}/monto-esperado`)
  },
  
  // Abrir caja
  abrir(data) {
    return http.post('/AuditoriaCaja/abrir', data)
  },
  
  // Cerrar caja
  cerrar(data) {
    return http.post('/AuditoriaCaja/cerrar', data)
  },
  
  // Recalcular auditoría
  recalcular(id) {
    return http.post(`/AuditoriaCaja/recalcular/${id}`)
  },
  
  // Cierre automático
  cerrarAutomatico(data) {
    return http.post('/AuditoriaCaja/cerrar-automatico', data)
  },
  
  // Limpiar auditorías antiguas
  limpiarAntiguos(dias) {
    return http.delete(`/AuditoriaCaja/limpiar-antiguos?dias=${dias}`)
  }
}

// ============================================
// PROMOCIONES
// ============================================
export const PromocionesAPI = {
  // Listar todas las promociones
  list(params = {}) {
    return http.get('/Promocion', { params })
  },
  
  // Listar con paginación
  listPaginated(params) {
    return http.get('/Promocion/paginated', { params })
  },
  
  // Obtener una promoción por ID
  getById(id) {
    return http.get(`/Promocion/${id}`)
  },
  
  // Obtener promoción por código
  getByCodigo(codigo) {
    return http.get(`/Promocion/codigo/${codigo}`)
  },
  
  // Crear promoción
  create(data) {
    return http.post('/Promocion', data)
  },
  
  // Actualizar promoción
  update(id, data) {
    return http.put(`/Promocion/${id}`, data)
  },
  
  // Eliminar promoción
  remove(id) {
    return http.delete(`/Promocion/${id}`)
  },
  
  // Obtener promociones por sede
  getBySede(sedeId) {
    return http.get(`/Promocion/sede/${sedeId}`)
  },
  
  // Obtener promociones por producto
  getByProducto(productoId) {
    return http.get(`/Promocion/producto/${productoId}`)
  },
  
  // Obtener promociones por categoría
  getByCategoria(categoriaId) {
    return http.get(`/Promocion/categoria/${categoriaId}`)
  },
  
  // Obtener promociones vigentes
  getVigentes() {
    return http.get('/Promocion/vigentes')
  },
  
  // Obtener resumen de una promoción
  getResumen(id) {
    return http.get(`/Promocion/${id}/resumen`)
  },
  
  // Obtener estadísticas
  getEstadisticas() {
    return http.get('/Promocion/estadisticas')
  },
  
  // Obtener promociones por tipo (agrupadas)
  getPorTipo() {
    return http.get('/Promocion/por-tipo')
  },
  
  // Obtener promociones por sede (agrupadas)
  getPorSede() {
    return http.get('/Promocion/por-sede')
  },
  
  // Validar promoción
  validar(data) {
    return http.post('/Promocion/validar', data)
  },
  
  // Aplicar promoción
  aplicar(data) {
    return http.post('/Promocion/aplicar', data)
  },
  
  // Aplicar código de promoción
  aplicarCodigo(data) {
    return http.post('/Promocion/aplicar-codigo', data)
  },
  
  // Importar promociones
  importar(data) {
    return http.post('/Promocion/importar', data)
  },
  
  // Cambiar estado
  toggleStatus(id) {
    return http.patch(`/Promocion/${id}/estado`)
  },
  
  // Incrementar usos
  incrementarUsos(id) {
    return http.patch(`/Promocion/${id}/incrementar-usos`)
  },
  
  // Limpiar promociones expiradas
  limpiarExpiradas() {
    return http.delete('/Promocion/limpiar-expiradas')
  },
  
  // Limpiar promociones inactivas
  limpiarInactivas() {
    return http.delete('/Promocion/limpiar-inactivas')
  },
  
  // Verificar código
  checkCodigo(codigo) {
    return http.get(`/Promocion/check-codigo?codigo=${codigo}`)
  },
  
  // Verificar nombre
  checkNombre(nombre) {
    return http.get(`/Promocion/check-nombre?nombre=${nombre}`)
  },
  
  // Verificar si tiene usos
  hasUsos(id) {
    return http.get(`/Promocion/${id}/has-usos`)
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
  // Listar todas las cuentas
  list(params = {}) {
    return http.get('/CuentaBancaria', { params })
  },
  
  // Listar con paginación
  listPaginated(params) {
    return http.get('/CuentaBancaria/paginated', { params })
  },
  
  // Obtener una cuenta por ID
  getById(id) {
    return http.get(`/CuentaBancaria/${id}`)
  },
  
  // Crear cuenta
  create(data) {
    return http.post('/CuentaBancaria', data)
  },
  
  // Actualizar cuenta
  update(id, data) {
    return http.put(`/CuentaBancaria/${id}`, data)
  },
  
  // Eliminar cuenta
  remove(id) {
    return http.delete(`/CuentaBancaria/${id}`)
  },
  
  // Obtener cuentas por sede
  getBySede(sedeId) {
    return http.get(`/CuentaBancaria/sede/${sedeId}`)
  },
  
  // Obtener cuenta principal de una sede
  getPrincipalBySede(sedeId) {
    return http.get(`/CuentaBancaria/sede/${sedeId}/principal`)
  },
  
  // Obtener resumen por sede
  getResumenBySede(sedeId) {
    return http.get(`/CuentaBancaria/sede/${sedeId}/resumen`)
  },
  
  // Obtener cuentas activas por sede
  getActivasBySede(sedeId) {
    return http.get(`/CuentaBancaria/sede/${sedeId}/activas`)
  },
  
  // Obtener estadísticas
  getEstadisticas() {
    return http.get('/CuentaBancaria/estadisticas')
  },
  
  // Obtener cuentas por banco (agrupadas)
  getPorBanco() {
    return http.get('/CuentaBancaria/por-banco')
  },
  
  // Obtener cuentas por tipo (agrupadas)
  getPorTipo() {
    return http.get('/CuentaBancaria/por-tipo')
  },
  
  // Obtener cuentas por sede (agrupadas)
  getPorSede() {
    return http.get('/CuentaBancaria/por-sede')
  },
  
  // Obtener lista de bancos
  getBancos() {
    return http.get('/CuentaBancaria/bancos')
  },
  
  // Obtener lista de tipos de cuenta
  getTipos() {
    return http.get('/CuentaBancaria/tipos')
  },
  
  // Verificar si tiene cuentas
  hasCuentas(sedeId) {
    return http.get(`/CuentaBancaria/sede/${sedeId}/has-cuentas`)
  },
  
  // Contar cuentas por sede
  countBySede(sedeId) {
    return http.get(`/CuentaBancaria/sede/${sedeId}/count`)
  },
  
  // Establecer cuenta como principal
  setPrincipal(data) {
    return http.post('/CuentaBancaria/principal', data)
  },
  
  // Copiar cuenta
  copiar(data) {
    return http.post('/CuentaBancaria/copiar', data)
  },
  
  // Cambiar estado de una cuenta
  toggleStatus(id) {
    return http.patch(`/CuentaBancaria/${id}/estado`)
  },
  
  // Desactivar todas las cuentas de una sede
  desactivarBySede(sedeId) {
    return http.delete(`/CuentaBancaria/desactivar-sede/${sedeId}`)
  },
  
  // Limpiar cuentas inactivas
  limpiarInactivas() {
    return http.delete('/CuentaBancaria/limpiar-inactivas')
  },
  
  // Verificar existencia
  checkExists(params) {
    return http.get('/CuentaBancaria/check-exists', { params })
  },
  
  // Verificar si tiene cuenta principal
  hasPrincipal(sedeId) {
    return http.get(`/CuentaBancaria/sede/${sedeId}/has-principal`)
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