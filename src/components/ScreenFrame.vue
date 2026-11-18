<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useScreenScale } from '../composables/useScreenScale'
import { useClock } from '../composables/useClock'
import { useFullscreen } from '../composables/useFullscreen'
import { cycleTheme, themeConfig } from '../composables/useTheme'

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  tag: { type: String, default: 'LIVE' },
})

const router = useRouter()
const { screenStyle } = useScreenScale()
const { timeText, dateText } = useClock()
const { isFullscreen, toggle } = useFullscreen()

const canvasStyle = computed(() => ({
  ...screenStyle.value,
  '--accent': themeConfig.value.accent,
  '--accent-2': themeConfig.value.accent2,
  '--accent-glow': themeConfig.value.glow,
}))

function backHome() {
  router.push('/')
}
</script>

<template>
  <div class="screen-root">
    <div class="canvas" :style="canvasStyle">
      <header class="topbar">
        <button class="ghost" type="button" @click="backHome">返回大屏中心</button>
        <div class="title-wrap">
          <i class="deco" />
          <div class="titles">
            <h1>{{ title }}</h1>
            <p>{{ subtitle }}</p>
          </div>
          <i class="deco right" />
        </div>
        <div class="tools">
          <div class="clock">
            <b class="num">{{ timeText }}</b>
            <span>{{ dateText }}</span>
          </div>
          <span class="tag">{{ tag }}</span>
          <button class="ghost" type="button" @click="cycleTheme">{{ themeConfig.name }}</button>
          <button class="ghost" type="button" @click="toggle">
            {{ isFullscreen ? '退出全屏' : '进入全屏' }}
          </button>
        </div>
      </header>
      <main class="body">
        <slot />
      </main>
      <footer class="statusbar">
        <span>VUE 3 · ECHARTS · PURE FRONTEND</span>
        <span>数据为本地模拟，仅供演示</span>
        <span>F 全屏 · 点击主题循环切换</span>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.screen-root {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(900px 420px at 50% -10%, rgba(34, 211, 238, 0.08), transparent 60%),
    #030814;
}

.canvas {
  position: relative;
  display: flex;
  flex-direction: column;
  background:
    linear-gradient(rgba(90, 150, 210, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(90, 150, 210, 0.05) 1px, transparent 1px),
    radial-gradient(800px 360px at 50% 0%, var(--accent-glow), transparent 70%),
    #030814;
  background-size: 48px 48px, 48px 48px, auto, auto;
  color: #e8f4ff;
}

.topbar {
  height: 86px;
  display: grid;
  grid-template-columns: 280px 1fr 520px;
  align-items: center;
  padding: 0 22px;
  border-bottom: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
}

.ghost {
  height: 34px;
  padding: 0 14px;
  border: 1px solid color-mix(in srgb, var(--accent) 55%, transparent);
  background: rgba(8, 20, 42, 0.55);
  color: #e8f4ff;
  letter-spacing: 1px;
  border-radius: 2px;
}

.ghost:hover {
  box-shadow: 0 0 16px var(--accent-glow);
}

.title-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-width: 0;
}

.titles {
  text-align: center;
}

.titles h1 {
  margin: 0;
  font-size: 34px;
  font-weight: 600;
  letter-spacing: 10px;
  line-height: 1.1;
}

.titles p {
  margin: 4px 0 0;
  color: #8aa8c4;
  letter-spacing: 3px;
  font-size: 12px;
}

.deco {
  width: 120px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent));
  position: relative;
}

.deco.right {
  background: linear-gradient(90deg, var(--accent), transparent);
}

.deco::after {
  content: "";
  position: absolute;
  top: -3px;
  width: 8px;
  height: 8px;
  background: var(--accent);
  box-shadow: 0 0 10px var(--accent);
}

.deco::after {
  right: 0;
}

.deco.right::after {
  left: 0;
  right: auto;
}

.tools {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.clock {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 6px;
}

.clock b {
  font-size: 20px;
  letter-spacing: 1px;
}

.clock span {
  color: #8aa8c4;
  font-size: 12px;
}

.tag {
  padding: 4px 8px;
  border: 1px solid var(--accent);
  color: var(--accent);
  font-size: 12px;
  letter-spacing: 1px;
}

.body {
  flex: 1;
  min-height: 0;
  padding: 14px 18px;
}

.statusbar {
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 22px;
  color: #58728e;
  font-size: 12px;
  letter-spacing: 1px;
  border-top: 1px solid rgba(88, 140, 190, 0.2);
}
</style>
