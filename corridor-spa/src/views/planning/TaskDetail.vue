<template>
  <div class="task-detail-page">
    <!-- 标题区 -->
    <div class="section-header">用户任务信息详情</div>

    <!-- 基础信息 -->
    <div class="custom-card mb-4">
      <div class="card-title">基础信息</div>
      <div class="card-body">
        <el-descriptions :column="3" class="custom-descriptions">
          <el-descriptions-item label="任务ID">{{ task.taskId }}</el-descriptions-item>
          <el-descriptions-item label="任务编码">{{ task.taskCode }}</el-descriptions-item>
          <el-descriptions-item label="任务模式">{{ task.mode }}</el-descriptions-item>

          <el-descriptions-item label="业务类型">{{ task.bizType }}</el-descriptions-item>
          <el-descriptions-item label="用户ID">{{ task.userId }}</el-descriptions-item>
          <el-descriptions-item label="用户名称">{{ task.userName }}</el-descriptions-item>

          <el-descriptions-item label="飞行器">{{ task.uavName }}</el-descriptions-item>
          <el-descriptions-item label="任务提交时间">{{ task.submitTime }}</el-descriptions-item>
          <el-descriptions-item label="任务审核时间">{{ task.verifyTime }}</el-descriptions-item>

          <el-descriptions-item label="任务核验结果">
            <span :class="resultClass(task.verifyResult)">{{ task.verifyResult }}</span>
          </el-descriptions-item>

          <el-descriptions-item label="任务描述" :span="3">{{ task.description || '-' }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </div>

    <!-- 航线信息 -->
    <div class="custom-card mb-4">
      <div class="card-title">航线信息</div>
      <div class="card-body">
        <el-descriptions :column="3" class="custom-descriptions">
          <el-descriptions-item label="航线模式">{{ task.routeInfo.mode }}</el-descriptions-item>
          <el-descriptions-item label="起飞点">{{ task.routeInfo.start }}</el-descriptions-item>
          <el-descriptions-item label="降落点">{{ task.routeInfo.end }}</el-descriptions-item>

          <el-descriptions-item label="预计飞行距离">{{ task.routeInfo.distance }}</el-descriptions-item>
          <el-descriptions-item label="预计飞行高度">{{ task.routeInfo.altitude }}</el-descriptions-item>
          <el-descriptions-item label="航飞总载荷">{{ task.routeInfo.payload }}</el-descriptions-item>

          <el-descriptions-item label="预计飞行速度">{{ task.routeInfo.speed }}</el-descriptions-item>
          <el-descriptions-item label="预计起飞时间">{{ task.routeInfo.startTime }}</el-descriptions-item>
          <el-descriptions-item label="预计飞行时长">{{ task.routeInfo.duration }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </div>

    <!-- 任务航线图 -->
    <div class="custom-card mb-4">
      <div class="card-title">任务航线图</div>
      <div class="card-body p-0">
        <div id="detail-map" class="route-map"></div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="footer-bar">
      <el-button @click="goBack" class="custom-btn">返回</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'

const route = useRoute()
const router = useRouter()
const taskId = route.params.id as string

let mapInstance: L.Map | null = null

// ========== Mock 数据 ==========
const allTasks: Record<string, any> = {
  'MIS000000718': {
    taskId: 'MIS000000718', taskCode: '04211718', mode: '定时任务',
    bizType: '智慧物流', userId: '1', userName: 'Super',
    uavName: '自然风运维二号', submitTime: '2026-04-21 17:18:47', verifyTime: '2026-04-21 17:18:47',
    verifyResult: '待核验', description: '-',
    routeInfo: {
      mode: '单程航线', start: '长清高速C号起降点31号', end: '长清高速C号起降场C号',
      distance: '-', altitude: '-', payload: '-',
      speed: '10m/s', startTime: '2026-04-21 00:00:00', duration: '-'
    },
    routeCoords: [
      [30.26, 119.98], [30.255, 119.96], [30.25, 119.94],
      [30.248, 119.92], [30.245, 119.88], [30.24, 119.85]
    ]
  },
  'MIS000000689': {
    taskId: 'MIS000000689', taskCode: '04171123', mode: '实时任务',
    bizType: '智慧物流', userId: '1', userName: 'Super',
    uavName: '工业级防雨大负载', submitTime: '2026-04-17 11:23:12', verifyTime: '2026-04-17 11:23:12',
    verifyResult: '审核成功', description: '常规物流配送任务',
    routeInfo: {
      mode: '单程航线', start: '临安廊道2号起降点', end: '余杭廊道5号起降点',
      distance: '-', altitude: '120m AGL', payload: '-',
      speed: '12m/s', startTime: '2026-04-17 14:00:00', duration: '45min'
    },
    routeCoords: [
      [30.23, 120.05], [30.22, 120.00], [30.21, 119.96],
      [30.195, 119.92], [30.18, 119.88]
    ]
  },
  'MIS000000687': {
    taskId: 'MIS000000687', taskCode: '04171034', mode: '定时任务',
    bizType: '高速巡检', userId: '1', userName: 'Super',
    uavName: '大疆 M300', submitTime: '2026-04-17 10:34:52', verifyTime: '2026-04-17 10:34:52',
    verifyResult: '审核失败', description: '常规线路巡检任务',
    routeInfo: {
      mode: '单程航线', start: '临安廊道1号起降点', end: '富阳廊道3号起降点',
      distance: '-', altitude: '120m AGL', payload: '-',
      speed: '10m/s', startTime: '2026-04-17 14:30:00', duration: '22min'
    },
    routeCoords: [
      [30.28, 120.10], [30.27, 120.04], [30.26, 119.97],
      [30.25, 119.90], [30.24, 119.84]
    ]
  }
}

// 根据路由参数匹配，找不到则用第一个
const task = ref<any>(allTasks[taskId] || allTasks['MIS000000718'])

function resultClass(v: string) {
  if (v === '审核成功') return 'text-success'
  if (v === '审核失败') return 'text-fail'
  return 'text-pending'
}

function goBack() {
  router.push('/planning/user-task')
}

// ========== Leaflet 地图 ==========
function initMap() {
  const coords = task.value.routeCoords as [number, number][]
  const center = coords[Math.floor(coords.length / 2)]

  mapInstance = L.map('detail-map', {
    center: center,
    zoom: 13,
    attributionControl: false,
    zoomControl: true
  })

  // 卫星底图 (截图中使用的就是卫星影像)
  L.tileLayer('https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {
    subdomains: '1234',
    maxZoom: 18
  }).addTo(mapInstance)

  // 路网叠加层
  L.tileLayer('https://wprd0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=8&ltype=11', {
    subdomains: '1234',
    maxZoom: 18,
    opacity: 0.5
  }).addTo(mapInstance)

  // 地名标注叠加层
  L.tileLayer('https://wprd0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=8&ltype=4', {
    subdomains: '1234',
    maxZoom: 18,
    opacity: 0.9
  }).addTo(mapInstance)

  // 航线 Polyline
  const routeLine = L.polyline(coords, {
    color: '#ff4d4f',
    weight: 4,
    opacity: 0.9
  }).addTo(mapInstance)

  // 起点标记
  L.circleMarker(coords[0], {
    radius: 7,
    fillColor: '#52c41a',
    color: '#fff',
    weight: 2,
    fillOpacity: 1
  }).addTo(mapInstance).bindTooltip('起飞点', { permanent: false, direction: 'top' })

  // 终点标记
  L.circleMarker(coords[coords.length - 1], {
    radius: 7,
    fillColor: '#ff4d4f',
    color: '#fff',
    weight: 2,
    fillOpacity: 1
  }).addTo(mapInstance).bindTooltip('降落点', { permanent: false, direction: 'top' })

  // 飞行至整条航线的 bounds
  mapInstance.fitBounds(routeLine.getBounds(), { padding: [40, 40] })
}

onMounted(() => { initMap(); nextTick(() => { const el = document.getElementById('detail-map'); if (el) el.style.opacity = '1'; }); })

onUnmounted(() => {
  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
  }
})
</script>

<style scoped>
.task-detail-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: #f0f2f5;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}

/* -------- 区域标题 -------- */
.section-header {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
}

/* -------- 白底卡片 -------- */
.custom-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.card-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  padding: 12px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.card-body {
  padding: 16px 20px;
}
.card-body.p-0 { padding: 0; }

/* -------- Descriptions 样式覆盖（无网格风格） -------- */
:deep(.custom-descriptions) {
  --el-descriptions-table-border: none;
}
:deep(.custom-descriptions .el-descriptions__body) {
  background: transparent;
}
:deep(.custom-descriptions .el-descriptions__label) {
  color: #8c8c8c;
  font-size: 13px;
  font-weight: normal;
  min-width: 110px;
  text-align: right;
  padding: 10px 8px 10px 16px;
  background: transparent !important;
}
:deep(.custom-descriptions .el-descriptions__content) {
  color: #333;
  font-size: 13px;
  padding: 10px 16px 10px 8px;
}
:deep(.custom-descriptions .el-descriptions__cell) {
  border: none !important;
}
:deep(.custom-descriptions .el-descriptions__body .el-descriptions__table) {
  border: none !important;
}
/* 行间分隔线 - 极其微妙 */
:deep(.custom-descriptions tr.el-descriptions-row + tr.el-descriptions-row) {
  border-top: 1px solid #f5f5f5;
}

/* -------- 核验结果颜色 -------- */
.text-success { color: #389e0d; font-weight: 500; }
.text-fail    { color: #cf1322; font-weight: 500; }
.text-pending { color: #0958d9; font-weight: 500; }

/* -------- 地图区域 -------- */
.route-map {
  width: 100%;
  height: 420px;
}

/* -------- 底部操作栏 -------- */
.footer-bar {
  display: flex;
  justify-content: center;
  padding: 16px 0 8px;
}

.custom-btn {
  height: 32px;
  line-height: 1;
  padding: 0 32px;
  border-radius: 4px;
  font-size: 13px;
  border-color: #d9d9d9;
  color: #595959;
}
.custom-btn:hover {
  color: #004b9e;
  border-color: #004b9e;
  background: #fff;
}
</style>
