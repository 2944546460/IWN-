<template>
  <div class="uav-threshold-page">
    <!-- 搜索区 -->
    <div class="custom-card p-5 mb-4">
      <el-form :model="filter" class="search-form" label-width="80px">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="飞行器型号">
              <el-select v-model="filter.model" placeholder="请选择飞行器型号" class="w-full custom-el-select">
                <el-option label="M4E" value="M4E" />
                <el-option label="御3" value="Mavic3" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="飞行器厂家">
              <el-select v-model="filter.manufacturer" placeholder="请选择飞行器厂家" class="w-full custom-el-select">
                <el-option label="大疆创新" value="dji" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="指标名称">
              <el-select v-model="filter.metric" placeholder="请选择指标名称" class="w-full custom-el-select">
                <el-option label="电池电量" value="battery" />
                <el-option label="电池温度" value="temp" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="子系统名称">
              <el-select v-model="filter.system" placeholder="请选择子系统名称" class="w-full custom-el-select">
                <el-option label="动力系统" value="power" />
                <el-option label="飞行性能" value="flight" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="启用状态">
              <el-select v-model="filter.status" placeholder="请选择可用状态" class="w-full custom-el-select">
                <el-option label="已启用" value="1" />
                <el-option label="未启用" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <div class="flex justify-end gap-2 pr-[12px] h-[32px]">
              <el-button @click="resetFilters" class="custom-btn">重置</el-button>
              <el-button type="primary" @click="doSearch" class="custom-btn custom-btn-primary">查询</el-button>
              <el-button link type="primary" class="text-[13px] text-[#004b9e] ml-2">收起 <el-icon class="ml-1"><ArrowUp /></el-icon></el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 列表区 -->
    <div class="custom-card flex-1 flex flex-col p-5 overflow-hidden">
      <!-- 按钮栏 -->
      <div class="flex justify-end gap-3 mb-4">
        <el-button class="custom-btn-outline-primary">
          <el-icon class="mr-1"><Plus /></el-icon> 新建阈值
        </el-button>
        <el-button class="custom-btn-outline-danger">
          <el-icon class="mr-1"><Delete /></el-icon> 批量删除
        </el-button>
      </div>

      <!-- 数据表格 -->
      <el-table 
        :data="list" 
        class="custom-el-table flex-1"
        :header-cell-style="{ background: '#fafafa', color: '#8c8c8c', fontWeight: '500', fontSize: '13px', borderBottom: '1px solid #f0f0f0' }"
        :cell-style="{ color: '#333', fontSize: '13px', borderBottom: '1px solid #f5f5f5' }"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column prop="model" label="无人机型号" min-width="120" />
        <el-table-column prop="metricName" label="指标名称" min-width="150" />
        <el-table-column prop="systemName" label="子系统名称" min-width="150" />
        <el-table-column label="启用/停用" width="100">
          <template #default="{ row }">
            <el-switch v-model="row.enabled" class="custom-switch" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right" align="center">
          <template #default="{ row }">
             <span class="text-[#004b9e] cursor-pointer hover:text-[#005bc4] text-[13px] mr-3">详情</span>
             <span class="text-[#004b9e] cursor-pointer hover:text-[#005bc4] text-[13px] mr-3">编辑</span>
             <span class="text-[#ff4d4f] cursor-pointer hover:text-[#ff7875] text-[13px]">删除</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页栏 -->
      <div class="flex justify-end items-center mt-4 text-[13px] text-[#8c8c8c]">
        <span class="mr-4">共 19 条</span>
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="19"
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
import { ref, reactive } from 'vue'
import { ArrowUp, Plus, Delete } from '@element-plus/icons-vue'

const filter = reactive({ model: '', manufacturer: '', metric: '', system: '', status: '' })
const pagination = reactive({ page: 1, pageSize: 10 })

// 造符合截图的数据
const list = ref([
  { model: 'M4E', metricName: '电池电量', systemName: '动力系统', enabled: true },
  { model: '御3', metricName: '电池温度', systemName: '动力系统', enabled: false },
  { model: 'AIR 2', metricName: '最大电芯压差', systemName: '动力系统', enabled: false },
  { model: '精灵2 SE', metricName: '空速与地速差', systemName: '飞行性能', enabled: true },
  { model: 'M4E', metricName: '电池温度', systemName: '动力系统', enabled: true },
  { model: '悟2', metricName: '电池电量', systemName: '动力系统', enabled: true },
  { model: 'M4D 系列', metricName: '电池电量', systemName: '动力系统', enabled: true },
  { model: '御2行业版', metricName: '电池电量', systemName: '动力系统', enabled: true },
  { model: 'M4E', metricName: '电池电压', systemName: '动力系统', enabled: true },
  { model: 'M4E', metricName: 'IMU加速度计偏差', systemName: '导航系统', enabled: true },
])

function doSearch() { }
function resetFilters() { }
</script>

<style scoped>
.uav-threshold-page {
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

/* 表单覆盖 */
.search-form :deep(.el-form-item) { margin-bottom: 16px; }
.search-form :deep(.el-form-item__label) { color: #595959; font-size: 13px; font-weight: normal; }

/* 极简组件样式 */
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

/* 按钮样式 */
.custom-btn { height: 32px; padding: 0 16px; border-radius: 4px; font-size: 13px; border-color: #d9d9d9; color: #595959; }
.custom-btn:hover { color: #004b9e; border-color: #004b9e; background: #fff; }
.custom-btn-primary { background: #004b9e !important; border-color: #004b9e !important; color: #fff !important; }
.custom-btn-primary:hover { background: #005bc4 !important; border-color: #005bc4 !important; }

.custom-btn-outline-primary { height: 32px; padding: 0 16px; border-radius: 4px; font-size: 13px; border-color: #004b9e !important; color: #004b9e !important; background: #fff !important; }
.custom-btn-outline-primary:hover { background: #e6f0f9 !important; }
.custom-btn-outline-danger { height: 32px; padding: 0 16px; border-radius: 4px; font-size: 13px; border-color: #ff4d4f !important; color: #ff4d4f !important; background: #fff !important; }
.custom-btn-outline-danger:hover { background: #fff1f0 !important; }

/* 表格边缘消除及多选框定制 */
.custom-el-table { --el-table-border-color: transparent; --el-table-row-hover-bg-color: #f5f7fa; }
.custom-el-table::before { display: none; }
.custom-el-table :deep(.el-checkbox__inner) { border-color: #d9d9d9; }
.custom-el-table :deep(.el-checkbox__input.is-checked .el-checkbox__inner) { background-color: #004b9e; border-color: #004b9e; }

/* Switch 颜色定制 */
.custom-switch { --el-switch-on-color: #004b9e; }

/* 分页器精简风格 */
.custom-pagination :deep(.el-pager li) { background: #fff; border: 1px solid #d9d9d9; border-radius: 4px; color: #595959; font-weight: normal; min-width: 28px; height: 28px; line-height: 28px; }
.custom-pagination :deep(.el-pager li.is-active) { background: #fff; border-color: #004b9e; color: #004b9e; }
.custom-pagination :deep(.el-pagination__sizes .el-input__wrapper) { height: 28px; box-shadow: none; border: 1px solid #d9d9d9; }
.custom-pagination :deep(.btn-prev),
.custom-pagination :deep(.btn-next) { background: #fff; border: 1px solid #d9d9d9; border-radius: 4px; height: 28px; min-width: 28px; }
</style>
