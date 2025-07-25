<template>
  <q-input
    :model-value="modelValue[lang]"
    :type="inputType"
    :label="placeholder"
    :rules="rules"
    dense
    outlined
    @update:model-value="handleInput"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  lang: {
    type: String,
    required: true,
  },
  inputType: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const handleInput = (value) => {
  const newValue = { ...props.modelValue, [props.lang]: value }
  emit('update:modelValue', newValue)
}

const rules = computed(() => [
  (val) => !props.required || (val && val.length > 0) || 'Campo obbligatorio',
])
</script>
