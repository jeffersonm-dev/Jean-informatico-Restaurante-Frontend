// stores/ui.js
import { defineStore } from 'pinia'

let toastTimer = null

export const useUiStore = defineStore('ui', {
  state: () => ({
    toast: { show: false, msg: '', type: 'success' },
    sidebarCollapsed: false,
    sidebarMobileOpen: false,
    confirmModal: null,
    promptModal: null
  }),
  
  actions: {
    showToast(msg, type = 'success') {
      this.toast = { show: true, msg, type }
      clearTimeout(toastTimer)
      toastTimer = setTimeout(() => { this.toast.show = false }, 3200)
    },
    showError(msg) {
      this.showToast(msg, 'err')
    },
    openConfirm(message, onConfirm) {
      this.confirmModal = { message, onConfirm }
    },
    closeConfirm() {
      this.confirmModal = null
    },
    openPrompt(label, onSubmit, defaultValue = '') {
      this.promptModal = { label, onSubmit, defaultValue }
    },
    closePrompt() {
      this.promptModal = null
    },
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
      localStorage.setItem('sidebarCollapsed', JSON.stringify(this.sidebarCollapsed))
    },
    toggleMobileSidebar() {
      this.sidebarMobileOpen = !this.sidebarMobileOpen
    },
    loadSidebarState() {
      const saved = localStorage.getItem('sidebarCollapsed')
      if (saved !== null) {
        this.sidebarCollapsed = JSON.parse(saved)
      }
    }
  }
})