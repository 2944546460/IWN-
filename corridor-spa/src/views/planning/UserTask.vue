<template>
  <div class="user-task-page">
    <div class="flex gap-4 mb-4 flex-shrink-0">
      <div class="custom-card flex-1 p-5 flex flex-col justify-between" style="min-height: 96px;">
        <div class="text-[13px] text-[#595959] mb-3">今日申请数</div>
        <div class="text-[32px] font-normal text-[#333] leading-none">{{ stats.today }}</div>
      </div>
      <div class="custom-card flex-1 p-5 flex flex-col justify-between" style="min-height: 96px;">
        <div class="text-[13px] text-[#595959] mb-3">待审批任务数</div>
        <div class="text-[32px] font-normal text-[#333] leading-none">{{ stats.pending }}</div>
      </div>
      <div class="custom-card flex-1 p-5 flex flex-col justify-between" style="min-height: 96px;">
        <div class="text-[13px] text-[#595959] mb-3">阻断任务数</div>
        <div class="text-[32px] font-normal leading-none" :class="stats.blocked > 0 ? 'text-[#ff4d4f]' : 'text-[#333]'">
          {{ stats.blocked }}
        </div>
      </div>
    </div>

    <div class="custom-card flex-1 flex flex-col p-5 overflow-hidden">
      <div class="section-title">任务信息列表</div>

      <el-form :model="filter" class="search-form">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="任务 ID" label-width="72px">
              <el-input
                v-model="filter.taskId"
                placeholder="请输入任务 ID"
                clearable
                class="w-full custom-el-input"
                @change="resetPage"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="任务名称" label-width="72px">
              <el-input
                v-model="filter.taskName"
                placeholder="请输入任务名称"
                clearable
                class="w-full custom-el-input"
                @change="resetPage"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="业务类型" label-width="72px">
              <el-select
                v-model="filter.bizType"
                placeholder="全部"
                clearable
                class="w-full custom-el-select"
                @change="resetPage"
              >
                <el-option label="全部" value="" />
                <el-option v-for="item in bizTypeOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="预检状态" label-width="72px">
              <el-select
                v-model="filter.precheckStatus"
                placeholder="全部"
                clearable
                class="w-full custom-el-select"
                @change="resetPage"
              >
                <el-option label="全部" value="" />
                <el-option v-for="item in precheckOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="flex justify-end gap-2 h-[32px] mb-2">
          <el-button @click="resetFilters" class="custom-btn">重置</el-button>
          <el-button type="primary" @click="loadList" class="custom-btn custom-btn-primary">查询</el-button>
        </div>
      </el-form>

      <el-table
        :data="pagedList"
        v-loading="loading"
        class="custom-el-table flex-1 mt-2"
        :header-cell-style="tableHeaderStyle"
        :cell-style="tableCellStyle"
      >
        <el-table-column label="序号" type="index" :index="indexOffset" width="60" align="center" />
        <el-table-column prop="taskId" label="任务 ID" min-width="150" />
        <el-table-column prop="taskName" label="任务名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="bizType" label="业务类型" min-width="110" />
        <el-table-column prop="corridorName" label="计划廊道" min-width="180" show-overflow-tooltip />
        <el-table-column prop="uavClass" label="机型类别" min-width="100" align="center">
          <template #default="{ row }">
            <span class="uav-tag" :class="uavClassStyle(row.uavClass)">{{ row.uavClass }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="planTime" label="计划起飞时间" min-width="150" />
        <el-table-column prop="precheckStatus" label="预检状态" min-width="110" align="center">
          <template #default="{ row }">
            <span class="status-tag" :class="precheckClass(row.precheckStatus)">{{ precheckLabel(row.precheckStatus) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="verifyResult" label="审批状态" min-width="100" align="center">
          <template #default="{ row }">
            <span :class="approveClass(row.verifyResult)">{{ row.verifyResult }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="90" align="center" fixed="right">
          <template #default="{ row }">
            <span class="action-link" @click="goToDetail(row)">详情</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex justify-end items-center mt-4 text-[13px] text-[#8c8c8c]">
        <span class="mr-4">共 {{ filteredList.length }} 条</span>
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="filteredList.length"
          :page-sizes="[10, 20, 50]"
          layout="prev, pager, next, sizes, jumper"
          background
          class="custom-pagination"
          @current-change="loadList"
          @size-change="resetPage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

type PrecheckStatus = 'pending' | 'pass' | 'risk' | 'blocked' | 'all-day-blocked'

interface TaskItem {
  taskId: string
  taskName: string
  bizType: string
  corridorName: string
  uavClass: string
  planTime: string
  precheckStatus: PrecheckStatus
  verifyResult: string
}

const router = useRouter()
const loading = ref(false)

const filter = reactive({
  taskId: '',
  taskName: '',
  bizType: '',
  precheckStatus: '',
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
})

const sourceList = ref<TaskItem[]>([
  {
    taskId: 'MIS000000718',
    taskName: '长清高速例行巡检',
    bizType: '高速巡检',
    corridorName: 'G56 杭瑞高速西延段',
    uavClass: '多旋翼',
    planTime: '2026-04-22 14:00',
    precheckStatus: 'pending',
    verifyResult: '待审批',
  },
  {
    taskId: 'MIS000000717',
    taskName: '临安医疗紧急配送',
    bizType: '应急物流',
    corridorName: '临安医疗专用廊道',
    uavClass: 'VTOL',
    planTime: '2026-04-22 15:30',
    precheckStatus: 'pass',
    verifyResult: '待审批',
  },
  {
    taskId: 'MIS000000716',
    taskName: '滨江电力通道巡线',
    bizType: '电力巡检',
    corridorName: '滨江东段巡检廊道',
    uavClass: '固定翼',
    planTime: '2026-04-22 16:00',
    precheckStatus: 'blocked',
    verifyResult: '已阻断',
  },
  {
    taskId: 'MIS000000715',
    taskName: '西湖景区低空拍摄',
    bizType: '文旅航拍',
    corridorName: '西湖景区环湖廊道',
    uavClass: '多旋翼',
    planTime: '2026-04-22 17:00',
    precheckStatus: 'risk',
    verifyResult: '待调整',
  },
  {
    taskId: 'MIS000000714',
    taskName: '余杭物流常态配送',
    bizType: '智慧物流',
    corridorName: '余杭北向物流廊道',
    uavClass: 'VTOL',
    planTime: '2026-04-22 18:20',
    precheckStatus: 'all-day-blocked',
    verifyResult: '全天禁飞',
  },
])

const list = ref<TaskItem[]>([])

const precheckOptions = [
  { label: '待预检', value: 'pending' },
  { label: '预检通过', value: 'pass' },
  { label: '存在风险', value: 'risk' },
  { label: '气象阻断', value: 'blocked' },
  { label: '全天候禁飞', value: 'all-day-blocked' },
]

const bizTypeOptions = computed(() => [...new Set(sourceList.value.map(item => item.bizType))])

const filteredList = computed(() =>
  sourceList.value.filter(item => {
    if (filter.taskId && !item.taskId.includes(filter.taskId)) return false
    if (filter.taskName && !item.taskName.includes(filter.taskName)) return false
    if (filter.bizType && item.bizType !== filter.bizType) return false
    if (filter.precheckStatus && item.precheckStatus !== filter.precheckStatus) return false
    return true
  }),
)

const pagedList = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize
  return list.value.slice(start, start + pagination.pageSize)
})

const indexOffset = computed(() => (pagination.page - 1) * pagination.pageSize + 1)

const stats = computed(() => ({
  today: sourceList.value.length,
  pending: sourceList.value.filter(item => item.verifyResult === '待审批').length,
  blocked: sourceList.value.filter(item => ['blocked', 'all-day-blocked'].includes(item.precheckStatus)).length,
}))

const tableHeaderStyle = {
  background: '#fafafa',
  color: '#8c8c8c',
  fontWeight: '500',
  fontSize: '13px',
  borderBottom: '1px solid #f0f0f0',
}

const tableCellStyle = {
  color: '#333',
  fontSize: '13px',
  borderBottom: '1px solid #f5f5f5',
}

function loadList() {
  loading.value = true
  window.setTimeout(() => {
    list.value = filteredList.value
    loading.value = false
  }, 200)
}

function resetPage() {
  pagination.page = 1
  loadList()
}

function resetFilters() {
  Object.assign(filter, {
    taskId: '',
    taskName: '',
    bizType: '',
    precheckStatus: '',
  })
  resetPage()
}

function goToDetail(row: TaskItem) {
  router.push(`/planning/user-task/detail/${row.taskId}`)
}

function uavClassStyle(cls: string) {
  if (cls === '多旋翼') return 'uav-multirotor'
  if (cls === '固定翼') return 'uav-fixedwing'
  if (cls === 'VTOL') return 'uav-vtol'
  return 'uav-default'
}

function precheckClass(status: PrecheckStatus) {
  const map: Record<PrecheckStatus, string> = {
    pending: 'status-pending',
    pass: 'status-pass',
    risk: 'status-risk',
    blocked: 'status-blocked',
    'all-day-blocked': 'status-all-day',
  }
  return map[status]
}

function precheckLabel(status: PrecheckStatus) {
  const map: Record<PrecheckStatus, string> = {
    pending: '待预检',
    pass: '预检通过',
    risk: '存在风险',
    blocked: '气象阻断',
    'all-day-blocked': '全天候禁飞',
  }
  return map[status]
}

function approveClass(status: string) {
  if (status === '已阻断' || status === '全天禁飞') return 'text-[#ff4d4f] font-medium'
  if (status === '待审批' || status === '待调整') return 'text-[#004b9e] font-medium'
  return 'text-[#333]'
}

loadList()
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

.custom-card {
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.section-title {
  margin-bottom: 16px;
  padding-left: 8px;
  border-left: 3px solid #004b9e;
  font-size: 14px;
  line-height: 1;
  font-weight: 500;
  color: #333;
}

.search-form :deep(.el-form-item) {
  margin-bottom: 0;
}

.search-form :deep(.el-form-item__label) {
  color: #595959;
  font-size: 13px;
  font-weight: normal;
}

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

.custom-btn {
  height: 32px;
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

.status-tag,
.uav-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  height: 24px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid transparent;
  white-space: nowrap;
}

.uav-multirotor {
  color: #1677ff;
  background: #f0f7ff;
  border-color: #b6d7ff;
}

.uav-fixedwing {
  color: #52c41a;
  background: #f6ffed;
  border-color: #b7eb8f;
}

.uav-vtol {
  color: #fa8c16;
  background: #fff7e6;
  border-color: #ffd591;
}

.uav-default {
  color: #595959;
  background: #fafafa;
  border-color: #d9d9d9;
}

.status-pending {
  color: #1677ff;
  background: #f0f7ff;
  border-color: #91caff;
}

.status-pass {
  color: #52c41a;
  background: #f6ffed;
  border-color: #b7eb8f;
}

.status-risk {
  color: #fa8c16;
  background: #fff7e6;
  border-color: #ffd591;
}

.status-blocked {
  color: #ff4d4f;
  background: #fff1f0;
  border-color: #ffb3b3;
}

.status-all-day {
  color: #ffffff;
  background: #3a0f14;
  border-color: #3a0f14;
}

.action-link {
  color: #004b9e;
  cursor: pointer;
  font-size: 13px;
}

.action-link:hover {
  color: #005bc4;
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
