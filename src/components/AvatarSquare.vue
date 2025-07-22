<template>
    <q-avatar square>
      <img v-if="image" :src="image" :alt="alt">
      <img v-else src="https://cdn.quasar.dev/img/avatar.png" alt="Immagine default">
    </q-avatar>
</template>

<script setup>
defineProps({
  image: String,
  alt: String
})

</script>