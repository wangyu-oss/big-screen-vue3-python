<script setup>
defineProps({
  variant: { type: String, default: 'overview' },
  accent: { type: String, default: '#22d3ee' },
})

const heat = Array.from({ length: 28 }, (_, i) => ({
  x: 168 + (i % 7) * 20,
  y: 22 + Math.floor(i / 7) * 22,
  opacity: 0.25 + ((i * 17) % 60) / 100,
}))
</script>

<template>
  <div class="preview" :style="{ '--p': accent }">
    <svg v-if="variant === 'overview'" viewBox="0 0 320 150" aria-hidden="true">
      <rect x="12" y="16" width="70" height="36" fill="none" stroke="currentColor" />
      <rect x="90" y="16" width="70" height="36" fill="none" stroke="currentColor" />
      <rect x="12" y="60" width="148" height="74" fill="none" stroke="currentColor" opacity="0.7" />
      <polyline points="22,112 48,96 74,102 100,78 126,84 148,64" fill="none" stroke="currentColor" stroke-width="2" />
      <circle cx="214" cy="78" r="36" fill="none" stroke="currentColor" stroke-width="10" stroke-dasharray="70 160" />
      <rect x="258" y="36" width="48" height="8" fill="currentColor" opacity="0.85" />
      <rect x="258" y="54" width="40" height="8" fill="currentColor" opacity="0.55" />
      <rect x="258" y="72" width="46" height="8" fill="currentColor" opacity="0.4" />
      <rect x="258" y="90" width="32" height="8" fill="currentColor" opacity="0.3" />
    </svg>
    <svg v-else-if="variant === 'monitor'" viewBox="0 0 320 150" aria-hidden="true">
      <circle cx="28" cy="28" r="6" fill="currentColor" />
      <text x="42" y="32" fill="currentColor" font-size="12">LIVE</text>
      <polyline
        points="16,88 36,80 52,96 70,70 88,84 106,60 124,78 142,52 160,74 178,48 196,66 214,44 232,70 250,58 268,76 286,50 304,68"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      />
      <line x1="16" y1="62" x2="304" y2="62" stroke="#f87171" stroke-dasharray="4 4" />
      <rect x="16" y="108" width="36" height="22" fill="currentColor" opacity="0.85" />
      <rect x="60" y="100" width="36" height="30" fill="currentColor" opacity="0.65" />
      <rect x="104" y="112" width="36" height="18" fill="currentColor" opacity="0.45" />
      <rect x="148" y="96" width="36" height="34" fill="currentColor" opacity="0.75" />
      <rect x="192" y="104" width="36" height="26" fill="currentColor" opacity="0.55" />
      <polygon points="250,118 268,108 286,112 304,100 304,132 250,132" fill="none" stroke="currentColor" />
    </svg>
    <svg v-else viewBox="0 0 320 150" aria-hidden="true">
      <polygon points="16,20 150,20 132,42 34,42" fill="currentColor" opacity="0.85" />
      <polygon points="34,50 132,50 118,72 48,72" fill="currentColor" opacity="0.65" />
      <polygon points="48,80 118,80 108,102 58,102" fill="currentColor" opacity="0.45" />
      <polygon points="58,110 108,110 100,130 66,130" fill="currentColor" opacity="0.3" />
      <g opacity="0.9">
        <rect v-for="(cell, i) in heat" :key="i" :x="cell.x" :y="cell.y" width="14" height="14" fill="currentColor" :opacity="cell.opacity" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.preview {
  height: 148px;
  color: var(--p);
  background:
    linear-gradient(rgba(120, 170, 220, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(120, 170, 220, 0.08) 1px, transparent 1px),
    rgba(4, 12, 28, 0.85);
  background-size: 16px 16px, 16px 16px, auto;
  border: 1px solid color-mix(in srgb, var(--p) 40%, transparent);
}

svg {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
