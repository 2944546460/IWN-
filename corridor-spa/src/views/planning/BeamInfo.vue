<template>
  <div class="beam-info-page">
    <!-- 搜索区 -->
    <div class="custom-card p-5 mb-4">
      <el-form :model="filter" class="search-form" label-width="110px">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="波束所属节点">
              <el-input v-model="filter.nodeId" placeholder="请输入波束所属节点" class="w-full custom-el-input" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="波束工作类型">
              <el-select v-model="filter.beamType" placeholder="请选择波束工作类型" class="w-full custom-el-select">
                <el-option label="雷达" value="雷达" />
                <el-option label="测控" value="测控" />
                <el-option label="数传" value="数传" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="flex justify-end gap-2 h-[32px]">
              <el-button @click="resetFilters" class="custom-btn">重置</el-button>
              <el-button type="primary" @click="doSearch" class="custom-btn custom-btn-primary">查询</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 列表区 -->
    <div class="custom-card flex-1 flex flex-col p-5 overflow-hidden">
      <div class="text-[14px] font-medium text-[#333] mb-4 leading-none">波束信息</div>

      <!-- 数据表格 -->
      <el-table 
        :data="list" 
        v-loading="loading" 
        class="custom-el-table flex-1 mt-2"
        :header-cell-style="{ background: '#fafafa', color: '#8c8c8c', fontWeight: '500', fontSize: '13px', borderBottom: '1px solid #f0f0f0' }"
        :cell-style="{ color: '#333', fontSize: '13px', borderBottom: '1px solid #f5f5f5' }"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="序号" type="index" width="80" align="center" />
        <el-table-column prop="beamId" label="波束ID" min-width="160" />
        <el-table-column prop="nodeRef" label="波束所属节点" min-width="160" align="center" />
        <el-table-column prop="workMode" label="工作模式" min-width="140" align="center" />
        <el-table-column prop="beamWorkType" label="波束工作类型" min-width="140" align="center" />
        <el-table-column label="操作" width="100" fixed="right" align="center">
          <template #default>
             <span class="text-[#004b9e] cursor-pointer hover:text-[#005bc4] text-[13px]">详情</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页栏 -->
      <div class="flex justify-end items-center mt-4 text-[13px] text-[#8c8c8c]">
        <span class="mr-4">共 144 条</span>
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="144"
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
const filter = reactive({ nodeId: '', beamType: '' })
const pagination = reactive({ page: 1, pageSize: 10 })

const list = ref([
  { beamId: '杭甬测试节点三号-1', nodeRef: '129', workMode: '发射模式', beamWorkType: '雷达' },
  { beamId: '杭甬测试节点三号-2', nodeRef: '129', workMode: '接收模式', beamWorkType: '雷达' },
  { beamId: '杭甬测试节点三号-3', nodeRef: '129', workMode: '发射模式', beamWorkType: '测控' },
  { beamId: '杭甬测试节点三号-4', nodeRef: '129', workMode: '接收模式', beamWorkType: '测控' },
  { beamId: '杭甬测试节点三号-5', nodeRef: '129', workMode: '发射模式', beamWorkType: '测控' },
  { beamId: '杭甬测试节点三号-6', nodeRef: '129', workMode: '接收模式', beamWorkType: '测控' },
  { beamId: '杭甬测试节点三号-7', nodeRef: '129', workMode: '发射模式', beamWorkType: '测控' },
  { beamId: '杭甬测试节点三号-8', nodeRef: '129', workMode: '接收模式', beamWorkType: '测控' },
  { beamId: '杭甬测试节点三号-9', nodeRef: '129', workMode: '发射模式', beamWorkType: '数传' },
  { beamId: '杭甬测试节点三号-10', nodeRef: '129', workMode: '接收模式', beamWorkType: '数传' },
])

function doSearch() {
  loading.value = true
  setTimeout(() => { loading.value = false }, 300)
}

function resetFilters() {
  Object.assign(filter, { nodeId: '', beamType: '' })
  doSearch()
}
</script>

<style scoped>
.beam-info-page {
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

/* 覆写 Element 表单间距 */
.search-form :deep(.el-form-item) {
  margin-bottom: 20px;
}
.search-form :deep(.el-form-item__label) {
  color: #595959;
  font-size: 13px;
  font-weight: normal;
}

/* 扁平化极简 Input / Select */
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
:deep(.el-input__inner) {
  color: #333;
  font-size: 13px;
}
:deep(.el-input__inner::placeholder),
:deep(.el-select__placeholder) {
  color: #bfbfbf;
}

/* 自定义操作按钮 */
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

/* 表格边缘消除 */
.custom-el-table {
  --el-table-border-color: transparent;
  --el-table-row-hover-bg-color: #f5f7fa;
}
.custom-el-table::before {
  display: none;
}
.custom-el-table :deep(.el-checkbox__inner) {
  border-color: #d9d9d9;
}
.custom-el-table :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #004b9e;
  border-color: #004b9e;
}

/* 分页器精简风格 */
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
