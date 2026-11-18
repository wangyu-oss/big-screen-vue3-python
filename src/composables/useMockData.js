import { onMounted, onUnmounted, ref } from 'vue'

/** 本地模拟数据源：定时器驱动数值在区间内平滑波动。 */

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomFloat(min, max, digits = 1) {
  const n = Math.random() * (max - min) + min
  const p = 10 ** digits
  return Math.round(n * p) / p
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function walk(value, step, min, max, digits = 0) {
  const next = clamp(value + (Math.random() * 2 - 1) * step, min, max)
  const p = 10 ** digits
  return Math.round(next * p) / p
}

export function pick(list) {
  return list[Math.floor(Math.random() * list.length)]
}

export function useIntervalData(initial, producer, interval) {
  const data = ref(initial)
  let timer = 0

  onMounted(() => {
    timer = window.setInterval(() => {
      const next = producer(data.value)
      if (next !== undefined) data.value = next
    }, interval)
  })

  onUnmounted(() => {
    window.clearInterval(timer)
  })

  return data
}
