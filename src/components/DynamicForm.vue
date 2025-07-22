<template>
  <q-form
    class="q-pa-md bg-white rounded-borders shadow-2 flex flex-wrap justify-between"
    @submit.prevent="handleSubmit"
  >
    <q-toolbar
      class="bg-primary text-white q-mb-md q-py-sm"
      style="font-weight: 600; font-size: 1.25rem"
    >
      Aggiungi referenza a
      {{ categoryStore.selectedCategory[0].i18n_key }}
    </q-toolbar>
    {{ console.log('selectedCategory', categoryStore.selectedCategory) }}
    <q-toolbar
      v-if="successMessageVisible"
      class="bg-green-4 text-white q-mb-md q-py-sm"
      style="font-weight: 500; font-size: 1rem"
    >
      Inviato correttamente!
    </q-toolbar>

    <div
      v-for="(fieldSchema, fieldName) in schema"
      :key="fieldName"
      class="form-item q-mb-md"
      style="flex-basis: 48%; min-width: 280px"
    >
      <component
        :is="getFieldComponent(fieldSchema)"
        v-model="form[fieldName]"
        :label="getLabel(fieldSchema, fieldName)"
        :type="fieldSchema.inputType"
        :options="getOptions(fieldSchema)"
        :hint="getHint(fieldSchema)"
        dense
        outlined
        style="width: 100%"
      />
    </div>

    <!-- Bottone submit -->
    <div class="q-mt-md full-width flex justify-end">
      <q-btn type="submit" color="primary" label="Salva" icon="save" unelevated no-caps />
    </div>
  </q-form>
</template>

<script setup>
import axios from 'axios'
import { reactive, watchEffect, ref } from 'vue'
import { QInput, QSelect } from 'quasar'

import { useCategoryStore } from 'src/stores/category-store'

const categoryStore = useCategoryStore()

const props = defineProps({
  schema: {
    type: Object,
    required: true,
  },
  lang: {
    type: String,
    default: 'it',
  },
})

const form = reactive({})
const successMessageVisible = ref(false)
const emit = defineEmits(['closeDialog'])

async function handleSubmit() {
  const ownerId = categoryStore.selectedCategory[0]?.owner_id
  const entityId = 6

  console.log('categorySelected in submit', categoryStore.selectedCategory[0])

  const fullReference = {
    business_entity_ids: null,
    category_business_owner_id: categoryStore.selectedCategory[0]?.id,
    i18n_key: form.name || 'default_key',
    data: {
      WINE: { ...form },
      referenceType: 'WINE',
    },
  }

  try {
    const response = await axios.put(
      `http://localhost:18080/xApp/reference/by_owner/RVSIII/add`,
      {
        owner_id: ownerId,
        entity_id: entityId,
        full_reference: fullReference,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Errore nella richiesta: ${response.status}`)
    }

    console.log('Dati inviati con successo!', fullReference)

    // Svuota i campi del form
    for (const key in form) {
      if (typeof form[key] === 'string' || typeof form[key] === 'number') {
        form[key] = ''
      } else if (Array.isArray(form[key])) {
        form[key] = []
      } else if (typeof form[key] === 'object' && form[key] !== null) {
        form[key] = {}
      }
    }

    successMessageVisible.value = true

    emit('saved')

    setTimeout(() => {
      emit('closeDialog')
    }, 2000)
  } catch (error) {
    console.error('Errore durante l’invio:', error)
  }
}

watchEffect(() => {
  for (const key in props.schema) {
    if (!(key in form)) {
      form[key] = ''
    }
  }
})

function getFieldComponent(fieldSchema) {
  if (fieldSchema.inputType === 'number') return QInput
  if (fieldSchema.inputType === 'text') return QInput
  if (Array.isArray(fieldSchema.options)) return QSelect
  return QInput
}

function getLabel(fieldSchema, fieldName) {
  if (fieldSchema?.i18n && fieldSchema?.properties?.[props.lang]) {
    return fieldSchema.properties[props.lang].placeholder || fieldName
  }
  return fieldSchema.placeholder || fieldName
}

function getHint(fieldSchema) {
  return fieldSchema.hint || ''
}

function getOptions(fieldSchema) {
  return fieldSchema.options || []
}
</script>

<style scoped>
/* Solo per nascondere hint sotto campi dense, che non vogliamo vedere */
.q-field--dense .q-field__bottom {
  display: none !important;
}
</style>
