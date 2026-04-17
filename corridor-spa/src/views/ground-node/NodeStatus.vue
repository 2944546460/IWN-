<template>
  <div class="node-status-page">
    <!-- 顶部统计卡片 -->
    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-label">总节点数</div>
        <div class="stat-val">{{ stats.total }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">在线节点数</div>
        <div class="stat-val text-[#1890ff]">{{ stats.online }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">异常节点数</div>
        <div class="stat-val" :style="{ color: stats.abnormal > 0 ? '#f56c6c' : '#606266' }">{{ stats.abnormal }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">平均响应时间</div>
        <div class="stat-val">
          {{ stats.avgPing }}<span class="stat-unit">ms</span>
        </div>
      </div>
    </div>

    <!-- 趋势图 -->
    <el-card class="chart-card" :body-style="{ padding: '16px 20px 10px' }">
      <div class="card-header">
        <span class="card-title-bar">节点状态趋势图</span>
        <div class="time-tabs">
          <span
            v-for="tab in timeTabs"
            :key="tab.key"
            class="time-tab"
            :class="{ active: activeTab === tab.key }"
            @click="switchTab(tab.key)"
          >{{ tab.label }}</span>
        </div>
      </div>
      <div ref="chartRef" class="chart-box" />
    </el-card>

    <!-- 节点列表 -->
    <el-card class="table-card" :body-style="{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column' }">
      <span class="card-title-bar" style="margin-bottom: 16px; display: block;">节点信息列表</span>

      <!-- 搜索区 -->
      <div class="search-row">
        <div class="form-item">
          <span class="form-label">节点名称</span>
          <el-input
            v-model="filter.name"
            placeholder="支持模糊匹配"
            clearable
            size="default"
            style="width: 200px"
            @input="resetPage"
          />
        </div>
        <div class="form-item">
          <span class="form-label">节点状态</span>
          <el-select
            v-model="filter.health"
            placeholder="全部"
            clearable
            size="default"
            style="width: 140px"
            @change="resetPage"
          >
            <el-option label="正常" value="正常" />
            <el-option label="提示" value="提示" />
            <el-option label="警告" value="警告" />
          </el-select>
        </div>
      </div>

      <!-- 表格 -->
      <el-table
        :data="pagedList"
        v-loading="loading"
        stripe
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: '600' }"
      >
        <el-table-column label="序号" type="index" :index="indexOffset" width="60" align="center" />
        <el-table-column prop="nodeId" label="节点ID" width="160">
          <template #default="{ row }">
            <span class="monospace">{{ row.nodeId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="节点名称" min-width="130" show-overflow-tooltip />
        <el-table-column label="节点状态" width="100" align="center">
          <template #default="{ row }">
            <span :class="['status-badge', healthBadgeClass(row.health)]">
              <i :class="healthIcon(row.health)" />
              {{ row.health }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="loc" label="节点位置" min-width="160" show-overflow-tooltip />
        <el-table-column label="响应时间" width="100">
          <template #default="{ row }">
            <span class="monospace text-[#1890ff]">{{ row.ping }} ms</span>
          </template>
        </el-table-column>
        <el-table-column label="CPU使用率" width="150">
          <template #default="{ row }">
            <div class="progress-wrapper">
              <div class="progress-box">
                <div class="progress-bar" :style="{ width: row.cpu + '%', background: usageColor(row.cpu) }" />
              </div>
              <div class="progress-val">{{ row.cpu }}%</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="内存使用率" width="150">
          <template #default="{ row }">
            <div class="progress-wrapper">
              <div class="progress-box">
                <div class="progress-bar" :style="{ width: row.mem + '%', background: usageColor(row.mem) }" />
              </div>
              <div class="progress-val">{{ row.mem }}%</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" align="center">
          <template #default>
            <el-button type="primary" link size="small">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-row">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="total"
          :page-sizes="[5, 10, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          background
          small
          @current-change="loadList"
          @size-change="() => { pagination.page = 1; loadList() }"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'
import { getNodeList, getActiveNodes } from '@/api/groundNode'
import type { GroundNode } from '@/mock/groundNode'

// ---- 状态 ----
const loading = ref(false)
const list = ref<GroundNode[]>([])
const total = ref(0)
const filter = reactive({ name: '', health: '' })
const pagination = reactive({ page: 1, pageSize: 5 })

const stats = reactive({ total: 0, online: 0, abnormal: 0, avgPing: 0 })

// ---- 统计大盘 ----
async function loadStats() {
  const activeNodes = await getActiveNodes()
  stats.total = (await getNodeList({}, { page: 1, pageSize: 9999 })).total
  stats.online = activeNodes.length
  stats.abnormal = activeNodes.filter(n => n.health === '警告' || n.health === '提示').length
  stats.avgPing = activeNodes.length > 0
    ? Math.round(activeNodes.reduce((s, n) => s + n.ping, 0) / activeNodes.length)
    : 0
}

// ---- 列表 ----
async function loadList() {
  loading.value = true
  try {
    // status filter: 节点状态页只展示在线节点（status=true）
    const res = await getNodeList(
      { name: filter.name || undefined, health: filter.health || undefined, status: 'true' },
      pagination
    )
    list.value = res.list
    total.value = res.total
  } finally {
    loading.value = false
  }
}

function resetPage() {
  pagination.page = 1
  loadList()
}

const pagedList = computed(() => list.value)
const indexOffset = computed(() => (pagination.page - 1) * pagination.pageSize + 1)

// ---- ECharts ----
const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null
const timeTabs = [
  { key: 'today', label: '今日' },
  { key: 'week',  label: '近一周' },
  { key: 'month', label: '近一月' },
]
const activeTab = ref<'today' | 'week' | 'month'>('today')

function buildChartOption(range: string) {
  let xData: string[] = []
  let normal: number[] = []
  let abnormal: number[] = []

  if (range === 'today') {
    xData = Array.from({ length: 24 }, (_, i) => `${i}:00`)
    normal   = xData.map(() => Math.floor(Math.random() * 5 + 10))
    abnormal = xData.map(() => Math.random() > 0.6 ? Math.floor(Math.random() * 3 + 1) : 0)
  } else if (range === 'week') {
    xData = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    normal   = xData.map(() => Math.floor(Math.random() * 2 + 12))
    abnormal = xData.map(() => Math.floor(Math.random() * 3))
  } else {
    xData = Array.from({ length: 30 }, (_, i) => `${i + 1}日`)
    normal   = xData.map(() => Math.floor(Math.random() * 4 + 10))
    abnormal = xData.map(() => Math.floor(Math.random() * 3))
  }

  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross', label: { backgroundColor: '#6a7985' } } },
    legend: { data: ['异常节点', '正常节点'], right: 20, top: 0 },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '12%', containLabel: true },
    xAxis: [{ type: 'category', boundaryGap: false, data: xData }],
    yAxis: [{ type: 'value', name: '数量（个）' }],
    series: [
      { name: '异常节点', type: 'line', stack: 'Total', areaStyle: {}, emphasis: { focus: 'series' }, itemStyle: { color: '#f56c6c' }, data: abnormal },
      { name: '正常节点', type: 'line', stack: 'Total', areaStyle: {}, emphasis: { focus: 'series' }, itemStyle: { color: '#67c23a' }, data: normal },
    ],
  }
}

function switchTab(key: 'today' | 'week' | 'month') {
  activeTab.value = key
  chart?.setOption(buildChartOption(key), true)
}

function initChart() {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value)
  chart.setOption(buildChartOption(activeTab.value))
}

const handleResize = () => chart?.resize()

// ---- 工具函数 ----
function healthBadgeClass(h: string) {
  return h === '正常' ? 'badge-normal' : h === '提示' ? 'badge-warning' : 'badge-critical'
}

function healthIcon(h: string) {
  return h === '正常' ? 'ri-checkbox-circle-fill'
    : h === '提示' ? 'ri-alert-fill'
    : 'ri-close-circle-fill'
}

function usageColor(v: number) {
  return v < 60 ? '#67c23a' : v <= 80 ? '#e6a23c' : '#f56c6c'
}

// ---- 生命周期 ----
onMounted(async () => {
  await Promise.all([loadStats(), loadList()])
  initChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  chart?.dispose()
  window.removeEventListener('resize', handleResize)
})

// filter 变化时，已通过 @input/@change 触发 resetPage
</script>

<style scoped>
.node-status-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  overflow-y: auto;
  background: #f0f2f5;
}

/* ---- 统计卡片 ---- */
.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  flex-shrink: 0;
}

.stat-card {
  background: #fff;
  border-radius: 6px;
  padding: 22px 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: box-shadow 0.2s;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.stat-val {
  font-size: 32px;
  font-weight: 300;
  color: #1f2329;
  line-height: 1;
}

.stat-unit {
  font-size: 14px;
  color: #909399;
  margin-left: 4px;
}

/* ---- 趋势图 ---- */
.chart-card {
  flex-shrink: 0;
  border-radius: 6px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.time-tabs {
  display: inline-flex;
  background: #f5f7fa;
  border-radius: 4px;
  padding: 2px;
}

.time-tab {
  padding: 5px 14px;
  font-size: 13px;
  color: #606266;
  cursor: pointer;
  border-radius: 3px;
  transition: all 0.2s;
  user-select: none;
}

.time-tab.active {
  background: #fff;
  color: #1890ff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  font-weight: 500;
}

.chart-box {
  height: 260px;
  width: 100%;
}

/* ---- 表格区 ---- */
.table-card {
  flex: 1;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.search-row {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.form-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
  flex-shrink: 0;
}

.monospace {
  font-family: 'Courier New', monospace;
  font-size: 13px;
}

.pagination-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
