<script setup lang="ts">
import { ref } from 'vue'
import { Search, Refresh, View, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// ---- 查询参数 ----
const queryParams = ref({
  dateRange: null,
  level: '',
  keyword: '',
  status: 'all'
})

// ---- 模拟数据 ----
const tableData = ref([
  {
    id: 1,
    gridNo: 'Grid-A02-15',
    level: 1,
    levelText: '一级绝对禁飞',
    restrictedAc: ['全机型禁入'],
    validStart: '2026-04-20 14:00',
    validEnd: '2026-04-20 18:00',
    triggerReason: '气象局13:00发布，该网格预报阵风达22m/s，触发固定翼风速阈值导致全线禁飞。',
    status: 'active'
  },
  {
    id: 2,
    gridNo: 'Grid-B05-22',
    level: 2,
    levelText: '二级禁飞',
    restrictedAc: ['多旋翼禁入', 'VTOL禁入'],
    validStart: '2026-04-20 15:00',
    validEnd: '2026-04-20 20:00',
    triggerReason: '局地中到大雨预警，降水量预计达16mm/h。',
    status: 'pending'
  },
  {
    id: 3,
    gridNo: 'Grid-A01-08',
    level: 3,
    levelText: '三级禁飞',
    restrictedAc: ['多旋翼禁入'],
    validStart: '2026-04-20 10:00',
    validEnd: '2026-04-20 12:00',
    triggerReason: '短时阵风12m/s，触发多旋翼安全预警。',
    status: 'expired'
  }
])

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(165)

// ---- 方法 ----
const handleSearch = () => {
  ElMessage.success('执行查询')
}

const handleReset = () => {
  queryParams.value = {
    dateRange: null,
    level: '',
    keyword: '',
    status: 'all'
  }
}

const handlePreview = (row: any) => {
  ElMessage.info(`预览网格: ${row.gridNo}`)
}

const handleRelease = (row: any) => {
  ElMessageBox.confirm(
    `强制解除后，网格 [${row.gridNo}] 的飞行限制将失效。该操作会在系统中留下高危日志，确认继续？`,
    '人工强制解除危险警告',
    {
      confirmButtonText: '强制解除',
      cancelButtonText: '取消',
      type: 'error',
    }
  ).then(() => {
    ElMessage.success(`已成功解除网格 ${row.gridNo} 的禁飞限制`)
  }).catch(() => {})
}
</script>

<template>
  <div class="h-full flex flex-col p-6 bg-slate-50 overflow-hidden">
    <!-- 顶部数据概览卡片 -->
    <el-row :gutter="24" class="mb-4 shrink-0">
      <el-col :span="8">
        <el-card shadow="hover" class="h-24 !border-none !rounded-xl relative overflow-hidden bg-gradient-to-r from-red-50 to-white">
          <div class="flex items-center justify-between h-full px-2">
            <div>
              <div class="text-sm text-gray-500 mb-1 font-medium">当前生效中 一级禁飞区</div>
              <div class="text-3xl font-black text-red-600">12<span class="text-sm font-normal text-gray-400 ml-1">个网格</span></div>
            </div>
            <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500 opacity-80">
              <i class="ri-alert-fill text-2xl"></i>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="h-24 !border-none !rounded-xl relative overflow-hidden bg-gradient-to-r from-orange-50 to-white">
          <div class="flex items-center justify-between h-full px-2">
            <div>
              <div class="text-sm text-gray-500 mb-1 font-medium">当前生效中 二级禁飞区</div>
              <div class="text-3xl font-black text-orange-500">45<span class="text-sm font-normal text-gray-400 ml-1">个网格</span></div>
            </div>
            <div class="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 opacity-80">
              <i class="ri-error-warning-fill text-2xl"></i>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="h-24 !border-none !rounded-xl relative overflow-hidden bg-gradient-to-r from-amber-50 to-white">
          <div class="flex items-center justify-between h-full px-2">
            <div>
              <div class="text-sm text-gray-500 mb-1 font-medium">当前生效中 三级禁飞区</div>
              <div class="text-3xl font-black text-amber-500">108<span class="text-sm font-normal text-gray-400 ml-1">个网格</span></div>
            </div>
            <div class="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 opacity-80">
              <i class="ri-error-warning-fill text-2xl"></i>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 主体区域：包含搜索和表格 -->
    <div class="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col p-4 overflow-hidden">
      <!-- 搜索表单 -->
      <el-form :inline="true" :model="queryParams" class="shrink-0 mb-2 filter-form w-full flex flex-wrap">
        <el-form-item label="生效时段">
          <el-date-picker
            v-model="queryParams.dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD HH:00"
            value-format="YYYY-MM-DD HH:00"
            class="!w-[340px]"
          />
        </el-form-item>
        <el-form-item label="禁飞级别">
          <el-select v-model="queryParams.level" placeholder="请选择级别" class="!w-[160px]" clearable>
            <el-option label="一级绝对禁飞" value="1" />
            <el-option label="二级禁飞" value="2" />
            <el-option label="三级禁飞" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="空间范围">
          <el-input v-model="queryParams.keyword" placeholder="请输入网格编号或廊道ID" class="!w-[200px]" clearable />
        </el-form-item>
        
        <el-form-item label="当前状态">
          <el-radio-group v-model="queryParams.status">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="pending">即将生效</el-radio-button>
            <el-radio-button label="active">生效中</el-radio-button>
            <el-radio-button label="expired">已失效</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item class="!ml-auto">
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <div class="flex-1 overflow-hidden min-h-0">
        <el-table :data="tableData" stripe border height="100%" class="w-full data-pool-table" :header-cell-style="{ background: '#f8fafc', color: '#1e293b', fontWeight: 'bold' }">
          <el-table-column prop="gridNo" label="网格/区域编号" width="160" show-overflow-tooltip>
            <template #default="scope">
              <span class="font-mono text-gray-700">{{ scope.row.gridNo }}</span>
            </template>
          </el-table-column>
          
          <el-table-column prop="level" label="禁飞级别" width="140" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.level === 1" type="danger" effect="dark" class="!w-full">🔴 一级绝对禁飞</el-tag>
              <el-tag v-else-if="scope.row.level === 2" type="warning" color="#f97316" effect="dark" class="!border-none !text-white !w-full">🟠 二级禁飞</el-tag>
              <el-tag v-else type="warning" effect="light" class="!w-full !border-amber-200 !text-amber-600 !bg-amber-50">🟡 三级禁飞</el-tag>
            </template>
          </el-table-column>
          
          <el-table-column prop="restrictedAc" label="限制进入机型" width="200">
            <template #default="scope">
              <div class="flex flex-wrap gap-1">
                <el-tag v-for="(ac, idx) in scope.row.restrictedAc" :key="idx" size="small" type="info" class="!bg-slate-100 !border-slate-200 !text-slate-600">
                  {{ ac }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column label="生效时间段" width="280">
            <template #default="scope">
              <div class="flex items-center text-sm text-gray-600">
                <i class="ri-time-line mr-1 text-gray-400"></i>
                {{ scope.row.validStart }} <span class="mx-1 text-xs text-gray-300">至</span> {{ scope.row.validEnd }}
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="triggerReason" label="系统触发诱因" min-width="260" show-overflow-tooltip>
            <template #default="scope">
              <span class="text-gray-600 text-sm">{{ scope.row.triggerReason }}</span>
            </template>
          </el-table-column>
          
          <el-table-column prop="status" label="状态" width="120">
            <template #default="scope">
              <div class="flex items-center gap-1.5">
                <span v-if="scope.row.status === 'active'" class="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_0_2px_rgba(34,197,94,0.2)]"></span>
                <span v-else-if="scope.row.status === 'pending'" class="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_0_2px_rgba(59,130,246,0.2)]"></span>
                <span v-else class="w-2 h-2 rounded-full bg-gray-400"></span>
                
                <span class="text-sm font-medium" :class="{
                  'text-green-600': scope.row.status === 'active',
                  'text-blue-600': scope.row.status === 'pending',
                  'text-gray-500': scope.row.status === 'expired'
                }">
                  {{ scope.row.status === 'active' ? '生效中' : scope.row.status === 'pending' ? '即将生效' : '已失效' }}
                </span>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="200" fixed="right" align="center">
            <template #default="scope">
              <el-button link type="primary" :icon="View" @click="handlePreview(scope.row)">
                空间预览
              </el-button>
              <!-- 仅针对未失效的数据显示解除按钮 -->
              <el-button v-if="scope.row.status !== 'expired'" link type="danger" :icon="Delete" @click="handleRelease(scope.row)">
                人工解除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页器 -->
      <div class="shrink-0 flex justify-end mt-4">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-form :deep(.el-form-item) {
  margin-bottom: 12px;
}
.data-pool-table {
  --el-table-border-color: #f1f5f9;
}
</style>
