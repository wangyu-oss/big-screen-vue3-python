<script setup>
import { computed } from 'vue'
import ScreenFrame from '../components/ScreenFrame.vue'
import PanelBox from '../components/PanelBox.vue'
import EChart from '../components/EChart.vue'
import NumberCard from '../components/NumberCard.vue'
import ScrollList from '../components/ScrollList.vue'
import { setTheme, themeConfig, themeSeries } from '../composables/useTheme'
import { pick, randomInt, useIntervalData, walk } from '../composables/useMockData'
import {
  categoryAxis,
  fadeGradient,
  hexToRgba,
  horizontalGradient,
  legendStyle,
  tooltipStyle,
  valueAxis,
} from '../utils/chart'

setTheme('green')

const DAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const FUNNEL = ['曝光', '访问', '加购', '下单', '支付']
const CHANNELS = ['直播', '搜索', '信息流', '私域', '门店']
const SLOTS = ['00-04', '04-08', '08-12', '12-16', '16-20', '20-24']
const RADAR = ['活跃度', '消费力', '留存', '互动', '传播', '忠诚']
const AREAS = ['上海', '广州', '北京', '成都', '武汉', '杭州']
const REGIONS = ['华东', '华南', '华北', '西南', '华中', '东北']

let orderSeq = 18021

const kpi = useIntervalData(
  { gmv: 1286.5, orders: 18620, cvr: 3.8, aov: 268 },
  (prev) => ({
    gmv: walk(prev.gmv, 8, 860, 1860, 1),
    orders: walk(prev.orders, 80, 12000, 26000, 0),
    cvr: walk(prev.cvr, 0.08, 2.4, 6.2, 2),
    aov: walk(prev.aov, 3, 180, 420, 0),
  }),
  3000,
)

const funnel = useIntervalData(
  [128000, 68400, 24600, 9680, 6240],
  (prev) => {
    const next = prev.map((n, i) => walk(n, i === 0 ? 1200 : 180, 2000, 160000, 0))
    for (let i = 1; i < next.length; i += 1) next[i] = Math.min(next[i], next[i - 1])
    return next
  },
  4000,
)

const growth = useIntervalData(
  {
    fresh: [1200, 1320, 1280, 1460, 1520, 1680, 1740],
    active: [8600, 8820, 8740, 9100, 9340, 9680, 9920],
  },
  (prev) => ({
    fresh: prev.fresh.map((n) => walk(n, 40, 800, 2400, 0)),
    active: prev.active.map((n) => walk(n, 80, 7000, 12000, 0)),
  }),
  4000,
)

const channels = useIntervalData(
  {
    online: [420, 360, 510, 280, 190],
    offline: [80, 140, 60, 220, 310],
  },
  (prev) => ({
    online: prev.online.map((n) => walk(n, 18, 80, 680, 0)),
    offline: prev.offline.map((n) => walk(n, 12, 30, 420, 0)),
  }),
  4000,
)

const heat = useIntervalData(
  Array.from({ length: 7 * 6 }, () => randomInt(12, 96)),
  (prev) => prev.map((n) => walk(n, 6, 4, 100, 0)),
  5000,
)

const radar = useIntervalData(
  {
    current: [82, 76, 88, 71, 64, 79],
    previous: [74, 70, 81, 66, 58, 73],
  },
  (prev) => ({
    current: prev.current.map((n) => walk(n, 2, 48, 98, 0)),
    previous: prev.previous.map((n) => walk(n, 1.2, 40, 92, 0)),
  }),
  4000,
)

const goals = useIntervalData(
  [
    { name: 'GMV', value: 76 },
    { name: '订单', value: 82 },
    { name: '新增用户', value: 64 },
    { name: '复购率', value: 58 },
  ],
  (prev) => prev.map((item) => ({ ...item, value: walk(item.value, 1.5, 40, 98, 0) })),
  3000,
)

const areas = useIntervalData(
  [268, 214, 196, 142, 128, 176],
  (prev) => prev.map((n) => walk(n, 8, 60, 320, 0)),
  4000,
)

const orders = useIntervalData(
  Array.from({ length: 8 }, (_, i) => ({
    id: `OD20261118${String(18000 + i)}`,
    region: REGIONS[i % REGIONS.length],
    amount: randomInt(89, 2680),
  })),
  (prev) => {
    orderSeq += 1
    const item = {
      id: `OD20261118${orderSeq}`,
      region: pick(REGIONS),
      amount: randomInt(89, 2680),
    }
    return [item, ...prev].slice(0, 8)
  },
  3500,
)

const funnelOption = computed(() => {
  const colors = themeSeries.value
  const accent = themeConfig.value.accent
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', ...tooltipStyle(accent) },
    series: [
      {
        type: 'funnel',
        left: '8%',
        width: '78%',
        top: 10,
        bottom: 10,
        sort: 'descending',
        gap: 4,
        label: { color: '#e8f4ff', formatter: '{b}  {c}' },
        data: FUNNEL.map((name, index) => ({
          name,
          value: funnel.value[index],
          itemStyle: { color: colors[index % colors.length] },
        })),
      },
    ],
  }
})

const growthOption = computed(() => {
  const [a, b] = themeSeries.value
  const accent = themeConfig.value.accent
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', ...tooltipStyle(accent) },
    legend: { ...legendStyle(), top: 0, data: ['新增用户', '活跃用户'] },
    grid: { left: 46, right: 52, top: 32, bottom: 24 },
    xAxis: categoryAxis(DAYS),
    yAxis: [valueAxis(), valueAxis({ splitLine: { show: false } })],
    series: [
      { name: '新增用户', type: 'line', smooth: true, yAxisIndex: 0, symbol: 'circle', data: growth.value.fresh, lineStyle: { color: a }, itemStyle: { color: a } },
      { name: '活跃用户', type: 'line', smooth: true, yAxisIndex: 1, symbol: 'circle', data: growth.value.active, lineStyle: { color: b }, itemStyle: { color: b }, areaStyle: { color: fadeGradient(b, 0.2, 0) } },
    ],
  }
})

const channelOption = computed(() => {
  const [a, b] = themeSeries.value
  const accent = themeConfig.value.accent
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', ...tooltipStyle(accent) },
    legend: { ...legendStyle(), top: 0, data: ['线上', '线下'] },
    grid: { left: 40, right: 12, top: 32, bottom: 24 },
    xAxis: categoryAxis(CHANNELS),
    yAxis: valueAxis(),
    series: [
      { name: '线上', type: 'bar', stack: 'total', data: channels.value.online, itemStyle: { color: a }, barWidth: 18 },
      { name: '线下', type: 'bar', stack: 'total', data: channels.value.offline, itemStyle: { color: b }, barWidth: 18 },
    ],
  }
})

const heatOption = computed(() => {
  const accent = themeConfig.value.accent
  const data = []
  heat.value.forEach((value, index) => {
    data.push([index % 7, Math.floor(index / 7), value])
  })
  return {
    backgroundColor: 'transparent',
    tooltip: { ...tooltipStyle(accent) },
    grid: { left: 56, right: 16, top: 10, bottom: 46 },
    xAxis: categoryAxis(DAYS),
    yAxis: categoryAxis(SLOTS),
    visualMap: {
      min: 0,
      max: 100,
      calculable: false,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      itemWidth: 12,
      itemHeight: 8,
      textStyle: { color: '#8aa8c4' },
      inRange: { color: [hexToRgba(accent, 0.12), accent] },
    },
    series: [{ type: 'heatmap', data, label: { show: false } }],
  }
})

const radarOption = computed(() => {
  const [a, b] = themeSeries.value
  const accent = themeConfig.value.accent
  return {
    backgroundColor: 'transparent',
    tooltip: { ...tooltipStyle(accent) },
    legend: { ...legendStyle(), bottom: 0, data: ['本期', '上期'] },
    radar: {
      indicator: RADAR.map((name) => ({ name, max: 100 })),
      center: ['50%', '46%'],
      radius: '58%',
      axisName: { color: '#8aa8c4' },
      splitLine: { lineStyle: { color: 'rgba(56, 120, 180, 0.18)' } },
      splitArea: { areaStyle: { color: ['transparent', 'rgba(255,255,255,0.02)'] } },
      axisLine: { lineStyle: { color: 'rgba(56, 120, 180, 0.18)' } },
    },
    series: [
      {
        type: 'radar',
        data: [
          { name: '本期', value: radar.value.current, lineStyle: { color: a }, itemStyle: { color: a }, areaStyle: { color: hexToRgba(a, 0.28) } },
          { name: '上期', value: radar.value.previous, lineStyle: { color: b }, itemStyle: { color: b }, areaStyle: { color: hexToRgba(b, 0.12) } },
        ],
      },
    ],
  }
})

const areaOption = computed(() => {
  const accent = themeConfig.value.accent
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', ...tooltipStyle(accent) },
    grid: { left: 48, right: 16, top: 8, bottom: 8 },
    xAxis: valueAxis(),
    yAxis: categoryAxis(AREAS),
    series: [
      {
        type: 'bar',
        data: areas.value,
        barWidth: 12,
        itemStyle: { color: horizontalGradient(accent) },
      },
    ],
  }
})
</script>

<template>
  <ScreenFrame title="运营分析大屏" subtitle="OPERATIONS ANALYTICS" tag="AN-03">
    <div class="grid">
      <div class="col">
        <div class="kpis">
          <NumberCard label="GMV" :value="kpi.gmv" prefix="¥" suffix="万" :decimals="1" />
          <NumberCard label="订单数" :value="kpi.orders" suffix="单" />
          <NumberCard label="转化率" :value="kpi.cvr" suffix="%" :decimals="2" />
          <NumberCard label="客单价" :value="kpi.aov" prefix="¥" />
        </div>
        <PanelBox class="grow" title="转化漏斗">
          <EChart :option="funnelOption" />
        </PanelBox>
        <PanelBox class="grow" title="用户增长趋势">
          <EChart :option="growthOption" />
        </PanelBox>
      </div>
      <div class="col">
        <PanelBox class="grow" title="渠道效果对比">
          <EChart :option="channelOption" />
        </PanelBox>
        <PanelBox class="grow" title="时段访问热力">
          <EChart :option="heatOption" />
        </PanelBox>
        <PanelBox class="grow" title="用户画像雷达">
          <EChart :option="radarOption" />
        </PanelBox>
      </div>
      <div class="col">
        <PanelBox class="grow" title="运营目标完成度">
          <div class="goals">
            <div v-for="item in goals" :key="item.name">
              <div class="goal-hd"><span>{{ item.name }}</span><b class="num">{{ item.value }}%</b></div>
              <div class="track"><i :style="{ width: item.value + '%' }" /></div>
            </div>
          </div>
        </PanelBox>
        <PanelBox class="grow" title="地域贡献 TOP">
          <EChart :option="areaOption" />
        </PanelBox>
        <PanelBox class="grow" title="实时订单流">
          <ScrollList :items="orders" :duration="14">
            <template #item="{ item }">
              <span class="oid num">{{ item.id }}</span>
              <span class="region">{{ item.region }}</span>
              <span class="amt num">¥{{ item.amount.toLocaleString('zh-CN') }}</span>
            </template>
          </ScrollList>
        </PanelBox>
      </div>
    </div>
  </ScreenFrame>
</template>

<style scoped>
.grid { height: 100%; display: grid; grid-template-columns: 460px minmax(0, 1fr) 460px; gap: 14px; }
.col { min-width: 0; min-height: 0; display: flex; flex-direction: column; gap: 14px; }
.grow { flex: 1; }
.kpis { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.goals { height: 100%; display: flex; flex-direction: column; justify-content: space-around; }
.goal-hd { display: flex; justify-content: space-between; color: #8aa8c4; margin-bottom: 6px; }
.goal-hd b { color: #e8f4ff; }
.track { height: 8px; background: rgba(255, 255, 255, 0.06); }
.track i { display: block; height: 100%; background: linear-gradient(90deg, var(--accent-2), var(--accent)); }
.oid { flex: 1; letter-spacing: 0.5px; }
.region { width: 48px; color: #8aa8c4; }
.amt { width: 72px; text-align: right; color: var(--accent); }
</style>
