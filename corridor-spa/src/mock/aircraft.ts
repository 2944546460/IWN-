/**
 * 飞行器管理 — Mock 数据
 * 来源: 飞行器管理.html
 */

export interface AircraftRecord {
  id: number
  aircraftId: string
  model: string
  manufacturer: string
  battery: number      // %
  businessType: string
  location: string
  launchTime: string
  status: '在飞' | '待机' | '异常' | '维保'
}

export const AIRCRAFT_LIST: AircraftRecord[] = [
  // 当前在飞任务为空（原型 index.html 中无数据），保留示例 mock
  { id: 1, aircraftId: 'UAV-A01', model: 'DJI-M300RTK',    manufacturer: '大疆创新', battery: 15,  businessType: '高速巡检', location: '杭州市萧山区上空 [30.19, 120.05]', launchTime: '2026-04-17 08:00:00', status: '异常' },
  { id: 2, aircraftId: 'UAV-B02', model: 'Autoflight-V50', manufacturer: '时的科技', battery: 68,  businessType: '医疗物流', location: '余杭区未来科技城上空 [30.31, 119.99]', launchTime: '2026-04-17 10:30:00', status: '在飞' },
  { id: 3, aircraftId: 'UAV-C05', model: 'EHang-216',      manufacturer: '亿航智能', battery: 82,  businessType: '人员运输', location: '西湖景区上空 [30.23, 120.09]', launchTime: '2026-04-17 11:00:00', status: '在飞' },
  { id: 4, aircraftId: 'UAV-D03', model: 'DJI-M300RTK',    manufacturer: '大疆创新', battery: 100, businessType: '货运配送', location: '停机坪待命', launchTime: '-', status: '待机' },
  { id: 5, aircraftId: 'UAV-E07', model: 'XAG-P100',       manufacturer: '极飞科技', battery: 0,   businessType: '农业植保', location: '维保中心', launchTime: '-', status: '维保' },
]

export interface AircraftStats {
  inFlight: number
  flownToday: number
  plannedToday: number
  onlineAbnormal: number
  abnormalToday: number
  completionRate: number  // %
}

export const AIRCRAFT_STATS: AircraftStats = {
  inFlight: 2,
  flownToday: 5,
  plannedToday: 8,
  onlineAbnormal: 1,
  abnormalToday: 2,
  completionRate: 62,
}

// ECharts 趋势图数据（今日24小时）
export const AIRCRAFT_TREND_HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)
export const AIRCRAFT_TREND_NORMAL  = [1,3,1,1,1,1,0,1,2,0,1,3,0,0,0,2,1,3,1,2,2,0,2,0]
export const AIRCRAFT_TREND_ABNORMAL = [1,1,0,1,1,1,0,0,0,0,1,1,0,0,0,1,1,1,0,0,0,1,1,0]
