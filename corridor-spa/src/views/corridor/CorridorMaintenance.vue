<template>
  <div class="corridor-maintenance-page">
    <!-- 搜索区 -->
    <div class="custom-card p-5 mb-4">
      <el-form :model="filter" class="search-form" label-width="100px">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="廊道ID">
              <el-select v-model="filter.corridorId" placeholder="请选择廊道ID" class="w-full custom-el-select">
                <el-option label="257" value="257" />
                <el-option label="256" value="256" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="廊道名称">
              <el-input v-model="filter.name" placeholder="请输入廊道名称" class="w-full custom-el-input" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="廊道所在空域">
              <el-select v-model="filter.airspace" placeholder="请选择廊道所在空域" class="w-full custom-el-select">
                <el-option label="D/E类空域" value="D/E" />
                <el-option label="G类空域" value="G" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="flex justify-end gap-2 h-[32px] mt-2">
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
        <el-button class="custom-btn-outline-primary" @click="handleCreate">
          <el-icon class="mr-1"><Plus /></el-icon> 新建廊道
        </el-button>
        <el-button class="custom-btn-outline-danger" @click="handleBatchDelete">
          <el-icon class="mr-1"><Delete /></el-icon> 批量删除
        </el-button>
      </div>

      <!-- 数据表格 -->
      <el-table 
        :data="list" 
        v-loading="loading" 
        class="custom-el-table flex-1"
        :header-cell-style="{ background: '#fafafa', color: '#8c8c8c', fontWeight: '500', fontSize: '13px', borderBottom: '1px solid #f0f0f0' }"
        :cell-style="{ color: '#333', fontSize: '13px', borderBottom: '1px solid #f5f5f5' }"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column prop="corridorId" label="廊道ID" min-width="100" />
        <el-table-column prop="name" label="廊道名称" min-width="160" show-overflow-tooltip />
        <el-table-column prop="segmentCount" label="廊道段数量" min-width="100" align="center" />
        <el-table-column prop="airspace" label="廊道所在空域" min-width="180" align="center" />
        <el-table-column label="启用/禁用" width="100" align="center">
          <template #default="{ row }">
            <el-switch v-model="row.status" class="custom-switch" />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="160" align="center" />
        <el-table-column label="操作" width="140" fixed="right" align="center">
          <template #default>
             <span class="text-[#004b9e] cursor-pointer hover:text-[#005bc4] text-[13px] mr-3">详情</span>
             <span class="text-[#004b9e] cursor-pointer hover:text-[#005bc4] text-[13px] mr-3">编辑</span>
             <span class="text-[#ff4d4f] cursor-pointer hover:text-[#ff7875] text-[13px]">删除</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页栏 -->
      <div class="flex justify-end items-center mt-4 text-[13px] text-[#8c8c8c]">
        <span class="mr-4">共 16 条</span>
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="16"
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

const loading = ref(false)
const filter = reactive({ corridorId: '', name: '', airspace: '' })
const pagination = reactive({ page: 1, pageSize: 10 })

const list = ref([
  { corridorId: '257', name: '417-1435', segmentCount: 6, airspace: 'D/E类空域 (300-1000)', status: true, createTime: '2026-04-17 14:37:23' },
  { corridorId: '256', name: '6000不保存测试', segmentCount: 26, airspace: 'D/E类空域 (3000-6000)', status: true, createTime: '2026-04-17 14:16:20' },
  { corridorId: '255', name: '0417-1', segmentCount: 10, airspace: 'D/E类空域 (1000-3000)', status: true, createTime: '2026-04-17 11:57:36' },
  { corridorId: '253', name: '测试04161602', segmentCount: 16, airspace: 'D/E类空域 (1000-3000)', status: true, createTime: '2026-04-16 16:02:27' },
  { corridorId: '252', name: '测试04161551', segmentCount: 3, airspace: 'G类空域', status: true, createTime: '2026-04-16 15:52:05' },
  { corridorId: '248', name: '测试04161512', segmentCount: 13, airspace: 'D/E类空域 (1000-3000)', status: true, createTime: '2026-04-16 15:13:03' },
  { corridorId: '246', name: '测试0416', segmentCount: 13, airspace: 'D/E类空域 (1000-3000)', status: true, createTime: '2026-04-16 15:10:46' },
  { corridorId: '245', name: '测试新建0416_2', segmentCount: 5, airspace: 'D/E类空域 (300-1000)', status: true, createTime: '2026-04-16 14:53:08' },
  { corridorId: '244', name: '测试新建0416', segmentCount: 5, airspace: 'D/E类空域 (300-1000)', status: true, createTime: '2026-04-16 14:51:56' },
  { corridorId: '243', name: '0416', segmentCount: 10, airspace: 'D/E类空域 (1000-3000)', status: true, createTime: '2026-04-16 14:41:18' },
])

function doSearch() {
  loading.value = true
  setTimeout(() => { loading.value = false }, 300)
}

function resetFilters() {
  Object.assign(filter, { corridorId: '', name: '', airspace: '' })
  doSearch()
}

function handleCreate() {}
function handleBatchDelete() {}
</script>

<style scoped>
.corridor-maintenance-page {
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
.custom-card { background: #ffffff; border: 1px solid #e8e8e8; border-radius: 4px; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04); }

/* 覆写 Element 表单间距 */
.search-form :deep(.el-form-item) { margin-bottom: 20px; }
.search-form :deep(.el-form-item__label) { color: #595959; font-size: 13px; font-weight: normal; }

/* 扁平化极简 Input / Select */
:deep(.custom-el-input .el-input__wrapper),
:deep(.custom-el-select .el-select__wrapper) { box-shadow: none !important; border: 1px solid #d9d9d9 !important; border-radius: 4px; padding: 0 11px; }
:deep(.custom-el-input .el-input__wrapper:hover), :deep(.custom-el-input .el-input__wrapper.is-focus),
:deep(.custom-el-select .el-select__wrapper.is-hovering), :deep(.custom-el-select .el-select__wrapper.is-focused) { border-color: #004b9e !important; }
:deep(.el-input__inner) { color: #333; font-size: 13px; }
:deep(.el-input__inner::placeholder), :deep(.el-select__placeholder) { color: #bfbfbf; }

/* 自定义操作按钮 */
.custom-btn { height: 32px; line-height: 1; padding: 0 16px; border-radius: 4px; font-size: 13px; border-color: #d9d9d9; color: #595959; }
.custom-btn:hover { color: #004b9e; border-color: #004b9e; background: #fff; }
.custom-btn-primary { background: #004b9e !important; border-color: #004b9e !important; color: #fff !important; }
.custom-btn-primary:hover { background: #005bc4 !important; border-color: #005bc4 !important; }
.custom-btn-outline-primary { height: 32px; padding: 0 16px; border-radius: 4px; font-size: 13px; border-color: #004b9e !important; color: #004b9e !important; background: #fff !important; }
.custom-btn-outline-primary:hover { background: #e6f0f9 !important; }
.custom-btn-outline-danger { height: 32px; padding: 0 16px; border-radius: 4px; font-size: 13px; border-color: #ff4d4f !important; color: #ff4d4f !important; background: #fff !important; }
.custom-btn-outline-danger:hover { background: #fff1f0 !important; }

/* Switch 颜色定制 */
.custom-switch { --el-switch-on-color: #004b9e; }

/* 表格边缘消除 */
.custom-el-table { --el-table-border-color: transparent; --el-table-row-hover-bg-color: #f5f7fa; }
.custom-el-table::before { display: none; }
.custom-el-table :deep(.el-checkbox__inner) { border-color: #d9d9d9; }
.custom-el-table :deep(.el-checkbox__input.is-checked .el-checkbox__inner) { background-color: #004b9e; border-color: #004b9e; }

/* 分页器精简风格 */
.custom-pagination :deep(.el-pager li) { background: #fff; border: 1px solid #d9d9d9; border-radius: 4px; color: #595959; font-weight: normal; min-width: 28px; height: 28px; line-height: 28px; }
.custom-pagination :deep(.el-pager li.is-active) { background: #fff; border-color: #004b9e; color: #004b9e; }
.custom-pagination :deep(.el-pagination__sizes .el-input__wrapper) { height: 28px; box-shadow: none; border: 1px solid #d9d9d9; }
.custom-pagination :deep(.btn-prev), .custom-pagination :deep(.btn-next) { background: #fff; border: 1px solid #d9d9d9; border-radius: 4px; height: 28px; min-width: 28px; }
</style>
