// utils/navConfig.js

/**
 * Configuración de navegación para el sidebar
 * @param {string} role - Rol del usuario
 * @returns {Array} Array de secciones con sus items
 */
export function navConfig(role) {
  // ============================================
  // LOGS DE DEPURACIÓN
  // ============================================
  console.log('🔍 navConfig - Rol recibido:', role)
  
  // Normalizar el rol
  const rolNormalizado = role?.toLowerCase?.() || ''
  console.log('🔍 navConfig - Rol normalizado:', rolNormalizado)
  
  // ✅ RECONOCER ADMIN
  const isAdmin = rolNormalizado === 'admin' || 
                  rolNormalizado === 'administrador' ||
                  rolNormalizado === 'super_admin' ||
                  rolNormalizado === 'superadmin' ||
                  rolNormalizado === 'super administrador' ||
                  rolNormalizado === 'gerente' ||
                  rolNormalizado === 'supervisor'

  // ✅ RECONOCER ROLES DE RESTAURANTE
  const isCajero = rolNormalizado === 'cajero'
  const isMesero = rolNormalizado === 'mesero'
  const isCocinero = rolNormalizado === 'cocinero'
  const isDelivery = rolNormalizado === 'delivery'
  const isCliente = rolNormalizado === 'cliente'

  // ============================================
  // CONFIGURACIÓN PARA ADMIN (Acceso Total)
  // ============================================
  if (isAdmin) {
    console.log('✅ Usando configuración ADMIN para rol:', rolNormalizado)
    return [
      {
        section: 'General',
        items: [
          { key: 'bienvenida', label: 'Bienvenida', icon: 'bi bi-house-door' },
          { key: 'dashboard', label: 'Dashboard', icon: 'bi bi-grid-1x2' }
        ]
      },
      {
        section: 'Restaurante',
        items: [
          { key: 'sedes', label: 'Sedes', icon: 'bi bi-building' },
          { key: 'categorias', label: 'Categorías', icon: 'bi bi-tags' },
          { key: 'productos', label: 'Productos', icon: 'bi bi-box' },
          { key: 'ingredientes', label: 'Ingredientes', icon: 'bi bi-cup-straw' },
          { key: 'kardex', label: 'Kardex', icon: 'bi bi-clipboard-data' },
          { key: 'proveedores', label: 'Proveedores', icon: 'bi bi-truck' }
        ]
      },
      {
        section: 'Ventas y Pedidos',
        items: [
          { key: 'mesas', label: 'Mesas', icon: 'bi bi-table' },
          { key: 'pedidos', label: 'Pedidos', icon: 'bi bi-cart' },
          { key: 'clientes', label: 'Clientes', icon: 'bi bi-people' }
        ]
      },
      {
        section: 'Finanzas',
        items: [
          { key: 'compras', label: 'Compras', icon: 'bi bi-bag' },
          { key: 'creditos', label: 'Créditos', icon: 'bi bi-credit-card' },
          { key: 'auditoria_caja', label: 'Auditoría de Caja', icon: 'bi bi-cash-stack' },
          // ⭐ CUENTAS BANCARIAS
          { key: 'cuentas_bancarias_empresa', label: 'Cuentas Bancarias', icon: 'bi bi-bank' }
        ]
      },
      {
        section: 'Promociones',
        items: [
          { key: 'promociones', label: 'Promociones', icon: 'bi bi-gift' }
        ]
      },
      {
        section: 'Administración',
        items: [
          { key: 'usuarios', label: 'Usuarios', icon: 'bi bi-people' },
          { key: 'roles', label: 'Roles y Permisos', icon: 'bi bi-shield-lock' },
          { key: 'logs', label: 'Bitácora', icon: 'bi bi-clock-history' }
        ]
      },
      {
        section: 'Configuración',
        items: [
          { key: 'configuracion_sede', label: 'Config. Sede', icon: 'bi bi-gear' },
          { key: 'configuracion_email', label: 'Config. Email', icon: 'bi bi-envelope' },
          { key: 'configuracion_whatsapp', label: 'Config. WhatsApp', icon: 'bi bi-whatsapp' }
        ]
      },
      {
        section: 'Reportes',
        items: [
          { key: 'reportes_guardados', label: 'Reportes Guardados', icon: 'bi bi-file-earmark-text' }
        ]
      }
    ]
  }

  // ============================================
  // CONFIGURACIÓN PARA CAJERO
  // ============================================
  if (isCajero) {
    console.log('✅ Usando configuración CAJERO')
    return [
      {
        section: 'General',
        items: [
          { key: 'bienvenida', label: 'Bienvenida', icon: 'bi bi-house-door' },
          { key: 'dashboard', label: 'Dashboard', icon: 'bi bi-grid-1x2' }
        ]
      },
      {
        section: 'Ventas',
        items: [
          { key: 'pedidos', label: 'Pedidos', icon: 'bi bi-cart' },
          { key: 'clientes', label: 'Clientes', icon: 'bi bi-people' }
        ]
      },
      {
        section: 'Finanzas',
        items: [
          { key: 'creditos', label: 'Créditos', icon: 'bi bi-credit-card' },
          { key: 'auditoria_caja', label: 'Auditoría de Caja', icon: 'bi bi-cash-stack' }
        ]
      }
    ]
  }

  // ============================================
  // CONFIGURACIÓN PARA MESERO
  // ============================================
  if (isMesero) {
    console.log('✅ Usando configuración MESERO')
    return [
      {
        section: 'General',
        items: [
          { key: 'bienvenida', label: 'Bienvenida', icon: 'bi bi-house-door' },
          { key: 'dashboard', label: 'Dashboard', icon: 'bi bi-grid-1x2' }
        ]
      },
      {
        section: 'Servicio',
        items: [
          { key: 'mesas', label: 'Mesas', icon: 'bi bi-table' },
          { key: 'pedidos', label: 'Pedidos', icon: 'bi bi-cart' },
          { key: 'productos', label: 'Productos', icon: 'bi bi-box' }
        ]
      },
      {
        section: 'Clientes',
        items: [
          { key: 'clientes', label: 'Clientes', icon: 'bi bi-people' }
        ]
      }
    ]
  }

  // ============================================
  // CONFIGURACIÓN PARA COCINERO
  // ============================================
  if (isCocinero) {
    console.log('✅ Usando configuración COCINERO')
    return [
      {
        section: 'General',
        items: [
          { key: 'bienvenida', label: 'Bienvenida', icon: 'bi bi-house-door' },
          { key: 'dashboard', label: 'Dashboard', icon: 'bi bi-grid-1x2' }
        ]
      },
      {
        section: 'Cocina',
        items: [
          { key: 'pedidos', label: 'Pedidos', icon: 'bi bi-cart' },
          { key: 'productos', label: 'Productos', icon: 'bi bi-box' },
          { key: 'ingredientes', label: 'Ingredientes', icon: 'bi bi-cup-straw' }
        ]
      },
      {
        section: 'Inventario',
        items: [
          { key: 'kardex', label: 'Kardex', icon: 'bi bi-clipboard-data' }
        ]
      }
    ]
  }

  // ============================================
  // CONFIGURACIÓN PARA DELIVERY
  // ============================================
  if (isDelivery) {
    console.log('✅ Usando configuración DELIVERY')
    return [
      {
        section: 'General',
        items: [
          { key: 'bienvenida', label: 'Bienvenida', icon: 'bi bi-house-door' },
          { key: 'dashboard', label: 'Dashboard', icon: 'bi bi-grid-1x2' }
        ]
      },
      {
        section: 'Entregas',
        items: [
          { key: 'pedidos', label: 'Pedidos', icon: 'bi bi-cart' },
          { key: 'clientes', label: 'Clientes', icon: 'bi bi-people' }
        ]
      }
    ]
  }

  // ============================================
  // CONFIGURACIÓN PARA CLIENTE
  // ============================================
  if (isCliente) {
    console.log('✅ Usando configuración CLIENTE')
    return [
      {
        section: 'General',
        items: [
          { key: 'bienvenida', label: 'Bienvenida', icon: 'bi bi-house-door' }
        ]
      },
      {
        section: 'Mis Datos',
        items: [
          { key: 'pedidos', label: 'Mis Pedidos', icon: 'bi bi-cart' },
          { key: 'creditos', label: 'Mis Créditos', icon: 'bi bi-credit-card' }
        ]
      }
    ]
  }

  // ============================================
  // CONFIGURACIÓN POR DEFECTO
  // ============================================
  console.warn('⚠️ Rol no reconocido:', role, 'usando configuración por defecto')
  return [
    {
      section: 'General',
      items: [
        { key: 'bienvenida', label: 'Bienvenida', icon: 'bi bi-house-door' }
      ]
    }
  ]
}

/**
 * Obtiene el nombre de la sección para un item
 */
export function getSectionForKey(key, role) {
  const config = navConfig(role)
  for (const section of config) {
    const found = section.items.find(item => item.key === key)
    if (found) return section.section
  }
  return null
}

/**
 * Obtiene el label de un item por su key
 */
export function getLabelForKey(key, role) {
  const config = navConfig(role)
  for (const section of config) {
    const found = section.items.find(item => item.key === key)
    if (found) return found.label
  }
  return key
}

/**
 * Obtiene todos los items de navegación
 */
export function getAllNavItems(role) {
  const config = navConfig(role)
  const items = []
  for (const section of config) {
    for (const item of section.items) {
      items.push({
        ...item,
        section: section.section
      })
    }
  }
  return items
}

/**
 * Verifica si un item está activo
 */
export function isNavItemActive(key, currentRoute) {
  const routeMap = {
    // General
    'bienvenida': ['bienvenida'],
    'dashboard': ['dashboard'],
    
    // Restaurante
    'sedes': ['sedes'],
    'categorias': ['categorias', 'categoria_nuevo', 'categoria_editar'],
    'productos': ['productos', 'producto_nuevo', 'producto_editar'],
    'ingredientes': ['ingredientes', 'ingrediente_nuevo', 'ingrediente_editar'],
    'kardex': ['kardex'],
    'proveedores': ['proveedores', 'proveedor_nuevo', 'proveedor_editar'],
    
    // Ventas y Pedidos
    'mesas': ['mesas', 'mesa_nuevo', 'mesa_editar'],
    'pedidos': ['pedidos', 'pedido_nuevo', 'pedido_editar', 'pedido_detalle'],
    'clientes': ['clientes', 'cliente_nuevo', 'cliente_editar'],
    
    // Finanzas
    'compras': ['compras', 'compra_nuevo', 'compra_editar', 'compra_detalle'],
    'creditos': ['creditos', 'credito_nuevo', 'credito_editar', 'credito_pago'],
    'auditoria_caja': ['auditoria_caja', 'auditoria_caja_abrir', 'auditoria_caja_detalle'],
    // ⭐ CUENTAS BANCARIAS
    'cuentas_bancarias_empresa': ['cuentas_bancarias_empresa', 'cuenta_bancaria_nuevo', 'cuenta_bancaria_editar', 'cuenta_bancaria_detalle'],
    
    // Promociones
    'promociones': ['promociones', 'promocion_nuevo', 'promocion_editar'],
    
    // Administración
    'usuarios': ['usuarios', 'usuario_nuevo', 'usuario_editar'],
    'roles': ['roles', 'rol_nuevo', 'rol_editar'],
    'logs': ['logs'],
    
    // Configuración
    'configuracion_sede': ['configuracion_sede'],
    'configuracion_email': ['configuracion_email'],
    'configuracion_whatsapp': ['configuracion_whatsapp'],
    
    // Reportes
    'reportes_guardados': ['reportes_guardados']
  }

  const routes = routeMap[key] || [key]
  return routes.includes(currentRoute)
}

/**
 * Obtiene las rutas permitidas para un rol
 */
export function getPermittedRoutes(role) {
  const config = navConfig(role)
  const routes = []
  for (const section of config) {
    for (const item of section.items) {
      routes.push(item.key)
    }
  }
  return routes
}

/**
 * Verifica si un rol tiene acceso a una ruta
 */
export function hasRouteAccess(role, routeKey) {
  const permitted = getPermittedRoutes(role)
  return permitted.includes(routeKey)
}

/**
 * Obtiene el icono de un item por su key
 */
export function getIconForKey(key, role) {
  const config = navConfig(role)
  for (const section of config) {
    const found = section.items.find(item => item.key === key)
    if (found) return found.icon
  }
  return 'bi bi-circle'
}

/**
 * Obtiene la configuración completa para un rol (incluye items anidados)
 */
export function getFullNavConfig(role) {
  return navConfig(role)
}

/**
 * Filtra los items de navegación por permisos específicos
 */
export function filterNavByPermisos(role, extraPermisos = []) {
  const config = navConfig(role)
  const permisosSet = new Set(extraPermisos)
  
  if (permisosSet.size > 0) {
    const filteredConfig = []
    for (const section of config) {
      const filteredItems = section.items.filter(item => 
        permisosSet.has(item.key) || 
        ['bienvenida', 'dashboard'].includes(item.key)
      )
      if (filteredItems.length > 0) {
        filteredConfig.push({
          ...section,
          items: filteredItems
        })
      }
    }
    return filteredConfig
  }
  
  return config
}