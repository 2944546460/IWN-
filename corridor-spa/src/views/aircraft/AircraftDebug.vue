<template>
  <div class="aircraft-debug-page">
    <!-- 顶部控制条 -->
    <div class="custom-card p-4 mb-4 flex items-center">
      <div class="text-[14px] text-[#333] mr-4">飞行器</div>
      <el-select v-model="selectedAircraft" placeholder="请选择飞行器" class="w-[200px] custom-el-select mr-4">
        <el-option label="M300-01" value="m1" />
        <el-option label="T16-02" value="t2" />
      </el-select>
      <el-button type="primary" class="custom-btn-primary mr-6">连接</el-button>
      
      <div class="flex items-center text-[13px] text-[#595959] gap-4">
        <div>当前模式: <span class="text-[#333]">未知</span></div>
        <div>当前匹配状态: <span class="text-[#333]">未匹配</span></div>
      </div>
    </div>

    <!-- 中间区域 -->
    <div class="flex gap-4 mb-4 h-[260px]">
      <!-- 左：功能控制 -->
      <div class="custom-card flex-1 p-5 flex flex-col">
        <div class="text-[14px] font-medium text-[#333] border-l-3 border-[#1890ff] pl-2 mb-5 leading-none">功能控制</div>
        
        <div class="flex gap-3 mb-6">
          <el-button color="#1890ff" class="text-white border-0 shadow-sm w-[80px]">解锁</el-button>
          <el-button color="#fa8c16" class="text-white border-0 shadow-sm w-[80px]">锁定</el-button>
          <el-button color="#36cfc9" class="text-white border-0 shadow-sm w-[110px]">设置自动模式</el-button>
          <el-button color="#b37feb" class="text-white border-0 shadow-sm w-[110px]">设置手动模式</el-button>
        </div>

        <div class="text-[14px] font-medium text-[#333] border-l-3 border-[#1890ff] pl-2 mb-4 leading-none">起降控制</div>
        
        <div class="flex items-center gap-3">
          <div class="w-[180px] relative">
            <el-input v-model="altitude" placeholder="请输入起飞高度" class="custom-el-input h-[32px]" />
          </div>
          <span class="text-[#595959] text-[13px] mr-2">m</span>
          <el-button color="#1890ff" class="text-white border-0 shadow-sm w-[80px]">起飞</el-button>
          <el-button color="#fa8c16" class="text-white border-0 shadow-sm w-[80px]">降落</el-button>
        </div>
      </div>

      <!-- 右：飞行器状态数据 -->
      <div class="custom-card flex-1 p-5 flex flex-col">
        <div class="text-[14px] font-medium text-[#333] border-l-3 border-[#1890ff] pl-2 mb-4 leading-none">飞行器状态数据</div>
        
        <div class="grid grid-cols-2 gap-y-3 text-[13px] text-[#595959] pl-3 mb-6">
          <div>经纬度坐标：-</div>
          <div>航向方向：-</div>
          <div>海拔高度：-</div>
          <div>水平速度：-</div>
          <div>垂直速度：-</div>
          <div>俯仰角：-</div>
          <div>侧倾角：-</div>
          <div>横滚角：-</div>
        </div>

        <div class="text-[14px] font-medium text-[#333] border-l-3 border-[#1890ff] pl-2 mb-4 leading-none">飞行属性数据</div>
        <div class="text-[13px] text-[#595959] pl-3">当前 3s 内下行指令数量：-</div>
      </div>
    </div>

    <!-- 底部：实时指令 -->
    <div class="custom-card flex-1 flex flex-col p-5 overflow-hidden">
      <div class="text-[14px] font-medium text-[#333] mb-3 leading-none rounded">实时指令</div>
      <div class="flex-1 bg-[#1e1e1e] rounded-md flex items-center justify-center text-[#595959] text-[13px]">
        暂无数据
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedAircraft = ref('')
const altitude = ref('')
</script>

<style scoped>
.aircraft-debug-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: #f0f2f5;
  height: 100%;
  box-sizing: border-box;
}

.custom-card {
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.border-l-3 {
  border-left-width: 3px;
}

:deep(.custom-el-input .el-input__wrapper),
:deep(.custom-el-select .el-select__wrapper) {
  box-shadow: none !important;
  border: 1px solid #d9d9d9 !important;
  border-radius: 4px;
  padding: 0 11px;
  height: 32px;
}
:deep(.custom-el-input .el-input__wrapper:hover),
:deep(.custom-el-input .el-input__wrapper.is-focus),
:deep(.custom-el-select .el-select__wrapper.is-hovering),
:deep(.custom-el-select .el-select__wrapper.is-focused) {
  border-color: #1890ff !important;
}
:deep(.el-input__inner) {
  color: #333;
  font-size: 13px;
}
:deep(.el-input__inner::placeholder),
:deep(.el-select__placeholder) {
  color: #bfbfbf;
}

.custom-btn-primary {
  height: 32px;
  padding: 0 16px;
  border-radius: 4px;
  font-size: 13px;
  background: #1890ff !important;
  border-color: #1890ff !important;
  color: #fff !important;
}
.custom-btn-primary:hover {
  background: #40a9ff !important;
  border-color: #40a9ff !important;
}

:deep(.el-button) {
  border-radius: 4px;
  font-size: 13px;
  height: 32px;
}
</style>
