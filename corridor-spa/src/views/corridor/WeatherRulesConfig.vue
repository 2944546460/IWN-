<script setup lang="ts">
import { ref } from 'vue'
import { Setup, Warning, WarnTriangleFilled, Edit, List } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// ---- 数据定义 ----
// 多旋翼参数
const multiRotorConfig = ref({
  windSpeed: 10,
  precipitation: 10,
  visibility: 1000,
  tempRange: [-10, 40]
})

// 垂直起降/复合翼参数
const vtolConfig = ref({
  windSpeed: 15,
  precipitation: 15,
  visibility: 1000,
  tempRange: [-10, 40]
})

// 纯固定翼参数
const fixedWingConfig = ref({
  windSpeed: 20,
  precipitation: 25,
  visibility: 1000,
  tempRange: [-10, 40]
})

// ---- 方法 ----
const handleSave = (type: string) => {
  ElMessage.success(`[${type}] 气象运行规则已保存并生效`)
}

const handleLog = (type: string) => {
  ElMessage.info(`查看 [${type}] 修改日志`)
}
</script>

<template>
  <div class="h-full flex flex-col p-6 bg-slate-50 overflow-auto">
    <!-- 顶部提示区 -->
    <div class="mb-6">
      <el-alert
        title="配置提醒：修改以下机型类别的气象阈值后，系统将结合最新气象网格数据，自动重算并生成未来24小时的【多级气象禁飞区】。请谨慎操作。"
        type="warning"
        show-icon
        :closable="false"
        class="!py-3"
      />
    </div>

    <!-- 核心配置区 -->
    <el-row :gutter="24" class="flex-1">
      <!-- 卡片 1：多旋翼 -->
      <el-col :span="8">
        <el-card shadow="hover" class="h-full flex flex-col config-card" :body-style="{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0' }">
          <div class="card-header bg-amber-50/50 p-4 border-b border-gray-100 flex items-start justify-between">
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 rounded bg-amber-100 flex items-center justify-center text-amber-600">
                <i class="ri-flight-takeoff-line text-xl"></i>
              </div>
              <div>
                <h3 class="text-base font-bold text-gray-800 m-0 leading-tight">多旋翼无人机<span class="text-xs text-gray-400 ml-1 font-normal">(Multi-rotor)</span></h3>
              </div>
            </div>
          </div>
          <div class="p-4 bg-white">
            <el-tag type="warning" effect="light" class="mb-5 !border-amber-200 !text-amber-600 !bg-amber-50">
              <template #default>
                <div class="flex items-center gap-1">
                  <el-icon><Warning /></el-icon>
                  影响：三级禁飞区 (轻度恶劣)
                </div>
              </template>
            </el-tag>

            <el-form label-width="120px" label-position="left" class="config-form">
              <el-form-item label="风速上限">
                <el-input-number v-model="multiRotorConfig.windSpeed" :min="0" :max="50" :step="1" class="w-full" controls-position="right">
                  <template #suffix>m/s</template>
                </el-input-number>
              </el-form-item>
              <el-form-item label="降水量上限">
                <el-input-number v-model="multiRotorConfig.precipitation" :min="0" :max="100" :step="1" class="w-full" controls-position="right">
                  <template #suffix>mm/h</template>
                </el-input-number>
              </el-form-item>
              <el-form-item label="能见度下限">
                <el-input-number v-model="multiRotorConfig.visibility" :min="0" :max="20000" :step="100" class="w-full" controls-position="right">
                  <template #suffix>m</template>
                </el-input-number>
              </el-form-item>
              <el-form-item label="工作温度">
                <div class="px-2 w-full">
                  <el-slider v-model="multiRotorConfig.tempRange" range :min="-40" :max="80" :marks="{ 0: '0℃' }" />
                </div>
              </el-form-item>
            </el-form>
          </div>
          <div class="mt-auto p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <el-button link type="info" @click="handleLog('多旋翼无人机')">
              <el-icon class="mr-1"><List /></el-icon> 修改日志
            </el-button>
            <el-button type="primary" @click="handleSave('多旋翼无人机')">
              保存配置
            </el-button>
          </div>
        </el-card>
      </el-col>

      <!-- 卡片 2：垂直起降/复合翼 -->
      <el-col :span="8">
        <el-card shadow="hover" class="h-full flex flex-col config-card" :body-style="{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0' }">
          <div class="card-header bg-orange-50/50 p-4 border-b border-gray-100 flex items-start justify-between">
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 rounded bg-orange-100 flex items-center justify-center text-orange-600">
                <i class="ri-plane-line text-xl"></i>
              </div>
              <div>
                <h3 class="text-base font-bold text-gray-800 m-0 leading-tight">垂直起降/复合翼<span class="text-xs text-gray-400 ml-1 font-normal">(VTOL)</span></h3>
              </div>
            </div>
          </div>
          <div class="p-4 bg-white">
            <el-tag type="warning" effect="dark" color="#f97316" class="mb-5 !border-none !text-white">
              <template #default>
                <div class="flex items-center gap-1">
                  <el-icon><WarnTriangleFilled /></el-icon>
                  影响：二级禁飞区 (中度恶劣)
                </div>
              </template>
            </el-tag>

            <el-form label-width="120px" label-position="left" class="config-form">
              <el-form-item label="风速上限">
                <el-input-number v-model="vtolConfig.windSpeed" :min="0" :max="50" :step="1" class="w-full" controls-position="right">
                  <template #suffix>m/s</template>
                </el-input-number>
              </el-form-item>
              <el-form-item label="降水量上限">
                <el-input-number v-model="vtolConfig.precipitation" :min="0" :max="100" :step="1" class="w-full" controls-position="right">
                  <template #suffix>mm/h</template>
                </el-input-number>
              </el-form-item>
              <el-form-item label="能见度下限">
                <el-input-number v-model="vtolConfig.visibility" :min="0" :max="20000" :step="100" class="w-full" controls-position="right">
                  <template #suffix>m</template>
                </el-input-number>
              </el-form-item>
              <el-form-item label="工作温度">
                <div class="px-2 w-full">
                  <el-slider v-model="vtolConfig.tempRange" range :min="-40" :max="80" :marks="{ 0: '0℃' }" />
                </div>
              </el-form-item>
            </el-form>
          </div>
          <div class="mt-auto p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <el-button link type="info" @click="handleLog('垂直起降/复合翼')">
              <el-icon class="mr-1"><List /></el-icon> 修改日志
            </el-button>
            <el-button type="primary" color="#f97316" @click="handleSave('垂直起降/复合翼')">
              保存配置
            </el-button>
          </div>
        </el-card>
      </el-col>

      <!-- 卡片 3：纯固定翼 -->
      <el-col :span="8">
        <el-card shadow="hover" class="h-full flex flex-col config-card" :body-style="{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0' }">
          <div class="card-header bg-red-50/50 p-4 border-b border-gray-100 flex items-start justify-between">
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 rounded bg-red-100 flex items-center justify-center text-red-600">
                <i class="ri-send-plane-fill text-xl"></i>
              </div>
              <div>
                <h3 class="text-base font-bold text-gray-800 m-0 leading-tight">纯固定翼无人机<span class="text-xs text-gray-400 ml-1 font-normal">(Fixed-wing)</span></h3>
              </div>
            </div>
          </div>
          <div class="p-4 bg-white">
            <el-tag type="danger" effect="dark" class="mb-5 !border-none">
              <template #default>
                <div class="flex items-center gap-1">
                  <el-icon><Warning /></el-icon>
                  影响：一级绝对禁飞区 (极端恶劣)
                </div>
              </template>
            </el-tag>

            <el-form label-width="120px" label-position="left" class="config-form">
              <el-form-item label="风速上限">
                <el-input-number v-model="fixedWingConfig.windSpeed" :min="0" :max="50" :step="1" class="w-full" controls-position="right">
                  <template #suffix>m/s</template>
                </el-input-number>
              </el-form-item>
              <el-form-item label="降水量上限">
                <el-input-number v-model="fixedWingConfig.precipitation" :min="0" :max="100" :step="1" class="w-full" controls-position="right">
                  <template #suffix>mm/h</template>
                </el-input-number>
              </el-form-item>
              <el-form-item label="能见度下限">
                <el-input-number v-model="fixedWingConfig.visibility" :min="0" :max="20000" :step="100" class="w-full" controls-position="right">
                  <template #suffix>m</template>
                </el-input-number>
              </el-form-item>
              <el-form-item label="工作温度">
                <div class="px-2 w-full">
                  <el-slider v-model="fixedWingConfig.tempRange" range :min="-40" :max="80" :marks="{ 0: '0℃' }" />
                </div>
              </el-form-item>
            </el-form>
          </div>
          <div class="mt-auto p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <el-button link type="info" @click="handleLog('纯固定翼无人机')">
              <el-icon class="mr-1"><List /></el-icon> 修改日志
            </el-button>
            <el-button type="danger" @click="handleSave('纯固定翼无人机')">
              保存配置
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.config-card {
  border: none;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}
.config-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
}
.config-form .el-form-item {
  margin-bottom: 24px;
}
.config-form :deep(.el-input-number.is-controls-right .el-input__wrapper) {
  padding-left: 12px;
  padding-right: 60px;
}
</style>
