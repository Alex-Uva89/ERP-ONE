<template>
  <template v-for="(item, index) in items" :key="index">
    <q-item clickable dense @click.stop v-close-popup="!item.children">
      <q-item-section @click="handleItemClick(item)">{{ item.label }}</q-item-section>
      <q-item-section v-if="item.children" side>
        <q-icon name="keyboard_arrow_right" />
      </q-item-section>

      <!-- Sottomenu annidato -->
      <q-menu v-if="item.children" anchor="top end" self="top start" auto-close>
        <q-list>
          <BarMenuList :items="item.children" />
        </q-list>
      </q-menu>
    </q-item>
  </template>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['item-clicked'])

function handleItemClick(item) {
  console.log(item)
  if (!item.children) {
    emit('item-clicked', item)
  }
}
</script>
