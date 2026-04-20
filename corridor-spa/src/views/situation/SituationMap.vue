<template>
  <div class="situation-map relative w-full h-full overflow-hidden bg-[#0a1628]">
    <!-- 底层地图 -->
    <div id="leaflet-map-container" class="absolute inset-0 z-0 map-wrapper"></div>

    <!-- 粒子风场渲染 DOM 层 (独立挂载) -->
    <canvas ref="windCanvasRef" class="absolute inset-0 pointer-events-none z-[401]"></canvas>

    <!-- 顶部搜寻栏 (绝对定位) -->
    <div class="search-bar absolute top-6 left-6 z-10 
      flex items-center 
      w-[260px] h-[36px] 
      bg-[rgba(10,22,40,0.6)] backdrop-blur-md 
      border border-[#00beff]/40 shadow-[inset_0_0_10px_rgba(0,190,255,0.2)]">
      <input type="text" placeholder="搜索位置、航线、起降点..." 
        class="flex-1 h-full px-3 text-[13px] bg-transparent text-white border-none outline-none placeholder-[rgba(255,255,255,0.5)]" />
      <div class="w-10 h-full flex items-center justify-center text-[#00beff] cursor-pointer hover:bg-[#00beff]/10 transition cursor-pointer">
        <el-icon><Search /></el-icon>
      </div>
    </div>

    <!-- 左侧浮动面板区 -->
    <div class="left-panels absolute top-[72px] left-6 z-10 flex flex-col gap-6 w-[260px] max-h-[calc(100vh-100px)] pointer-events-none">
      
      <!-- 空域列表 -->
      <div class="hud-panel pointer-events-auto flex flex-col">
        <div class="panel-header" @click="uiState.showAirspace = !uiState.showAirspace">
          <div class="title-tech">
            <span class="bracket">[</span>
            <el-icon class="arrow"><CaretRight /></el-icon>
            <span class="text">空域列表</span>
            <el-icon class="arrow"><CaretLeft /></el-icon>
            <span class="bracket">]</span>
          </div>
        </div>
        <div class="panel-body transition-all duration-300" :class="{ 'max-h-[350px] opacity-100': uiState.showAirspace, 'max-h-0 opacity-0 overflow-hidden': !uiState.showAirspace }">
          <div class="airspace-list p-2 flex flex-col gap-1 overflow-y-auto max-h-[300px] custom-scrollbar">
            <div 
              v-for="(item, idx) in AIRSPACES" :key="idx" 
              class="hud-list-item flex items-center gap-3 p-2 cursor-pointer transition-colors" 
              :class="{ 'bg-[#00beff]/20 border-l-2 border-[#00beff]': activeAirspaces.includes(idx), 'hover:bg-white/5 border-l-2 border-transparent': !activeAirspaces.includes(idx) }"
              @click="toggleAirspace(idx)">
              <!-- Icon -->
              <div class="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/70">
                 <el-icon class="text-[16px]"><component :is="item.icon" /></el-icon>
              </div>
              <!-- Text -->
              <div class="flex-1 min-w-0 flex flex-col">
                <span class="text-[13px] text-white/90 truncate">{{ item.name }}</span>
                <span class="text-[10px] text-white/40 mt-0.5 font-mono">{{ item.desc }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 廊道列表 -->
      <div class="hud-panel pointer-events-auto flex flex-col">
        <div class="panel-header" @click="uiState.showCorridor = !uiState.showCorridor">
          <div class="title-tech">
            <span class="bracket">[</span>
            <el-icon class="arrow"><CaretRight /></el-icon>
            <span class="text">廊道列表</span>
            <el-icon class="arrow"><CaretLeft /></el-icon>
            <span class="bracket">]</span>
          </div>
        </div>
        <div class="panel-body transition-all duration-300" :class="{ 'max-h-[350px] opacity-100': uiState.showCorridor, 'max-h-0 opacity-0 overflow-hidden': !uiState.showCorridor }">
          <div class="corridor-list p-2 flex flex-col gap-1 overflow-y-auto max-h-[300px] custom-scrollbar">
            <div v-for="(item, idx) in CORRIDORS" :key="idx" class="hud-list-item hover:bg-white/5 p-2 flex justify-between items-center transition-colors cursor-pointer" @click="focusCorridor(idx)">
              <div class="flex items-start gap-2 max-w-[85%]">
                <el-checkbox v-model="corridorVisibility[idx]" @click.stop @change="updateCorridorVisibility(idx)" class="custom-hud-checkbox mt-0.5"></el-checkbox>
                <div class="flex flex-col">
                  <span class="text-[13px] text-white/90 truncate">{{ item.name }}</span>
                  <div class="text-[11px] text-white/40 mt-1 flex justify-between tracking-wide">
                    <span class="font-mono">廊道状态</span>
                    <span class="text-white/80 font-mono">{{ item.status }}</span>
                  </div>
                </div>
              </div>
              <el-icon class="text-white/40"><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- 右侧浮动面板区 -->
    <div class="right-panels absolute top-6 right-6 z-10 flex flex-col gap-6 w-[260px] max-h-[calc(100vh-100px)] pointer-events-none">
      
      <!-- 在飞任务列表 -->
      <div class="hud-panel h-[230px] pointer-events-auto flex flex-col">
        <div class="panel-header">
          <div class="title-tech">
            <span class="bracket">[</span>
            <el-icon class="arrow"><CaretRight /></el-icon>
            <span class="text">在飞任务列表</span>
            <el-icon class="arrow"><CaretLeft /></el-icon>
            <span class="bracket">]</span>
          </div>
        </div>
        <div class="panel-body flex-1 p-2 overflow-y-auto custom-scrollbar">
          <!-- TODO: Empty state for prototype as per screenshot -->
        </div>
      </div>

      <!-- 告警列表 -->
      <div class="hud-panel h-[230px] pointer-events-auto flex flex-col">
        <div class="panel-header">
          <div class="title-tech">
             <span class="bracket">[</span>
             <el-icon class="arrow"><CaretRight /></el-icon>
             <span class="text">告警列表</span>
             <el-icon class="arrow"><CaretLeft /></el-icon>
             <span class="bracket">]</span>
          </div>
        </div>
        <div class="panel-body flex-1 p-2 overflow-y-auto custom-scrollbar">
          <!-- TODO: Empty state for prototype as per screenshot -->
        </div>
      </div>

      <!-- 气象图层控制 (新增) -->
      <div class="hud-panel pointer-events-auto flex flex-col">
        <div class="panel-header" @click="uiState.showWeather = !uiState.showWeather">
          <div class="title-tech">
             <span class="bracket">[</span>
             <el-icon class="arrow"><CaretRight /></el-icon>
             <span class="text text-[#ffb74d]">气象预测与管制</span>
             <el-icon class="arrow"><CaretLeft /></el-icon>
             <span class="bracket">]</span>
          </div>
        </div>
        <div class="panel-body transition-all duration-300" :class="{ 'max-h-[350px] opacity-100': uiState.showWeather, 'max-h-0 opacity-0 overflow-hidden': !uiState.showWeather }">
          <div class="p-3 flex flex-col gap-2 text-white/90 text-[13px]">
             <div class="flex items-center justify-between hover:bg-white/5 p-1 rounded transition">
               <span class="flex items-center gap-2"><i class="ri-temp-hot-line text-[#ff7043]"></i> 温度云图</span>
               <el-switch v-model="weatherState.showTemp" class="custom-switch" />
             </div>
             <div class="flex items-center justify-between hover:bg-white/5 p-1 rounded transition">
               <span class="flex items-center gap-2"><i class="ri-showers-line text-[#42a5f5]"></i> 降水分布</span>
               <el-switch v-model="weatherState.showRain" class="custom-switch" />
             </div>
             <div class="flex items-center justify-between hover:bg-white/5 p-1 rounded transition">
               <span class="flex items-center gap-2"><i class="ri-windy-line text-[#bcaaa4]"></i> 风速流场</span>
               <el-switch v-model="weatherState.showWind" class="custom-switch" />
             </div>
             <div class="w-full h-px bg-white/10 my-1"></div>
             <div class="flex items-center justify-between hover:bg-[#ff4d4f]/10 p-1 rounded transition">
               <span class="flex items-center gap-2 text-[#ff4d4f] font-bold"><i class="ri-error-warning-line"></i> 气象禁飞区</span>
               <el-switch v-model="weatherState.showNoFlyZone" class="custom-danger-switch" />
             </div>
          </div>
        </div>
      </div>

    </div>

    <!-- 右下角工具栏 -->
    <div class="tool-bar-wrapper absolute bottom-6 right-6 z-10 flex pointer-events-auto">
      <div class="tool-bar-tech flex items-center bg-[rgba(10,22,40,0.6)] backdrop-blur-md border border-[#00beff]/40 shadow-[inset_0_0_10px_rgba(0,190,255,0.2)]">
        <!-- 装饰箭头左侧 -->
        <div class="flex items-center justify-center w-6 h-full text-[#00beff]/50 border-r border-[#00beff]/20">
          <el-icon><ArrowRightBold /></el-icon>
        </div>
        <div class="flex items-center px-2 py-1.5 gap-2">
          <div v-for="tool in tools" :key="tool.title" 
              class="w-[34px] h-[34px] flex items-center justify-center rounded-sm cursor-pointer transition-all duration-200"
              :class="tool.active ? 'bg-[#00beff]/20 text-[#00beff] shadow-[inset_0_0_5px_rgba(0,190,255,0.5)]' : 'text-white/60 hover:bg-white/10 hover:text-white'"
              @click="toggleTool(tool)"
              :title="tool.title">
            <i :class="tool.icon" class="text-[18px]"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部时间切片播放轴 (新增) -->
    <div v-show="weatherState.showTemp || weatherState.showRain || weatherState.showWind || weatherState.showNoFlyZone" 
         class="time-slider-wrapper absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-[600px] pointer-events-auto flex flex-col">
       <div class="bg-[rgba(10,22,40,0.7)] backdrop-blur-md border border-[#00beff]/40 shadow-[0_4px_20px_rgba(0,0,0,0.5),inset_0_0_15px_rgba(0,190,255,0.15)] rounded-full px-6 py-2 flex items-center gap-6">
          
          <!-- 播放按钮 -->
          <div class="w-10 h-10 flex items-center justify-center rounded-full bg-[#00beff]/20 text-[#00beff] border border-[#00beff]/50 cursor-pointer hover:bg-[#00beff]/40 transition shadow-[0_0_10px_rgba(0,190,255,0.5)]" @click="togglePlayback">
             <i class="text-[20px] ml-0.5" :class="[weatherState.isPlaying ? 'ri-pause-fill' : 'ri-play-fill', { 'ml-0': weatherState.isPlaying }]"></i>
          </div>

          <!-- 时间轴滑块 -->
          <div class="flex-1 flex flex-col mt-2">
             <div class="flex justify-between text-[#00beff]/70 text-[11px] font-mono tracking-wider absolute -top-5 w-[calc(100%-110px)] left-[80px]">
               <span>当前实况</span>
               <span>T+12H</span>
               <span>T+24H</span>
             </div>
             <el-slider 
               v-model="weatherState.timeOffset" 
               :step="3" 
               :min="0" :max="24" 
               show-stops 
               :format-tooltip="formatTimeTooltip"
               class="custom-dark-slider"
             />
          </div>

          <!-- 选定时间展板 -->
          <div class="w-[80px] text-right flex flex-col items-end">
             <span class="text-[#00beff] font-bold text-[18px] font-mono leading-none">{{ weatherState.timeOffset === 0 ? 'NOW' : `+${weatherState.timeOffset}H` }}</span>
             <span class="text-white/40 text-[10px]">时空切片</span>
          </div>

       </div>
    </div>

    <!-- 左下角图层控制面板 -->
    <div class="map-layer-control absolute bottom-6 left-6 z-10 flex flex-col items-start gap-2 pointer-events-auto">
      <!-- 展开的控制面板 -->
      <div v-show="uiState.showLayerControl" class="hud-panel p-4 mb-1 flex flex-col gap-4 min-w-[180px] text-white/90 text-[13px]">
        <div>
           <div class="text-[#00beff] font-bold mb-2 tracking-widest text-[12px] flex items-center gap-2">
             <i class="ri-map-2-line"></i> 底图样式
           </div>
           <el-radio-group v-model="mapState.baseLayer" @change="updateMapLayers" class="flex flex-col gap-2 custom-hud-radio items-start">
             <el-radio value="satellite">卫星图层</el-radio>
             <el-radio value="vector">标准电子地图</el-radio>
           </el-radio-group>
        </div>
        <div class="w-full h-px bg-white/10"></div>
        <div>
           <div class="text-[#00beff] font-bold mb-2 tracking-widest text-[12px] flex items-center gap-2">
             <i class="ri-road-map-line"></i> 叠加要素
           </div>
           <div class="flex flex-col gap-2 relative">
             <el-checkbox v-model="mapState.showRoads" @change="updateMapLayers" class="custom-hud-checkbox text-white">显示路网脉络</el-checkbox>
             
             <!-- 地名分级展示菜单 -->
             <div class="flex flex-col gap-1 mt-1">
               <div class="text-white/60 text-[12px] mb-1">行政地名标注</div>
               <div class="pl-4 flex flex-col gap-1 border-l border-white/10 ml-1.5">
                 <el-checkbox v-model="mapState.labels.province" @change="updateMapLayers" class="custom-hud-checkbox text-white">省级/直辖市</el-checkbox>
                 <el-checkbox v-model="mapState.labels.city" @change="updateMapLayers" class="custom-hud-checkbox text-white">地级市</el-checkbox>
                 <el-checkbox v-model="mapState.labels.district" @change="updateMapLayers" class="custom-hud-checkbox text-white">区县/街道</el-checkbox>
               </div>
             </div>
             
           </div>
        </div>
      </div>

      <!-- 控制开关按钮 -->
      <div 
        @click="uiState.showLayerControl = !uiState.showLayerControl"
        class="w-[42px] h-[42px] bg-[rgba(10,22,40,0.6)] backdrop-blur-md border border-[#00beff]/40 shadow-[inset_0_0_10px_rgba(0,190,255,0.2)] flex items-center justify-center text-[#00beff] cursor-pointer hover:bg-[#00beff]/20 transition-all rounded-sm"
        title="图层设置"
      >
        <i class="ri-stack-line text-[22px]"></i>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { Search, CaretRight, CaretLeft, ArrowRight, ArrowRightBold, Position, Location, Opportunity, Guide } from '@element-plus/icons-vue'
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'
import { mockWeatherGrids, mockNoFlyZones } from '@/mock/weatherData'

// ---------- Mock Data ----------
const AIRSPACES = [
  { name: 'W类空域 (0-120)', desc: 'class W rspace', icon: 'Position', bounds: [[30.15, 119.95], [30.35, 120.35]] },
  { name: 'G类空域 (120-300)', desc: 'class W rspace', icon: 'Location', bounds: [[30.10, 120.00], [30.40, 120.30]] },
  { name: 'D/E类空域 (300-1000)', desc: 'class W rspace', icon: 'Opportunity', bounds: [[30.05, 119.90], [30.45, 120.40]] },
  { name: 'D/E类空域 (1000-3000)', desc: 'class W rspace', icon: 'Guide', bounds: [[30.00, 119.85], [30.50, 120.45]] },
  { name: 'D类空域 (3000-6000)', desc: 'class W rspace', icon: 'Position', bounds: [[29.95, 119.80], [30.55, 120.50]] }
]

const CORRIDORS = [
  { id: 1, name: 'G56 杭瑞高速(临安段)测试廊道', status: '正常执行', points: [[30.26, 119.98], [30.25, 119.94], [30.24, 119.87], [30.235, 119.80], [30.23, 119.70], [30.23, 119.60]], color: '#adff2f' },
  { id: 2, name: 'G25 长深高速(富阳段)巡检廊道', status: '正常执行', points: [[30.13, 120.08], [30.09, 120.05], [30.05, 119.97], [29.97, 119.92], [29.90, 119.87], [29.82, 119.81]], color: '#adff2f' },
  { id: 3, name: 'S14 杭长高速(径山段)专线廊道', status: '备勤中', points: [[30.35, 120.02], [30.39, 119.98], [30.42, 119.91], [30.46, 119.85], [30.52, 119.77]], color: '#adff2f' },
  { id: 4, name: 'G60 沪昆高速(萧山段)演示廊道', status: '演练中', points: [[30.21, 120.26], [30.18, 120.30], [30.14, 120.34], [30.08, 120.37], [30.02, 120.41]], color: '#adff2f' },
]

const tools = reactive([
  { title: '空间建筑物显隐', icon: 'ri-building-4-line', active: false },
  { title: '避让区设置', icon: 'ri-forbid-line', active: false },
  { title: '起降点显隐', icon: 'ri-map-pin-line', active: false },
  { title: '无人机显隐', icon: 'ri-flight-takeoff-fill', active: false },
  { title: '基站显隐', icon: 'ri-base-station-line', active: false },
  { title: '直升机停机坪', icon: 'ri-hospital-line', active: false },
  { title: '网格化显示', icon: 'ri-grid-line', active: true }
])

// ---------- UI State ----------
const uiState = reactive({
  showAirspace: true,
  showCorridor: true,
  showLayerControl: false,
  showWeather: true
})

// ---------- Weather & Planning State ----------
const weatherState = reactive({
  showTemp: false,
  showRain: false,
  showWind: false,
  showNoFlyZone: false,
  timeOffset: 0,
  isPlaying: false
})

let playbackTimer: ReturnType<typeof setInterval> | null = null

function togglePlayback() {
  weatherState.isPlaying = !weatherState.isPlaying
  if (weatherState.isPlaying) {
    playbackTimer = setInterval(() => {
      weatherState.timeOffset += 3
      if (weatherState.timeOffset > 24) {
        weatherState.timeOffset = 0 // 回到实况循环播放
      }
    }, 1500) // 每隔 1.5 秒自动前进一个切片
  } else {
    if (playbackTimer) {
      clearInterval(playbackTimer)
      playbackTimer = null
    }
  }
}

function formatTimeTooltip(val: number) {
  return val === 0 ? '当前实况' : `未来 ${val} 小时`
}

const mapState = reactive({
  baseLayer: 'satellite', // 'satellite' | 'vector'
  showRoads: true,
  labels: {
    province: true,
    city: true,
    district: false
  }
})

const activeAirspaces = ref<number[]>([])
const corridorVisibility = ref<boolean[]>(CORRIDORS.map(() => true)) 

// ---------- Map Logic ----------
let mapInstance: L.Map | null = null
const airspaceLayers: Record<number, L.Rectangle> = {}
const corridorLayers: Record<number, L.Polyline> = {}
let baseMapLayer: L.TileLayer | null = null
let overlayRoadLayer: L.TileLayer | null = null
let overlayLabelLayer: L.TileLayer | null = null

// 气象动态图层
let nfzLayerGroup: L.LayerGroup | null = null
let weatherCanvasInstance: any = null // 原生扩展 Canvas 图层

// 风场引用与状态
const windCanvasRef = ref<HTMLCanvasElement | null>(null)
let windCtx: CanvasRenderingContext2D | null = null
let windParticles: any[] = []
let windRAF: number | null = null

// 监听气象控制台的状态，触发图层重绘与风场开关
watch(
  () => [weatherState.showTemp, weatherState.showRain, weatherState.showWind, weatherState.showNoFlyZone, weatherState.timeOffset],
  () => {
    updateWeatherCanvas()
  },
  { deep: true }
)

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  stopWindAnimation()
  if (mapInstance) {
    mapInstance.remove()
  }
})

// ========================
// IDW 气象 Canvas 核心类插值渲染引擎 (从高保真原型移植)
// ========================
const WeatherCanvasLayer = (L.Layer as any).extend({
  onAdd: function (map: any) {
    this._map = map
    this._canvas = L.DomUtil.create('canvas', 'leaflet-weather-layer')
    this._canvas.style.position = 'absolute'
    this._canvas.style.pointerEvents = 'none'
    this._canvas.style.zIndex = '400'
    map.getPanes().overlayPane.appendChild(this._canvas)
    map.on('moveend viewreset resize zoomend', this._update, this)
    this._update()
  },
  onRemove: function (map: any) {
    L.DomUtil.remove(this._canvas)
    map.off('moveend viewreset resize zoomend', this._update, this)
  },
  _update: function () {
    if (!this._map) return
    const size = this._map.getSize()
    this._canvas.width = size.x
    this._canvas.height = size.y
    L.DomUtil.setPosition(this._canvas, this._map.containerPointToLayerPoint([0, 0]))
    this.render()
  },
  render: function () {
    const ctx = this._canvas.getContext('2d')
    const W = this._canvas.width, H = this._canvas.height
    ctx.clearRect(0, 0, W, H)

    if (!weatherState.showTemp && !weatherState.showRain) return

    // 采用离屏小图降采样提升插值渲染性能
    const SW = 160, SH = 120
    const offscreen = document.createElement('canvas')
    offscreen.width = SW; offscreen.height = SH
    const octx = offscreen.getContext('2d')!
    const imgData = octx.createImageData(SW, SH)
    const pixels = imgData.data

    const activeGrids = mockWeatherGrids.filter(g => g.timeOffset === weatherState.timeOffset)
    if (activeGrids.length === 0) return

    const gridVals = activeGrids.map(g => ({
      pt: this._map.latLngToContainerPoint([g.lat, g.lng]),
      vals: g
    }))

    for (let py = 0; py < SH; py++) {
      for (let px = 0; px < SW; px++) {
        const cx = (px / SW) * W
        const cy = (py / SH) * H
        
        let tSum = 0, rSum = 0, wTot = 0
        // 反距离权重插值 (IDW)
        for (let i = 0; i < gridVals.length; i++) {
          const gv = gridVals[i]
          const dx = cx - gv.pt.x, dy = cy - gv.pt.y
          const w = 1 / (dx * dx + dy * dy + 0.01)
          tSum += gv.vals.temperature * w
          rSum += gv.vals.precipitation * w
          wTot += w
        }
        
        const temp = tSum / wTot
        const rain = rSum / wTot
        const base = (py * SW + px) * 4

        // 色彩空间融合引擎计算 (RGBA)
        if (weatherState.showTemp && weatherState.showRain) {
          const norm = Math.max(0, Math.min(1, (temp - 10) / 25))
          let rv = norm > 0.5 ? 255 : Math.round(norm * 2 * 120)
          let gv2 = norm < 0.5 ? Math.round(norm * 2 * 210) : Math.round((1 - norm) * 2 * 210)
          let bv = norm < 0.5 ? Math.round(180 + (1 - norm * 2) * 75) : 0
          
          bv = Math.min(255, bv + Math.round(rain * 5))
          rv = Math.max(0, rv - Math.round(rain * 2))
          pixels[base] = rv; pixels[base + 1] = gv2; pixels[base + 2] = bv;
          pixels[base + 3] = Math.round(100 + Math.min(rain, 50) * 2) 
        } else if (weatherState.showTemp) {
          const norm = Math.max(0, Math.min(1, (temp - 10) / 25))
          pixels[base] = norm > 0.5 ? 255 : Math.round(norm * 2 * 120)
          pixels[base + 1] = norm < 0.5 ? Math.round(norm * 2 * 210) : Math.round((1 - norm) * 2 * 210)
          pixels[base + 2] = norm < 0.5 ? Math.round(180 + (1 - norm * 2) * 75) : 0
          pixels[base + 3] = 130
        } else if (weatherState.showRain) {
          pixels[base] = 20; pixels[base + 1] = 90; pixels[base + 2] = 255;
          pixels[base + 3] = Math.min(200, Math.round(rain * 5))
        }
      }
    }

    octx.putImageData(imgData, 0, 0)
    ctx.save()
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.globalAlpha = 0.8
    ctx.drawImage(offscreen, 0, 0, W, H)
    ctx.restore()
  }
})

function initMap() {
  mapInstance = L.map('leaflet-map-container', {
    center: [30.15, 119.95],
    zoom: 11,
    zoomControl: false,
    attributionControl: false
  })

  // 挂载原生徒手图层
  weatherCanvasInstance = new WeatherCanvasLayer()
  weatherCanvasInstance.addTo(mapInstance)
  
  nfzLayerGroup = L.layerGroup().addTo(mapInstance)

  updateMapLayers()
  initLayers()

  // 地图 resize 时触发风场画布更新
  mapInstance.on('resize', () => { resizeWindCanvas() })
  
  updateWeatherCanvas() // 初始渲染一次
}

function updateMapLayers() {
  if (!mapInstance) return

  // 1. 清理现有底层
  if (baseMapLayer) {
    mapInstance.removeLayer(baseMapLayer)
  }
  
  if (mapState.baseLayer === 'satellite') {
    // 卫星图
    baseMapLayer = L.tileLayer('https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {
      subdomains: '1234',
      maxZoom: 18
    }).addTo(mapInstance)
  } else {
    // 标准电子地图
    baseMapLayer = L.tileLayer('https://wprd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}', {
      subdomains: '1234',
      maxZoom: 18
    }).addTo(mapInstance)
  }

  // 2. 清理覆盖层
  if (overlayRoadLayer) {
    mapInstance.removeLayer(overlayRoadLayer)
    overlayRoadLayer = null
  }
  if (overlayLabelLayer) {
    mapInstance.removeLayer(overlayLabelLayer)
    overlayLabelLayer = null
  }

  const anyLabels = mapState.labels.province || mapState.labels.city || mapState.labels.district;

  // 如果是在卫星图模式下并勾选了显示要素，才叠加特定图层
  if (mapState.baseLayer === 'satellite') {
    // 高德瓦片隐藏参数：ltype=11(仅路网)，ltype=4(仅地名)
    if (mapState.showRoads) {
      overlayRoadLayer = L.tileLayer('https://wprd0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=8&ltype=11', {
        subdomains: '1234',
        maxZoom: 18,
        opacity: 0.45,       // [大幅降低透明度]：让细小的白色网状小路在深色卫星图上隐身，只凸显出黄色的主干道和省道
        className: 'de-clutter-road' // 注入 CSS 类用于进一步的滤镜柔化
      }).addTo(mapInstance)
    }

    if (anyLabels) {
      // 在底层瓦片不原生支持高精度行政分离切片的情况下，用 UI 组件实现业务产品表现层交互
      overlayLabelLayer = L.tileLayer('https://wprd0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=8&ltype=4', {
        subdomains: '1234',
        maxZoom: 18,
        opacity: 0.95
      }).addTo(mapInstance)
    }
  }
}

function initLayers() {
  AIRSPACES.forEach((a, i) => {
    const rect = L.rectangle(a.bounds as L.LatLngBoundsExpression, {
      color: '#00beff',
      weight: 2,
      fillColor: '#00beff',
      fillOpacity: 0.1,
      dashArray: '5, 5'
    })
    airspaceLayers[i] = rect
  })

  CORRIDORS.forEach((c, i) => {
    const polyline = L.polyline(c.points as L.LatLngExpression[], {
      color: '#adff2f', // 匹配截图中的亮绿色
      weight: 40, // 设置得非常宽，呈现条带状
      opacity: 0.3, // 半透明
      className: 'tech-corridor'
    })
    
    // 叠加一条中心实线
    const centerLine = L.polyline(c.points as L.LatLngExpression[], {
      color: '#adff2f',
      weight: 4,
      opacity: 0.8
    })
    
    const group = L.layerGroup([polyline, centerLine])
    
    if (corridorVisibility.value[i]) {
      group.addTo(mapInstance!)
    }
    corridorLayers[i] = group as any
  })
}

function toggleAirspace(idx: number) {
  if (!mapInstance) return
  const activeIdx = activeAirspaces.value.indexOf(idx)
  
  if (activeIdx > -1) {
    activeAirspaces.value.splice(activeIdx, 1)
    mapInstance.removeLayer(airspaceLayers[idx])
  } else {
    activeAirspaces.value.push(idx)
    mapInstance.addLayer(airspaceLayers[idx])
    mapInstance.flyToBounds(airspaceLayers[idx].getBounds(), { padding: [50, 50], duration: 0.8 })
  }
}

function updateCorridorVisibility(idx: number) {
  if (!mapInstance) return
  const isVisible = corridorVisibility.value[idx]
  if (isVisible) {
    mapInstance.addLayer(corridorLayers[idx] as any)
  } else {
    mapInstance.removeLayer(corridorLayers[idx] as any)
  }
}

function focusCorridor(idx: number) {
  if (!mapInstance) return
  if (!corridorVisibility.value[idx]) return
  
  // 对于 layerGroup，需要使用内部第一个 layer 去 getBounds()，因 TS 限制简写处理
  const layer = (corridorLayers[idx] as any).getLayers()[0]
  mapInstance.flyToBounds(layer.getBounds(), { padding: [50, 50], duration: 0.8 })
}

// ========================
// 气象交互状态与图层联动分发
// ========================
function updateWeatherCanvas() {
  if (!mapInstance || !nfzLayerGroup) return

  // 1. 刷新 IDW Canvas 云图
  if (weatherCanvasInstance) {
    weatherCanvasInstance._update()
  }

  // 2. 刷新风场动画
  if (weatherState.showWind) {
    startWindAnimation()
  } else {
    stopWindAnimation()
  }

  // 3. 禁飞区渲染 (No-Fly Zones) 专属 Polygon
  nfzLayerGroup.clearLayers()
  if (weatherState.showNoFlyZone) {
    mockNoFlyZones.forEach(nfz => {
      // 检查生效期
      if (weatherState.timeOffset >= nfz.effectiveTimeRange[0] && weatherState.timeOffset <= nfz.effectiveTimeRange[1]) {
        let color = '#ff4d4f' // RED fallback
        if (nfz.level === 'ORANGE') color = '#fa8c16'
        else if (nfz.level === 'YELLOW') color = '#fadb14'

        const polygon = L.polygon(nfz.coordinates as L.LatLngExpression[], {
          color: color, fillColor: color, weight: 2, fillOpacity: 0.25,
          className: `nfz-flash-polygon-${nfz.level.toLowerCase()}`
        })
        
        polygon.bindTooltip(`
          <div class="font-bold text-[14px] flex items-center gap-1" style="color: ${color}; text-shadow: 0 0 5px rgba(0,0,0,0.8);"><i class="ri-error-warning-fill"></i> ${nfz.name}</div>
          <div class="text-[12px] text-white/80 mt-1 border-t border-white/10 pt-1">
            <div><span class="opacity-60">管控时段:</span> 未来 ${nfz.effectiveTimeRange[0]}~${nfz.effectiveTimeRange[1]} 小时内</div>
            <div><span class="opacity-60">受禁机型:</span> ${nfz.restrictedUavTypes.join(', ')}</div>
            <div class="mt-0.5 font-bold" style="color: ${color}"><span class="opacity-60 text-white font-normal">警戒原因:</span> ${nfz.reason}</div>
          </div>
        `, { className: `nfz-custom-tooltip-${nfz.level.toLowerCase()}`, sticky: true })

        nfzLayerGroup!.addLayer(polygon)
      }
    })
  }
}

// ========================
// WEB API 流体风场动画引擎
// ========================
function resizeWindCanvas() {
  if (!windCanvasRef.value) return
  const container = document.getElementById('leaflet-map-container')
  if (container) {
    windCanvasRef.value.width = container.clientWidth
    windCanvasRef.value.height = container.clientHeight
  }
}

function spawnParticles() {
  windParticles = []
  if (!windCanvasRef.value) return
  const W = windCanvasRef.value.width, H = windCanvasRef.value.height
  for (let i = 0; i < 350; i++) {
    windParticles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      age: Math.floor(Math.random() * 80),
      maxAge: 60 + Math.random() * 60
    })
  }
}

// 模拟读取地图点位风向
function getWindAtPoint(px: number, py: number, currentOffset: number) {
  let wdSum = 0, wsSum = 0, wTotal = 0
  const activeGrids = mockWeatherGrids.filter(g => g.timeOffset === currentOffset)
  
  if (activeGrids.length === 0) return { dir: 0, speed: 0 }

  activeGrids.forEach(g => {
    const pt = mapInstance!.latLngToContainerPoint([g.lat, g.lng])
    const dx = px - pt.x, dy = py - pt.y
    const dist = Math.sqrt(dx * dx + dy * dy) + 1
    const w = 1 / (dist * dist)
    // 采用插值方程模拟一个自循环流体场
    const windDir = Math.PI * (0.8 + Math.sin(g.lat * 8) * 0.4 + Math.cos(g.lng * 5) * 0.2)
    const windSpeed = g.windSpeed
    wdSum += windDir * w
    wsSum += windSpeed * w
    wTotal += w
  })
  return { dir: wdSum / wTotal, speed: wsSum / wTotal }
}

function animateWind() {
  if (!windCanvasRef.value || !weatherState.showWind) return
  const W = windCanvasRef.value.width, H = windCanvasRef.value.height
  if (!windCtx) windCtx = windCanvasRef.value.getContext('2d')
  if (!windCtx) return

  // 关键：基于 destination-out 的拖尾擦除算法
  windCtx.save()
  windCtx.globalCompositeOperation = 'destination-out'
  windCtx.fillStyle = 'rgba(0, 0, 0, 0.20)' // 决定拖尾长度，越小越长
  windCtx.fillRect(0, 0, W, H)
  windCtx.restore()

  windParticles.forEach(p => {
    const { dir, speed } = getWindAtPoint(p.x, p.y, weatherState.timeOffset)
    const vx = Math.cos(dir) * speed * 0.5
    const vy = Math.sin(dir) * speed * 0.5

    const lifeRatio = 1 - p.age / p.maxAge
    // 色阶计算：风速越大趋于白色/黄色，慢则趋于青蓝
    const spd = Math.min(1, speed / 12)
    const sr = Math.round(100 + spd * 155)
    const sg = Math.round(220 - spd * 40)
    const sb = Math.round(255 - spd * 150)
    const alpha = Math.min(0.9, lifeRatio * 1.5)

    windCtx!.beginPath()
    windCtx!.moveTo(p.x, p.y)
    p.x += vx
    p.y += vy
    windCtx!.lineTo(p.x, p.y)
    windCtx!.strokeStyle = `rgba(${sr},${sg},${sb},${alpha})`
    windCtx!.lineWidth = 2.0
    windCtx!.stroke()

    p.age++
    if (p.age > p.maxAge || p.x < 0 || p.x > W || p.y < 0 || p.y > H) {
      p.x = Math.random() * W
      p.y = Math.random() * H
      p.age = 0
      p.maxAge = 60 + Math.random() * 60
    }
  })

  windRAF = requestAnimationFrame(animateWind)
}

function startWindAnimation() {
  if (windRAF) return
  resizeWindCanvas()
  if (windParticles.length === 0) spawnParticles()
  animateWind()
}

function stopWindAnimation() {
  if (windRAF) {
    cancelAnimationFrame(windRAF)
    windRAF = null
  }
  if (windCanvasRef.value && windCtx) {
    windCtx.clearRect(0, 0, windCanvasRef.value.width, windCanvasRef.value.height)
  }
}

function toggleTool(tool: any) {
  tool.active = !tool.active
}
</script>

<style scoped>
/* ========== HUD 核心面板样式 ========== */
.hud-panel {
  background: rgba(10, 22, 40, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 190, 255, 0.25);
  box-shadow: inset 0 0 15px rgba(0, 190, 255, 0.1), 0 4px 15px rgba(0,0,0,0.3);
}

/* 科技感标题头 */
.panel-header {
  border-bottom: 1px solid rgba(0, 190, 255, 0.3);
  padding: 10px;
  cursor: pointer;
  background: linear-gradient(to right, rgba(0,190,255,0.05), transparent);
}

.title-tech {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 600;
  font-size: 14px;
}

.title-tech .bracket {
  color: #00beff;
  font-size: 14px;
}
.title-tech .arrow {
  color: #00beff;
  font-size: 12px;
  opacity: 0.8;
}
.title-tech .text {
  color: #fff;
  letter-spacing: 1px;
  text-shadow: 0 0 5px rgba(0,190,255,0.8);
}

/* 定制复选框在暗黑模式下的表现 */
:deep(.custom-hud-checkbox .el-checkbox__inner) {
  background-color: transparent;
  border: 1px solid rgba(255,255,255,0.4);
  width: 14px;
  height: 14px;
}
:deep(.custom-hud-checkbox.is-checked .el-checkbox__inner) {
  background-color: transparent;
  border-color: #00beff;
}
:deep(.custom-hud-checkbox.is-checked .el-checkbox__inner::after) {
  border-color: #00beff;
}
:deep(.custom-hud-checkbox:hover .el-checkbox__inner) {
  border-color: #00beff;
}

/* 保证单选框和复选框文字颜色 */
:deep(.custom-hud-radio .el-radio__label),
:deep(.custom-hud-checkbox .el-checkbox__label) {
  color: rgba(255, 255, 255, 0.7);
}
:deep(.custom-hud-radio .el-radio__input.is-checked + .el-radio__label),
:deep(.custom-hud-checkbox .el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #00beff;
}
/* 暗黑系单选圆圈 */
:deep(.custom-hud-radio .el-radio__inner) {
  background-color: transparent;
  border-color: rgba(255,255,255,0.4);
}
:deep(.custom-hud-radio .el-radio__input.is-checked .el-radio__inner) {
  background-color: transparent;
  border-color: #00beff;
}
:deep(.custom-hud-radio .el-radio__inner::after) {
  background-color: #00beff;
}

/* 右下角工具栏异形处理 (模拟左右切角) */
.tool-bar-tech {
  clip-path: polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 10px);
}

/* 自定义暗黑系滚动条 */
.custom-scrollbar::-webkit-scrollbar {
  width: 2px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 190, 255, 0.4);
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

/* ========== Leaflet 注入层覆盖 ========== */
:deep(.leaflet-container) {
  background: #0a1628;
}

/* 廊道呼吸光效 */
@keyframes corridorPulse {
  0% { opacity: 0.3; }
  50% { opacity: 0.6; }
  100% { opacity: 0.3; }
}
:deep(.tech-corridor) {
  animation: corridorPulse 3s ease-in-out infinite;
}

/* 弱化小路网干扰，增加对比度让粗的黄/橙色主干道凸显，白色细线被暗化 */
:deep(.de-clutter-road) {
  filter: contrast(1.5) brightness(0.8) sepia(0.2) hue-rotate(-10deg);
}

/* ================= 气象态势组件定制样式 ================= */
.custom-danger-switch { --el-switch-on-color: #ff4d4f; }

/* 玻璃态时间轴滑动条深度定制 */
:deep(.custom-dark-slider .el-slider__runway) {
  background-color: rgba(255, 255, 255, 0.1);
  height: 4px;
}
:deep(.custom-dark-slider .el-slider__bar) {
  background: linear-gradient(90deg, #00beff, #0077ff);
  height: 4px;
}
:deep(.custom-dark-slider .el-slider__button) {
  border: 2px solid #00beff;
  background-color: #0a1628;
  box-shadow: 0 0 10px rgba(0, 190, 255, 0.8), inset 0 0 5px rgba(0, 190, 255, 0.5);
  width: 16px;
  height: 16px;
}
:deep(.custom-dark-slider .el-slider__stop) {
  background-color: rgba(255, 255, 255, 0.3);
  width: 4px;
  height: 4px;
}

/* ================== 气象多级级禁飞渲染特效 ================== */
:deep(.nfz-flash-polygon-red), 
:deep(.nfz-flash-polygon-orange), 
:deep(.nfz-flash-polygon-yellow) {
  stroke-dasharray: 8 8;
  fill-opacity: 0.35;
}

/* Tooltip 基础重写 */
:deep(.nfz-custom-tooltip-red),
:deep(.nfz-custom-tooltip-orange),
:deep(.nfz-custom-tooltip-yellow) {
  background: rgba(10, 22, 40, 0.85);
  backdrop-filter: blur(8px);
  border-radius: 6px;
  padding: 10px;
}

/* Red */
:deep(.nfz-custom-tooltip-red) {
  border: 1px solid rgba(255, 77, 79, 0.6);
  box-shadow: 0 4px 15px rgba(0,0,0,0.5), inset 0 0 10px rgba(255,77,79,0.1);
}
:deep(.nfz-custom-tooltip-red)::before { border-top-color: rgba(255, 77, 79, 0.6); }

/* Orange */
:deep(.nfz-custom-tooltip-orange) {
  border: 1px solid rgba(250, 140, 22, 0.6);
  box-shadow: 0 4px 15px rgba(0,0,0,0.5), inset 0 0 10px rgba(250, 140, 22, 0.1);
}
:deep(.nfz-custom-tooltip-orange)::before { border-top-color: rgba(250, 140, 22, 0.6); }

/* Yellow */
:deep(.nfz-custom-tooltip-yellow) {
  border: 1px solid rgba(250, 219, 20, 0.6);
  box-shadow: 0 4px 15px rgba(0,0,0,0.5), inset 0 0 10px rgba(250, 219, 20, 0.1);
}
:deep(.nfz-custom-tooltip-yellow)::before { border-top-color: rgba(250, 219, 20, 0.6); }

/* 网格隐藏边框透穿的纯文字悬浮 */
:deep(.temp-custom-tooltip) {
  background: transparent;
  border: none;
  box-shadow: none;
  color: #fff;
  font-weight: 900;
  font-size: 13px;
  text-shadow: 0 0 4px #000, 0 0 8px #000;
}
:deep(.temp-custom-tooltip::before) {
  display: none;
}
</style>
