<!-- src/views/BienvenidaView.vue -->
<template>
  <div class="welcome-container">
    <div class="welcome-banner">
      <div class="banner-container">
        <!-- Contenido principal -->
        <div class="content-wrapper">
          <!-- Mensaje de bienvenida -->
          <div class="welcome-message">
            <h1 class="main-title">¡Bienvenido!</h1>
            <p class="date-text">
              <i class="bi bi-calendar-check"></i>
              {{ currentDate }}
            </p>
          </div>

          <!-- Logo JJ -->
          <div class="logo-section">
            <img
              v-if="!logoError"
              class="logo-large"
              src="@/assets/jj.png"
              alt="System JJ"
              @error="handleLogoError"
            />
            <span v-else class="logo-fallback-large">SJ</span>
          </div>

          <!-- Cita inspiradora -->
          <div class="quote-section">
            <i class="bi bi-quote quote-icon"></i>
            <p class="quote-text">{{ inspirationalQuote }}</p>
          </div>

          <!-- Botón de catálogo -->
          <button @click="irCatalogoProductos" class="catalog-button">
            <i class="bi bi-box-seam"></i>
            <span class="btn-text">Ver Catálogo</span>
            <i class="bi bi-box-arrow-up-right"></i>
          </button>
        </div>

        <!-- Footer con créditos -->
        <div class="footer-credits">
          <div class="credits-content">
            <!-- System JJ -->
            <a 
              href="https://www.jeaninformatico.com/servicio/sistemas" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="brand-link"
            >
              <span class="brand-name">
                <span class="brand-highlight">System</span> JJ
              </span>
            </a>

            <span class="brand-separator">•</span>

            <!-- Jean Informático C.A. -->
            <a 
              href="https://www.jeaninformatico.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="brand-link"
            >
              <span class="brand-name">
                <span class="brand-highlight">Jean</span> Informático C.A.
              </span>
            </a>

            <span class="brand-separator">•</span>
            <span class="brand-year">{{ currentYear }}</span>

            <span class="brand-separator">•</span>

            <!-- Desarrolladores -->
            <div class="developers-section">
              <i class="bi bi-code-square dev-icon"></i>
              <span class="dev-label">Dev</span>
              <span class="dev-name jean">Jean C.R.</span>
              <span class="dev-separator">&</span>
              <span class="dev-name jefferson">Jefferson M.</span>
            </div>

            <!-- Badge de versión -->
            <span class="version-badge">
              <span class="version-text">v2.0</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const logoError = ref(false)

const currentDate = computed(() => {
  try {
    const now = new Date()
    return now.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return 'Fecha no disponible'
  }
})

const currentYear = computed(() => new Date().getFullYear())

const quotes = [
  'El éxito es la suma de pequeños esfuerzos repetidos día tras día',
  'La calidad no es un acto, es un hábito',
  'El mejor momento para empezar es ahora',
  'La excelencia no es una habilidad, es una actitud'
]

const inspirationalQuote = computed(() => {
  const index = Math.floor(Math.random() * quotes.length)
  return quotes[index]
})

const handleLogoError = () => {
  logoError.value = true
}

const irCatalogoProductos = () => {
  router.push({ name: 'productos' })
}
</script>

<style scoped>
/* ============================================
   BASE
   ============================================ */
.welcome-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: #ffffff;
}

.welcome-banner {
  width: 100%;
  max-width: 820px;
  min-height: 75vh;
  background: #fafafa;
  border-radius: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.06);
  padding: 2rem 2rem;
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
}

.banner-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  min-height: 70vh;
}

/* ============================================
   CONTENT
   ============================================ */
.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
}

.welcome-message {
  text-align: center;
}

.main-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: #1a1a2e;
  margin: 0;
}

.date-text {
  font-size: clamp(0.7rem, 1.5vw, 0.9rem);
  color: #6b7280;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
}

.date-text i {
  color: #E85D3A;
}

/* ============================================
   LOGO
   ============================================ */
.logo-section {
  display: flex;
  justify-content: center;
  padding: 0.2rem 0;
}

.logo-large {
  width: min(300px, 60vw);
  height: auto;
  max-width: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.logo-large:hover {
  transform: scale(1.02);
}

.logo-fallback-large {
  font-size: clamp(3.5rem, 10vw, 6rem);
  font-weight: 900;
  color: #E85D3A;
}

/* ============================================
   QUOTE
   ============================================ */
.quote-section {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  max-width: 500px;
  padding: 0 0.5rem;
}

.quote-icon {
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  color: #E85D3A;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.quote-text {
  font-size: clamp(0.75rem, 1.6vw, 0.9rem);
  color: #6b7280;
  font-style: italic;
  line-height: 1.4;
  margin: 0;
  text-align: center;
}

/* ============================================
   BUTTON
   ============================================ */
.catalog-button {
  background: #E85D3A;
  border: none;
  color: #fff;
  padding: 0.6rem 1.5rem;
  border-radius: 0.75rem;
  font-size: clamp(0.8rem, 1.6vw, 0.95rem);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(232, 93, 58, 0.25);
  margin-top: 0.2rem;
}

.catalog-button:hover {
  background: #c94f2e;
  transform: scale(1.04);
  box-shadow: 0 8px 25px rgba(232, 93, 58, 0.35);
}

.catalog-button i {
  font-size: clamp(0.9rem, 1.8vw, 1.1rem);
}

.catalog-button i:last-child {
  font-size: clamp(0.6rem, 1.2vw, 0.75rem);
  opacity: 0.7;
}

/* ============================================
   FOOTER
   ============================================ */
.footer-credits {
  margin-top: 0.8rem;
  padding-top: 0.8rem;
  border-top: 2px solid #f3f4f6;
  flex-shrink: 0;
}

.credits-content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.3rem 0.6rem;
  font-size: clamp(0.55rem, 1.2vw, 0.75rem);
}

/* ============================================
   BRAND
   ============================================ */
.brand-link {
  text-decoration: none;
  transition: opacity 0.3s ease;
}

.brand-link:hover {
  opacity: 0.8;
}

.brand-name {
  color: #6b7280;
  font-weight: 500;
}

.brand-highlight {
  color: #E85D3A;
  font-weight: 700;
}

.brand-separator {
  color: #d1d5db;
}

.brand-year {
  color: #9ca3af;
  font-weight: 300;
}

/* ============================================
   DEVELOPERS
   ============================================ */
.developers-section {
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.dev-icon {
  color: #E85D3A;
  font-size: clamp(0.6rem, 1.2vw, 0.8rem);
}

.dev-label {
  color: #9ca3af;
  font-size: clamp(0.5rem, 1vw, 0.65rem);
}

.dev-name {
  font-weight: 600;
  font-size: clamp(0.5rem, 1.1vw, 0.7rem);
  transition: color 0.3s ease;
}

.dev-name.jean {
  color: #E85D3A;
}

.dev-name.jean:hover {
  color: #c94f2e;
}

.dev-name.jefferson {
  color: #7c3aed;
}

.dev-name.jefferson:hover {
  color: #6d28d9;
}

.dev-separator {
  color: #d1d5db;
  font-size: clamp(0.5rem, 0.8vw, 0.6rem);
}

/* ============================================
   VERSION
   ============================================ */
.version-badge {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  padding: 0.05rem 0.4rem;
  border-radius: 0.4rem;
}

.version-text {
  color: #9ca3af;
  font-size: clamp(0.45rem, 1vw, 0.6rem);
  font-weight: 600;
  letter-spacing: 0.05em;
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 600px) {
  .welcome-banner {
    padding: 1.5rem 1.2rem;
    min-height: 80vh;
    border-radius: 1.2rem;
  }

  .banner-container {
    min-height: 75vh;
  }

  .logo-large {
    width: min(220px, 55vw);
  }

  .catalog-button {
    padding: 0.5rem 1.2rem;
  }

  .credits-content {
    gap: 0.2rem 0.4rem;
  }
}

@media (max-width: 420px) {
  .welcome-container {
    padding: 0.5rem;
  }

  .welcome-banner {
    padding: 1rem 0.8rem;
    min-height: 88vh;
    border-radius: 1rem;
    border: none;
    box-shadow: none;
  }

  .banner-container {
    min-height: 84vh;
  }

  .content-wrapper {
    gap: 0.4rem;
  }

  .main-title {
    font-size: 1.6rem;
  }

  .logo-large {
    width: min(160px, 50vw);
  }

  .logo-fallback-large {
    font-size: 2.8rem;
  }

  .quote-text {
    font-size: 0.7rem;
  }

  .catalog-button {
    padding: 0.4rem 1rem;
    font-size: 0.7rem;
    gap: 0.3rem;
  }

  .catalog-button i {
    font-size: 0.8rem;
  }

  .catalog-button i:last-child {
    font-size: 0.6rem;
  }

  .footer-credits {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
  }

  .credits-content {
    font-size: 0.5rem;
    gap: 0.15rem 0.3rem;
  }

  .brand-separator {
    font-size: 0.3rem;
  }

  .dev-name {
    font-size: 0.5rem;
  }

  .dev-label {
    font-size: 0.45rem;
  }

  .dev-icon {
    font-size: 0.5rem;
  }

  .version-text {
    font-size: 0.4rem;
  }
}

@media (max-width: 360px) {
  .welcome-banner {
    padding: 0.8rem 0.6rem;
    min-height: 92vh;
  }

  .main-title {
    font-size: 1.3rem;
  }

  .logo-large {
    width: min(120px, 45vw);
  }

  .catalog-button {
    padding: 0.3rem 0.8rem;
    font-size: 0.6rem;
  }

  .credits-content {
    font-size: 0.45rem;
  }
}

/* ============================================
   ANIMATION
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

.welcome-banner {
  animation: fadeInUp 0.5s ease-out;
}
</style>