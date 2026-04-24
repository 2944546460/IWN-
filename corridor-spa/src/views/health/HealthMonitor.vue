<template>
  <div class="health-monitor-page">
    <!-- 顶部图表区 -->
    <div class="flex gap-4">
      <!-- 左侧状态总结 -->
      <div class="custom-card w-[320px] flex flex-col p-6 shrink-0">
        <!-- 无人机状态 -->
        <div class="flex-1 flex flex-col">
          <div class="text-[15px] font-medium text-[#333] mb-6">无人机状态</div>
          <div class="flex items-center justify-between">
            <div class="text-center w-[100px]">
              <div class="text-[36px] font-bold text-[#1890ff] leading-none">98<span class="text-[20px]">%</span></div>
              <div class="text-[12px] text-[#8c8c8c] mt-2">健康指数</div>
            </div>
            <div class="flex-1 ml-5 flex flex-col gap-2.5 text-[12px] text-[#595959]">
              <div class="flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-[#52c41a] mr-2"></span>在线无人机 8架</div>
              <div class="flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-[#faad14] mr-2"></span>异常无人机 1架</div>
              <div class="flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-[#f5222d] mr-2"></span>未知数据 0架</div>
              <div class="flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-[#1890ff] mr-2"></span>历史告警 3次</div>
            </div>
          </div>
        </div>
        
        <div class="h-[1px] bg-[#f0f0f0] my-6"></div>
        
        <!-- 节点状态 -->
        <div class="flex-1 flex flex-col">
          <div class="text-[15px] font-medium text-[#333] mb-6">节点状态</div>
          <div class="flex items-center justify-between">
            <div class="text-center w-[100px]">
              <div class="text-[36px] font-bold text-[#1890ff] leading-none">95<span class="text-[20px]">%</span></div>
              <div class="text-[12px] text-[#8c8c8c] mt-2">健康指数</div>
            </div>
            <div class="flex-1 ml-5 flex flex-col gap-2.5 text-[12px] text-[#595959]">
              <div class="flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-[#52c41a] mr-2"></span>工作节点数 20</div>
              <div class="flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-[#faad14] mr-2"></span>异常节点数 2</div>
              <div class="flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-[#f5222d] mr-2"></span>未知数据 0次</div>
              <div class="flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-[#1890ff] mr-2"></span>历史告警 5次</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 无人机趋势图 -->
      <div class="custom-card flex-1 flex flex-col p-5">
        <div class="text-center text-[15px] text-[#333] mb-2">无人机健康数据趋势图</div>
        <div class="text-[12px] text-[#8c8c8c] absolute left-5 top-5">单位：次</div>
        <div ref="uavChartRef" class="flex-1 w-full min-h-[220px]"></div>
      </div>

      <!-- 节点趋势图 -->
      <div class="custom-card flex-1 flex flex-col p-5">
        <div class="text-center text-[15px] text-[#333] mb-2">节点健康数据趋势图</div>
        <div class="text-[12px] text-[#8c8c8c] absolute left-5 top-5">单位：次</div>
        <div ref="nodeChartRef" class="flex-1 w-full min-h-[220px]"></div>
      </div>
    </div>

    <!-- 底部数据区 -->
    <div class="custom-card flex-1 flex flex-col mt-4 p-5 overflow-hidden relative">
      <!-- 原生风格 Tabs -->
      <div class="custom-tabs border-b border-[#f0f0f0] flex gap-8 mb-4">
        <div class="custom-tab px-1 pb-3 text-[14px] cursor-pointer relative transition-colors"
             :class="activeTab === 'online' ? 'text-[#1890ff] font-medium' : 'text-[#8c8c8c] hover:text-[#595959]'"
             @click="activeTab = 'online'">
          在线告警明细
          <div v-if="activeTab === 'online'" class="absolute bottom-0 left-0 w-full h-[3px] bg-[#1890ff]"></div>
        </div>
        <div class="custom-tab px-1 pb-3 text-[14px] cursor-pointer relative transition-colors"
             :class="activeTab === 'history' ? 'text-[#1890ff] font-medium' : 'text-[#8c8c8c] hover:text-[#595959]'"
             @click="activeTab = 'history'">
          历史告警明细
          <div v-if="activeTab === 'history'" class="absolute bottom-0 left-0 w-full h-[3px] bg-[#1890ff]"></div>
        </div>
      </div>

      <!-- 搜索区 -->
      <el-form :model="filter" class="search-form bg-white mb-4" label-width="80px">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="设备类型">
              <el-select v-model="filter.deviceType" placeholder="请选择设备类型" class="w-full custom-el-select">
                <el-option label="无人机" value="uav" />
                <el-option label="节点" value="node" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="异常对象">
              <el-input v-model="filter.object" placeholder="请输入异常对象" class="w-full custom-el-input" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="告警级别">
              <el-select v-model="filter.level" placeholder="请选择告警级别" class="w-full custom-el-select">
                <el-option label="严重" value="error" />
                <el-option label="警告" value="warning" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="子系统">
              <el-select v-model="filter.system" placeholder="请选择子系统" class="w-full custom-el-select">
                <el-option label="动力系统" value="power" />
                <el-option label="通信系统" value="comm" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="异常指标">
              <el-input v-model="filter.metric" placeholder="请输入异常指标" class="w-full custom-el-input" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="告警时段">
              <el-date-picker v-model="filter.daterange" type="daterange" range-separator="→" 
                start-placeholder="开始日期" end-placeholder="结束日期"
                class="w-full custom-el-input" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="flex justify-end gap-2 pr-[12px]">
          <el-button @click="resetFilters" class="custom-btn">重置</el-button>
          <el-button type="primary" @click="doSearch" class="custom-btn custom-btn-primary">查询</el-button>
          <el-button link type="primary" class="text-[13px] text-[#1890ff] ml-2">收起 <el-icon class="ml-1"><ArrowUp /></el-icon></el-button>
        </div>
      </el-form>

      <!-- 表格 -->
      <el-table 
        :key="activeTab"
        :data="alerts" 
        v-loading="loading" 
        class="custom-el-table flex-1"
        :header-cell-style="{ background: '#fafafa', color: '#8c8c8c', fontWeight: '500', fontSize: '13px', borderBottom: '1px solid #f0f0f0' }"
        :cell-style="{ color: '#333', fontSize: '13px', borderBottom: '1px solid #f5f5f5' }"
      >
        <template v-if="activeTab === 'online'">
          <el-table-column label="序号" type="index" width="60" align="center" />
          <el-table-column prop="alertId" label="异常对象" min-width="120" >
             <template #default="{ row }">总院测试飞机</template>
          </el-table-column>
          <el-table-column label="设备类型" min-width="100">
             <template #default="{ row }">无人机</template>
          </el-table-column>
          <el-table-column prop="module" label="异常子系统" min-width="120" />
          <el-table-column label="异常指标" min-width="120">
             <template #default="{ row }">电压突变</template>
          </el-table-column>
          <el-table-column prop="content" label="告警内容" min-width="200" show-overflow-tooltip />
          <el-table-column prop="level" label="告警级别" width="100" />
          <el-table-column prop="status" label="处理状态" width="100" />
          <el-table-column label="关联作业" min-width="120">
              <template #default>西湖巡检任务</template>
          </el-table-column>
          <el-table-column prop="triggerTime" label="告警时间" width="160" />
          <el-table-column label="操作" width="100" fixed="right">
            <template #default="{ row }">
              <span class="text-[#1890ff] cursor-pointer hover:text-[#40a9ff] text-[13px]" @click="ElMessage.info('详情')">详情</span>
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column label="序号" type="index" width="60" align="center" />
          <el-table-column prop="object" label="异常对象" min-width="120" align="center" />
          <el-table-column prop="deviceType" label="设备类型" min-width="100" align="center" />
          <el-table-column prop="module" label="异常子系统" min-width="120" align="center" />
          <el-table-column prop="metric" label="异常指标" min-width="120" align="center" />
          <el-table-column prop="content" label="告警内容" min-width="250" show-overflow-tooltip align="center" />
          <el-table-column prop="level" label="告警级别" width="100" align="center">
            <template #default="{ row }">
              <span v-if="row.level === '提示'" class="inline-block px-2.5 py-0.5 text-[12px] rounded border border-[#91caff] bg-[#e6f7ff] text-[#1890ff]">{{ row.level }}</span>
              <span v-else-if="row.level === '警告'" class="inline-block px-2.5 py-0.5 text-[12px] rounded border border-[#ffa39e] bg-[#fff1f0] text-[#f5222d]">{{ row.level }}</span>
              <span v-else class="inline-block px-2.5 py-0.5 text-[12px] rounded border border-[#ffccc7] bg-[#fff2e8] text-[#fa541c]">{{ row.level }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="处理状态" width="100" align="center">
            <template #default="{ row }">
              <span v-if="row.status === '已处理'" class="inline-block px-2.5 py-0.5 text-[12px] rounded border border-[#b7eb8f] bg-[#f6ffed] text-[#52c41a]">{{ row.status }}</span>
              <span v-else class="inline-block px-2.5 py-0.5 text-[12px] rounded border border-[#d9d9d9] bg-[#fafafa] text-[#595959]">{{ row.status }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="task" label="关联作业" min-width="120" align="center" />
          <el-table-column prop="triggerTime" label="告警时间" width="160" align="center" />
          <el-table-column prop="handleTime" label="处理时间" width="160" align="center" />
        </template>

        <template #empty>
          <el-empty description="无数据" :image-size="60" />
        </template>
      </el-table>

      <!-- 分页 -->
      <div class="flex justify-end items-center mt-4 text-[13px] text-[#8c8c8c]">
        <span class="mr-4">共 {{ total }} 条</span>
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="prev, pager, next, sizes, jumper"
          background
          class="custom-pagination"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { ArrowUp } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getHealthAlertList } from '@/api/modules'
import type { HealthAlertRecord } from '@/api/modules'

const activeTab = ref('history')
const loading = ref(false)
const alerts = ref<HealthAlertRecord[]>([])
const total = ref(0)
const filter = reactive({ deviceType: '', object: '', level: '', system: '', metric: '', daterange: [] })
const pagination = reactive({ page: 1, pageSize: 10 })

const uavChartRef = ref<HTMLElement>()
const nodeChartRef = ref<HTMLElement>()
let uavChart: echarts.ECharts | null = null
let nodeChart: echarts.ECharts | null = null

async function loadList() {
  loading.value = true
  try {
    const res = await getHealthAlertList({}, pagination)
    if (activeTab.value === 'online') {
      alerts.value = []
      total.value = 0
    } else {
      alerts.value = res.list
      total.value = 590 // Mock exact number to match screenshot
    }
  } finally {
    loading.value = false
  }
}

function doSearch() { pagination.page = 1; loadList() }
function resetFilters() {
  Object.assign(filter, { deviceType: '', object: '', level: '', system: '', metric: '', daterange: [] })
  doSearch()
}

function initCharts() {
  const getOption = (
    normalData: number[], 
    abnormalData: number[], 
    normalName: string, 
    abnormalName: string,
    normalColor: string,
    abnormalColor: string
  ) => ({
    tooltip: { trigger: 'axis' },
    legend: {
      data: [normalName, abnormalName],
      bottom: 0,
      icon: 'circle',
      itemWidth: 8,
      textStyle: { color: '#8c8c8c', fontSize: 11 }
    },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '15%', containLabel: true },
    xAxis: { 
      type: 'category', 
      boundaryGap: false, 
      data: ['2026/04/09', '2026/04/10', '2026/04/11', '2026/04/12', '2026/04/13', '2026/04/14', '2026/04/15'],
      axisLine: { lineStyle: { color: '#d9d9d9' } },
      axisLabel: { color: '#8c8c8c', fontSize: 11 }
    },
    yAxis: { 
      type: 'value',
      splitLine: { lineStyle: { type: 'dashed', color: '#f0f0f0' } },
      axisLine: { show: false },
      axisLabel: { color: '#8c8c8c', fontSize: 11 }
    },
    series: [
      {
        name: normalName,
        type: 'line',
        smooth: true,
        data: normalData,
        itemStyle: { color: normalColor },
        lineStyle: { width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: normalColor.replace(')', ', 0.3)').replace('rgb', 'rgba').replace('#1890ff', 'rgba(24,144,255,0.3)').replace('#52c41a', 'rgba(82,196,26,0.3)') },
            { offset: 1, color: normalColor.replace(')', ', 0.05)').replace('rgb', 'rgba').replace('#1890ff', 'rgba(24,144,255,0.05)').replace('#52c41a', 'rgba(82,196,26,0.05)') }
          ])
        }
      },
      {
        name: abnormalName,
        type: 'line',
        smooth: true,
        data: abnormalData,
        itemStyle: { color: abnormalColor },
        lineStyle: { width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: abnormalColor.replace(')', ', 0.3)').replace('rgb', 'rgba').replace('#f5222d', 'rgba(245,34,45,0.3)').replace('#faad14', 'rgba(250,173,20,0.3)') },
            { offset: 1, color: abnormalColor.replace(')', ', 0.05)').replace('rgb', 'rgba').replace('#f5222d', 'rgba(245,34,45,0.05)').replace('#faad14', 'rgba(250,173,20,0.05)') }
          ])
        }
      }
    ]
  })

  if (uavChartRef.value) {
    uavChart = echarts.init(uavChartRef.value, null, { renderer: 'svg' })
    uavChart.setOption(getOption(
      [12, 15, 11, 18, 14, 16, 20], 
      [1, 2, 0, 3, 1, 2, 1],
      '正常架次', '异常架次',
      '#1890ff', '#f5222d'
    ))
  }

  if (nodeChartRef.value) {
    nodeChart = echarts.init(nodeChartRef.value, null, { renderer: 'svg' })
    nodeChart.setOption(getOption(
      [19, 20, 18, 20, 20, 19, 18],
      [1, 0, 2, 0, 0, 1, 2],
      '正常节点', '异常节点',
      '#52c41a', '#faad14'
    ))
  }
}

const handleResize = () => { uavChart?.resize(); nodeChart?.resize() }

onMounted(() => { loadList(); initCharts(); window.addEventListener('resize', handleResize) })
onUnmounted(() => { uavChart?.dispose(); nodeChart?.dispose(); window.removeEventListener('resize', handleResize) })
</script>

<style scoped>
.health-monitor-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: #f0f2f5;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

/* 自定义白底卡片 */
.custom-card {
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  position: relative;
}

/* 覆写 Element 表单间距 */
.search-form :deep(.el-form-item) {
  margin-bottom: 16px;
}
.search-form :deep(.el-form-item__label) {
  color: #595959;
  font-size: 13px;
  font-weight: normal;
}

/* 扁平化极简 Input / Select / DatePicker */
:deep(.custom-el-input .el-input__wrapper),
:deep(.custom-el-select .el-select__wrapper) {
  box-shadow: none !important;
  border: 1px solid #d9d9d9 !important;
  border-radius: 4px;
  padding: 0 11px;
}
:deep(.custom-el-input .el-input__wrapper:hover),
:deep(.custom-el-input .el-input__wrapper.is-focus),
:deep(.custom-el-select .el-select__wrapper.is-hovering),
:deep(.custom-el-select .el-select__wrapper.is-focused) {
  border-color: #409eff !important;
}
:deep(.el-input__inner) {
  color: #333;
  font-size: 13px;
}
:deep(.el-input__inner::placeholder) {
  color: #bfbfbf;
}

/* 自定义操作按钮 */
.custom-btn {
  height: 32px;
  line-height: 1;
  padding: 0 16px;
  border-radius: 4px;
  font-size: 13px;
  border-color: #d9d9d9;
  color: #595959;
}
.custom-btn:hover {
  color: #409eff;
  border-color: #409eff;
  background: #fff;
}
.custom-btn-primary {
  background: #1890ff !important;
  border-color: #1890ff !important;
  color: #fff !important;
}
.custom-btn-primary:hover {
  background: #40a9ff !important;
  border-color: #40a9ff !important;
}

/* 表格去除外边框及斑马线 */
.custom-el-table {
  --el-table-border-color: transparent;
  --el-table-row-hover-bg-color: #f5f7fa;
}
.custom-el-table::before {
  display: none; /* 隐藏底层边线 */
}

/* 分页器精简风格 */
.custom-pagination :deep(.el-pager li) {
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  color: #595959;
  font-weight: normal;
  min-width: 28px;
  height: 28px;
  line-height: 28px;
}
.custom-pagination :deep(.el-pager li.is-active) {
  background: #1890ff;
  border-color: #1890ff;
  color: #fff;
}
.custom-pagination :deep(.el-pagination__sizes .el-input__wrapper) {
  height: 28px;
  box-shadow: none;
  border: 1px solid #d9d9d9;
}
.custom-pagination :deep(.btn-prev),
.custom-pagination :deep(.btn-next) {
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  height: 28px;
  min-width: 28px;
}
</style>
