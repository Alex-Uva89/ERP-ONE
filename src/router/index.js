import { defineRouter } from '#q-app/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import { useComponentStore } from 'stores/component-store.js'

// Importa tutti i file Vue nella cartella pages/
const pageModules = import.meta.glob('../pages/*.vue')  // Nota: usa path relativo

const baseRoutes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/WelcomePage.vue') }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

// Funzione per creare rotte dinamiche dai componenti
function generateRoutesFromComponents(components) {
  return components
    .filter(c => c.visibility)
    .map(c => {
      const filePath = `../pages/${c.componentName}`
      const dynamicImport = pageModules[filePath]

      if (!dynamicImport) {
        console.warn(`⚠️ Componente non trovato: ${filePath}`)
        return null
      }

      return {
        path: c.path,
        component: () => import('layouts/MainLayout.vue'),
        children: [
          {
            path: '',
            component: dynamicImport
          }
        ]
      }
    })
    .filter(Boolean) // rimuove eventuali null
}

export default defineRouter(async function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const componentStore = useComponentStore()
  await componentStore.fetchComponents()

  const dynamicRoutes = generateRoutesFromComponents(componentStore.components)

  const routes = [...baseRoutes, ...dynamicRoutes]

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  return Router
})
