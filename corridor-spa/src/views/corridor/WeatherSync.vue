<template>
  <div class="node-status-page">
    <div class="flex gap-4 mb-4 flex-shrink-0">
      <div class="custom-card flex-1 p-5 flex flex-col justify-between" style="min-height: 110px;">
        <div class="text-[13px] text-[#595959] mb-3">拉取解析网格数</div>
        <div class="text-[32px] font-normal text-[#333] leading-none">1,024</div>
      </div>
      <div class="custom-card flex-1 p-5 flex flex-col justify-between" style="min-height: 110px;">
        <div class="text-[13px] text-[#595959] mb-3">上次同步 (Cron)</div>
        <div class="text-[32px] font-normal text-[#333] leading-none flex items-baseline gap-2">
           10:00:00 <span class="text-sm text-green-500">成 功</span>
        </div>
      </div>
      <div class="custom-card flex-1 p-5 flex flex-col justify-between" style="min-height: 110px;">
        <div class="text-[13px] text-[#595959] mb-3">下次自动拉取剩余</div>
        <div class="text-[32px] font-normal text-[#004b9e] leading-none">14 分钟</div>
      </div>
    </div>
    
    <div class="custom-card flex-1 flex flex-col p-5 overflow-hidden">
      <div class="flex justify-between items-center mb-4">
        <div class="text-[14px] font-medium text-[#333] border-l-3 border-[#004b9e] pl-2 leading-none">气象数据实况与预报池</div>
        <el-button type="primary" :loading="loading" @click="handleManualSync" class="custom-btn custom-btn-primary">
          立即打点拉取
        </el-button>
      </div>
      
      <!-- 搜索区 -->
      <el-form class="search-form" label-width="80px">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="网格编号">
              <el-input placeholder="如 GRID_E119" class="w-full custom-el-input" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="预测时段">
              <el-select placeholder="请选择" class="w-full custom-el-select">
                <el-option label="全部实况+" value="" />
                <el-option label="未来 3 小时" value="3" />
                <el-option label="未来 24 小时" value="24" />
              </el-select>
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
        :data="gridForecastData"
        class="custom-el-table flex-1 mt-4"
        :header-cell-style="{ background: '#fafafa', color: '#8c8c8c', fontWeight: '500', fontSize: '13px', borderBottom: '1px solid #f0f0f0' }"
        :cell-style="{ color: '#333', fontSize: '13px', borderBottom: '1px solid #f5f5f5' }"
      >
        <el-table-column prop="gridId" label="网格编号" min-width="150" />
        <el-table-column prop="forecastTime" label="预测时间片" min-width="150" />
        <el-table-column label="位置坐标" width="160">
          <template #default="{ row }">E{{ row.lng }}, N{{ row.lat }}</template>
        </el-table-column>
        <el-table-column label="大气温度" min-width="100">
          <template #default="{ row }">{{ row.temperature }} ℃</template>
        </el-table-column>
        <el-table-column label="降水强度" min-width="120">
          <template #default="{ row }">{{ row.precipitation }} mm/h</template>
        </el-table-column>
        <el-table-column label="阵风风速" min-width="120">
          <template #default="{ row }">{{ row.windSpeed }} m/s</template>
        </el-table-column>
        <el-table-column label="能见度" min-width="100">
          <template #default="{ row }">{{ row.visibility }} km</template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新抓取时间" min-width="150" />
      </el-table>

       <!-- 分页 -->
      <div class="flex justify-end items-center mt-4 text-[13px] text-[#8c8c8c]">
        <span class="mr-4">共 1024 条</span>
        <el-pagination
          :total="1024"
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
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)

const handleManualSync = () => {
  loading.value = true
  ElMessage.warning('正在拉取并解析彩云 API 综合气象接口...')
  setTimeout(() => {
    loading.value = false
    ElMessage.success('数据拉取入库成功！')
  }, 1500)
}

const gridForecastData = ref([
  { gridId: 'GRID_E119.8_N30.2', forecastTime: '2026-04-20 12:00:00', lng: 119.85, lat: 30.21, temperature: 28.5, precipitation: 32.4, windSpeed: 14.5, visibility: 0.8, updateTime: '2026-04-20 10:00:00' },
  { gridId: 'GRID_E119.7_N30.2', forecastTime: '2026-04-20 12:00:00', lng: 119.72, lat: 30.26, temperature: 26.1, precipitation: 18.0, windSpeed: 8.2, visibility: 4.5, updateTime: '2026-04-20 10:00:00' },
  { gridId: 'GRID_E119.9_N30.0', forecastTime: '2026-04-20 15:00:00', lng: 119.95, lat: 30.05, temperature: 22.4, precipitation: 0.0, windSpeed: 19.8, visibility: 12.0, updateTime: '2026-04-20 10:00:00' },
  { gridId: 'GRID_E120.0_N30.4', forecastTime: '2026-04-20 18:00:00', lng: 120.03, lat: 30.44, temperature: 18.9, precipitation: 5.6, windSpeed: 3.4, visibility: 2.1, updateTime: '2026-04-20 10:00:00' }
])
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

.custom-card {
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.border-l-3 { border-left-width: 3px; }

.search-form :deep(.el-form-item) { margin-bottom: 0; }
.search-form :deep(.el-form-item__label) { color: #595959; font-size: 13px; font-weight: normal; }

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

.custom-btn { height: 32px; padding: 0 16px; border-radius: 4px; font-size: 13px; border-color: #d9d9d9; color: #595959; }
.custom-btn:hover { color: #004b9e; border-color: #004b9e; background: #fff; }
.custom-btn-primary { background: #004b9e !important; border-color: #004b9e !important; color: #fff !important; }
.custom-btn-primary:hover { background: #005bc4 !important; border-color: #005bc4 !important; }

.custom-el-table { --el-table-border-color: transparent; --el-table-row-hover-bg-color: #f5f7fa; }
.custom-el-table::before { display: none; }

.custom-pagination :deep(.el-pager li) { background: #fff; border: 1px solid #d9d9d9; border-radius: 4px; color: #595959; font-weight: normal; min-width: 28px; height: 28px; line-height: 28px; }
.custom-pagination :deep(.el-pager li.is-active) { background: #fff; border-color: #004b9e; color: #004b9e; }
.custom-pagination :deep(.el-pagination__sizes .el-input__wrapper) { height: 28px; box-shadow: none; border: 1px solid #d9d9d9; }
.custom-pagination :deep(.btn-prev),
.custom-pagination :deep(.btn-next) { background: #fff; border: 1px solid #d9d9d9; border-radius: 4px; height: 28px; min-width: 28px; }
</style>
