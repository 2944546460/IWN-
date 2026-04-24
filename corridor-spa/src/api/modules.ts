import { delay, paginate, type PageQuery, type PageResult } from './common'
import {
  BEAM_LIST,
  PLANNING_TASK_DETAIL_MAP,
  PLANNING_TASK_SUMMARY_LIST,
  type BeamRecord,
  type PlanningTaskDetail,
  type PlanningTaskStats,
  type PlanningTaskSummary,
  type ReviewStatus,
  type RouteInfo,
  type SafeTimeWindow,
  type WeatherBlockInfo,
  type WeatherCheckStatus,
} from '@/mock/planning'
import { AIRCRAFT_LIST, type AircraftRecord } from '@/mock/aircraft'
import { HEALTH_ALERT_LIST, type HealthAlertRecord } from '@/mock/health'

let planningTaskSummaries = [...PLANNING_TASK_SUMMARY_LIST]
let planningTaskDetails: Record<string, PlanningTaskDetail> = structuredClone(PLANNING_TASK_DETAIL_MAP)
let beams = [...BEAM_LIST]
let aircraft = [...AIRCRAFT_LIST]
let alerts = [...HEALTH_ALERT_LIST]

function clone<T>(value: T): T {
  return structuredClone(value)
}

function filterPlanningTasks(
  filter: {
    taskId?: string
    taskName?: string
    bizType?: string
    reviewStatus?: ReviewStatus | ''
  } = {},
) {
  return planningTaskSummaries.filter(task => {
    if (filter.taskId && !task.taskId.includes(filter.taskId)) return false
    if (filter.taskName && !task.taskName.includes(filter.taskName)) return false
    if (filter.bizType && task.bizType !== filter.bizType) return false
    if (filter.reviewStatus && task.reviewStatus !== filter.reviewStatus) return false
    return true
  })
}

export async function getPlanningTaskList(
  filter: {
    taskId?: string
    taskName?: string
    bizType?: string
    reviewStatus?: ReviewStatus | ''
  } = {},
  pq: PageQuery = { page: 1, pageSize: 10 },
): Promise<PageResult<PlanningTaskSummary>> {
  await delay()
  return paginate(clone(filterPlanningTasks(filter)), pq.page, pq.pageSize)
}

export async function getPlanningTaskStats(
  filter: {
    taskId?: string
    taskName?: string
    bizType?: string
    reviewStatus?: ReviewStatus | ''
  } = {},
): Promise<PlanningTaskStats> {
  await delay()
  const list = filterPlanningTasks(filter)
  return {
    today: list.length,
    passed: list.filter(item => item.reviewStatus === 'passed').length,
    failed: list.filter(item => item.reviewStatus === 'failed').length,
  }
}

export async function getPlanningTaskDetail(taskId: string): Promise<PlanningTaskDetail | null> {
  await delay()
  const task = planningTaskDetails[taskId]
  return task ? clone(task) : null
}

export async function getBeamList(pq: PageQuery = { page: 1, pageSize: 10 }): Promise<PageResult<BeamRecord>> {
  await delay()
  return paginate(beams, pq.page, pq.pageSize)
}

export async function getAircraftList(
  filter: { status?: string; aircraftId?: string } = {},
  pq: PageQuery = { page: 1, pageSize: 10 },
): Promise<PageResult<AircraftRecord>> {
  await delay()
  const list = aircraft.filter(a => {
    if (filter.status && a.status !== filter.status) return false
    if (filter.aircraftId && !a.aircraftId.includes(filter.aircraftId)) return false
    return true
  })
  return paginate(list, pq.page, pq.pageSize)
}

export async function getHealthAlertList(
  filter: { level?: string; status?: string; module?: string } = {},
  pq: PageQuery = { page: 1, pageSize: 10 },
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

export type {
  PlanningTaskSummary,
  PlanningTaskDetail,
  PlanningTaskStats,
  ReviewStatus,
  WeatherCheckStatus,
  WeatherBlockInfo,
  SafeTimeWindow,
  RouteInfo,
  BeamRecord,
  AircraftRecord,
  HealthAlertRecord,
}

void beams
void aircraft
void alerts
