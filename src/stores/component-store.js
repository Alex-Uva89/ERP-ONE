import { defineStore, acceptHMRUpdate } from 'pinia'
import axios from 'axios'

export const useComponentStore = defineStore('component', {
  state: () => ({
    components: []
  }),

  getters: {
    visibleComponents: (state) => state.components.filter(c => c.visibility),
    defaultComponent: (state) => state.components.find(c => c.default)
  },

  actions: {
    async fetchComponents() {
      try {
        const res = await axios.get('/component.json')
        this.components = res.data
      } catch (error) {
        console.error('Errore nel fetch dei componenti:', error)
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useComponentStore, import.meta.hot))
}
