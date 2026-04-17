/**
 * 地面节点管理 — Mock 数据
 * 来源: 地面节点信息维护.html 的 mockData 数组
 */

export interface GroundNode {
  id: number
  nodeId: string
  name: string
  ip: string
  loc: string
  status: boolean      // true=启用
  time: string         // 创建时间
  health: '正常' | '提示' | '警告' | '离线'
  ping: number         // ms
  cpu: number          // %
  mem: number          // %
}

export const GROUND_NODE_LIST: GroundNode[] = [
  { id: 1,  nodeId: 'BSL000000130', name: '西电模拟节点',           ip: '127.0.0.1',   loc: '浙江省杭州市萧山区',   status: true,  time: '2026-03-13 08:36:04', health: '正常', ping: 12,  cpu: 25, mem: 46 },
  { id: 2,  nodeId: 'BSL000000129', name: '杭高测试节点三号',       ip: '192.168.1.1', loc: '浙江省绍兴市越城区',   status: true,  time: '2026-02-06 14:46:02', health: '警告', ping: 156, cpu: 92, mem: 88 },
  { id: 3,  nodeId: 'BSL000000128', name: '杭高测试节点二号',       ip: '192.168.1.2', loc: '浙江省绍兴市越城区',   status: false, time: '2026-02-06 14:44:56', health: '离线', ping: 0,   cpu: 0,  mem: 0  },
  { id: 4,  nodeId: 'BSL000000127', name: '杭高测试节点一号测试超长', ip: '10.0.0.5',  loc: '浙江省绍兴市越城区',   status: true,  time: '2026-02-06 14:41:32', health: '提示', ping: 68,  cpu: 75, mem: 62 },
  { id: 5,  nodeId: 'BSL000000123', name: '杭高节点6号',            ip: '192.168.1.8', loc: '浙江省宁波市余姚市',   status: false, time: '2026-01-20 20:54:05', health: '离线', ping: 0,   cpu: 0,  mem: 0  },
  { id: 6,  nodeId: 'BSL000000122', name: '杭高节点5号',            ip: '172.16.2.11', loc: '浙江省绍兴市上虞区',   status: true,  time: '2026-01-20 20:52:49', health: '正常', ping: 22,  cpu: 34, mem: 42 },
  { id: 7,  nodeId: 'BSL000000121', name: '杭高节点4号',            ip: '10.0.0.12',   loc: '浙江省绍兴市上虞区',   status: true,  time: '2026-01-20 20:51:13', health: '警告', ping: 212, cpu: 85, mem: 95 },
  { id: 8,  nodeId: 'BSL000000120', name: '杭高节点3号',            ip: '192.168.8.88',loc: '浙江省绍兴市上虞区',   status: false, time: '2026-01-20 20:50:20', health: '离线', ping: 0,   cpu: 0,  mem: 0  },
  { id: 9,  nodeId: 'BSL000000119', name: '杭高节点2号',            ip: '127.0.0.1',   loc: '浙江省绍兴市上虞区',   status: true,  time: '2026-01-20 20:49:24', health: '正常', ping: 18,  cpu: 28, mem: 56 },
  { id: 10, nodeId: 'BSL000000118', name: '杭高节点1号',            ip: '10.0.0.22',   loc: '浙江省绍兴市柯桥区',   status: false, time: '2026-01-20 20:48:24', health: '离线', ping: 0,   cpu: 0,  mem: 0  },
  { id: 11, nodeId: 'BSL000000110', name: '极限测试节点很长很长',   ip: '192.168.3.11',loc: '浙江省杭州市滨江区',   status: false, time: '2026-01-18 10:20:00', health: '离线', ping: 0,   cpu: 0,  mem: 0  },
  { id: 12, nodeId: 'BSL000000109', name: '边缘计算节点',           ip: '127.0.0.1',   loc: '浙江省杭州市临平区',   status: true,  time: '2026-01-15 09:30:00', health: '正常', ping: 8,   cpu: 15, mem: 35 },
  { id: 13, nodeId: 'BSL000000108', name: '备份服务器节点',         ip: '172.16.8.2',  loc: '浙江省杭州市西湖区',   status: true,  time: '2026-01-10 11:20:00', health: '提示', ping: 82,  cpu: 55, mem: 72 },
]
