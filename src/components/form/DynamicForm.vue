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
      <div class="text-subtitle2 q-mb-xs">{{ fieldName }}</div>
      <template v-if="fieldSchema.i18n">
        <FormFieldI18n
          v-model="form[fieldName]"
          :lang="lang"
          :input-type="fieldSchema.properties[lang].inputType"
          :placeholder="fieldSchema.properties[lang].placeholder"
          :required="fieldSchema.required?.includes(lang)"
        />
      </template>

      <template v-else-if="fieldSchema.inputType === 'number'">
        <FormFieldNumber
          v-model="form[fieldName]"
          :placeholder="fieldSchema.placeholder"
          :minimum="fieldSchema.minimum"
          :maximum="fieldSchema.maximum"
          :required="fieldSchema.required"
        />
      </template>

      <template v-else-if="fieldSchema.type === 'object' && fieldSchema.properties?.min">
        <FormFieldRange
          v-model="form[fieldName]"
          :min-limit="fieldSchema.properties.min.minimum"
          :max-limit="fieldSchema.properties.max.maximum"
          :step="fieldSchema.properties.min.multipleOf || 0.1"
        />
      </template>

      <template v-else>
        <FormFieldText
          v-model="form[fieldName]"
          :input-type="fieldSchema.inputType"
          :placeholder="fieldSchema.placeholder"
          :required="fieldSchema.required"
        />
      </template>
    </div>
    <!--
        _____________________________________________________________________
       |                                                                     |
       |                              BTN SUBMIT                             |
       |_____________________________________________________________________|
    -->
    <div class="q-mt-md full-width flex justify-end">
      <q-btn type="submit" color="primary" label="Salva" icon="save" unelevated no-caps />
    </div>
  </q-form>
</template>

<script setup>
//  _____________________________________________________________________
// |                                                                     |
// |                             COMPONENTS                              |
// |_____________________________________________________________________|
//
import FormFieldText from './fields/FormFieldText.vue'
import FormFieldNumber from './fields/FormFieldNumber.vue'
import FormFieldI18n from './fields/FormFieldI18n.vue'
import FormFieldRange from './fields/FormFieldRange.vue'

import axios from 'axios'
import { reactive, watchEffect, ref } from 'vue'

//  _____________________________________________________________________
// |                                                                     |
// |                               STORES                                |
// |_____________________________________________________________________|
//

import { useCategoryStore } from 'src/stores/category-store'
const categoryStore = useCategoryStore()

//  _____________________________________________________________________
// |                                                                     |
// |                            PROPS & EMIT                             |
// |_____________________________________________________________________|
//

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
const emit = defineEmits(['closeDialog'])

const form = reactive({})
const successMessageVisible = ref(false)

//  _____________________________________________________________________
// |                                                                     |
// |                           FUNCTION SUBMIT                           |
// |_____________________________________________________________________|
//

async function handleSubmit() {
  const ownerId = categoryStore.selectedCategory[0]?.owner_id
  const entityId = 6

  // console.log('categorySelected in submit', categoryStore.selectedCategory[0])

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

//  _____________________________________________________________________
// |                                                                     |
// |                           CREATION FORM                             |
// |_____________________________________________________________________|
//
watchEffect(() => {
  for (const key in props.schema) {
    if (!(key in form)) {
      const field = props.schema[key]

      //  _____________________________________________________________________
      // |                                                                     |
      // |                                i18n                                 |
      // |_____________________________________________________________________|
      if (field.i18n === true && field.properties) {
        const translations = {}
        for (const lang in field.properties) {
          translations[lang] = ''
        }
        form[key] = translations
      }

      //  _____________________________________________________________________
      // |                                                                     |
      // |                    OBJECT NOT I18n & InputType                      |
      // |_____________________________________________________________________|
      //
      else if (field.type === 'object' && field.properties) {
        const nested = {}
        for (const subKey in field.properties) {
          const subField = field.properties[subKey]
          if (subKey === 'max' && typeof subField.maximum === 'number') {
            nested[subKey] = subField.maximum
          } else if (subKey === 'min' && typeof subField.minimum === 'number') {
            nested[subKey] = subField.minimum
          } else {
            nested[subKey] = 0
          }
        }
        form[key] = nested
      }

      //  _____________________________________________________________________
      // |                                                                     |
      // |                               NUMBER                                |
      // |_____________________________________________________________________|
      //
      else if (field.inputType === 'number') {
        form[key] = 0
      }

      //  _____________________________________________________________________
      // |                                                                     |
      // |                             NOT i18n                                |
      // |_____________________________________________________________________|
      //
      else if (field.inputType === 'text' || field.inputType === 'textArea') {
        form[key] = ''
      }

      //  _____________________________________________________________________
      // |                                                                     |
      // |                            DEFAULT CASE                             |
      // |_____________________________________________________________________|
      //
      else {
        form[key] = ''
      }
    }
  }
})

//  _____________________________________________________________________
// |                                                                     |
// |             -------------------DEBUG-------------------             |
// |_____________________________________________________________________|
//

// console.log('SCHEMA', props.schema)
// console.log('FORM', form)
</script>

<style scoped>
.q-field--dense .q-field__bottom {
  display: none !important;
}
</style>
