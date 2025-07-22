// src/boot/syncfusion.js
import { boot } from 'quasar/wrappers'
import { AccordionPlugin } from '@syncfusion/ej2-vue-navigations'
import { registerLicense } from '@syncfusion/ej2-base'

export default boot(({ app }) => {

  // console.log('Syncfusion License Key:', process.env.VITE_SYNCFUSION_LICENSE_KEY)
  registerLicense(process.env.VITE_SYNCFUSION_LICENSE_KEY)

  app.use(AccordionPlugin)
})
