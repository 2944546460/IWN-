/**
 * 廊道基础数据 — Mock 数据
 * 来源: 廊道信息维护.html, 转弯区信息维护.html, 起降点信息维护.html,
 *       应急点信息维护.html, 气象环境维护.html, 空域与航路维护.html
 */

// ---- 廊道信息 ----
export interface CorridorRecord {
  id: number
  corridorId: string
  name: string
  startPoint: string
  endPoint: string
  length: number       // km
  width: number        // m
  minHeight: number    // m
  maxHeight: number    // m
  status: boolean      // true=启用
  color: string
  createdAt: string
  remark: string
}

export const CORRIDOR_LIST: CorridorRecord[] = [
  { id: 1, corridorId: 'COR000000001', name: '杭州主线廊道A',        startPoint: '萧山起点',  endPoint: '余杭终点',    length: 42.6, width: 200, minHeight: 60,  maxHeight: 120, status: true,  color: '#409eff', createdAt: '2026-01-10 09:00:00', remark: '主干物流廊道' },
  { id: 2, corridorId: 'COR000000002', name: '西湖环路廊道B',        startPoint: '西湖景区',  endPoint: '灵隐寺',      length: 18.3, width: 150, minHeight: 80,  maxHeight: 150, status: true,  color: '#67c23a', createdAt: '2026-01-12 10:30:00', remark: '景区专用' },
  { id: 3, corridorId: 'COR000000003', name: '钱塘物流廊道C',        startPoint: '下沙仓库',  endPoint: '江干配送',    length: 23.1, width: 180, minHeight: 60,  maxHeight: 100, status: false, color: '#909399', createdAt: '2026-01-15 14:00:00', remark: '暂时关闭' },
  { id: 4, corridorId: 'COR000000004', name: '余杭未来科技城廊道D',  startPoint: '梦想小镇',  endPoint: '浙大超算中心', length: 31.5, width: 200, minHeight: 80,  maxHeight: 150, status: true,  color: '#e6a23c', createdAt: '2026-02-01 08:00:00', remark: '高科技园区' },
  { id: 5, corridorId: 'COR000000005', name: '滨江医疗紧急廊道E',    startPoint: '浙大一院',  endPoint: '浙大二院',    length: 12.4, width: 120, minHeight: 100, maxHeight: 200, status: true,  color: '#f56c6c', createdAt: '2026-02-10 11:00:00', remark: '紧急医疗' },
]

// ---- 转弯区信息 ----
export interface TurnZoneRecord {
  id: number
  zoneId: string
  name: string
  corridorName: string
  lat: number
  lng: number
  radius: number       // m 转弯半径
  bankAngle: number    // deg 坡度角
  status: boolean
  createdAt: string
}

export const TURN_ZONE_LIST: TurnZoneRecord[] = [
  { id: 1, zoneId: 'TZ000000001', name: '萧山北侧转弯区', corridorName: '杭州主线廊道A', lat: 30.1980, lng: 120.0550, radius: 500, bankAngle: 15, status: true,  createdAt: '2026-01-10 09:30:00' },
  { id: 2, zoneId: 'TZ000000002', name: '余杭东段转弯区', corridorName: '杭州主线廊道A', lat: 30.2940, lng: 120.2100, radius: 600, bankAngle: 18, status: true,  createdAt: '2026-01-10 10:00:00' },
  { id: 3, zoneId: 'TZ000000003', name: '西湖北门转弯区', corridorName: '西湖环路廊道B', lat: 30.2550, lng: 120.1280, radius: 350, bankAngle: 12, status: true,  createdAt: '2026-01-12 11:00:00' },
  { id: 4, zoneId: 'TZ000000004', name: '下沙工业区转弯', corridorName: '钱塘物流廊道C', lat: 30.2710, lng: 120.2600, radius: 480, bankAngle: 14, status: false, createdAt: '2026-01-15 15:00:00' },
]

// ---- 起降点信息 ----
export interface LandingPointRecord {
  id: number
  pointId: string
  name: string
  type: '起点' | '降点' | '中转'
  corridorName: string
  lat: number
  lng: number
  elevation: number    // m 海拔
  capacity: number     // 同时停放架次
  status: boolean
  createdAt: string
}

export const LANDING_POINT_LIST: LandingPointRecord[] = [
  { id: 1, pointId: 'LP000000001', name: '萧山物流中心停机坪',   type: '起点', corridorName: '杭州主线廊道A', lat: 30.1920, lng: 120.0480, elevation: 8,  capacity: 5, status: true,  createdAt: '2026-01-10 08:00:00' },
  { id: 2, pointId: 'LP000000002', name: '余杭配送站停机坪',     type: '降点', corridorName: '杭州主线廊道A', lat: 30.3360, lng: 120.2780, elevation: 12, capacity: 4, status: true,  createdAt: '2026-01-10 08:30:00' },
  { id: 3, pointId: 'LP000000003', name: '西湖景区观光起降坪',   type: '起点', corridorName: '西湖环路廊道B', lat: 30.2290, lng: 120.0820, elevation: 6,  capacity: 3, status: true,  createdAt: '2026-01-12 09:00:00' },
  { id: 4, pointId: 'LP000000004', name: '灵隐寺服务区起降坪',   type: '降点', corridorName: '西湖环路廊道B', lat: 30.2440, lng: 120.1010, elevation: 42, capacity: 2, status: true,  createdAt: '2026-01-12 09:30:00' },
  { id: 5, pointId: 'LP000000005', name: '下沙仓储中心中转坪',   type: '中转', corridorName: '钱塘物流廊道C', lat: 30.2700, lng: 120.1930, elevation: 5,  capacity: 6, status: false, createdAt: '2026-01-15 14:00:00' },
]

// ---- 应急点信息 ----
export interface EmergencyPointRecord {
  id: number
  epId: string
  name: string
  type: '迫降区' | '紧急备降' | '应急补给'
  lat: number
  lng: number
  area: number         // m²
  contact: string
  phone: string
  status: boolean
  createdAt: string
}

export const EMERGENCY_POINT_LIST: EmergencyPointRecord[] = [
  { id: 1, epId: 'EP000000001', name: '萧山区政府应急坪',   type: '迫降区',   lat: 30.1880, lng: 120.0760, area: 200, contact: '张主任', phone: '0571-88001001', status: true,  createdAt: '2026-01-10 09:00:00' },
  { id: 2, epId: 'EP000000002', name: '余杭消防队备降点',   type: '紧急备降', lat: 30.3100, lng: 120.2200, area: 150, contact: '李队长', phone: '0571-88002002', status: true,  createdAt: '2026-01-10 10:00:00' },
  { id: 3, epId: 'EP000000003', name: '西湖交警应急区',     type: '迫降区',   lat: 30.2410, lng: 120.1380, area: 120, contact: '王警官', phone: '0571-88003003', status: true,  createdAt: '2026-01-12 11:00:00' },
  { id: 4, epId: 'EP000000004', name: '下沙应急补给站',     type: '应急补给', lat: 30.2680, lng: 120.2150, area: 80,  contact: '陈经理', phone: '0571-88004004', status: false, createdAt: '2026-01-15 15:00:00' },
]
