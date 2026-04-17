/**
 * 规划计划 — Mock 数据
 * 来源: 规划计划.html
 */

export interface PlanningTask {
  id: number
  taskId: string
  taskName: string
  taskType: string
  corridorName: string
  aircraftModel: string
  planDate: string
  planTime: string
  operator: string
  priority: '高' | '中' | '低'
  status: '待执行' | '执行中' | '已完成' | '已取消'
}

export const PLANNING_TASK_LIST: PlanningTask[] = [
  { id: 1,  taskId: 'PLN000000001', taskName: '萧山医疗物资配送',   taskType: '货运配送', corridorName: '杭州主线廊道A',    aircraftModel: 'Autoflight-V50', planDate: '2026-04-17', planTime: '09:00', operator: '张三', priority: '高', status: '已完成' },
  { id: 2,  taskId: 'PLN000000002', taskName: '西湖景区观光航拍',   taskType: '观光航拍', corridorName: '西湖环路廊道B',    aircraftModel: 'DJI-M300RTK',    planDate: '2026-04-17', planTime: '10:30', operator: '李四', priority: '低', status: '已完成' },
  { id: 3,  taskId: 'PLN000000003', taskName: '余杭高新区巡检',     taskType: '巡检监控', corridorName: '余杭未来科技城廊道D', aircraftModel: 'EHang-216',    planDate: '2026-04-17', planTime: '11:00', operator: '王五', priority: '中', status: '执行中' },
  { id: 4,  taskId: 'PLN000000004', taskName: '滨江医院紧急送药',   taskType: '医疗物流', corridorName: '滨江医疗紧急廊道E', aircraftModel: 'Autoflight-V50', planDate: '2026-04-17', planTime: '14:00', operator: '赵六', priority: '高', status: '待执行' },
  { id: 5,  taskId: 'PLN000000005', taskName: '下沙仓库日常配送',   taskType: '货运配送', corridorName: '钱塘物流廊道C',    aircraftModel: 'XAG-P100',       planDate: '2026-04-17', planTime: '15:30', operator: '钱七', priority: '低', status: '已取消' },
  { id: 6,  taskId: 'PLN000000006', taskName: '萧山文化园物流配送', taskType: '货运配送', corridorName: '杭州主线廊道A',    aircraftModel: 'DJI-M300RTK',    planDate: '2026-04-18', planTime: '08:00', operator: '张三', priority: '中', status: '待执行' },
  { id: 7,  taskId: 'PLN000000007', taskName: '西湖安防无人机巡逻', taskType: '安防巡逻', corridorName: '西湖环路廊道B',    aircraftModel: 'DJI-M300RTK',    planDate: '2026-04-18', planTime: '09:00', operator: '李四', priority: '高', status: '待执行' },
  { id: 8,  taskId: 'PLN000000008', taskName: '余杭校园快递配送',   taskType: '货运配送', corridorName: '余杭未来科技城廊道D', aircraftModel: 'EHang-216',    planDate: '2026-04-18', planTime: '14:00', operator: '王五', priority: '中', status: '待执行' },
]

export interface BeamRecord {
  id: number
  beamId: string
  beamName: string
  frequency: string
  bandwidth: string
  coverage: string
  corridorName: string
  status: boolean
  createdAt: string
}

export const BEAM_LIST: BeamRecord[] = [
  { id: 1, beamId: 'BM000000001', beamName: '主干波束-K01', frequency: '5.8GHz', bandwidth: '80MHz', coverage: '杭州主线廊道A 全段', corridorName: '杭州主线廊道A', status: true,  createdAt: '2026-01-10 09:00:00' },
  { id: 2, beamId: 'BM000000002', beamName: '景区波束-S01', frequency: '2.4GHz', bandwidth: '40MHz', coverage: '西湖环路廊道B 全段', corridorName: '西湖环路廊道B', status: true,  createdAt: '2026-01-12 10:00:00' },
  { id: 3, beamId: 'BM000000003', beamName: '物流波束-L01', frequency: '5.8GHz', bandwidth: '80MHz', coverage: '钱塘物流廊道C 全段', corridorName: '钱塘物流廊道C', status: false, createdAt: '2026-01-15 14:00:00' },
]
