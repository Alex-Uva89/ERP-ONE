<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAppServicesStore } from 'stores/app-services-store';
import { useEntityBusinessStore } from 'stores/entityBusiness.js'

const appServicesStore = useAppServicesStore() 
const appEntityBusinessStore = useEntityBusinessStore()

onMounted(async () => {
  document.querySelectorAll('div').forEach(div => {
    if (div.innerText.includes('This application was built using a trial version of Syncfusion')) {
      // console.log('pippo',div)
      div.style.display = 'none'
    }
  });

  await appServicesStore.fetchOwner()
  await appEntityBusinessStore.fetchEntities()
});

</script>

<style>


</style>
