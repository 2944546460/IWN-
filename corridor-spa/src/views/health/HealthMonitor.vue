<template>
  <div class="health-monitor-page">
    <!-- 顶部卡片：健康评分 + 雷达图 -->
    <div class="top-section">
      <el-card class="score-card" shadow="hover" :body-style="{ padding: '20px', height: '100%', boxSizing: 'border-box' }">
        <div class="score-header">系统综合健康度</div>
        <div class="score-content">
          <div class="main-score" :class="scoreClass(avgScore)">{{ avgScore }}<span class="text-xl ml-1">分</span></div>
          <div class="score-desc">系统整体运行平稳，无致命级别故障。</div>
          <div class="score-tags">
            <el-tag type="success" effect="dark" class="mr-2">廊道健康</el-tag>
            <el-tag type="warning" effect="dark">节点预警</el-tag>
          </div>
        </div>
      </el-card>

      <el-card class="chart-card radar-card" shadow="hover" :body-style="{ padding: '16px' }">
        <div class="card-title">各子系统健康度分布</div>
        <div ref="radarChartRef" class="chart-container"></div>
      </el-card>

      <el-card class="chart-card trend-card" shadow="hover" :body-style="{ padding: '16px' }">
        <div class="card-title">健康度近7天趋势</div>
        <div ref="trendChartRef" class="chart-container"></div>
      </el-card>
    </div>

    <!-- 底部：告警列表 -->
    <el-card class="table-card" shadow="hover" :body-style="{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }">
      <div class="table-header">
        <span class="card-title">实时健康告警中心</span>
        <div class="table-actions">
          <el-radio-group v-model="filter.level" size="small" @change="loadList">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="严重">严重</el-radio-button>
            <el-radio-button label="警告">警告</el-radio-button>
            <el-radio-button label="提示">提示</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <el-table :data="alerts" v-loading="loading" stripe style="width: 100%" height="100%"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: '600' }">
        <el-table-column prop="alertId" label="告警编号" width="140">
          <template #default="{ row }"><span class="font-mono text-[13px]">{{ row.alertId }}</span></template>
        </el-table-column>
        <el-table-column label="级别" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.level === '严重' ? 'danger' : row.level === '警告' ? 'warning' : 'info'" effect="dark" size="small">
              {{ row.level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="module" label="所属模块" width="120" />
        <el-table-column prop="content" label="告警内容" min-width="250" show-overflow-tooltip>
          <template #default="{ row }">
            <span :class="{ 'text-red-500 font-medium': row.level === '严重' }">{{ row.content }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="source" label="故障源" width="150" show-overflow-tooltip />
        <el-table-column prop="triggerTime" label="触发时间" width="180" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <span :class="row.status === '已解决' ? 'text-green-500' : row.status === '未处理' ? 'text-red-500' : 'text-blue-500'">
              <i :class="row.status === '已解决' ? 'ri-checkbox-circle-fill' : row.status === '未处理' ? 'ri-error-warning-fill' : 'ri-tools-fill'"></i>
              {{ row.status }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" :disabled="row.status === '已解决'" @click="handleResolve(row)">
              标记解决
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getHealthAlertList, resolveAlert } from '@/api/modules'
import { HEALTH_RADAR_INDICATORS, HEALTH_RADAR_SCORES, HEALTH_DAYS, HEALTH_SCORES } from '@/mock/health'
import type { HealthAlertRecord } from '@/api/modules'

const loading = ref(false)
const alerts = ref<HealthAlertRecord[]>([])
const filter = reactive({ level: '' })
const avgScore = ref(92)

const radarChartRef = ref<HTMLElement>()
const trendChartRef = ref<HTMLElement>()
let radarChart: echarts.ECharts | null = null
let trendChart: echarts.ECharts | null = null

function scoreClass(val: number) {
  return val >= 90 ? 'text-[#67c23a]' : val >= 80 ? 'text-[#e6a23c]' : 'text-[#f56c6c]'
}

async function loadList() {
  loading.value = true
  try {
    const res = await getHealthAlertList({ level: filter.level || undefined }, { page: 1, pageSize: 50 })
    alerts.value = res.list
  } finally {
    loading.value = false
  }
}

async function handleResolve(row: HealthAlertRecord) {
  try {
    await ElMessageBox.confirm(`确认将告警 ${row.alertId} 标记为已解决？`, '操作确认', { type: 'success' })
    await resolveAlert(row.id)
    ElMessage.success('操作成功')
    loadList()
  } catch {}
}

function initCharts() {
  if (radarChartRef.value) {
    radarChart = echarts.init(radarChartRef.value)
    radarChart.setOption({
      tooltip: {},
      radar: { indicator: HEALTH_RADAR_INDICATORS, radius: '65%', center: ['50%', '55%'] },
      series: [{
        type: 'radar',
        data: [{ value: HEALTH_RADAR_SCORES, name: '健康度', areaStyle: { color: 'rgba(64,158,255,0.2)' }, itemStyle: { color: '#409eff' }, lineStyle: { width: 2 } }]
      }]
    })
  }

  if (trendChartRef.value) {
    trendChart = echarts.init(trendChartRef.value)
    const series = Object.entries(HEALTH_SCORES).map(([name, data]) => ({
      name, type: 'line', smooth: true, symbolSize: 6, data
    }))
    trendChart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { top: 0, right: 0, itemWidth: 14, itemHeight: 8, textStyle: { fontSize: 12 } },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true },
      xAxis: { type: 'category', boundaryGap: false, data: HEALTH_DAYS },
      yAxis: { type: 'value', min: 70, max: 100 },
      series
    })
  }
}

const handleResize = () => { radarChart?.resize(); trendChart?.resize() }

onMounted(() => {
  loadList()
  initCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  radarChart?.dispose()
  trendChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.health-monitor-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  overflow: hidden;
  background: #f0f2f5;
  height: 100%;
}

.top-section {
  display: flex;
  gap: 16px;
  height: 280px;
  flex-shrink: 0;
}

.score-card { width: 260px; flex-shrink: 0; }
.radar-card { width: 340px; flex-shrink: 0; display: flex; flex-direction: column; }
.trend-card { flex: 1; display: flex; flex-direction: column; min-width: 0; }

.score-header { font-size: 16px; font-weight: 600; color: #303133; margin-bottom: 20px; }
.score-content { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px; }
.main-score { font-size: 64px; font-weight: bold; line-height: 1; font-family: 'Arial', sans-serif; }
.score-desc { font-size: 13px; color: #909399; line-height: 1.5; padding: 0 10px; }
.score-tags { margin-top: 10px; }

.card-title { font-size: 15px; font-weight: 600; color: #303133; margin-bottom: 10px; }
.chart-container { flex: 1; width: 100%; min-height: 0; }

.table-card { border-radius: 6px; }
.table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
</style>
