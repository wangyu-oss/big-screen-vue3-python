import { computed, onMounted, onUnmounted, ref } from 'vue'

export function useScreenScale(baseWidth = 1920, baseHeight = 1080) {
  const viewport = ref({ w: window.innerWidth, h: window.innerHeight })

  function update() {
    viewport.value = { w: window.innerWidth, h: window.innerHeight }
  }

  const scale = computed(() =>
    Math.min(viewport.value.w / baseWidth, viewport.value.h / baseHeight),
  )

  const screenStyle = computed(() => {
    const s = scale.value
    const x = (viewport.value.w - baseWidth * s) / 2
    const y = (viewport.value.h - baseHeight * s) / 2
    return {
      width: `${baseWidth}px`,
      height: `${baseHeight}px`,
      transform: `translate3d(${x}px, ${y}px, 0) scale(${s})`,
      transformOrigin: 'top left',
    }
  })

  onMounted(() => {
    update()
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', update)
    window.removeEventListener('orientationchange', update)
  })

  return { scale, screenStyle }
}
