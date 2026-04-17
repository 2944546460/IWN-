<template>
  <div class="node-maintain-page">
    <!-- 搜索区 -->
    <el-card class="search-card" :body-style="{ padding: '16px 20px' }">
      <el-form :model="filter" inline>
        <el-form-item label="节点ID">
          <el-input v-model="filter.nodeId" placeholder="精确搜索节点ID" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="节点名称">
          <el-input v-model="filter.name" placeholder="支持模糊搜索" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="节点位置">
          <el-input v-model="filter.loc" placeholder="支持模糊搜索" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="启用/禁用">
          <el-select v-model="filter.status" placeholder="全部" clearable style="width: 120px">
            <el-option label="启用" value="true" />
            <el-option label="禁用" value="false" />
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
          <span v-if="selectedIds.length" class="selected-tip">
            已选 <b>{{ selectedIds.length }}</b> 项
          </span>
        </div>
        <div class="toolbar-right">
          <el-button type="primary" plain :icon="Plus" @click="showCreateTip">新建节点</el-button>
          <el-button type="danger" plain :icon="Delete" :disabled="selectedIds.length === 0" @click="batchDelete">批量删除</el-button>
        </div>
      </div>

      <!-- 表格 -->
      <el-table
        ref="tableRef"
        :data="list"
        v-loading="loading"
        stripe
        row-key="id"
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: '600' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="46" />
        <el-table-column label="序号" type="index" :index="indexOffset" width="60" align="center" />
        <el-table-column prop="nodeId" label="节点ID" width="160">
          <template #default="{ row }">
            <span class="monospace">{{ row.nodeId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="节点名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="ip" label="IP地址" width="140">
          <template #default="{ row }">
            <span class="monospace">{{ row.ip }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="loc" label="节点位置" min-width="180" show-overflow-tooltip />
        <el-table-column label="启用/禁用" width="90" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :before-change="() => confirmToggle(row)"
              active-color="#1890ff"
            />
          </template>
        </el-table-column>
        <el-table-column prop="time" label="创建时间" width="180" />
        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="showDetail(row)">详情</el-button>
            <el-button
              type="warning" link size="small"
              :disabled="row.status"
              :title="row.status ? '启用状态不可编辑' : ''"
              @click="showEdit(row)"
            >编辑</el-button>
            <el-button
              type="danger" link size="small"
              :disabled="row.status"
              :title="row.status ? '启用状态不可删除' : ''"
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
import { getNodeList, toggleNodeStatus, deleteNode, batchDeleteNodes } from '@/api/groundNode'
import type { GroundNode } from '@/mock/groundNode'

// ---- 状态 ----
const loading = ref(false)
const list = ref<GroundNode[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])
const tableRef = ref()

const filter = reactive({ nodeId: '', name: '', loc: '', status: '' as '' | 'true' | 'false' })
const pagination = reactive({ page: 1, pageSize: 10 })

const indexOffset = computed(() => (pagination.page - 1) * pagination.pageSize + 1)

// ---- 数据加载 ----
async function loadList() {
  loading.value = true
  try {
    const res = await getNodeList(
      {
        nodeId: filter.nodeId || undefined,
        name: filter.name || undefined,
        loc: filter.loc || undefined,
        status: filter.status || undefined,
      },
      pagination
    )
    list.value = res.list
    total.value = res.total
  } finally {
    loading.value = false
  }
}

function doSearch() {
  pagination.page = 1
  loadList()
}

function resetSearch() {
  Object.assign(filter, { nodeId: '', name: '', loc: '', status: '' })
  pagination.page = 1
  loadList()
  ElMessage.success('筛选条件已重置')
}

// ---- 行选中 ----
function handleSelectionChange(rows: GroundNode[]) {
  selectedIds.value = rows.map(r => r.id)
}

// ---- 切换开关 ----
async function confirmToggle(row: GroundNode): Promise<boolean> {
  const action = row.status ? '禁用' : '启用'
  try {
    await ElMessageBox.confirm(
      `确认将节点 ${row.nodeId} 设置为「${action}」状态？`,
      '状态变更确认',
      { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
    )
    await toggleNodeStatus(row.id)
    ElMessage.success(`节点 ${row.nodeId} 已${action}`)
    // 刷新统计数据（直接重新拉列表）
    await loadList()
    return false  // 由 loadList 更新 row.status，before-change 不实际改变模型
  } catch {
    return false  // 取消操作
  }
}

// ---- 单条删除 ----
async function singleDelete(row: GroundNode) {
  if (row.status) {
    ElMessage.warning('启用状态的节点不可删除')
    return
  }
  try {
    await ElMessageBox.confirm(
      `确认删除节点「${row.name}」（${row.nodeId}）吗？此操作不可撤销。`,
      '删除确认',
      { confirmButtonText: '确认删除', cancelButtonText: '取消', type: 'error' }
    )
    await deleteNode(row.id)
    ElMessage.success('节点已删除')
    if (list.value.length === 1 && pagination.page > 1) pagination.page--
    await loadList()
  } catch {
    // 用户取消
  }
}

// ---- 批量删除 ----
async function batchDelete() {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请先勾选需要删除的节点')
    return
  }
  const selected = list.value.filter(n => selectedIds.value.includes(n.id))
  const activeCount = selected.filter(n => n.status).length
  const inactiveCount = selected.length - activeCount

  if (inactiveCount === 0) {
    ElMessage.warning('所选节点均为启用状态，受系统保护不可删除')
    return
  }

  const msg = activeCount > 0
    ? `将删除 ${inactiveCount} 个未启用节点；${activeCount} 个已启用节点受保护，将自动跳过。`
    : `确认批量删除已选的 ${inactiveCount} 个未启用节点？`

  try {
    await ElMessageBox.confirm(msg, '批量删除确认', {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
    const result = await batchDeleteNodes(selectedIds.value)
    ElMessage.success(`成功删除 ${result.deleted} 个节点${result.skipped > 0 ? `，跳过 ${result.skipped} 个启用节点` : ''}`)
    selectedIds.value = []
    await loadList()
  } catch {
    // 用户取消
  }
}

// ---- 占位提示 ----
const showCreateTip = () => ElMessage.info('新建弹窗组件开发中')
const showDetail = (row: GroundNode) => ElMessage.info(`查看节点详情：${row.nodeId}（开发中）`)
const showEdit = (row: GroundNode) => {
  if (row.status) { ElMessage.warning('启用状态不可编辑'); return }
  ElMessage.info(`编辑节点：${row.nodeId}（开发中）`)
}

// ---- 生命周期 ----
onMounted(loadList)
</script>

<style scoped>
.node-maintain-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  overflow-y: auto;
  background: #f0f2f5;
}

.search-card {
  flex-shrink: 0;
  border-radius: 6px;
}

.table-card {
  flex: 1;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.toolbar-left {
  font-size: 14px;
}

.selected-tip {
  color: #1890ff;
  background: #ecf5ff;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 13px;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

.monospace {
  font-family: 'Courier New', monospace;
  font-size: 13px;
}

.pagination-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  flex-shrink: 0;
}
</style>
