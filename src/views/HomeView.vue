<script setup>
import { screens } from '../data/screens'
import ScreenPreview from '../components/ScreenPreview.vue'
</script>

<template>
  <div class="hub">
    <header class="brand">
      <div class="brand-main">
        <div class="logo">BS</div>
        <h1>Big Screen Hub</h1>
      </div>
    </header>

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
  </div>
</template>

<style scoped>
.hub {
  height: 100%;
  overflow: auto;
  padding: 28px 7vw 36px;
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

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
  gap: 18px;
  margin-top: 28px;
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
</style>
