<script setup>
import { screens } from '../data/screens'
import ScreenPreview from '../components/ScreenPreview.vue'

const stats = [
  { value: '3', label: '套大屏模板' },
  { value: '0', label: '后台依赖' },
  { value: '1920×1080', label: '设计基准' },
  { value: 'MIT', label: '开源协议' },
]
</script>

<template>
  <div class="hub">
    <header class="brand">
      <div class="brand-main">
        <div class="logo">BS</div>
        <div>
          <h1>Big Screen Hub</h1>
          <p>开源数据大屏模板 · 纯前端即可运行</p>
        </div>
      </div>
      <div class="chips">
        <span>Vue 3</span>
        <span>Vite</span>
        <span>ECharts</span>
        <span>Vue Router</span>
        <span class="mit">MIT</span>
      </div>
    </header>

    <section class="hero">
      <div class="badge">OPEN SOURCE · FRONTEND ONLY</div>
      <h2>让数据大屏开箱即用</h2>
      <p>
        三套可直接预览的数据大屏，图表、指标和榜单都由本地定时器驱动。
        克隆仓库后执行安装与启动命令，即可在浏览器里切换主题、全屏和实时波动。
      </p>
      <div class="stats">
        <article v-for="item in stats" :key="item.label">
          <strong class="num">{{ item.value }}</strong>
          <span>{{ item.label }}</span>
        </article>
      </div>
    </section>

    <section class="cards">
      <router-link v-for="item in screens" :key="item.id" class="card" :to="item.path">
        <ScreenPreview :variant="item.variant" :accent="item.accent" />
        <div class="code num">{{ item.code }}</div>
        <h3>{{ item.name }}</h3>
        <p>{{ item.description }}</p>
        <div class="tags">
          <span v-for="tag in item.tags" :key="tag">{{ tag }}</span>
        </div>
        <div class="enter">进入大屏 →</div>
      </router-link>
    </section>

    <footer>© {{ new Date().getFullYear() }} Big Screen Hub · MIT License</footer>
  </div>
</template>

<style scoped>
.hub {
  height: 100%;
  overflow: auto;
  padding: 28px 7vw 18px;
  background:
    radial-gradient(900px 380px at 15% -10%, rgba(34, 211, 238, 0.16), transparent 60%),
    radial-gradient(700px 320px at 90% 0%, rgba(167, 139, 250, 0.12), transparent 55%),
    linear-gradient(rgba(90, 150, 210, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(90, 150, 210, 0.05) 1px, transparent 1px),
    #030814;
  background-size: auto, auto, 48px 48px, 48px 48px, auto;
}

.brand {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.brand-main {
  display: flex;
  align-items: center;
  gap: 14px;
}

.logo {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  font-weight: 700;
  letter-spacing: 1px;
  color: #041018;
  background: linear-gradient(135deg, #22d3ee, #38bdf8);
  box-shadow: 0 0 18px rgba(34, 211, 238, 0.45);
}

.brand h1 {
  margin: 0;
  font-size: 22px;
  letter-spacing: 1px;
}

.brand p {
  margin: 4px 0 0;
  color: #8aa8c4;
  font-size: 13px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chips span {
  padding: 4px 10px;
  border: 1px solid rgba(138, 168, 196, 0.35);
  color: #8aa8c4;
  font-size: 12px;
  letter-spacing: 0.5px;
}

.chips .mit {
  color: #34d399;
  border-color: rgba(52, 211, 153, 0.5);
}

.hero {
  max-width: 820px;
  margin: 48px 0 28px;
}

.badge {
  display: inline-block;
  margin-bottom: 14px;
  color: #22d3ee;
  letter-spacing: 2px;
  font-size: 12px;
}

.hero h2 {
  margin: 0;
  font-size: 42px;
  letter-spacing: 2px;
}

.hero p {
  color: #8aa8c4;
  line-height: 1.7;
  max-width: 680px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 22px;
}

.stats article {
  padding: 14px 12px;
  background: rgba(9, 22, 44, 0.62);
  border: 1px solid rgba(34, 211, 238, 0.2);
}

.stats strong {
  display: block;
  font-size: 22px;
  color: #e8f4ff;
}

.stats span {
  color: #58728e;
  font-size: 12px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
  gap: 18px;
}

.card {
  display: block;
  padding: 14px;
  text-decoration: none;
  color: inherit;
  background: rgba(9, 22, 44, 0.72);
  border: 1px solid rgba(138, 168, 196, 0.2);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.card:hover {
  transform: translateY(-8px);
  border-color: rgba(34, 211, 238, 0.7);
  box-shadow: 0 16px 40px rgba(34, 211, 238, 0.18);
}

.code {
  margin-top: 12px;
  color: #22d3ee;
  letter-spacing: 1px;
  font-size: 12px;
}

.card h3 {
  margin: 6px 0;
  font-size: 20px;
  letter-spacing: 1px;
}

.card p {
  margin: 0;
  min-height: 48px;
  color: #8aa8c4;
  font-size: 13px;
  line-height: 1.6;
}

.tags {
  display: flex;
  gap: 8px;
  margin: 12px 0;
}

.tags span {
  padding: 2px 8px;
  font-size: 12px;
  color: #8aa8c4;
  background: rgba(255, 255, 255, 0.04);
}

.enter {
  color: #e8f4ff;
  letter-spacing: 1px;
}

footer {
  margin-top: 28px;
  color: #58728e;
  font-size: 12px;
  letter-spacing: 1px;
}

@media (max-width: 720px) {
  .stats { grid-template-columns: 1fr 1fr; }
  .hero h2 { font-size: 32px; }
}
</style>
