<template>
  <div class="aircraft-info-page">
    <!-- 搜索区 -->
    <div class="custom-card p-5 mb-4">
      <el-form :model="filter" class="search-form" label-width="80px">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="飞行器ID">
              <el-input v-model="filter.aircraftId" placeholder="请输入飞行器ID" class="w-full custom-el-input" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="飞行器名称">
              <el-input v-model="filter.name" placeholder="请输入飞行器名称" class="w-full custom-el-input" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备号">
              <el-input v-model="filter.deviceNo" placeholder="请输入设备号" class="w-full custom-el-input" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="生产厂家">
              <el-select v-model="filter.manufacturer" placeholder="请选择生产厂家" class="w-full custom-el-select">
                <el-option label="大疆创新" value="dji" />
                <el-option label="极飞科技" value="xa" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="飞行器型号">
              <el-select v-model="filter.model" placeholder="请选择飞行器型号" class="w-full custom-el-select">
                <el-option label="M300" value="M300" />
                <el-option label="T16" value="T16" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="可用状态">
              <el-select v-model="filter.available" placeholder="请选择可用状态" class="w-full custom-el-select">
                <el-option label="可用" value="yes" />
                <el-option label="不可用" value="no" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="在线状态">
              <el-select v-model="filter.online" placeholder="请选择在线状态" class="w-full custom-el-select">
                <el-option label="在线" value="online" />
                <el-option label="离线" value="offline" />
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
          <el-icon class="mr-1"><Plus /></el-icon> 新建飞行器
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
        <el-table-column prop="aircraftId" label="飞行器ID" min-width="120" />
        <el-table-column prop="name" label="飞行器名称" min-width="140" />
        <el-table-column label="设备号" min-width="120">
          <template #default="{ row }">-</template>
        </el-table-column>
        <el-table-column prop="manufacturer" label="生产厂家" min-width="180" show-overflow-tooltip />
        <el-table-column prop="model" label="飞行器型号" min-width="120" />
        <el-table-column label="可用状态" width="100">
          <template #default>可用</template>
        </el-table-column>
        <el-table-column label="在线状态" width="100">
          <template #default>
            <div class="flex items-center">
              <span class="w-1.5 h-1.5 rounded-full bg-[#bfbfbf] mr-2"></span>离线
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right" align="center">
          <template #default="{ row }">
             <span class="text-[#004b9e] cursor-pointer hover:text-[#005bc4] text-[13px] mr-3">详情</span>
             <span class="text-[#004b9e] cursor-pointer hover:text-[#005bc4] text-[13px] mr-3">编辑</span>
             <span class="text-[#ff4d4f] cursor-pointer hover:text-[#ff7875] text-[13px]">删除</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页栏 -->
      <div class="flex justify-end items-center mt-4 text-[13px] text-[#8c8c8c]">
        <span class="mr-4">共 27 条</span>
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="27"
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
const filter = reactive({ aircraftId: '', name: '', deviceNo: '', manufacturer: '', model: '', available: '', online: '' })
const pagination = reactive({ page: 1, pageSize: 10 })

// 造一点符合截图的数据
const list = ref([
  { aircraftId: '50', name: '回龙巢11', manufacturer: '浙江省交通集团技术研究院', model: 'T16' },
  { aircraftId: '49', name: '真机drone07', manufacturer: '浙江省交通集团技术研究院', model: 'T16' },
  { aircraftId: '48', name: '真机drone01', manufacturer: '浙江省交通集团技术研究院', model: 'T16' },
  { aircraftId: '47', name: '真机drone5402', manufacturer: '浙江省交通集团技术研究院', model: 'T16' },
  { aircraftId: '46', name: '真机drone5403', manufacturer: '浙江省交通集团技术研究院', model: 'T16' },
  { aircraftId: '45', name: '真机drone5401', manufacturer: '浙江省交通集团技术研究院', model: 'T16' },
  { aircraftId: '44', name: '总裁测试十号', manufacturer: '浙江省交通集团技术研究院', model: 'T16' },
  { aircraftId: '43', name: '总裁测试九号', manufacturer: '浙江省交通集团技术研究院', model: 'T16' },
  { aircraftId: '42', name: '总裁测试八号', manufacturer: '浙江省交通集团技术研究院', model: 'T16' },
  { aircraftId: '41', name: '总裁测试七号', manufacturer: '浙江省交通集团技术研究院', model: 'T16' },
])

function doSearch() {
  loading.value = true
  setTimeout(() => { loading.value = false }, 300)
}

function resetFilters() {
  Object.assign(filter, { aircraftId: '', name: '', deviceNo: '', manufacturer: '', model: '', available: '', online: '' })
  doSearch()
}

function handleCreate() {
  ElMessage.info('打开新建弹窗')
}

function handleBatchDelete() {
  ElMessageBox.confirm('确认删除选中的飞行器吗？', '提示', { type: 'warning' })
    .then(() => ElMessage.success('删除成功'))
    .catch(() => {})
}

onMounted(() => {
  // load data
})
</script>

<style scoped>
.aircraft-info-page {
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
