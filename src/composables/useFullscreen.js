import { onMounted, onUnmounted, ref } from 'vue'

function isTypingTarget(target) {
  if (!target || typeof target !== 'object') return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable
}

export function useFullscreen() {
  const isFullscreen = ref(false)

  function sync() {
    isFullscreen.value = Boolean(document.fullscreenElement)
  }

  function toggle() {
    if (document.fullscreenElement) {
      document.exitFullscreen?.()
      return
    }
    document.documentElement.requestFullscreen?.()
  }

  function onKeydown(event) {
    if (event.key !== 'f' && event.key !== 'F') return
    if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return
    if (isTypingTarget(event.target)) return
    event.preventDefault()
    toggle()
  }

  onMounted(() => {
    sync()
    document.addEventListener('fullscreenchange', sync)
    window.addEventListener('keydown', onKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('fullscreenchange', sync)
    window.removeEventListener('keydown', onKeydown)
  })

  return { isFullscreen, toggle }
}
