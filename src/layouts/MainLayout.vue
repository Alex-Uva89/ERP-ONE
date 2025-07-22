<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <!-- BTN to open LEFT -->
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <template v-if="appOwner.official_name">
            <q-avatar>
              <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
            </q-avatar>
            {{ appOwner.official_name }}
          </template>
        </q-toolbar-title>

        <!-- BTN to open RIGHT -->
        <q-btn @click="toggleRightDrawer">
          <Avatar />
        </q-btn>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab
          v-for="component in componentStore.visibleComponents"
          :to="component.path"
          :label="component.i18n_key"
          v-bind:key="component.id"
        />
      </q-tabs>
    </q-header>

    <!-- LEFT -->
    <q-drawer v-model="leftDrawerOpen" side="left" bordered>
      <q-list class="m-y-7">
        <EssentialMenu v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <!-- RIGHT -->
    <q-drawer v-model="rightDrawerOpen" side="right" bordered>
      <q-list class="m-y-7">
        <EssentialMenu v-for="link in linksListAcccount" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container class="m-x-4">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import EssentialMenu from 'components/EssentialMenu.vue'
import Avatar from 'components/AvatarSquare.vue'
import { useComponentStore } from 'stores/component-store.js'
import { useAppServicesStore } from 'stores/app-services-store.js'

const componentStore = useComponentStore()
const appServicesStore = useAppServicesStore()

const leftDrawerOpen = ref(false)
const rightDrawerOpen = ref(false)

const appOwner = computed(() => appServicesStore.owner)
const linksList = computed(() => appServicesStore.linkServices)

const linksListAcccount = [
  {
    title: 'Mio profilo',
    caption: 'Vai al tuo profilo',
    icon: 'person',
  },
  {
    title: 'Logout',
    caption: 'Esci dal tuo profilo',
    icon: 'logout',
  },
]

onMounted(async () => {
  await componentStore.fetchComponents()
  await appServicesStore.fetchLinkServices()
  await appServicesStore.fetchOwner()
  // console.log('Dati caricati:', componentStore.components)
})

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value
}
</script>
