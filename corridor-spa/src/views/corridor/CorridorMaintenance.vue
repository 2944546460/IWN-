<template>
  <div class="corridor-maintain-page">
    <el-card class="search-card" :body-style="{ padding: '16px 20px' }">
      <el-form :model="filter" inline>
        <el-form-item label="廊道名称">
          <el-input v-model="filter.name" placeholder="支持模糊搜索" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="状态">
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

    <el-card class="table-card" :body-style="{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }">
      <div class="toolbar">
        <div />
        <el-button type="primary" plain :icon="Plus" @click="() => ElMessage.info('新建廊道（开发中）')">新建廊道</el-button>
      </div>

      <el-table :data="list" v-loading="loading" stripe style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: '600' }">
        <el-table-column label="序号" type="index" :index="indexOffset" width="60" align="center" />
        <el-table-column prop="corridorId" label="廊道编号" width="150"><template #default="{ row }"><span class="monospace">{{ row.corridorId }}</span></template></el-table-column>
        <el-table-column prop="name"       label="廊道名称" min-width="160" show-overflow-tooltip />
        <el-table-column prop="startPoint" label="起点"    min-width="120" show-overflow-tooltip />
        <el-table-column prop="endPoint"   label="终点"    min-width="120" show-overflow-tooltip />
        <el-table-column prop="length"     label="长度(km)" width="90" align="center" />
        <el-table-column prop="width"      label="宽度(m)"  width="80" align="center" />
        <el-table-column label="限高(m)" width="110" align="center">
          <template #default="{ row }">{{ row.minHeight }} ~ {{ row.maxHeight }}</template>
        </el-table-column>
        <el-table-column label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-switch v-model="row.status" active-color="#1890ff" />
          </template>
        </el-table-column>
        <el-table-column label="标识色" width="70" align="center">
          <template #default="{ row }">
            <div class="w-6 h-6 rounded mx-auto border" :style="{ backgroundColor: row.color }"></div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="110" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="() => ElMessage.info(`详情：${row.corridorId}`)">详情</el-button>
            <el-button type="warning" link size="small" @click="() => ElMessage.info(`编辑：${row.corridorId}`)">编辑</el-button>
            <el-button type="danger"  link size="small" @click="() => ElMessage.info(`删除：${row.corridorId}`)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-row">
        <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize"
          :total="total" :page-sizes="[10, 20]" layout="total, sizes, prev, pager, next, jumper"
          background small @current-change="loadList" @size-change="() => { pagination.page = 1; loadList() }" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getCorridorList } from '@/api/corridor'
import type { CorridorRecord } from '@/api/corridor'

const loading = ref(false)
const list = ref<CorridorRecord[]>([])
const total = ref(0)
const filter = reactive({ name: '', status: '' as '' | 'true' | 'false' })
const pagination = reactive({ page: 1, pageSize: 10 })
const indexOffset = computed(() => (pagination.page - 1) * pagination.pageSize + 1)

async function loadList() {
  loading.value = true
  try {
    const res = await getCorridorList({ name: filter.name || undefined, status: filter.status || undefined }, pagination)
    list.value = res.list; total.value = res.total
  } finally { loading.value = false }
}
function doSearch() { pagination.page = 1; loadList() }
function resetSearch() { Object.assign(filter, { name: '', status: '' }); doSearch() }
onMounted(loadList)
</script>

<style scoped>
.corridor-maintain-page{flex:1;display:flex;flex-direction:column;gap:16px;padding:20px;overflow-y:auto;background:#f0f2f5}
.search-card{flex-shrink:0;border-radius:6px}
.table-card{flex:1;border-radius:6px;display:flex;flex-direction:column;min-height:0}
.toolbar{display:flex;justify-content:flex-end;margin-bottom:14px}
.monospace{font-family:'Courier New',monospace;font-size:13px}
.pagination-row{display:flex;justify-content:flex-end;margin-top:16px;flex-shrink:0}
</style>
