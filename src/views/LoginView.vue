<template>
  <div id="loginScreen">
    <div class="login-container">
      <!-- Background decorations -->
      <div class="bg-decoration">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
        <div class="circle circle-4"></div>
      </div>

      <div class="login-card">
        <!-- Brand -->
        <div class="brand">
          <div class="brand-icon">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <!-- Plato / Restaurante logo -->
              <circle cx="28" cy="28" r="24" fill="#E85D3A" opacity="0.1"/>
              <circle cx="28" cy="28" r="22" stroke="#E85D3A" stroke-width="1.5" opacity="0.3"/>
              
              <!-- Tenedor -->
              <path d="M18 14v12M18 14l-2-4M18 14l2-4M18 22v8" stroke="#E85D3A" stroke-width="2.5" stroke-linecap="round"/>
              
              <!-- Cuchillo -->
              <path d="M38 14v16M38 14l2-4M38 14l-2-4M38 26v6" stroke="#E85D3A" stroke-width="2.5" stroke-linecap="round"/>
              
              <!-- Plato -->
              <ellipse cx="28" cy="32" rx="14" ry="4" stroke="#E85D3A" stroke-width="2"/>
              
              <!-- Estrella Michelin -->
              <circle cx="28" cy="28" r="3" fill="#E85D3A" opacity="0.2"/>
              <circle cx="28" cy="28" r="1.5" fill="#E85D3A"/>
            </svg>
          </div>
          <div>
            <div class="brand-name">
              <span class="a1">Restaurante</span>
              <span class="a2">Gourmet</span>
            </div>
            <div class="brand-tag">
              <i class="fas fa-utensils"></i>
              Sistema de Gestión Gastronómica
            </div>
          </div>
        </div>

        <!-- Header -->
        <div class="auth-header">
          <h1>
            <i class="fas fa-sign-in-alt"></i>
            Bienvenido
          </h1>
          <p class="sub">Ingresa tus credenciales para acceder al sistema</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="onSubmit" class="auth-form">
          <div class="field">
            <label>
              <i class="fas fa-envelope"></i>
              Correo Electrónico
            </label>
            <div class="input-wrapper">
              <i class="fas fa-envelope input-icon"></i>
              <input
                type="email"
                v-model="email"
                autocomplete="email"
                placeholder="ejemplo@restaurante.com"
                required
              />
            </div>
          </div>

          <div class="field">
            <label>
              <i class="fas fa-lock"></i>
              Contraseña
            </label>
            <div class="input-wrapper">
              <i class="fas fa-lock input-icon"></i>
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                autocomplete="current-password"
                placeholder="Ingresa tu contraseña"
                required
              />
              <button
                type="button"
                class="toggle-password"
                @click="showPassword = !showPassword"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" v-model="rememberMe" />
              <span class="checkmark"></span>
              Recordarme
            </label>
            <a href="#" class="forgot-link" @click.prevent="showForgotPassword">
              <i class="fas fa-question-circle"></i>
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button type="submit" class="btn btn-primary" :disabled="loading">
            <i v-if="!loading" class="fas fa-arrow-right-to-bracket"></i>
            <span v-if="!loading">Entrar al sistema</span>
            <span v-else class="spinner">
              <i class="fas fa-spinner fa-spin"></i>
              Ingresando…
            </span>
          </button>
        </form>

        <!-- Footer -->
        <div class="auth-footer">
          <p>
            <i class="fas fa-shield-alt"></i>
            Sistema seguro · 2026
          </p>
          <p class="developer-credit">
            Desarrollado por 
            <span class="jean-text">
              <i class="fas fa-code"></i>
              Jean Informático C.A.
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'

const email = ref('')
const password = ref('')
const loading = ref(false)
const showPassword = ref(false)
const rememberMe = ref(false)

const auth = useAuthStore()
const router = useRouter()

async function onSubmit() {
  if (!email.value.trim() || !password.value) {
    await Swal.fire({
      icon: 'warning',
      title: 'Campos requeridos',
      text: 'Por favor, ingresa tu correo y contraseña.',
      confirmButtonColor: '#E85D3A',
      timer: 2000,
      timerProgressBar: true
    })
    return
  }

  loading.value = true

  try {
    await auth.login(email.value.trim(), password.value)
    
    // Redirigir INMEDIATAMENTE sin esperar alertas
    router.push({ name: 'dashboard' })
    
    // Mostrar toast rápido
    Swal.fire({
      icon: 'success',
      title: '¡Bienvenido al Restaurante Gourmet!',
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
      timerProgressBar: true
    })
    
  } catch (error) {
    const errorMsg = error?.response?.data?.message || 'Correo o contraseña incorrectos.'
    
    await Swal.fire({
      icon: 'error',
      title: 'Error de autenticación',
      text: errorMsg,
      confirmButtonColor: '#E85D3A',
      confirmButtonText: 'Intentar de nuevo'
    })
  } finally {
    loading.value = false
  }
}

function showForgotPassword() {
  Swal.fire({
    icon: 'info',
    title: 'Recuperar contraseña',
    text: 'Contacta al administrador del sistema para restablecer tu contraseña.',
    confirmButtonColor: '#E85D3A',
    confirmButtonText: 'Entendido'
  })
}
</script>

<style scoped>
/* ============================================
   FONTS - Font Awesome
   ============================================ */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

/* ============================================
   BASE
   ============================================ */
#loginScreen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a0f0a, #2d1810, #1a0f0a);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* ============================================
   BACKGROUND DECORATIONS
   ============================================ */
.bg-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.05;
}

.circle-1 {
  width: 500px;
  height: 500px;
  background: #E85D3A;
  top: -200px;
  right: -200px;
}

.circle-2 {
  width: 400px;
  height: 400px;
  background: #F4A261;
  bottom: -150px;
  left: -150px;
}

.circle-3 {
  width: 200px;
  height: 200px;
  background: #E76F51;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.circle-4 {
  width: 300px;
  height: 300px;
  background: #F4A261;
  top: 20%;
  right: 10%;
  opacity: 0.03;
}

/* ============================================
   CONTAINER
   ============================================ */
.login-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 440px;
}

/* ============================================
   LOGIN CARD
   ============================================ */
.login-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px 36px;
  box-shadow: 
    0 25px 60px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(232, 93, 58, 0.1);
  animation: fadeInUp 0.5s ease-out;
  border: 1px solid rgba(232, 93, 58, 0.1);
}

/* ============================================
   BRAND
   ============================================ */
.brand {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.brand-icon {
  flex-shrink: 0;
  filter: drop-shadow(0 2px 8px rgba(232, 93, 58, 0.2));
}

.brand-name {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
}

.brand-name .a1 { 
  color: #2d1810; 
  font-weight: 300;
}

.brand-name .a2 { 
  color: #E85D3A; 
  font-weight: 700;
  background: linear-gradient(135deg, #E85D3A, #F4A261);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-tag {
  font-size: 11px;
  color: #6b7280;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.brand-tag i {
  color: #E85D3A;
  font-size: 10px;
}

/* ============================================
   AUTH HEADER
   ============================================ */
.auth-header {
  margin-bottom: 28px;
}

.auth-header h1 {
  font-size: 26px;
  font-weight: 700;
  margin: 0 0 6px 0;
  color: #2d1810;
  display: flex;
  align-items: center;
  gap: 10px;
}

.auth-header h1 i {
  color: #E85D3A;
  font-size: 22px;
}

.sub {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
}

/* ============================================
   FORM
   ============================================ */
.auth-form .field {
  margin-bottom: 18px;
}

.auth-form label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}

.auth-form label i {
  color: #E85D3A;
  font-size: 12px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  color: #9ca3af;
  font-size: 14px;
  transition: color 0.2s;
}

.input-wrapper input {
  width: 100%;
  padding: 12px 14px 12px 38px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.25s ease;
  background: #f8fafc;
  color: #1a1a2e;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #E85D3A;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(232, 93, 58, 0.1);
}

/* Toggle password */
.toggle-password {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  transition: color 0.2s;
}

.toggle-password:hover {
  color: #374151;
}

/* ============================================
   FORM OPTIONS
   ============================================ */
.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #4b5563;
  cursor: pointer;
  user-select: none;
}

.remember-me input {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  position: relative;
  transition: all 0.2s;
  flex-shrink: 0;
}

.remember-me input:checked + .checkmark {
  background: #E85D3A;
  border-color: #E85D3A;
}

.remember-me input:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.forgot-link {
  font-size: 13px;
  color: #E85D3A;
  text-decoration: none;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
}

.forgot-link:hover {
  color: #c94f2e;
  text-decoration: underline;
}

/* ============================================
   BUTTON
   ============================================ */
.btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-primary {
  background: linear-gradient(135deg, #E85D3A, #c94f2e);
  color: #fff;
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.15));
  transform: translateX(-100%);
  transition: transform 0.5s;
}

.btn-primary:hover:not(:disabled)::before {
  transform: translateX(100%);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(232, 93, 58, 0.4);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-primary i {
  font-size: 16px;
}

.spinner i {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ============================================
   FOOTER
   ============================================ */
.auth-footer {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f0ecea;
  text-align: center;
}

.auth-footer p {
  color: #6b7280;
  font-size: 12px;
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.auth-footer i {
  color: #E85D3A;
}

.developer-credit {
  font-size: 11px !important;
  color: #9ca3af !important;
  margin-top: 4px !important;
}

.jean-text {
  color: #E85D3A;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.jean-text i {
  color: #E85D3A !important;
  font-size: 10px !important;
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 480px) {
  .login-card {
    padding: 28px 20px;
  }

  .brand-name {
    font-size: 20px;
  }

  .auth-header h1 {
    font-size: 22px;
  }
}

/* ============================================
   ANIMATIONS
   ============================================ */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>