<template>
  <q-input
    :model-value="modelValue"
    :type="inputType"
    :label="placeholder"
    :rules="rules"
    dense
    outlined
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], required: true },
  inputType: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  required: { type: Boolean, default: false },
})

const rules = computed(() => [
  (val) => !props.required || (val && val.length > 0) || 'Campo obbligatorio',
])
</script>
