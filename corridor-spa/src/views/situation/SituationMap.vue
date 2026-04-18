<template>
  <div class="situation-map-wrapper relative w-full h-full bg-[#0a1628] overflow-hidden">
    <!-- 地图底层容器 -->
    <div id="leaflet-map-container" class="absolute inset-0 z-0"></div>

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
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { Search, CaretRight, CaretLeft, ArrowRight, ArrowRightBold, Position, Location, Opportunity, Guide } from '@element-plus/icons-vue'
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'

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
  showLayerControl: false
})

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

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (mapInstance) {
    mapInstance.remove()
  }
})

function initMap() {
  mapInstance = L.map('leaflet-map-container', {
    center: [30.15, 119.95],
    zoom: 11,
    zoomControl: false,
    attributionControl: false
  })

  updateMapLayers()
  initLayers()
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
</style>
