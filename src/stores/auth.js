// stores/auth.js
import { defineStore } from 'pinia'
import { AuthAPI } from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('lc_token') || null,
    user: JSON.parse(localStorage.getItem('lc_user') || 'null'),
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    
    isAdmin: (state) => {
      return state.user?.rol_id === 1 || 
             state.user?.rol_nombre?.toLowerCase() === 'administrador' ||
             state.user?.rol_nombre?.toLowerCase() === 'admin'
    },
    
    isSupervisor: (state) => {
      return state.user?.rol_id === 2 ||
             state.user?.rol_nombre?.toLowerCase() === 'supervisor'
    },
    
    isGerente: (state) => {
      return state.user?.rol_id === 8 ||
             state.user?.rol_nombre?.toLowerCase() === 'gerente'
    },
    
    isCajero: (state) => {
      return state.user?.rol_id === 4 ||
             state.user?.rol_nombre?.toLowerCase() === 'cajero'
    },
    
    isMesero: (state) => {
      return state.user?.rol_id === 5 ||
             state.user?.rol_nombre?.toLowerCase() === 'mesero'
    },
    
    isCocinero: (state) => {
      return state.user?.rol_id === 6 ||
             state.user?.rol_nombre?.toLowerCase() === 'cocinero'
    },
    
    isDelivery: (state) => {
      return state.user?.rol_id === 9 ||
             state.user?.rol_nombre?.toLowerCase() === 'delivery'
    },
    
    isCliente: (state) => {
      return state.user?.rol_id === 7 ||
             state.user?.rol_nombre?.toLowerCase() === 'cliente'
    },
    
    isSuperAdmin: (state) => {
      return state.user?.rol_id === 3 ||
             state.user?.rol_nombre?.toLowerCase() === 'super administrador' ||
             state.user?.rol_nombre?.toLowerCase() === 'superadmin'
    },
    
    isAdminLevel: (state) => {
      const rolId = state.user?.rol_id
      return rolId === 1 || rolId === 3 || rolId === 8
    },
    
    sedeId: (state) => {
      return state.user?.sede_id || null
    },
    
    sedeNombre: (state) => {
      return state.user?.sede_nombre || null
    },
    
    sedesDisponibles: (state) => {
      return state.user?.sedes || []
    },
    
    sedePrincipal: (state) => {
      return state.user?.sede_principal || state.user?.sede_id || null
    },
    
    userName: (state) => {
      if (!state.user) return 'Usuario'
      return `${state.user.nombre || ''} ${state.user.apellido || ''}`.trim() || 
             state.user.email || 
             'Usuario'
    },
    
    userRol: (state) => {
      return state.user?.rol_nombre || null
    },
    
    userRolId: (state) => {
      return state.user?.rol_id || null
    },
    
    userEmail: (state) => {
      return state.user?.email || null
    },
    
    userTelefono: (state) => {
      return state.user?.telefono || null
    },
    
    userCedula: (state) => {
      return state.user?.cedula || null
    },
    
    isVerified: (state) => {
      return state.user?.verificado === true
    },
    
    isActive: (state) => {
      return state.user?.activo === true
    }
  },

  actions: {
    // ═══════════════════════════════════════════════════════════
    // LOGIN - Con la estructura REAL de tu API
    // ═══════════════════════════════════════════════════════════
    async login(email, password) {
      this.loading = true
      this.error = null
      
      try {
        const response = await AuthAPI.login(email, password)
        const data = response.data
        
        console.log('📥 Respuesta del login:', data)
        
        // ⭐ Tu API devuelve: { success: true, data: { id, nombre, email, token, usuario: {...} } }
        if (data.success && data.data) {
          const loginData = data.data
          
          // ⭐ El token está en el nivel principal de data
          this.token = loginData.token
          
          // ⭐ Los datos del usuario están en loginData.usuario
          const userData = loginData.usuario || loginData
          
          // ⭐ Construir el objeto usuario
          this.user = {
            id: userData.id,
            nombre: userData.nombre,
            apellido: userData.apellido,
            email: userData.email,
            telefono: userData.telefono,
            cedula: userData.cedula,
            direccion: userData.direccion,
            avatar_url: userData.avatar_url,
            verificado: userData.verificado,
            activo: userData.activo,
            intentos_fallidos: userData.intentos_fallidos || 0,
            fecha_creacion: userData.fecha_creacion,
            ultimo_acceso: userData.ultimo_acceso,
            notificaciones_email: userData.notificaciones_email,
            notificaciones_whatsapp: userData.notificaciones_whatsapp,
            total_sesiones: userData.total_sesiones || 0,
            total_logs: userData.total_logs || 0,
            
            // ⭐ Rol
            rol_id: userData.rol_id,
            rol_nombre: userData.rol_nombre,
            rol: userData.rol_nombre, // ← Para compatibilidad
            
            // ⭐ Sede
            sede_id: userData.sede_id,
            sede_nombre: userData.sede_nombre,
            sede: userData.sede_nombre, // ← Para compatibilidad
            
            // ⭐ Token
            token: loginData.token,
            token_expiracion: loginData.token_expiracion,
            
            // ⭐ Sedes (si tu API las devuelve)
            sedes: userData.sedes || [],
            sede_principal: userData.sede_principal || userData.sede_id
          }
          
          // Guardar en localStorage
          localStorage.setItem('lc_token', loginData.token)
          localStorage.setItem('lc_user', JSON.stringify(this.user))
          
          console.log('✅ Usuario autenticado:', this.user)
          console.log('✅ Rol:', this.user.rol_nombre)
          console.log('✅ Sede:', this.user.sede_nombre)
          
          return data
        } else {
          throw new Error(data.message || 'Error al iniciar sesión')
        }
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Correo o contraseña incorrectos'
        console.error('❌ Error de login:', this.error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // ═══════════════════════════════════════════════════════════
    // CHANGE PASSWORD
    // ═══════════════════════════════════════════════════════════
    async changePassword(currentPassword, newPassword) {
      if (!this.user?.id) throw new Error('Usuario no autenticado')
      
      try {
        const { data } = await AuthAPI.changePassword(
          this.user.id,
          currentPassword,
          newPassword
        )
        return data
      } catch (error) {
        throw error.response?.data || { success: false, message: 'Error al cambiar contraseña' }
      }
    },

    // ═══════════════════════════════════════════════════════════
    // FETCH USER - Actualizar datos del usuario
    // ═══════════════════════════════════════════════════════════
    async fetchUser() {
      try {
        const { data } = await AuthAPI.getMe()
        if (data && data.data) {
          const userData = data.data
          
          this.user = {
            ...this.user,
            ...userData,
            rol: userData.rol_nombre || userData.rol || this.user?.rol,
            sede: userData.sede_nombre || userData.sede || this.user?.sede
          }
          localStorage.setItem('lc_user', JSON.stringify(this.user))
        }
        return data
      } catch (error) {
        console.error('❌ Error fetching user:', error)
        throw error
      }
    },

    // ═══════════════════════════════════════════════════════════
    // LOGOUT
    // ═══════════════════════════════════════════════════════════
    async logout() {
      try {
        if (this.token) {
          await AuthAPI.logout(this.token)
        }
      } catch (error) {
        console.warn('⚠️ Error al cerrar sesión:', error)
      } finally {
        this.token = null
        this.user = null
        this.error = null
        localStorage.removeItem('lc_token')
        localStorage.removeItem('lc_user')
        console.log('👋 Usuario cerró sesión')
      }
    },

    // ═══════════════════════════════════════════════════════════
    // ⭐ ACTUALIZAR SEDES
    // ═══════════════════════════════════════════════════════════
    async updateSedes(sedesList) {
      if (this.user) {
        this.user.sedes = sedesList
        if (sedesList.length === 1 && !this.user.sede_principal) {
          this.user.sede_principal = sedesList[0].id
          this.user.sede_id = sedesList[0].id
          this.user.sede_nombre = sedesList[0].nombre
          this.user.sede = sedesList[0].nombre
        }
        localStorage.setItem('lc_user', JSON.stringify(this.user))
      }
    },

    // ═══════════════════════════════════════════════════════════
    // ⭐ SELECCIONAR SEDE PRINCIPAL
    // ═══════════════════════════════════════════════════════════
    setSedePrincipal(sedeId) {
      if (this.user && this.user.sedes) {
        const sede = this.user.sedes.find(s => s.id === sedeId)
        if (sede) {
          this.user.sede_principal = sedeId
          this.user.sede_id = sedeId
          this.user.sede_nombre = sede.nombre
          this.user.sede = sede.nombre
          localStorage.setItem('lc_user', JSON.stringify(this.user))
          return true
        }
      }
      return false
    },

    // ═══════════════════════════════════════════════════════════
    // ⭐ ACTUALIZAR PERFIL
    // ═══════════════════════════════════════════════════════════
    updateUserProfile(data) {
      if (this.user) {
        this.user = {
          ...this.user,
          ...data,
          rol: data.rol_nombre || data.rol || this.user?.rol,
          sede: data.sede_nombre || data.sede || this.user?.sede
        }
        localStorage.setItem('lc_user', JSON.stringify(this.user))
      }
    }
  }
})