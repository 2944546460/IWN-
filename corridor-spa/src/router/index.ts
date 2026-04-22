import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import BasicLayout from '@/layouts/BasicLayout.vue'
import MapLayout from '@/layouts/MapLayout.vue'

// ---- 侧边栏菜单类型 ----
export interface SideMenuItem {
  key: string
  title: string
  icon: string
  path?: string // Make path optional for parent nodes
  children?: SideMenuItem[] // Support nested children
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
      {
        path: 'corridor/create',
        name: 'CreateCorridor',
        component: () => import('@/views/corridor/CreateCorridor.vue'),
        meta: { title: '新建廊道', topNav: 'corridor' },
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
        { key: 'weather-rules',        title: '气象运行规则配置', icon: 'ri-settings-4-line',    path: '/corridor/weather-rules'  },
        { key: 'weather-nfz-pool',     title: '气象禁飞区数据池', icon: 'ri-database-2-line',    path: '/corridor/weather-nfz-pool'},
        { key: 'weather-data-source',  title: '数据源调度监控', icon: 'ri-dashboard-3-line',     path: '/corridor/weather-data-source'},
        { key: 'airspace-route',       title: '空域与航路维护', icon: 'ri-route-line',           path: '/corridor/airspace-route' },
        { key: 'restricted-area',      title: '受限区域总览',   icon: 'ri-forbid-line',          path: '/corridor/restricted-area'},
      ] as SideMenuItem[],
    },
    children: [
      { path: 'maintenance',    name: 'CorridorMaintenance', component: () => import('@/views/corridor/CorridorMaintenance.vue'), meta: { title: '廊道信息维护',   sideMenuKey: 'corridor-maintenance', topNav: 'corridor' } },
      { path: 'turn-zone',      name: 'TurnZone',            component: () => import('@/views/corridor/TurnZone.vue'),            meta: { title: '转弯区信息维护', sideMenuKey: 'turn-zone',            topNav: 'corridor' } },
      { path: 'landing-point',  name: 'LandingPoint',        component: () => import('@/views/corridor/LandingPoint.vue'),        meta: { title: '起降点信息维护', sideMenuKey: 'landing-point',        topNav: 'corridor' } },
      { path: 'emergency-point',name: 'EmergencyPoint',      component: () => import('@/views/corridor/EmergencyPoint.vue'),      meta: { title: '应急点信息维护', sideMenuKey: 'emergency-point',      topNav: 'corridor' } },
      { path: 'weather-rules',  name: 'WeatherRulesConfig',  component: () => import('@/views/corridor/WeatherRulesConfig.vue'),  meta: { title: '气象运行规则配置', sideMenuKey: 'weather-rules',        topNav: 'corridor' } },
      { path: 'weather-nfz-pool',name: 'WeatherNfzDataPool', component: () => import('@/views/corridor/WeatherNfzDataPool.vue'),  meta: { title: '气象禁飞区数据池', sideMenuKey: 'weather-nfz-pool',     topNav: 'corridor' } },
      { path: 'weather-data-source',name: 'WeatherDataSource',component: () => import('@/views/corridor/WeatherDataSource.vue'),  meta: { title: '数据源调度监控', sideMenuKey: 'weather-data-source',     topNav: 'corridor' } },
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
      { path: 'user-task/detail/:id', name: 'TaskDetail', component: () => import('@/views/planning/TaskDetail.vue'), meta: { title: '用户任务信息详情', sideMenuKey: 'user-task', topNav: 'planning' } },
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
        { key: 'data-acq',    title: '在飞飞行器管理', icon: 'ri-flight-takeoff-line', path: '/aircraft/data-acquisition' },
        { key: 'ac-maintain', title: '飞行器信息维护', icon: 'ri-information-line',    path: '/aircraft/maintenance'      },
        { key: 'history',     title: '流控数据管理',   icon: 'ri-base-station-line',   path: '/aircraft/history'          },
        { key: 'debug',       title: '飞行器调试管理', icon: 'ri-tools-fill',          path: '/aircraft/debug'            },
      ] as SideMenuItem[],
    },
    children: [
      { path: 'data-acquisition', name: 'DataAcquisition',    component: () => import('@/views/aircraft/DataAcquisition.vue'),    meta: { title: '在飞飞行器管理', sideMenuKey: 'data-acq',    topNav: 'aircraft' } },
      { path: 'maintenance',      name: 'AircraftMaintenance', component: () => import('@/views/aircraft/AircraftMaintenance.vue'), meta: { title: '飞行器信息维护', sideMenuKey: 'ac-maintain', topNav: 'aircraft' } },
      { path: 'history',          name: 'HistoryData',         component: () => import('@/views/aircraft/HistoryData.vue'),         meta: { title: '流控数据管理',   sideMenuKey: 'history',     topNav: 'aircraft' } },
      { path: 'debug',            name: 'AircraftDebug',       component: () => import('@/views/aircraft/AircraftDebug.vue'),       meta: { title: '飞行器调试管理', sideMenuKey: 'debug',       topNav: 'aircraft' } },
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
        { 
          key: 'assessment', 
          title: '健康评估', 
          icon: 'ri-shield-check-line', 
          children: [
            { key: 'system', title: '系统健康评估', icon: 'ri-file-chart-line', path: '/health/system' },
            { key: 'uav-threshold', title: '飞行器健康阈值设置', icon: 'ri-flight-takeoff-line', path: '/health/uav-threshold' },
            { key: 'node-threshold', title: '节点健康阈值设置', icon: 'ri-node-tree', path: '/health/node-threshold' },
          ]
        },
      ] as SideMenuItem[],
    },
    children: [
      { path: 'monitor',        name: 'HealthMonitor',    component: () => import('@/views/health/HealthMonitor.vue'),     meta: { title: '健康监控', sideMenuKey: 'monitor',    topNav: 'health' } },
      { path: 'system',         name: 'SystemAssessment', component: () => import('@/views/health/SystemAssessment.vue'),  meta: { title: '系统健康评估', sideMenuKey: 'system', topNav: 'health' } },
      { path: 'uav-threshold',  name: 'UavThreshold',     component: () => import('@/views/health/UavThreshold.vue'),      meta: { title: '飞行器健康阈值设置', sideMenuKey: 'uav-threshold', topNav: 'health' } },
      { path: 'node-threshold', name: 'NodeThreshold',    component: () => import('@/views/health/NodeThreshold.vue'),     meta: { title: '节点健康阈值设置', sideMenuKey: 'node-threshold', topNav: 'health' } },
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
