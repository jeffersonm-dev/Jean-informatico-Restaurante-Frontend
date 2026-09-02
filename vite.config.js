// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  server: {
    port: 5173,
    proxy: {
      // En desarrollo, las llamadas a /api se redirigen al backend .NET Core
      '/api': {
        target: 'http://localhost:5218',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        // Dividir el bundle en chunks para mejorar la carga
        manualChunks: {
          vendor: ['vue', 'vue-router', 'axios'],
          ui: ['sweetalert2']  // ✅ Eliminar bootstrap-icons
        }
      }
    },
    // Terser options para mejor optimización
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  
  // Configuración para producción (Render)
  base: '/',
  
  // Definir variables de entorno disponibles en el cliente
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0')
  }
})