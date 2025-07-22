// stores/category-store.js
import { defineStore, acceptHMRUpdate } from 'pinia'
import { useAppServicesStore } from './app-services-store'
import { useEntityBusinessStore } from './entityBusiness'
import axios from 'axios'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    category: null,
    selectedCategory: [],
  }),

  actions: {
    async fetchCategory() {
      const appServicesStore = useAppServicesStore()
      const appEntityBusinessStore = useEntityBusinessStore()

      try {
        // console.log('Entità in category', appEntityBusinessStore.entities)

        if (!appEntityBusinessStore.entities?.length) {
          await appEntityBusinessStore.fetchEntities()
        }

        const response = await axios.get(
          `http://localhost:18080/xApp/warehouse/tree/${appServicesStore.owner.id}/${
            appEntityBusinessStore.entities.default_warehouse_category_business_owner_id
          }`,
        )
        this.category = response.data.data
        console.log('CATEGORY', this.category)
      } catch (error) {
        console.error('Errore nel fetch delle category:', error)
        // Potresti voler re-iniettare l'errore o gestirlo in altro modo
        throw error
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCategoryStore, import.meta.hot))
}
