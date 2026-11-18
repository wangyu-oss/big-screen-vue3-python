<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
})
</script>

<template>
  <section class="panel">
    <i class="corner lt" />
    <i class="corner rt" />
    <i class="corner lb" />
    <i class="corner rb" />
    <header class="hd">
      <span class="mark" />
      <h3>{{ title }}</h3>
      <em v-if="subtitle">{{ subtitle }}</em>
    </header>
    <div class="bd">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.panel {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: rgba(9, 22, 44, 0.62);
  border: 1px solid color-mix(in srgb, var(--accent) 32%, transparent);
  box-shadow: inset 0 0 24px color-mix(in srgb, var(--accent) 12%, transparent);
}

.hd {
  height: 44px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 14px;
  background: linear-gradient(90deg, color-mix(in srgb, var(--accent) 20%, transparent), transparent 72%);
  border-bottom: 1px solid rgba(138, 168, 196, 0.12);
}

.mark {
  width: 8px;
  height: 8px;
  background: var(--accent);
  transform: rotate(45deg);
  box-shadow: 0 0 8px var(--accent);
}

h3 {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 1.5px;
}

em {
  margin-left: auto;
  color: #58728e;
  font-style: normal;
  font-size: 12px;
}

.bd {
  flex: 1 1 auto;
  min-height: 0;
  height: 0;
  padding: 10px 12px 12px;
  overflow: hidden;
}

.corner {
  position: absolute;
  width: 12px;
  height: 12px;
  pointer-events: none;
  z-index: 1;
}

.lt { top: -1px; left: -1px; border-top: 2px solid var(--accent); border-left: 2px solid var(--accent); }
.rt { top: -1px; right: -1px; border-top: 2px solid var(--accent); border-right: 2px solid var(--accent); }
.lb { bottom: -1px; left: -1px; border-bottom: 2px solid var(--accent); border-left: 2px solid var(--accent); }
.rb { bottom: -1px; right: -1px; border-bottom: 2px solid var(--accent); border-right: 2px solid var(--accent); }
</style>
