<template>
  <div class="system-assessment-page">
    <!-- Top 3 Cards -->
    <div class="flex gap-4 mb-4">
      <!-- 1: System Health State -->
      <div class="custom-card flex-1 p-5 flex flex-col justify-between" style="min-height: 180px;">
        <div class="text-[14px] text-[#333] mb-4 font-medium">系统健康状态</div>
        <div class="flex-1 flex flex-col justify-center items-center">
          <div class="text-[36px] font-bold text-[#52c41a] leading-none mb-2">100</div>
          <div class="text-[14px] text-[#52c41a]">优秀</div>
        </div>
        <div class="h-[6px] w-full bg-[#52c41a] rounded mt-2"></div>
      </div>
      
      <!-- 2: Device Ratio -->
      <div class="custom-card flex-1 p-5 flex flex-col relative" style="min-height: 180px;">
        <div class="text-[14px] text-[#333] font-medium absolute top-5 left-5 z-10">设备数量占比</div>
        <div ref="deviceChartRef" class="w-full h-full min-h-[140px]"></div>
      </div>
      
      <!-- 3: Health Ratio -->
      <div class="custom-card flex-1 p-5 flex flex-col relative" style="min-height: 180px;">
        <div class="text-[14px] text-[#333] font-medium absolute top-5 left-5 z-10">健康状态占比</div>
        <div ref="healthChartRef" class="w-full h-full min-h-[140px]"></div>
      </div>
    </div>

    <!-- Bottom 2 Cards -->
    <div class="flex gap-4 h-[300px]">
      <!-- UAV Health State -->
      <div class="custom-card flex-1 p-5 flex flex-col relative">
        <div class="text-[14px] text-[#333] font-medium mb-4">飞行器健康状态</div>
        <div class="flex flex-1 items-center">
          <div class="flex-1 flex flex-col gap-6 justify-center pl-2">
            <div class="flex items-center text-[12px] text-[#595959]" v-for="sys in uavSystems" :key="sys.name">
              <div class="w-[80px]">{{ sys.name }}</div>
              <div class="flex-1 h-[6px] bg-[#f0f0f0] rounded overflow-hidden mr-4">
                <div class="h-full bg-[#52c41a] rounded" :style="{ width: sys.value + '%' }"></div>
              </div>
              <div class="w-[24px] text-right text-[#52c41a]">{{ sys.value }}</div>
            </div>
          </div>
          <div class="w-[200px] h-full relative flex items-center justify-center">
             <div class="absolute right-0 top-0 bg-[#1890ff] text-white text-[12px] px-3 py-1 rounded-full border border-[#1890ff]">综合得分 100</div>
             <div ref="uavRadarRef" class="w-full h-full mt-4"></div>
          </div>
        </div>
      </div>

      <!-- Node Health State -->
      <div class="custom-card flex-1 p-5 flex flex-col relative">
        <div class="text-[14px] text-[#333] font-medium mb-4">节点健康状态</div>
        <div class="flex flex-1 items-center">
          <div class="flex-1 flex flex-col gap-6 justify-center pl-2">
            <div class="flex items-center text-[12px] text-[#595959]" v-for="sys in nodeSystems" :key="sys.name">
              <div class="w-[90px]">{{ sys.name }}</div>
              <div class="flex-1 h-[6px] bg-[#f0f0f0] rounded overflow-hidden mr-4">
                <div class="h-full bg-[#52c41a] rounded" :style="{ width: sys.value + '%' }"></div>
              </div>
              <div class="w-[24px] text-right text-[#52c41a]">{{ sys.value }}</div>
            </div>
          </div>
          <div class="w-[200px] h-full relative flex items-center justify-center">
             <div class="absolute right-0 top-0 bg-[#1890ff] text-white text-[12px] px-3 py-1 rounded-full border border-[#1890ff]">综合得分 100</div>
             <div ref="nodeRadarRef" class="w-full h-full mt-4"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const uavSystems = [
  { name: '动力系统', value: 100 },
  { name: '飞行性能', value: 100 },
  { name: '导航系统', value: 100 },
  { name: '通信系统', value: 100 },
  { name: '任务与环境', value: 100 },
]

const nodeSystems = [
  { name: '通信链路性能', value: 100 },
  { name: '计算与处理资源', value: 100 },
  { name: '电源与环境', value: 100 },
  { name: '服务与软件状态', value: 100 },
  { name: '硬件与外设', value: 100 },
]

const deviceChartRef = ref<HTMLElement>()
const healthChartRef = ref<HTMLElement>()
const uavRadarRef = ref<HTMLElement>()
const nodeRadarRef = ref<HTMLElement>()

let charts: echarts.ECharts[] = []

function initCharts() {
  if (deviceChartRef.value) {
    const chart = echarts.init(deviceChartRef.value, null, { renderer: 'svg' })
    chart.setOption({
      tooltip: { trigger: 'item' },
      legend: { bottom: 0, icon: 'square', itemWidth: 10, itemHeight: 10, textStyle: { fontSize: 12, color: '#595959' } },
      series: [{
        type: 'pie', radius: ['45%', '70%'], center: ['50%', '45%'],
        label: { show: false },
        data: [
          { value: 1048, name: '基站', itemStyle: { color: '#1890ff' } },
          { value: 735, name: '飞行器', itemStyle: { color: '#8c8c8c' } }
        ]
      }]
    })
    charts.push(chart)
  }

  if (healthChartRef.value) {
    const chart = echarts.init(healthChartRef.value, null, { renderer: 'svg' })
    chart.setOption({
      tooltip: { trigger: 'item' },
      legend: { bottom: 0, icon: 'square', itemWidth: 10, itemHeight: 10, textStyle: { fontSize: 12, color: '#595959' } },
      series: [{
        type: 'pie', radius: ['45%', '70%'], center: ['50%', '45%'],
        label: { show: false },
        data: [
          { value: 150, name: '正常', itemStyle: { color: '#52c41a' } },
          { value: 5, name: '提示', itemStyle: { color: '#faad14' } },
          { value: 1, name: '警告', itemStyle: { color: '#f5222d' } }
        ]
      }]
    })
    charts.push(chart)
  }

  const baseRadarOption = {
    tooltip: { trigger: 'item' },
    radar: {
      radius: '65%',
      center: ['50%', '55%'],
      splitNumber: 4,
      axisName: { color: '#8c8c8c', fontSize: 11 },
      splitArea: { areaStyle: { color: ['transparent'] } },
      axisLine: { lineStyle: { color: '#e8e8e8' } },
      splitLine: { lineStyle: { color: '#e8e8e8' } }
    },
    series: [{
      type: 'radar',
      symbol: 'circle',
      symbolSize: 4,
      itemStyle: { color: '#1890ff' },
      areaStyle: { color: 'rgba(24, 144, 255, 0.4)' },
      lineStyle: { width: 1.5, color: '#1890ff' },
      data: [{ value: [100, 100, 100, 100, 100], name: '评分' }]
    }]
  }

  if (uavRadarRef.value) {
    const chart = echarts.init(uavRadarRef.value, null, { renderer: 'svg' })
    chart.setOption({
      ...baseRadarOption,
      radar: { ...baseRadarOption.radar, indicator: uavSystems.map(s => ({ name: s.name, max: 100 })) }
    })
    charts.push(chart)
  }

  if (nodeRadarRef.value) {
    const chart = echarts.init(nodeRadarRef.value, null, { renderer: 'svg' })
    chart.setOption({
      ...baseRadarOption,
      radar: { ...baseRadarOption.radar, indicator: nodeSystems.map(s => ({ name: s.name, max: 100 })) }
    })
    charts.push(chart)
  }
}

const handleResize = () => charts.forEach(c => c.resize())

onMounted(() => { initCharts(); window.addEventListener('resize', handleResize) })
onUnmounted(() => { charts.forEach(c => c.dispose()); window.removeEventListener('resize', handleResize) })
</script>

<style scoped>
.system-assessment-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: #f0f2f5;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
}

.custom-card {
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}
</style>
