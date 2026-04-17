<template>
  <header class="top-header z-50">
    <!-- Logo区 -->
    <div class="logo-box flex items-center gap-4">
      <span class="brand text-[20px] font-black italic text-white tracking-wider drop-shadow-md">廊道运维管理平台</span>
      <!-- 收缩左侧菜单标识 (仅不在廊道态势大屏时显示) -->
      <div v-if="currentTopNav !== 'situation'" class="menu-fold-btn text-white/70 hover:text-white cursor-pointer transition-colors" title="折叠/展开侧边栏">
        <el-icon class="text-[18px]"><Fold /></el-icon>
      </div>
    </div>

    <!-- 一级导航 -->
    <nav class="top-nav">
      <router-link
        v-for="item in navItems"
        :key="item.key"
        :to="item.path"
        class="nav-item"
        :class="{ active: currentTopNav === item.key }"
      >
        <i :class="item.icon" />
        <span>{{ item.label }}</span>
      </router-link>
    </nav>

    <!-- 右侧用户区 -->
    <div class="user-box">
      <i class="ri-function-line text-[18px] cursor-pointer opacity-85 hover:opacity-100 transition-opacity" title="应用中心" />
      <div class="avatar">
        <i class="ri-user-line" />
      </div>
      <span class="text-sm font-medium">Soybean</span>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Fold } from '@element-plus/icons-vue'

const route = useRoute()

const navItems = [
  { key: 'situation',   label: '廊道态势显示', icon: 'ri-dashboard-3-line',    path: '/'            },
  { key: 'corridor',    label: '廊道基础数据', icon: 'ri-exchange-line',       path: '/corridor'    },
  { key: 'planning',    label: '规划计划',     icon: 'ri-file-list-3-line',   path: '/planning'    },
  { key: 'ground-node', label: '地面节点管理', icon: 'ri-share-line',          path: '/ground-node' },
  { key: 'aircraft',    label: '飞行器管理',   icon: 'ri-flight-takeoff-line', path: '/aircraft'    },
  { key: 'health',      label: '健康管理',     icon: 'ri-heart-pulse-line',    path: '/health'      },
]

// 从当前路由的 meta 中读取 topNav 标识
const currentTopNav = computed(() => {
  // 父路由 meta 优先，子路由 meta 兜底
  for (const matched of [...route.matched].reverse()) {
    if (matched.meta?.topNav) return matched.meta.topNav as string
  }
  return 'situation'
})
</script>

<style scoped>
.top-header {
  height: 56px;
  /* 更贴紧截图中的深邃的线性海军蓝渐变 */
  background: linear-gradient(to right, #003673, #0b5394, #003673);
  color: #fff;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: 0 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-box {
  height: 100%;
  flex-shrink: 0;
  min-width: 220px;
}

.brand {
  font-family: Arial, Helvetica, sans-serif; /* 匹配略显硬核厚重的英文字体感 */
}

.top-nav {
  display: flex;
  height: 100%;
  flex: 1;
  align-items: center;
  justify-content: center; /* Added for centering */
  gap: 16px; /* slightly increased gap based on the screenshot */
}

.nav-item {
  color: rgba(255, 255, 255, 0.7);
  padding: 6px 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  border-radius: 4px;
  gap: 6px;
  text-decoration: none;
  white-space: nowrap;
}

.nav-item i {
  font-size: 16px;
}

.nav-item:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
  /* 截图中有非常微弱的高光框 */
  box-shadow: inset 0 0 4px rgba(255,255,255,0.1);
}

.user-box {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #fff;
  flex-shrink: 0;
}

.avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
}
</style>
