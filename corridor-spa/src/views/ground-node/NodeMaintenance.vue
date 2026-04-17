<template>
  <div class="node-maintain-page">
    <!-- 搜索区 -->
    <div class="custom-card p-5 mb-4">
      <el-form :model="filter" class="search-form" label-width="80px">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="节点ID">
              <el-select v-model="filter.nodeId" placeholder="请选择节点ID" class="w-full custom-el-select">
                <el-option label="BSL000000130" value="BSL000000130" />
                <el-option label="BSL000000129" value="BSL000000129" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="节点名称">
              <el-input v-model="filter.name" placeholder="请输入节点名称" class="w-full custom-el-input" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="节点位置">
              <el-input v-model="filter.loc" placeholder="请输入节点位置" class="w-full custom-el-input" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="启用/禁用">
              <el-select v-model="filter.status" placeholder="请选择启用/禁用" class="w-full custom-el-select">
                <el-option label="启用" value="true" />
                <el-option label="禁用" value="false" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
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
        <el-button class="custom-btn-outline-primary" @click="handleCreate">
          <el-icon class="mr-1"><Plus /></el-icon> 新建节点
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
        <el-table-column prop="nodeId" label="节点ID" min-width="140" />
        <el-table-column prop="name" label="节点名称" min-width="160" show-overflow-tooltip />
        <el-table-column prop="ip" label="IP地址" min-width="140" />
        <el-table-column prop="loc" label="节点位置" min-width="180" show-overflow-tooltip />
        <el-table-column label="启用/禁用" width="100" align="center">
          <template #default="{ row }">
            <el-switch v-model="row.status" class="custom-switch" />
          </template>
        </el-table-column>
        <el-table-column prop="time" label="创建时间" width="180" />
        <el-table-column label="操作" width="140" fixed="right" align="center">
          <template #default="{ row }">
             <span class="text-[#004b9e] cursor-pointer hover:text-[#005bc4] text-[13px] mr-3" @click="handleEdit(row, 'detail')">详情</span>
             <span class="text-[#004b9e] cursor-pointer hover:text-[#005bc4] text-[13px] mr-3" @click="handleEdit(row, 'edit')">编辑</span>
             <span class="text-[#ff4d4f] cursor-pointer hover:text-[#ff7875] text-[13px]" @click="handleDelete(row)">删除</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页栏 -->
      <div class="flex justify-end items-center mt-4 text-[13px] text-[#8c8c8c]">
        <span class="mr-4">共 14 条</span>
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="14"
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
import { ref, reactive, onMounted } from 'vue'
import { ArrowUp, Plus, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const filter = reactive({ nodeId: '', name: '', loc: '', status: '' })
const pagination = reactive({ page: 1, pageSize: 10 })

// 造符合截图的数据
const list = ref([
  { id: 1, nodeId: 'BSL000000130', name: '弱电模拟节点', ip: '127.0.0.1', loc: '浙江省杭州市萧山区', status: true, time: '2026-03-13 08:36:04' },
  { id: 2, nodeId: 'BSL000000129', name: '杭甬测试节点三号', ip: '127.0.0.1', loc: '浙江省绍兴市越城区', status: true, time: '2026-02-06 14:46:02' },
  { id: 3, nodeId: 'BSL000000128', name: '杭甬测试节点二号', ip: '127.0.0.1', loc: '浙江省绍兴市越城区', status: false, time: '2026-02-06 14:44:56' },
  { id: 4, nodeId: 'BSL000000127', name: '杭甬测试节点一号', ip: '127.0.0.1', loc: '浙江省绍兴市越城区', status: true, time: '2026-02-06 14:43:32' },
  { id: 5, nodeId: 'BSL000000123', name: '杭甬节点6号', ip: '127.0.0.1', loc: '浙江省宁波市余姚市', status: true, time: '2026-01-20 20:54:05' },
  { id: 6, nodeId: 'BSL000000122', name: '杭甬节点5号', ip: '127.0.0.1', loc: '浙江省绍兴市上虞区', status: true, time: '2026-01-20 20:52:49' },
  { id: 7, nodeId: 'BSL000000121', name: '杭甬节点4号', ip: '127.0.0.1', loc: '浙江省绍兴市上虞区', status: true, time: '2026-01-20 20:51:13' },
  { id: 8, nodeId: 'BSL000000120', name: '杭甬节点3号', ip: '127.0.0.1', loc: '浙江省绍兴市上虞区', status: true, time: '2026-01-20 20:50:20' },
  { id: 9, nodeId: 'BSL000000119', name: '杭甬节点2号', ip: '127.0.0.1', loc: '浙江省绍兴市上虞区', status: true, time: '2026-01-20 20:49:24' },
  { id: 10, nodeId: 'BSL000000118', name: '杭甬节点1号', ip: '127.0.0.1', loc: '浙江省绍兴市柯桥区', status: true, time: '2026-01-20 20:48:24' },
])

function doSearch() {
  loading.value = true
  setTimeout(() => { loading.value = false }, 300)
}

function resetFilters() {
  Object.assign(filter, { nodeId: '', name: '', loc: '', status: '' })
  doSearch()
}

function handleCreate() {
  ElMessage.info('开发中...')
}

function handleBatchDelete() {
  ElMessageBox.confirm('确认删除勾选的节点吗？', '提示', { type: 'warning' }).catch(() => {})
}

function handleEdit(row: any, type: string) {
  ElMessage.info(`${type === 'edit' ? '编辑' : '详情'}节点: ${row.nodeId}`)
}

function handleDelete(row: any) {
  ElMessageBox.confirm(`确认删除节点 ${row.nodeId} 吗？`, '提示', { type: 'error' }).catch(() => {})
}

onMounted(() => {})
</script>

<style scoped>
.node-maintain-page {
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
  margin-bottom: 16px;
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
.custom-btn-outline-primary {
  height: 32px;
  line-height: 1;
  padding: 0 16px;
  border-radius: 4px;
  font-size: 13px;
  border-color: #004b9e !important;
  color: #004b9e !important;
  background: #fff !important;
}
.custom-btn-outline-primary:hover {
  background: #e6f0f9 !important;
}
.custom-btn-outline-danger {
  height: 32px;
  line-height: 1;
  padding: 0 16px;
  border-radius: 4px;
  font-size: 13px;
  border-color: #ff4d4f !important;
  color: #ff4d4f !important;
  background: #fff !important;
}
.custom-btn-outline-danger:hover {
  background: #fff1f0 !important;
}

/* Switch 颜色定制 */
.custom-switch { --el-switch-on-color: #004b9e; }

/* 表格边缘消除及多选框定制 */
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
