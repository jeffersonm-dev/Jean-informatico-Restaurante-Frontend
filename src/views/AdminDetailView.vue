<template>
  <div class="detail-view" v-if="report">
    <button class="back-link" @click="$router.push({ name: 'reportes' })">
      <Icon name="back" :size="16" /> Volver a Reportes
    </button>

    <div class="company-header">
      <div>
        <div class="panel-title">{{ report.empresa_nombre || '—' }}</div>
        <div class="panel-sub">Período: {{ periodoLabel(report.periodo) }}</div>
      </div>
      <StatusStamp :status="report.status" />
    </div>

    <div class="content-grid">
      <div>
        <div class="card">
          <h3>Archivos del reporte</h3>
          <div v-if="report.archivos && report.archivos.length" class="file-list">
            <div v-for="archivo in report.archivos" :key="archivo.id" class="file-row">
              <div class="file-row-icon" :class="{ pdf: archivo.tipo_documento === 'pdf_factura' }">
                <Icon name="file" :size="18" />
              </div>
              <div class="file-row-info">
                <div class="file-row-name">
                  {{ archivo.nombre_original }}
                  <span v-if="archivo.es_principal" class="badge-principal">Principal</span>
                </div>
                <div class="file-row-meta">{{ fmtBytes(archivo.tamano_bytes) }} · {{ fmtDate(archivo.subido_fecha) }}</div>
              </div>
              <button class="btn btn-ghost btn-sm" @click="descargarArchivo(archivo.id)" title="Descargar">
                <Icon name="download" :size="14" /> Descargar
              </button>
            </div>
          </div>
          <div v-else class="empty-files">Sin archivos</div>
        </div>

        <div class="card">
          <h3>Resumen Financiero declarado</h3>
          <div class="mini-summary-grid">
            <div class="field-row"><label>Total Ingresos</label><input class="num" :value="fmt(report.total_ingresos)" disabled></div>
            <div class="field-row"><label>Total Gastos</label><input class="num" :value="fmt(report.total_gastos)" disabled></div>
            <div class="field-row"><label>Total Costos</label><input class="num" :value="fmt(report.total_costos)" disabled></div>
            <div class="field-row"><label>Saldo Banco/Caja</label><input class="num" :value="fmt(report.saldo_banco_caja)" disabled></div>
            <div class="field-row"><label>Cuentas por Cobrar</label><input class="num" :value="fmt(report.cuentas_cobrar)" disabled></div>
            <div class="field-row"><label>Cuentas por Pagar</label><input class="num" :value="fmt(report.cuentas_pagar)" disabled></div>
            <div class="field-row"><label>Utilidad Bruta</label><input class="num" :value="fmt(report.utilidad_bruta)" disabled></div>
            <div class="field-row"><label>Utilidad a Distribuir</label><input class="num" :value="fmt(report.utilidad_distribuir)" disabled></div>
          </div>
          <div class="field-row" v-if="report.notas_empresa">
            <label>Notas de la empresa</label>
            <textarea disabled>{{ report.notas_empresa }}</textarea>
          </div>
        </div>
      </div>

      <div>
        <div class="card">
          <h3>Flujo Neto</h3>
          <div class="flujo-neto-card">
            <div style="font-size:12px;color:var(--text-dim);">Ingresos − Gastos − Costos</div>
            <div class="flujo-neto-val" :class="(report.flujo_neto ?? 0) >= 0 ? 'positive' : 'negative'">$ {{ fmt(report.flujo_neto) }}</div>
          </div>
        </div>

        <div class="validate-bar">
          <h4>Validación del administrador</h4>
          <textarea v-model="notas" placeholder="Notas u observaciones para la empresa (opcional)…"></textarea>
          <div class="validate-actions">
            <button class="btn btn-teal" :disabled="report.status !== 'cargado' || busy" @click="validar">
              Validar Reporte
            </button>
            <button class="btn btn-red" :disabled="report.status !== 'cargado' || busy" @click="rechazar">
              Rechazar / Solicitar corrección
            </button>
          </div>
          <p v-if="report.status === 'validado'" style="margin-top:12px;font-size:12.5px;color:var(--text-dim);">
            Validado por {{ report.validado_por_nombre }} el {{ fmtDate(report.validado_fecha) }}.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { periodoLabel } from '../stores/data'
import { useUiStore } from '../stores/ui'
import { ReportesAPI, ArchivosAPI } from '../services/api'
import { fmt, fmtDate, fmtBytes } from '../utils/format'
import StatusStamp from '../components/ui/StatusStamp.vue'
import Icon from '../components/ui/Icon.vue'

const route = useRoute()
const ui = useUiStore()

const id = route.params.id
const report = ref(null)
const notas = ref('')
const busy = ref(false)

async function load() {
  const { data: rep } = await ReportesAPI.getById(id)
  report.value = rep
  notas.value = rep?.notas_admin || ''
}

function descargarArchivo(archivoId) {
  if (!archivoId) return
  window.open(ArchivosAPI.downloadUrl(archivoId), '_blank')
}

async function validar() {
  ui.openConfirm(`¿Confirmas validar el reporte de ${report.value?.empresa_nombre} para ${periodoLabel(report.value?.periodo)}?`, async () => {
    busy.value = true
    try {
      await ReportesAPI.validate(id, notas.value)
      await load()
      ui.showToast('Reporte validado correctamente.')
    } catch (e) {
      ui.showError('No se pudo validar el reporte.')
    } finally {
      busy.value = false
    }
  })
}

async function rechazar() {
  if (!notas.value.trim()) {
    ui.showError('Escribe una nota explicando qué debe corregir la empresa.')
    return
  }
  ui.openConfirm('¿Rechazar este reporte y devolverlo a la empresa para corrección?', async () => {
    busy.value = true
    try {
      await ReportesAPI.reject(id, notas.value)
      await load()
      ui.showToast('Reporte devuelto a la empresa.')
    } catch (e) {
      ui.showError('No se pudo rechazar el reporte.')
    } finally {
      busy.value = false
    }
  })
}

onMounted(load)
</script>

<style scoped>
.file-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.file-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
}
.file-row-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: rgba(34, 139, 34, 0.12);
  color: #1e7d32;
  flex-shrink: 0;
}
.file-row-icon.pdf {
  background: rgba(220, 38, 38, 0.12);
  color: #b91c1c;
}
.file-row-info {
  flex: 1;
  min-width: 0;
}
.file-row-name {
  font-size: 13.5px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.file-row-meta {
  font-size: 12px;
  color: var(--text-dim);
}
.badge-principal {
  margin-left: 6px;
  font-size: 10.5px;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(34, 139, 34, 0.15);
  color: #1e7d32;
  vertical-align: middle;
}
.empty-files {
  color: var(--text-faint);
  font-size: 13px;
  padding: 8px 0;
}
</style>
