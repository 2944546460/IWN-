import { delay, paginate, type PageQuery, type PageResult } from './common'
import {
  PLANNING_TASK_DETAIL_MAP,
  PLANNING_TASK_SUMMARY_LIST,
  BEAM_LIST,
  type ApprovalInfo,
  type ApprovalStatus,
  type BeamRecord,
  type PlanningTaskDetail,
  type PlanningTaskStats,
  type PlanningTaskSummary,
  type PrecheckStatus,
  type RouteInfo,
  type SafeTimeWindow,
  type WeatherPrecheckInfo,
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
    precheckStatus?: PrecheckStatus | ''
    approvalStatus?: ApprovalStatus | ''
  } = {},
) {
  return planningTaskSummaries.filter(task => {
    if (filter.taskId && !task.taskId.includes(filter.taskId)) return false
    if (filter.taskName && !task.taskName.includes(filter.taskName)) return false
    if (filter.bizType && task.bizType !== filter.bizType) return false
    if (filter.precheckStatus && task.weatherPrecheck.status !== filter.precheckStatus) return false
    if (filter.approvalStatus && task.approval.status !== filter.approvalStatus) return false
    return true
  })
}

export async function getPlanningTaskList(
  filter: {
    taskId?: string
    taskName?: string
    bizType?: string
    precheckStatus?: PrecheckStatus | ''
    approvalStatus?: ApprovalStatus | ''
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
    precheckStatus?: PrecheckStatus | ''
    approvalStatus?: ApprovalStatus | ''
  } = {},
): Promise<PlanningTaskStats> {
  await delay()
  const list = filterPlanningTasks(filter)
  return {
    today: list.length,
    pending: list.filter(item => item.approval.status === 'pending').length,
    blocked: list.filter(item =>
      ['blocked', 'all_day_blocked'].includes(item.weatherPrecheck.status),
    ).length,
  }
}

export async function getPlanningTaskDetail(taskId: string): Promise<PlanningTaskDetail | null> {
  await delay()
  const task = planningTaskDetails[taskId]
  return task ? clone(task) : null
}

export async function updatePlanningTaskApproval(
  taskId: string,
  status: ApprovalStatus,
  comment = '',
): Promise<PlanningTaskDetail | null> {
  await delay()
  const detail = planningTaskDetails[taskId]
  if (!detail) return null

  detail.approval = {
    status,
    comment,
    updatedAt: '2026-04-22 10:30:00',
  }

  planningTaskSummaries = planningTaskSummaries.map(item =>
    item.taskId === taskId ? { ...item, approval: { status } } : item,
  )

  return clone(detail)
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
  PrecheckStatus,
  ApprovalStatus,
  WeatherPrecheckInfo,
  SafeTimeWindow,
  RouteInfo,
  ApprovalInfo,
  BeamRecord,
  AircraftRecord,
  HealthAlertRecord,
}

void beams
void aircraft
void alerts
