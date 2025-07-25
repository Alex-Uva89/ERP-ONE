<template>
  <q-page style="width: 100%">
    <div class="q-pa-md">
      <BarActions :actions="barActions" @item-clicked="handleBarActionClick" />

      <!-- {{ console.log('category in referencePage', categoryStore.selectedCategory) }} -->
      <q-separator v-if="barActions" class="m-y-2" />

      <div class="flex no-wrap">
        <!--
        ======================================================================
        =                         CATEGORIES                                 =
        ======================================================================
        -->
        <div v-if="categoryStore.category" class="q-mr-lg">
          <TitleComponent :title="'Categories'" />
          <TreeNode :nodes="categoryStore.category" />
          <!-- <pre>
            {{ categoryStore.selectedCategory }}
          </pre> -->
        </div>
        <div class="full-width">
          <!--
          ======================================================================
          =                         LOADING                                    =
          ======================================================================
          -->
          <div v-if="loading" class="q-pa-xl flex flex-center" style="height: 60vh">
            <q-spinner-hourglass color="primary" size="4em" />
          </div>

          <!--
          ======================================================================
          =                         NO RESULT                                  =
          ======================================================================
          -->
          <div v-else-if="rows.length === 0" class="q-pa-xl text-center" style="height: 60vh">
            <q-icon name="sentiment_dissatisfied" size="48px" color="grey-6" />
            <div class="text-h6 q-mt-md">Nessun prodotto trovato</div>
          </div>

          <!--
          ======================================================================
          =                         REFERENCES                                 =
          ======================================================================
          -->
          <div v-else>
            <div class="q-table__top row items-center q-gutter-sm q-mb-md">
              <TitleComponent />
              <q-space />
              <q-input
                borderless
                dense
                debounce="300"
                v-model="filter"
                placeholder="Search"
                style="max-width: 250px"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <q-table
              class="q-ma-sm cursor-pointer"
              :rows="rows"
              :columns="columns"
              row-key="name"
              style="width: 100%"
              grid
            >
              <template v-slot:item="props">
                <q-card
                  flat
                  bordered
                  @click="showDetail(props.row)"
                  class="q-ma-md"
                  :class="{ 'no-variant': props.row.noVariant }"
                >
                  <q-card-section>
                    <div v-for="[key, value] in Object.entries(props.row).slice(0, 4)" :key="key">
                      <template v-if="key != 'id'">
                        <strong>{{ key }}</strong
                        >: {{ value }}
                      </template>
                    </div>
                  </q-card-section>
                </q-card>
              </template>
            </q-table>
          </div>
        </div>
      </div>
    </div>
    <!--
    INFO : da eseguire lunedi
    1) le reference devono essere mostrate per lang in quanto lo schema corretto dei dati è con le diverse lang. Guardare lista reference nello specifico: PIPPUZZO (unico corretto)
    2) tutto ciò che contiene id NON deve essere mostrato nelle card
    3) attualmente nella card reference chiusa si mostra il nome della referenza e non della variante (devono comparire entrambi uno sotto l'altro e poi la categoria)
    4) se dopo aver selezionato una categoria si tolgono tutte le categorie selezionate da Alberatura categorie , rimangono mostrate le reference e non vengono aggiornate a mostrare TUTTE  le referenze, se invece nella sezione specifica o selezione ad alberature si tolgono, vengono mostrate tranquillamente le categorie
    5) se ci sono più categorie selezionate, e si aggiunge una referenza, viene aperta l'ultima categoria selezionata. Invece dovrebbe far scegliere tra quelle selezionate.
    6) attualmente non esiste il modulo di aggiunta reference se non ci sono categorie selezionate.
    7) manca l'aggiunta delle varianti.
    8) da modificare la vista delle reference, nella lista iniziale si devono vedere solo le reference, aprendo i dettagli si mostrano le varianti.
    -->
    <!--
      ======================================================================
      =                     DIALOG: DETAILS REFERENCE                      =
      ======================================================================
    -->
    <q-dialog
      v-model="dialog"
      full-width
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="q-ma-sm" style="position: relative">
        <q-btn
          icon="close"
          color="white"
          flat
          round
          @click="dialog = false"
          class="absolute-top-right q-ma-lg z-top"
        />
        <q-card-section>
          <q-banner class="bg-primary text-white q-mb-md">
            <div>{{ detailTitle }}</div>
          </q-banner>

          <div class="q-pa-sm">
            <div v-if="detailText.data">
              <!-- Se i dati sono strutturati -->
              <template
                v-if="
                  detailText.data.referenceType && detailText.data[detailText.data.referenceType]
                "
              >
                <!-- {{ console.log('DEBUG', detailText) }} -->
                <q-list bordered class="rounded-borders">
                  <q-item>
                    <q-item-section class="row q-col-gutter-md">
                      <div
                        v-for="(value, key) in detailText.data[detailText.data.referenceType]"
                        :key="key"
                        class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2"
                      >
                        <div class="text-caption text-weight-medium text-primary">
                          {{ key }}
                        </div>
                        <div class="text-body2">
                          {{ formatValue(value) }}
                        </div>
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
                <q-btn
                  color="primary"
                  label="Modifica dati"
                  flat
                  dense
                  rounded
                  icon="add"
                  class="q-mt-sm"
                  @click="openEdit(detailText)"
                />
              </template>

              <!-- Se i dati non sono strutturati -->
              <template v-else>
                <div class="text-grey-6 q-opacity-50 q-mb-md">
                  <q-toolbar class="text-white text-uppercase q-mb-sm bg-red">
                    ⚠️ Dati non strutturati
                  </q-toolbar>
                  <ul class="q-pl-md">
                    <li v-for="(value, key) in detailText.data" :key="key" class="q-mb-xs">
                      <span class="text-weight-medium">{{ key }}:</span>
                      {{ formatValue(value) }}
                    </li>
                  </ul>
                  <q-btn
                    color="primary"
                    label="Aggiungi dati"
                    flat
                    dense
                    rounded
                    icon="add"
                    class="q-mt-sm"
                    @click="openEdit(detailText)"
                  />
                </div>
              </template>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!--
      ======================================================================
      =                  DIALOG: ADD/EDIT DETAILS REFERENCE                     =
      ======================================================================
    -->
    <q-dialog v-model="opendialogEdit" persistent>
      <q-card style="width: 1400px; max-width: 90vw">
        <!--
                       _____________________________________________________________________
                      |                                                                     |
                      |                            HEADER FORM                              |
                      |_____________________________________________________________________|
        -->
        {{ console.log('itemDIALOG', itemDialog) }}
        <q-card-section class="row items-center q-pa-md q-mb-md bg-grey-2">
          <div class="text-h6" v-if="detailText.data[detailText.data.referenceType]">
            Modifica {{ detailTitle }}
          </div>
          <div v-else>Modifica elemento</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="opendialogEdit = false" />
        </q-card-section>
        <!--
                       _____________________________________________________________________
                      |                                                                     |
                      |                             BODY FORM                               |
                      |_____________________________________________________________________|
        -->
        <q-card-section>
          <q-form
            @submit="onSubmit"
            @reset="onReset"
            class="q-gutter-md row q-col-gutter-md justify-center"
            ref="editForm"
          >
            <template v-for="(field, key) in dataSchema" :key="field.id">
              <!--
                  _____________________________________________________________________
                 |                                                                     |
                 |                            INPUT i18n                               |
                 |_____________________________________________________________________|
              -->

              <div v-if="field.i18n === true" class="col-12 col-md-3">
                <div class="text-subtitle2 q-mb-xs">{{ key }}</div>
                <q-input
                  filled
                  color="teal-4"
                  v-model="itemDialog.data[itemDialog.data.referenceType][key]"
                  :label="field.properties[lang].placeholder"
                  class="q-pb-md"
                />
              </div>

              <!--
                   _____________________________________________________________________
                  |                                                                     |
                  |                        INPUT WHITOUT i18n                           |
                  |_____________________________________________________________________|
              -->

              <div v-else class="col-12 col-md-3">
                <div class="text-subtitle2 q-mb-xs">{{ key }}</div>
                <!--
                   _____________________________________________________________________
                  |                                                                     |
                  |                            INPUT TEXT                               |
                  |_____________________________________________________________________|
                -->

                <template v-if="['text', 'textarea'].includes(field.inputType)">
                  <q-input
                    filled
                    :type="field.inputType"
                    :label="field.placeholder"
                    color="teal-4"
                    v-model="itemDialog.data[itemDialog.data.referenceType][key]"
                  />
                </template>

                <!--
                   _____________________________________________________________________
                  |                                                                     |
                  |                           INPUT NUMBER                              |
                  |_____________________________________________________________________|
                -->

                <template v-else-if="field.inputType === 'number'">
                  <q-input
                    filled
                    color="teal-4"
                    :type="field.inputType"
                    :label="field.placeholder"
                    :max="field.maximum"
                    :min="field.minimum"
                    v-model.number="itemDialog.data[itemDialog.data.referenceType][key]"
                  />
                </template>

                <!--
                   _____________________________________________________________________
                  |                                                                     |
                  |                            INPUT RANGE                              |
                  |_____________________________________________________________________|
                -->

                <template v-else-if="field.type === 'object'">
                  <q-range
                    v-model="itemDialog.data[itemDialog.data.referenceType][key]"
                    :min="field.properties.min.minimum"
                    :max="field.properties.max.maximum"
                    :step="1"
                    :left-label-value="
                      itemDialog.data[itemDialog.data.referenceType][key]?.min + 'px'
                    "
                    :right-label-value="
                      itemDialog.data[itemDialog.data.referenceType][key]?.max + 'px'
                    "
                    label-always
                    switch-label-side
                    color="purple"
                  />

                  <!-- {{ field }} -->
                </template>
              </div>
            </template>
          </q-form>
        </q-card-section>

        <!--
                       _____________________________________________________________________
                      |                                                                     |
                      |                            FOOTER FORM                              |
                      |_____________________________________________________________________|
        -->

        <q-card-actions
          :align="$q.screen.lt.md ? 'center' : 'right'"
          class="q-pa-md bg-grey-2 q-mt-md"
        >
          <q-btn flat label="Annulla" color="grey-7" @click="resetEditForm" />
          <q-btn unelevated label="Salva" color="primary" @click="submitEditForm" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!--
      ======================================================================
      =                     DIALOG: ADD REFERENCE                          =
      ======================================================================
    -->
    <q-dialog v-model="opendialog">
      <q-card flat class="q-pa-lg">
        <q-card-section v-if="itemDialog.label === 'New Reference'">
          <template v-if="categoryStore.selectedCategory.length > 0">
            <DynamicForm
              :schema="
                categoryStore.category?.[0]?.reference_data_schema?.properties?.WINE?.properties
              "
              @closeDialog="opendialog = false"
              @saved="refreshReferences"
            />
          </template>
          <template v-else> scegli la categoria a cui agiungere la referenza </template>
        </q-card-section>
        <q-card-section v-else> Nuova variante </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
// =====================
//         VUE
// =====================
import { ref, onMounted, watch, computed } from 'vue'
// import axios from 'axios'

// =====================
//     COMPONENTS
// =====================
import BarActions from 'components/BarActions.vue'
import TitleComponent from 'src/components/TitleComponent.vue'
import DynamicForm from 'src/components/form/DynamicForm.vue'
import TreeNode from 'components/TreeNode.vue'

// =====================
//        STORES
// =====================
import { useReferencesStore } from 'stores/references-store.js'
import { useCategoryStore } from 'src/stores/category-store'
// import { useAppServicesStore } from 'src/stores/app-services-store'

const referencesStore = useReferencesStore()
const categoryStore = useCategoryStore()
// const appServicesStore = useAppServicesStore()

// =====================
//      VARIABLES
// =====================
const barActions = ref([])
const lang = ref('it')
const filter = ref('')
const columns = ref([])
const rows = ref([])
const loading = ref(true)
const maximizedToggle = ref(true)
const dataSchema = ref(null)

// =====================
//     const DIALOG
// =====================
const dialog = ref(false)
const opendialog = ref(false)
const opendialogEdit = ref(false)
const itemDialog = ref([])
const detailText = ref({})

function showDetail(row) {
  // console.log('ROW DETAIL PRIMA', detailText.value)
  detailText.value = row
  dialog.value = true
  // console.log('ROW DETAIL DOPO', detailText.value)
}

// ===========================
//     CREATION ROW
// ===========================

function transformReferences(inputProxy, selectedCategoryIds = []) {
  const references = inputProxy?.[Symbol.iterator] ? [...inputProxy] : []
  const rows = []

  for (const item of references) {
    const ref = item.reference || {}
    const referenceData = ref.data || {}
    const variants = ref.variants
    const categoryId = item.category?.id

    // console.log('ITEM', item)

    // Se selectedCategoryIds è vuoto, prendi tutte le referenze senza filtro
    if (selectedCategoryIds.length === 0 || selectedCategoryIds.includes(categoryId)) {
      // qui puoi fare un log per debug
      if (selectedCategoryIds.length === 0) {
        // console.log('Nessuna categoria selezionata, mostro tutte le referenze')
      } else {
        // console.log('MATCHED categoryId:', categoryId)
      }

      const base = {
        id: ref.business_owner.id,
        name: ref.i18n_key,
        category: item.category?.i18n_key,
        category_id: item.category?.business_owner_id,
        owner: item.business_owner?.owner_id,
        isActive: ref.is_active,
      }

      if (Array.isArray(variants) && variants.length > 0) {
        for (const variant of variants) {
          const mergedData = {
            ...referenceData,
            ...variant.data,
          }

          rows.push({
            ...base,
            variantId: variant.id,
            barcode: variant.barcode,
            stock: variant.stock,
            data: mergedData,
          })
        }
      } else {
        rows.push({
          ...base,
          variantId: null,
          noVariant: true,
          // ...referenceData,
          data: referenceData,
        })
      }
    }
  }

  // console.log('rows alla fine', rows)

  return rows
}

function formatValue(val) {
  // Se è un array, unisci con virgole
  if (Array.isArray(val)) {
    return val.join(', ')
  }

  // Se è un oggetto (o Proxy), gestiscilo
  if (val && typeof val === 'object') {
    const raw = val.__v_raw || val
    const obj = raw?.value ?? raw

    if (obj && typeof obj[lang.value] === 'string') {
      return obj[lang.value]
    }

    // Riconosci specificamente serving_temperature o oggetti con min/max
    if (obj.min != null && obj.max != null) {
      return `${obj.min}°C - ${obj.max}°C`
    }

    // Fallback: mostra l'intero oggetto come JSON stringa
    return JSON.stringify(obj)
  }

  // Altrimenti, ritorna il valore così com'è
  return val
}

// ===========================
//     REFRESH REFERENCES
// ===========================

async function refreshReferences() {
  await referencesStore.fetchReferences()
  rows.value = transformReferences(
    referencesStore.references,
    categoryStore.selectedCategory.map((c) => c?.id || c),
  )
}

function handleBarActionClick(action) {
  // console.log('Azione cliccata:', action)
  itemDialog.value = action
  opendialog.value = true
}

// =====================
//     OPEN EDIT
// =====================

async function openEdit(valore) {
  itemDialog.value = valore
  opendialogEdit.value = true
  await categoryStore.fetchDataSchema(valore.category_id)
  // console.log('DEBUG in OPENEDIT', categoryStore.category_schema)
  dataSchema.value =
    categoryStore.category_schema.reference_data_schema.properties[
      categoryStore.category_schema.reference_data_schema.properties.referenceType.const
    ].properties
  // console.log('DATA SCHEMA', dataSchema.value)
}

// ===========================
//     CREATE EDIT TITLE
// ===========================

const detailTitle = computed(() => {
  const data = detailText.value?.data
  const refType = data?.referenceType

  let nameCandidate

  //  _____________________________________________________________________
  // |                                                                     |
  // |          Caso 1: data ha referenceType e oggetto annidato           |
  // |_____________________________________________________________________|

  if (refType && typeof data?.[refType] === 'object') {
    nameCandidate = data[refType]?.name
  }

  //  _____________________________________________________________________
  // |                                                                     |
  // |             Caso 2: data ha direttamente un name (piatto)           |
  // |_____________________________________________________________________|
  else if (data?.name) {
    nameCandidate = data.name
  }

  //  _____________________________________________________________________
  // |                                                                     |
  // |                  Caso 3: name è un oggetto con lingue               |
  // |_____________________________________________________________________|
  if (typeof nameCandidate === 'object' && nameCandidate !== null) {
    return nameCandidate[lang.value] ?? Object.values(nameCandidate)[0] ?? 'Dettagli'
  }

  //  _____________________________________________________________________
  // |                                                                     |
  // |                  Caso 4: name è una stringa semplice                |
  // |_____________________________________________________________________|
  return nameCandidate ?? detailText.value?.categoryName ?? 'Dettagli'
})

// ===========================
//       SUBMIT FORM
// ===========================

function submitEditForm() {
  this.$refs.editForm.submit()
}

function onSubmit() {
  console.log('Form inviato!')
  // salva i dati qui...
}

// ===========================
//        RESET FORM
// ===========================

function resetEditForm() {
  this.$refs.editForm.reset
}

function onReset() {
  console.log('Form resettato!')
}

onMounted(async () => {
  loading.value = true
  await referencesStore.fetchReferences()
  await categoryStore.fetchCategory()
  loading.value = false

  rows.value = transformReferences(
    referencesStore.references,
    categoryStore.selectedCategory.map((c) => c?.id || c),
  )

  function getWinePropsFromSelectedCategories() {
    const selected = categoryStore.selectedCategory
    if (!selected || selected.length === 0) return null

    const matchedCategories = categoryStore.category?.filter((cat) =>
      selected.includes(cat.name || cat.id),
    )

    const mergedProps = {}

    matchedCategories?.forEach((cat) => {
      const wineProps = cat.reference_data_schema?.properties?.WINE?.properties
      if (wineProps) {
        Object.assign(mergedProps, wineProps) // Unisce i campi
      }
    })

    return mergedProps
  }

  const wineProps = getWinePropsFromSelectedCategories()

  // console.log('wineProps', wineProps)
  if (wineProps) {
    columns.value = Object.keys(wineProps).map((key) => ({
      name: key,
      label: key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      field: key,
      align: 'left',
      sortable: true,
    }))
  }

  try {
    const response = await fetch('/barActions/referencesBarActions.json')
    barActions.value = await response.json()
  } catch (error) {
    console.error('Errore nel caricamento del JSON:', error)
  }
})

watch(
  () => categoryStore.selectedCategory,
  (newVal) => {
    referencesStore.fetchReferences()
    rows.value = transformReferences(
      referencesStore.references,
      newVal.map((c) => c.category_id),
    )
  },
  { immediate: true, deep: true },
)
</script>

<style lang="css">
.my-label .q-item__label--caption.text-caption {
  font-weight: bold;
  font-size: 0.9rem;
}

.q-table__grid-item {
  max-height: 300px;
  overflow: hidden;
  cursor: pointer;
}

.q-dialog__inner--minimized > div {
  max-width: none;
}

.no-variant {
  background: linear-gradient(135deg, #ffe6e6, #ffcccc);
  opacity: 0.7;
  border-radius: 8px;
  box-shadow: 0 0 8px 2px rgba(255, 0, 0, 0.3);
  transition: opacity 0.3s ease;
}

.no-variant:hover {
  opacity: 1;
}
</style>
