import { delay, paginate, type PageQuery, type PageResult } from './common'
import { PLANNING_TASK_LIST, BEAM_LIST, type PlanningTask, type BeamRecord } from '@/mock/planning'
import { AIRCRAFT_LIST, type AircraftRecord } from '@/mock/aircraft'
import { HEALTH_ALERT_LIST, type HealthAlertRecord } from '@/mock/health'

let tasks  = [...PLANNING_TASK_LIST]
let beams  = [...BEAM_LIST]
let aircraft = [...AIRCRAFT_LIST]
let alerts = [...HEALTH_ALERT_LIST]

// ---- 规划计划 API ----
export async function getPlanningTaskList(
  filter: { taskName?: string; status?: string; priority?: string } = {},
  pq: PageQuery = { page: 1, pageSize: 10 }
): Promise<PageResult<PlanningTask>> {
  await delay()
  const list = tasks.filter(t => {
    if (filter.taskName && !t.taskName.includes(filter.taskName)) return false
    if (filter.status && t.status !== filter.status) return false
    if (filter.priority && t.priority !== filter.priority) return false
    return true
  })
  return paginate(list, pq.page, pq.pageSize)
}

export async function getBeamList(pq: PageQuery = { page: 1, pageSize: 10 }): Promise<PageResult<BeamRecord>> {
  await delay()
  return paginate(beams, pq.page, pq.pageSize)
}

// ---- 飞行器 API ----
export async function getAircraftList(
  filter: { status?: string; aircraftId?: string } = {},
  pq: PageQuery = { page: 1, pageSize: 10 }
): Promise<PageResult<AircraftRecord>> {
  await delay()
  const list = aircraft.filter(a => {
    if (filter.status && a.status !== filter.status) return false
    if (filter.aircraftId && !a.aircraftId.includes(filter.aircraftId)) return false
    return true
  })
  return paginate(list, pq.page, pq.pageSize)
}

// ---- 健康管理 API ----
export async function getHealthAlertList(
  filter: { level?: string; status?: string; module?: string } = {},
  pq: PageQuery = { page: 1, pageSize: 10 }
): Promise<PageResult<HealthAlertRecord>> {
  await delay()
  const list = alerts.filter(a => {
    if (filter.level && a.level !== filter.level) return false
    if (filter.status && a.status !== filter.status) return false
    if (filter.module && a.module !== filter.module) return false
    return true
  })
  return paginate(list, pq.page, pq.pageSize)
}

export async function resolveAlert(id: number): Promise<void> {
  await delay()
  const alert = alerts.find(a => a.id === id)
  if (alert) alert.status = '已解决'
}

export type { PlanningTask, BeamRecord, AircraftRecord, HealthAlertRecord }
void tasks; void beams; void aircraft; void alerts
