<template>
  <div class="user-task-page">
    <!-- 搜索区 -->
    <div class="custom-card p-4 mb-4">
      <el-form :model="filter" class="search-form" label-width="80px">
        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="任务ID">
              <el-input v-model="filter.taskId" placeholder="输入任务ID" class="w-full custom-el-input" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="任务名称">
              <el-input v-model="filter.taskName" placeholder="请输入任务名称" class="w-full custom-el-input" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="失败原因">
              <el-select v-model="filter.failReason" placeholder="全部" class="w-full custom-el-select" clearable>
                <el-option label="全部" value="" />
                <el-option label="人工驳回" value="manual" />
                <el-option label="气象自动阻断" value="weather" />
                <el-option label="空域冲突" value="airspace" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="核验结果">
              <el-select v-model="filter.verifyResult" placeholder="全部" class="w-full custom-el-select" clearable>
                <el-option label="全部" value="" />
                <el-option label="审核成功" value="审核成功" />
                <el-option label="审核失败" value="审核失败" />
                <el-option label="待核验" value="待核验" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="flex justify-end gap-2 h-[32px]">
              <el-button @click="resetFilters" class="custom-btn">重置</el-button>
              <el-button type="primary" @click="doSearch" class="custom-btn custom-btn-primary">查询</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 列表区 -->
    <div class="custom-card flex-1 flex flex-col p-5 overflow-hidden relative">
      <div class="flex justify-between items-center mb-4">
        <div class="text-[14px] font-medium text-[#333] leading-none">用户任务信息</div>
        <el-button class="custom-btn-primary" @click="showCreateDialog = true">
          <el-icon class="mr-1"><Plus /></el-icon> 新建飞行任务
        </el-button>
      </div>

      <!-- 数据表格 -->
      <el-table
        :data="filteredList"
        v-loading="loading"
        class="custom-el-table flex-1 mt-2"
        :header-cell-style="{ background: '#fafafa', color: '#8c8c8c', fontWeight: '500', fontSize: '13px', borderBottom: '1px solid #f0f0f0' }"
        :cell-style="{ color: '#333', fontSize: '13px', borderBottom: '1px solid #f5f5f5' }"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column prop="taskId" label="任务ID" min-width="150" />
        <el-table-column prop="taskName" label="任务名称" min-width="110" />
        <el-table-column label="拟飞机型" min-width="160">
          <template #default="scope">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="text-[13px]">{{ scope.row.uavName }}</span>
              <span class="uav-class-badge" :class="uavClassStyle(scope.row.uavClass)">{{ scope.row.uavClass }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="系统预检" width="170" align="center">
          <template #default="scope">
            <div class="flex justify-center">
              <!-- 通过状态 -->
              <span v-if="scope.row.precheckStatus === 'pass'" class="precheck-badge precheck-pass">
                <i class="ri-checkbox-circle-fill mr-0.5"></i> 系统预检通过
              </span>
              <!-- 一级气象熔断 -->
              <span v-else-if="scope.row.precheckStatus === 'block-l1'" class="precheck-badge precheck-block-l1">
                🔴 一级气象熔断
              </span>
              <!-- 二级气象熔断 -->
              <span v-else-if="scope.row.precheckStatus === 'block-l2'" class="precheck-badge precheck-block-l2">
                🟠 二级气象熔断
              </span>
              <!-- 三级气象熔断 -->
              <span v-else-if="scope.row.precheckStatus === 'block-l3'" class="precheck-badge precheck-block-l3">
                🟡 三级气象熔断
              </span>
              <!-- 人工驳回 -->
              <span v-else-if="scope.row.precheckStatus === 'manual-reject'" class="precheck-badge precheck-manual">
                <i class="ri-user-unfollow-line mr-0.5"></i> 人工驳回
              </span>
              <!-- 待检 -->
              <span v-else class="precheck-badge precheck-pending">
                <i class="ri-time-line mr-0.5"></i> 预检中…
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="bizType" label="业务类型" width="100" align="center" />
        <el-table-column prop="submitTime" label="提交时间" min-width="158" align="center" />
        <el-table-column prop="verifyResult" label="核验结果" width="100" align="center">
          <template #default="scope">
            <span :class="resultClass(scope.row.verifyResult)">{{ scope.row.verifyResult }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" fixed="right" align="center">
          <template #default="scope">
            <span class="text-[#004b9e] cursor-pointer hover:text-[#005bc4] text-[13px]" @click="openDetail(scope.row)">详情</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页栏 -->
      <div class="flex justify-end items-center mt-4 text-[13px] text-[#8c8c8c]">
        <el-pagination
          class="custom-pagination"
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50]"
          :background="false"
          layout="total, prev, pager, next, sizes, jumper"
          :total="filteredList.length"
        />
      </div>
    </div>

    <!-- =============== 新建任务对话框 =============== -->
    <el-dialog v-model="showCreateDialog" title="新建飞行任务" width="500px" destroy-on-close :close-on-click-modal="false" class="custom-radius-dialog">
      <el-form label-position="top" class="custom-light-form">
        <el-form-item label="任务名称" required>
          <el-input v-model="newTask.name" placeholder="请输入任务名称" class="custom-el-input" />
        </el-form-item>
        <el-form-item label="拟执飞机型" required>
          <el-select v-model="newTask.uavType" placeholder="选择作业无人机型" class="w-full custom-el-select">
            <el-option label="大疆 M300 (抗风弱)" value="DJI" />
            <el-option label="微型四旋翼 (微风)" value="Micro_Quadcopter" />
            <el-option label="固定翼无人机 (巡航)" value="FixedWing_Light" />
            <el-option label="工业级防雨大负载" value="Heavy_Industry" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务预计起飞时间窗口" required>
          <el-select v-model="newTask.timeOffset" placeholder="请选择时间偏移" class="w-full custom-el-select">
            <el-option v-for="h in [0, 3, 6, 9, 12, 24]" :key="h" :label="h === 0 ? '即刻 (当前实况)' : `稍后 (未来 ${h} 小时)`" :value="h" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showCreateDialog = false" class="custom-btn">取消</el-button>
          <el-button type="primary" @click="submitCreate" class="custom-btn-primary">保存任务</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- =============== 气象预警拦截弹窗 =============== -->
    <el-dialog v-model="showInterceptDialog" title="系统安全拦截" width="520px" :show-close="false" :close-on-click-modal="false" class="custom-danger-dialog">
      <div class="flex items-start gap-4">
        <div class="text-[40px] text-[#ff4d4f] leading-none mt-1"><i class="ri-error-warning-fill"></i></div>
        <div class="flex-1">
          <div class="font-bold text-[#ff4d4f] text-[16px] mb-2 font-mono">WARNING: 遭遇气象禁飞区阻断</div>
          <div class="text-[14px] text-[#595959] leading-relaxed bg-[#fff1f0] border border-[#ffa39e] p-3 rounded">
            <p class="mb-1 text-[#434343]">检测到您的任务属性与当前气象管制规则严重冲突：</p>
            <ul class="list-disc ml-5 my-2 text-[#ff4d4f] font-bold">
               <li>管制区域：{{ conflictInfo?.name }}</li>
               <li>异常气象：{{ conflictInfo?.reason }}</li>
            </ul>
            <p class="text-[#cf1322]">
               根据系统判定，您的选中机型 <span class="bg-[#ff4d4f] text-white px-2 py-0.5 rounded mx-1">{{ newTask.uavType }}</span> 因抗风雨指标不达标，在该时段内被<strong>禁止</strong>划入此空域！
            </p>
          </div>
        </div>
      </div>
      <div class="mt-4 bg-[#f6ffed] border border-[#b7eb8f] rounded p-3 text-[14px] text-[#389e0d]">
         <div class="font-bold mb-1 flex items-center gap-1"><i class="ri-lightbulb-flash-line text-[16px]"></i> AI 智能推荐</div>
         <div>通过预测推演，系统预估在 <strong>未来 {{ conflictInfo?.suggestTime }} 小时</strong> 之后气象管制将解除。是否一键调整任务时段为您规避风险？</div>
      </div>
      <template #footer>
        <div class="flex justify-between items-center w-full">
           <span class="text-[#8c8c8c] text-[12px]">安全第一，防患未然</span>
           <div>
             <el-button @click="showInterceptDialog = false" class="custom-btn">驳回并手动修改</el-button>
             <el-button type="success" class="custom-btn" style="background:#52c41a; color:white; border-color:#52c41a;" @click="applySuggestion">接受推荐时段并提交</el-button>
           </div>
        </div>
      </template>
    </el-dialog>

    <!-- =============== 任务详情/核验 抽屉 =============== -->
    <el-drawer
      v-model="showDetailDrawer"
      size="80%"
      :title="'任务详情与核验 — ' + (selectedTask?.taskId || '')"
      direction="rtl"
      destroy-on-close
    >
      <template #header>
        <div class="flex items-center gap-3">
          <span class="font-bold text-[15px]">任务详情与核验</span>
          <span class="text-[13px] text-[#8c8c8c] font-normal">{{ selectedTask?.taskId }}</span>
          <span class="precheck-badge ml-2" :class="selectedTask ? getPrecheckBadgeClass(selectedTask.precheckStatus) : ''">
            {{ selectedTask ? getPrecheckLabel(selectedTask.precheckStatus) : '' }}
          </span>
        </div>
      </template>

      <div class="detail-layout h-full flex gap-4 overflow-hidden">
        <!-- 左侧信息面板 -->
        <div class="detail-left flex flex-col gap-4 overflow-y-auto pr-1" style="width: 400px; flex-shrink: 0;">

          <!-- 【新增】系统预检报告 -->
          <div v-if="selectedTask" class="precheck-report-block" :class="selectedTask.precheckStatus === 'pass' ? 'report-pass' : 'report-block'">
            <div class="report-title">
              <i :class="selectedTask.precheckStatus === 'pass' ? 'ri-checkbox-circle-fill text-green-600' : 'ri-alarm-warning-fill text-red-500'"></i>
              系统航线气象预检报告
            </div>
            <div v-if="selectedTask.precheckStatus === 'pass'" class="report-body text-green-800">
              ✅ <strong>航线气象预检通过</strong>：未来飞行时段内（14:00-15:00），沿途网格未触发 <span class="uav-class-badge inline" :class="uavClassStyle(selectedTask.uavClass)">{{ selectedTask.uavClass }}</span> 禁飞限制，飞行条件良好。
            </div>
            <div v-else class="report-body text-red-800">
              <div class="mb-2">❌ <strong>气象强制阻断</strong>：已检测到以下冲突：</div>
              <div class="conflict-item">
                <div>📍 冲突网格：<strong class="text-red-600">{{ selectedTask.conflictGrid }}</strong></div>
                <div>⚠️ 触发规则：<strong>{{ selectedTask.conflictReason }}</strong></div>
                <div>🚫 限制机型：<span class="uav-class-badge inline" :class="uavClassStyle(selectedTask.uavClass)">{{ selectedTask.uavClass }}</span> 不满足适航条件</div>
              </div>
              <div class="mt-2 text-[12px] text-red-500 font-bold">⚠ 因气象安全锁定，【审核通过】操作已被系统强制禁用。</div>
            </div>
          </div>

          <!-- 任务基本信息 -->
          <div class="info-section">
            <div class="info-section-title"><i class="ri-file-info-line"></i> 任务基本信息</div>
            <div class="info-grid">
              <div class="info-row"><span class="info-label">任务ID</span><span class="info-value font-mono text-[12px]">{{ selectedTask?.taskId }}</span></div>
              <div class="info-row"><span class="info-label">任务名称</span><span class="info-value">{{ selectedTask?.taskName }}</span></div>
              <div class="info-row"><span class="info-label">业务类型</span><span class="info-value">{{ selectedTask?.bizType }}</span></div>
              <div class="info-row"><span class="info-label">提交用户</span><span class="info-value">{{ selectedTask?.userName }} (ID: {{ selectedTask?.userId }})</span></div>
              <div class="info-row"><span class="info-label">拟飞机型</span>
                <span class="info-value flex items-center gap-1.5">
                  {{ selectedTask?.uavName }}
                  <span class="uav-class-badge" :class="uavClassStyle(selectedTask?.uavClass || '')">{{ selectedTask?.uavClass }}</span>
                </span>
              </div>
            </div>
          </div>

          <!-- 任务执行信息 -->
          <div class="info-section">
            <div class="info-section-title"><i class="ri-flight-takeoff-line"></i> 任务执行信息</div>
            <div class="info-grid">
              <div class="info-row"><span class="info-label">计划起飞时间</span><span class="info-value">2026-04-20 14:00:00</span></div>
              <div class="info-row"><span class="info-label">预计降落时间</span><span class="info-value">2026-04-20 15:00:00</span></div>
              <div class="info-row"><span class="info-label">航线廊道</span><span class="info-value">G56 杭瑞高速廊道(西延段)</span></div>
              <div class="info-row"><span class="info-label">飞行高度</span><span class="info-value">120 m AGL</span></div>
              <div class="info-row"><span class="info-label">提交时间</span><span class="info-value">{{ selectedTask?.submitTime }}</span></div>
            </div>
          </div>

          <!-- 底部操作区 -->
          <div class="action-footer">
            <template v-if="selectedTask?.precheckStatus === 'pass'">
              <el-button class="custom-btn" @click="showDetailDrawer = false">取消</el-button>
              <el-button type="danger" plain @click="handleManualReject">人工驳回</el-button>
              <el-button type="primary" class="custom-btn-primary" @click="handleApprove">审核通过</el-button>
            </template>
            <template v-else>
              <div class="w-full flex flex-col gap-2">
                <div class="text-[12px] text-red-500 mb-1 flex items-center gap-1">
                  <i class="ri-lock-line"></i> 审核通过已被气象安全锁定，请选择以下降级方案：
                </div>
                <div class="flex gap-2">
                  <el-button class="custom-btn flex-1" @click="handleManualReject">人工强制驳回</el-button>
                  <el-button type="warning" class="flex-1" plain @click="showTimelineDrawer = true">
                    📅 智能顺延：寻找适飞窗口
                  </el-button>
                  <el-button type="success" class="flex-1" plain @click="handleReroute">
                    🗺️ 空间重规划：生成绕行航线
                  </el-button>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- 右侧地图显示区 -->
        <div class="detail-right flex-1 flex flex-col gap-3 overflow-hidden">
          <div class="map-header flex items-center justify-between">
            <span class="font-bold text-[14px] text-[#333]"><i class="ri-map-2-line mr-1"></i>3D 航线态势图</span>
            <div class="flex items-center gap-3 text-[12px] text-[#595959]">
              <span class="flex items-center gap-1"><span class="legend-line bg-blue-500"></span>规划航线</span>
              <span v-if="selectedTask && selectedTask.precheckStatus !== 'pass'" class="flex items-center gap-1"><span class="legend-line bg-red-500 border-dashed"></span>冲突段</span>
              <span v-if="showReroute" class="flex items-center gap-1"><span class="legend-line bg-green-500 border-dashed"></span>绕行备选</span>
            </div>
          </div>

          <!-- 3D 地图模拟画布 -->
          <div class="map-canvas flex-1 relative overflow-hidden rounded-xl border border-gray-200" ref="mapCanvasRef">
            <canvas ref="canvas3dRef" class="w-full h-full" style="background: linear-gradient(160deg, #0a1628 0%, #0d2240 50%, #0a1e38 100%)"></canvas>

            <!-- 地图图例覆盖层 -->
            <div v-if="selectedTask && selectedTask.precheckStatus !== 'pass'" class="absolute top-3 left-3 bg-black/60 text-white text-[11px] rounded p-2 backdrop-blur-sm">
              <div class="font-bold text-red-400 mb-1">⚠ 气象冲突告警</div>
              <div>冲突网格：{{ selectedTask.conflictGrid }}</div>
              <div>阻断级别：{{ selectedTask.conflictLevel }}</div>
            </div>

            <!-- 绕行方案提示 -->
            <div v-if="showReroute" class="absolute bottom-3 left-3 bg-green-900/80 text-white text-[12px] rounded p-3 border border-green-500 backdrop-blur-sm max-w-[280px]">
              <div class="font-bold text-green-300 mb-1">✅ 绕行方案已生成</div>
              <div class="text-green-100">已为您找到一条安全绕行廊道，预计增加飞行距离 <strong>1.2 km</strong>，是否替换原航线？</div>
              <div class="flex gap-2 mt-2">
                <el-button size="small" type="success" @click="confirmReroute">确认替换</el-button>
                <el-button size="small" plain class="!text-white !border-white/40" @click="showReroute = false">取消</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>

    <!-- =============== 智能顺延时间轴抽屉 =============== -->
    <el-drawer v-model="showTimelineDrawer" title="📅 智能适飞时间窗口推荐" size="440px" direction="rtl">
      <div class="p-2">
        <el-alert title="系统已分析未来 24 小时网格气象预报，以下为推荐的安全飞行时段：" type="info" show-icon :closable="false" class="mb-4" />
        <div class="timeline-list space-y-3">
          <div v-for="slot in timeSlots" :key="slot.id" class="timeline-slot" :class="slot.status === 'safe' ? 'slot-safe' : 'slot-danger'">
            <div class="flex items-center justify-between">
              <div>
                <span class="font-bold text-[14px]">{{ slot.time }}</span>
                <el-tag :type="slot.status === 'safe' ? 'success' : 'danger'" size="small" class="ml-2">{{ slot.label }}</el-tag>
              </div>
              <el-button v-if="slot.status === 'safe'" type="primary" size="small" @click="applyTimeSlot(slot)">一键顺延至此</el-button>
            </div>
            <div class="text-[12px] text-[#595959] mt-1">{{ slot.desc }}</div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { mockNoFlyZones } from '@/mock/weatherData'

// ========== 类型定义 ==========
interface TaskItem {
  taskId: string
  taskName: string
  userId: string
  userName: string
  bizType: string
  submitTime: string
  verifyTime: string
  verifyResult: string
  uavType: string
  uavName: string
  uavClass: string
  precheckStatus: 'pass' | 'block-l1' | 'block-l2' | 'block-l3' | 'manual-reject' | 'pending'
  conflictGrid?: string
  conflictReason?: string
  conflictLevel?: string
  failReason?: string
}

const loading = ref(false)
const filter = reactive({ taskId: '', taskName: '', failReason: '', verifyResult: '' })
const pagination = reactive({ page: 1, pageSize: 20 })

const list = ref<TaskItem[]>([
  { taskId: 'MIS000000689', taskName: '0417巡检', userId: '1', userName: 'Super', bizType: '智慧物流', submitTime: '2026-04-17 11:23:12', verifyTime: '2026-04-17 11:23:12', verifyResult: '审核成功', uavType: 'Heavy_Industry', uavName: '工业级防雨大负载', uavClass: '多旋翼', precheckStatus: 'pass' },
  { taskId: 'MIS000000688', taskName: '04171116快递', userId: '1', userName: 'Super', bizType: '智慧物流', submitTime: '2026-04-17 11:17:16', verifyTime: '2026-04-17 11:17:18', verifyResult: '审核成功', uavType: 'Heavy_Industry', uavName: '工业级防雨大负载', uavClass: '多旋翼', precheckStatus: 'pass' },
  { taskId: 'MIS000000687', taskName: '04171034巡检', userId: '1', userName: 'Super', bizType: '高速巡检', submitTime: '2026-04-17 10:34:52', verifyTime: '2026-04-17 10:34:52', verifyResult: '审核失败', uavType: 'DJI', uavName: '大疆 M300', uavClass: '多旋翼', precheckStatus: 'block-l1', conflictGrid: 'Grid-A02-15', conflictReason: '预报阵风达 22m/s，触发固定翼及多旋翼全线阈值', conflictLevel: '一级绝对禁飞', failReason: 'weather' },
  { taskId: 'MIS000000686', taskName: '4171032物流', userId: '1', userName: 'Super', bizType: '智慧物流', submitTime: '2026-04-17 10:32:51', verifyTime: '2026-04-17 10:32:51', verifyResult: '审核失败', uavType: 'Micro_Quadcopter', uavName: '微型四旋翼', uavClass: '多旋翼', precheckStatus: 'block-l3', conflictGrid: 'Grid-B05-22', conflictReason: '阵风 12m/s 超出多旋翼安全阈值 (10m/s)', conflictLevel: '三级禁飞', failReason: 'weather' },
  { taskId: 'MIS000000685', taskName: '04171014巡检', userId: '1', userName: 'Super', bizType: '高速巡检', submitTime: '2026-04-17 10:15:11', verifyTime: '2026-04-17 10:15:11', verifyResult: '审核成功', uavType: 'FixedWing_Light', uavName: '固定翼巡航', uavClass: '固定翼', precheckStatus: 'pass' },
  { taskId: 'MIS000000684', taskName: '04170954巡检', userId: '1', userName: 'Super', bizType: '高速巡检', submitTime: '2026-04-17 09:55:13', verifyTime: '2026-04-17 09:55:13', verifyResult: '审核成功', uavType: 'FixedWing_Light', uavName: '固定翼巡航', uavClass: '固定翼', precheckStatus: 'pass' },
  { taskId: 'MIS000000682', taskName: '04170909货运', userId: '1', userName: 'Super', bizType: '智慧物流', submitTime: '2026-04-17 09:28:51', verifyTime: '2026-04-17 09:28:51', verifyResult: '审核失败', uavType: 'DJI', uavName: '大疆 M300', uavClass: '多旋翼', precheckStatus: 'manual-reject', failReason: 'manual' },
  { taskId: 'MIS000000647', taskName: '04161648物流', userId: '1', userName: 'Super', bizType: '智慧物流', submitTime: '2026-04-16 16:49:08', verifyTime: '2026-04-16 16:49:08', verifyResult: '审核成功', uavType: 'Heavy_Industry', uavName: '工业级防雨大负载', uavClass: 'VTOL', precheckStatus: 'pass' },
  { taskId: 'MIS000000646', taskName: '04161529物流', userId: '1', userName: 'Super', bizType: '智慧物流', submitTime: '2026-04-16 15:29:59', verifyTime: '2026-04-16 15:29:59', verifyResult: '审核成功', uavType: 'Heavy_Industry', uavName: '工业级防雨大负载', uavClass: 'VTOL', precheckStatus: 'pass' },
  { taskId: 'MIS000000645', taskName: '04161527货运', userId: '1', userName: 'Super', bizType: '智慧物流', submitTime: '2026-04-16 15:27:51', verifyTime: '2026-04-16 15:27:51', verifyResult: '审核失败', uavType: 'DJI', uavName: '大疆 M300', uavClass: '多旋翼', precheckStatus: 'block-l2', conflictGrid: 'Grid-C03-08', conflictReason: '降水量 16mm/h 触发 VTOL 及多旋翼阈值', conflictLevel: '二级禁飞', failReason: 'weather' },
  { taskId: 'MIS000000644', taskName: '04161347巡检', userId: '1', userName: 'Super', bizType: '高速巡检', submitTime: '2026-04-16 13:48:32', verifyTime: '2026-04-16 13:48:32', verifyResult: '审核成功', uavType: 'FixedWing_Light', uavName: '固定翼巡航', uavClass: '固定翼', precheckStatus: 'pass' },
  { taskId: 'MIS000000643', taskName: '04161147巡检', userId: '1', userName: 'Super', bizType: '高速巡检', submitTime: '2026-04-16 11:48:47', verifyTime: '2026-04-16 11:48:47', verifyResult: '审核成功', uavType: 'FixedWing_Light', uavName: '固定翼巡航', uavClass: '固定翼', precheckStatus: 'pass' },
])

const filteredList = computed(() => {
  return list.value.filter(item => {
    const matchId = !filter.taskId || item.taskId.includes(filter.taskId)
    const matchName = !filter.taskName || item.taskName.includes(filter.taskName)
    const matchFail = !filter.failReason || item.failReason === filter.failReason
    const matchResult = !filter.verifyResult || item.verifyResult === filter.verifyResult
    return matchId && matchName && matchFail && matchResult
  })
})

function doSearch() {
  loading.value = true
  setTimeout(() => { loading.value = false }, 300)
}

function resetFilters() {
  Object.assign(filter, { taskId: '', taskName: '', failReason: '', verifyResult: '' })
  doSearch()
}

// ========== 样式辅助函数 ==========
function uavClassStyle(cls: string) {
  if (cls === '多旋翼') return 'badge-multirotor'
  if (cls === '固定翼') return 'badge-fixedwing'
  if (cls === 'VTOL') return 'badge-vtol'
  return 'badge-other'
}

function resultClass(result: string) {
  if (result === '审核成功') return 'result-success'
  if (result === '审核失败') return 'result-fail'
  return 'result-pending'
}

function getPrecheckBadgeClass(status: string) {
  const map: Record<string, string> = {
    'pass': 'precheck-pass',
    'block-l1': 'precheck-block-l1',
    'block-l2': 'precheck-block-l2',
    'block-l3': 'precheck-block-l3',
    'manual-reject': 'precheck-manual',
    'pending': 'precheck-pending'
  }
  return map[status] ?? 'precheck-pending'
}

function getPrecheckLabel(status: string) {
  const map: Record<string, string> = {
    'pass': '✅ 系统预检通过',
    'block-l1': '🔴 一级气象熔断',
    'block-l2': '🟠 二级气象熔断',
    'block-l3': '🟡 三级气象熔断',
    'manual-reject': '人工驳回',
    'pending': '预检中…'
  }
  return map[status] ?? '未知'
}

// ========== 对话框与表单状态 ==========
const showCreateDialog = ref(false)
const showInterceptDialog = ref(false)
const showDetailDrawer = ref(false)
const showTimelineDrawer = ref(false)
const showReroute = ref(false)
const selectedTask = ref<TaskItem | null>(null)

const newTask = reactive({ name: '', uavType: '', timeOffset: 0 })
const conflictInfo = ref<{ name: string, reason: string, suggestTime: number } | null>(null)

function openDetail(row: TaskItem) {
  selectedTask.value = row
  showReroute.value = false
  showDetailDrawer.value = true
  nextTick(() => draw3DCanvas())
}

function submitCreate() {
  if (!newTask.name || !newTask.uavType || newTask.timeOffset === null) {
    ElMessage.warning('请补全必填信息')
    return
  }
  for (const nfz of mockNoFlyZones) {
    const isTimeClash = newTask.timeOffset >= nfz.effectiveTimeRange[0] && newTask.timeOffset <= nfz.effectiveTimeRange[1]
    const isUavClash = nfz.restrictedUavTypes.includes('ALL') || nfz.restrictedUavTypes.includes(newTask.uavType)
    if (isTimeClash && isUavClash) {
      conflictInfo.value = { name: nfz.name, reason: nfz.reason, suggestTime: nfz.effectiveTimeRange[1] + 3 }
      showCreateDialog.value = false
      showInterceptDialog.value = true
      return
    }
  }
  handleSuccessSave()
}

function applySuggestion() {
  if (conflictInfo.value) newTask.timeOffset = conflictInfo.value.suggestTime
  showInterceptDialog.value = false
  handleSuccessSave()
}

function handleSuccessSave() {
  ElMessage.success('校验通过！气象条件良好，任务下发成功。')
  showCreateDialog.value = false
  newTask.name = ''; newTask.uavType = ''; newTask.timeOffset = 0
}

function handleApprove() {
  ElMessage.success('审核通过，任务已下发执行！')
  showDetailDrawer.value = false
}

function handleManualReject() {
  ElMessage.warning('已人工驳回该任务。')
  showDetailDrawer.value = false
}

function handleReroute() {
  showReroute.value = true
  nextTick(() => draw3DCanvas())
  ElMessage.info('正在规划绕行航线，请稍候...')
}

function confirmReroute() {
  ElMessage.success('绕行航线已替换，任务重新提交审核。')
  showDetailDrawer.value = false
  showReroute.value = false
}

// ========== 时间窗口数据 ==========
const timeSlots = ref([
  { id: 1, time: '14:00 - 15:00 (当前)', status: 'danger', label: '气象阻断', desc: '预报阵风 22m/s，超多旋翼阈值，不可飞' },
  { id: 2, time: '15:00 - 16:00', status: 'danger', label: '气象阻断', desc: '气象管制尚未解除，继续等待' },
  { id: 3, time: '16:30 - 18:00', status: 'safe', label: '✅ 推荐飞行', desc: '风速降至 7m/s，天气转晴，能见度 >5km，适飞条件良好' },
  { id: 4, time: '18:00 - 20:00', status: 'safe', label: '✅ 可选飞行', desc: '风速约 8m/s，轻度云雾，适飞条件一般' },
])

function applyTimeSlot(slot: any) {
  ElMessage.success(`任务已顺延至 ${slot.time} 并重新提交审核！`)
  showTimelineDrawer.value = false
  showDetailDrawer.value = false
}

// ========== 3D 模拟地图绘制 ==========
const canvas3dRef = ref<HTMLCanvasElement | null>(null)

function draw3DCanvas() {
  const canvas = canvas3dRef.value
  if (!canvas) return
  const rect = canvas.parentElement?.getBoundingClientRect()
  if (rect) { canvas.width = rect.width; canvas.height = rect.height }
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const W = canvas.width, H = canvas.height
  ctx.clearRect(0, 0, W, H)

  // 背景
  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, '#0a1628'); bg.addColorStop(1, '#0d2440')
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)

  // 绘制网格地面
  ctx.strokeStyle = 'rgba(30,120,200,0.18)'; ctx.lineWidth = 0.8
  for (let x = 0; x < W; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
  }
  for (let y = 0; y < H; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
  }

  const isBlocked = selectedTask.value && selectedTask.value.precheckStatus !== 'pass'

  // 正常航线段（蓝色）
  const route = [
    { x: W * 0.05, y: H * 0.5 },
    { x: W * 0.28, y: H * 0.35 },
    { x: W * 0.50, y: H * 0.45 }, // 冲突区入口
    { x: W * 0.67, y: H * 0.38 }, // 冲突区出口
    { x: W * 0.85, y: H * 0.42 },
    { x: W * 0.97, y: H * 0.35 },
  ]

  // 气象冲突网格：半透明红色方块
  if (isBlocked) {
    const gx = W * 0.45, gy = H * 0.22, gw = W * 0.27, gh = H * 0.42
    ctx.save()
    ctx.globalAlpha = 0.22
    ctx.fillStyle = '#ff4d4f'
    ctx.fillRect(gx, gy, gw, gh)
    ctx.globalAlpha = 0.7
    ctx.strokeStyle = '#ff4d4f'
    ctx.lineWidth = 2
    ctx.setLineDash([6, 3])
    ctx.strokeRect(gx, gy, gw, gh)
    ctx.setLineDash([])
    ctx.restore()

    // NFZ 标签
    ctx.save()
    ctx.fillStyle = 'rgba(200,30,30,0.85)'
    ctx.fillRect(gx + 4, gy + 4, 130, 22)
    ctx.fillStyle = 'white'; ctx.font = 'bold 11px monospace'
    ctx.fillText('⚠ 三级气象禁飞区', gx + 8, gy + 19)
    ctx.restore()
  }

  // 绘制航线
  const splitIdx = 2 // 冲突开始点索引
  // 正常段
  ctx.beginPath()
  ctx.moveTo(route[0].x, route[0].y)
  for (let i = 1; i <= (isBlocked ? splitIdx : route.length - 1); i++) {
    ctx.lineTo(route[i].x, route[i].y)
  }
  ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 3; ctx.setLineDash([]); ctx.stroke()

  if (isBlocked) {
    // 冲突段（红色虚线）
    ctx.beginPath()
    ctx.moveTo(route[splitIdx].x, route[splitIdx].y)
    for (let i = splitIdx + 1; i <= 3; i++) ctx.lineTo(route[i].x, route[i].y)
    ctx.strokeStyle = '#ff4d4f'; ctx.lineWidth = 3; ctx.setLineDash([8, 5]); ctx.stroke(); ctx.setLineDash([])

    // 恢复段（灰色）
    ctx.beginPath()
    ctx.moveTo(route[3].x, route[3].y)
    for (let i = 4; i < route.length; i++) ctx.lineTo(route[i].x, route[i].y)
    ctx.strokeStyle = '#6b7280'; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.stroke(); ctx.setLineDash([])
  }

  // 绕行航线（绿色）
  if (showReroute.value) {
    const reroute = [
      { x: route[splitIdx].x, y: route[splitIdx].y },
      { x: W * 0.45, y: H * 0.78 },
      { x: W * 0.72, y: H * 0.72 },
      { x: route[3].x, y: route[3].y },
    ]
    ctx.beginPath()
    ctx.moveTo(reroute[0].x, reroute[0].y)
    reroute.forEach(p => ctx.lineTo(p.x, p.y))
    ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2.5; ctx.setLineDash([7, 4]); ctx.stroke(); ctx.setLineDash([])

    // 绕行标签
    ctx.save()
    ctx.fillStyle = 'rgba(21,128,61,0.85)'; ctx.fillRect(W * 0.47, H * 0.8, 120, 22)
    ctx.fillStyle = 'white'; ctx.font = 'bold 11px monospace'
    ctx.fillText('✅ 绕行备选 +1.2km', W * 0.475, H * 0.815)
    ctx.restore()
  }

  // 途经点
  route.forEach((pt, i) => {
    let color = '#3b82f6'
    if (isBlocked && i >= splitIdx && i <= 3) color = '#ff4d4f'
    else if (isBlocked && i > 3) color = '#6b7280'
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2)
    ctx.fillStyle = color; ctx.fill()
    ctx.strokeStyle = 'white'; ctx.lineWidth = 1.5; ctx.stroke()
  })

  // 起点 & 终点
  ctx.fillStyle = '#22c55e'; ctx.font = 'bold 12px sans-serif'
  ctx.fillText('🛫 起点', route[0].x + 8, route[0].y - 10)
  ctx.fillStyle = '#3b82f6'
  ctx.fillText('🛬 终点', route[route.length - 1].x - 30, route[route.length - 1].y - 12)
}
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

.search-form :deep(.el-form-item) { margin-bottom: 16px; }
.search-form :deep(.el-form-item__label) { color: #595959; font-size: 13px; font-weight: normal; }

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
:deep(.custom-el-select .el-select__wrapper.is-focused) { border-color: #004b9e !important; }
:deep(.el-input__inner) { color: #333; font-size: 13px; }
:deep(.el-input__inner::placeholder), :deep(.el-select__placeholder) { color: #bfbfbf; }

.custom-btn {
  height: 32px; line-height: 1; padding: 0 16px;
  border-radius: 4px; font-size: 13px;
  border-color: #d9d9d9; color: #595959;
}
.custom-btn:hover { color: #004b9e; border-color: #004b9e; background: #fff; }
.custom-btn-primary { background: #004b9e !important; border-color: #004b9e !important; color: #fff !important; }
.custom-btn-primary:hover { background: #005bc4 !important; border-color: #005bc4 !important; }

.custom-el-table { --el-table-border-color: transparent; --el-table-row-hover-bg-color: #f5f7fa; }
.custom-el-table::before { display: none; }
.custom-el-table :deep(.el-checkbox__inner) { border-color: #d9d9d9; }
.custom-el-table :deep(.el-checkbox__input.is-checked .el-checkbox__inner) { background-color: #004b9e; border-color: #004b9e; }

/* 预检状态徽标 */
.precheck-badge {
  display: inline-flex; align-items: center; gap: 2px;
  padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; white-space: nowrap;
}
.precheck-pass { background: #f6ffed; color: #389e0d; border: 1px solid #b7eb8f; }
.precheck-block-l1 { background: #fff1f0; color: #cf1322; border: 1px solid #ffa39e; }
.precheck-block-l2 { background: #fff7e6; color: #d46b08; border: 1px solid #ffd591; }
.precheck-block-l3 { background: #fffbe6; color: #ad8b00; border: 1px solid #ffe58f; }
.precheck-manual { background: #f5f5f5; color: #595959; border: 1px solid #d9d9d9; }
.precheck-pending { background: #e6f7ff; color: #0958d9; border: 1px solid #91caff; }

/* 机型大类徽标 */
.uav-class-badge {
  display: inline-flex; align-items: center;
  padding: 1px 6px; border-radius: 4px; font-size: 11px; font-weight: 600;
}
.badge-multirotor { background: #e6f7ff; color: #0958d9; border: 1px solid #91caff; }
.badge-fixedwing { background: #f6ffed; color: #389e0d; border: 1px solid #b7eb8f; }
.badge-vtol { background: #fff7e6; color: #d46b08; border: 1px solid #ffd591; }
.badge-other { background: #f5f5f5; color: #595959; border: 1px solid #d9d9d9; }

/* 核验结果 */
.result-success { color: #389e0d; font-weight: 500; }
.result-fail { color: #cf1322; font-weight: 500; }
.result-pending { color: #0958d9; font-weight: 500; }

/* 分页器 */
.custom-pagination :deep(.el-pager li) {
  background: #fff; border: 1px solid #d9d9d9; border-radius: 4px;
  color: #595959; font-weight: normal; min-width: 28px; height: 28px; line-height: 28px;
}
.custom-pagination :deep(.el-pager li.is-active) { background: #fff; border-color: #004b9e; color: #004b9e; }
.custom-pagination :deep(.el-pagination__sizes .el-input__wrapper) { height: 28px; box-shadow: none; border: 1px solid #d9d9d9; }
.custom-pagination :deep(.btn-prev), .custom-pagination :deep(.btn-next) {
  background: #fff; border: 1px solid #d9d9d9; border-radius: 4px; height: 28px; min-width: 28px;
}

/* 对话框 */
:deep(.custom-light-form .el-form-item__label) { color: #595959 !important; font-weight: 500 !important; padding-bottom: 4px !important; }
:deep(.custom-danger-dialog .el-dialog__header) { background: #fff1f0; border-bottom: 1px solid #ffccc7; margin-right: 0; padding-bottom: 15px; }
:deep(.custom-danger-dialog .el-dialog__title) { color: #cf1322; font-weight: bold; }
:deep(.custom-danger-dialog) { border-radius: 8px; overflow: hidden; }
:deep(.custom-danger-dialog .el-dialog__footer) { border-top: 1px solid #e8e8e8; background: #fafafa; }

/* 详情抽屉 */
.detail-layout { padding: 0 4px; }
.detail-left { min-width: 360px; }

/* 系统预检报告区块 */
.precheck-report-block {
  border-radius: 8px; padding: 14px; border: 1.5px solid; flex-shrink: 0;
}
.report-pass { background: #f6ffed; border-color: #b7eb8f; }
.report-block { background: #fff1f0; border-color: #ffa39e; }
.report-title {
  font-weight: 700; font-size: 13px; margin-bottom: 8px;
  display: flex; align-items: center; gap: 6px;
}
.report-pass .report-title { color: #237804; }
.report-block .report-title { color: #a8071a; }
.report-body { font-size: 13px; line-height: 1.7; }
.conflict-item {
  background: rgba(255,77,79,0.08); border-radius: 6px; padding: 8px 10px;
  font-size: 12px; line-height: 1.8; margin-top: 6px; color: #7f1d1d;
}

/* 信息区块 */
.info-section {
  background: #fafafa; border: 1px solid #f0f0f0; border-radius: 6px; padding: 12px;
}
.info-section-title {
  font-size: 13px; font-weight: 700; color: #333; margin-bottom: 10px;
  display: flex; align-items: center; gap: 5px;
}
.info-grid { display: flex; flex-direction: column; gap: 7px; }
.info-row { display: flex; align-items: center; }
.info-label { width: 88px; font-size: 12px; color: #8c8c8c; flex-shrink: 0; }
.info-value { font-size: 13px; color: #333; display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }

/* 地图区 */
.map-header { padding: 0 4px; flex-shrink: 0; }
.map-canvas { background: #0a1628; min-height: 0; }
.legend-line { display: inline-block; width: 24px; height: 3px; border-radius: 2px; }

/* 底部操作 */
.action-footer {
  display: flex; align-items: center; justify-content: flex-end;
  gap: 10px; padding-top: 12px; border-top: 1px solid #f0f0f0;
  flex-wrap: wrap;
}

/* 时间轴 */
.timeline-slot {
  border-radius: 8px; border: 1px solid; padding: 12px 14px;
}
.slot-safe { background: #f6ffed; border-color: #b7eb8f; }
.slot-danger { background: #fff1f0; border-color: #ffa39e; }
</style>
