/** 大屏注册表。新增一套大屏时在此追加，并同步路由与 views。 */
export const screens = [
  {
    id: 'overview',
    path: '/screen/overview',
    code: 'OV-01',
    name: '数据总览大屏',
    description: '汇总会话、订单与金额，观察七日趋势、品类结构、区域分布和实时告警。',
    tags: ['指标卡', '趋势', '告警'],
    accent: '#22d3ee',
    variant: 'overview',
  },
  {
    id: 'monitor',
    path: '/screen/monitor',
    code: 'MN-02',
    name: '实时监控大屏',
    description: '盯住设备在线率、节点负载、请求流量和链路健康，适合值班墙。',
    tags: ['设备', '流量', '雷达'],
    accent: '#a78bfa',
    variant: 'monitor',
  },
  {
    id: 'analytics',
    path: '/screen/analytics',
    code: 'AN-03',
    name: '运营分析大屏',
    description: '从漏斗、渠道、时段热力和订单流看经营节奏，对照目标完成度。',
    tags: ['漏斗', '热力', '订单'],
    accent: '#34d399',
    variant: 'analytics',
  },
]
