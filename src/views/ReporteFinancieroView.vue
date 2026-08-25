<template>
  <div class="reporte-financiero">

    <!-- ════════════════════════════════════════════════════════════════
         HEADER
         ════════════════════════════════════════════════════════════════ -->
    <div class="panel-header">
      <div class="header-left">
        <div class="header-icon">
          <i class="bi bi-file-spreadsheet"></i>
        </div>
        <div>
          <h1 class="panel-title">📊 Reporte Financiero</h1>
          <p class="panel-sub">Gestión del reporte · {{ periodoLabel(periodoActual) }}</p>
        </div>
      </div>
      <div class="header-right">
        <!-- ─── SELECTOR DE EMPRESA PROFESIONAL (multiempresa) ─── -->
        <div
          v-if="empresasDisponibles.length > 0"
          class="empresa-selector"
          ref="empresaSelectorRef"
        >
          <button
            type="button"
            class="empresa-trigger"
            :class="{ 'is-open': mostrarDropdownEmpresa }"
            @click="toggleDropdownEmpresa"
          >
            <span class="empresa-avatar">{{ obtenerIniciales(empresaActivaNombre) }}</span>
            <span class="empresa-trigger-info">
              <span class="empresa-trigger-label">Empresa activa</span>
              <span class="empresa-trigger-name">{{ empresaActivaNombre }}</span>
            </span>
            <span class="empresa-trigger-badge">
              {{ empresasDisponibles.length }}
            </span>
            <i
              class="bi bi-chevron-down empresa-trigger-caret"
              :class="{ open: mostrarDropdownEmpresa }"
            ></i>
          </button>

          <transition name="fade-dropdown">
            <div v-if="mostrarDropdownEmpresa" class="empresa-dropdown">
              <div class="empresa-dropdown-header">
                <i class="bi bi-building"></i> 
                <span>Tus empresas</span>
                <span class="empresa-dropdown-count">{{ empresasDisponibles.length }}</span>
              </div>
              <button
                v-for="emp in empresasDisponibles"
                :key="emp.id"
                type="button"
                class="empresa-option"
                :class="{ active: emp.id === empresaActivaId }"
                @click="seleccionarEmpresa(emp)"
              >
                <span class="empresa-avatar sm">{{ obtenerIniciales(emp.nombre) }}</span>
                <span class="empresa-option-info">
                  <span class="empresa-option-name">{{ emp.nombre }}</span>
                  <span v-if="emp.rif" class="empresa-option-rif">{{ emp.rif }}</span>
                </span>
                <span v-if="emp.id === empresaActivaId" class="empresa-option-badge">Activa</span>
                <i v-if="emp.id === empresaActivaId" class="bi bi-check-circle-fill empresa-option-check"></i>
              </button>
            </div>
          </transition>
        </div>

        <div class="period-selector">
          <div class="select-wrapper">
            <i class="bi bi-calendar3"></i>
            <select v-model="mesSeleccionado" @change="cambiarPeriodo">
              <option v-for="(m, i) in meses" :key="i" :value="i + 1">{{ m }}</option>
            </select>
          </div>
          <div class="select-wrapper">
            <i class="bi bi-calendar"></i>
            <select v-model="anioSeleccionado" @change="cambiarPeriodo">
              <option v-for="a in años" :key="a" :value="a">{{ a }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- ════════════════════════════════════════════════════════════════
         SIN EMPRESA ASIGNADA
         ════════════════════════════════════════════════════════════════ -->
    <div v-if="empresasDisponibles.length === 0" class="empty-state-card">
      <div class="empty-state-content">
        <div class="empty-icon">
          <i class="bi bi-building-x"></i>
        </div>
        <h3>Sin empresa asignada</h3>
        <p>Tu usuario no tiene ninguna empresa asociada. Contacta al administrador para que te asigne una.</p>
      </div>
    </div>

    <template v-else>
      <!-- ════════════════════════════════════════════════════════════════
           EMPTY STATE
           ════════════════════════════════════════════════════════════════ -->
      <div v-if="!reporte?.id && !cargando" class="empty-state-card">
        <div class="empty-state-content">
          <div class="empty-icon">
            <i class="bi bi-file-earmark-plus"></i>
          </div>
          <h3>Aún no has creado un reporte</h3>
          <p>Sube un archivo <strong>Excel</strong> para extraer los datos automáticamente,<br>o un <strong>PDF</strong> como evidencia documental.</p>
          <div class="empty-actions">
            <button class="btn btn-primary btn-lg" @click="seleccionarArchivo('excel')">
              <i class="bi bi-file-earmark-excel"></i> Subir Excel
            </button>
            <button class="btn btn-outline-secondary btn-lg" @click="seleccionarArchivo('pdf')">
              <i class="bi bi-file-earmark-pdf"></i> Subir PDF
            </button>
          </div>
        </div>
      </div>

      <!-- ════════════════════════════════════════════════════════════════
           NOTA DEL ADMINISTRADOR
           ════════════════════════════════════════════════════════════════ -->
      <div v-if="reporte?.notas_admin && (reporte?.status === 'rechazado' || reporte?.status === 'borrador')" class="admin-note">
        <div class="admin-note-icon">
          <i class="bi bi-exclamation-triangle-fill"></i>
        </div>
        <div class="admin-note-content">
          <strong>El administrador devolvió este reporte:</strong>
          <p>{{ reporte.notas_admin }}</p>
        </div>
      </div>

      <!-- ════════════════════════════════════════════════════════════════
           STATUS BAR
           ════════════════════════════════════════════════════════════════ -->
      <div class="status-bar" :class="reporte?.status || 'borrador'">
        <div class="status-left">
          <div class="status-badge">
            <span class="status-dot" :class="reporte?.status || 'borrador'"></span>
            <span class="status-label">{{ getStatusLabel(reporte?.status) }}</span>
          </div>
          <div class="status-divider"></div>
          <div class="status-meta">
            <span v-if="reporte?.cargado_por">
              <i class="bi bi-person"></i>
              <strong>{{ reporte.cargado_por }}</strong>
              <span v-if="reporte?.cargado_fecha"> · {{ formatDate(reporte.cargado_fecha) }}</span>
            </span>
            <span v-else-if="reporte?.validado_por">
              <i class="bi bi-check-circle"></i>
              Validado por <strong>{{ reporte.validado_por }}</strong>
              <span v-if="reporte?.validado_fecha"> · {{ formatDate(reporte.validado_fecha) }}</span>
            </span>
            <span v-else class="text-muted">
              <i class="bi bi-clock"></i> Sin cargar aún
            </span>
          </div>
        </div>
        <div class="status-right">
          <button
            v-if="reporte?.status === 'borrador' && archivos.length > 0 && tieneDatosReales"
            class="btn btn-success"
            @click="cargarReporte"
          >
            <i class="bi bi-cloud-arrow-up"></i> Cargar para validación
          </button>
          <button
            v-if="reporte?.status === 'cargado'"
            class="btn btn-warning"
            @click="reabrirReporte"
          >
            <i class="bi bi-arrow-counterclockwise"></i> Reabrir para editar
          </button>
          <button
            v-if="reporte?.status === 'borrador' || reporte?.status === 'rechazado'"
            class="btn btn-danger"
            @click="eliminarReporte"
          >
            <i class="bi bi-trash3"></i> Eliminar reporte
          </button>
          <button
            v-if="reporte?.status === 'cargado' && isAdmin"
            class="btn btn-danger-outline"
            @click="forzarReapertura"
          >
            <i class="bi bi-unlock"></i> Forzar edición
          </button>
          <span v-if="reporte?.status === 'validado'" class="status-validado">
            <i class="bi bi-check-circle-fill"></i> Validado
          </span>
        </div>
      </div>

      <!-- ════════════════════════════════════════════════════════════════
           CONTENIDO PRINCIPAL
           ════════════════════════════════════════════════════════════════ -->
      <div class="content-grid">
        <!-- ─── COLUMNA IZQUIERDA: ARCHIVOS ─── -->
        <div class="col-left">
          <div class="card">
            <div class="card-header">
              <div class="card-header-left">
                <i class="bi bi-folder2-open"></i>
                <h3>Evidencia del Reporte</h3>
              </div>
              <span class="badge-archivos">{{ archivos.length }} / {{ MAX_ARCHIVOS }}</span>
            </div>
            <div class="card-subtitle">
              <span class="badge-excel"><i class="bi bi-file-earmark-excel"></i> Excel → Datos automáticos</span>
              <span class="badge-pdf"><i class="bi bi-file-earmark-pdf"></i> PDF → Soporte documental</span>
            </div>

            <div class="upload-actions">
              <button
                v-if="puedeSubirArchivos && archivos.length < MAX_ARCHIVOS"
                class="btn btn-primary btn-upload"
                @click="seleccionarArchivo('excel')"
                :disabled="cargando"
              >
                <i class="bi bi-file-earmark-excel"></i>
                <span>Subir Excel</span>
              </button>
              <button
                v-if="puedeSubirArchivos && archivos.length < MAX_ARCHIVOS"
                class="btn btn-pdf btn-upload"
                @click="seleccionarArchivo('pdf')"
                :disabled="cargando"
              >
                <i class="bi bi-file-earmark-pdf"></i>
                <span>Subir PDF</span>
              </button>
            </div>

            <div v-if="reporte?.status === 'cargado'" class="status-info status-info-warning">
              <i class="bi bi-clock-history"></i>
              <p><strong>Reporte en revisión.</strong> Puedes <strong>reabrir</strong> el reporte para editarlo.</p>
            </div>
            <div v-else-if="reporte?.status === 'validado'" class="status-info status-info-success">
              <i class="bi bi-check-circle-fill"></i>
              <p>Este reporte ya fue <strong>validado</strong>. No se puede modificar.</p>
            </div>
            <div v-else-if="reporte?.status === 'rechazado'" class="status-info status-info-danger">
              <i class="bi bi-x-circle-fill"></i>
              <p>Este reporte fue <strong>rechazado</strong>. Debes corregirlo y volver a cargarlo.</p>
            </div>

            <div v-if="archivos.length > 0" class="file-list">
              <div v-if="archivosExcel.length > 0" class="file-section">
                <div class="file-section-label">
                  <i class="bi bi-file-earmark-excel"></i> Excel <span class="file-count">{{ archivosExcel.length }}</span>
                </div>
                <div v-for="archivo in archivosExcel" :key="archivo.id" class="file-item">
                  <div class="file-item-icon excel">
                    <i class="bi bi-file-earmark-excel"></i>
                  </div>
                  <div class="file-item-info">
                    <div class="file-item-name">
                      {{ archivo.nombre_original }}
                      <span v-if="archivo.es_principal" class="badge-principal">Principal</span>
                      <span class="badge-version">v{{ archivo.version || 1 }}</span>
                    </div>
                    <div class="file-item-meta">
                      {{ formatBytes(archivo.tamano_bytes) }} · {{ formatDate(archivo.subido_fecha) }}
                      <span v-if="archivo.total_datos_extraidos > 0" class="badge-datos-extraidos">
                        📊 {{ archivo.total_datos_extraidos }} datos
                      </span>
                    </div>
                  </div>
                  <div class="file-item-actions">
                    <button class="btn btn-ghost btn-icon" @click="descargarArchivo(archivo.id)" title="Descargar">
                      <i class="bi bi-download"></i>
                    </button>
                    <button
                      v-if="puedeEliminarArchivos"
                      class="btn btn-danger btn-icon"
                      @click="quitarArchivo(archivo.id)"
                      title="Eliminar"
                    >
                      <i class="bi bi-trash3"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="archivosPDF.length > 0" class="file-section">
                <div class="file-section-label">
                  <i class="bi bi-file-earmark-pdf"></i> PDF <span class="file-count">{{ archivosPDF.length }}</span>
                </div>
                <div v-for="archivo in archivosPDF" :key="archivo.id" class="file-item pdf">
                  <div class="file-item-icon pdf">
                    <i class="bi bi-file-earmark-pdf"></i>
                  </div>
                  <div class="file-item-info">
                    <div class="file-item-name">
                      {{ archivo.nombre_original }}
                      <span class="badge-pdf-tag">PDF</span>
                    </div>
                    <div class="file-item-meta">
                      {{ formatBytes(archivo.tamano_bytes) }} · {{ formatDate(archivo.subido_fecha) }}
                    </div>
                  </div>
                  <div class="file-item-actions">
                    <button class="btn btn-ghost btn-icon" @click="descargarArchivo(archivo.id)" title="Descargar">
                      <i class="bi bi-download"></i>
                    </button>
                    <button
                      v-if="puedeEliminarArchivos"
                      class="btn btn-danger btn-icon"
                      @click="quitarArchivo(archivo.id)"
                      title="Eliminar"
                    >
                      <i class="bi bi-trash3"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="empty-files">
              <i class="bi bi-file-earmark-excel"></i>
              <p>No hay archivos subidos</p>
              <span>Sube un Excel o PDF como evidencia</span>
            </div>

            <div v-if="cargando" class="loading-state">
              <div class="spinner"></div>
              <p>{{ mensajeCarga }}</p>
            </div>
          </div>
        </div>

        <!-- ─── COLUMNA DERECHA: RESUMEN ─── -->
        <div class="col-right">
          <div class="card">
            <div class="card-header">
              <div class="card-header-left">
                <i class="bi bi-currency-dollar"></i>
                <h3>Resumen Financiero</h3>
              </div>
              <span v-if="tieneDatosReales" class="badge-datos">
                <i class="bi bi-check-circle-fill"></i> Datos extraídos
              </span>
              <span v-else class="badge-pendiente">
                <i class="bi bi-clock"></i> Sin datos
              </span>
            </div>

            <div class="edition-status" v-if="reporte?.status === 'borrador' || reporte?.status === 'rechazado'">
              <i class="bi bi-pencil-square"></i>
              <span>Los campos son <strong>editables</strong>. Puedes modificar los valores manualmente.</span>
            </div>
            <div class="edition-status warning" v-else-if="reporte?.status === 'cargado'">
              <i class="bi bi-clock-history"></i>
              <span>Reporte en revisión. Usa <strong>"Reabrir"</strong> para editar.</span>
            </div>
            <div class="edition-status locked" v-else-if="reporte?.status === 'validado'">
              <i class="bi bi-lock-fill"></i>
              <span>Reporte validado. <strong>No se puede modificar</strong>.</span>
            </div>

            <div class="summary-grid">
              <div class="field-group" :class="{ 'has-data': parseFloat(resumen.totalIngresos) > 0 }">
                <label><i class="bi bi-arrow-up-circle"></i> Total ingresos $</label>
                <div class="field-wrapper">
                  <input
                    type="number"
                    step="any"
                    v-model="resumen.totalIngresos"
                    :disabled="!puedeEditarCampos"
                    @input="guardarResumen"
                    placeholder="0.00"
                  />
                  <span v-if="parseFloat(resumen.totalIngresos) > 0" class="field-check">
                    <i class="bi bi-check-circle-fill"></i>
                  </span>
                </div>
              </div>

              <div class="field-group" :class="{ 'has-data': parseFloat(resumen.totalGastos) > 0 }">
                <label><i class="bi bi-arrow-down-circle"></i> Total gastos $</label>
                <div class="field-wrapper">
                  <input
                    type="number"
                    step="any"
                    v-model="resumen.totalGastos"
                    :disabled="!puedeEditarCampos"
                    @input="guardarResumen"
                    placeholder="0.00"
                  />
                  <span v-if="parseFloat(resumen.totalGastos) > 0" class="field-check">
                    <i class="bi bi-check-circle-fill"></i>
                  </span>
                </div>
              </div>

              <div class="field-group" :class="{ 'has-data': parseFloat(resumen.totalCostos) > 0 }">
                <label><i class="bi bi-tag"></i> Total costos $</label>
                <div class="field-wrapper">
                  <input
                    type="number"
                    step="any"
                    v-model="resumen.totalCostos"
                    :disabled="!puedeEditarCampos"
                    @input="guardarResumen"
                    placeholder="0.00"
                  />
                  <span v-if="parseFloat(resumen.totalCostos) > 0" class="field-check">
                    <i class="bi bi-check-circle-fill"></i>
                  </span>
                </div>
              </div>

              <div class="field-group" :class="{ 'has-data': parseFloat(resumen.saldoBancoCaja) > 0 }">
                <label><i class="bi bi-wallet2"></i> Saldo banco/caja $</label>
                <div class="field-wrapper">
                  <input
                    type="number"
                    step="any"
                    v-model="resumen.saldoBancoCaja"
                    :disabled="!puedeEditarCampos"
                    @input="guardarResumen"
                    placeholder="0.00"
                  />
                  <span v-if="parseFloat(resumen.saldoBancoCaja) > 0" class="field-check">
                    <i class="bi bi-check-circle-fill"></i>
                  </span>
                </div>
              </div>

              <div class="field-group" :class="{ 'has-data': parseFloat(resumen.cuentasCobrar) > 0 }">
                <label><i class="bi bi-receipt"></i> Cuentas por cobrar $</label>
                <div class="field-wrapper">
                  <input
                    type="number"
                    step="any"
                    v-model="resumen.cuentasCobrar"
                    :disabled="!puedeEditarCampos"
                    @input="guardarResumen"
                    placeholder="0.00"
                  />
                  <span v-if="parseFloat(resumen.cuentasCobrar) > 0" class="field-check">
                    <i class="bi bi-check-circle-fill"></i>
                  </span>
                </div>
              </div>

              <div class="field-group" :class="{ 'has-data': parseFloat(resumen.cuentasPagar) > 0 }">
                <label><i class="bi bi-receipt-cutoff"></i> Cuentas por pagar $</label>
                <div class="field-wrapper">
                  <input
                    type="number"
                    step="any"
                    v-model="resumen.cuentasPagar"
                    :disabled="!puedeEditarCampos"
                    @input="guardarResumen"
                    placeholder="0.00"
                  />
                  <span v-if="parseFloat(resumen.cuentasPagar) > 0" class="field-check">
                    <i class="bi bi-check-circle-fill"></i>
                  </span>
                </div>
              </div>

              <div class="field-group" :class="{ 'has-data': parseFloat(resumen.utilidadBruta) > 0 }">
                <label><i class="bi bi-graph-up"></i> Utilidad bruta $</label>
                <div class="field-wrapper">
                  <input
                    type="number"
                    step="any"
                    v-model="resumen.utilidadBruta"
                    :disabled="!puedeEditarCampos"
                    @input="guardarResumen"
                    placeholder="0.00"
                  />
                  <span v-if="parseFloat(resumen.utilidadBruta) > 0" class="field-check">
                    <i class="bi bi-check-circle-fill"></i>
                  </span>
                </div>
              </div>

              <div class="field-group" :class="{ 'has-data': parseFloat(resumen.utilidadDistribuir) > 0 }">
                <label><i class="bi bi-pie-chart"></i> Utilidad a distribuir $</label>
                <div class="field-wrapper">
                  <input
                    type="number"
                    step="any"
                    v-model="resumen.utilidadDistribuir"
                    :disabled="!puedeEditarCampos"
                    @input="guardarResumen"
                    placeholder="0.00"
                  />
                  <span v-if="parseFloat(resumen.utilidadDistribuir) > 0" class="field-check">
                    <i class="bi bi-check-circle-fill"></i>
                  </span>
                </div>
              </div>
            </div>

            <div class="flujo-neto">
              <div class="flujo-neto-label">
                <i class="bi bi-graph-up-arrow"></i>
                Flujo Neto del Período
                <span>(Ingresos - Gastos - Costos)</span>
              </div>
              <div class="flujo-neto-value" :class="flujoNeto >= 0 ? 'positive' : 'negative'">
                <span class="sign">{{ flujoNeto >= 0 ? '+' : '-' }}</span>
                $ {{ formatNumber(Math.abs(flujoNeto)) }}
                <span class="status-tag">{{ flujoNeto >= 0 ? 'Superávit' : 'Déficit' }}</span>
              </div>
            </div>

            <div class="action-buttons">
              <button
                v-if="reporte?.id"
                class="btn btn-primary btn-action"
                @click="guardarReporteManual"
                :disabled="guardando"
              >
                <i class="bi bi-save"></i>
                {{ guardando ? 'Guardando...' : '💾 Guardar Reporte' }}
              </button>
              <button
                v-if="reporte?.id"
                class="btn btn-outline-secondary btn-action"
                @click="recargarDatos"
                :disabled="cargando"
              >
                <i class="bi bi-arrow-clockwise"></i>
                🔄 Recargar
              </button>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-header-left">
                <i class="bi bi-pencil"></i>
                <h3>Notas para el administrador</h3>
              </div>
              <span v-if="notasEmpresa" class="badge-notas">
                <i class="bi bi-check-circle"></i> Con notas
              </span>
            </div>
            <div class="field-group">
              <div class="field-wrapper">
                <textarea
                  v-model="notasEmpresa"
                  placeholder="Ej. Incluye soporte de flete, se anexa comprobante..."
                  :disabled="!puedeEditarCampos"
                  @input="guardarNotas"
                  rows="4"
                ></textarea>
              </div>
            </div>
          </div>

          <div v-if="reporte?.status === 'validado'" class="status-card status-card-success">
            <div class="status-card-icon">
              <i class="bi bi-check-circle-fill"></i>
            </div>
            <div class="status-card-content">
              <h4>Reporte Validado</h4>
              <p>Este reporte fue aprobado por el administrador.</p>
            </div>
          </div>

          <div v-if="reporte?.status === 'rechazado'" class="status-card status-card-danger">
            <div class="status-card-icon">
              <i class="bi bi-x-circle-fill"></i>
            </div>
            <div class="status-card-content">
              <h4>Reporte Rechazado</h4>
              <p>Debes corregir los errores y volver a cargar el reporte.</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <input type="file" ref="fileInput" accept=".xlsx,.xls,.xlsm,.csv,.pdf" style="display: none" @change="onFileSelected">
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'
import { ReportesAPI, ArchivosAPI, EmpresasAPI } from '@/services/api'
import http from '@/services/http'

const auth = useAuthStore()

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const MAX_ARCHIVOS = 5
const LS_KEY_EMPRESA = 'empresa_activa_id'

const meses = MESES
const mesSeleccionado = ref(new Date().getMonth() + 1)
const anioSeleccionado = ref(new Date().getFullYear())
const reporte = ref(null)
const archivos = ref([])
const archivoPrincipal = ref(null)
const notasEmpresa = ref('')
const cargando = ref(false)
const guardando = ref(false)
const mensajeCarga = ref('')
const fileInput = ref(null)
const tieneDatosReales = ref(false)
const guardarTimeout = ref(null)
const tipoArchivoSeleccionado = ref('excel')
const empresasCargadas = ref(false)

const resumen = ref({
  totalIngresos: '',
  totalGastos: '',
  totalCostos: '',
  saldoBancoCaja: '',
  cuentasCobrar: '',
  cuentasPagar: '',
  utilidadBruta: '',
  utilidadDistribuir: ''
})

// ═══════════════════════════════════════════════════════════════════
// MULTI-EMPRESA - CARGA FORZADA DESDE API
// ═══════════════════════════════════════════════════════════════════
const empresaActivaId = ref(null)
const mostrarDropdownEmpresa = ref(false)
const empresaSelectorRef = ref(null)
const empresasDisponibles = ref([])

// ⭐ FUNCIÓN PARA CARGAR EMPRESAS DIRECTAMENTE DESDE EL ENDPOINT
async function cargarEmpresasDesdeAPI() {
  try {
    console.log('📥 Cargando empresas desde API...')
    const response = await http.get('/UsuariosEmpresa/usuario/' + auth.user?.id)
    const empresasData = response.data || []
    
    console.log('📊 Datos recibidos:', empresasData)
    
    if (empresasData.length > 0) {
      empresasDisponibles.value = empresasData.map(e => ({
        id: e.empresa_id,
        nombre: e.empresa_nombre,
        rif: e.empresa_rif || null
      }))
      
      console.log('✅ Empresas cargadas:', empresasDisponibles.value)
      empresasCargadas.value = true
      return true
    } else {
      console.warn('⚠️ No se encontraron empresas para el usuario')
      empresasDisponibles.value = []
      return false
    }
  } catch (error) {
    console.error('❌ Error cargando empresas desde API:', error)
    empresasDisponibles.value = []
    return false
  }
}

function obtenerIniciales(nombre) {
  if (!nombre) return '?'
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')
}

function inicializarEmpresaActiva() {
  const disponibles = empresasDisponibles.value

  console.log('🔄 Inicializando empresa activa...')
  console.log('📊 Empresas disponibles:', disponibles)

  if (disponibles.length === 0) {
    empresaActivaId.value = auth.empresaId || null
    return
  }

  // Intentar recuperar de localStorage
  let guardado = null
  try {
    const raw = localStorage.getItem(LS_KEY_EMPRESA)
    guardado = raw ? parseInt(raw, 10) : null
  } catch (e) {
    guardado = null
  }

  const existeGuardado = guardado && disponibles.some(e => e.id === guardado)

  if (existeGuardado) {
    empresaActivaId.value = guardado
    console.log('✅ Empresa restaurada desde localStorage:', guardado)
  } else {
    // Usar empresa_principal del usuario o la primera disponible
    const principal = auth.user?.empresa_principal || auth.user?.empresa_id
    const existePrincipal = principal && disponibles.some(e => e.id === principal)
    
    if (existePrincipal) {
      empresaActivaId.value = principal
      console.log('✅ Usando empresa principal:', principal)
    } else {
      empresaActivaId.value = disponibles[0].id
      console.log('✅ Usando primera empresa disponible:', empresaActivaId.value)
    }
    
    try { 
      localStorage.setItem(LS_KEY_EMPRESA, empresaActivaId.value.toString()) 
    } catch (e) {}
  }
}

function toggleDropdownEmpresa() {
  mostrarDropdownEmpresa.value = !mostrarDropdownEmpresa.value
}

function cerrarDropdownEmpresaSiFuera(event) {
  if (empresaSelectorRef.value && !empresaSelectorRef.value.contains(event.target)) {
    mostrarDropdownEmpresa.value = false
  }
}

function seleccionarEmpresa(emp) {
  const cambio = empresaActivaId.value !== emp.id
  empresaActivaId.value = emp.id
  try { localStorage.setItem(LS_KEY_EMPRESA, emp.id.toString()) } catch (e) {}
  mostrarDropdownEmpresa.value = false
  
  if (cambio) {
    console.log('🔄 Cambiando a empresa:', emp.nombre)
    reporte.value = null
    archivos.value = []
    archivoPrincipal.value = null
    tieneDatosReales.value = false
    cargarDatos()
  }
}

const empresaActivaNombre = computed(() => {
  const activa = empresasDisponibles.value.find(e => e.id === empresaActivaId.value)
  return activa?.nombre || auth.user?.empresa_nombre || auth.user?.empresa || 'Mi empresa'
})

const empresaNombre = computed(() => auth.user?.empresa_nombre || auth.user?.empresa || 'Mi empresa')
const periodoActual = computed(() => `${anioSeleccionado.value}-${String(mesSeleccionado.value).padStart(2, '0')}`)

const años = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)
})

const isAdmin = computed(() => {
  const rol = auth.user?.rol || auth.user?.rol_nombre || ''
  return rol.toLowerCase() === 'admin' || rol.toLowerCase() === 'administrador'
})

const flujoNeto = computed(() => {
  const ingresos = parseFloat(resumen.value.totalIngresos) || 0
  const gastos = parseFloat(resumen.value.totalGastos) || 0
  const costos = parseFloat(resumen.value.totalCostos) || 0
  return ingresos - gastos - costos
})

const puedeSubirArchivos = computed(() => {
  if (!reporte.value?.id) return true
  const status = reporte.value.status
  if (status === 'borrador' || status === 'rechazado') return true
  if (status === 'cargado') return true
  if (status === 'validado' && isAdmin.value) return true
  return false
})

const puedeEliminarArchivos = computed(() => {
  if (!reporte.value?.id) return true
  const status = reporte.value.status
  if (status === 'borrador' || status === 'rechazado') return true
  if (status === 'validado' && isAdmin.value) return true
  return false
})

// ⭐ ESTA ES LA SECCIÓN CORREGIDA
const puedeEditarCampos = computed(() => {
  if (!reporte.value?.id) return true
  const status = reporte.value.status
  if (status === 'borrador' || status === 'rechazado') return true
  if (status === 'cargado') return true
  if (status === 'validado' && isAdmin.value) return true
  return false
})

const archivosExcel = computed(() => archivos.value.filter(a => a.tipo_documento !== 'pdf_factura'))
const archivosPDF = computed(() => archivos.value.filter(a => a.tipo_documento === 'pdf_factura'))

function periodoLabel(p) {
  if (!p) return ''
  const [year, month] = p.split('-')
  const mesIndex = parseInt(month, 10) - 1
  return MESES[mesIndex] + ' ' + year
}

function getStatusLabel(status) {
  const map = { borrador: '📝 Borrador', cargado: '⏳ En revisión', validado: '✅ Validado', rechazado: '❌ Rechazado' }
  return map[status] || '📝 Borrador'
}

function formatBytes(bytes) {
  if (!bytes) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleString('es-VE')
}

function formatNumber(num) {
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// ═══════════════════════════════════════════════════════════════════
// FUNCIONES DE REPORTE (TODAS LAS DEMÁS FUNCIONES)
// ═══════════════════════════════════════════════════════════════════

async function verificarEmpresa() {
  try {
    const response = await EmpresasAPI.getById(empresaActivaId.value)
    console.log('✅ Empresa existe:', response.data)
    return true
  } catch (error) {
    console.log('⚠️ Error verificando empresa:', error)
    if (error.response?.status === 404) {
      Swal.fire({
        icon: 'error',
        title: 'Empresa no encontrada',
        text: 'Tu usuario no está asociado a una empresa válida. Contacta al administrador.',
        confirmButtonColor: '#2F6FED'
      })
    }
    return false
  }
}

async function crearReporte() {
  try {
    const empresaOk = await verificarEmpresa()
    if (!empresaOk) throw new Error('No se pudo verificar la empresa')

    const payload = {
      empresa_id: empresaActivaId.value,
      periodo: periodoActual.value,
      total_ingresos: parseFloat(resumen.value.totalIngresos) || 0,
      total_gastos: parseFloat(resumen.value.totalGastos) || 0,
      total_costos: parseFloat(resumen.value.totalCostos) || 0,
      saldo_banco_caja: parseFloat(resumen.value.saldoBancoCaja) || 0,
      flujo_neto: flujoNeto.value,
      cuentas_cobrar: parseFloat(resumen.value.cuentasCobrar) || 0,
      cuentas_pagar: parseFloat(resumen.value.cuentasPagar) || 0,
      utilidad_bruta: parseFloat(resumen.value.utilidadBruta) || 0,
      utilidad_distribuir: parseFloat(resumen.value.utilidadDistribuir) || 0,
      notas_empresa: notasEmpresa.value || ''
    }

    console.log('📤 Creando reporte:', payload)
    const response = await ReportesAPI.create(payload)
    reporte.value = response.data.data || response.data
    console.log('✅ Reporte creado:', reporte.value)
    return reporte.value
  } catch (error) {
    console.error('❌ Error creando reporte:', error)
    throw error
  }
}

function seleccionarArchivo(tipo = 'excel') {
  if (archivos.value.length >= MAX_ARCHIVOS) {
    Swal.fire({ icon: 'warning', title: 'Límite alcanzado', text: `Solo puedes subir hasta ${MAX_ARCHIVOS} archivos.` })
    return
  }
  tipoArchivoSeleccionado.value = tipo
  if (tipo === 'pdf') {
    fileInput.value.accept = '.pdf'
  } else {
    fileInput.value.accept = '.xlsx,.xls,.xlsm,.csv'
  }
  fileInput.value?.click()
}

async function subirArchivoYActualizarReporte(file) {
  try {
    cargando.value = true
    mensajeCarga.value = 'Verificando empresa...'

    const empresaOk = await verificarEmpresa()
    if (!empresaOk) throw new Error('No se pudo verificar la empresa')

    if (!reporte.value?.id) {
      mensajeCarga.value = 'Creando reporte...'
      await crearReporte()
    }

    if (archivos.value.length >= MAX_ARCHIVOS) {
      Swal.fire({ icon: 'warning', title: 'Límite alcanzado', text: `Máximo ${MAX_ARCHIVOS} archivos.` })
      return
    }

    const extension = '.' + file.name.split('.').pop().toLowerCase()
    const esPDF = extension === '.pdf'
    const tipoDocumento = esPDF ? 'pdf_factura' : 'excel_principal'
    const esPrincipal = archivos.value.length === 0 && !esPDF

    mensajeCarga.value = `Subiendo ${esPDF ? 'PDF' : 'Excel'}...`
    const formData = new FormData()
    formData.append('reporte_id', reporte.value.id.toString())
    formData.append('archivo', file)
    formData.append('tipo_documento', tipoDocumento)
    formData.append('es_principal', esPrincipal ? 'true' : 'false')
    formData.append('orden', archivos.value.length.toString())
    formData.append('metadata', '{}')

    const response = await http.post('/Archivo/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    const archivoData = response.data.data

    if (!esPDF) {
      mensajeCarga.value = 'Extrayendo datos del Excel...'
      try {
        await http.post(`/DatosExcelExtraido/procesar/${archivoData.id}`)
        console.log('✅ Datos extraídos')
      } catch (error) {
        console.warn('⚠️ Error extrayendo datos:', error)
      }
    }

    mensajeCarga.value = 'Actualizando datos...'
    await cargarDatos()

    if (archivoData.resumen_excel) {
      try {
        const resumenData = JSON.parse(archivoData.resumen_excel)
        tieneDatosReales.value = resumenData.total_filas > 0 || resumenData.total_hojas > 0
      } catch (e) {
        tieneDatosReales.value = false
      }
    }

    Swal.fire({
      icon: 'success',
      title: esPDF ? '✅ PDF subido' : '✅ Excel subido',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    })

  } catch (error) {
    console.error('❌ Error:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || error.message || 'Error al subir el archivo'
    })
  } finally {
    cargando.value = false
    mensajeCarga.value = ''
  }
}

async function onFileSelected(event) {
  const file = event.target.files[0]
  if (!file) return

  const extension = '.' + file.name.split('.').pop().toLowerCase()

  if (tipoArchivoSeleccionado.value === 'pdf' && extension !== '.pdf') {
    Swal.fire({ icon: 'error', title: 'Formato no soportado', text: 'Solo se permiten .pdf' })
    fileInput.value.value = ''
    return
  }

  if (tipoArchivoSeleccionado.value !== 'pdf') {
    const validExtensions = ['.xlsx', '.xls', '.xlsm', '.csv']
    if (!validExtensions.includes(extension)) {
      Swal.fire({ icon: 'error', title: 'Formato no soportado', text: 'Solo se permiten .xlsx, .xls, .xlsm y .csv' })
      fileInput.value.value = ''
      return
    }
  }

  if (file.size > 10 * 1024 * 1024) {
    Swal.fire({ icon: 'error', title: 'Archivo muy grande', text: 'El archivo no debe superar los 10 MB' })
    fileInput.value.value = ''
    return
  }

  try {
    await subirArchivoYActualizarReporte(file)
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    fileInput.value.value = ''
  }
}

async function cargarDatos() {
  try {
    cargando.value = true
    if (!empresaActivaId.value) {
      console.log('⚠️ No hay empresa activa seleccionada')
      return
    }

    console.log('📥 Cargando reporte para empresa:', empresaActivaId.value)
    const response = await ReportesAPI.getByEmpresa(empresaActivaId.value)
    const reportes = response.data?.data || response.data || []

    const encontrado = reportes.find(r => {
      const periodoReporte = r.periodo ? r.periodo.substring(0, 7) : ''
      return periodoReporte === periodoActual.value
    })

    reporte.value = encontrado || null

    if (reporte.value) {
      console.log('✅ Reporte encontrado:', reporte.value)

      resumen.value = {
        totalIngresos: reporte.value.total_ingresos?.toString() || '0',
        totalGastos: reporte.value.total_gastos?.toString() || '0',
        totalCostos: reporte.value.total_costos?.toString() || '0',
        saldoBancoCaja: reporte.value.saldo_banco_caja?.toString() || '0',
        cuentasCobrar: reporte.value.cuentas_cobrar?.toString() || '0',
        cuentasPagar: reporte.value.cuentas_pagar?.toString() || '0',
        utilidadBruta: reporte.value.utilidad_bruta?.toString() || '0',
        utilidadDistribuir: reporte.value.utilidad_distribuir?.toString() || '0'
      }

      notasEmpresa.value = reporte.value.notas_empresa || ''

      const hasRealData =
        parseFloat(resumen.value.totalIngresos) > 0 ||
        parseFloat(resumen.value.totalGastos) > 0 ||
        parseFloat(resumen.value.totalCostos) > 0

      tieneDatosReales.value = hasRealData

      await cargarArchivos()
    } else {
      console.log('⚠️ No se encontró reporte')
      archivos.value = []
      archivoPrincipal.value = null
      tieneDatosReales.value = false
    }
  } catch (error) {
    console.error('❌ Error cargando reporte:', error)
  } finally {
    cargando.value = false
  }
}

async function cargarArchivos() {
  if (!reporte.value?.id) {
    archivos.value = []
    archivoPrincipal.value = null
    return
  }

  try {
    const response = await ArchivosAPI.getByReporte(reporte.value.id)
    archivos.value = response.data?.data || response.data || []
    archivoPrincipal.value = archivos.value.find(a => a.es_principal === true) || archivos.value[0] || null
    console.log('📁 Archivos cargados:', archivos.value.length)
  } catch (error) {
    console.error('Error cargando archivos:', error)
    archivos.value = []
    archivoPrincipal.value = null
  }
}

async function guardarReporteManual() {
  if (!reporte.value?.id) {
    Swal.fire({ icon: 'warning', title: 'Sin reporte', text: 'No hay un reporte para guardar.' })
    return
  }

  if (reporte.value.status === 'validado' && !isAdmin.value) {
    Swal.fire({ icon: 'warning', title: 'No se puede modificar', text: 'El reporte ya está validado.' })
    return
  }

  try {
    guardando.value = true

    const payload = {
      total_ingresos: parseFloat(resumen.value.totalIngresos) || 0,
      total_gastos: parseFloat(resumen.value.totalGastos) || 0,
      total_costos: parseFloat(resumen.value.totalCostos) || 0,
      saldo_banco_caja: parseFloat(resumen.value.saldoBancoCaja) || 0,
      flujo_neto: flujoNeto.value,
      cuentas_cobrar: parseFloat(resumen.value.cuentasCobrar) || 0,
      cuentas_pagar: parseFloat(resumen.value.cuentasPagar) || 0,
      utilidad_bruta: parseFloat(resumen.value.utilidadBruta) || 0,
      utilidad_distribuir: parseFloat(resumen.value.utilidadDistribuir) || 0,
      notas_empresa: notasEmpresa.value
    }

    await ReportesAPI.update(reporte.value.id, payload)

    Swal.fire({
      icon: 'success',
      title: '✅ Reporte guardado',
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    })

  } catch (error) {
    console.error('❌ Error guardando:', error)
    Swal.fire({ icon: 'error', title: 'Error al guardar', text: error.response?.data?.message || error.message })
  } finally {
    guardando.value = false
  }
}

async function recargarDatos() {
  await cargarDatos()
  Swal.fire({
    icon: 'success',
    title: '✅ Datos recargados',
    timer: 1200,
    timerProgressBar: true,
    showConfirmButton: false,
    toast: true,
    position: 'top-end'
  })
}

async function guardarResumen() {
  if (!reporte.value?.id || !puedeEditarCampos.value) return

  clearTimeout(guardarTimeout.value)
  guardarTimeout.value = setTimeout(async () => {
    try {
      await ReportesAPI.update(reporte.value.id, {
        total_ingresos: parseFloat(resumen.value.totalIngresos) || 0,
        total_gastos: parseFloat(resumen.value.totalGastos) || 0,
        total_costos: parseFloat(resumen.value.totalCostos) || 0,
        saldo_banco_caja: parseFloat(resumen.value.saldoBancoCaja) || 0,
        flujo_neto: flujoNeto.value,
        cuentas_cobrar: parseFloat(resumen.value.cuentasCobrar) || 0,
        cuentas_pagar: parseFloat(resumen.value.cuentasPagar) || 0,
        utilidad_bruta: parseFloat(resumen.value.utilidadBruta) || 0,
        utilidad_distribuir: parseFloat(resumen.value.utilidadDistribuir) || 0,
        notas_empresa: notasEmpresa.value
      })
    } catch (error) {
      console.error('Error guardando resumen:', error)
    }
  }, 500)
}

async function guardarNotas() {
  if (!reporte.value?.id || !puedeEditarCampos.value) return

  clearTimeout(guardarTimeout.value)
  guardarTimeout.value = setTimeout(async () => {
    try {
      await ReportesAPI.update(reporte.value.id, {
        notas_empresa: notasEmpresa.value
      })
    } catch (error) {
      console.error('Error guardando notas:', error)
    }
  }, 500)
}

async function eliminarReporte() {
  if (!reporte.value?.id) {
    Swal.fire({ icon: 'warning', title: 'Sin reporte', text: 'No hay un reporte para eliminar.' })
    return
  }

  if (reporte.value.status !== 'borrador' && reporte.value.status !== 'rechazado') {
    Swal.fire({ icon: 'warning', title: 'No se puede eliminar', text: `El reporte está en estado "${getStatusLabel(reporte.value.status)}"` })
    return
  }

  const result = await Swal.fire({
    title: '⚠️ ¿Eliminar este reporte?',
    html: `
      <p>Esta acción <strong style="color: #dc3545;">no se puede deshacer</strong>.</p>
      <p style="color: #6b7280; font-size: 13px;">Se eliminarán todos los archivos asociados.</p>
      <hr style="margin: 12px 0; border-color: #e5e7eb;">
      <p style="font-size: 13px;">
        📅 Período: <strong>${periodoLabel(reporte.value.periodo)}</strong><br>
        📊 Estado: <strong>${getStatusLabel(reporte.value.status)}</strong><br>
        📁 Archivos: <strong>${archivos.value.length}</strong>
      </p>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6b7280',
    confirmButtonText: '🗑️ Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (!result.isConfirmed) return

  try {
    cargando.value = true
    mensajeCarga.value = 'Eliminando reporte...'
    await ReportesAPI.remove(reporte.value.id)

    Swal.fire({ icon: 'success', title: '✅ Reporte eliminado', timer: 1500, showConfirmButton: false, toast: true, position: 'top-end' })

    reporte.value = null
    archivos.value = []
    archivoPrincipal.value = null
    tieneDatosReales.value = false

    resumen.value = {
      totalIngresos: '', totalGastos: '', totalCostos: '', saldoBancoCaja: '',
      cuentasCobrar: '', cuentasPagar: '', utilidadBruta: '', utilidadDistribuir: ''
    }
    notasEmpresa.value = ''
    await cargarDatos()
  } catch (error) {
    console.error('❌ Error eliminando:', error)
    Swal.fire({ icon: 'error', title: 'Error al eliminar', text: error.response?.data?.message || error.message })
  } finally {
    cargando.value = false
    mensajeCarga.value = ''
  }
}

async function cargarReporte() {
  const result = await Swal.fire({
    title: '📤 ¿Cargar reporte definitivamente?',
    html: `
      <p>El reporte quedará en revisión para que el administrador lo valide.</p>
      <p style="color: #6b7280; font-size: 13px;">No podrás editarlo hasta que el administrador lo devuelva.</p>
    `,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#2F6FED',
    cancelButtonColor: '#6b7280',
    confirmButtonText: '✅ Sí, cargar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    await ReportesAPI.cargar(reporte.value.id)
    await cargarDatos()
    Swal.fire({ icon: 'success', title: '✅ Reporte cargado', timer: 1500, showConfirmButton: false, toast: true, position: 'top-end' })
  }
}

async function reabrirReporte() {
  const result = await Swal.fire({
    title: '🔄 ¿Reabrir el reporte?',
    text: 'Podrás editar el reporte nuevamente.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#2F6FED',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sí, reabrir',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    await ReportesAPI.reabrir(reporte.value.id)
    await cargarDatos()
    Swal.fire({ icon: 'success', title: 'Reporte reabierto', timer: 1500, showConfirmButton: false, toast: true, position: 'top-end' })
  }
}

async function forzarReapertura() {
  const result = await Swal.fire({
    title: '⚠️ ¿Forzar reapertura?',
    html: `<p>Como administrador, puedes forzar la reapertura de este reporte.</p>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sí, forzar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    await ReportesAPI.reabrir(reporte.value.id)
    await cargarDatos()
    Swal.fire({ icon: 'success', title: '✅ Reporte reabierto', timer: 1500, showConfirmButton: false, toast: true, position: 'top-end' })
  }
}

async function quitarArchivo(id) {
  const result = await Swal.fire({
    title: '¿Quitar el archivo?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sí, quitar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    await ArchivosAPI.remove(id)
    archivoPrincipal.value = null
    tieneDatosReales.value = false
    await cargarDatos()
    Swal.fire({ icon: 'success', title: 'Archivo quitado', timer: 1500, showConfirmButton: false, toast: true, position: 'top-end' })
  }
}

async function descargarArchivo(id) {
  if (!id) return
  try {
    const url = ArchivosAPI.downloadUrl(id)
    window.open(url, '_blank')
  } catch (error) {
    console.error('Error descargando:', error)
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo descargar el archivo' })
  }
}

function cambiarPeriodo() {
  cargarDatos()
}

watch([mesSeleccionado, anioSeleccionado], () => {
  cargarDatos()
})

// ═══════════════════════════════════════════════════════════════════
// ON MOUNT - Punto de entrada
// ═══════════════════════════════════════════════════════════════════
onMounted(async () => {
  console.log('🚀 Montando ReporteFinancieroView')
  console.log('📊 Usuario autenticado:', auth.user)
  
  // ⭐ PASO 1: Cargar empresas desde el endpoint
  await cargarEmpresasDesdeAPI()
  
  // ⭐ PASO 2: Inicializar empresa activa
  inicializarEmpresaActiva()
  
  // ⭐ PASO 3: Cargar datos si hay empresa activa
  if (empresaActivaId.value) {
    console.log('✅ Cargando datos para empresa:', empresaActivaId.value)
    await cargarDatos()
  } else {
    console.warn('⚠️ No hay empresa activa seleccionada')
  }
  
  // Event listener para cerrar dropdown
  document.addEventListener('click', cerrarDropdownEmpresaSiFuera)
})

onUnmounted(() => {
  document.removeEventListener('click', cerrarDropdownEmpresaSiFuera)
})
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════
   TODOS LOS ESTILOS EXISTENTES SE MANTIENEN IGUAL
   ═══════════════════════════════════════════════════════════════════ */

.reporte-financiero {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 16px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

/* ═══════════════════════════════════════════════════════════════════
   SELECTOR DE EMPRESA PROFESIONAL (MULTIEMPRESA)
   ═══════════════════════════════════════════════════════════════════ */
.empresa-selector {
  position: relative;
}

.empresa-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 6px 12px 6px 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  min-height: 44px;
}

.empresa-trigger:hover {
  border-color: #c7d2fe;
  background: #f8faff;
}

.empresa-trigger.is-open {
  border-color: #2F6FED;
  box-shadow: 0 0 0 3px rgba(47, 111, 237, 0.1);
}

.empresa-avatar {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: linear-gradient(135deg, #2F6FED, #6d8ffc);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  letter-spacing: 0.02em;
}

.empresa-avatar.sm {
  width: 30px;
  height: 30px;
  font-size: 11px;
  border-radius: 8px;
}

.empresa-trigger-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
  text-align: left;
  min-width: 0;
  flex: 1;
}

.empresa-trigger-label {
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ca3af;
}

.empresa-trigger-name {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a2e;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.empresa-trigger-badge {
  background: #2F6FED;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 8px;
  border-radius: 10px;
  flex-shrink: 0;
  line-height: 1.4;
}

.empresa-trigger-caret {
  font-size: 12px;
  color: #9ca3af;
  transition: transform 0.2s;
  flex-shrink: 0;
}

.empresa-trigger-caret.open {
  transform: rotate(180deg);
  color: #2F6FED;
}

.empresa-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  min-width: 280px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.14);
  padding: 6px;
  z-index: 50;
  max-height: 320px;
  overflow-y: auto;
}

.empresa-dropdown::-webkit-scrollbar {
  width: 4px;
}

.empresa-dropdown::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 10px;
}

.empresa-dropdown::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}

.empresa-dropdown-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  padding: 6px 10px 8px;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 4px;
}

.empresa-dropdown-header i {
  color: #2F6FED;
}

.empresa-dropdown-count {
  margin-left: auto;
  background: #eef2ff;
  color: #2F6FED;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 10px;
  border-radius: 10px;
}

.empresa-option {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
  font-family: inherit;
}

.empresa-option:hover {
  background: #f3f4f6;
}

.empresa-option.active {
  background: #eef2ff;
}

.empresa-option-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.empresa-option-name {
  font-size: 13px;
  font-weight: 500;
  color: #1a1a2e;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.empresa-option-rif {
  font-size: 11px;
  color: #9ca3af;
}

.empresa-option-badge {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: #dcfce7;
  color: #16a34a;
  padding: 1px 8px;
  border-radius: 10px;
  flex-shrink: 0;
}

.empresa-option.active .empresa-option-badge {
  background: #bbf7d0;
}

.empresa-option-check {
  color: #2F6FED;
  font-size: 16px;
  flex-shrink: 0;
  margin-left: 4px;
}

.fade-dropdown-enter-active,
.fade-dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-dropdown-enter-from,
.fade-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (max-width: 640px) {
  .empresa-trigger-name {
    max-width: 120px;
  }
  .empresa-dropdown {
    min-width: 0;
    left: 0;
    right: 0;
  }
}

/* ═══════════════════════════════════════════════════════════════════
   HEADER
   ═══════════════════════════════════════════════════════════════════ */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #eef2ff, #e0e7ff);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2F6FED;
  font-size: 22px;
  flex-shrink: 0;
}

.panel-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 2px 0;
}

.panel-sub {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.panel-sub strong {
  color: #1a1a2e;
}

.header-right {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .header-right {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }
  .empresa-selector,
  .period-selector {
    width: 100%;
  }
  .empresa-trigger {
    width: 100%;
  }
  .empresa-trigger-name {
    max-width: none;
  }
}

.period-selector {
  display: flex;
  gap: 6px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 4px;
}

.select-wrapper {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 6px;
  background: #f9fafb;
  transition: background 0.2s;
}

.select-wrapper i {
  color: #6b7280;
  font-size: 14px;
}

.select-wrapper select {
  border: none;
  background: transparent;
  font-size: 13px;
  font-weight: 500;
  padding: 4px 0;
  color: #1a1a2e;
  cursor: pointer;
  outline: none;
}

/* ═══════════════════════════════════════════════════════════════════
   CONTENT GRID
   ═══════════════════════════════════════════════════════════════════ */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

/* ═══════════════════════════════════════════════════════════════════
   CARDS
   ═══════════════════════════════════════════════════════════════════ */
.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 20px 22px;
  margin-bottom: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.2s;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 8px;
}

.card-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-header-left i {
  font-size: 20px;
  color: #2F6FED;
}

.card-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0;
}

.card-subtitle {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

/* ═══════════════════════════════════════════════════════════════════
   SUMMARY GRID
   ═══════════════════════════════════════════════════════════════════ */
.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 14px;
}

@media (max-width: 768px) {
  .summary-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}

.field-group {
  position: relative;
}

.field-group label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 3px;
}

.field-group label i {
  font-size: 14px;
}

.field-wrapper input,
.field-wrapper textarea {
  width: 100%;
  padding: 8px 36px 8px 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #1a1a2e;
  outline: none;
  transition: all 0.2s;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.field-wrapper input:focus,
.field-wrapper textarea:focus {
  border-color: #2F6FED;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(47, 111, 237, 0.1);
}

.field-wrapper input:disabled,
.field-wrapper textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.field-wrapper textarea {
  resize: vertical;
  min-height: 70px;
  padding-right: 12px;
}

.field-check {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #22c55e;
  font-size: 16px;
}

.field-group.has-data input {
  border-color: #86efac;
  background: #f0fdf4;
}

/* ═══════════════════════════════════════════════════════════════════
   FLUJO NETO
   ═══════════════════════════════════════════════════════════════════ */
.flujo-neto {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px 20px;
  margin-top: 4px;
}

.flujo-neto-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.flujo-neto-label span {
  font-weight: 400;
  text-transform: none;
  color: #9ca3af;
  font-size: 11px;
}

.flujo-neto-value {
  font-size: 26px;
  font-weight: 700;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.flujo-neto-value .sign {
  font-size: 22px;
}

.flujo-neto-value.positive {
  color: #22c55e;
}

.flujo-neto-value.negative {
  color: #dc3545;
}

.flujo-neto-value .status-tag {
  font-size: 13px;
  font-weight: 600;
  padding: 2px 12px;
  border-radius: 12px;
  background: #f3f4f6;
  color: #6b7280;
}

.flujo-neto-value.positive .status-tag {
  background: #dcfce7;
  color: #16a34a;
}

.flujo-neto-value.negative .status-tag {
  background: #fee2e2;
  color: #dc3545;
}

/* ═══════════════════════════════════════════════════════════════════
   STATUS BAR
   ═══════════════════════════════════════════════════════════════════ */
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  padding: 14px 20px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  margin-bottom: 20px;
}

.status-bar.borrador { border-left: 4px solid #6b7280; }
.status-bar.cargado { border-left: 4px solid #f59e0b; }
.status-bar.validado { border-left: 4px solid #22c55e; }
.status-bar.rechazado { border-left: 4px solid #dc3545; }

.status-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.status-right {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .status-bar {
    flex-direction: column;
    align-items: stretch;
  }
  .status-left {
    flex-wrap: wrap;
    justify-content: center;
  }
  .status-right {
    width: 100%;
    justify-content: center;
  }
  .status-right .btn {
    flex: 1;
    justify-content: center;
    min-width: 120px;
  }
}

/* ═══════════════════════════════════════════════════════════════════
   BOTONES PROFESIONALES
   ═══════════════════════════════════════════════════════════════════ */
.btn {
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  text-decoration: none;
  line-height: 1.4;
  min-height: 44px;
  letter-spacing: 0.01em;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.btn:active {
  transform: scale(0.97);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn i {
  font-size: 16px;
  line-height: 1;
}

.btn-primary {
  background: #2F6FED;
  color: #fff;
  box-shadow: 0 2px 8px rgba(47, 111, 237, 0.25);
}

.btn-primary:hover:not(:disabled) {
  background: #1a5cdb;
  box-shadow: 0 4px 16px rgba(47, 111, 237, 0.35);
  transform: translateY(-1px);
}

.btn-success {
  background: #22c55e;
  color: #fff;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.25);
}

.btn-success:hover:not(:disabled) {
  background: #16a34a;
  box-shadow: 0 4px 16px rgba(34, 197, 94, 0.35);
  transform: translateY(-1px);
}

.btn-warning {
  background: #f59e0b;
  color: #fff;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.25);
}

.btn-warning:hover:not(:disabled) {
  background: #d97706;
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.35);
  transform: translateY(-1px);
}

.btn-danger {
  background: #dc3545;
  color: #fff;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.25);
}

.btn-danger:hover:not(:disabled) {
  background: #c82333;
  box-shadow: 0 4px 16px rgba(220, 53, 69, 0.35);
  transform: translateY(-1px);
}

.btn-danger-outline {
  background: transparent;
  color: #dc3545;
  border: 2px solid #dc3545;
}

.btn-danger-outline:hover:not(:disabled) {
  background: #dc3545;
  color: #fff;
  box-shadow: 0 4px 16px rgba(220, 53, 69, 0.3);
  transform: translateY(-1px);
}

.btn-pdf {
  background: #dc3545;
  color: #fff;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.2);
}

.btn-pdf:hover:not(:disabled) {
  background: #c82333;
  box-shadow: 0 4px 16px rgba(220, 53, 69, 0.3);
  transform: translateY(-1px);
}

.btn-outline-secondary {
  background: transparent;
  color: #6b7280;
  border: 2px solid #e5e7eb;
}

.btn-outline-secondary:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #1a1a2e;
}

.btn-ghost {
  background: transparent;
  color: #6b7280;
  padding: 6px 8px;
  min-height: 32px;
  border-radius: 8px;
}

.btn-ghost:hover:not(:disabled) {
  background: #f3f4f6;
  color: #1a1a2e;
}

.btn-ghost.btn-icon {
  padding: 6px 8px;
  min-height: 32px;
  width: 32px;
}

.btn-icon {
  padding: 6px 8px;
  min-height: 32px;
  width: 32px;
  border-radius: 8px;
  justify-content: center;
}

.btn-icon i {
  font-size: 16px;
  margin: 0;
}

.btn-lg {
  padding: 12px 28px;
  font-size: 15px;
  min-height: 50px;
}

.btn-action {
  padding: 10px 20px;
  font-size: 14px;
  min-height: 44px;
  flex: 1;
  min-width: 120px;
}

.btn-upload {
  padding: 10px 18px;
  font-size: 14px;
  min-height: 44px;
  flex: 1;
  min-width: 130px;
}

.upload-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

@media (max-width: 480px) {
  .upload-actions {
    flex-direction: column;
  }
  .btn-upload {
    width: 100%;
    justify-content: center;
  }
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 14px;
  flex-wrap: wrap;
}

@media (max-width: 480px) {
  .action-buttons {
    flex-direction: column;
  }
  .btn-action {
    width: 100%;
    justify-content: center;
  }
}

.file-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: #f9fafb;
  border-radius: 10px;
  border: 1px solid #f3f4f6;
  margin-bottom: 6px;
  transition: background 0.2s;
  flex-wrap: wrap;
}

.file-item:hover {
  background: #f3f4f6;
}

.file-item-info {
  flex: 1;
  min-width: 140px;
}

.file-item-name {
  font-size: 13px;
  font-weight: 500;
  color: #1a1a2e;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.file-item-meta {
  font-size: 12px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 2px;
}

.file-item-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

@media (max-width: 480px) {
  .file-item {
    flex-direction: column;
    align-items: stretch;
  }
  .file-item-info {
    min-width: auto;
  }
  .file-item-actions {
    justify-content: flex-end;
    margin-top: 4px;
  }
}

.badge-archivos,
.badge-datos,
.badge-pendiente,
.badge-notas {
  padding: 2px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.badge-excel,
.badge-pdf {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 12px;
}

.badge-archivos { background: #eef2ff; color: #2F6FED; }
.badge-principal { background: #fef3c7; color: #92400e; padding: 1px 8px; border-radius: 8px; font-size: 10px; font-weight: 600; }
.badge-version { background: #e5e7eb; color: #6b7280; padding: 1px 6px; border-radius: 4px; font-size: 9px; font-weight: 600; }
.badge-pdf-tag { background: #dc3545; color: #fff; padding: 1px 8px; border-radius: 8px; font-size: 10px; font-weight: 600; }
.badge-datos-extraidos { background: #dcfce7; color: #16a34a; padding: 1px 8px; border-radius: 8px; font-size: 10px; font-weight: 600; }
.badge-datos { background: #dcfce7; color: #16a34a; }
.badge-pendiente { background: #fef3c7; color: #92400e; }
.badge-notas { background: #eef2ff; color: #2F6FED; }

.file-item-icon.excel { background: #dcfce7; color: #16a34a; width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.file-item-icon.pdf { background: #fee2e2; color: #dc3545; width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }

.status-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
.status-dot.borrador { background: #6b7280; }
.status-dot.cargado { background: #f59e0b; }
.status-dot.validado { background: #22c55e; }
.status-dot.rechazado { background: #dc3545; }

.status-label { font-weight: 600; font-size: 14px; color: #1a1a2e; }
.status-divider { width: 1px; height: 24px; background: #e5e7eb; }
.text-muted { color: #9ca3af; }

.status-validado { display: flex; align-items: center; gap: 6px; color: #22c55e; font-weight: 600; font-size: 14px; }

.status-info { display: flex; align-items: flex-start; gap: 10px; padding: 12px 16px; border-radius: 10px; font-size: 13px; margin-bottom: 14px; }
.status-info i { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
.status-info p { margin: 0; line-height: 1.5; }
.status-info-warning { background: #fef3c7; border: 1px solid #fcd34d; color: #92400e; }
.status-info-success { background: #dcfce7; border: 1px solid #86efac; color: #166534; }
.status-info-danger { background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; }

.status-card { display: flex; align-items: center; gap: 16px; padding: 16px 20px; border-radius: 12px; border: 1px solid; }
.status-card-success { background: #f0fdf4; border-color: #86efac; }
.status-card-danger { background: #fef2f2; border-color: #fca5a5; }
.status-card-icon { font-size: 28px; flex-shrink: 0; }
.status-card-success .status-card-icon { color: #22c55e; }
.status-card-danger .status-card-icon { color: #dc3545; }
.status-card-content h4 { font-size: 15px; font-weight: 600; margin: 0 0 2px 0; color: #1a1a2e; }
.status-card-content p { font-size: 13px; color: #6b7280; margin: 0; }

.edition-status { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: #f9fafb; border-radius: 10px; border: 1px solid #e5e7eb; font-size: 13px; color: #6b7280; margin-bottom: 14px; flex-wrap: wrap; }
.edition-status i { font-size: 16px; color: #2F6FED; }
.edition-status.warning i { color: #f59e0b; }
.edition-status.locked i { color: #22c55e; }
.edition-status strong { color: #1a1a2e; }

.admin-note { display: flex; gap: 12px; padding: 16px 20px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; margin-bottom: 16px; flex-wrap: wrap; }
.admin-note-icon { color: #dc3545; font-size: 20px; flex-shrink: 0; margin-top: 2px; }
.admin-note-content strong { color: #991b1b; display: block; font-size: 14px; }
.admin-note-content p { margin: 4px 0 0 0; color: #6b7280; font-size: 14px; }

.empty-state-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 48px 24px; text-align: center; margin-bottom: 20px; }
.empty-state-content { max-width: 480px; margin: 0 auto; }
.empty-icon { font-size: 48px; color: #d1d5db; margin-bottom: 16px; }
.empty-state-content h3 { font-size: 20px; font-weight: 600; color: #1a1a2e; margin: 0 0 8px 0; }
.empty-state-content p { color: #6b7280; font-size: 14px; margin: 0 0 24px 0; line-height: 1.6; }
.empty-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
@media (max-width: 480px) { .empty-actions { flex-direction: column; align-items: stretch; } .empty-actions .btn { width: 100%; justify-content: center; } }

.empty-files { text-align: center; padding: 32px 16px; color: #6b7280; }
.empty-files i { font-size: 40px; color: #d1d5db; display: block; margin-bottom: 12px; }
.empty-files p { font-weight: 500; margin: 0 0 4px 0; color: #374151; font-size: 15px; }
.empty-files span { font-size: 13px; color: #9ca3af; }

.loading-state { text-align: center; padding: 24px 16px; }
.spinner { display: inline-block; width: 32px; height: 32px; border: 3px solid #e5e7eb; border-top-color: #2F6FED; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 10px; }
@keyframes spin { to { transform: rotate(360deg); } }
.loading-state p { color: #6b7280; font-size: 13px; margin: 0; }

@media (max-width: 480px) {
  .card { padding: 14px 16px; }
  .panel-title { font-size: 18px; }
  .panel-sub { font-size: 13px; }
  .header-icon { width: 40px; height: 40px; font-size: 18px; }
  .flujo-neto-value { font-size: 20px; }
  .btn { font-size: 13px; padding: 8px 14px; min-height: 38px; }
  .btn-lg { padding: 10px 20px; font-size: 14px; min-height: 44px; }
  .btn-action { min-height: 38px; padding: 8px 14px; }
  .btn-upload { min-height: 38px; padding: 8px 14px; }
  .period-selector { flex-direction: column; width: 100%; }
  .select-wrapper { width: 100%; }
  .select-wrapper select { width: 100%; }
  .summary-grid { grid-template-columns: 1fr; }
}

@media (max-width: 360px) {
  .reporte-financiero { padding: 0 8px; }
  .panel-header { gap: 10px; }
  .header-icon { width: 32px; height: 32px; font-size: 14px; }
  .panel-title { font-size: 16px; }
  .flujo-neto-value { font-size: 17px; }
  .btn { font-size: 12px; padding: 6px 10px; min-height: 32px; }
  .status-right .btn { min-width: 80px; }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .content-grid { grid-template-columns: 1fr; }
  .summary-grid { grid-template-columns: 1fr 1fr; }
}

@media (min-width: 1025px) {
  .content-grid { grid-template-columns: 1fr 1fr; }
}
</style>