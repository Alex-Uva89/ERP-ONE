<template>
  <div>
    <q-btn color="primary" label="Aggiungi" @click="openDialog" />

    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center q-pa-sm bg-primary text-white">
          <div class="text-h6">{{ title }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="handleSubmit" class="q-gutter-md">
            <q-input
              v-for="field in fields"
              :key="field.name"
              v-model="formData[field.name]"
              :label="field.label"
              :type="field.type || 'text'"
              :rules="field.rules || []"
              :hint="field.hint || ''"
              dense
              outlined
            />

            <div class="row justify-end q-gutter-sm">
              <q-btn flat label="Annulla" color="secondary" v-close-popup />
              <q-btn label="Salva" type="submit" color="primary" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  title: { type: String, default: 'Aggiungi elemento' },
  fields: {
    type: Array,
    required: true, // es: [{ name: 'name', label: 'Nome' }]
  },
  onSubmit: {
    type: Function,
    required: true,
  },
})

const showDialog = ref(false)

const formData = reactive({})

watch(
  () => props.fields,
  () => {
    props.fields.forEach((field) => {
      formData[field.name] = ''
    })
  },
  { immediate: true },
)

function openDialog() {
  showDialog.value = true
}

async function handleSubmit() {
  await props.onSubmit({ ...formData })
  showDialog.value = false
}
</script>
