<script setup lang="ts">
import { ref } from 'vue'
import {
  Link, CircleCheckFilled, WarningFilled, Key, EditPen, View, RefreshRight, Platform, Checked
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// ---- 顶部状态数据 ----
const healthStatus = ref('online') // online, offline
const lastSync = ref('2026-04-20 14:00:05')
const syncPassedMins = ref(5)
const validGrids = ref('1,240')
const apiQuota = ref({ used: 144, total: 500 })

// ---- API 配置表单数据 ----
const apiConfig = ref({
  provider: '省级专业气象服务平台',
  endpoint: 'https://api.weather.ziang.gov/grid/v1/forecast',
  frequency: '10',
  bbox: 'Lat: 28.5~31.2, Lon: 118.0~123.0'
})

// ---- 气象要素映射状态 ----
const mappings = ref([
  { id: 1, label: '风速风向 (计算自 u10, v10 向量)', status: true },
  { id: 2, label: '地面温度 (t2m)', status: true },
  { id: 3, label: '降水率 (prate)', status: true },
  { id: 4, label: '能见度 (vis)', status: true },
])

// ---- 拉取日志过滤 & 表格数据 ----
const logFilter = ref('all') // all, success, failed

const rawLogData = [
  { id: 1, time: '14:00:00', duration: '1.2s', size: '4.2 MB', status: 'success', message: '解析入库完毕，已更新多级禁飞区' },
  { id: 2, time: '13:50:00', duration: '1.0s', size: '4.2 MB', status: 'success', message: '解析入库完毕，已更新多级禁飞区' },
  { id: 3, time: '13:40:02', duration: '5.4s', size: '0 Bytes', status: 'failed', message: '接口超时/无响应' },
  { id: 4, time: '13:30:00', duration: '1.3s', size: '3.8 MB', status: 'warning', message: '数据格式校验不通过，包含负数风速值' },
  { id: 5, time: '13:20:00', duration: '1.1s', size: '4.2 MB', status: 'success', message: '解析入库完毕，已更新多级禁飞区' },
  { id: 6, time: '13:10:00', duration: '1.2s', size: '4.2 MB', status: 'success', message: '解析入库完毕，已更新多级禁飞区' },
  { id: 7, time: '13:00:01', duration: '3.0s', size: '0 Bytes', status: 'failed', message: '服务商上游无返回' },
]

const logsData = ref([...rawLogData])

// ---- 抽屉相关 ----
const drawerVisible = ref(false)
const drawerContent = ref('')

const sampleJson = `{
  "request_id": "req-9871x789",
  "status": "success",
  "bbox": [118.0, 28.5, 123.0, 31.2],
  "timestamp": "2026-04-20T14:00:00Z",
  "data": [
    {
      "grid_id": "Grid-A02-15",
      "u10": 4.5,
      "v10": 8.1,
      "t2m": 22.4,
      "prate": 0.0,
      "vis": 8000
    }
  ]
}`

// ---- 方法 ----
const handleFilterChange = (val: string) => {
  if (val === 'all') logsData.value = [...rawLogData]
  else if (val === 'success') logsData.value = rawLogData.filter(item => item.status === 'success')
  else if (val === 'failed') logsData.value = rawLogData.filter(item => item.status === 'failed' || item.status === 'warning')
}

const handleViewJson = (row: any) => {
  if (row.status === 'success') {
    drawerContent.value = sampleJson
  } else {
    drawerContent.value = `{\n  "error": "Timeout Error",\n  "message": "${row.message}"\n}`
  }
  drawerVisible.value = true
}

const handleRetry = (row: any) => {
  ElMessage.success(`正在重试拉取任务 (触发时间: ${row.time})...`)
}

const handleSaveConfig = () => {
  ElMessage.success('API 调度配置已保存')
}
</script>

<template>
  <div class="h-full flex flex-col p-6 bg-slate-50 overflow-hidden">
    <!-- 1. 顶部健康指标卡片 -->
    <el-row :gutter="20" class="mb-4 shrink-0">
      <el-col :span="6">
        <el-card shadow="hover" class="h-24 !border-none !rounded-xl relative overflow-hidden bg-white">
          <div class="flex items-center gap-4 h-full px-2">
            <div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl" :class="healthStatus === 'online' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'">
              <i class="ri-pulse-line"></i>
            </div>
            <div>
              <div class="text-sm text-gray-400 mb-1 font-medium">服务连接状态</div>
              <div class="text-lg font-bold" :class="healthStatus === 'online' ? 'text-green-600' : 'text-red-500'">
                <span v-if="healthStatus === 'online'" class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_0_2px_rgba(34,197,94,0.2)] animate-pulse"></span>在线 / 正常运转</span>
                <span v-else class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.2)]"></span>离线 / 连接异常</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="h-24 !border-none !rounded-xl relative overflow-hidden bg-white">
          <div class="flex items-center gap-4 h-full px-2">
            <div class="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-2xl">
              <i class="ri-history-line"></i>
            </div>
            <div>
              <div class="text-sm text-gray-400 mb-1 font-medium">最后同步时间</div>
              <div class="text-lg font-bold text-gray-800">{{ lastSync }}</div>
              <div class="text-xs text-gray-400 mt-0.5">距今已过 <span class="text-orange-500 px-0.5">{{ syncPassedMins }}</span> 分钟</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="h-24 !border-none !rounded-xl relative overflow-hidden bg-white">
          <div class="flex items-center gap-4 h-full px-2">
            <div class="w-12 h-12 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center text-2xl">
              <i class="ri-layout-grid-line"></i>
            </div>
            <div>
              <div class="text-sm text-gray-400 mb-1 font-medium">当前有效网格数</div>
              <div class="text-2xl font-black text-gray-800">{{ validGrids }}<span class="text-sm font-normal text-gray-400 ml-1">个</span></div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="h-24 !border-none !rounded-xl relative overflow-hidden bg-white">
          <div class="flex flex-col justify-center h-full px-2">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-gray-400 font-medium">今日接口调用次数</span>
              <span class="text-lg font-bold text-gray-800">{{ apiQuota.used }} <span class="text-sm text-gray-400 font-normal">/ {{ apiQuota.total }} 次</span></span>
            </div>
            <el-progress :percentage="(apiQuota.used / apiQuota.total) * 100" :show-text="false" stroke-width="8" :color="apiQuota.used > 400 ? '#ef4444' : '#3b82f6'" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 2. 主体区 (左 4 : 右 6) -->
    <el-row :gutter="20" class="flex-1 overflow-hidden">
      <!-- 左侧：表单配置 -->
      <el-col :span="10" class="h-full">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden relative">
          <div class="px-5 py-4 border-b border-gray-100 flex items-center bg-slate-50/50">
            <el-icon class="text-blue-500 mr-2 text-lg"><Platform /></el-icon>
            <h3 class="m-0 font-bold text-gray-800 text-base">高频网格气象服务配置</h3>
          </div>
          
          <div class="p-6 flex-1 overflow-auto">
            <el-form label-position="top" size="large">
              <el-form-item label="服务商名称">
                <el-input v-model="apiConfig.provider" readonly>
                  <template #prefix>
                    <el-icon><Link /></el-icon>
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item label="API Endpoint (请求地址)">
                <el-input v-model="apiConfig.endpoint" type="password" show-password>
                  <template #prefix>
                    <el-icon><Key /></el-icon>
                  </template>
                </el-input>
              </el-form-item>

              <el-row :gutter="16">
                <el-col :span="12">
                  <el-form-item label="拉取频率 (CRON 调度)">
                    <el-select v-model="apiConfig.frequency" class="w-full">
                      <el-option label="每 10 分钟" value="10" />
                      <el-option label="每 30 分钟" value="30" />
                      <el-option label="每小时" value="60" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="请求空间范围 (BBox)">
                    <el-input v-model="apiConfig.bbox" readonly class="text-xs font-mono" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>

            <div class="mt-6 border border-blue-100 rounded-lg bg-blue-50/30 p-4">
              <div class="text-sm font-bold text-slate-700 mb-3 flex items-center">
                <el-icon class="mr-1 text-blue-500"><Checked /></el-icon> 核心气象要素映射状态
              </div>
              <div class="space-y-2">
                <div v-for="item in mappings" :key="item.id" class="flex items-center text-sm bg-white border border-slate-100 px-3 py-2 rounded shadow-sm">
                  <el-icon class="text-green-500 text-lg mr-2"><CircleCheckFilled /></el-icon>
                  <span class="text-slate-600 font-medium">{{ item.label }}</span>
                  <span class="ml-auto text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">已映射解析</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="p-4 border-t border-gray-100 bg-slate-50 flex justify-end shrink-0">
            <el-button type="primary" :icon="EditPen" @click="handleSaveConfig">保存配置更新</el-button>
          </div>
        </div>
      </el-col>

      <!-- 右侧：日志表格 -->
      <el-col :span="14" class="h-full">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
            <div class="flex items-center">
              <i class="ri-list-check text-blue-500 mr-2 text-lg"></i>
              <h3 class="m-0 font-bold text-gray-800 text-base">近期拉取与解析日志 <span class="text-xs font-normal text-slate-400 ml-1">(Top 50)</span></h3>
            </div>
            <el-radio-group v-model="logFilter" size="small" @change="handleFilterChange">
              <el-radio-button label="all">全部记录</el-radio-button>
              <el-radio-button label="success">成功</el-radio-button>
              <el-radio-button label="failed">失败/异常</el-radio-button>
            </el-radio-group>
          </div>

          <div class="flex-1 overflow-hidden p-3">
            <el-table :data="logsData" stripe border height="100%" size="small" class="w-full data-pool-table" :header-cell-style="{ background: '#f8fafc', color: '#334155' }">
              <el-table-column prop="time" label="调度时间" width="100" align="center">
                <template #default="scope">
                  <span class="font-mono text-gray-600">{{ scope.row.time }}</span>
                </template>
              </el-table-column>
              
              <el-table-column prop="duration" label="任务耗时" width="90" align="center">
                <template #default="scope">
                  <span class="text-gray-500">{{ scope.row.duration }}</span>
                </template>
              </el-table-column>
              
              <el-table-column prop="size" label="获取数据量" width="100" align="center">
                <template #default="scope">
                  <span class="text-gray-500">{{ scope.row.size }}</span>
                </template>
              </el-table-column>
              
              <el-table-column prop="status" label="状态详情" min-width="260">
                <template #default="scope">
                  <div class="flex items-start gap-2">
                    <el-icon v-if="scope.row.status === 'success'" class="text-green-500 mt-0.5 text-base"><CircleCheckFilled /></el-icon>
                    <el-icon v-else-if="scope.row.status === 'failed'" class="text-red-500 mt-0.5 text-base"><WarningFilled /></el-icon>
                    <el-icon v-else class="text-amber-500 mt-0.5 text-base"><WarningFilled /></el-icon>
                    
                    <div>
                      <div class="font-bold text-xs" :class="{
                        'text-green-600': scope.row.status === 'success',
                        'text-red-600': scope.row.status === 'failed',
                        'text-amber-600': scope.row.status === 'warning'
                      }">
                        {{ scope.row.status === 'success' ? '成功' : scope.row.status === 'failed' ? '失败' : '异常' }}
                      </div>
                      <div class="text-gray-500 mt-0.5 text-xs leading-tight">{{ scope.row.message }}</div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              
              <el-table-column label="操作" width="160" fixed="right" align="center">
                <template #default="scope">
                  <el-button link type="primary" size="small" :icon="View" @click="handleViewJson(scope.row)">详情</el-button>
                  <el-button v-if="scope.row.status !== 'success'" link type="warning" size="small" :icon="RefreshRight" @click="handleRetry(scope.row)">手动重试</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- Raw JSON 抽屉 -->
    <el-drawer v-model="drawerVisible" title="拉取报文详情 (Raw JSON)" size="40%">
      <div class="h-full flex flex-col -mt-4">
        <el-alert title="供开发人员 Debug 验签校验或数据结构追溯使用" type="info" show-icon :closable="false" class="mb-4 shrink-0" />
        <div class="flex-1 bg-[#1e1e1e] rounded-lg border border-gray-200 overflow-hidden text-green-400 font-mono text-sm p-4 h-full relative">
          <pre class="h-full overflow-auto m-0 leading-relaxed">{{ drawerContent }}</pre>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<style scoped>
.data-pool-table {
  --el-table-border-color: #f1f5f9;
}
</style>
