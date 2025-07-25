<template>
  <div class="row q-col-gutter-sm">
    <div class="col">
      <q-input
        :model-value="modelValue.min"
        type="number"
        label="Min"
        :min="minLimit"
        :max="maxLimit"
        :step="step"
        dense
        outlined
        @update:model-value="updateMin"
      />
    </div>
    <div class="col">
      <q-input
        :model-value="modelValue.max"
        type="number"
        label="Max"
        :min="minLimit"
        :max="maxLimit"
        :step="step"
        dense
        outlined
        @update:model-value="updateMax"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    default: () => ({ min: 0, max: 0 }),
  },
  minLimit: {
    type: Number,
    default: 0,
  },
  maxLimit: {
    type: Number,
    default: 100,
  },
  step: {
    type: Number,
    default: 0.1,
  },
})

const emit = defineEmits(['update:modelValue'])

const updateMin = (value) => {
  emit('update:modelValue', { ...props.modelValue, min: Number(value) })
}

const updateMax = (value) => {
  emit('update:modelValue', { ...props.modelValue, max: Number(value) })
}
</script>
