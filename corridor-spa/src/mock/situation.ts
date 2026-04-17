/**
 * 廊道态势显示 — Mock 数据
 * 来源: index.html 的 AIRSPACES, CORRIDORS, TASKS, ALERTS
 */

export interface Airspace {
  name: string
  desc: string
  color: string
  bounds: [[number, number], [number, number]]
  height: string
  type: string
  level: string
  agency: string
  activeTime: string
}

export interface Corridor {
  id: string
  name: string
  status: 'on' | 'off'
  from: string
  to: string
  length: string
  color: string
  points: [number, number][]
}

export interface FlightTask {
  id: string
  name: string
  aircraft: string
  corridor: string
  time: string
  status: 'flying' | 'waiting' | 'done'
}

export interface AlertItem {
  id: string
  level: 'warn' | 'error' | 'info'
  content: string
  time: string
}

export const AIRSPACES: Airspace[] = [
  {
    name: 'W类空域（0-120）',
    desc: 'Class W Airspace',
    color: '#e6a23c',
    bounds: [[30.15, 119.95], [30.35, 120.35]],
    height: '0-120m',
    type: '限飞区',
    level: '中级限制',
    agency: '杭州空管站',
    activeTime: '全天',
  },
  {
    name: 'G类空域（120-300）',
    desc: 'Class G Airspace',
    color: '#67c23a',
    bounds: [[30.10, 120.00], [30.40, 120.30]],
    height: '120-300m',
    type: '管制区',
    level: '低级限制',
    agency: '浙江区域管制',
    activeTime: '08:00 - 18:00',
  },
  {
    name: 'D/E类空域（300-1000）',
    desc: 'Class D/E Airspace',
    color: '#f56c6c',
    bounds: [[30.05, 119.90], [30.45, 120.40]],
    height: '300-1000m',
    type: '禁飞区',
    level: '绝对禁飞',
    agency: '东部战区空军',
    activeTime: '永久',
  },
]

export const CORRIDORS: Corridor[] = [
  {
    id: 'C001',
    name: '杭州主线廊道 A',
    status: 'on',
    from: '萧山起点',
    to: '余杭终点',
    length: '42.6km',
    color: '#409eff',
    points: [[30.19, 120.05], [30.24, 120.12], [30.29, 120.20], [30.33, 120.27]],
  },
  {
    id: 'C002',
    name: '西湖环路廊道 B',
    status: 'on',
    from: '西湖景区',
    to: '灵隐寺',
    length: '18.3km',
    color: '#67c23a',
    points: [[30.23, 120.08], [30.25, 120.10], [30.27, 120.13]],
  },
  {
    id: 'C003',
    name: '钱塘物流廊道 C',
    status: 'off',
    from: '下沙仓库',
    to: '江干配送',
    length: '23.1km',
    color: '#909399',
    points: [[30.27, 120.19], [30.22, 120.22], [30.18, 120.26]],
  },
  {
    id: 'C004',
    name: '余杭未来科技城廊道 D',
    status: 'on',
    from: '梦想小镇',
    to: '浙大超算中心',
    length: '31.5km',
    color: '#e6a23c',
    points: [[30.31, 119.98], [30.28, 120.03], [30.25, 120.09]],
  },
]

export const FLIGHT_TASKS: FlightTask[] = [
  { id: 'T001', name: '西湖景区快递配送#23', aircraft: 'UAV-A01', corridor: '西湖环路廊道 B', time: '14:32', status: 'flying' },
  { id: 'T002', name: '萧山医疗物资紧急', aircraft: 'UAV-B02', corridor: '杭州主线廊道 A', time: '14:18', status: 'flying' },
  { id: 'T003', name: '余杭巡检任务#07',  aircraft: 'UAV-C05', corridor: '余杭未来科技城廊道 D', time: '13:55', status: 'flying' },
]

export const ALERT_ITEMS: AlertItem[] = [
  { id: 'A001', level: 'error', content: 'NODE-GZ03 通信中断', time: '14:28' },
  { id: 'A002', level: 'warn',  content: 'UAV-A01 电量低 (15%)', time: '14:31' },
  { id: 'A003', level: 'warn',  content: 'C003 廊道气象预警', time: '13:47' },
]
