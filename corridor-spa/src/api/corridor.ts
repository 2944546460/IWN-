import { delay, paginate, type PageQuery, type PageResult } from './common'
import {
  CORRIDOR_LIST, TURN_ZONE_LIST, LANDING_POINT_LIST, EMERGENCY_POINT_LIST,
  type CorridorRecord, type TurnZoneRecord, type LandingPointRecord, type EmergencyPointRecord,
} from '@/mock/corridor'

let corridors = [...CORRIDOR_LIST]
let turnZones = [...TURN_ZONE_LIST]
let landingPoints = [...LANDING_POINT_LIST]
let emergencyPoints = [...EMERGENCY_POINT_LIST]

// ---- 廊道信息 API ----
export async function getCorridorList(filter: { name?: string; status?: '' | 'true' | 'false' } = {}, pq: PageQuery = { page: 1, pageSize: 10 }): Promise<PageResult<CorridorRecord>> {
  await delay()
  const list = corridors.filter(c => {
    if (filter.name && !c.name.includes(filter.name)) return false
    if (filter.status !== '' && filter.status != null && String(c.status) !== filter.status) return false
    return true
  })
  return paginate(list, pq.page, pq.pageSize)
}

// ---- 转弯区 API ----
export async function getTurnZoneList(filter: { name?: string; corridorName?: string } = {}, pq: PageQuery = { page: 1, pageSize: 10 }): Promise<PageResult<TurnZoneRecord>> {
  await delay()
  const list = turnZones.filter(t => {
    if (filter.name && !t.name.includes(filter.name)) return false
    if (filter.corridorName && !t.corridorName.includes(filter.corridorName)) return false
    return true
  })
  return paginate(list, pq.page, pq.pageSize)
}

// ---- 起降点 API ----
export async function getLandingPointList(filter: { name?: string; type?: string } = {}, pq: PageQuery = { page: 1, pageSize: 10 }): Promise<PageResult<LandingPointRecord>> {
  await delay()
  const list = landingPoints.filter(p => {
    if (filter.name && !p.name.includes(filter.name)) return false
    if (filter.type && p.type !== filter.type) return false
    return true
  })
  return paginate(list, pq.page, pq.pageSize)
}

// ---- 应急点 API ----
export async function getEmergencyPointList(filter: { name?: string; type?: string } = {}, pq: PageQuery = { page: 1, pageSize: 10 }): Promise<PageResult<EmergencyPointRecord>> {
  await delay()
  const list = emergencyPoints.filter(p => {
    if (filter.name && !p.name.includes(filter.name)) return false
    if (filter.type && p.type !== filter.type) return false
    return true
  })
  return paginate(list, pq.page, pq.pageSize)
}

export type { CorridorRecord, TurnZoneRecord, LandingPointRecord, EmergencyPointRecord }
void corridors; void turnZones; void landingPoints; void emergencyPoints
