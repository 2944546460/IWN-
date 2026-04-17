import { delay, paginate, type PageQuery, type PageResult } from './common'
import {
  GROUND_NODE_LIST,
  type GroundNode,
} from '@/mock/groundNode'

// 运行时数据副本（支持 CRUD）
let nodes = [...GROUND_NODE_LIST].sort(
  (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
)

export interface NodeFilter {
  nodeId?: string
  name?: string
  loc?: string
  status?: '' | 'true' | 'false'
  health?: string
}

/** 获取节点列表（支持过滤 + 分页） */
export async function getNodeList(filter: NodeFilter = {}, pq: PageQuery = { page: 1, pageSize: 10 }): Promise<PageResult<GroundNode>> {
  await delay()
  const filtered = nodes.filter(item => {
    if (filter.nodeId && item.nodeId !== filter.nodeId) return false
    if (filter.name && !item.name.includes(filter.name)) return false
    if (filter.loc && !item.loc.includes(filter.loc)) return false
    if (filter.status !== '' && filter.status != null && String(item.status) !== filter.status) return false
    if (filter.health && item.health !== filter.health) return false
    return true
  })
  return paginate(filtered, pq.page, pq.pageSize)
}

/** 获取所有在线节点（status=true）— 用于状态大盘 */
export async function getActiveNodes(): Promise<GroundNode[]> {
  await delay()
  return nodes.filter(n => n.status)
}

/** 切换节点启用/禁用状态 */
export async function toggleNodeStatus(id: number): Promise<GroundNode> {
  await delay(150)
  const node = nodes.find(n => n.id === id)
  if (!node) throw new Error('节点不存在')
  node.status = !node.status
  if (node.status) {
    node.health = '正常'
    node.ping = Math.floor(Math.random() * 20 + 5)
    node.cpu = Math.floor(Math.random() * 30 + 10)
    node.mem = Math.floor(Math.random() * 30 + 10)
  } else {
    node.health = '离线'
    node.ping = 0; node.cpu = 0; node.mem = 0
  }
  return { ...node }
}

/** 删除节点（启用状态不可删除） */
export async function deleteNode(id: number): Promise<void> {
  await delay()
  const idx = nodes.findIndex(n => n.id === id)
  if (idx < 0) throw new Error('节点不存在')
  if (nodes[idx].status) throw new Error('启用状态的节点不可删除')
  nodes.splice(idx, 1)
}

/** 批量删除（仅删除未启用的节点） */
export async function batchDeleteNodes(ids: number[]): Promise<{ deleted: number; skipped: number }> {
  await delay()
  const toDelete = nodes.filter(n => ids.includes(n.id) && !n.status)
  const skipped = ids.length - toDelete.length
  const deleteIds = toDelete.map(n => n.id)
  nodes = nodes.filter(n => !deleteIds.includes(n.id))
  return { deleted: toDelete.length, skipped }
}
