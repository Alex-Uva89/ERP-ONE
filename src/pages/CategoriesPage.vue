<template>

<q-page>
    <TitleComponent />

    <BarActions
      :actions="barActions"
    />

    <q-separator />

    <div v-if="nodes">
        <TreeNode :nodes="nodes" />
    </div>
</q-page>

</template>

<script setup>
import { onMounted, computed, ref } from 'vue'

import TitleComponent from 'components/TitleComponent.vue'
import BarActions from 'components/BarActions.vue'
import TreeNode from 'components/TreeNode.vue'

import { useCategoryStore } from 'stores/category-store.js';

const categoryStore = useCategoryStore()

let nodes = computed(() => categoryStore.category)

const barActions = ref([])

onMounted(async () => {
  await categoryStore.fetchCategory();

  try {
    const response = await fetch('/barActions/categoriesBarActions.json')
    barActions.value = await response.json()
  } catch (error) {
    console.error('Errore nel caricamento del JSON:', error)
  }
});

</script>

