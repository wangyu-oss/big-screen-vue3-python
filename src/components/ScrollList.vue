<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  height: { type: [Number, String], default: '100%' },
  duration: { type: Number, default: 18 },
})

const loop = computed(() => (props.items.length ? [...props.items, ...props.items] : []))

const boxStyle = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}))

const trackStyle = computed(() => ({
  animationDuration: `${props.duration}s`,
}))
</script>

<template>
  <div class="scroll" :style="boxStyle">
    <div v-if="loop.length" class="track" :style="trackStyle">
      <div v-for="(item, index) in loop" :key="index" class="row">
        <slot name="item" :item="item" :index="index % items.length">
          <span class="rank num">{{ (index % items.length) + 1 }}</span>
          <span class="name">{{ item.name }}</span>
          <span class="val num">{{ item.value }}</span>
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scroll {
  overflow: hidden;
}

.track {
  animation: marquee linear infinite;
}

.scroll:hover .track {
  animation-play-state: paused;
}

.row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 36px;
  padding: 4px 2px;
}

.rank {
  width: 22px;
  color: var(--accent);
}

.name {
  flex: 1;
  color: #e8f4ff;
}

.val {
  color: #8aa8c4;
}

@keyframes marquee {
  from { transform: translateY(0); }
  to { transform: translateY(-50%); }
}
</style>
