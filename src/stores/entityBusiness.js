import { defineStore, acceptHMRUpdate } from 'pinia'
import axios from 'axios'
import { useAppServicesStore } from './app-services-store'

export const useEntityBusinessStore = defineStore('entity', {
  state: () => ({
    entities: []
  }),

  getters: {
    visibleEntities: (state) => state.components.filter(c => c.visibility),
    defaultEntities: (state) => state.components.find(c => c.default)
  },

  actions: {
    async fetchEntities() {
      const appServicesStore = useAppServicesStore()
      try {
        const res = await axios.get(`http://localhost:18080/xApp/business/entity/by_uuid/${ appServicesStore.owner_uuid }`)
        this.entities = res.data.data
        // console.log('ENTITà', this.entities)
      } catch (error) {
        console.error('Errore nel fetch delle entità:', error)
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEntityBusinessStore, import.meta.hot))
}
