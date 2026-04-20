<template>
  <div class="node-status-page">
    <div class="flex gap-4 mb-4 flex-shrink-0">
      <div class="custom-card flex-1 p-5 flex flex-col justify-between" style="min-height: 110px;">
        <div class="text-[13px] text-[#595959] mb-3">总录入规则数</div>
        <div class="text-[32px] font-normal text-[#333] leading-none">5</div>
      </div>
      <div class="custom-card flex-1 p-5 flex flex-col justify-between" style="min-height: 110px;">
        <div class="text-[13px] text-[#595959] mb-3">覆盖机型大类</div>
        <div class="text-[32px] font-normal text-[#333] leading-none text-2xl mt-1">4</div>
      </div>
      <div class="custom-card flex-1 p-5 flex flex-col justify-between" style="min-height: 110px;">
        <div class="text-[13px] text-[#595959] mb-3">高危红线阀值规则数 (RED)</div>
        <div class="text-[32px] font-normal text-[#ff4d4f] leading-none">3</div>
      </div>
    </div>
    
    <div class="custom-card flex-1 flex flex-col p-5 overflow-hidden">
      <div class="flex justify-between items-center mb-4">
        <div class="text-[14px] font-medium text-[#333] border-l-3 border-[#004b9e] pl-2 leading-none">机型气象阈值管控规则库</div>
        <el-button type="primary" @click="dialogVisible = true" class="custom-btn custom-btn-primary">
          新增规则配置
        </el-button>
      </div>

       <!-- 搜索区 -->
       <el-form class="search-form" label-width="80px">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="监控机型">
              <el-input placeholder="适用机型" class="w-full custom-el-input" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="探测物理量">
              <el-select placeholder="环境指标" class="w-full custom-el-select">
                <el-option label="阵风风速 (m/s)" value="wind" />
                <el-option label="降水量 (mm/h)" value="rain" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <div class="flex justify-end gap-2 h-[32px]">
              <el-button class="custom-btn">重置</el-button>
              <el-button type="primary" class="custom-btn custom-btn-primary">查询</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      
      <!-- 表格 -->
      <el-table
        :data="weatherRulesData"
        class="custom-el-table flex-1 mt-4"
        :header-cell-style="{ background: '#fafafa', color: '#8c8c8c', fontWeight: '500', fontSize: '13px', borderBottom: '1px solid #f0f0f0' }"
        :cell-style="{ color: '#333', fontSize: '13px', borderBottom: '1px solid #f5f5f5' }"
      >
        <el-table-column prop="uavCategory" label="适用机型型号" width="180" />
        <el-table-column label="判断条件 (条件式)" min-width="160">
          <template #default="{ row }">
             {{ row.metricType }} {{ row.operator }} {{ row.thresholdValue }}
          </template>
        </el-table-column>
        <el-table-column prop="severityLevel" label="触发预警等级" width="140">
          <template #default="{ row }">
             {{ row.severityLevel }} 管制
          </template>
        </el-table-column>
        <el-table-column prop="reasonTemplate" label="阻断提示模板" min-width="280" show-overflow-tooltip />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default>
            <span class="text-[#004b9e] cursor-pointer hover:text-[#005bc4] text-[13px] mr-3">编辑</span>
            <span class="text-[#ff4d4f] cursor-pointer hover:text-[#ff7875] text-[13px]">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" title="新增机型气象阈控制度" width="500px">
      <el-form label-width="100px" style="padding-right: 20px;">
        <el-form-item label="监控机型"><el-input placeholder="Micro_Quadcopter" class="custom-el-input" /></el-form-item>
        <el-form-item label="探测物理量"><el-input placeholder="WIND_SPEED" class="custom-el-input" /></el-form-item>
        <el-form-item label="预警阈值"><el-input placeholder="> 8.0" class="custom-el-input" /></el-form-item>
        <el-form-item label="界定等级"><el-input placeholder="ORANGE" class="custom-el-input" /></el-form-item>
        <el-form-item label="话术模板"><el-input type="textarea" placeholder="不支持阵风..." /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false" class="custom-btn">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false" class="custom-btn custom-btn-primary">保存推演规则</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const dialogVisible = ref(false)

const weatherRulesData = ref([
  { uavCategory: 'Micro_Quadcopter', metricType: 'WIND_SPEED', operator: '>=', thresholdValue: '8.0', severityLevel: 'ORANGE', reasonTemplate: '微型机抗风测试不合格，预测风速达 {val}m/s' },
  { uavCategory: 'Micro_Quadcopter', metricType: 'WIND_SPEED', operator: '>', thresholdValue: '12.0', severityLevel: 'RED', reasonTemplate: '极端流控，风速>{val}m/s 突破毁损边际' },
  { uavCategory: 'DJI_M300', metricType: 'WIND_SPEED', operator: '>=', thresholdValue: '18.0', severityLevel: 'RED', reasonTemplate: '工业无人机安全阈值熔断，台风级大风拦截' },
  { uavCategory: 'ALL', metricType: 'VISIBILITY', operator: '<', thresholdValue: '1.0', severityLevel: 'RED', reasonTemplate: '极低能见度，无盲降设备强行阻断起飞！' },
  { uavCategory: 'Micro_Quadcopter', metricType: 'PRECIPITATION', operator: '>', thresholdValue: '5.0', severityLevel: 'YELLOW', reasonTemplate: '中等降雨，微型机云台有进水短路风险' }
])
</script>

<style scoped>
.node-status-page { flex: 1; display: flex; flex-direction: column; padding: 16px; background: #f0f2f5; height: 100%; box-sizing: border-box; }
.custom-card { background: #ffffff; border: 1px solid #e8e8e8; border-radius: 4px; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04); }
.border-l-3 { border-left-width: 3px; }
.search-form :deep(.el-form-item) { margin-bottom: 0; }
.search-form :deep(.el-form-item__label) { color: #595959; font-size: 13px; font-weight: normal; }
:deep(.custom-el-input .el-input__wrapper), :deep(.custom-el-select .el-select__wrapper) { box-shadow: none !important; border: 1px solid #d9d9d9 !important; border-radius: 4px; padding: 0 11px; }
:deep(.custom-el-input .el-input__wrapper:hover), :deep(.custom-el-input .el-input__wrapper.is-focus), :deep(.custom-el-select .el-select__wrapper.is-hovering), :deep(.custom-el-select .el-select__wrapper.is-focused) { border-color: #004b9e !important; }
:deep(.el-input__inner) { color: #333; font-size: 13px; }
:deep(.el-input__inner::placeholder), :deep(.el-select__placeholder) { color: #bfbfbf; }
.custom-btn { height: 32px; padding: 0 16px; border-radius: 4px; font-size: 13px; border-color: #d9d9d9; color: #595959; }
.custom-btn:hover { color: #004b9e; border-color: #004b9e; background: #fff; }
.custom-btn-primary { background: #004b9e !important; border-color: #004b9e !important; color: #fff !important; }
.custom-btn-primary:hover { background: #005bc4 !important; border-color: #005bc4 !important; }
.custom-el-table { --el-table-border-color: transparent; --el-table-row-hover-bg-color: #f5f7fa; }
.custom-el-table::before { display: none; }
</style>
