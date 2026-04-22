<template>
  <div class="task-detail-page">
    <div class="custom-card mb-4">
      <div class="card-title">任务基础信息</div>
      <div class="card-body">
        <el-descriptions :column="3" class="custom-descriptions">
          <el-descriptions-item label="任务 ID">{{ task.taskId }}</el-descriptions-item>
          <el-descriptions-item label="任务编码">{{ task.taskCode }}</el-descriptions-item>
          <el-descriptions-item label="任务模式">{{ task.mode }}</el-descriptions-item>
          <el-descriptions-item label="业务类型">{{ task.bizType }}</el-descriptions-item>
          <el-descriptions-item label="申请用户 ID">{{ task.userId }}</el-descriptions-item>
          <el-descriptions-item label="申请用户名称">{{ task.userName }}</el-descriptions-item>
          <el-descriptions-item label="飞行器型号">{{ task.uavName }}</el-descriptions-item>
          <el-descriptions-item label="机型类别">
            <span class="uav-tag" :class="uavClassClass(task.uavClass)">{{ task.uavClass }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="提交时间">{{ task.submitTime }}</el-descriptions-item>
          <el-descriptions-item label="审批状态">
            <span :class="approvalTextClass(task.approval.status)">{{ approvalStatusLabel(task.approval.status) }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="计划廊道">{{ task.routeInfo.corridor }}</el-descriptions-item>
          <el-descriptions-item label="计划起飞时间">{{ task.routeInfo.startTime }}</el-descriptions-item>
          <el-descriptions-item label="任务描述" :span="3">{{ task.description || '-' }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </div>

    <div class="custom-card mb-4">
      <div class="card-title">气象预检结论</div>
      <div class="card-body">
        <div class="precheck-summary" :class="summaryClass(task.weatherPrecheck.status)">
          <div class="summary-left">
            <span class="status-tag" :class="summaryClass(task.weatherPrecheck.status)">
              {{ precheckStatusLabel(task.weatherPrecheck.status) }}
            </span>
            <div class="summary-text">
              <div class="summary-title">{{ task.weatherPrecheck.summary }}</div>
              <div class="summary-desc">{{ task.weatherPrecheck.advice }}</div>
            </div>
          </div>
          <div class="summary-meta">
            <div class="meta-item">
              <span class="meta-label">判定时间</span>
              <span class="meta-value">{{ task.weatherPrecheck.checkedAt }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">气象数据时间</span>
              <span class="meta-value">{{ task.weatherPrecheck.weatherDataAt }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">规则版本</span>
              <span class="meta-value">{{ task.weatherPrecheck.ruleVersion }}</span>
            </div>
          </div>
        </div>

        <el-descriptions :column="3" class="custom-descriptions mt-4">
          <el-descriptions-item label="适用机型">{{ task.weatherPrecheck.uavClass }}</el-descriptions-item>
          <el-descriptions-item label="命中禁飞区">{{ task.weatherPrecheck.hitNoFlyZone ? '是' : '否' }}</el-descriptions-item>
          <el-descriptions-item label="允许审批通过">{{ task.weatherPrecheck.canApprove ? '是' : '否' }}</el-descriptions-item>
          <el-descriptions-item label="冲突网格">{{ task.weatherPrecheck.conflictGrid || '-' }}</el-descriptions-item>
          <el-descriptions-item label="冲突时段">{{ task.weatherPrecheck.conflictTimeRange || '-' }}</el-descriptions-item>
          <el-descriptions-item label="冲突等级">{{ task.weatherPrecheck.conflictLevel || '-' }}</el-descriptions-item>
          <el-descriptions-item label="触发规则">{{ task.weatherPrecheck.triggerRule || '-' }}</el-descriptions-item>
          <el-descriptions-item label="气象因子">{{ task.weatherPrecheck.weatherFactor || '-' }}</el-descriptions-item>
          <el-descriptions-item label="阈值对比">
            {{ task.weatherPrecheck.actualValue && task.weatherPrecheck.thresholdValue
              ? `${task.weatherPrecheck.actualValue} / ${task.weatherPrecheck.thresholdValue}`
              : '-' }}
          </el-descriptions-item>
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
            <el-descriptions-item label="受影响航段">{{ task.weatherPrecheck.affectedSegment || '-' }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <div class="custom-card">
        <div class="card-title">航线与冲突分析</div>
        <div class="card-body p-0">
          <div id="detail-map" class="route-map"></div>
          <div class="map-legend">
            <span class="legend-item"><i class="legend-dot legend-route"></i>计划航线</span>
            <span class="legend-item"><i class="legend-dot legend-conflict"></i>冲突区域</span>
            <span class="legend-item"><i class="legend-dot legend-point-start"></i>起点</span>
            <span class="legend-item"><i class="legend-dot legend-point-end"></i>终点</span>
          </div>
        </div>
      </div>
    </div>

    <div class="custom-card mb-4">
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
            <el-table-column label="适飞性" min-width="90" align="center">
              <template #default="{ row }">
                <span :class="row.available ? 'text-success' : 'text-fail'">{{ row.available ? '可飞' : '不可飞' }}</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <el-empty v-else description="未来 24 小时无可用适飞窗口，建议驳回或重新申报任务。" />
      </div>
    </div>

    <div class="custom-card">
      <div class="card-title">任务审批</div>
      <div class="card-body">
        <div class="approval-notice" :class="summaryClass(task.weatherPrecheck.status)">
          <div class="notice-title">审批建议</div>
          <div class="notice-text">{{ approvalHint }}</div>
        </div>

        <el-form label-position="top" class="approval-form mt-4">
          <el-form-item label="审批意见">
            <el-input
              v-model="approvalComment"
              type="textarea"
              :rows="4"
              resize="none"
              placeholder="请输入审批意见或处理说明"
              class="custom-el-input"
            />
          </el-form-item>
        </el-form>

        <div class="footer-bar">
          <el-button @click="goBack" class="custom-btn">返回</el-button>
          <el-button @click="handleReject" class="custom-btn">驳回</el-button>
          <el-button
            v-if="showRescheduleButton"
            @click="handleRecommendReschedule"
            class="custom-btn"
          >
            建议改期
          </el-button>
          <el-button
            type="primary"
            :disabled="!task.weatherPrecheck.canApprove"
            @click="handleApprove"
            class="custom-btn custom-btn-primary"
          >
            审批通过
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'

type PrecheckStatus = 'pending' | 'pass' | 'risk' | 'blocked' | 'all_day_blocked'
type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'adjusting' | 'blocked'

interface RouteInfo {
  mode: string
  corridor: string
  start: string
  end: string
  distance: string
  altitude: string
  payload: string
  speed: string
  startTime: string
  duration: string
}

interface WeatherPrecheckInfo {
  status: PrecheckStatus
  summary: string
  advice: string
  checkedAt: string
  weatherDataAt: string
  ruleVersion: string
  uavClass: string
  hitNoFlyZone: boolean
  canApprove: boolean
  affectedSegment?: string
  conflictGrid?: string
  conflictTimeRange?: string
  conflictLevel?: string
  triggerRule?: string
  weatherFactor?: string
  actualValue?: string
  thresholdValue?: string
}

interface SafeTimeWindow {
  startTime: string
  endTime: string
  duration: string
  level: string
  reason: string
  available: boolean
}

interface ApprovalInfo {
  status: ApprovalStatus
  updatedAt: string
}

interface TaskDetailRecord {
  taskId: string
  taskCode: string
  mode: string
  bizType: string
  userId: string
  userName: string
  uavName: string
  uavClass: string
  submitTime: string
  description: string
  routeInfo: RouteInfo
  routeCoords: [number, number][]
  weatherPrecheck: WeatherPrecheckInfo
  safeWindows: SafeTimeWindow[]
  approval: ApprovalInfo
}

const route = useRoute()
const router = useRouter()
const taskId = route.params.id as string
const approvalComment = ref('')

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

const taskMap: Record<string, TaskDetailRecord> = {
  MIS000000718: {
    taskId: 'MIS000000718',
    taskCode: '04221718',
    mode: '定时任务',
    bizType: '高速巡检',
    userId: 'USR000001',
    userName: 'Super',
    uavName: 'M300 RTK',
    uavClass: '多旋翼',
    submitTime: '2026-04-22 10:18:32',
    description: '对 G56 杭瑞高速西延段开展例行巡检任务。',
    routeInfo: {
      mode: '单程航线',
      corridor: 'G56 杭瑞高速西延段',
      start: '长清高速起降点 A',
      end: '长清高速起降点 C',
      distance: '18.6 km',
      altitude: '120 m AGL',
      payload: '高清巡检吊舱',
      speed: '10 m/s',
      startTime: '2026-04-22 14:00:00',
      duration: '31 min',
    },
    routeCoords: [
      [30.26, 119.98],
      [30.255, 119.965],
      [30.249, 119.946],
      [30.246, 119.925],
      [30.242, 119.902],
      [30.238, 119.878],
    ],
    weatherPrecheck: {
      status: 'blocked',
      summary: '当前任务命中三级气象禁飞区，系统禁止直接审批通过。',
      advice: '建议改期至推荐窗口重新提交；如业务紧急，请调整任务时段后再次发起审批。',
      checkedAt: '2026-04-22 10:20:15',
      weatherDataAt: '2026-04-22 10:19:00',
      ruleVersion: 'WR-2026.04.22-01',
      uavClass: '多旋翼',
      hitNoFlyZone: true,
      canApprove: false,
      affectedSegment: 'K12+300 至 K18+100',
      conflictGrid: 'GRID-HZ-03-128',
      conflictTimeRange: '2026-04-22 14:00 - 15:00',
      conflictLevel: '三级禁飞',
      triggerRule: '多旋翼风速 > 12m/s 禁飞',
      weatherFactor: '阵风风速',
      actualValue: '14.8 m/s',
      thresholdValue: '12.0 m/s',
    },
    safeWindows: [
      {
        startTime: '2026-04-22 16:30',
        endTime: '2026-04-22 17:20',
        duration: '50 min',
        level: '推荐',
        reason: '风速回落至阈值以下，沿线无禁飞重叠。',
        available: true,
      },
      {
        startTime: '2026-04-22 18:00',
        endTime: '2026-04-22 19:00',
        duration: '60 min',
        level: '可选',
        reason: '降水减弱，能见度恢复，适合执行巡检任务。',
        available: true,
      },
    ],
    approval: {
      status: 'blocked',
      updatedAt: '2026-04-22 10:20:15',
    },
  },
  MIS000000717: {
    taskId: 'MIS000000717',
    taskCode: '04221717',
    mode: '实时任务',
    bizType: '应急物流',
    userId: 'USR000001',
    userName: 'Super',
    uavName: 'V150 eVTOL',
    uavClass: 'VTOL',
    submitTime: '2026-04-22 09:52:10',
    description: '向临安医疗专用廊道投送应急药品与耗材。',
    routeInfo: {
      mode: '单程航线',
      corridor: '临安医疗专用廊道',
      start: '临安中心医院起降点',
      end: '临安西院区起降点',
      distance: '12.4 km',
      altitude: '150 m AGL',
      payload: '医疗物资箱',
      speed: '14 m/s',
      startTime: '2026-04-22 15:30:00',
      duration: '18 min',
    },
    routeCoords: [
      [30.24, 120.05],
      [30.235, 120.03],
      [30.229, 120.01],
      [30.222, 119.995],
      [30.216, 119.978],
    ],
    weatherPrecheck: {
      status: 'pass',
      summary: '未来飞行时段内未命中气象禁飞区，可进入审批流程。',
      advice: '气象条件满足当前机型飞行要求，可按计划执行任务。',
      checkedAt: '2026-04-22 09:53:40',
      weatherDataAt: '2026-04-22 09:53:00',
      ruleVersion: 'WR-2026.04.22-01',
      uavClass: 'VTOL',
      hitNoFlyZone: false,
      canApprove: true,
    },
    safeWindows: [
      {
        startTime: '2026-04-22 15:30',
        endTime: '2026-04-22 16:00',
        duration: '30 min',
        level: '当前可飞',
        reason: '沿线风速、降水均处于安全范围内。',
        available: true,
      },
    ],
    approval: {
      status: 'pending',
      updatedAt: '2026-04-22 09:53:40',
    },
  },
  MIS000000714: {
    taskId: 'MIS000000714',
    taskCode: '04221714',
    mode: '定时任务',
    bizType: '智慧物流',
    userId: 'USR000001',
    userName: 'Super',
    uavName: 'L400 Logistics',
    uavClass: 'VTOL',
    submitTime: '2026-04-22 08:10:02',
    description: '余杭北向物流廊道常态化配送任务。',
    routeInfo: {
      mode: '往返航线',
      corridor: '余杭北向物流廊道',
      start: '余杭物流园起降点',
      end: '北向分拨中心起降点',
      distance: '22.8 km',
      altitude: '160 m AGL',
      payload: '标准货箱',
      speed: '16 m/s',
      startTime: '2026-04-22 18:20:00',
      duration: '42 min',
    },
    routeCoords: [
      [30.35, 120.01],
      [30.344, 119.992],
      [30.338, 119.98],
      [30.332, 119.968],
      [30.325, 119.956],
    ],
    weatherPrecheck: {
      status: 'all_day_blocked',
      summary: '未来 24 小时内沿线持续处于气象禁飞状态，当前任务建议直接驳回。',
      advice: '请重新申报新的飞行日期，或等待后续气象数据刷新后再次评估。',
      checkedAt: '2026-04-22 08:12:00',
      weatherDataAt: '2026-04-22 08:11:00',
      ruleVersion: 'WR-2026.04.22-01',
      uavClass: 'VTOL',
      hitNoFlyZone: true,
      canApprove: false,
      affectedSegment: '全线段',
      conflictGrid: 'GRID-HZ-08-041',
      conflictTimeRange: '未来 24 小时',
      conflictLevel: '一级绝对禁飞',
      triggerRule: '强降水 + 阵风联动禁飞',
      weatherFactor: '降水 / 风速',
      actualValue: '18 mm/h / 19.2 m/s',
      thresholdValue: '10 mm/h / 15.0 m/s',
    },
    safeWindows: [],
    approval: {
      status: 'blocked',
      updatedAt: '2026-04-22 08:12:00',
    },
  },
}

const task = ref<TaskDetailRecord>(taskMap[taskId] || taskMap.MIS000000718)
let mapInstance: L.Map | null = null

const approvalHint = computed(() => {
  if (task.value.weatherPrecheck.canApprove) {
    return '当前任务气象预检通过，审批通过按钮可直接使用。'
  }
  if (task.value.weatherPrecheck.status === 'all_day_blocked') {
    return '未来 24 小时内无可用适飞窗口，系统不允许审批通过，建议直接驳回。'
  }
  return '当前任务命中气象禁飞区，审批通过按钮已禁用，请优先执行驳回或建议改期。'
})

const showRescheduleButton = computed(() =>
  ['risk', 'blocked'].includes(task.value.weatherPrecheck.status),
)

function approvalStatusLabel(status: ApprovalStatus) {
  const map: Record<ApprovalStatus, string> = {
    pending: '待审批',
    approved: '已通过',
    rejected: '已驳回',
    adjusting: '待调整',
    blocked: '已阻断',
  }
  return map[status]
}

function approvalTextClass(status: ApprovalStatus) {
  if (status === 'approved') return 'text-success'
  if (status === 'rejected' || status === 'blocked') return 'text-fail'
  return 'text-pending'
}

function precheckStatusLabel(status: PrecheckStatus) {
  const map: Record<PrecheckStatus, string> = {
    pending: '待预检',
    pass: '预检通过',
    risk: '存在风险',
    blocked: '气象阻断',
    all_day_blocked: '全天候禁飞',
  }
  return map[status]
}

function summaryClass(status: PrecheckStatus) {
  const map: Record<PrecheckStatus, string> = {
    pending: 'summary-pending',
    pass: 'summary-pass',
    risk: 'summary-risk',
    blocked: 'summary-blocked',
    all_day_blocked: 'summary-all-day',
  }
  return map[status]
}

function uavClassClass(value: string) {
  if (value === '多旋翼') return 'uav-multirotor'
  if (value === '固定翼') return 'uav-fixedwing'
  if (value === 'VTOL') return 'uav-vtol'
  return 'uav-default'
}

function goBack() {
  router.push('/planning/user-task')
}

function handleApprove() {
  if (!task.value.weatherPrecheck.canApprove) {
    ElMessage.warning('当前任务命中气象禁飞条件，系统禁止审批通过。')
    return
  }
  task.value.approval.status = 'approved'
  task.value.approval.updatedAt = '2026-04-22 10:30:00'
  ElMessage.success('任务已审批通过。')
}

function handleReject() {
  task.value.approval.status = 'rejected'
  task.value.approval.updatedAt = '2026-04-22 10:30:00'
  ElMessage.success('任务已驳回。')
}

function handleRecommendReschedule() {
  task.value.approval.status = 'adjusting'
  task.value.approval.updatedAt = '2026-04-22 10:30:00'
  ElMessage.info('已生成改期建议，请申请方按推荐窗口重新提交任务。')
}

function initMap() {
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

  if (task.value.weatherPrecheck.hitNoFlyZone) {
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

    conflictArea.bindTooltip(task.value.weatherPrecheck.conflictLevel || '气象禁飞区', {
      permanent: false,
      direction: 'center',
    })
  }

  mapInstance.fitBounds(routeLine.getBounds(), { padding: [28, 28] })
}

onMounted(() => {
  nextTick(() => initMap())
})

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

.precheck-summary {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
}

.summary-left {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.summary-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.summary-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.summary-desc {
  font-size: 13px;
  color: #595959;
  line-height: 1.7;
}

.summary-meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(120px, 1fr));
  gap: 12px;
  min-width: 420px;
}

.meta-item {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  padding: 10px 12px;
}

.meta-label {
  display: block;
  color: #8c8c8c;
  font-size: 12px;
  margin-bottom: 6px;
}

.meta-value {
  display: block;
  color: #333;
  font-size: 13px;
}

.status-tag,
.uav-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 84px;
  height: 24px;
  padding: 0 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid transparent;
  white-space: nowrap;
}

.summary-pending,
.summary-pending.status-tag {
  background: #f0f7ff;
  color: #1677ff;
  border-color: #91caff;
}

.summary-pass,
.summary-pass.status-tag {
  background: #f6ffed;
  color: #52c41a;
  border-color: #b7eb8f;
}

.summary-risk,
.summary-risk.status-tag {
  background: #fff7e6;
  color: #fa8c16;
  border-color: #ffd591;
}

.summary-blocked,
.summary-blocked.status-tag {
  background: #fff1f0;
  color: #ff4d4f;
  border-color: #ffb3b3;
}

.summary-all-day,
.summary-all-day.status-tag {
  background: #fff1f0;
  color: #cf1322;
  border-color: #ffa39e;
}

.uav-multirotor {
  color: #1677ff;
  background: #f0f7ff;
  border-color: #b6d7ff;
}

.uav-fixedwing {
  color: #52c41a;
  background: #f6ffed;
  border-color: #b7eb8f;
}

.uav-vtol {
  color: #fa8c16;
  background: #fff7e6;
  border-color: #ffd591;
}

.uav-default {
  color: #595959;
  background: #fafafa;
  border-color: #d9d9d9;
}

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

.legend-route {
  background: #1677ff;
}

.legend-conflict {
  background: #ff4d4f;
}

.legend-point-start {
  background: #52c41a;
}

.legend-point-end {
  background: #fa541c;
}

.custom-el-table {
  --el-table-border-color: transparent;
  --el-table-row-hover-bg-color: #f5f7fa;
}

.custom-el-table::before {
  display: none;
}

.approval-notice {
  padding: 14px 16px;
  border-radius: 6px;
  border: 1px solid #f0f0f0;
}

.notice-title {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 6px;
}

.notice-text {
  font-size: 13px;
  line-height: 1.7;
  color: #595959;
}

.approval-form :deep(.el-form-item__label) {
  color: #595959;
  font-size: 13px;
}

:deep(.custom-el-input .el-input__wrapper),
:deep(.custom-el-input .el-textarea__inner) {
  box-shadow: none !important;
  border: 1px solid #d9d9d9 !important;
  border-radius: 4px;
}

:deep(.custom-el-input .el-textarea__inner) {
  padding: 10px 12px;
  font-size: 13px;
}

:deep(.custom-el-input .el-textarea__inner:focus) {
  border-color: #004b9e !important;
}

.footer-bar {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
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

.custom-btn-primary {
  background: #004b9e !important;
  border-color: #004b9e !important;
  color: #fff !important;
}

.custom-btn-primary:hover {
  background: #005bc4 !important;
  border-color: #005bc4 !important;
}

.text-success {
  color: #52c41a;
  font-weight: 500;
}

.text-fail {
  color: #ff4d4f;
  font-weight: 500;
}

.text-pending {
  color: #1677ff;
  font-weight: 500;
}

@media (max-width: 1400px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .summary-meta {
    grid-template-columns: 1fr;
    min-width: 220px;
  }

  .precheck-summary {
    flex-direction: column;
  }
}
</style>
