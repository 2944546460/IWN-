<template>
  <div class="beam-info-page">
    <el-card class="table-card" :body-style="{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }">
      <div class="toolbar">
        <div class="text-[15px] font-semibold text-[#303133]">波束信息列表</div>
        <el-button type="primary" plain :icon="Plus" @click="() => ElMessage.info('新建波束（开发中）')">新建</el-button>
      </div>

      <el-table :data="list" v-loading="loading" stripe style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: '600' }">
        <el-table-column label="序号" type="index" :index="indexOffset" width="60" align="center" />
        <el-table-column prop="beamId"       label="波束编号" width="150"><template #default="{ row }"><span class="font-mono">{{ row.beamId }}</span></template></el-table-column>
        <el-table-column prop="beamName"     label="波束名称" min-width="150" />
        <el-table-column prop="frequency"    label="工作频率" width="120" align="center" />
        <el-table-column prop="bandwidth"    label="信道带宽" width="120" align="center" />
        <el-table-column prop="corridorName" label="关联廊道" min-width="160" show-overflow-tooltip />
        <el-table-column prop="coverage"     label="覆盖范围描述" min-width="180" show-overflow-tooltip />
        <el-table-column label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-switch v-model="row.status" active-color="#1890ff" />
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="() => ElMessage.info(`详情：${row.beamId}`)">详情</el-button>
            <el-button type="warning" link size="small" @click="() => ElMessage.info(`编辑：${row.beamId}`)">编辑</el-button>
            <el-button type="danger"  link size="small" @click="() => ElMessage.info(`删除：${row.beamId}`)">删除</el-button>
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
import { getBeamList } from '@/api/modules'
import type { BeamRecord } from '@/api/modules'

const loading = ref(false)
const list = ref<BeamRecord[]>([])
const total = ref(0)
const pagination = reactive({ page: 1, pageSize: 10 })
const indexOffset = computed(() => (pagination.page - 1) * pagination.pageSize + 1)

async function loadList() {
  loading.value = true
  try {
    const res = await getBeamList(pagination)
    list.value = res.list; total.value = res.total
  } finally { loading.value = false }
}

onMounted(loadList)
</script>

<style scoped>
.beam-info-page{flex:1;display:flex;flex-direction:column;gap:16px;padding:20px;overflow-y:auto;background:#f0f2f5}
.table-card{flex:1;border-radius:6px;display:flex;flex-direction:column;min-height:0}
.toolbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
.pagination-row{display:flex;justify-content:flex-end;margin-top:16px;flex-shrink:0}
</style>
