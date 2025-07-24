<template>
  <q-page padding>
    <title-component />

    <div class="q-mt-md">
      <q-card flat bordered class="bg-grey-1 q-pa-md">
        <q-card-section>
          <div class="text-h6">Dettagli Proprietario</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="row q-col-gutter-md">
            <q-item v-for="item in infoItems" :key="item.label" class="col-12 col-md-6">
              <q-item-section>
                <q-item-label class="text-subtitle2 text-grey-8">{{ item.label }}</q-item-label>
                <q-item-label class="text-body1">{{ item.value }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useAppServicesStore } from 'src/stores/app-services-store'
import TitleComponent from 'components/TitleComponent.vue'

const appServicesStore = useAppServicesStore()

onMounted(() => {
  appServicesStore.fetchOwner()
})

const owner = computed(() => appServicesStore.owner)

const infoItems = computed(() => {
  if (!owner.value) return []

  return [
    { label: 'ID', value: owner.value.id },
    { label: 'Nome ufficiale', value: owner.value.official_name || '—' },
    { label: 'Creato il', value: new Date(owner.value.created_ts).toLocaleString() },
    { label: 'Creato da Account ID', value: owner.value.created_by_account_id },
    {
      label: 'Valuta',
      value: `${owner.value.currency?.code ?? '—'} (${owner.value.currency?.symbol ?? '—'})`,
    },
    { label: 'Nome valuta', value: owner.value.currency?.data?.full_name?.it ?? '—' },
  ]
})
</script>

<style scoped>
.q-page {
  max-width: 1000px;
  margin: auto;
}
</style>
