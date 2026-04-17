/**
 * 健康管理 — Mock 数据
 * 来源: 健康管理.html
 */

export interface HealthAlertRecord {
  id: number
  alertId: string
  level: '严重' | '警告' | '提示'
  module: string
  content: string
  source: string
  triggerTime: string
  status: '未处理' | '处理中' | '已解决'
}

export const HEALTH_ALERT_LIST: HealthAlertRecord[] = [
  { id: 1, alertId: 'ALT000000001', level: '严重', module: '地面节点',   content: 'NODE-GZ03 通信中断超过5分钟',    source: 'BSL000000129', triggerTime: '2026-04-17 14:28:00', status: '处理中' },
  { id: 2, alertId: 'ALT000000002', level: '警告', module: '飞行器',     content: 'UAV-A01 电量低于15%',           source: 'UAV-A01',      triggerTime: '2026-04-17 14:31:00', status: '未处理' },
  { id: 3, alertId: 'ALT000000003', level: '警告', module: '廊道',       content: 'C003廊道气象预警 — 风速超10m/s', source: 'COR000000003', triggerTime: '2026-04-17 13:47:00', status: '未处理' },
  { id: 4, alertId: 'ALT000000004', level: '提示', module: '地面节点',   content: 'BSL000000127 CPU使用率>75%',     source: 'BSL000000127', triggerTime: '2026-04-17 12:15:00', status: '已解决' },
  { id: 5, alertId: 'ALT000000005', level: '严重', module: '飞行器',     content: 'UAV-B02 GPS信号丢失',            source: 'UAV-B02',      triggerTime: '2026-04-17 11:50:00', status: '已解决' },
  { id: 6, alertId: 'ALT000000006', level: '警告', module: '地面节点',   content: 'BSL000000121 内存使用率>95%',    source: 'BSL000000121', triggerTime: '2026-04-17 11:00:00', status: '已解决' },
]

// ECharts 健康评分数据（近7天，5个子系统）
export const HEALTH_MODULES = ['廊道系统', '地面节点', '飞行器', '气象系统', '通信系统']
export const HEALTH_DAYS    = ['4/11', '4/12', '4/13', '4/14', '4/15', '4/16', '4/17']
export const HEALTH_SCORES: Record<string, number[]> = {
  '廊道系统': [98, 97, 96, 98, 95, 97, 96],
  '地面节点': [92, 88, 85, 90, 87, 82, 78],
  '飞行器':   [95, 93, 96, 94, 91, 89, 88],
  '气象系统': [99, 99, 100,98, 97, 99, 98],
  '通信系统': [96, 95, 94, 97, 96, 94, 92],
}

// 雷达图配置项
export const HEALTH_RADAR_INDICATORS = HEALTH_MODULES.map(name => ({ name, max: 100 }))
export const HEALTH_RADAR_SCORES = [96, 78, 88, 98, 92]
