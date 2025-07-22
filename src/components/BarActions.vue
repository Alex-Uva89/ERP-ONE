<template>
  <q-bar :class="bgColor" class="q-my-lg">
    <template v-for="(action, index) in actions" :key="index">
      <div class="cursor-pointer non-selectable q-mr-md">
        <BannerOutline :title="action.label" :icon="action.icon" />
        <q-menu v-if="action.menu">
          <q-list style="min-width: 100px">
            <BarMenuList :items="action.menu" @item-clicked="handleMenuItemClick" />
          </q-list>
        </q-menu>
      </div>
    </template>
  </q-bar>
</template>

<script setup>
import BarMenuList from './BarMenuList.vue'
import BannerOutline from './QBannerOutline.vue'

defineProps({
  bgColor: {
    type: String,
    default: 'bg-white',
  },
  actions: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['item-clicked'])

function handleMenuItemClick(item) {
  emit('item-clicked', item)
}
</script>
