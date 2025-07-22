// src/boot/directives.js
import { boot } from 'quasar/wrappers'

const directives = import.meta.glob('../directives/*.js', { eager: true })

export default boot(({ app }) => {
  Object.values(directives).forEach(module => {
    // Se la direttiva è export default
    const directive = module.default || module
    // Usa il nome del file senza estensione come nome direttiva (es: draggable)
    const name = module.__file
      ? module.__file.split('/').pop().replace('.js', '')
      : 'customDirective'
    
    app.directive(name, directive)
  })
})
