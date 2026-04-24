export type ReviewStatus = 'passed' | 'failed'
export type WeatherCheckStatus = 'pass' | 'blocked'

export interface RouteInfo {
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

export interface WeatherBlockInfo {
  status: WeatherCheckStatus
  checkedAt: string
  weatherDataAt: string
  ruleVersion: string
  reason?: string
  conflictGrid?: string
  conflictTimeRange?: string
  triggerRule?: string
  weatherFactor?: string
  actualValue?: string
  thresholdValue?: string
}

export interface SafeTimeWindow {
  startTime: string
  endTime: string
  duration: string
  level: string
  reason: string
  available: boolean
}

export interface PlanningTaskSummary {
  taskId: string
  taskName: string
  bizType: string
  corridorName: string
  uavClass: string
  planTime: string
  reviewStatus: ReviewStatus
}

export interface PlanningTaskDetail {
  taskId: string
  taskCode: string
  mode: string
  taskName: string
  bizType: string
  userId: string
  userName: string
  uavName: string
  uavClass: string
  submitTime: string
  description: string
  reviewStatus: ReviewStatus
  routeInfo: RouteInfo
  routeCoords: [number, number][]
  weatherCheck: WeatherBlockInfo
  safeWindows: SafeTimeWindow[]
}

export interface PlanningTaskStats {
  today: number
  passed: number
  failed: number
}

export interface BeamRecord {
  id: number
  beamId: string
  beamName: string
  frequency: string
  bandwidth: string
  coverage: string
  corridorName: string
  status: boolean
  createdAt: string
}

export const PLANNING_TASK_DETAIL_MAP: Record<string, PlanningTaskDetail> = {
  MIS000000718: {
    taskId: 'MIS000000718',
    taskCode: '04221718',
    mode: '定时任务',
    taskName: '长清高速例行巡检',
    bizType: '高速巡检',
    userId: 'USR000001',
    userName: 'Super',
    uavName: 'M300 RTK',
    uavClass: '多旋翼',
    submitTime: '2026-04-22 10:18:32',
    description: '对 G56 杭瑞高速西延段开展例行巡检任务。',
    reviewStatus: 'failed',
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
    weatherCheck: {
      status: 'blocked',
      checkedAt: '2026-04-22 10:20:15',
      weatherDataAt: '2026-04-22 10:19:00',
      ruleVersion: 'WR-2026.04.22-01',
      reason: '当前任务命中三级气象禁飞区，系统审核不通过。',
      conflictGrid: 'GRID-HZ-03-128',
      conflictTimeRange: '2026-04-22 14:00 - 15:00',
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
  },
  MIS000000717: {
    taskId: 'MIS000000717',
    taskCode: '04221717',
    mode: '实时任务',
    taskName: '临安医疗紧急配送',
    bizType: '应急物流',
    userId: 'USR000001',
    userName: 'Super',
    uavName: 'V150 eVTOL',
    uavClass: 'VTOL',
    submitTime: '2026-04-22 09:52:10',
    description: '向临安医疗专用廊道投送应急药品与耗材。',
    reviewStatus: 'passed',
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
    weatherCheck: {
      status: 'pass',
      checkedAt: '2026-04-22 09:53:40',
      weatherDataAt: '2026-04-22 09:53:00',
      ruleVersion: 'WR-2026.04.22-01',
    },
    safeWindows: [],
  },
  MIS000000716: {
    taskId: 'MIS000000716',
    taskCode: '04221716',
    mode: '定时任务',
    taskName: '滨江电力通道巡线',
    bizType: '电力巡检',
    userId: 'USR000001',
    userName: 'Super',
    uavName: 'FW-200',
    uavClass: '固定翼',
    submitTime: '2026-04-22 09:40:08',
    description: '对滨江东段电力巡检廊道执行定时巡线任务。',
    reviewStatus: 'failed',
    routeInfo: {
      mode: '单程航线',
      corridor: '滨江东段巡检廊道',
      start: '滨江电力起降点 1',
      end: '滨江电力起降点 3',
      distance: '25.2 km',
      altitude: '180 m AGL',
      payload: '红外巡检载荷',
      speed: '16 m/s',
      startTime: '2026-04-22 16:00:00',
      duration: '26 min',
    },
    routeCoords: [
      [30.21, 120.08],
      [30.206, 120.05],
      [30.201, 120.02],
      [30.196, 119.99],
      [30.191, 119.96],
    ],
    weatherCheck: {
      status: 'blocked',
      checkedAt: '2026-04-22 09:42:10',
      weatherDataAt: '2026-04-22 09:41:00',
      ruleVersion: 'WR-2026.04.22-01',
      reason: '沿线中段命中气象禁飞区，当前任务审核不通过。',
      conflictGrid: 'GRID-HZ-04-066',
      conflictTimeRange: '2026-04-22 16:00 - 17:00',
      triggerRule: '固定翼风速 > 15m/s 禁飞',
      weatherFactor: '平均风速',
      actualValue: '16.3 m/s',
      thresholdValue: '15.0 m/s',
    },
    safeWindows: [
      {
        startTime: '2026-04-22 18:30',
        endTime: '2026-04-22 19:15',
        duration: '45 min',
        level: '推荐',
        reason: '中段网格风速回落，满足固定翼运行阈值。',
        available: true,
      },
    ],
  },
  MIS000000714: {
    taskId: 'MIS000000714',
    taskCode: '04221714',
    mode: '定时任务',
    taskName: '余杭物流常态配送',
    bizType: '智慧物流',
    userId: 'USR000001',
    userName: 'Super',
    uavName: 'L400 Logistics',
    uavClass: 'VTOL',
    submitTime: '2026-04-22 08:10:02',
    description: '余杭北向物流廊道常态化配送任务。',
    reviewStatus: 'failed',
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
    weatherCheck: {
      status: 'blocked',
      checkedAt: '2026-04-22 08:12:00',
      weatherDataAt: '2026-04-22 08:11:00',
      ruleVersion: 'WR-2026.04.22-01',
      reason: '未来 24 小时内沿线持续处于气象禁飞状态，当前任务无法飞行。',
      conflictGrid: 'GRID-HZ-08-041',
      conflictTimeRange: '未来 24 小时',
      triggerRule: '强降水 + 阵风联动禁飞',
      weatherFactor: '降水 / 风速',
      actualValue: '18 mm/h / 19.2 m/s',
      thresholdValue: '10 mm/h / 15.0 m/s',
    },
    safeWindows: [],
  },
}

export const PLANNING_TASK_SUMMARY_LIST: PlanningTaskSummary[] = Object.values(PLANNING_TASK_DETAIL_MAP).map(task => ({
  taskId: task.taskId,
  taskName: task.taskName,
  bizType: task.bizType,
  corridorName: task.routeInfo.corridor,
  uavClass: task.uavClass,
  planTime: task.routeInfo.startTime,
  reviewStatus: task.reviewStatus,
}))

export const BEAM_LIST: BeamRecord[] = [
  {
    id: 1,
    beamId: 'BM000000001',
    beamName: '主干波束-K01',
    frequency: '5.8GHz',
    bandwidth: '80MHz',
    coverage: '杭州主线廊道 A 全段',
    corridorName: '杭州主线廊道 A',
    status: true,
    createdAt: '2026-01-10 09:00:00',
  },
  {
    id: 2,
    beamId: 'BM000000002',
    beamName: '景区波束-S01',
    frequency: '2.4GHz',
    bandwidth: '40MHz',
    coverage: '西湖环湖廊道 B 全段',
    corridorName: '西湖环湖廊道 B',
    status: true,
    createdAt: '2026-01-12 10:00:00',
  },
  {
    id: 3,
    beamId: 'BM000000003',
    beamName: '物流波束-L01',
    frequency: '5.8GHz',
    bandwidth: '80MHz',
    coverage: '钱塘物流廊道 C 全段',
    corridorName: '钱塘物流廊道 C',
    status: false,
    createdAt: '2026-01-15 14:00:00',
  },
]
