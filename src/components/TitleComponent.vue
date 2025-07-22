<template>
  <div class="text-h3 q-my-md capitalize">{{ displayTitle }}</div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

// Props
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
})

const route = useRoute()
const displayPath = computed(() => route.path.replace('/', ''))

// Se `props.title` esiste, usalo. Altrimenti mostra il path.
const displayTitle = computed(() => props.title || displayPath.value)
</script>

<style scoped lang="sass">
.capitalize
  text-transform: capitalize
</style>
