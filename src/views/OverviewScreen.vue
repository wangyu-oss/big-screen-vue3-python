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

setTheme('cyan')

const DAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const CATEGORIES = ['智慧零售', '企业服务', '数字营销', '供应链', '其他']
const REGIONS = ['华东', '华南', '华北', '西南', '华中', '东北']

function clockText() {
  const now = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${p(now.getHours())}:${p(now.getMinutes())}:${p(now.getSeconds())}`
}

function hourLabels() {
  const now = new Date()
  return Array.from({ length: 12 }, (_, i) => {
    const hour = (now.getHours() - 11 + i + 24) % 24
    return `${String(hour).padStart(2, '0')}:00`
  })
}

const kpi = useIntervalData(
  {
    visits: 128640,
    orders: 3862,
    amount: 286.4,
    users: 9640,
    tv: 6.2,
    to: 3.4,
    ta: -1.2,
    tu: 4.8,
  },
  (prev) => ({
    visits: walk(prev.visits, 900, 90000, 180000, 0),
    orders: walk(prev.orders, 50, 2600, 5600, 0),
    amount: walk(prev.amount, 3, 160, 460, 1),
    users: walk(prev.users, 120, 6800, 15000, 0),
    tv: walk(prev.tv, 0.6, -8, 16, 1),
    to: walk(prev.to, 0.4, -6, 12, 1),
    ta: walk(prev.ta, 0.5, -8, 12, 1),
    tu: walk(prev.tu, 0.4, -5, 14, 1),
  }),
  3000,
)

const trend = useIntervalData(
  {
    visits: [8200, 9100, 8800, 10200, 9800, 11400, 12100],
    orders: [420, 460, 448, 510, 490, 560, 602],
  },
  (prev) => ({
    visits: prev.visits.map((n) => walk(n, 280, 6000, 15000, 0)),
    orders: prev.orders.map((n) => walk(n, 18, 300, 800, 0)),
  }),
  4000,
)

const cats = useIntervalData(
  [32, 24, 18, 16, 10],
  (prev) => prev.map((n) => walk(n, 1.2, 6, 40, 1)),
  4000,
)

const traffic = useIntervalData(
  {
    labels: hourLabels(),
    req: [1200, 1320, 1280, 1410, 1500, 1460, 1600, 1720, 1680, 1800, 1760, 1880],
    pv: [860, 910, 880, 960, 1020, 990, 1100, 1180, 1140, 1240, 1210, 1300],
    online: 2480,
    qps: 1860,
    ms: 42,
  },
  (prev) => {
    const nextHour = (Number(prev.labels.at(-1).slice(0, 2)) + 1) % 24
    return {
      labels: [...prev.labels.slice(1), `${String(nextHour).padStart(2, '0')}:00`],
      req: [...prev.req.slice(1), walk(prev.req.at(-1), 80, 900, 2400, 0)],
      pv: [...prev.pv.slice(1), walk(prev.pv.at(-1), 50, 600, 1800, 0)],
      online: walk(prev.online, 40, 1600, 3600, 0),
      qps: walk(prev.qps, 30, 1200, 2600, 0),
      ms: walk(prev.ms, 2, 18, 90, 0),
    }
  },
  2500,
)

const health = useIntervalData(
  { score: 96, api: 99.2, service: 97.4, resource: 71.5 },
  (prev) => ({
    score: walk(prev.score, 0.8, 88, 100, 1),
    api: walk(prev.api, 0.2, 96, 100, 1),
    service: walk(prev.service, 0.4, 92, 100, 1),
    resource: walk(prev.resource, 1.2, 48, 88, 1),
  }),
  3000,
)

const channels = useIntervalData(
  [
    { name: '抖音', value: 28640, rate: 92 },
    { name: '微信', value: 24110, rate: 78 },
    { name: '官网', value: 19840, rate: 64 },
    { name: '京东', value: 16220, rate: 52 },
    { name: '小程序', value: 14180, rate: 46 },
    { name: '线下门店', value: 10960, rate: 35 },
  ],
  (prev) => {
    const next = prev.map((item) => ({
      ...item,
      value: walk(item.value, 240, 6000, 36000, 0),
    }))
    const max = Math.max(...next.map((item) => item.value))
    return next
      .map((item) => ({ ...item, rate: Math.round((item.value / max) * 100) }))
      .sort((a, b) => b.value - a.value)
  },
  4000,
)

const regions = useIntervalData(
  [18600, 14200, 12800, 9600, 8400, 6200],
  (prev) => prev.map((n) => walk(n, 280, 4000, 24000, 0)),
  4000,
)

const alertPool = [
  { level: 'warn', text: '华东节点响应时间升高' },
  { level: 'danger', text: '支付通道出现短暂超时' },
  { level: 'info', text: '缓存命中率已恢复正常' },
  { level: 'warn', text: '订单队列堆积超过阈值' },
  { level: 'info', text: '夜间批处理任务已完成' },
  { level: 'danger', text: '对象存储写入失败重试' },
  { level: 'warn', text: '华南机房带宽利用率偏高' },
]

const alerts = useIntervalData(
  alertPool.slice(0, 5).map((item, index) => ({ ...item, time: `09:1${index}:0${index}` })),
  (prev) => {
    const item = pick(alertPool)
    return [{ ...item, text: item.text, time: clockText(), nonce: randomInt(1, 9999) }, ...prev].slice(0, 5)
  },
  6000,
)

const trendOption = computed(() => {
  const [a, b] = themeSeries.value
  const accent = themeConfig.value.accent
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', ...tooltipStyle(accent) },
    legend: { ...legendStyle(), top: 0, data: ['访问量', '订单量'] },
    grid: { left: 46, right: 46, top: 36, bottom: 24 },
    xAxis: categoryAxis(DAYS),
    yAxis: [valueAxis(), valueAxis({ splitLine: { show: false } })],
    series: [
      {
        name: '访问量',
        type: 'line',
        smooth: true,
        yAxisIndex: 0,
        data: trend.value.visits,
        symbol: 'circle',
        symbolSize: 7,
        lineStyle: { width: 2, color: a },
        itemStyle: { color: a },
        areaStyle: { color: fadeGradient(a) },
      },
      {
        name: '订单量',
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        data: trend.value.orders,
        symbol: 'circle',
        symbolSize: 7,
        lineStyle: { width: 2, color: b },
        itemStyle: { color: b },
        areaStyle: { color: fadeGradient(b) },
      },
    ],
  }
})

const pieOption = computed(() => {
  const colors = themeSeries.value
  const accent = themeConfig.value.accent
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', ...tooltipStyle(accent) },
    legend: { ...legendStyle(), orient: 'vertical', right: 0, top: 'middle' },
    title: {
      text: '品类',
      left: '34%',
      top: 'center',
      textAlign: 'center',
      textStyle: { color: '#e8f4ff', fontSize: 16, fontWeight: 500 },
    },
    series: [
      {
        type: 'pie',
        radius: ['48%', '72%'],
        center: ['34%', '50%'],
        label: { show: false },
        data: CATEGORIES.map((name, index) => ({
          name,
          value: cats.value[index],
          itemStyle: { color: colors[index % colors.length] },
        })),
      },
    ],
  }
})

const trafficOption = computed(() => {
  const [a, b] = themeSeries.value
  const accent = themeConfig.value.accent
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', ...tooltipStyle(accent) },
    legend: { ...legendStyle(), top: 0, data: ['API 请求', '页面浏览'] },
    grid: { left: 48, right: 16, top: 32, bottom: 24 },
    xAxis: categoryAxis(traffic.value.labels),
    yAxis: valueAxis(),
    series: [
      {
        name: 'API 请求',
        type: 'line',
        smooth: true,
        data: traffic.value.req,
        symbol: 'none',
        lineStyle: { width: 2, color: a },
        areaStyle: { color: fadeGradient(a) },
      },
      {
        name: '页面浏览',
        type: 'line',
        smooth: true,
        data: traffic.value.pv,
        symbol: 'none',
        lineStyle: { width: 2, color: b },
        areaStyle: { color: fadeGradient(b) },
      },
    ],
  }
})

const gaugeOption = computed(() => {
  const accent = themeConfig.value.accent
  return {
    backgroundColor: 'transparent',
    series: [
      {
        type: 'gauge',
        min: 0,
        max: 100,
        startAngle: 210,
        endAngle: -30,
        radius: '92%',
        center: ['50%', '58%'],
        progress: { show: true, width: 12, itemStyle: { color: accent } },
        axisLine: { lineStyle: { width: 12, color: [[1, hexToRgba(accent, 0.18)]] } },
        pointer: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: {
          valueAnimation: true,
          offsetCenter: [0, 0],
          fontSize: 28,
          color: '#e8f4ff',
          formatter: '{value}%',
        },
        title: { offsetCenter: [0, '62%'], color: '#8aa8c4', fontSize: 12 },
        data: [{ value: health.value.score, name: '综合健康度' }],
      },
    ],
  }
})

const regionOption = computed(() => {
  const accent = themeConfig.value.accent
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', ...tooltipStyle(accent) },
    grid: { left: 48, right: 18, top: 8, bottom: 8 },
    xAxis: valueAxis(),
    yAxis: categoryAxis(REGIONS),
    series: [
      {
        type: 'bar',
        data: regions.value,
        barWidth: 12,
        itemStyle: { color: horizontalGradient(accent), borderRadius: [0, 2, 2, 0] },
      },
    ],
  }
})

const meters = computed(() => [
  { name: '接口可用率', value: health.value.api },
  { name: '服务健康度', value: health.value.service },
  { name: '资源使用率', value: health.value.resource },
])
</script>

<template>
  <ScreenFrame title="数据总览大屏" subtitle="BUSINESS OVERVIEW" tag="OV-01">
    <div class="grid">
      <div class="col">
        <div class="kpis">
          <NumberCard label="今日访问量" :value="kpi.visits" suffix="次" :trend="kpi.tv" />
          <NumberCard label="今日订单数" :value="kpi.orders" suffix="单" :trend="kpi.to" />
          <NumberCard label="成交金额" :value="kpi.amount" prefix="¥" suffix="万" :decimals="1" :trend="kpi.ta" />
          <NumberCard label="活跃用户" :value="kpi.users" suffix="人" :trend="kpi.tu" />
        </div>
        <PanelBox class="grow" title="近 7 日业务趋势" subtitle="4s">
          <EChart :option="trendOption" />
        </PanelBox>
        <PanelBox class="grow" title="业务品类占比">
          <EChart :option="pieOption" />
        </PanelBox>
      </div>
      <div class="col">
        <PanelBox class="grow tall" title="全域实时流量" subtitle="2.5s">
          <div class="stack">
            <div class="summary">
              <div><span>当前在线</span><b class="num">{{ traffic.online }}</b></div>
              <div><span>峰值 QPS</span><b class="num">{{ traffic.qps }}</b></div>
              <div><span>平均响应</span><b class="num">{{ traffic.ms }}<small>ms</small></b></div>
            </div>
            <div class="chart-holder">
              <EChart :option="trafficOption" />
            </div>
          </div>
        </PanelBox>
        <PanelBox class="grow" title="系统健康度">
          <div class="health">
            <div class="chart-holder">
              <EChart :option="gaugeOption" />
            </div>
            <div class="meters">
              <div v-for="item in meters" :key="item.name" class="meter">
                <div class="meter-hd"><span>{{ item.name }}</span><b class="num">{{ item.value.toFixed(1) }}%</b></div>
                <div class="track"><i :style="{ width: item.value + '%' }" /></div>
              </div>
            </div>
          </div>
        </PanelBox>
      </div>
      <div class="col">
        <PanelBox class="grow" title="热门渠道 TOP 6">
          <ScrollList :items="channels" :duration="16">
            <template #item="{ item, index }">
              <span class="rank num">{{ index + 1 }}</span>
              <div class="ch">
                <div class="ch-name">{{ item.name }}</div>
                <div class="track thin"><i :style="{ width: item.rate + '%' }" /></div>
              </div>
              <span class="ch-val num">{{ item.value.toLocaleString('zh-CN') }}</span>
            </template>
          </ScrollList>
        </PanelBox>
        <PanelBox class="grow" title="区域访问分布">
          <EChart :option="regionOption" />
        </PanelBox>
        <PanelBox class="grow" title="实时告警" subtitle="6s">
          <ul class="alerts">
            <li v-for="item in alerts" :key="item.time + item.text">
              <i :class="item.level" />
              <span>{{ item.text }}</span>
              <em class="num">{{ item.time }}</em>
            </li>
          </ul>
        </PanelBox>
      </div>
    </div>
  </ScreenFrame>
</template>

<style scoped>
.grid {
  height: 100%;
  display: grid;
  grid-template-columns: 460px minmax(0, 1fr) 460px;
  gap: 14px;
}
.col { min-width: 0; min-height: 0; display: flex; flex-direction: column; gap: 14px; }
.grow { flex: 1; }
.tall { flex: 1.25; }
.kpis { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.stack, .health { height: 100%; min-height: 0; display: flex; }
.stack { flex-direction: column; gap: 8px; }
.chart-holder { flex: 1; min-height: 0; }
.summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.summary div {
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(138, 168, 196, 0.15);
}
.summary span { display: block; color: #8aa8c4; font-size: 12px; }
.summary b { font-size: 22px; }
.summary small { margin-left: 4px; font-size: 12px; color: #8aa8c4; }
.health { gap: 8px; }
.meters { width: 46%; display: flex; flex-direction: column; justify-content: center; gap: 16px; }
.meter-hd, .ch { display: flex; }
.meter-hd { justify-content: space-between; color: #8aa8c4; font-size: 13px; margin-bottom: 6px; }
.meter-hd b { color: #e8f4ff; }
.track { height: 8px; background: rgba(255, 255, 255, 0.06); }
.track i { display: block; height: 100%; background: linear-gradient(90deg, var(--accent-2), var(--accent)); box-shadow: 0 0 8px var(--accent-glow); }
.track.thin { height: 6px; margin-top: 6px; }
.rank { width: 22px; color: var(--accent); }
.ch { flex: 1; min-width: 0; flex-direction: column; }
.ch-name { font-size: 13px; }
.ch-val { width: 72px; text-align: right; color: #8aa8c4; }
.alerts { list-style: none; margin: 0; padding: 0; height: 100%; display: flex; flex-direction: column; justify-content: space-around; }
.alerts li { display: grid; grid-template-columns: 12px 1fr auto; gap: 8px; align-items: center; font-size: 13px; }
.alerts i { width: 8px; height: 8px; border-radius: 50%; }
.alerts .warn { background: #fbbf24; box-shadow: 0 0 8px #fbbf24; }
.alerts .danger { background: #f87171; box-shadow: 0 0 8px #f87171; }
.alerts .info { background: #38bdf8; box-shadow: 0 0 8px #38bdf8; }
.alerts em { color: #58728e; font-style: normal; }
</style>
