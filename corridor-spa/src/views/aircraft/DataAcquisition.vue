<template>
  <div class="data-acq-page">
    <!-- 顶部概览 -->
    <div class="stat-section">
      <div class="stat-card">
        <div class="stat-icon bg-blue-100 text-blue-500"><i class="ri-flight-takeoff-line" /></div>
        <div class="stat-info"><div class="stat-val">{{ stats?.inFlight || 0 }}</div><div class="stat-label">当前在飞</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon bg-green-100 text-green-500"><i class="ri-checkbox-circle-line" /></div>
        <div class="stat-info"><div class="stat-val">{{ stats?.flownToday || 0 }}/{{ stats?.plannedToday || 0 }}</div><div class="stat-label">今日已飞/计划</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon bg-orange-100 text-orange-500"><i class="ri-error-warning-line" /></div>
        <div class="stat-info"><div class="stat-val">{{ stats?.abnormalToday || 0 }}</div><div class="stat-label">今日异常架次</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon bg-purple-100 text-purple-500"><i class="ri-percent-line" /></div>
        <div class="stat-info"><div class="stat-val">{{ stats?.completionRate || 0 }}%</div><div class="stat-label">计划完成率</div></div>
      </div>
    </div>

    <!-- 趋势图 -->
    <el-card class="chart-card" shadow="hover" :body-style="{ padding: '16px' }">
      <div class="card-title">今日起降架次趋势</div>
      <div ref="trendChartRef" class="chart-container"></div>
    </el-card>

    <!-- 飞行器列表 -->
    <el-card class="table-card" shadow="hover" :body-style="{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column' }">
      <div class="table-header">
        <span class="card-title">飞行器实时清单</span>
        <el-form :model="filter" inline class="float-right mb-0">
          <el-form-item label="飞行器编号" class="mb-0">
            <el-input v-model="filter.aircraftId" placeholder="快速模糊搜索" clearable style="width: 160px" @input="doSearch" />
          </el-form-item>
          <el-form-item label="状态" class="mb-0 mr-0">
            <el-select v-model="filter.status" placeholder="全部" clearable style="width: 110px" @change="doSearch">
              <el-option label="在飞" value="在飞" />
              <el-option label="待机" value="待机" />
              <el-option label="异常" value="异常" />
              <el-option label="维保" value="维保" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="list" v-loading="loading" stripe style="width: 100%" height="100%"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: '600' }">
        <el-table-column prop="aircraftId" label="飞行器编号" width="140"><template #default="{ row }"><span class="font-mono">{{ row.aircraftId }}</span></template></el-table-column>
        <el-table-column prop="model" label="型号" min-width="150" />
        <el-table-column prop="manufacturer" label="制造商" width="130" />
        <el-table-column label="电量" width="120">
          <template #default="{ row }">
            <div class="flex items-center gap-2">
              <el-progress :percentage="row.battery" :status="row.battery < 20 ? 'exception' : 'success'" :show-text="false" class="flex-1" />
              <span class="text-xs w-8">{{ row.battery }}%</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="businessType" label="业务类别" width="100" />
        <el-table-column prop="location" label="当前位置" min-width="180" show-overflow-tooltip />
        <el-table-column prop="launchTime" label="起飞时间" width="160" />
        <el-table-column label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '在飞' ? 'success' : row.status === '异常' ? 'danger' : row.status === '维保' ? 'warning' : 'info'" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="() => ElMessage.info(`下发指令：${row.aircraftId}`)">指令控制</el-button>
            <el-button type="primary" link size="small" @click="() => ElMessage.info(`查看飞行轨迹：${row.aircraftId}`)">轨迹</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-4 flex justify-end">
        <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize"
          :total="total" background small layout="total, prev, pager, next" @current-change="loadList" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { getAircraftList } from '@/api/modules'
import { AIRCRAFT_STATS, AIRCRAFT_TREND_HOURS, AIRCRAFT_TREND_NORMAL, AIRCRAFT_TREND_ABNORMAL } from '@/mock/aircraft'
import type { AircraftRecord } from '@/api/modules'

const stats = ref(AIRCRAFT_STATS)
const loading = ref(false)
const list = ref<AircraftRecord[]>([])
const total = ref(0)
const filter = reactive({ status: '', aircraftId: '' })
const pagination = reactive({ page: 1, pageSize: 10 })

const trendChartRef = ref<HTMLElement>()
let trendChart: echarts.ECharts | null = null

async function loadList() {
  loading.value = true
  try {
    const res = await getAircraftList({ status: filter.status || undefined, aircraftId: filter.aircraftId || undefined }, pagination)
    list.value = res.list; total.value = res.total
  } finally { loading.value = false }
}

function doSearch() { pagination.page = 1; loadList() }

function initChart() {
  if (!trendChartRef.value) return
  trendChart = echarts.init(trendChartRef.value)
  trendChart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { top: 0, right: 0 },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true },
    xAxis: { type: 'category', data: AIRCRAFT_TREND_HOURS },
    yAxis: { type: 'value' },
    series: [
      { name: '正常架次', type: 'bar', stack: 'total', itemStyle: { color: '#67c23a' }, data: AIRCRAFT_TREND_NORMAL },
      { name: '异常架次', type: 'bar', stack: 'total', itemStyle: { color: '#f56c6c' }, data: AIRCRAFT_TREND_ABNORMAL }
    ]
  })
}

const handleResize = () => trendChart?.resize()

onMounted(() => { loadList(); initChart(); window.addEventListener('resize', handleResize) })
onUnmounted(() => { trendChart?.dispose(); window.removeEventListener('resize', handleResize) })
</script>

<style scoped>
.data-acq-page { flex: 1; display: flex; flex-direction: column; gap: 16px; padding: 20px; overflow: hidden; background: #f0f2f5; height: 100%; }
.stat-section { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; flex-shrink: 0; }
.stat-card { background: #fff; border-radius: 6px; padding: 20px; display: flex; gap: 16px; align-items: center; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.stat-icon { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0; }
.stat-info { display: flex; flex-direction: column; gap: 4px; }
.stat-val { font-size: 24px; font-weight: bold; color: #303133; line-height: 1; }
.stat-label { font-size: 13px; color: #909399; }
.chart-card { height: 260px; flex-shrink: 0; display: flex; flex-direction: column; border-radius: 6px; }
.card-title { font-size: 15px; font-weight: 600; color: #303133; margin-bottom: 12px; }
.chart-container { flex: 1; width: 100%; min-height: 0; }
.table-card { border-radius: 6px; min-height: 0; }
.table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
</style>
