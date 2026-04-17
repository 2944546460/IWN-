<template>
  <div class="user-task-page">
    <!-- 搜索区 -->
    <el-card class="search-card" :body-style="{ padding: '16px 20px' }">
      <el-form :model="filter" inline>
        <el-form-item label="任务名称">
          <el-input v-model="filter.taskName" placeholder="支持模糊搜索" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="任务状态">
          <el-select v-model="filter.status" placeholder="全部" clearable style="width: 130px">
            <el-option label="待执行" value="待执行" />
            <el-option label="执行中" value="执行中" />
            <el-option label="已完成" value="已完成" />
            <el-option label="已取消" value="已取消" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="filter.priority" placeholder="全部" clearable style="width: 100px">
            <el-option label="高" value="高" />
            <el-option label="中" value="中" />
            <el-option label="低" value="低" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetSearch">重置</el-button>
          <el-button type="primary" @click="doSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格卡片 -->
    <el-card class="table-card" :body-style="{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }">
      <!-- 工具栏 -->
      <div class="toolbar">
        <div class="toolbar-left">
          <span v-if="selectedIds.length" class="selected-tip">已选 <b>{{ selectedIds.length }}</b> 项</span>
        </div>
        <div class="toolbar-right">
          <el-button type="primary" plain :icon="Plus" @click="() => ElMessage.info('新建任务弹窗开发中')">新建任务</el-button>
          <el-button type="danger"  plain :icon="Delete" :disabled="!selectedIds.length" @click="batchDelete">批量删除</el-button>
        </div>
      </div>

      <!-- 表格 -->
      <el-table
        :data="list"
        v-loading="loading"
        stripe
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: '600' }"
        @selection-change="rows => selectedIds = rows.map((r: any) => r.id)"
      >
        <el-table-column type="selection" width="46" />
        <el-table-column label="序号" type="index" :index="indexOffset" width="60" align="center" />
        <el-table-column prop="taskId" label="任务ID" width="140">
          <template #default="{ row }">
            <span class="monospace">{{ row.taskId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="taskName" label="任务名称" min-width="160" show-overflow-tooltip />
        <el-table-column prop="taskType" label="任务类型" width="100" />
        <el-table-column prop="corridorName" label="关联廊道" min-width="160" show-overflow-tooltip />
        <el-table-column prop="aircraftModel" label="机型" width="140" />
        <el-table-column label="计划时间" width="150">
          <template #default="{ row }">{{ row.planDate }} {{ row.planTime }}</template>
        </el-table-column>
        <el-table-column prop="operator" label="操作人" width="80" align="center" />
        <el-table-column label="优先级" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="priorityTagType(row.priority)" size="small">{{ row.priority }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <span :class="['status-badge', statusBadgeClass(row.status)]">{{ row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="() => ElMessage.info(`任务详情：${row.taskId}（开发中）`)">详情</el-button>
            <el-button type="warning" link size="small"
              :disabled="row.status === '执行中' || row.status === '已完成'"
              @click="() => ElMessage.info(`编辑任务：${row.taskId}（开发中）`)"
            >编辑</el-button>
            <el-button type="danger" link size="small"
              :disabled="row.status === '执行中'"
              @click="singleDelete(row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-row">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          background
          small
          @current-change="loadList"
          @size-change="() => { pagination.page = 1; loadList() }"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getPlanningTaskList } from '@/api/modules'
import type { PlanningTask } from '@/api/modules'

const loading = ref(false)
const list = ref<PlanningTask[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

const filter = reactive({ taskName: '', status: '', priority: '' })
const pagination = reactive({ page: 1, pageSize: 10 })
const indexOffset = computed(() => (pagination.page - 1) * pagination.pageSize + 1)

async function loadList() {
  loading.value = true
  try {
    const res = await getPlanningTaskList(
      { taskName: filter.taskName || undefined, status: filter.status || undefined, priority: filter.priority || undefined },
      pagination
    )
    list.value = res.list
    total.value = res.total
  } finally {
    loading.value = false
  }
}

function doSearch() { pagination.page = 1; loadList() }
function resetSearch() {
  Object.assign(filter, { taskName: '', status: '', priority: '' })
  pagination.page = 1
  loadList()
}

async function singleDelete(row: PlanningTask) {
  if (row.status === '执行中') { ElMessage.warning('执行中的任务不可删除'); return }
  try {
    await ElMessageBox.confirm(`确认删除任务「${row.taskName}」？`, '删除确认', { type: 'warning' })
    ElMessage.success('任务已删除（Mock 演示，刷新后恢复）')
    list.value = list.value.filter(t => t.id !== row.id)
    total.value--
  } catch {}
}

async function batchDelete() {
  if (!selectedIds.value.length) { ElMessage.warning('请先勾选需要删除的任务'); return }
  try {
    await ElMessageBox.confirm(`确认批量删除已选的 ${selectedIds.value.length} 个任务？`, '批量删除确认', { type: 'warning' })
    list.value = list.value.filter(t => !selectedIds.value.includes(t.id))
    total.value -= selectedIds.value.length
    selectedIds.value = []
    ElMessage.success('批量删除成功')
  } catch {}
}

function priorityTagType(p: string) {
  return p === '高' ? 'danger' : p === '中' ? 'warning' : 'info'
}

function statusBadgeClass(s: string) {
  if (s === '执行中') return 'badge-normal'
  if (s === '待执行') return 'badge-warning'
  if (s === '已取消') return 'badge-info'
  return 'badge-normal' // 已完成用绿色
}

onMounted(loadList)
</script>

<style scoped>
.user-task-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  overflow-y: auto;
  background: #f0f2f5;
}
.search-card { flex-shrink: 0; border-radius: 6px; }
.table-card  { flex: 1; border-radius: 6px; display: flex; flex-direction: column; min-height: 0; }
.toolbar     { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.toolbar-right { display: flex; gap: 8px; }
.selected-tip  { color: #1890ff; background: #ecf5ff; padding: 4px 10px; border-radius: 4px; font-size: 13px; }
.monospace     { font-family: 'Courier New', monospace; font-size: 13px; }
.pagination-row { display: flex; justify-content: flex-end; margin-top: 16px; flex-shrink: 0; }
</style>
