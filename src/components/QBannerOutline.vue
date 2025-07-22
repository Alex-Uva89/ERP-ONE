<template>
  <q-btn
    class="my-btn full-width q-px-md q-py-sm bg-blue-0"
    outline
    color="primary"
    unelevated
    no-caps
  >
    <div class="row items-center">
      <div class="text-blue text-subtitle2">
        {{ title }}
      </div>
      <div class="row items-center">
        <template v-if="undertitle">
          <div class="text-weight-bold text-black">
            {{ undertitle }}
          </div>
        </template>
        <template v-if="icon">
          <q-icon v-if="icon" :name="icon" size="18px" class="q-ml-xs text-blue" />
        </template>
      </div>
    </div>
  </q-btn>
</template>

<script setup>
defineProps({
  title: String,
  undertitle: String,
  icon: String,
})
</script>

<style scoped>
.my-btn {
  border: 1px solid #00cfff;
  transition: transform 0.2s ease;
  text-align: left;
}

.my-btn:hover {
  transform: scale(1.1);
}
</style>
