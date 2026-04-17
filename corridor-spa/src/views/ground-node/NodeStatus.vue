<template>
  <div class="node-status-page">
    <!-- 顶部统计卡片 -->
    <div class="flex gap-4 mb-4 flex-shrink-0">
      <div class="custom-card flex-1 p-5 flex flex-col justify-between" style="min-height: 110px;">
        <div class="text-[13px] text-[#595959] mb-3">总节点数</div>
        <div class="text-[32px] font-normal text-[#333] leading-none">{{ stats.total }}</div>
      </div>
      <div class="custom-card flex-1 p-5 flex flex-col justify-between" style="min-height: 110px;">
        <div class="text-[13px] text-[#595959] mb-3">在线节点数</div>
        <div class="text-[32px] font-normal text-[#333] leading-none">{{ stats.online }}</div>
      </div>
      <div class="custom-card flex-1 p-5 flex flex-col justify-between" style="min-height: 110px;">
        <div class="text-[13px] text-[#595959] mb-3">异常节点数</div>
        <div class="text-[32px] font-normal leading-none" :class="stats.abnormal > 0 ? 'text-[#ff4d4f]' : 'text-[#333]'">{{ stats.abnormal }}</div>
      </div>
    </div>

    <!-- 趋势图 -->
    <div class="custom-card p-5 mb-4 flex-shrink-0">
      <div class="flex justify-between items-center mb-4">
        <div class="text-[14px] font-medium text-[#333] border-l-3 border-[#004b9e] pl-2 leading-none">节点状态趋势图</div>
        <div class="flex bg-[#f5f7fa] p-0.5 rounded text-[13px]">
          <div 
            v-for="tab in timeTabs" :key="tab.key"
            class="px-4 py-1.5 cursor-pointer rounded-sm"
            :class="activeTab === tab.key ? 'bg-white text-[#004b9e] shadow-sm font-medium' : 'text-[#595959] hover:text-[#333]'"
            @click="switchTab(tab.key)"
          >
            {{ tab.label }}
          </div>
        </div>
      </div>
      <div ref="chartRef" class="w-full h-[240px]" />
    </div>

    <!-- 节点列表 -->
    <div class="custom-card flex-1 flex flex-col p-5 overflow-hidden">
      <div class="text-[14px] font-medium text-[#333] border-l-3 border-[#004b9e] pl-2 mb-4 leading-none">节点信息列表</div>

      <!-- 搜索区 -->
      <el-form :model="filter" class="search-form" label-width="80px">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="节点名称">
              <el-input v-model="filter.name" placeholder="请输入节点名称" clearable class="w-full custom-el-input" @change="resetPage" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="节点状态">
              <el-select v-model="filter.health" placeholder="请选择节点状态" clearable class="w-full custom-el-select" @change="resetPage">
                <el-option label="全部" value="" />
                <el-option label="正常" value="正常" />
                <el-option label="提示" value="提示" />
                <el-option label="警告" value="警告" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <div class="flex justify-end gap-2 h-[32px]">
              <el-button @click="resetFilters" class="custom-btn">重置</el-button>
              <el-button type="primary" @click="loadList" class="custom-btn custom-btn-primary">查询</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>

      <!-- 表格 -->
      <el-table
        :data="pagedList"
        v-loading="loading"
        class="custom-el-table flex-1 mt-2"
        :header-cell-style="{ background: '#fafafa', color: '#8c8c8c', fontWeight: '500', fontSize: '13px', borderBottom: '1px solid #f0f0f0' }"
        :cell-style="{ color: '#333', fontSize: '13px', borderBottom: '1px solid #f5f5f5' }"
      >
        <el-table-column label="序号" type="index" :index="indexOffset" width="60" align="center" />
        <el-table-column prop="nodeId" label="节点ID" min-width="140" />
        <el-table-column prop="name" label="节点名称" min-width="160" show-overflow-tooltip />
        <el-table-column prop="health" label="节点状态" min-width="100" />
        <el-table-column prop="loc" label="节点位置" min-width="180" show-overflow-tooltip />
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default>
            <span class="text-[#004b9e] cursor-pointer hover:text-[#005bc4] text-[13px]">详情</span>
          </template>
        </el-table-column>
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
          @current-change="loadList"
          @size-change="resetPage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

// ---- 状态 ----
const loading = ref(false)
const filter = reactive({ name: '', health: '' })
const pagination = reactive({ page: 1, pageSize: 10 })

const stats = reactive({ total: 13, online: 12, abnormal: 0 })

// 造假数据以符合截图里的精简字段
const mockData = [
  { nodeId: 'BSL000000130', name: '弱电模拟节点', health: '正常', loc: '浙江省杭州市萧山区' },
  { nodeId: 'BSL000000129', name: '杭甬测试节点三号', health: '警告', loc: '浙江省绍兴市越城区' },
  { nodeId: 'BSL000000127', name: '杭甬测试节点一号测试超长', health: '提示', loc: '浙江省绍兴市越城区' },
  { nodeId: 'BSL000000122', name: '杭甬节点5号', health: '正常', loc: '浙江省绍兴市上虞区' },
  { nodeId: 'BSL000000121', name: '杭甬节点4号', health: '警告', loc: '浙江省绍兴市上虞区' },
  { nodeId: 'BSL000000120', name: '杭甬节点3号', health: '正常', loc: '浙江省绍兴市上虞区' },
  { nodeId: 'BSL000000119', name: '杭甬节点2号', health: '正常', loc: '浙江省绍兴市上虞区' },
  { nodeId: 'BSL000000118', name: '杭甬节点1号', health: '正常', loc: '浙江省绍兴市柯桥区' },
]

const list = ref<any[]>([])
const total = ref(13)

async function loadList() {
  loading.value = true
  setTimeout(() => {
    let filtered = mockData.filter(d => {
      if (filter.name && !d.name.includes(filter.name)) return false
      if (filter.health && d.health !== filter.health) return false
      return true
    })
    total.value = filtered.length
    list.value = filtered
    loading.value = false
  }, 300)
}

function resetPage() {
  pagination.page = 1
  loadList()
}

function resetFilters() {
  Object.assign(filter, { name: '', health: '' })
  resetPage()
}

const pagedList = computed(() => list.value)
const indexOffset = computed(() => (pagination.page - 1) * pagination.pageSize + 1)

// ---- ECharts 趋势图 ----
const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null
const timeTabs = [
  { key: 'today', label: '今日' },
  { key: 'week',  label: '近一周' },
  { key: 'month', label: '近一月' },
] as const
const activeTab = ref<'today' | 'week' | 'month'>('today')

function buildChartOption(range: string) {
  let xData: string[] = []
  let normal: number[] = []
  let abnormal: number[] = []

  if (range === 'today') {
    xData = Array.from({ length: 24 }, (_, i) => `${i}:00`)
    normal   = [13, 11, 10, 10, 14, 11, 10, 15, 11, 12, 13, 12, 10, 12, 12, 10, 14, 14, 12, 12, 13, 12, 12, 12]
    abnormal = [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1]
  } else if (range === 'week') {
    xData = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    normal   = [10, 12, 14, 13, 15, 11, 12]
    abnormal = [1, 0, 0, 2, 0, 1, 0]
  } else {
    xData = Array.from({ length: 30 }, (_, i) => `${i + 1}日`)
    normal   = xData.map(() => Math.floor(Math.random() * 4 + 10))
    abnormal = xData.map(() => Math.floor(Math.random() * 3))
  }

  return {
    tooltip: { 
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#e8e8e8',
      textStyle: { color: '#333' }
    },
    legend: { 
      data: ['异常节点', '正常节点'], 
      right: 10, 
      top: 0,
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      textStyle: { color: '#595959', fontSize: 12 }
    },
    grid: { left: '2%', right: '2%', bottom: '2%', top: '15%', containLabel: true },
    xAxis: [{ 
      type: 'category', 
      boundaryGap: false, 
      data: xData,
      axisLine: { lineStyle: { color: '#e8e8e8' } },
      axisLabel: { color: '#8c8c8c', fontSize: 11 },
      axisTick: { show: false }
    }],
    yAxis: [{ 
      type: 'value', 
      name: '数量（个）',
      nameTextStyle: { color: '#8c8c8c', fontSize: 12, padding: [0, 20, 0, 0] },
      splitLine: { lineStyle: { color: '#f0f0f0', type: 'dashed' } },
      axisLabel: { color: '#8c8c8c', fontSize: 11 }
    }],
    series: [
      { 
        name: '正常节点', 
        type: 'line', 
        smooth: true, 
        symbol: 'none',
        lineStyle: { width: 2, color: '#52c41a' },
        itemStyle: { color: '#52c41a' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(82, 196, 26, 0.3)' },
            { offset: 1, color: 'rgba(82, 196, 26, 0.05)' }
          ])
        },
        data: normal 
      },
      { 
        name: '异常节点', 
        type: 'line', 
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 2, color: '#ff4d4f' },
        itemStyle: { color: '#ff4d4f' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255, 77, 79, 0.3)' },
            { offset: 1, color: 'rgba(255, 77, 79, 0.05)' }
          ])
        },
        data: abnormal 
      }
    ]
  }
}

function switchTab(key: 'today' | 'week' | 'month') {
  activeTab.value = key
  chart?.setOption(buildChartOption(key), true)
}

function initChart() {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value, null, { renderer: 'svg' })
  chart.setOption(buildChartOption(activeTab.value))
}

const handleResize = () => chart?.resize()

onMounted(() => {
  loadList()
  initChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  chart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.node-status-page {
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
}

.border-l-3 {
  border-left-width: 3px;
}

/* 表单覆盖 */
.search-form :deep(.el-form-item) { margin-bottom: 0; }
.search-form :deep(.el-form-item__label) { color: #595959; font-size: 13px; font-weight: normal; }

/* 极简组件样式 */
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
  border-color: #004b9e !important;
}
:deep(.el-input__inner) { color: #333; font-size: 13px; }
:deep(.el-input__inner::placeholder),
:deep(.el-select__placeholder) { color: #bfbfbf; }

/* 按钮样式 */
.custom-btn { height: 32px; padding: 0 16px; border-radius: 4px; font-size: 13px; border-color: #d9d9d9; color: #595959; }
.custom-btn:hover { color: #004b9e; border-color: #004b9e; background: #fff; }
.custom-btn-primary { background: #004b9e !important; border-color: #004b9e !important; color: #fff !important; }
.custom-btn-primary:hover { background: #005bc4 !important; border-color: #005bc4 !important; }

/* 表格边缘消除 */
.custom-el-table { --el-table-border-color: transparent; --el-table-row-hover-bg-color: #f5f7fa; }
.custom-el-table::before { display: none; }

/* 分页器精简风格 */
.custom-pagination :deep(.el-pager li) { background: #fff; border: 1px solid #d9d9d9; border-radius: 4px; color: #595959; font-weight: normal; min-width: 28px; height: 28px; line-height: 28px; }
.custom-pagination :deep(.el-pager li.is-active) { background: #fff; border-color: #004b9e; color: #004b9e; }
.custom-pagination :deep(.el-pagination__sizes .el-input__wrapper) { height: 28px; box-shadow: none; border: 1px solid #d9d9d9; }
.custom-pagination :deep(.btn-prev),
.custom-pagination :deep(.btn-next) { background: #fff; border: 1px solid #d9d9d9; border-radius: 4px; height: 28px; min-width: 28px; }
</style>
