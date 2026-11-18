export const AXIS_COLOR = 'rgba(138, 168, 196, 0.78)'
export const SPLIT_COLOR = 'rgba(56, 120, 180, 0.18)'

export function hexToRgba(hex, alpha) {
  const raw = hex.replace('#', '')
  const full = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw
  const n = Number.parseInt(full, 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function fadeGradient(color, from = 0.42, to = 0.02) {
  return {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      { offset: 0, color: hexToRgba(color, from) },
      { offset: 1, color: hexToRgba(color, to) },
    ],
  }
}

export function horizontalGradient(color, from = 0.2, to = 0.95) {
  return {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 1,
    y2: 0,
    colorStops: [
      { offset: 0, color: hexToRgba(color, from) },
      { offset: 1, color: hexToRgba(color, to) },
    ],
  }
}

export function tooltipStyle(accent) {
  return {
    backgroundColor: 'rgba(6, 16, 36, 0.92)',
    borderColor: accent,
    borderWidth: 1,
    textStyle: { color: '#e8f4ff', fontSize: 12 },
    extraCssText: 'box-shadow: 0 8px 24px rgba(0,0,0,.35);',
  }
}

export function legendStyle() {
  return {
    textStyle: { color: '#8aa8c4', fontSize: 12 },
    icon: 'roundRect',
    itemWidth: 12,
    itemHeight: 6,
  }
}

export function categoryAxis(data, extra = {}) {
  return {
    type: 'category',
    data,
    axisLine: { lineStyle: { color: SPLIT_COLOR } },
    axisTick: { show: false },
    axisLabel: { color: AXIS_COLOR, fontSize: 12 },
    ...extra,
  }
}

export function valueAxis(extra = {}) {
  return {
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: AXIS_COLOR, fontSize: 12 },
    splitLine: { lineStyle: { color: SPLIT_COLOR } },
    ...extra,
  }
}
