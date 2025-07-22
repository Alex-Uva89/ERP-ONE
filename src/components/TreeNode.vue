<template>
  <div class="q-pa-md col q-col-gutter-sm">
    <q-toolbar
      bordered
      class="text-bold text-white q-mb-md text-uppercase bg-primary"
      style="border: 1px solid blue"
    >
      Alberatura categorie
    </q-toolbar>
    <q-tree
      class="col-12 col-sm-6"
      :nodes="nodes"
      node-key="id"
      label-key="i18n_key"
      tick-strategy="leaf"
      v-model:ticked="ticked"
    />

    <div class="q-mt-md" style="width: 500px">
      <div v-if="selectedLabels.length">
        <q-expansion-item
          label="Selezione specifica"
          header-class="bg-primary text-white"
          class="container-breadcumbs-tick m-y-2"
        >
          <div class="m-y-3">
            <q-btn
              v-for="label in selectedLabels"
              :key="label.id"
              class="q-chip selectable"
              :class="{
                'selected bg-amber': categoryStore.selectedCategory.some(
                  (cat) => cat.id === label.id,
                ),
              }"
              @click="selectedCategory(label)"
            >
              {{ label.i18n_key }}
            </q-btn>
          </div>
        </q-expansion-item>

        <q-expansion-item
          label="Selezione alberatura"
          header-class="bg-primary text-white"
          class="container-breadcumbs-tick m-y-2"
        >
          <div class="m-y-3">
            <q-btn
              v-for="breadcumb in breadcumbsTicked"
              :key="breadcumb.id"
              class="q-chip selectable m-x-1"
              :class="{
                'selected bg-amber': categoryStore.selectedCategory.some(
                  (cat) => cat.id === breadcumb.id,
                ),
              }"
              @click="selectedCategory(breadcumb)"
            >
              {{ breadcumb.i18n_key }}
              <q-tooltip class="bg-amber text-black shadow-4 text-subtitle1" :offset="[10, 10]">
                {{
                  findPathById(breadcumb.id, props.nodes)
                    ?.map((n) => n.i18n_key)
                    .join(' > ') || 'Percorso non trovato'
                }}
              </q-tooltip>
            </q-btn>
          </div>
        </q-expansion-item>
      </div>

      <q-chip v-else square outline color="grey" icon="info"> Nessun elemento selezionato </q-chip>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCategoryStore } from 'stores/category-store.js'

const categoryStore = useCategoryStore()

const props = defineProps({
  nodes: {
    type: Array,
    required: true,
  },
})

const ticked = ref([])
const breadcumbsTicked = ref([])

const selectedLabels = computed(() => {
  return ticked.value
    .map((id) => {
      const findLabel = (nodes) => {
        for (const node of nodes) {
          // console.log('nodo in select', node)
          if (node.id === id) {
            return node
          } else {
            if (!breadcumbsTicked.value.some((item) => item.id === node.id)) {
              breadcumbsTicked.value.push(node)
            }
          }
          if (node.children) {
            const found = findLabel(node.children)
            if (found) return found
          }
        }
        return null
      }
      return findLabel(props.nodes) || `ID: ${id}`
    })
    .filter(Boolean)
})

function selectedCategory(params) {
  const index = categoryStore.selectedCategory.findIndex((cat) => cat.id === params.id)
  if (index === -1) {
    categoryStore.selectedCategory.push(params)
  } else {
    categoryStore.selectedCategory.splice(index, 1)
  }
}

function findPathById(id, nodes, path = []) {
  for (const node of nodes) {
    const newPath = [...path, node]
    if (node.id === id) {
      return newPath
    }
    if (node.children) {
      const result = findPathById(id, node.children, newPath)
      if (result) return result
    }
  }
  return null
}
</script>

<style scoped>
.container-breadcumb-tick {
  height: fit-content;
}

.selectable:hover {
  font-weight: bold;
  cursor: pointer;
  background-color: rgba(255, 193, 7, 0.5);
}
</style>
