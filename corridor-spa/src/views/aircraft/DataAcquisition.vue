<template>
  <div class="aircraft-manage-page">
    <!-- 顶部数据卡片 -->
    <div class="flex gap-4">
      <div class="custom-card flex-1 p-6 flex flex-col justify-center">
        <div class="text-[14px] text-[#595959] mb-4">在飞飞行器总数</div>
        <div class="text-[32px] text-[#333] leading-none">{{ stats.inFlight }}</div>
      </div>
      <div class="custom-card flex-1 p-6 flex flex-col justify-center">
        <div class="text-[14px] text-[#595959] mb-4">当天已飞飞行器数量</div>
        <div class="text-[32px] text-[#333] leading-none">{{ stats.flownToday }}</div>
      </div>
      <div class="custom-card flex-1 p-6 flex flex-col justify-center">
        <div class="text-[14px] text-[#595959] mb-4">当天异常飞行器数量</div>
        <div class="text-[32px] text-[#333] leading-none">{{ stats.abnormalToday }}</div>
      </div>
      <div class="custom-card flex-1 p-6 flex flex-col justify-center">
        <div class="text-[14px] text-[#595959] mb-4">当天任务完成率</div>
        <div class="text-[32px] text-[#333] leading-none">{{ stats.completionRate }}<span class="text-[20px]">%</span></div>
      </div>
    </div>

    <!-- 趋势图卡片 -->
    <div class="custom-card p-5 mt-4 flex flex-col">
      <div class="flex justify-between items-center mb-2">
        <div class="text-[15px] text-[#333]">飞行器状态趋势</div>
        <div class="flex border border-[#d9d9d9] rounded text-[13px] overflow-hidden">
          <div class="px-4 py-1.5 cursor-pointer bg-[#1890ff] text-white">今日</div>
          <div class="px-4 py-1.5 cursor-pointer text-[#595959] hover:text-[#1890ff] border-l border-[#d9d9d9]">近一周</div>
          <div class="px-4 py-1.5 cursor-pointer text-[#595959] hover:text-[#1890ff] border-l border-[#d9d9d9]">近一月</div>
        </div>
      </div>
      <div ref="trendChartRef" class="w-full h-[280px]"></div>
    </div>

    <!-- 列表卡片 -->
    <div class="custom-card flex-1 flex flex-col mt-4 p-5 overflow-hidden">
      <div class="text-[15px] text-[#333] mb-4">在线飞行器信息列表</div>
      
      <!-- 搜索表单 -->
      <el-form :model="filter" class="search-form mb-4" label-width="80px">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="飞行器ID">
              <el-input v-model="filter.aircraftId" placeholder="请输入飞行器ID" class="w-full custom-el-input" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="飞行器型号">
              <el-select v-model="filter.model" placeholder="请选择飞行器型号" class="w-full custom-el-select">
                <el-option label="M300" value="M300" />
                <el-option label="T16" value="T16" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="飞行器状态">
              <el-select v-model="filter.status" placeholder="请选择飞行器状态" class="w-full custom-el-select">
                <el-option label="在飞" value="normal" />
                <el-option label="异常" value="abnormal" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="业务类型">
              <el-select v-model="filter.business" placeholder="请选择业务类型" class="w-full custom-el-select">
                <el-option label="巡检" value="inspection" />
                <el-option label="物流" value="logistics" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <div class="flex justify-end gap-2 pr-[12px] h-[32px]">
              <el-button @click="resetFilters" class="custom-btn">重置</el-button>
              <el-button type="primary" @click="doSearch" class="custom-btn custom-btn-primary">查询</el-button>
              <el-button link type="primary" class="text-[13px] text-[#1890ff] ml-2">收起 <el-icon class="ml-1"><ArrowUp /></el-icon></el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>

      <!-- 数据表格 -->
      <el-table 
        :data="list" 
        v-loading="loading" 
        class="custom-el-table flex-1"
        :header-cell-style="{ background: '#fafafa', color: '#8c8c8c', fontWeight: '500', fontSize: '13px', borderBottom: '1px solid #f0f0f0' }"
        :cell-style="{ color: '#333', fontSize: '13px', borderBottom: '1px solid #f5f5f5' }"
      >
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column prop="aircraftId" label="飞行器ID" min-width="120" />
        <el-table-column prop="model" label="飞行器型号" min-width="120" />
        <el-table-column prop="manufacturer" label="生产厂家" min-width="160" show-overflow-tooltip />
        <el-table-column label="剩余电量" width="100">
          <template #default="{ row }">{{ row.battery }}%</template>
        </el-table-column>
        <el-table-column prop="businessType" label="业务类型" width="100" />
        <el-table-column prop="location" label="飞行器所在位置" min-width="180" show-overflow-tooltip />
        <el-table-column prop="launchTime" label="飞行器起飞时间" width="160" />
        <el-table-column prop="status" label="飞行器状态" width="100" />
        <el-table-column label="操作" width="80" fixed="right" align="center">
          <template #default>
             <span class="text-[#1890ff] cursor-pointer hover:text-[#40a9ff] text-[13px]">详情</span>
          </template>
        </el-table-column>

        <template #empty>
          <el-empty description="无数据" :image-size="60" />
        </template>
      </el-table>

      <!-- 分页栏 -->
      <div class="flex justify-end items-center mt-4 text-[13px] text-[#8c8c8c]">
        <span class="mr-4">共 {{ total }} 个</span>
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
import { getAircraftList } from '@/api/modules'
import { AIRCRAFT_STATS } from '@/mock/aircraft'
import type { AircraftRecord } from '@/api/modules'

const stats = ref(AIRCRAFT_STATS)
const loading = ref(false)
const list = ref<AircraftRecord[]>([])
const total = ref(0)

const filter = reactive({ aircraftId: '', model: '', status: '', business: '' })
const pagination = reactive({ page: 1, pageSize: 10 })

const trendChartRef = ref<HTMLElement>()
let trendChart: echarts.ECharts | null = null

async function loadList() {
  loading.value = true
  try {
    const res = await getAircraftList({}, pagination)
    list.value = [] // 默认按截图展示无数据
    total.value = 0
  } finally {
    loading.value = false
  }
}

function doSearch() { pagination.page = 1; loadList() }
function resetFilters() {
  Object.assign(filter, { aircraftId: '', model: '', status: '', business: '' })
  doSearch()
}

function initChart() {
  if (!trendChartRef.value) return
  trendChart = echarts.init(trendChartRef.value, null, { renderer: 'svg' })
  
  // 模拟曲线上的数据
  const hours = ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00']
  const normalData = [1.5, 0, 0, 0, 2, 2, 0.8, 0, 0.5, 2, 0, 0, 0, 0, 1.8, 0, 0, 1.8, 0, 0, 3, 2, 0, 0]
  const abnormalData = [0.8, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0]

  trendChart.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      padding: [10, 12],
      textStyle: { color: '#666', fontSize: 13 },
      extraCssText: 'box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #e8e8e8;'
    },
    legend: {
      bottom: -5,
      icon: 'circle',
      textStyle: { color: '#595959', fontSize: 12 },
      itemWidth: 8,
      itemHeight: 8
    },
    grid: { left: '3%', right: '3%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: hours,
      axisLine: { lineStyle: { color: '#d9d9d9' } },
      axisLabel: { color: '#8c8c8c', fontSize: 11 }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 3,
      splitLine: { lineStyle: { type: 'dashed', color: '#e8e8e8' } },
      axisLine: { show: false },
      axisLabel: { color: '#8c8c8c', fontSize: 11 }
    },
    series: [
      {
        name: '正常飞行器',
        type: 'line',
        smooth: true,
        symbol: 'none',
        itemStyle: { color: '#52c41a' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(82,196,26,0.3)' },
            { offset: 1, color: 'rgba(82,196,26,0.01)' }
          ])
        },
        lineStyle: { width: 2 },
        data: normalData
      },
      {
        name: '异常飞行器',
        type: 'line',
        smooth: true,
        symbol: 'none',
        itemStyle: { color: '#f5222d' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(245,34,45,0.3)' },
            { offset: 1, color: 'rgba(245,34,45,0.01)' }
          ])
        },
        lineStyle: { width: 2 },
        data: abnormalData
      }
    ]
  })
}

const handleResize = () => trendChart?.resize()

onMounted(() => { loadList(); initChart(); window.addEventListener('resize', handleResize) })
onUnmounted(() => { trendChart?.dispose(); window.removeEventListener('resize', handleResize) })
</script>

<style scoped>
.aircraft-manage-page {
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

/* 覆写 Element 表单间距 */
.search-form :deep(.el-form-item) {
  margin-bottom: 16px;
}
.search-form :deep(.el-form-item__label) {
  color: #595959;
  font-size: 13px;
  font-weight: normal;
}

/* 扁平化极简 Input / Select */
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
  border-color: #1890ff !important;
}
:deep(.el-input__inner) {
  color: #333;
  font-size: 13px;
}
:deep(.el-input__inner::placeholder),
:deep(.el-select__placeholder) {
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
  color: #1890ff;
  border-color: #1890ff;
  background: #fff;
}
.custom-btn-primary {
  background: #004b9e !important;
  border-color: #004b9e !important;
  color: #fff !important;
}
.custom-btn-primary:hover {
  background: #005bc4 !important;
  border-color: #005bc4 !important;
}

/* 表格边缘消除 */
.custom-el-table {
  --el-table-border-color: transparent;
  --el-table-row-hover-bg-color: #f5f7fa;
}
.custom-el-table::before {
  display: none;
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
  background: #fff;
  border-color: #1890ff;
  color: #1890ff;
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
