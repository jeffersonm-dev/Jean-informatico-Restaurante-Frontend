// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { public: true }
  },
  {
    path: '/',
    component: () => import('../components/layout/AppShell.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: { name: 'dashboard' } },
      
      // ============================================
      // DASHBOARD Y GENERAL
      // ============================================
      { 
        path: 'dashboard', 
        name: 'dashboard', 
        component: () => import('../views/DashboardView.vue'),
        meta: { title: 'Dashboard' }
      },
      { 
        path: 'bienvenida', 
        name: 'bienvenida', 
        component: () => import('../views/BienvenidaView.vue'),
        meta: { title: 'Bienvenida' }
      },
      { 
        path: 'reporte-general', 
        name: 'reporte_general', 
        component: () => import('../views/restaurante/ReporteGeneralView.vue'),
        meta: { role: 'admin', title: 'Reporte General' }
      },

      // ============================================
      // REPORTE (para empresa)
      // ============================================
      { 
        path: 'reporte', 
        name: 'reporte', 
        component: () => import('../views/restaurante/ReporteView.vue'),
        meta: { title: 'Reporte' }
      },
      { 
        path: 'reporte/:periodo', 
        name: 'reporte_periodo', 
        component: () => import('../views/restaurante/ReporteView.vue'),
        meta: { title: 'Reporte Período' }
      },
      { 
        path: 'historial', 
        name: 'historial', 
        component: () => import('../views/restaurante/HistorialView.vue'),
        meta: { title: 'Historial' }
      },

      // ============================================
      // SEDES (Empresas)
      // ============================================
      { 
        path: 'sedes', 
        name: 'sedes', 
        component: () => import('../views/restaurante/Sede/SedeView.vue'),
        meta: { role: 'admin', title: 'Gestión de Sedes' }
      },

      // ============================================
      // USUARIOS
      // ============================================
      { 
        path: 'usuarios', 
        name: 'usuarios', 
        component: () => import('../views/AdminUsuariosView.vue'),
        meta: { role: 'admin', title: 'Gestión de Usuarios' }
      },
      { 
        path: 'usuarios/nuevo', 
        name: 'usuario_nuevo', 
        component: () => import('../views/AdminUsuarioFormView.vue'),
        meta: { role: 'admin', title: 'Nuevo Usuario' }
      },
      { 
        path: 'usuarios/:id', 
        name: 'usuario_editar', 
        component: () => import('../views/AdminUsuarioFormView.vue'),
        meta: { role: 'admin', title: 'Editar Usuario' }
      },

      // ============================================
      // ROLES Y PERMISOS
      // ============================================
      { 
        path: 'roles', 
        name: 'roles', 
        component: () => import('../views/AdminRolesView.vue'),
        meta: { role: 'admin', title: 'Gestión de Roles' }
      },

      // ============================================
      // CATEGORÍAS
      // ============================================
      { 
        path: 'categorias', 
        name: 'categorias', 
        component: () => import('../views/restaurante/Categoria/CategoriaView.vue'),
        meta: { title: 'Categorías' }
      },
      { 
        path: 'categorias/nuevo', 
        name: 'categoria_nuevo', 
        component: () => import('../views/restaurante/Categoria/CategoriaFormView.vue'),
        meta: { title: 'Nueva Categoría' }
      },
      { 
        path: 'categorias/:id', 
        name: 'categoria_editar', 
        component: () => import('../views/restaurante/Categoria/CategoriaFormView.vue'),
        meta: { title: 'Editar Categoría' }
      },

      // ============================================
      // PRODUCTOS
      // ============================================
      { 
        path: 'productos', 
        name: 'productos', 
        component: () => import('../views/restaurante/Producto/ProductoView.vue'),
        meta: { title: 'Productos' }
      },
      { 
        path: 'productos/nuevo', 
        name: 'producto_nuevo', 
        component: () => import('../views/restaurante/Producto/ProductoFormView.vue'),
        meta: { title: 'Nuevo Producto' }
      },
      { 
        path: 'productos/:id', 
        name: 'producto_editar', 
        component: () => import('../views/restaurante/Producto/ProductoFormView.vue'),
        meta: { title: 'Editar Producto' }
      },

      // ============================================
      // INGREDIENTES
      // ============================================
      { 
        path: 'ingredientes', 
        name: 'ingredientes', 
        component: () => import('../views/restaurante/Ingrediente/IngredienteView.vue'),
        meta: { title: 'Ingredientes' }
      },
      { 
        path: 'ingredientes/nuevo', 
        name: 'ingrediente_nuevo', 
        component: () => import('../views/restaurante/Ingrediente/IngredienteFormView.vue'),
        meta: { title: 'Nuevo Ingrediente' }
      },
      { 
        path: 'ingredientes/:id', 
        name: 'ingrediente_editar', 
        component: () => import('../views/restaurante/Ingrediente/IngredienteFormView.vue'),
        meta: { title: 'Editar Ingrediente' }
      },

      // ============================================
      // KARDEX (Inventario)
      // ============================================
      { 
        path: 'kardex', 
        name: 'kardex', 
        component: () => import('../views/restaurante/Kardex/KardexView.vue'),
        meta: { title: 'Kardex de Inventario' }
      },

      // ============================================
      // PROVEEDORES
      // ============================================
      { 
        path: 'proveedores', 
        name: 'proveedores', 
        component: () => import('../views/restaurante/Proveedor/ProveedorView.vue'),
        meta: { title: 'Proveedores' }
      },
      { 
        path: 'proveedores/nuevo', 
        name: 'proveedor_nuevo', 
        component: () => import('../views/restaurante/Proveedor/ProveedorFormView.vue'),
        meta: { title: 'Nuevo Proveedor' }
      },
      { 
        path: 'proveedores/:id', 
        name: 'proveedor_editar', 
        component: () => import('../views/restaurante/Proveedor/ProveedorFormView.vue'),
        meta: { title: 'Editar Proveedor' }
      },

      // ============================================
      // COMPRAS
      // ============================================
      { 
        path: 'compras', 
        name: 'compras', 
        component: () => import('../views/restaurante/Compra/CompraView.vue'),
        meta: { title: 'Compras' }
      },
      { 
        path: 'compras/nuevo', 
        name: 'compra_nuevo', 
        component: () => import('../views/restaurante/Compra/CompraFormView.vue'),
        meta: { title: 'Nueva Compra' }
      },
      { 
        path: 'compras/:id', 
        name: 'compra_editar', 
        component: () => import('../views/restaurante/Compra/CompraFormView.vue'),
        meta: { title: 'Editar Compra' }
      },
      { 
        path: 'compras/:id/detalle', 
        name: 'compra_detalle', 
        component: () => import('../views/restaurante/Compra/CompraDetalleView.vue'),
        meta: { title: 'Detalle de Compra' }
      },

      // ============================================
      // MESAS
      // ============================================
      { 
        path: 'mesas', 
        name: 'mesas', 
        component: () => import('../views/restaurante/Mesa/MesaView.vue'),
        meta: { title: 'Mesas' }
      },
      { 
        path: 'mesas/nuevo', 
        name: 'mesa_nuevo', 
        component: () => import('../views/restaurante/Mesa/MesaFormView.vue'),
        meta: { title: 'Nueva Mesa' }
      },
      { 
        path: 'mesas/:id', 
        name: 'mesa_editar', 
        component: () => import('../views/restaurante/Mesa/MesaFormView.vue'),
        meta: { title: 'Editar Mesa' }
      },

      // ============================================
      // CLIENTES
      // ============================================
      { 
        path: 'clientes', 
        name: 'clientes', 
        component: () => import('../views/restaurante/Cliente/ClienteView.vue'),
        meta: { title: 'Clientes' }
      },
      { 
        path: 'clientes/nuevo', 
        name: 'cliente_nuevo', 
        component: () => import('../views/restaurante/Cliente/ClienteFormView.vue'),
        meta: { title: 'Nuevo Cliente' }
      },
      { 
        path: 'clientes/:id', 
        name: 'cliente_editar', 
        component: () => import('../views/restaurante/Cliente/ClienteFormView.vue'),
        meta: { title: 'Editar Cliente' }
      },

      // ============================================
      // PEDIDOS
      // ============================================
      { 
        path: 'pedidos', 
        name: 'pedidos', 
        component: () => import('../views/restaurante/Pedido/PedidoView.vue'),
        meta: { title: 'Pedidos' }
      },
      { 
        path: 'pedidos/nuevo', 
        name: 'pedido_nuevo', 
        component: () => import('../views/restaurante/Pedido/PedidoFormView.vue'),
        meta: { title: 'Nuevo Pedido' }
      },
      { 
        path: 'pedidos/:id', 
        name: 'pedido_editar', 
        component: () => import('../views/restaurante/Pedido/PedidoFormView.vue'),
        meta: { title: 'Editar Pedido' }
      },
      { 
        path: 'pedidos/:id/detalle', 
        name: 'pedido_detalle', 
        component: () => import('../views/restaurante/Pedido/PedidoDetalleView.vue'),
        meta: { title: 'Detalle de Pedido' }
      },

      // ============================================
      // CRÉDITOS
      // ============================================
      { 
        path: 'creditos', 
        name: 'creditos', 
        component: () => import('../views/restaurante/Credito/CreditoView.vue'),
        meta: { title: 'Créditos' }
      },
      { 
        path: 'creditos/nuevo', 
        name: 'credito_nuevo', 
        component: () => import('../views/restaurante/Credito/CreditoFormView.vue'),
        meta: { title: 'Nuevo Crédito' }
      },
      { 
        path: 'creditos/:id', 
        name: 'credito_editar', 
        component: () => import('../views/restaurante/Credito/CreditoFormView.vue'),
        meta: { title: 'Editar Crédito' }
      },
      { 
        path: 'creditos/:id/pago', 
        name: 'credito_pago', 
        component: () => import('../views/restaurante/Credito/CreditoPagoView.vue'),
        meta: { title: 'Registrar Pago de Crédito' }
      },

      // ============================================
      // CUENTAS BANCARIAS DE EMPRESA ⭐ NUEVO
      // ============================================
      { 
        path: 'cuentas-bancarias-empresa', 
        name: 'cuentas_bancarias_empresa', 
        component: () => import('../views/restaurante/CuentaBancaria/CuentaBancariaView.vue'),
        meta: { role: 'admin', title: 'Cuentas Bancarias' }
      },
      { 
        path: 'cuentas-bancarias-empresa/nuevo', 
        name: 'cuenta_bancaria_nuevo', 
        component: () => import('../views/restaurante/CuentaBancaria/CuentaBancariaFormView.vue'),
        meta: { role: 'admin', title: 'Nueva Cuenta Bancaria' }
      },
      { 
        path: 'cuentas-bancarias-empresa/:id', 
        name: 'cuenta_bancaria_editar', 
        component: () => import('../views/restaurante/CuentaBancaria/CuentaBancariaFormView.vue'),
        meta: { role: 'admin', title: 'Editar Cuenta Bancaria' }
      },
      { 
        path: 'cuentas-bancarias-empresa/:id/detalle', 
        name: 'cuenta_bancaria_detalle', 
        component: () => import('../views/restaurante/CuentaBancaria/CuentaBancariaDetalleView.vue'),
        meta: { role: 'admin', title: 'Detalle de Cuenta Bancaria' }
      },

      // ============================================
      // AUDITORÍA DE CAJA
      // ============================================
      { 
        path: 'auditoria-caja', 
        name: 'auditoria_caja', 
        component: () => import('../views/restaurante/AuditoriaCaja/AuditoriaCajaView.vue'),
        meta: { title: 'Auditoría de Caja' }
      },
      { 
        path: 'auditoria-caja/abrir', 
        name: 'auditoria_caja_abrir', 
        component: () => import('../views/restaurante/AuditoriaCaja/AuditoriaCajaAbrirView.vue'),
        meta: { title: 'Abrir Caja' }
      },
      { 
        path: 'auditoria-caja/:id', 
        name: 'auditoria_caja_detalle', 
        component: () => import('../views/restaurante/AuditoriaCaja/AuditoriaCajaDetalleView.vue'),
        meta: { title: 'Detalle de Auditoría' }
      },

      // ============================================
      // PROMOCIONES
      // ============================================
      { 
        path: 'promociones', 
        name: 'promociones', 
        component: () => import('../views/restaurante/Promocion/PromocionView.vue'),
        meta: { title: 'Promociones' }
      },
      { 
        path: 'promociones/nuevo', 
        name: 'promocion_nuevo', 
        component: () => import('../views/restaurante/Promocion/PromocionFormView.vue'),
        meta: { title: 'Nueva Promoción' }
      },
      { 
        path: 'promociones/:id', 
        name: 'promocion_editar', 
        component: () => import('../views/restaurante/Promocion/PromocionFormView.vue'),
        meta: { title: 'Editar Promoción' }
      },

      // ============================================
      // REPORTES GUARDADOS
      // ============================================
      { 
        path: 'reportes-guardados', 
        name: 'reportes_guardados', 
        component: () => import('../views/restaurante/ReporteGuardado/ReporteGuardadoView.vue'),
        meta: { title: 'Reportes Guardados' }
      },

      // ============================================
      // CONFIGURACIÓN
      // ============================================
      { 
        path: 'configuracion/sede', 
        name: 'configuracion_sede', 
        component: () => import('../views/restaurante/Configuracion/ConfiguracionSedeView.vue'),
        meta: { role: 'admin', title: 'Configuración de Sede' }
      },
      { 
        path: 'configuracion/email', 
        name: 'configuracion_email', 
        component: () => import('../views/restaurante/Configuracion/ConfiguracionEmailView.vue'),
        meta: { role: 'admin', title: 'Configuración de Email' }
      },
      { 
        path: 'configuracion/whatsapp', 
        name: 'configuracion_whatsapp', 
        component: () => import('../views/restaurante/Configuracion/ConfiguracionWhatsappView.vue'),
        meta: { role: 'admin', title: 'Configuración de WhatsApp' }
      },

      // ============================================
      // LOGS
      // ============================================
      { 
        path: 'logs', 
        name: 'logs', 
        component: () => import('../views/AdminLogsView.vue'),
        meta: { role: 'admin', title: 'Bitácora de Actividad' }
      },

      // ============================================
      // CONFIGURACIÓN (usuario)
      // ============================================
      { 
        path: 'config', 
        name: 'config', 
        component: () => import('../views/restaurante/ConfigView.vue'),
        meta: { title: 'Configuración' }
      }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ============================================
// GUARD DE NAVEGACIÓN
// ============================================
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  // Rutas públicas (login)
  if (to.meta.public) {
    if (to.name === 'login' && auth.isAuthenticated) {
      return next({ name: 'dashboard' })
    }
    return next()
  }

  // Verificar autenticación
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next({ name: 'login' })
  }

  // Verificar roles
  if (to.meta.role) {
    const userRol = (auth.user?.rol_nombre || auth.user?.rol || '').toLowerCase().trim()
    const requiredRol = to.meta.role.toLowerCase().trim()
    
    const adminRoles = ['super administrador', 'superadministrador', 'super_admin', 'superadmin', 'administrador', 'admin']
    const isAdmin = adminRoles.includes(userRol)
    
    if (isAdmin) {
      return next()
    }
    
    if (requiredRol === 'admin' && !isAdmin) {
      return next({ name: 'dashboard' })
    }
  }

  next()
})

export default router