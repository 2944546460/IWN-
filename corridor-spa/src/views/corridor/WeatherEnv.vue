<template>
  <div class="weather-env-container h-full p-5 bg-[#f0f2f5] box-border flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <div class="text-[20px] font-bold text-gray-800 flex items-center gap-2">
        <i class="ri-cloud-windy-line text-[#1890ff] text-[24px]"></i>
        气象数据与预警分析中枢
      </div>
      <el-tag type="success" effect="dark" size="large" class="shadow-sm">
        <i class="ri-pulse-line mr-1"></i> 彩云天气综合接口 (v2.6) 链路畅通
      </el-tag>
    </div>

    <!-- 核心业务标签页 -->
    <el-card class="flex-1 overflow-hidden rounded-lg shadow-sm border-0 weather-card" :body-style="{ padding: '0px', height: '100%', display: 'flex', flexDirection: 'column' }">
      <el-tabs v-model="activeTab" class="w-full h-full custom-tabs">
        
        <!-- ================= TAB 1: 外部气象打点拉取 ================= -->
        <el-tab-pane label="API 气象实况与预报池" name="api_sync" class="h-full flex flex-col box-border px-5 pb-5">
          <div class="flex justify-between items-center py-4">
            <div class="flex gap-6">
              <div class="flex flex-col">
                <span class="text-gray-500 text-xs mb-1">最近一次同步</span>
                <span class="text-gray-800 font-bold font-mono">2026-04-20 10:00:00</span>
              </div>
              <div class="flex flex-col">
                <span class="text-gray-500 text-xs mb-1">距离下次拉取 (Cron)</span>
                <span class="text-[#1890ff] font-bold font-mono">14 分 21 秒</span>
              </div>
              <div class="flex flex-col">
                <span class="text-gray-500 text-xs mb-1">本次解析入库切片数量</span>
                <span class="text-green-600 font-bold font-mono">1,024 条</span>
              </div>
            </div>
            <el-button type="primary" :icon="RefreshRight" :loading="isSyncing" @click="handleManualSync">
              手动同步网格气象
            </el-button>
          </div>

          <el-table :data="gridForecastData" class="flex-1" border stripe height="100%">
            <el-table-column prop="gridId" label="网格编号" width="160" show-overflow-tooltip/>
            <el-table-column prop="forecastTime" label="预测时间片" width="160" />
            <el-table-column label="位置坐标" width="160">
              <template #default="{ row }">E{{ row.lng }}, N{{ row.lat }}</template>
            </el-table-column>
            <el-table-column label="大气温度" min-width="100">
              <template #default="{ row }">
                <span :class="row.temperature < 0 ? 'text-blue-500' : 'text-orange-500'">{{ row.temperature }} ℃</span>
              </template>
            </el-table-column>
            <el-table-column label="降水强度" min-width="120">
              <template #default="{ row }">
                <span :class="row.precipitation > 10 ? 'text-blue-600 font-bold' : 'text-gray-600'">{{ row.precipitation }} mm/h</span>
              </template>
            </el-table-column>
            <el-table-column label="阵风风速" min-width="120">
              <template #default="{ row }">
                <span :class="row.windSpeed > 10 ? 'text-red-500 font-bold' : 'text-gray-600'">{{ row.windSpeed }} m/s</span>
              </template>
            </el-table-column>
            <el-table-column label="能见度" min-width="100">
              <template #default="{ row }">
                <span :class="row.visibility < 3 ? 'text-yellow-600 font-bold' : 'text-gray-600'">{{ row.visibility }} km</span>
              </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="更新抓取时间" width="160" />
          </el-table>
          
          <div class="mt-4 flex justify-end">
             <el-pagination layout="total, prev, pager, next" :total="1024" />
          </div>
        </el-tab-pane>

        <!-- ================= TAB 2: 无人机预警分级规则库 ================= -->
        <el-tab-pane label="机型气象阈值管控规则" name="rules_config" class="h-full flex flex-col box-border px-5 pb-5">
          <div class="flex justify-between items-center py-4">
            <el-alert title="提示：在此配置不同型号无人机的飞行气象极限，系统将以此为依据在后台自动划定禁飞区。" type="info" show-icon :closable="false" class="w-auto m-0 py-2 bg-blue-50 !text-blue-600" />
            <el-button type="primary" :icon="Plus" @click="dialogVisible = true">新增预警规则</el-button>
          </div>

          <el-table :data="weatherRulesData" class="flex-1" border height="100%">
            <el-table-column prop="uavCategory" label="适用机型型号" width="180">
              <template #default="{ row }">
                <el-tag size="default" effect="plain">{{ row.uavCategory }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="判断条件 (条件式)" min-width="200">
              <template #default="{ row }">
                <div class="bg-gray-100 px-3 py-1.5 rounded-sm font-mono text-sm inline-block border border-gray-200">
                  <span class="text-blue-600 font-bold">{{ row.metricType }}</span>
                  <span class="mx-2 text-gray-500">{{ row.operator }}</span>
                  <span class="text-orange-500 font-bold">{{ row.thresholdValue }}</span>
                  <span class="text-gray-400 text-xs ml-1">{{ getMetricUnit(row.metricType) }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="severityLevel" label="触发预警等级" width="140" align="center">
              <template #default="{ row }">
                <div :class="[
                  'px-3 py-1 rounded-full text-xs font-bold w-[90px] mx-auto',
                  row.severityLevel === 'RED' ? 'bg-red-100 text-red-600 border border-red-200' :
                  row.severityLevel === 'ORANGE' ? 'bg-orange-100 text-orange-600 border border-orange-200' :
                  'bg-yellow-100 text-yellow-600 border border-yellow-200'
                ]">
                  {{ row.severityLevel }} 管制
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="reasonTemplate" label="阻断提示模板" min-width="280" show-overflow-tooltip />
            <el-table-column label="操作" width="150" align="center" fixed="right">
              <template #default>
                <el-button type="primary" link size="small"><i class="ri-edit-line mr-1"></i>编辑</el-button>
                <el-button type="danger" link size="small"><i class="ri-delete-bin-line mr-1"></i>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- ================= TAB 3: 自动化生成引擎黑名单输出 ================= -->
        <el-tab-pane label="自动化空间推演结果池" name="nfz_engine" class="h-full flex flex-col box-border px-5 pb-5">
           <div class="flex justify-between items-center py-4">
            <el-alert title="状态：空间推演引擎持续运行中。每当网格气象更新，系统将自动依据阈值规则执行空间求交，输出受影响的物理廊道段。" type="success" show-icon :closable="false" class="w-auto m-0 py-2 bg-green-50 !text-green-600" />
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <i class="ri-loader-4-line animate-spin text-green-500 text-lg"></i>
              引擎挂轨侦听中
            </div>
          </div>
          
          <el-table :data="dynamicNfzData" class="flex-1" border height="100%">
            <el-table-column prop="name" label="受损廊道段名称" min-width="220" show-overflow-tooltip>
               <template #default="{ row }">
                  <span class="font-bold text-gray-700">{{ row.name }}</span>
               </template>
            </el-table-column>
            <el-table-column prop="level" label="管控等级" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="row.level === 'RED' ? 'danger' : row.level === 'ORANGE' ? 'warning' : 'info'" effect="dark">{{ row.level }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="预测生效时间段" width="180">
              <template #default="{ row }">
                 <div class="text-xs">
                   <div class="text-red-500">起: {{ row.startTime }}</div>
                   <div class="text-green-600">止: {{ row.endTime }}</div>
                 </div>
              </template>
            </el-table-column>
            <el-table-column label="阻断机型标签" min-width="180">
              <template #default="{ row }">
                <div class="flex flex-wrap gap-1">
                  <el-tag v-for="tag in row.restrictedTypes" :key="tag" size="small" type="info">{{ tag }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="reasons" label="触发诱因溯源" min-width="260" show-overflow-tooltip>
               <template #default="{ row }">
                 <span class="text-gray-500 text-xs">{{ row.reasons }}</span>
               </template>
            </el-table-column>
            <el-table-column prop="status" label="推演状态" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="row.status === 'ACTIVE' ? 'success' : 'info'" size="small">
                  {{ row.status === 'ACTIVE' ? '生效中' : '已过期' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

      </el-tabs>
    </el-card>

    <!-- 新增规则弹窗 -->
    <el-dialog v-model="dialogVisible" title="新增无人机阈值管控制度" width="600px" custom-class="weather-env-dialog" :close-on-click-modal="false">
      <el-form label-position="right" label-width="120px" class="mt-4">
        <el-form-item label="监控机型分类">
          <el-select class="w-full" placeholder="请选择适用机型大类">
            <el-option label="Micro_Quadcopter (微型四旋翼)" value="micro" />
            <el-option label="DJI_M300 (大疆M300系列)" value="dji" />
            <el-option label="FixedWing_Light (轻小固定翼)" value="fixedwing" />
            <el-option label="ALL (全境所有无人机)" value="all" />
          </el-select>
        </el-form-item>
        
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="探测物理量">
              <el-select class="w-full">
                <el-option label="阵风风速 (m/s)" value="wind" />
                <el-option label="降水量 (mm/h)" value="rain" />
                <el-option label="能见度 (km)" value="vis" />
                <el-option label="最低温度 (℃)" value="temp" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="条件符" label-width="70px">
              <el-select class="w-full">
                <el-option label=">" value=">" />
                <el-option label="<" value="<" />
                <el-option label=">=" value=">=" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预警阈值" label-width="80px">
              <el-input-number class="w-full" :controls="false" placeholder="如 12" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="阻断界定级别">
           <el-radio-group>
            <el-radio-button label="RED">🟥 RED绝对禁飞</el-radio-button>
            <el-radio-button label="ORANGE">🟧 ORANGE管制</el-radio-button>
            <el-radio-button label="YELLOW">🟨 YELLOW预警</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="拦截话术模板">
          <el-input type="textarea" :rows="3" placeholder="系统触发该配置时用于阻断工单和前台预警的话术模板，支持 {val} 变量占位..." />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false">保存推演规则</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RefreshRight, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('api_sync')
const isSyncing = ref(false)
const dialogVisible = ref(false)

const handleManualSync = () => {
  isSyncing.value = true
  ElMessage.warning('正在拉取并解析彩云 API 综合气象接口...')
  setTimeout(() => {
    isSyncing.value = false
    ElMessage.success('数据拉取入库成功！空间解算推演已自动完成。')
  }, 1500)
}

function getMetricUnit(type: string) {
  const map: Record<string, string> = {
    'WIND_SPEED': 'm/s',
    'PRECIPITATION': 'mm/h',
    'VISIBILITY': 'km',
    'TEMPERATURE': '℃'
  }
  return map[type] || ''
}

// 模拟表 1: t_weather_grid_forecast
const gridForecastData = ref([
  { gridId: 'GRID_E119.8_N30.2', forecastTime: '2026-04-20 12:00:00', lng: 119.85, lat: 30.21, temperature: 28.5, precipitation: 32.4, windSpeed: 14.5, visibility: 0.8, updateTime: '2026-04-20 10:00:00' },
  { gridId: 'GRID_E119.7_N30.2', forecastTime: '2026-04-20 12:00:00', lng: 119.72, lat: 30.26, temperature: 26.1, precipitation: 18.0, windSpeed: 8.2, visibility: 4.5, updateTime: '2026-04-20 10:00:00' },
  { gridId: 'GRID_E119.9_N30.0', forecastTime: '2026-04-20 15:00:00', lng: 119.95, lat: 30.05, temperature: 22.4, precipitation: 0.0, windSpeed: 19.8, visibility: 12.0, updateTime: '2026-04-20 10:00:00' },
  { gridId: 'GRID_E120.0_N30.4', forecastTime: '2026-04-20 18:00:00', lng: 120.03, lat: 30.44, temperature: 18.9, precipitation: 5.6, windSpeed: 3.4, visibility: 2.1, updateTime: '2026-04-20 10:00:00' }
])

// 模拟表 2: t_uav_weather_rule
const weatherRulesData = ref([
  { uavCategory: 'Micro_Quadcopter', metricType: 'WIND_SPEED', operator: '>=', thresholdValue: '8.0', severityLevel: 'ORANGE', reasonTemplate: '微型机抗风测试不合格，预测风速达 {val}m/s' },
  { uavCategory: 'Micro_Quadcopter', metricType: 'WIND_SPEED', operator: '>', thresholdValue: '12.0', severityLevel: 'RED', reasonTemplate: '极端流控，风速>{val}m/s 突破毁损边际' },
  { uavCategory: 'DJI_M300', metricType: 'WIND_SPEED', operator: '>=', thresholdValue: '18.0', severityLevel: 'RED', reasonTemplate: '工业无人机安全阈值熔断，台风级大风拦截' },
  { uavCategory: 'ALL', metricType: 'VISIBILITY', operator: '<', thresholdValue: '1.0', severityLevel: 'RED', reasonTemplate: '极低能见度，无盲降设备强行阻断起飞！' },
  { uavCategory: 'Micro_Quadcopter', metricType: 'PRECIPITATION', operator: '>', thresholdValue: '5.0', severityLevel: 'YELLOW', reasonTemplate: '中等降雨，微型机云台有进水短路风险' }
])

// 模拟表 3: t_dynamic_nfz_pool
const dynamicNfzData = ref([
  { name: 'G56 杭瑞高速廊道(西延段) 强对流红区', level: 'RED', startTime: '2026-04-20 12:00:00', endTime: '2026-04-20 16:00:00', restrictedTypes: ['ALL'], reasons: '极低能见度，无盲降设备强行阻断起飞！\n极端流控，风速>14.5m/s 突破毁损边际', status: 'ACTIVE' },
  { name: 'G25 长深高速廊道(富春江段) 横风橙区', level: 'ORANGE', startTime: '2026-04-20 10:00:00', endTime: '2026-04-21 10:00:00', restrictedTypes: ['Micro_Quadcopter', 'FixedWing_Light', 'DJI'], reasons: '山谷过境强横风：峡谷风扰流截断航线，仅限重工业机', status: 'ACTIVE' },
  { name: 'S14 杭长高速廊道(径山段) 降雨黄区', level: 'YELLOW', startTime: '2026-04-20 16:00:00', endTime: '2026-04-20 22:00:00', restrictedTypes: ['Micro_Quadcopter'], reasons: '中等降雨，微型机无防水模块', status: 'ACTIVE' }
])
</script>

<style scoped>
/* 深度干预 tabs 内部样式，实现全高充满 */
:deep(.weather-card .el-card__body) {
  display: flex;
  flex-direction: column;
}
:deep(.custom-tabs) {
  display: flex;
  flex-direction: column;
  height: 100%;
}
:deep(.custom-tabs .el-tabs__header) {
  margin: 0;
  padding: 0 20px;
  background-color: #fcfcfc;
  border-bottom: 1px solid #eef0f4;
}
:deep(.custom-tabs .el-tabs__content) {
  flex: 1;
  overflow: hidden;
  padding-top: 1px;
}
:deep(.custom-tabs .el-tabs__nav-wrap::after) {
  display: none;
}
:deep(.custom-tabs .el-tabs__item) {
  font-size: 15px;
  font-weight: 500;
  color: #606266;
  height: 50px;
  line-height: 50px;
}
:deep(.custom-tabs .el-tabs__item.is-active) {
  color: #1890ff;
  font-weight: bold;
}
:deep(.weather-env-dialog .el-dialog__body) {
  padding-top: 10px;
}
</style>
