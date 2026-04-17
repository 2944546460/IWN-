<template>
  <div class="situation-map-page">
    <!-- 地图主容器 -->
    <div id="mapContainer" class="map-container" />

    <!-- 浮动信息面板区域（绝对定位） -->
    <div class="float-panels-container">
      <!-- 告警跑马灯 -->
      <div v-if="alerts.length > 0" class="alert-marquee">
        <i class="ri-alarm-warning-line text-red-500 mr-2 text-lg"></i>
        <div class="marquee-content">
          <span v-for="a in alerts" :key="a.id" class="mr-8">
            <span :class="a.level === 'error' ? 'text-red-400' : 'text-orange-400'">[{{ a.level === 'error' ? '严重' : '警告' }}]</span>
            {{ a.time }} - {{ a.content }}
          </span>
        </div>
      </div>

      <div class="flex gap-4 h-full">
        <!-- 飞行任务面板 -->
        <div class="glass-panel w-[320px] flex flex-col pointer-events-auto">
          <div class="panel-header">
            <i class="ri-flight-takeoff-line mr-2"></i> 实时任务架次 ({{ tasks.length }})
          </div>
          <div class="panel-body">
            <div v-for="t in tasks" :key="t.id" class="task-card">
              <div class="flex justify-between items-center mb-1">
                <span class="font-bold text-blue-300">{{ t.aircraft }}</span>
                <el-tag size="small" type="success" effect="dark" v-if="t.status === 'flying'">在飞</el-tag>
              </div>
              <div class="text-[13px] text-gray-300">任务: {{ t.name }}</div>
              <div class="text-[13px] text-gray-400 mt-1"><i class="ri-map-pin-line"></i> {{ t.corridor }}</div>
            </div>
            <el-empty v-if="tasks.length === 0" description="暂无活动任务" :image-size="60" />
          </div>
        </div>

        <!-- 基础设施面板（廊道/空域） -->
        <div class="glass-panel w-[320px] flex flex-col pointer-events-auto mt-auto">
          <div class="panel-header">
            <i class="ri-exchange-line mr-2"></i> 廊道与空域状态
          </div>
          <div class="panel-body p-0">
            <el-collapse v-model="activeCol" class="dark-collapse">
              <el-collapse-item name="1">
                <template #title><span class="pl-3 font-semibold">主干运行廊道 ({{ corridors.length }})</span></template>
                <div class="px-3 pb-2 space-y-2">
                  <div v-for="c in corridors" :key="c.id" class="flex items-center justify-between p-2 rounded bg-[rgba(255,255,255,0.05)] text-sm">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: c.color }"></div>
                      <span class="text-gray-200">{{ c.name }}</span>
                    </div>
                    <span :class="c.status === 'on' ? 'text-green-400' : 'text-gray-500'">{{ c.status === 'on' ? '运行中' : '关闭' }}</span>
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item name="2">
                <template #title><span class="pl-3 font-semibold">空域限制区 ({{ airspaces.length }})</span></template>
                <div class="px-3 pb-2 space-y-2">
                  <div v-for="s in airspaces" :key="s.name" class="p-2 rounded bg-[rgba(255,255,255,0.05)] text-sm border-l-2" :style="{ borderColor: s.color }">
                    <div class="flex justify-between text-gray-200 mb-1">
                      <span class="font-bold">{{ s.name }}</span> <span>{{ s.height }}</span>
                    </div>
                    <div class="text-xs text-gray-400">{{ s.type }} | {{ s.agency }}</div>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { AIRSPACES, CORRIDORS, FLIGHT_TASKS, ALERT_ITEMS } from '@/mock/situation'
import type { Airspace, Corridor, FlightTask, AlertItem } from '@/mock/situation'

const airspaces = ref<Airspace[]>(AIRSPACES)
const corridors = ref<Corridor[]>(CORRIDORS)
const tasks = ref<FlightTask[]>(FLIGHT_TASKS)
const alerts = ref<AlertItem[]>(ALERT_ITEMS)
const activeCol = ref(['1'])

let map: L.Map | null = null
let mapLayers: L.Layer[] = []

function initMap() {
  // 由于使用了暗色主题的布局，可以使用带有深色风格的底图或基础OSM
  map = L.map('mapContainer', {
    center: [30.25, 120.15],
    zoom: 11,
    zoomControl: false,
    attributionControl: false
  })

  // 使用高德底图或暗色底图
  L.tileLayer('http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 18,
  }).addTo(map)

  L.control.zoom({ position: 'bottomright' }).addTo(map)

  drawLayers()
}

function drawLayers() {
  if (!map) return
  mapLayers.forEach(l => l.remove())
  mapLayers = []

  // 渲染空域
  airspaces.value.forEach(s => {
    const layer = L.rectangle(s.bounds, {
      color: s.color,
      weight: 2,
      fillColor: s.color,
      fillOpacity: 0.15,
      dashArray: '5, 5'
    }).bindPopup(`<b>${s.name}</b><br>${s.type} - ${s.height}`)
    layer.addTo(map!)
    mapLayers.push(layer)
  })

  // 渲染廊道
  corridors.value.forEach(c => {
    if (c.status !== 'on') return
    const layer = L.polyline(c.points, {
      color: c.color,
      weight: 6,
      opacity: 0.7
    }).bindTooltip(c.name, { permanent: false, direction: 'top' })
    layer.addTo(map!)
    mapLayers.push(layer)
  })
}

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style scoped>
.situation-map-page {
  position: absolute; /* 父级 MapLayout 的 main.map-body 是 relative 且满高 */
  inset: 0;
  background: #0a1628;
  overflow: hidden;
}

.map-container {
  position: absolute;
  inset: 0;
  z-index: 1; /* leaflet 底图层 */
}

/* UI 面板覆盖在地图上 */
.float-panels-container {
  position: absolute;
  top: 20px;
  right: 20px;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
  pointer-events: none; /* 让鼠标穿透点击地图 */
  display: flex;
  flex-direction: column;
}

.pointer-events-auto {
  pointer-events: auto; /* 恢复面板本身的鼠标响应 */
}

/* 玻璃拟态面板 */
.glass-panel {
  background: rgba(15, 34, 67, 0.85);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(64, 158, 255, 0.2);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.panel-header {
  height: 40px;
  background: linear-gradient(90deg, rgba(64, 158, 255, 0.2) 0%, transparent 100%);
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.panel-body {
  padding: 12px;
  overflow-y: auto;
  max-height: calc(100vh - 120px);
}

/* 跑马灯 */
.alert-marquee {
  pointer-events: auto;
  background: rgba(10, 22, 40, 0.9);
  border: 1px solid #f56c6c;
  border-radius: 4px;
  padding: 8px 16px;
  color: #fff;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  width: 100%;
  max-width: 600px;
  align-self: center; /* 居中显示 */
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(245, 108, 108, 0.2);
}

.marquee-content {
  flex: 1;
  white-space: nowrap;
  animation: scroll-left 25s linear infinite;
}

@keyframes scroll-left {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}

/* 任务卡片 */
.task-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  padding: 10px 12px;
  margin-bottom: 10px;
  border-left: 3px solid #67c23a;
}
.task-card:last-child { margin-bottom: 0; }

/* 覆盖 ElementUI 折叠面板样式为暗色 */
:deep(.dark-collapse) {
  border: none;
}
:deep(.dark-collapse .el-collapse-item__header) {
  background: transparent;
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
:deep(.dark-collapse .el-collapse-item__wrap) {
  background: transparent;
  border-bottom: none;
}
:deep(.dark-collapse .el-collapse-item__content) {
  padding-bottom: 0;
  color: #ccc;
}
</style>
