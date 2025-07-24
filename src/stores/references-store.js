// stores/category-store.js
import { defineStore, acceptHMRUpdate } from 'pinia'
import axios from 'axios'

export const useReferencesStore = defineStore('reference', {
  state: () => ({
    references: null,
  }),

  actions: {
    async fetchReferences() {
      try {
        const response = await axios.get(`http://localhost:18080/xApp/warehouse/references/flat/1`)
        this.references = response.data.data
        console.log('REFERENZE', this.references)
      } catch (error) {
        console.error('Errore nel fetch delle category:', error)
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useReferencesStore, import.meta.hot))
}
