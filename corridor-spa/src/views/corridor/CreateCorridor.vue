<template>
  <div class="create-corridor-wrapper relative w-full h-full overflow-hidden bg-[#0a1628]">
    <!-- 地图底层容器 -->
    <div id="create-map-container" class="absolute inset-0 z-0"></div>

    <!-- 右上角悬浮搜索栏 -->
    <div class="absolute top-6 right-6 z-10 flex items-center w-[300px] h-[36px] bg-[rgba(10,22,40,0.6)] backdrop-blur-md border border-[#00beff]/40 shadow-[inset_0_0_10px_rgba(0,190,255,0.2)]">
      <input type="text" placeholder="搜索位置、航线、起降点" class="flex-1 h-full px-4 text-[13px] bg-transparent text-white border-none outline-none placeholder-[rgba(255,255,255,0.5)]" />
      <div class="w-10 h-full flex flex-col items-center justify-center text-[#00beff] cursor-pointer hover:bg-[#00beff]/20 transition">
        <i class="ri-search-line text-[16px]"></i>
      </div>
    </div>

    <!-- 左侧固定的暗黑风格配置面板 -->
    <div class="left-panel absolute left-0 top-0 bottom-0 w-[320px] bg-[#0c182a] border-r border-[#1a2f4c] shadow-[4px_0_15px_rgba(0,0,0,0.4)] z-10 flex flex-col">
      
      <!-- Panel Header -->
      <div class="panel-header h-[50px] border-b border-[#1a2f4c] flex items-center px-4">
        <div class="w-7 h-7 flex items-center justify-center cursor-pointer text-white/70 hover:text-white transition rounded hover:bg-white/10" @click="goBack">
          <el-icon class="text-[18px]"><ArrowLeft /></el-icon>
        </div>
        <div class="flex flex-1 items-center justify-center mr-7">
          <i class="ri-file-list-3-line text-[#00beff] text-[20px]"></i>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex h-[40px] mt-4 px-4 gap-2 border-b border-transparent">
        <div class="flex-1 flex items-center justify-center rounded-sm bg-[#162d50] text-[#00beff] text-[14px] font-medium cursor-pointer shadow-[inset_0_0_10px_rgba(0,190,255,0.2)] border border-[#00beff]/30">
          廊道信息
        </div>
        <div class="flex-1 flex items-center justify-center rounded-sm bg-transparent text-white/50 text-[14px] cursor-pointer hover:text-white/80 transition">
          廊道层信息
        </div>
      </div>

      <!-- Form Area -->
      <div class="panel-body flex-1 overflow-y-auto px-5 py-6 custom-scrollbar">
        <el-form label-position="top" size="small" class="dark-form">
          
          <el-form-item label="廊道名称" required>
            <el-input v-model="formData.name" placeholder="请输入廊道名称" class="dark-input" />
          </el-form-item>

          <el-form-item label="高度范围" required>
            <el-input v-model="formData.height" placeholder="6000" class="dark-input">
              <template #append>m</template>
            </el-input>
          </el-form-item>

          <el-form-item label="廊道方向" required>
            <div class="flex items-center gap-2 w-full">
               <el-select v-model="formData.directionStart" placeholder="起点" class="dark-select w-[100px]">
                 <el-option label="起点" value="start" />
               </el-select>
               <span class="text-[#00beff] font-bold">→</span>
               <el-select v-model="formData.directionEnd" placeholder="终点" class="dark-select flex-1">
                 <el-option label="终点" value="end" />
               </el-select>
            </div>
          </el-form-item>

          <el-form-item label="廊道扩展方向" required>
            <el-radio-group v-model="formData.expansion" class="dark-radio-group w-full flex">
               <el-radio label="left" class="flex-1">左侧</el-radio>
               <el-radio label="right" class="flex-1">右侧</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- Notification Help -->
          <div v-if="drawnPoints.length === 0" class="text-[12px] text-[#00beff]/80 bg-[#00beff]/10 border border-[#00beff]/20 p-2 rounded mb-4 mt-2 flex items-center gap-2">
            <i class="ri-information-line"></i> 在地图上点击绘制中心线控制点
          </div>

          <el-form-item label="廊道展示颜色">
             <div class="color-picker-grid">
               <div v-for="(color, index) in standardColors" :key="index" 
                    class="color-block flex items-center justify-center cursor-pointer transition-transform hover:scale-110" 
                    :style="{ backgroundColor: color }"
                    :class="{ 'ring-2 ring-white': formData.color === color }"
                    @click="formData.color = color">
                  <el-icon v-if="formData.color === color" class="text-white text-[12px] mix-blend-difference"><Check /></el-icon>
               </div>
             </div>
             <div class="text-[#e6a23c] text-[12px] w-full text-center mt-2 opacity-80">请先完成廊道创建后再选择颜色</div>
          </el-form-item>

          <el-form-item label="备注">
             <div class="relative w-full">
               <el-input v-model="formData.remark" type="textarea" :rows="4" placeholder="请输入备注信息" resize="none" class="dark-textarea" maxlength="200" />
               <span class="absolute bottom-2 right-2 text-[12px] text-white/30">{{ formData.remark.length }} / 200</span>
             </div>
          </el-form-item>

        </el-form>
      </div>

      <!-- Panel Footer -->
      <div class="panel-footer h-[70px] border-t border-[#1a2f4c] flex items-center justify-center px-4">
        <el-button class="custom-btn-submit flex-1 h-[36px]" @click="submitCreate">完成廊道创建</el-button>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Check } from '@element-plus/icons-vue'
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'

const router = useRouter()

const formData = reactive({
  name: '',
  height: '6000',
  directionStart: '',
  directionEnd: '',
  expansion: 'left',
  color: '#4caf50',
  remark: ''
})

const standardColors = [
  '#4caf50', '#673ab7', '#1976d2', '#00bcd4', '#9c27b0', '#cddc39', '#8bc34a', '#3f51b5'
]

function goBack() {
  router.push('/corridor/maintenance')
}

// ========== Map Integration & Drawing Logic ==========
let mapInstance: L.Map | null = null
let drawingLayer: L.FeatureGroup | null = null
let currentPolyline: L.Polyline | null = null

const drawnPoints = ref<L.LatLng[]>([])

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (mapInstance) {
    mapInstance.remove()
  }
})

function initMap() {
  mapInstance = L.map('create-map-container', {
    center: [30.2, 119.9],
    zoom: 11,
    zoomControl: false,
    attributionControl: false
  })

  // Set the map cursor specifically for drawing using leaflet internal class or style
  mapInstance.getContainer().style.cursor = 'crosshair';

  // Base Satellite Map
  L.tileLayer('https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {
    subdomains: '1234',
    maxZoom: 18
  }).addTo(mapInstance)

  // Overlay Default Roads
  L.tileLayer('https://wprd0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=8&ltype=11', {
    subdomains: '1234',
    maxZoom: 18,
    opacity: 0.6
  }).addTo(mapInstance)

  // Labels
  L.tileLayer('https://wprd0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=8&ltype=4', {
    subdomains: '1234',
    maxZoom: 18,
    opacity: 0.95
  }).addTo(mapInstance)

  // Initialize Drawing Layer Group
  drawingLayer = new L.FeatureGroup()
  mapInstance.addLayer(drawingLayer)

  // Map Click Event to Draw Polyline
  mapInstance.on('click', onMapClick)
  
  // Right click to undo last point
  mapInstance.on('contextmenu', (e) => {
    if (drawnPoints.value.length > 0) {
      drawnPoints.value.pop()
      updateDrawing()
    }
  })
}

function onMapClick(e: L.LeafletMouseEvent) {
  if (drawnPoints.value.length >= 20) return // Limit max points for demo
  drawnPoints.value.push(e.latlng)
  updateDrawing()
}

function updateDrawing() {
  if (!drawingLayer) return
  drawingLayer.clearLayers()

  if (drawnPoints.value.length > 0) {
    // Draw the active line
    currentPolyline = L.polyline(drawnPoints.value, {
      color: formData.color,
      weight: 6,
      opacity: 0.8,
      dashArray: '10, 10' // Active drawing style
    })
    drawingLayer.addLayer(currentPolyline)

    // Draw the corridor expansion (buffer visualization concept)
    const expansionPolyline = L.polyline(drawnPoints.value, {
      color: formData.color,
      weight: 40,
      opacity: 0.2
    })
    drawingLayer.addLayer(expansionPolyline)

    // Draw markers for all points
    drawnPoints.value.forEach((latlng, idx) => {
      const isStart = idx === 0
      const isEnd = idx === drawnPoints.value.length - 1 && drawnPoints.value.length > 1
      
      const markerOptions: L.CircleMarkerOptions = {
        radius: 6,
        color: isStart ? '#ffffff' : (isEnd ? '#00beff' : formData.color),
        fillColor: isStart ? '#ff4d4f' : formData.color,
        fillOpacity: 1,
        weight: 2
      }
      drawingLayer!.addLayer(L.circleMarker(latlng, markerOptions))
    })
  }
}

function submitCreate() {
  if (!formData.name) return
  if (drawnPoints.value.length < 2) return
  
  // Mock save API...
  console.log('Saved Corridor:', formData, drawnPoints.value)
  goBack()
}
</script>

<style scoped>
/* ========== Form Styling Overrides (Dark Theme) ========== */
.dark-form :deep(.el-form-item__label) {
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  padding-bottom: 2px !important;
}
.dark-form :deep(.el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before) {
  color: #ff4d4f;
}

/* Inputs & Textareas */
:deep(.dark-input .el-input__wrapper),
:deep(.dark-textarea .el-textarea__inner) {
  background-color: #122238;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.2) !important;
  color: #fff;
}
:deep(.dark-input .el-input__wrapper:hover),
:deep(.dark-input .el-input__wrapper.is-focus),
:deep(.dark-textarea .el-textarea__inner:hover),
:deep(.dark-textarea .el-textarea__inner:focus) {
  border-color: #00beff !important;
  box-shadow: inset 0 2px 5px rgba(0,190,255,0.1) !important;
}
:deep(.dark-input .el-input-group__append) {
  background-color: #1a2f4c;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-left: 0;
  color: rgba(255,255,255,0.6);
  padding: 0 12px;
}

/* Selects */
:deep(.dark-select .el-select__wrapper) {
  background-color: #122238;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.2) !important;
}
:deep(.dark-select .el-select__wrapper:hover),
:deep(.dark-select .el-select__wrapper.is-focused) {
  border-color: #00beff !important;
}

/* Radio Group */
:deep(.dark-radio-group .el-radio) {
  margin-right: 0;
}
:deep(.dark-radio-group .el-radio__label) {
  color: rgba(255,255,255,0.7);
}
:deep(.dark-radio-group .el-radio__input.is-checked + .el-radio__label) {
  color: #00beff;
}
:deep(.dark-radio-group .el-radio__inner) {
  background: transparent;
  border-color: rgba(255,255,255,0.3);
}
:deep(.dark-radio-group .el-radio__input.is-checked .el-radio__inner) {
  background: transparent;
  border-color: #00beff;
}
:deep(.dark-radio-group .el-radio__inner::after) {
  background-color: #00beff;
}

/* Color Picker Grid */
.color-picker-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  width: 100%;
}
.color-block {
  height: 24px;
  border-radius: 4px;
}

/* Submit Button */
.custom-btn-submit {
  background: #14355a !important;
  color: #fff !important;
  border: 1px solid rgba(0, 190, 255, 0.3) !important;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.3s;
  box-shadow: inset 0 0 10px rgba(0, 190, 255, 0.1);
}
.custom-btn-submit:hover {
  background: rgba(0, 190, 255, 0.2) !important;
  border-color: rgba(0, 190, 255, 0.6) !important;
  box-shadow: inset 0 0 15px rgba(0, 190, 255, 0.3);
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
</style>
