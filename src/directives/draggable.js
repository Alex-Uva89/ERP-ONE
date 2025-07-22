export default {
  mounted(el, binding) {
    el.setAttribute('draggable', true)

    el.addEventListener('dragstart', (event) => {
      // Opzionale: usa binding.value per passare dati custom
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', binding.value || el.innerText)
      el.classList.add('dragging')
    })

    el.addEventListener('dragend', () => {
      el.classList.remove('dragging')
    })
  },
  unmounted(el) {
    el.removeAttribute('draggable')
  }
}
