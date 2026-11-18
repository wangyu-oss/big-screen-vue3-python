import { computed, ref } from 'vue'

export const THEMES = {
  cyan: {
    name: '深空蓝',
    accent: '#22d3ee',
    accent2: '#38bdf8',
    glow: 'rgba(34, 211, 238, 0.45)',
    series: ['#22d3ee', '#38bdf8', '#818cf8', '#34d399', '#fbbf24', '#f472b6'],
  },
  purple: {
    name: '星云紫',
    accent: '#a78bfa',
    accent2: '#c084fc',
    glow: 'rgba(167, 139, 250, 0.45)',
    series: ['#a78bfa', '#c084fc', '#22d3ee', '#f472b6', '#fbbf24', '#34d399'],
  },
  green: {
    name: '极光绿',
    accent: '#34d399',
    accent2: '#2dd4bf',
    glow: 'rgba(52, 211, 153, 0.45)',
    series: ['#34d399', '#2dd4bf', '#22d3ee', '#a3e635', '#fbbf24', '#a78bfa'],
  },
}

const ORDER = ['cyan', 'purple', 'green']

export const themeKey = ref('cyan')

export const themeConfig = computed(() => THEMES[themeKey.value])

export const themeSeries = computed(() => themeConfig.value.series)

export function setTheme(key) {
  if (THEMES[key]) themeKey.value = key
}

export function cycleTheme() {
  const index = ORDER.indexOf(themeKey.value)
  themeKey.value = ORDER[(index + 1) % ORDER.length]
}
