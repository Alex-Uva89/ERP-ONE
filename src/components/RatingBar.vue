<!-- src/components/RatingStars.vue -->
<template>
  <div class="q-pa-xs">
    <q-rating
      :icon="icon"
      v-model="model"
      :max="max"
      :color="color"
      :size="size"
      :readonly="readonly"
    >
      <template v-for="index in max" #[`tip-${index}`]  :key="index">
        <q-tooltip>{{ tooltips[index - 1] || `Rating ${index}` }}</q-tooltip>
      </template>
    </q-rating>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 3
  },
  icon: {
    type: String,
    default: 'star'
  },
  color: {
    type: String,
    default: 'primary'
  },
  size: {
    type: String,
    default: '2em'
  },
  readonly: {
    type: Boolean,
    default: false
  },
  tooltips: {
    type: Array,
    default: () => ['Not bad', 'Good', 'Very good!']
  }
})

const emit = defineEmits(['update:modelValue'])

const model = ref(props.modelValue)

watch(model, (val) => {
  emit('update:modelValue', val)
})

watch(() => props.modelValue, (val) => {
  model.value = val
})
</script>
