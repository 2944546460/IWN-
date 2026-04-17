<template>
  <div class="ep-page">
    <el-card class="search-card" :body-style="{ padding: '16px 20px' }">
      <el-form :model="filter" inline>
        <el-form-item label="应急点名称">
          <el-input v-model="filter.name" placeholder="支持模糊搜索" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="filter.type" placeholder="全部" clearable style="width: 120px">
            <el-option label="迫降区"   value="迫降区" />
            <el-option label="紧急备降" value="紧急备降" />
            <el-option label="应急补给" value="应急补给" />
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
        <el-button type="primary" plain :icon="Plus" @click="() => ElMessage.info('新建应急点（开发中）')">新建</el-button>
      </div>

      <el-table :data="list" v-loading="loading" stripe style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: '600' }">
        <el-table-column label="序号" type="index" :index="indexOffset" width="60" align="center" />
        <el-table-column prop="epId"   label="应急点ID"   width="140"><template #default="{ row }"><span class="monospace">{{ row.epId }}</span></template></el-table-column>
        <el-table-column prop="name"   label="应急点名称" min-width="160" show-overflow-tooltip />
        <el-table-column label="类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.type === '迫降区' ? 'danger' : row.type === '紧急备降' ? 'warning' : 'primary'" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="坐标(纬,经)" width="170">
          <template #default="{ row }"><span class="monospace">{{ row.lat.toFixed(4) }}, {{ row.lng.toFixed(4) }}</span></template>
        </el-table-column>
        <el-table-column prop="area"    label="面积(m²)"  width="90"  align="center" />
        <el-table-column prop="contact" label="联系人"    width="90"  align="center" />
        <el-table-column prop="phone"   label="联系电话"  width="145" />
        <el-table-column label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'info'" size="small">{{ row.status ? '启用' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="175" />
        <el-table-column label="操作" width="110" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="() => ElMessage.info(`详情：${row.epId}`)">详情</el-button>
            <el-button type="warning" link size="small" @click="() => ElMessage.info(`编辑：${row.epId}`)">编辑</el-button>
            <el-button type="danger"  link size="small" @click="() => ElMessage.info(`删除：${row.epId}`)">删除</el-button>
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
import { getEmergencyPointList } from '@/api/corridor'
import type { EmergencyPointRecord } from '@/api/corridor'

const loading = ref(false)
const list = ref<EmergencyPointRecord[]>([])
const total = ref(0)
const filter = reactive({ name: '', type: '' })
const pagination = reactive({ page: 1, pageSize: 10 })
const indexOffset = computed(() => (pagination.page - 1) * pagination.pageSize + 1)

async function loadList() {
  loading.value = true
  try {
    const res = await getEmergencyPointList({ name: filter.name || undefined, type: filter.type || undefined }, pagination)
    list.value = res.list; total.value = res.total
  } finally { loading.value = false }
}
function doSearch() { pagination.page = 1; loadList() }
function resetSearch() { Object.assign(filter, { name: '', type: '' }); doSearch() }
onMounted(loadList)
</script>

<style scoped>
.ep-page{flex:1;display:flex;flex-direction:column;gap:16px;padding:20px;overflow-y:auto;background:#f0f2f5}
.search-card{flex-shrink:0;border-radius:6px}
.table-card{flex:1;border-radius:6px;display:flex;flex-direction:column;min-height:0}
.toolbar{display:flex;justify-content:flex-end;margin-bottom:14px}
.monospace{font-family:'Courier New',monospace;font-size:13px}
.pagination-row{display:flex;justify-content:flex-end;margin-top:16px;flex-shrink:0}
</style>
