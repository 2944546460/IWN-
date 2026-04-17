import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import BasicLayout from '@/layouts/BasicLayout.vue'
import MapLayout from '@/layouts/MapLayout.vue'

// ---- 侧边栏菜单类型 ----
export interface SideMenuItem {
  key: string
  title: string
  icon: string
  path: string
}

const routes: RouteRecordRaw[] = [
  // ==================== 廊道态势显示（全屏地图，无侧边栏） ====================
  {
    path: '/',
    component: MapLayout,
    children: [
      {
        path: '',
        name: 'SituationMap',
        component: () => import('@/views/situation/SituationMap.vue'),
        meta: { title: '廊道态势显示', topNav: 'situation' },
      },
    ],
  },

  // ==================== 廊道基础数据 ====================
  {
    path: '/corridor',
    component: BasicLayout,
    redirect: '/corridor/maintenance',
    meta: {
      topNav: 'corridor',
      sideMenu: [
        { key: 'corridor-maintenance', title: '廊道信息维护',   icon: 'ri-exchange-line',       path: '/corridor/maintenance'    },
        { key: 'turn-zone',            title: '转弯区信息维护', icon: 'ri-refresh-line',         path: '/corridor/turn-zone'      },
        { key: 'landing-point',        title: '起降点信息维护', icon: 'ri-flight-land-line',     path: '/corridor/landing-point'  },
        { key: 'emergency-point',      title: '应急点信息维护', icon: 'ri-first-aid-kit-line',   path: '/corridor/emergency-point'},
        { key: 'weather-env',          title: '气象环境维护',   icon: 'ri-cloud-windy-line',     path: '/corridor/weather-env'    },
        { key: 'airspace-route',       title: '空域与航路维护', icon: 'ri-route-line',           path: '/corridor/airspace-route' },
        { key: 'restricted-area',      title: '受限区域总览',   icon: 'ri-forbid-line',          path: '/corridor/restricted-area'},
      ] as SideMenuItem[],
    },
    children: [
      { path: 'maintenance',    name: 'CorridorMaintenance', component: () => import('@/views/corridor/CorridorMaintenance.vue'), meta: { title: '廊道信息维护',   sideMenuKey: 'corridor-maintenance', topNav: 'corridor' } },
      { path: 'turn-zone',      name: 'TurnZone',            component: () => import('@/views/corridor/TurnZone.vue'),            meta: { title: '转弯区信息维护', sideMenuKey: 'turn-zone',            topNav: 'corridor' } },
      { path: 'landing-point',  name: 'LandingPoint',        component: () => import('@/views/corridor/LandingPoint.vue'),        meta: { title: '起降点信息维护', sideMenuKey: 'landing-point',        topNav: 'corridor' } },
      { path: 'emergency-point',name: 'EmergencyPoint',      component: () => import('@/views/corridor/EmergencyPoint.vue'),      meta: { title: '应急点信息维护', sideMenuKey: 'emergency-point',      topNav: 'corridor' } },
      { path: 'weather-env',    name: 'WeatherEnv',          component: () => import('@/views/corridor/WeatherEnv.vue'),          meta: { title: '气象环境维护',   sideMenuKey: 'weather-env',          topNav: 'corridor' } },
      { path: 'airspace-route', name: 'AirspaceRoute',       component: () => import('@/views/corridor/AirspaceRoute.vue'),       meta: { title: '空域与航路维护', sideMenuKey: 'airspace-route',       topNav: 'corridor' } },
      { path: 'restricted-area',name: 'RestrictedArea',      component: () => import('@/views/corridor/RestrictedArea.vue'),      meta: { title: '受限区域总览',   sideMenuKey: 'restricted-area',      topNav: 'corridor' } },
    ],
  },

  // ==================== 规划计划 ====================
  {
    path: '/planning',
    component: BasicLayout,
    redirect: '/planning/user-task',
    meta: {
      topNav: 'planning',
      sideMenu: [
        { key: 'user-task', title: '用户任务信息管理', icon: 'ri-file-info-line', path: '/planning/user-task' },
        { key: 'beam-info', title: '波束信息管理',     icon: 'ri-radar-line',     path: '/planning/beam-info' },
      ] as SideMenuItem[],
    },
    children: [
      { path: 'user-task', name: 'UserTask', component: () => import('@/views/planning/UserTask.vue'), meta: { title: '用户任务信息管理', sideMenuKey: 'user-task', topNav: 'planning' } },
      { path: 'beam-info', name: 'BeamInfo', component: () => import('@/views/planning/BeamInfo.vue'), meta: { title: '波束信息管理',     sideMenuKey: 'beam-info', topNav: 'planning' } },
    ],
  },

  // ==================== 地面节点管理 ====================
  {
    path: '/ground-node',
    component: BasicLayout,
    redirect: '/ground-node/status',
    meta: {
      topNav: 'ground-node',
      sideMenu: [
        { key: 'node-status',      title: '节点状态展示', icon: 'ri-flow-chart',       path: '/ground-node/status'      },
        { key: 'node-maintenance', title: '节点信息维护', icon: 'ri-information-line', path: '/ground-node/maintenance' },
      ] as SideMenuItem[],
    },
    children: [
      { path: 'status',      name: 'NodeStatus',      component: () => import('@/views/ground-node/NodeStatus.vue'),      meta: { title: '节点状态展示', sideMenuKey: 'node-status',      topNav: 'ground-node' } },
      { path: 'maintenance', name: 'NodeMaintenance', component: () => import('@/views/ground-node/NodeMaintenance.vue'), meta: { title: '节点信息维护', sideMenuKey: 'node-maintenance', topNav: 'ground-node' } },
    ],
  },

  // ==================== 飞行器管理 ====================
  {
    path: '/aircraft',
    component: BasicLayout,
    redirect: '/aircraft/data-acquisition',
    meta: {
      topNav: 'aircraft',
      sideMenu: [
        { key: 'data-acq',    title: '获取数据维护',   icon: 'ri-radar-line',    path: '/aircraft/data-acquisition' },
        { key: 'history',     title: '历史数据管理',   icon: 'ri-history-line',  path: '/aircraft/history'          },
        { key: 'ac-maintain', title: '飞行器维保管理', icon: 'ri-tools-line',    path: '/aircraft/maintenance'      },
      ] as SideMenuItem[],
    },
    children: [
      { path: 'data-acquisition', name: 'DataAcquisition',    component: () => import('@/views/aircraft/DataAcquisition.vue'),    meta: { title: '获取数据维护',   sideMenuKey: 'data-acq',    topNav: 'aircraft' } },
      { path: 'history',          name: 'HistoryData',         component: () => import('@/views/aircraft/HistoryData.vue'),         meta: { title: '历史数据管理',   sideMenuKey: 'history',     topNav: 'aircraft' } },
      { path: 'maintenance',      name: 'AircraftMaintenance', component: () => import('@/views/aircraft/AircraftMaintenance.vue'), meta: { title: '飞行器维保管理', sideMenuKey: 'ac-maintain', topNav: 'aircraft' } },
    ],
  },

  // ==================== 健康管理 ====================
  {
    path: '/health',
    component: BasicLayout,
    redirect: '/health/monitor',
    meta: {
      topNav: 'health',
      sideMenu: [
        { key: 'monitor',    title: '健康监控', icon: 'ri-macbook-line',       path: '/health/monitor'    },
        { key: 'assessment', title: '健康评估', icon: 'ri-shield-check-line', path: '/health/assessment' },
      ] as SideMenuItem[],
    },
    children: [
      { path: 'monitor',    name: 'HealthMonitor',    component: () => import('@/views/health/HealthMonitor.vue'),    meta: { title: '健康监控', sideMenuKey: 'monitor',    topNav: 'health' } },
      { path: 'assessment', name: 'HealthAssessment', component: () => import('@/views/health/HealthAssessment.vue'), meta: { title: '健康评估', sideMenuKey: 'assessment', topNav: 'health' } },
    ],
  },

  // ==================== 404 兜底 ====================
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 更新 document.title
router.afterEach((to) => {
  const title = to.meta?.title as string | undefined
  document.title = `CICORE IWN 廊道运维管理平台${title ? ' - ' + title : ''}`
})

export default router
