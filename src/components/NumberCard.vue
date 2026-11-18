<script setup>
import { computed, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: Number, required: true },
  prefix: { type: String, default: '' },
  suffix: { type: String, default: '' },
  hint: { type: String, default: '' },
  color: { type: String, default: '' },
  trend: { type: Number, default: null },
  decimals: { type: Number, default: 0 },
})

const shown = ref(0)
let frame = 0

watch(
  () => props.value,
  (next) => {
    const from = shown.value
    const to = Number(next) || 0
    const start = performance.now()
    cancelAnimationFrame(frame)
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 900)
      const ease = 1 - (1 - t) ** 3
      shown.value = from + (to - from) * ease
      if (t < 1) frame = requestAnimationFrame(tick)
      else shown.value = to
    }
    frame = requestAnimationFrame(tick)
  },
  { immediate: true },
)

onUnmounted(() => cancelAnimationFrame(frame))

const text = computed(() =>
  shown.value.toLocaleString('zh-CN', {
    minimumFractionDigits: props.decimals,
    maximumFractionDigits: props.decimals,
  }),
)

const accentStyle = computed(() => (props.color ? { color: props.color } : null))
</script>

<template>
  <article class="card">
    <div class="label">{{ label }}</div>
    <div class="value num" :style="accentStyle">
      <small v-if="prefix">{{ prefix }}</small>{{ text }}<small v-if="suffix">{{ suffix }}</small>
    </div>
    <div class="meta">
      <span v-if="trend !== null" class="trend" :class="trend >= 0 ? 'up' : 'down'">
        {{ trend >= 0 ? '↑' : '↓' }} {{ Math.abs(trend).toFixed(1) }}%
      </span>
      <span v-if="hint" class="hint">{{ hint }}</span>
    </div>
  </article>
</template>

<style scoped>
.card {
  min-height: 0;
  padding: 12px 14px;
  background: rgba(9, 22, 44, 0.62);
  border: 1px solid color-mix(in srgb, var(--accent) 28%, transparent);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
}

.label {
  color: #8aa8c4;
  font-size: 13px;
  letter-spacing: 1px;
}

.value {
  font-size: 30px;
  line-height: 1;
  color: var(--accent);
}

.value small {
  margin: 0 2px;
  font-size: 14px;
  color: #8aa8c4;
}

.meta {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #58728e;
}

.up { color: #34d399; }
.down { color: #f87171; }
</style>
