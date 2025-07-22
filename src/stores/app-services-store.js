// stores/app-services-store.js
import { defineStore, acceptHMRUpdate } from 'pinia'
import axios from 'axios'

export const useAppServicesStore = defineStore('appServices', {
  state: () => ({
    owner: '',
    owner_uuid: 'bd4419b1-ce6e-4d0c-b495-fa61cb7b80a5',
    owner_id: 1,
    linkServices: [],
    MOBILE_BREAKPOINT: 768,
    isMobile: false,
  }),

  actions: {
    async fetchLinkServices() {
      try {
        const res = await axios.get('/linkAppService.json')
        this.linkServices = res.data
        // TODO: da modificare per differenziare link di destra e link di sinistra.
        // link di destra inierenti all'account
        // link di sinistra inerenti all'app
      } catch (error) {
        console.error('Errore nel fetch dei links:', error)
      }
    },

    async fetchOwner() {
      try {
        const res = await axios.get(`http://localhost:18080/xApp/business/owner/1`)
        this.owner = res.data.data
        // console.log('OWNER', this.owner)
      } catch (error) {
        console.error("Errore nel fetch dell'owner:", error)
      }
    },

    checkIsMobile() {
      this.isMobile = window.innerWidth < this.MOBILE_BREAKPOINT
    },

    // opzionale: listener al resize per aggiornare isMobile in tempo reale
    initResizeListener() {
      this.checkIsMobile()
      window.addEventListener('resize', this.checkIsMobile)
    },

    // opzionale: rimuovi il listener
    removeResizeListener() {
      window.removeEventListener('resize', this.checkIsMobile)
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppServicesStore, import.meta.hot))
}
