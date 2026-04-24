/**
 * 健康管理 — Mock 数据
 * 来源: 健康管理.html
 */

export interface HealthAlertRecord {
  id: number
  object: string
  deviceType: string
  module: string
  metric: string
  content: string
  level: '严重' | '警告' | '提示'
  status: '未处理' | '处理中' | '已处理' | '已解决'
  task: string
  triggerTime: string
  handleTime: string
}

export const HEALTH_ALERT_LIST: HealthAlertRecord[] = [
  { id: 1, object: '总院测试机一号', deviceType: '-', module: '-', metric: '-', content: '飞行器偏离航线，请注意水平方向安全', level: '提示', status: '已处理', task: '04241023', triggerTime: '2026-04-24 10:36:06', handleTime: '2026-04-24 10:36:08' },
  { id: 2, object: '总院测试机一号', deviceType: '-', module: '-', metric: '-', content: '飞行器距离骤降，请立刻处理！', level: '警告', status: '已处理', task: '04241023', triggerTime: '2026-04-24 10:35:57', handleTime: '2026-04-24 10:36:06' },
  { id: 3, object: '总院测试机二号', deviceType: '-', module: '-', metric: '-', content: '飞行器偏离航线，请注意水平方向安全', level: '提示', status: '已处理', task: '04240934', triggerTime: '2026-04-24 09:36:59', handleTime: '2026-04-24 09:37:03' },
  { id: 4, object: '总院测试机二号', deviceType: '-', module: '-', metric: '-', content: '飞行器距离骤降，请立刻处理！', level: '警告', status: '已处理', task: '04240934', triggerTime: '2026-04-24 09:36:42', handleTime: '2026-04-24 09:36:59' },
  { id: 5, object: '总院测试机二号', deviceType: '-', module: '-', metric: '-', content: '飞行器偏离航线，请注意水平方向安全', level: '提示', status: '已处理', task: '09080424', triggerTime: '2026-04-24 09:10:29', handleTime: '2026-04-24 09:10:36' },
  { id: 6, object: '总院测试机二号', deviceType: '-', module: '-', metric: '-', content: '飞行器距离骤降，请立刻处理！', level: '警告', status: '已处理', task: '09080424', triggerTime: '2026-04-24 09:10:21', handleTime: '2026-04-24 09:10:29' },
  { id: 7, object: '总院测试机三号', deviceType: '-', module: '-', metric: '-', content: '飞行器偏离航线，请注意水平方向安全', level: '提示', status: '已处理', task: '04240839', triggerTime: '2026-04-24 08:52:08', handleTime: '2026-04-24 08:52:10' },
  { id: 8, object: '总院测试机三号', deviceType: '-', module: '-', metric: '-', content: '飞行器距离骤降，请立刻处理！', level: '警告', status: '已处理', task: '04240839', triggerTime: '2026-04-24 08:52:01', handleTime: '2026-04-24 08:52:08' },
  { id: 9, object: '总院测试机四号', deviceType: '-', module: '-', metric: '-', content: '飞行器偏离航线，请注意水平方向安全', level: '提示', status: '已处理', task: '04240755', triggerTime: '2026-04-24 07:55:00', handleTime: '2026-04-24 07:55:06' },
]

// ECharts 健康评分数据（近7天，5个子系统）
export const HEALTH_MODULES = ['廊道系统', '地面节点', '飞行器', '气象系统', '通信系统']
export const HEALTH_DAYS = ['4/11', '4/12', '4/13', '4/14', '4/15', '4/16', '4/17']
export const HEALTH_SCORES: Record<string, number[]> = {
  '廊道系统': [98, 97, 96, 98, 95, 97, 96],
  '地面节点': [92, 88, 85, 90, 87, 82, 78],
  '飞行器': [95, 93, 96, 94, 91, 89, 88],
  '气象系统': [99, 99, 100, 98, 97, 99, 98],
  '通信系统': [96, 95, 94, 97, 96, 94, 92],
}

// 雷达图配置项
export const HEALTH_RADAR_INDICATORS = HEALTH_MODULES.map(name => ({ name, max: 100 }))
export const HEALTH_RADAR_SCORES = [96, 78, 88, 98, 92]
