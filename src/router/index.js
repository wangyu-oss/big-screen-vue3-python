import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import OverviewScreen from '../views/OverviewScreen.vue'
import MonitorScreen from '../views/MonitorScreen.vue'
import AnalyticsScreen from '../views/AnalyticsScreen.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/screen/overview', name: 'overview', component: OverviewScreen },
    { path: '/screen/monitor', name: 'monitor', component: MonitorScreen },
    { path: '/screen/analytics', name: 'analytics', component: AnalyticsScreen },
  ],
})

export default router
