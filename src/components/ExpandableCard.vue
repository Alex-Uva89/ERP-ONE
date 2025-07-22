<!-- ExpandableCard.vue -->
<template>
  <q-list :bordered="bordered" class="rounded-borders">
    <q-expansion-item>
      <template v-slot:header>
        <q-item-section avatar>
          <q-avatar :square="square">
            <img :src="avatar" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          {{ title?.trim() || 'Titolo non disponibile' }}
        </q-item-section>

        <q-item-section side>
          <div class="row items-center" @click.stop>
            <RatingBar
              v-model="localRating"
              :tooltips="['Not bad', 'Good', 'Very good!']"
              :color="customColor"
              :icon="customIcon"
            />
          </div>
        </q-item-section>
      </template>

      <q-separator v-if="separator" />

      <q-card>
        <q-card-section>
          <slot>
            {{ description }}
          </slot>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-list>
</template>

<script setup>
import { ref, watch } from 'vue'
import RatingBar from 'components/RatingBar.vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  avatar: String,
  title: {
    type: [String, null],
    default: null,
  },
  description: String,
  customIcon: {
    type: String,
  },
  customColor: {
    type: String,
  },
  bordered: {
    type: Boolean,
    default: true,
  },
  separator: {
    type: Boolean,
    default: true,
  },
  square: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const localRating = ref(props.modelValue)

watch(localRating, (val) => {
  emit('update:modelValue', val)
})

watch(
  () => props.modelValue,
  (val) => {
    localRating.value = val
    // console.log('NUOVO VALORE', localRating.value)
  },
)
</script>
