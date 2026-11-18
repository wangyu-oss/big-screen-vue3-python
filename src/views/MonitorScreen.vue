<script setup>
import { computed } from 'vue'
import ScreenFrame from '../components/ScreenFrame.vue'
import PanelBox from '../components/PanelBox.vue'
import EChart from '../components/EChart.vue'
import NumberCard from '../components/NumberCard.vue'
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

setTheme('purple')

const STATUS = [
  { name: '正常运行', color: '#34d399' },
  { name: '预警', color: '#fbbf24' },
  { name: '离线', color: '#f87171' },
  { name: '维护中', color: '#38bdf8' },
]
const NODES = ['node-01', 'node-02', 'node-03', 'node-04', 'node-05']
const BUCKETS = ['<50ms', '50-100ms', '100-200ms', '200-500ms', '>500ms']
const RADAR = ['接入', '时延', '吞吐', '稳定', '安全', '容量']
const LEVELS = [
  { level: '严重', cls: 'danger', title: '磁盘写入延迟超限' },
  { level: '警告', cls: 'warn', title: 'CPU 持续高于 80%' },
  { level: '提示', cls: 'info', title: '节点完成滚动重启' },
  { level: '警告', cls: 'warn', title: '消息堆积接近水位' },
  { level: '严重', cls: 'danger', title: '心跳丢失超过 3 次' },
  { level: '提示', cls: 'info', title: '证书将于 14 天后到期' },
]

function clockText() {
  const now = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${p(now.getHours())}:${p(now.getMinutes())}:${p(now.getSeconds())}`
}

const kpi = useIntervalData(
  { devices: 1286, online: 97.6, alerts: 14, messages: 86240 },
  (prev) => ({
    devices: walk(prev.devices, 4, 1180, 1460, 0),
    online: walk(prev.online, 0.3, 94, 99.9, 1),
    alerts: walk(prev.alerts, 1, 3, 36, 0),
    messages: walk(prev.messages, 400, 70000, 120000, 0),
  }),
  3000,
)

const status = useIntervalData(
  [1088, 46, 22, 18],
  (prev) => prev.map((n, i) => walk(n, i === 0 ? 8 : 2, i === 0 ? 900 : 4, i === 0 ? 1300 : 80, 0)),
  4000,
)

const loads = useIntervalData(
  [78, 66, 84, 51, 73],
  (prev) => prev.map((n) => walk(n, 4, 28, 96, 0)),
  3000,
)

const flow = useIntervalData(
  {
    points: Array.from({ length: 40 }, () => randomInt(1400, 2300)),
    rate: 1860,
  },
  (prev) => {
    const rate = walk(prev.rate, 120, 900, 3200, 0)
    return { points: [...prev.points.slice(1), rate], rate }
  },
  2000,
)

const latency = useIntervalData(
  [420, 680, 360, 140, 46],
  (prev) => prev.map((n, i) => walk(n, 20, 20, i === 0 ? 900 : 800, 0)),
  3500,
)

const radar = useIntervalData(
  {
    current: [86, 78, 82, 90, 74, 80],
    previous: [80, 74, 76, 84, 70, 77],
  },
  (prev) => ({
    current: prev.current.map((n) => walk(n, 2, 55, 98, 0)),
    previous: prev.previous.map((n) => walk(n, 1, 50, 94, 0)),
  }),
  4000,
)

const events = useIntervalData(
  LEVELS.slice(0, 6).map((item, index) => ({
    ...item,
    node: NODES[index % NODES.length],
    time: `10:0${index}:1${index}`,
  })),
  (prev) => {
    const item = pick(LEVELS)
    return [{ ...item, node: pick(NODES), time: clockText(), id: randomInt(1, 99999) }, ...prev].slice(0, 6)
  },
  4000,
)

const devices = useIntervalData(
  [
    { name: 'edge-gw-01', cpu: 36, online: true },
    { name: 'edge-gw-02', cpu: 58, online: true },
    { name: 'cache-a', cpu: 71, online: true },
    { name: 'mq-core', cpu: 64, online: true },
    { name: 'db-read-03', cpu: 49, online: false },
    { name: 'worker-07', cpu: 82, online: true },
  ],
  (prev) => prev.map((item) => ({
    ...item,
    cpu: walk(item.cpu, 4, 8, 96, 0),
    online: item.cpu > 92 ? false : item.online || Math.random() > 0.15,
  })),
  3000,
)

const today = useIntervalData(
  { total: 186, recovered: 164, minutes: 6.4 },
  (prev) => ({
    total: walk(prev.total, 2, 120, 260, 0),
    recovered: walk(prev.recovered, 2, 100, 240, 0),
    minutes: walk(prev.minutes, 0.3, 2, 18, 1),
  }),
  4000,
)

const statusOption = computed(() => {
  const accent = themeConfig.value.accent
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', ...tooltipStyle(accent) },
    legend: { ...legendStyle(), orient: 'vertical', right: 0, top: 'middle' },
    title: {
      text: '设备',
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
        data: STATUS.map((item, index) => ({
          name: item.name,
          value: status.value[index],
          itemStyle: { color: item.color },
        })),
      },
    ],
  }
})

const loadOption = computed(() => {
  const accent = themeConfig.value.accent
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', ...tooltipStyle(accent) },
    grid: { left: 70, right: 24, top: 8, bottom: 8 },
    xAxis: valueAxis({ max: 100 }),
    yAxis: categoryAxis(NODES),
    series: [
      {
        type: 'bar',
        data: loads.value,
        barWidth: 12,
        itemStyle: { color: horizontalGradient(accent) },
        label: { show: true, position: 'right', color: '#8aa8c4', formatter: '{c}%' },
      },
    ],
  }
})

const flowOption = computed(() => {
  const accent = themeConfig.value.accent
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', ...tooltipStyle(accent) },
    grid: { left: 48, right: 18, top: 16, bottom: 24 },
    xAxis: categoryAxis(flow.value.points.map((_, i) => i), { axisLabel: { show: false } }),
    yAxis: valueAxis({ max: 3400 }),
    series: [
      {
        type: 'line',
        smooth: true,
        symbol: 'none',
        data: flow.value.points,
        lineStyle: { width: 2, color: accent },
        areaStyle: { color: fadeGradient(accent) },
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: { color: '#f87171', type: 'dashed' },
          label: { formatter: '预警 2600', color: '#f87171' },
          data: [{ yAxis: 2600 }],
        },
      },
    ],
  }
})

const latencyOption = computed(() => {
  const accent = themeConfig.value.accent
  const second = themeSeries.value[1]
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', ...tooltipStyle(accent) },
    grid: { left: 40, right: 10, top: 16, bottom: 28 },
    xAxis: categoryAxis(BUCKETS),
    yAxis: valueAxis(),
    series: [
      {
        type: 'bar',
        data: latency.value,
        barWidth: 18,
        itemStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: accent },
              { offset: 1, color: hexToRgba(second, 0.35) },
            ],
          },
        },
      },
    ],
  }
})

const radarOption = computed(() => {
  const [a, b] = themeSeries.value
  const accent = themeConfig.value.accent
  return {
    backgroundColor: 'transparent',
    tooltip: { ...tooltipStyle(accent) },
    legend: { ...legendStyle(), top: 0, data: ['本期', '上期'] },
    radar: {
      indicator: RADAR.map((name) => ({ name, max: 100 })),
      center: ['50%', '56%'],
      radius: '62%',
      axisName: { color: '#8aa8c4' },
      splitLine: { lineStyle: { color: 'rgba(56, 120, 180, 0.18)' } },
      splitArea: { areaStyle: { color: ['transparent', 'rgba(255,255,255,0.02)'] } },
      axisLine: { lineStyle: { color: 'rgba(56, 120, 180, 0.18)' } },
    },
    series: [
      {
        type: 'radar',
        data: [
          { name: '本期', value: radar.value.current, lineStyle: { color: a }, itemStyle: { color: a }, areaStyle: { color: hexToRgba(a, 0.25) } },
          { name: '上期', value: radar.value.previous, lineStyle: { color: b }, itemStyle: { color: b }, areaStyle: { color: hexToRgba(b, 0.12) } },
        ],
      },
    ],
  }
})
</script>

<template>
  <ScreenFrame title="实时监控大屏" subtitle="LIVE MONITORING" tag="MN-02">
    <div class="grid">
      <div class="col">
        <div class="kpis">
          <NumberCard label="接入设备" :value="kpi.devices" suffix="台" />
          <NumberCard label="在线率" :value="kpi.online" suffix="%" :decimals="1" />
          <NumberCard label="活跃告警" :value="kpi.alerts" suffix="条" />
          <NumberCard label="今日消息" :value="kpi.messages" suffix="条" />
        </div>
        <PanelBox class="grow" title="设备状态分布">
          <EChart :option="statusOption" />
        </PanelBox>
        <PanelBox class="grow" title="节点负载 TOP 5">
          <EChart :option="loadOption" />
        </PanelBox>
      </div>
      <div class="col">
        <PanelBox class="grow" title="实时请求流量" subtitle="2s">
          <div class="stack">
            <div class="live">
              <i class="pulse" />
              <span>采集中</span>
              <b class="num">{{ flow.rate }}</b>
              <em>req/s</em>
            </div>
            <div class="chart-holder">
              <EChart :option="flowOption" />
            </div>
          </div>
        </PanelBox>
        <PanelBox class="grow" title="响应耗时分布">
          <EChart :option="latencyOption" />
        </PanelBox>
        <PanelBox class="grow" title="链路健康雷达">
          <EChart :option="radarOption" />
        </PanelBox>
      </div>
      <div class="col">
        <PanelBox class="grow" title="实时告警事件">
          <ul class="events">
            <li v-for="item in events" :key="item.id || item.time + item.title">
              <span class="badge" :class="item.cls">{{ item.level }}</span>
              <div>
                <strong>{{ item.title }}</strong>
                <small>{{ item.node }}</small>
              </div>
              <em class="num">{{ item.time }}</em>
            </li>
          </ul>
        </PanelBox>
        <PanelBox class="grow" title="关键设备状态">
          <div class="table">
            <div class="th"><span>设备</span><span>CPU</span><span>状态</span></div>
            <div v-for="item in devices" :key="item.name" class="tr">
              <span>{{ item.name }}</span>
              <span class="num">{{ item.cpu }}%</span>
              <span :class="item.online ? 'on' : 'off'">{{ item.online ? '在线' : '离线' }}</span>
            </div>
          </div>
        </PanelBox>
        <PanelBox class="stat" title="今日事件统计">
          <div class="stats">
            <div><b class="num">{{ today.total }}</b><span>告警总数</span></div>
            <div><b class="num">{{ today.recovered }}</b><span>已恢复</span></div>
            <div><b class="num">{{ today.minutes.toFixed(1) }}</b><span>平均恢复时长(分)</span></div>
          </div>
        </PanelBox>
      </div>
    </div>
  </ScreenFrame>
</template>

<style scoped>
.grid { height: 100%; display: grid; grid-template-columns: 460px minmax(0, 1fr) 460px; gap: 14px; }
.col { min-width: 0; min-height: 0; display: flex; flex-direction: column; gap: 14px; }
.grow { flex: 1; }
.stat { flex: 0 0 168px; }
.kpis { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.stack { height: 100%; display: flex; flex-direction: column; min-height: 0; }
.chart-holder { flex: 1; min-height: 0; }
.live { display: flex; align-items: center; gap: 8px; color: #8aa8c4; }
.live b { color: var(--accent); font-size: 22px; }
.pulse {
  width: 10px; height: 10px; border-radius: 50%; background: #34d399;
  box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.7);
  animation: breathe 1.6s infinite;
}
@keyframes breathe {
  70% { box-shadow: 0 0 0 8px rgba(52, 211, 153, 0); }
  100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0); }
}
.events { list-style: none; margin: 0; padding: 0; height: 100%; display: flex; flex-direction: column; justify-content: space-between; }
.events li { display: grid; grid-template-columns: 52px 1fr auto; gap: 8px; align-items: center; }
.events strong, .events small { display: block; }
.events strong { font-weight: 500; font-size: 13px; }
.events small, .events em { color: #58728e; font-style: normal; font-size: 12px; }
.badge { text-align: center; font-size: 12px; padding: 2px 0; border: 1px solid currentColor; }
.danger { color: #f87171; }
.warn { color: #fbbf24; }
.info { color: #38bdf8; }
.table { height: 100%; display: flex; flex-direction: column; justify-content: space-between; font-size: 13px; }
.th, .tr { display: grid; grid-template-columns: 1.4fr 0.6fr 0.6fr; }
.th { color: #58728e; }
.on { color: #34d399; }
.off { color: #f87171; }
.stats { height: 100%; display: grid; grid-template-columns: repeat(3, 1fr); align-items: center; text-align: center; }
.stats b { display: block; font-size: 28px; color: var(--accent); }
.stats span { color: #8aa8c4; font-size: 12px; }
</style>
