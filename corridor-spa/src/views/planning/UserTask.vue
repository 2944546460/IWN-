<template>
  <div class="user-task-page">
    <!-- 搜索区 -->
    <div class="custom-card p-5 mb-4">
      <el-form :model="filter" class="search-form" label-width="80px">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="任务ID">
              <el-select v-model="filter.taskId" placeholder="请选择任务ID" class="w-full custom-el-select">
                <el-option label="MIS000000689" value="MIS000000689" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务名称">
              <el-input v-model="filter.taskName" placeholder="请输入任务名称" class="w-full custom-el-input" />
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
      <div class="text-[14px] font-medium text-[#333] mb-4 leading-none">用户任务信息</div>

      <!-- 数据表格 -->
      <el-table 
        :data="list" 
        v-loading="loading" 
        class="custom-el-table flex-1 mt-2"
        :header-cell-style="{ background: '#fafafa', color: '#8c8c8c', fontWeight: '500', fontSize: '13px', borderBottom: '1px solid #f0f0f0' }"
        :cell-style="{ color: '#333', fontSize: '13px', borderBottom: '1px solid #f5f5f5' }"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column prop="taskId" label="任务ID" min-width="140" />
        <el-table-column prop="taskName" label="任务名称" min-width="120" />
        <el-table-column prop="userId" label="用户ID" min-width="80" align="center" />
        <el-table-column prop="userName" label="用户名称" min-width="100" align="center" />
        <el-table-column prop="bizType" label="业务类型" min-width="100" align="center" />
        <el-table-column prop="submitTime" label="提交时间" min-width="170" align="center" />
        <el-table-column prop="verifyTime" label="核验时间" min-width="170" align="center" />
        <el-table-column prop="verifyResult" label="核验结果" min-width="100" align="center" />
        <el-table-column label="操作" width="80" fixed="right" align="center">
          <template #default>
             <span class="text-[#004b9e] cursor-pointer hover:text-[#005bc4] text-[13px]">详情</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页栏 -->
      <div class="flex justify-end items-center mt-4 text-[13px] text-[#8c8c8c]">
        <span class="mr-4">共 303 条</span>
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="303"
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
const filter = reactive({ taskId: '', taskName: '' })
const pagination = reactive({ page: 1, pageSize: 20 })

const list = ref([
  { taskId: 'MIS000000689', taskName: '0417', userId: '1', userName: 'Super', bizType: '智慧物流', submitTime: '2026-04-17 11:23:12', verifyTime: '2026-04-17 11:23:12', verifyResult: '审核成功' },
  { taskId: 'MIS000000688', taskName: '04171116', userId: '1', userName: 'Super', bizType: '智慧物流', submitTime: '2026-04-17 11:17:16', verifyTime: '2026-04-17 11:17:18', verifyResult: '审核成功' },
  { taskId: 'MIS000000687', taskName: '04171034', userId: '1', userName: 'Super', bizType: '高速巡检', submitTime: '2026-04-17 10:34:52', verifyTime: '2026-04-17 10:34:52', verifyResult: '审核成功' },
  { taskId: 'MIS000000686', taskName: '4171032', userId: '1', userName: 'Super', bizType: '智慧物流', submitTime: '2026-04-17 10:32:51', verifyTime: '2026-04-17 10:32:51', verifyResult: '审核成功' },
  { taskId: 'MIS000000685', taskName: '04171014', userId: '1', userName: 'Super', bizType: '高速巡检', submitTime: '2026-04-17 10:15:11', verifyTime: '2026-04-17 10:15:11', verifyResult: '审核成功' },
  { taskId: 'MIS000000684', taskName: '04170954', userId: '1', userName: 'Super', bizType: '高速巡检', submitTime: '2026-04-17 09:55:13', verifyTime: '2026-04-17 09:55:13', verifyResult: '审核成功' },
  { taskId: 'MIS000000682', taskName: '04170909', userId: '1', userName: 'Super', bizType: '智慧物流', submitTime: '2026-04-17 09:28:51', verifyTime: '2026-04-17 09:28:51', verifyResult: '审核失败' },
  { taskId: 'MIS000000647', taskName: '04161648', userId: '1', userName: 'Super', bizType: '智慧物流', submitTime: '2026-04-16 16:49:08', verifyTime: '2026-04-16 16:49:08', verifyResult: '审核成功' },
  { taskId: 'MIS000000646', taskName: '04161529', userId: '1', userName: 'Super', bizType: '智慧物流', submitTime: '2026-04-16 15:29:59', verifyTime: '2026-04-16 15:29:59', verifyResult: '审核成功' },
  { taskId: 'MIS000000645', taskName: '04161527', userId: '1', userName: 'Super', bizType: '智慧物流', submitTime: '2026-04-16 15:27:51', verifyTime: '2026-04-16 15:27:51', verifyResult: '审核成功' },
  { taskId: 'MIS000000644', taskName: '04161347', userId: '1', userName: 'Super', bizType: '高速巡检', submitTime: '2026-04-16 13:48:32', verifyTime: '2026-04-16 13:48:32', verifyResult: '审核成功' },
  { taskId: 'MIS000000643', taskName: '04161147', userId: '1', userName: 'Super', bizType: '高速巡检', submitTime: '2026-04-16 11:48:47', verifyTime: '2026-04-16 11:48:47', verifyResult: '审核成功' },
  { taskId: 'MIS000000642', taskName: '0416-1136', userId: '1', userName: 'Super', bizType: '高速巡检', submitTime: '2026-04-16 11:37:11', verifyTime: '2026-04-16 11:37:11', verifyResult: '审核成功' },
  { taskId: 'MIS000000641', taskName: '11320416', userId: '1', userName: 'Super', bizType: '高速巡检', submitTime: '2026-04-16 11:32:54', verifyTime: '2026-04-16 11:32:54', verifyResult: '审核成功' },
  { taskId: 'MIS000000640', taskName: '11210416', userId: '1', userName: 'Super', bizType: '智慧物流', submitTime: '2026-04-16 11:21:30', verifyTime: '2026-04-16 11:21:30', verifyResult: '审核成功' },
  { taskId: 'MIS000000639', taskName: '04161058', userId: '1', userName: 'Super', bizType: '高速巡检', submitTime: '2026-04-16 10:58:47', verifyTime: '2026-04-16 10:58:47', verifyResult: '审核成功' },
  { taskId: 'MIS000000638', taskName: '04161039', userId: '1', userName: 'Super', bizType: '高速巡检', submitTime: '2026-04-16 10:40:21', verifyTime: '2026-04-16 10:40:21', verifyResult: '审核成功' },
  { taskId: 'MIS000000637', taskName: '04161037', userId: '1', userName: 'Super', bizType: '高速巡检', submitTime: '2026-04-16 10:38:03', verifyTime: '2026-04-16 10:38:03', verifyResult: '审核失败' },
  { taskId: 'MIS000000636', taskName: '04151610', userId: '1', userName: 'Super', bizType: '高速巡检', submitTime: '2026-04-15 16:13:38', verifyTime: '2026-04-15 16:13:38', verifyResult: '审核成功' },
  { taskId: 'MIS000000635', taskName: '0923', userId: '1', userName: 'Super', bizType: '智慧物流', submitTime: '2026-04-15 09:24:09', verifyTime: '2026-04-15 09:24:09', verifyResult: '审核成功' },
])

function doSearch() {
  loading.value = true
  setTimeout(() => { loading.value = false }, 300)
}

function resetFilters() {
  Object.assign(filter, { taskId: '', taskName: '' })
  doSearch()
}
</script>

<style scoped>
.user-task-page {
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
