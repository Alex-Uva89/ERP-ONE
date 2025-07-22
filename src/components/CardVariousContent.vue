<template>
    <q-card class="q-ma-sm my-card" flat bordered>
        <q-item class="text-h5">
            {{ name }}
        </q-item>
      <img :src="image">

      <q-list>
        <q-item clickable>
          <q-item-section avatar class="text-weight-bolder flex justify-center">
            {{ value }}
          </q-item-section>

          <q-item-section>
            <q-item-label>
                {{ keyValue }}
            </q-item-label>
            <q-item-label caption>
                {{ label }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
</template>

<script setup>
defineProps({
  name: String,
  image: String,
  value: Number,
  keyValue: String,
  label: String
})
</script>

<style lang="sass" scoped>
.my-card
  max-height: 600px;
  max-width: 600px;
</style>

<!-- https://cdn.quasar.dev/img/parallax2.jpg -->