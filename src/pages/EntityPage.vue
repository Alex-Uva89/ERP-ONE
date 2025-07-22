<template>
  <q-page>
    <TitleComponent />
    <div class="row justify-center q-gutter-sm">
      <template v-if="entitiesStore.entities && entitiesStore.entities.id">
        <q-intersection
          transition="scale"
          class="example-item"
        >
          <CardVariousContent 
              :name="entitiesStore.entities.name"
              image="https://cdn.quasar.dev/img/parallax2.jpg"
              :value=valueEntity
              keyValue="Prenotazioni"
              label="controlla prenotazioni"
          /> 
        </q-intersection>
      </template>
      <div v-else>Nessun dato disponibile</div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useEntityBusinessStore } from 'stores/entityBusiness.js'
import TitleComponent from 'components/TitleComponent.vue'
import CardVariousContent from 'components/CardVariousContent.vue'

const entitiesStore = useEntityBusinessStore()
const loading = ref(false)

const valueEntity = 12

onMounted(async () => {
  if (!entitiesStore.entities?.length) {
    loading.value = true
    try {
      await entitiesStore.fetchEntities()
    } catch (error) {
      console.error('Fetch error:', error) // Debug 5
    } finally {
      loading.value = false
    }
  }
})
</script>