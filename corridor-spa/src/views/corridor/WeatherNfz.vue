<template>
  <div class="node-status-page">
    <div class="flex gap-4 mb-4 flex-shrink-0">
      <div class="custom-card flex-1 p-5 flex flex-col justify-between" style="min-height: 110px;">
        <div class="text-[13px] text-[#595959] mb-3">当前生效阻断数</div>
        <div class="text-[32px] font-normal text-[#333] leading-none">3</div>
      </div>
      <div class="custom-card flex-1 p-5 flex flex-col justify-between" style="min-height: 110px;">
        <div class="text-[13px] text-[#595959] mb-3">受损廊道网络占比</div>
        <div class="text-[32px] font-normal text-[#333] leading-none">12%</div>
      </div>
      <div class="custom-card flex-1 p-5 flex flex-col justify-between" style="min-height: 110px;">
        <div class="text-[13px] text-[#595959] mb-3">最高空间告警级</div>
        <div class="text-[32px] font-normal leading-none text-[#ff4d4f]">RED 极危</div>
      </div>
    </div>

    <!-- 趋势图 -->
    <div class="custom-card p-5 mb-4 flex-shrink-0">
      <div class="flex justify-between items-center mb-4">
        <div class="text-[14px] font-medium text-[#333] border-l-3 border-[#004b9e] pl-2 leading-none">气象禁飞区生成网格趋势图</div>
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
      <div ref="chartRef" class="w-full h-[200px]" />
    </div>

    <div class="custom-card flex-1 flex flex-col p-5 overflow-hidden">
      <div class="text-[14px] font-medium text-[#333] border-l-3 border-[#004b9e] pl-2 mb-4 leading-none">最新自动推演结果</div>
      
      <el-form class="search-form" label-width="80px">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="管控等级">
              <el-select placeholder="请选择" class="w-full custom-el-select">
                <el-option label="全部" value="" />
                <el-option label="RED" value="RED" />
                <el-option label="ORANGE" value="ORANGE" />
                <el-option label="YELLOW" value="YELLOW" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="影响廊道">
               <el-input placeholder="输入廊道名称" class="w-full custom-el-input" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <div class="flex justify-end gap-2 h-[32px]">
              <el-button class="custom-btn">重置</el-button>
              <el-button type="primary" class="custom-btn custom-btn-primary">查询</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>

      <!-- 表格 -->
      <el-table
        :data="dynamicNfzData"
        class="custom-el-table flex-1 mt-4"
        :header-cell-style="{ background: '#fafafa', color: '#8c8c8c', fontWeight: '500', fontSize: '13px', borderBottom: '1px solid #f0f0f0' }"
        :cell-style="{ color: '#333', fontSize: '13px', borderBottom: '1px solid #f5f5f5' }"
      >
        <el-table-column prop="name" label="受波及航路(测段)" min-width="220" show-overflow-tooltip />
        <el-table-column prop="level" label="管控等级" width="100">
          <template #default="{ row }">
             {{ row.level }} 管制
          </template>
        </el-table-column>
        <el-table-column label="预测拦截时段" min-width="280">
           <template #default="{ row }">
             {{ row.startTime }} - {{ row.endTime }}
           </template>
        </el-table-column>
        <el-table-column label="拦截受限标签" min-width="150" show-overflow-tooltip>
           <template #default="{ row }">
             {{ row.restrictedTypes.join(', ') }}
           </template>
        </el-table-column>
        <el-table-column prop="reasons" label="拦截原由" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
             {{ row.status === 'ACTIVE' ? '生效中' : '已过期' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right" align="center">
          <template #default>
            <span class="text-[#004b9e] cursor-pointer hover:text-[#005bc4] text-[13px]">详情</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const dynamicNfzData = ref([
  { name: 'G56杭瑞高速廊道(西延段)', level: 'RED', startTime: '2026-04-20 12:00:00', endTime: '2026-04-20 16:00:00', restrictedTypes: ['ALL机型'], reasons: '极端流控，风速>14.5m/s...', status: 'ACTIVE' },
  { name: 'G25长深高速廊道(富春江段)', level: 'ORANGE', startTime: '2026-04-20 10:00:00', endTime: '2026-04-21 10:00:00', restrictedTypes: ['Micro_Quadcopter', 'FixedWing'], reasons: '峡谷风扰流截断航线，限大机', status: 'ACTIVE' },
  { name: 'S14杭长高速廊道(径山段)', level: 'YELLOW', startTime: '2026-04-20 16:00:00', endTime: '2026-04-20 22:00:00', restrictedTypes: ['Micro_Quadcopter'], reasons: '降雨影响起飞视距', status: 'ACTIVE' }
])

const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null
const timeTabs = [ { key: 'today', label: '今日' }, { key: 'week', label: '近一周' }, { key: 'month', label: '近一月' } ] as const
const activeTab = ref<'today' | 'week' | 'month'>('week')

function buildChartOption() {
  const xData = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  return {
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: '#e8e8e8', textStyle: { color: '#333' } },
    legend: { show: false },
    grid: { left: '2%', right: '2%', bottom: '2%', top: '5%', containLabel: true },
    xAxis: [{ type: 'category', boundaryGap: false, data: xData, axisLine: { lineStyle: { color: '#e8e8e8' } }, axisLabel: { color: '#8c8c8c', fontSize: 11 }, axisTick: { show: false } }],
    yAxis: [{ type: 'value', minInterval: 1, splitLine: { lineStyle: { color: '#f0f0f0', type: 'dashed' } }, axisLabel: { color: '#8c8c8c', fontSize: 11 } }],
    series: [
      { name: '生成禁飞区数', type: 'line', smooth: true, symbol: 'none', lineStyle: { width: 2, color: '#ff4d4f' }, itemStyle: { color: '#ff4d4f' },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [ { offset: 0, color: 'rgba(255, 77, 79, 0.3)' }, { offset: 1, color: 'rgba(255, 77, 79, 0.05)' } ]) },
        data: [1, 0, 2, 0, 4, 1, 3] 
      }
    ]
  }
}

function switchTab(key: 'today' | 'week' | 'month') {
  activeTab.value = key
  chart?.setOption(buildChartOption(), true)
}

function initChart() {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value, null, { renderer: 'svg' })
  chart.setOption(buildChartOption())
}

const handleResize = () => chart?.resize()

onMounted(() => { initChart(); window.addEventListener('resize', handleResize) })
onBeforeUnmount(() => { chart?.dispose(); window.removeEventListener('resize', handleResize) })
</script>

<style scoped>
.node-status-page { flex: 1; display: flex; flex-direction: column; padding: 16px; background: #f0f2f5; height: 100%; box-sizing: border-box; }
.custom-card { background: #ffffff; border: 1px solid #e8e8e8; border-radius: 4px; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04); }
.border-l-3 { border-left-width: 3px; }
.search-form :deep(.el-form-item) { margin-bottom: 0; }
.search-form :deep(.el-form-item__label) { color: #595959; font-size: 13px; font-weight: normal; }
:deep(.custom-el-input .el-input__wrapper), :deep(.custom-el-select .el-select__wrapper) { box-shadow: none !important; border: 1px solid #d9d9d9 !important; border-radius: 4px; padding: 0 11px; }
:deep(.custom-el-input .el-input__wrapper:hover), :deep(.custom-el-input .el-input__wrapper.is-focus), :deep(.custom-el-select .el-select__wrapper.is-hovering), :deep(.custom-el-select .el-select__wrapper.is-focused) { border-color: #004b9e !important; }
:deep(.el-input__inner) { color: #333; font-size: 13px; }
:deep(.el-input__inner::placeholder), :deep(.el-select__placeholder) { color: #bfbfbf; }
.custom-btn { height: 32px; padding: 0 16px; border-radius: 4px; font-size: 13px; border-color: #d9d9d9; color: #595959; }
.custom-btn:hover { color: #004b9e; border-color: #004b9e; background: #fff; }
.custom-btn-primary { background: #004b9e !important; border-color: #004b9e !important; color: #fff !important; }
.custom-btn-primary:hover { background: #005bc4 !important; border-color: #005bc4 !important; }
.custom-el-table { --el-table-border-color: transparent; --el-table-row-hover-bg-color: #f5f7fa; }
.custom-el-table::before { display: none; }
</style>
