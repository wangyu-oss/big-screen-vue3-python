# Big Screen Hub

开源的 Vue 3 数据大屏模板。克隆后即可运行，全部图表使用本地模拟数据，不依赖后台、数据库或环境变量。

首页是「大屏中心」，可以从这里进入三套风格统一、内容不同的大屏：

- 数据总览：访问、订单、流量、健康度与告警
- 实时监控：设备状态、请求流量、耗时与链路健康
- 运营分析：转化漏斗、渠道效果、热力与订单流

## 特性

- 以 1920×1080 为设计基准，窗口变化时等比缩放并居中
- 深空蓝 / 星云紫 / 极光绿三套主题，界面与图表配色一起切换
- 指标数字缓动、榜单无缝滚动、面板数据定时波动
- 全屏按钮与 `F` 快捷键
- Hash 路由，构建产物可由任意静态服务器或 GitHub Pages 直接打开

## 技术栈

- Vue 3.5+（Composition API、`<script setup>`）
- Vite 6
- Vue Router 4（`createWebHashHistory`）
- ECharts 5
- Node.js >= 18

运行依赖只有 `vue`、`vue-router`、`echarts`。

## 快速开始

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

## 目录结构

```
├── index.html
├── package.json
├── vite.config.js
├── jsconfig.json
├── LICENSE
└── src/
    ├── main.js
    ├── App.vue
    ├── router/index.js
    ├── styles/global.css
    ├── utils/chart.js
    ├── data/screens.js
    ├── composables/
    ├── components/
    └── views/
        ├── HomeView.vue
        ├── OverviewScreen.vue
        ├── MonitorScreen.vue
        └── AnalyticsScreen.vue
```

## 如何新增一套大屏

1. 在 `src/views/` 新建页面，并用 `ScreenFrame` 包住内容。
2. 在 `src/router/index.js` 注册路由。
3. 在 `src/data/screens.js` 追加一条记录，首页卡片会自动出现。

## 快捷键

- `F`：进入或退出全屏（输入框内不触发）
- `Esc`：退出全屏

## 开源协议

[MIT](LICENSE)
