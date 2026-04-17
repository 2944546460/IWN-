<template>
  <div class="turn-zone-page">
    <el-card class="search-card" :body-style="{ padding: '16px 20px' }">
      <el-form :model="filter" inline>
        <el-form-item label="转弯区名称">
          <el-input v-model="filter.name" placeholder="支持模糊搜索" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="关联廊道">
          <el-input v-model="filter.corridorName" placeholder="支持模糊搜索" clearable style="width: 200px" />
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
        <div class="toolbar-right">
          <el-button type="primary" plain :icon="Plus" @click="() => ElMessage.info('新建转弯区（开发中）')">新建</el-button>
        </div>
      </div>

      <el-table
        :data="list" v-loading="loading" stripe style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: '600' }"
      >
        <el-table-column label="序号" type="index" :index="indexOffset" width="60" align="center" />
        <el-table-column prop="zoneId"       label="转弯区ID"   width="140"><template #default="{ row }"><span class="monospace">{{ row.zoneId }}</span></template></el-table-column>
        <el-table-column prop="name"         label="转弯区名称"  min-width="160" show-overflow-tooltip />
        <el-table-column prop="corridorName" label="关联廊道"    min-width="150" show-overflow-tooltip />
        <el-table-column label="坐标 (纬,经)" width="170">
          <template #default="{ row }">
            <span class="monospace">{{ row.lat.toFixed(4) }}, {{ row.lng.toFixed(4) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="radius"     label="转弯半径(m)" width="110" align="center" />
        <el-table-column prop="bankAngle"  label="坡度角(°)"   width="100" align="center" />
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'info'" size="small">{{ row.status ? '启用' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="175" />
        <el-table-column label="操作" width="110" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="() => ElMessage.info(`详情：${row.zoneId}`)">详情</el-button>
            <el-button type="warning" link size="small" @click="() => ElMessage.info(`编辑：${row.zoneId}`)">编辑</el-button>
            <el-button type="danger"  link size="small" @click="() => ElMessage.info(`删除：${row.zoneId}`)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-row">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="total"
          :page-sizes="[10, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          background small
          @current-change="loadList"
          @size-change="() => { pagination.page = 1; loadList() }"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getTurnZoneList } from '@/api/corridor'
import type { TurnZoneRecord } from '@/api/corridor'

const loading = ref(false)
const list = ref<TurnZoneRecord[]>([])
const total = ref(0)
const filter = reactive({ name: '', corridorName: '' })
const pagination = reactive({ page: 1, pageSize: 10 })
const indexOffset = computed(() => (pagination.page - 1) * pagination.pageSize + 1)

async function loadList() {
  loading.value = true
  try {
    const res = await getTurnZoneList({ name: filter.name || undefined, corridorName: filter.corridorName || undefined }, pagination)
    list.value = res.list; total.value = res.total
  } finally { loading.value = false }
}

function doSearch() { pagination.page = 1; loadList() }
function resetSearch() { Object.assign(filter, { name: '', corridorName: '' }); doSearch() }
onMounted(loadList)
</script>

<style scoped>
.turn-zone-page{flex:1;display:flex;flex-direction:column;gap:16px;padding:20px;overflow-y:auto;background:#f0f2f5}
.search-card{flex-shrink:0;border-radius:6px}
.table-card{flex:1;border-radius:6px;display:flex;flex-direction:column;min-height:0}
.toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.toolbar-right{display:flex;gap:8px}
.monospace{font-family:'Courier New',monospace;font-size:13px}
.pagination-row{display:flex;justify-content:flex-end;margin-top:16px;flex-shrink:0}
</style>
