import { onMounted, onUnmounted, ref } from 'vue'

const WEEKS = ['日', '一', '二', '三', '四', '五', '六']

function pad(n) {
  return String(n).padStart(2, '0')
}

export function useClock() {
  const timeText = ref('')
  const dateText = ref('')
  let timer = 0

  function tick() {
    const now = new Date()
    timeText.value = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    dateText.value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} 星期${WEEKS[now.getDay()]}`
  }

  onMounted(() => {
    tick()
    timer = window.setInterval(tick, 1000)
  })

  onUnmounted(() => {
    window.clearInterval(timer)
  })

  return { timeText, dateText }
}
