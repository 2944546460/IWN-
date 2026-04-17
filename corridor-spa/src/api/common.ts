/**
 * 通用分页参数与结果类型
 */
export interface PageQuery {
  page: number
  pageSize: number
}

export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

/** 模拟异步延迟 */
export const delay = (ms = 200) => new Promise<void>(resolve => setTimeout(resolve, ms))

/** 分页辅助 */
export function paginate<T>(list: T[], page: number, pageSize: number): PageResult<T> {
  const total = list.length
  const start = (page - 1) * pageSize
  return { list: list.slice(start, start + pageSize), total, page, pageSize }
}
