<template>
  <div class="flow-control-page">
    <!-- 搜索区 -->
    <div class="custom-card p-5 mb-4">
      <el-form :model="filter" class="search-form" label-width="80px">
        <el-row :gutter="24">
          <el-col :span="10">
            <el-form-item label="应答机ID" label-width="90px">
              <el-input v-model="filter.responderId" placeholder="请输入应答机ID" class="w-full custom-el-input" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="关联飞行器名称" label-width="120px">
              <el-input v-model="filter.aircraftName" placeholder="请输入关联飞行器名称" class="w-full custom-el-input" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <div class="flex justify-end gap-2 pr-[12px] h-[32px]">
              <el-button @click="resetFilters" class="custom-btn">重置</el-button>
              <el-button type="primary" @click="doSearch" class="custom-btn custom-btn-primary">查询</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 列表区 -->
    <div class="custom-card flex-1 flex flex-col p-5 overflow-hidden">
      <!-- 数据表格 -->
      <el-table 
        :data="list" 
        v-loading="loading" 
        class="custom-el-table flex-1"
        :header-cell-style="{ background: '#fafafa', color: '#8c8c8c', fontWeight: '500', fontSize: '13px', borderBottom: '1px solid #f0f0f0' }"
        :cell-style="{ color: '#333', fontSize: '13px', borderBottom: '1px solid #f5f5f5' }"
      >
        <el-table-column label="序号" type="index" width="80" align="center" />
        <el-table-column prop="responderId" label="应答机ID" min-width="150" align="center" />
        <el-table-column prop="aircraftName" label="关联飞行器名称" min-width="200" align="center" />
        <el-table-column prop="channel" label="在飞飞行器所在航道" min-width="200" align="center" />
        <el-table-column prop="status" label="在飞飞行器状态" min-width="150" align="center" />
        <el-table-column label="操作" width="100" fixed="right" align="center">
          <template #default="{ row }">
             <!-- Screenshot is empty, generic placeholder -->
          </template>
        </el-table-column>

        <template #empty>
          <el-empty description="无数据" :image-size="60" />
        </template>
      </el-table>

      <!-- 分页栏 -->
      <div class="flex justify-end items-center mt-4 text-[13px] text-[#8c8c8c]">
        <span class="mr-4">共 0 个</span>
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="0"
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

const loading = ref(false)
const filter = reactive({ responderId: '', aircraftName: '' })
const pagination = reactive({ page: 1, pageSize: 10 })
const list = ref([]) // 默认无数据

function doSearch() {
  loading.value = true
  setTimeout(() => { loading.value = false }, 300)
}

function resetFilters() {
  Object.assign(filter, { responderId: '', aircraftName: '' })
  doSearch()
}
</script>

<style scoped>
.flow-control-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: #f0f2f5;
  height: 100%;
  box-sizing: border-box;
}

.custom-card {
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.search-form :deep(.el-form-item) {
  margin-bottom: 0;
}
.search-form :deep(.el-form-item__label) {
  color: #595959;
  font-size: 13px;
  font-weight: normal;
}

:deep(.custom-el-input .el-input__wrapper) {
  box-shadow: none !important;
  border: 1px solid #d9d9d9 !important;
  border-radius: 4px;
  padding: 0 11px;
}
:deep(.custom-el-input .el-input__wrapper:hover),
:deep(.custom-el-input .el-input__wrapper.is-focus) {
  border-color: #004b9e !important;
}
:deep(.el-input__inner) {
  color: #333;
  font-size: 13px;
}
:deep(.el-input__inner::placeholder) {
  color: #bfbfbf;
}

.custom-btn {
  height: 32px;
  line-height: 1;
  padding: 0 16px;
  border-radius: 4px;
  font-size: 13px;
  border-color: #d9d9d9;
  color: #595959;
}
.custom-btn:hover {
  color: #004b9e;
  border-color: #004b9e;
  background: #fff;
}
.custom-btn-primary {
  background: #004b9e !important;
  border-color: #004b9e !important;
  color: #fff !important;
}
.custom-btn-primary:hover {
  background: #005bc4 !important;
  border-color: #005bc4 !important;
}

.custom-el-table {
  --el-table-border-color: transparent;
  --el-table-row-hover-bg-color: #f5f7fa;
}
.custom-el-table::before {
  display: none;
}

.custom-pagination :deep(.el-pager li) {
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  color: #595959;
  font-weight: normal;
  min-width: 28px;
  height: 28px;
  line-height: 28px;
}
.custom-pagination :deep(.el-pager li.is-active) {
  background: #fff;
  border-color: #004b9e;
  color: #004b9e;
}
.custom-pagination :deep(.el-pagination__sizes .el-input__wrapper) {
  height: 28px;
  box-shadow: none;
  border: 1px solid #d9d9d9;
}
.custom-pagination :deep(.btn-prev),
.custom-pagination :deep(.btn-next) {
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  height: 28px;
  min-width: 28px;
}
</style>
