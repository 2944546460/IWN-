<template>
  <div class="task-detail-page" v-loading="loading">
    <template v-if="task">
      <div class="custom-card mb-4">
        <div class="card-title">任务基础信息</div>
        <div class="card-body">
          <el-descriptions :column="3" class="custom-descriptions">
            <el-descriptions-item label="任务 ID">{{ task.taskId }}</el-descriptions-item>
            <el-descriptions-item label="任务编码">{{ task.taskCode }}</el-descriptions-item>
            <el-descriptions-item label="任务模式">{{ task.mode }}</el-descriptions-item>
            <el-descriptions-item label="任务名称">{{ task.taskName }}</el-descriptions-item>
            <el-descriptions-item label="业务类型">{{ task.bizType }}</el-descriptions-item>
            <el-descriptions-item label="申请用户">{{ task.userName }}（{{ task.userId }}）</el-descriptions-item>
            <el-descriptions-item label="飞行器型号">{{ task.uavName }}</el-descriptions-item>
            <el-descriptions-item label="机型类别">
              <span class="uav-tag" :class="uavClassClass(task.uavClass)">{{ task.uavClass }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="提交时间">{{ task.submitTime }}</el-descriptions-item>
            <el-descriptions-item label="审核结果">
              <span :class="task.reviewStatus === 'passed' ? 'text-success' : 'text-fail'">
                {{ task.reviewStatus === 'passed' ? '审核通过' : '审核不通过' }}
              </span>
            </el-descriptions-item>
            <el-descriptions-item label="计划廊道">{{ task.routeInfo.corridor }}</el-descriptions-item>
            <el-descriptions-item label="计划起飞时间">{{ task.routeInfo.startTime }}</el-descriptions-item>
            <el-descriptions-item label="任务描述" :span="3">{{ task.description || '-' }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <div class="detail-grid mb-4">
        <div class="custom-card">
          <div class="card-title">航线信息</div>
          <div class="card-body">
            <el-descriptions :column="2" class="custom-descriptions">
              <el-descriptions-item label="航线模式">{{ task.routeInfo.mode }}</el-descriptions-item>
              <el-descriptions-item label="计划廊道">{{ task.routeInfo.corridor }}</el-descriptions-item>
              <el-descriptions-item label="起飞点">{{ task.routeInfo.start }}</el-descriptions-item>
              <el-descriptions-item label="降落点">{{ task.routeInfo.end }}</el-descriptions-item>
              <el-descriptions-item label="飞行距离">{{ task.routeInfo.distance }}</el-descriptions-item>
              <el-descriptions-item label="飞行高度">{{ task.routeInfo.altitude }}</el-descriptions-item>
              <el-descriptions-item label="飞行速度">{{ task.routeInfo.speed }}</el-descriptions-item>
              <el-descriptions-item label="飞行时长">{{ task.routeInfo.duration }}</el-descriptions-item>
              <el-descriptions-item label="任务载荷">{{ task.routeInfo.payload }}</el-descriptions-item>
              <el-descriptions-item label="气象数据时间">{{ task.weatherCheck.weatherDataAt }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </div>

        <div class="custom-card">
          <div class="card-title">航线地图</div>
          <div class="card-body p-0">
            <div id="detail-map" class="route-map"></div>
            <div class="map-legend">
              <span class="legend-item"><i class="legend-dot legend-route"></i>规划航线</span>
              <span v-if="task.reviewStatus === 'failed'" class="legend-item"><i class="legend-dot legend-conflict"></i>气象阻断区</span>
              <span class="legend-item"><i class="legend-dot legend-point-start"></i>起点</span>
              <span class="legend-item"><i class="legend-dot legend-point-end"></i>终点</span>
            </div>
          </div>
        </div>
      </div>

      <template v-if="task.reviewStatus === 'failed'">
        <div class="custom-card mb-4">
          <div class="card-title">审核不通过原因</div>
          <div class="card-body">
            <div class="reason-panel">
              <div class="reason-title">{{ task.weatherCheck.reason }}</div>
              <el-descriptions :column="3" class="custom-descriptions mt-4">
                <el-descriptions-item label="判定时间">{{ task.weatherCheck.checkedAt }}</el-descriptions-item>
                <el-descriptions-item label="规则版本">{{ task.weatherCheck.ruleVersion }}</el-descriptions-item>
                <el-descriptions-item label="冲突时段">{{ task.weatherCheck.conflictTimeRange || '-' }}</el-descriptions-item>
                <el-descriptions-item label="冲突网格">{{ task.weatherCheck.conflictGrid || '-' }}</el-descriptions-item>
                <el-descriptions-item label="触发规则">{{ task.weatherCheck.triggerRule || '-' }}</el-descriptions-item>
                <el-descriptions-item label="气象因子">{{ task.weatherCheck.weatherFactor || '-' }}</el-descriptions-item>
                <el-descriptions-item label="阈值对比" :span="3">
                  {{ task.weatherCheck.actualValue && task.weatherCheck.thresholdValue
                    ? `${task.weatherCheck.actualValue} / ${task.weatherCheck.thresholdValue}`
                    : '-' }}
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
        </div>

        <div class="custom-card">
          <div class="card-title">适飞窗口建议</div>
          <div class="card-body">
            <template v-if="task.safeWindows.length">
              <el-table
                :data="task.safeWindows"
                class="custom-el-table"
                :header-cell-style="tableHeaderStyle"
                :cell-style="tableCellStyle"
              >
                <el-table-column type="index" label="序号" width="60" align="center" />
                <el-table-column prop="startTime" label="建议开始时间" min-width="160" />
                <el-table-column prop="endTime" label="建议结束时间" min-width="160" />
                <el-table-column prop="duration" label="持续时长" min-width="100" />
                <el-table-column prop="level" label="推荐等级" min-width="100" />
                <el-table-column prop="reason" label="推荐原因" min-width="260" show-overflow-tooltip />
              </el-table>
            </template>
            <div v-else class="no-window-panel">
              未来 24 小时无合适飞行窗口，当前任务无法飞行。
            </div>
          </div>
        </div>
      </template>

      <div class="footer-bar">
        <el-button @click="goBack" class="custom-btn">返回</el-button>
      </div>
    </template>

    <el-empty v-else description="未找到该任务详情" />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'
import { getPlanningTaskDetail, type PlanningTaskDetail } from '@/api/modules'

const route = useRoute()
const router = useRouter()
const task = ref<PlanningTaskDetail | null>(null)
const loading = ref(false)
let mapInstance: L.Map | null = null

const tableHeaderStyle = {
  background: '#fafafa',
  color: '#8c8c8c',
  fontWeight: '500',
  fontSize: '13px',
  borderBottom: '1px solid #f0f0f0',
}

const tableCellStyle = {
  color: '#333',
  fontSize: '13px',
  borderBottom: '1px solid #f5f5f5',
}

async function loadTask() {
  loading.value = true
  task.value = await getPlanningTaskDetail(route.params.id as string)
  loading.value = false
  await nextTick()
  renderMap()
}

function disposeMap() {
  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
  }
}

function renderMap() {
  disposeMap()
  if (!task.value) return

  const coords = task.value.routeCoords
  const center = coords[Math.floor(coords.length / 2)]

  mapInstance = L.map('detail-map', {
    center,
    zoom: 13,
    attributionControl: false,
    zoomControl: true,
  })

  L.tileLayer('https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {
    subdomains: '1234',
    maxZoom: 18,
  }).addTo(mapInstance)

  L.tileLayer('https://wprd0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=8&ltype=11', {
    subdomains: '1234',
    maxZoom: 18,
    opacity: 0.5,
  }).addTo(mapInstance)

  const routeLine = L.polyline(coords, {
    color: '#1677ff',
    weight: 4,
    opacity: 0.9,
  }).addTo(mapInstance)

  L.circleMarker(coords[0], {
    radius: 7,
    fillColor: '#52c41a',
    color: '#fff',
    weight: 2,
    fillOpacity: 1,
  }).addTo(mapInstance).bindTooltip('起飞点', { permanent: false, direction: 'top' })

  L.circleMarker(coords[coords.length - 1], {
    radius: 7,
    fillColor: '#ff4d4f',
    color: '#fff',
    weight: 2,
    fillOpacity: 1,
  }).addTo(mapInstance).bindTooltip('降落点', { permanent: false, direction: 'top' })

  if (task.value.reviewStatus === 'failed' && coords.length >= 4) {
    const conflictArea = L.polygon(
      [
        [coords[2][0] + 0.01, coords[2][1] - 0.015],
        [coords[2][0] + 0.018, coords[2][1] + 0.005],
        [coords[3][0] - 0.01, coords[3][1] + 0.015],
        [coords[3][0] - 0.018, coords[3][1] - 0.005],
      ],
      {
        color: '#ff4d4f',
        weight: 2,
        fillColor: '#ff4d4f',
        fillOpacity: 0.22,
        dashArray: '6 4',
      },
    ).addTo(mapInstance)

    conflictArea.bindTooltip('气象阻断区', {
      permanent: false,
      direction: 'center',
    })
  }

  mapInstance.fitBounds(routeLine.getBounds(), { padding: [28, 28] })
}

function goBack() {
  router.push('/planning/user-task')
}

function uavClassClass(value: string) {
  if (value === '多旋翼') return 'uav-multirotor'
  if (value === '固定翼') return 'uav-fixedwing'
  if (value === 'VTOL') return 'uav-vtol'
  return 'uav-default'
}

watch(
  () => route.params.id,
  () => {
    loadTask()
  },
)

onMounted(() => {
  loadTask()
})

onUnmounted(() => {
  disposeMap()
})
</script>

<style scoped>
.task-detail-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: #f0f2f5;
  min-height: 100%;
  box-sizing: border-box;
}

.custom-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.card-title {
  padding: 12px 20px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  position: relative;
}

.card-title::before {
  content: '';
  display: inline-block;
  width: 3px;
  height: 14px;
  background: #004b9e;
  border-radius: 2px;
  margin-right: 8px;
  vertical-align: -2px;
}

.card-body {
  padding: 16px 20px;
}

.card-body.p-0 {
  padding: 0;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 16px;
}

:deep(.custom-descriptions) {
  --el-descriptions-table-border: none;
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

:deep(.custom-descriptions tr.el-descriptions-row + tr.el-descriptions-row) {
  border-top: 1px solid #f5f5f5;
}

.uav-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  height: 24px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid transparent;
  white-space: nowrap;
}

.uav-multirotor { color: #1677ff; background: #f0f7ff; border-color: #b6d7ff; }
.uav-fixedwing { color: #52c41a; background: #f6ffed; border-color: #b7eb8f; }
.uav-vtol { color: #fa8c16; background: #fff7e6; border-color: #ffd591; }
.uav-default { color: #595959; background: #fafafa; border-color: #d9d9d9; }

.text-success { color: #52c41a; font-weight: 500; }
.text-fail { color: #ff4d4f; font-weight: 500; }

.route-map {
  width: 100%;
  height: 360px;
}

.map-legend {
  display: flex;
  gap: 18px;
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
  color: #595959;
  font-size: 12px;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.legend-route { background: #1677ff; }
.legend-conflict { background: #ff4d4f; }
.legend-point-start { background: #52c41a; }
.legend-point-end { background: #fa541c; }

.reason-panel {
  padding: 16px;
  border: 1px solid #ffccc7;
  background: #fff1f0;
  border-radius: 6px;
}

.reason-title {
  color: #cf1322;
  font-size: 14px;
  font-weight: 500;
}

.no-window-panel {
  padding: 16px;
  border: 1px solid #ffccc7;
  background: #fff1f0;
  border-radius: 6px;
  color: #cf1322;
  font-size: 13px;
}

.custom-el-table {
  --el-table-border-color: transparent;
  --el-table-row-hover-bg-color: #f5f7fa;
}

.custom-el-table::before {
  display: none;
}

.footer-bar {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
}

.custom-btn {
  height: 32px;
  line-height: 1;
  padding: 0 22px;
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

@media (max-width: 1400px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
