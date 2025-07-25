<template>
  <q-input
    :model-value="modelValue"
    type="number"
    :label="placeholder"
    :min="minimum"
    :max="maximum"
    :rules="rules"
    dense
    outlined
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Number, required: true },
  placeholder: { type: String, default: '' },
  minimum: { type: Number, default: undefined },
  maximum: { type: Number, default: undefined },
  required: { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])

const rules = computed(() => [
  (val) => !props.required || (val !== null && val !== undefined) || 'Campo obbligatorio',
])
</script>
