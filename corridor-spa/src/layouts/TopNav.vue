<template>
  <header class="top-header">
    <!-- Logo区 -->
    <div class="logo-box">
      <span class="brand">廊道运维管理平台</span>
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
      <span class="text-sm">Admin</span>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

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
  height: var(--header-height, 64px);
  background: var(--color-header-bg, #004b9e);
  color: #fff;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: 0 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 100;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.logo-box {
  height: 100%;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.brand {
  font-weight: 900;
  font-size: 20px;
  font-style: italic;
  color: #fff;
  letter-spacing: 1px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  white-space: nowrap;
}

.top-nav {
  display: flex;
  height: 100%;
  flex: 1;
  align-items: center;
  margin-left: 32px;
  gap: 4px;
}

.nav-item {
  color: rgba(255, 255, 255, 0.72);
  padding: 7px 14px;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.22s;
  border-radius: 6px;
  gap: 7px;
  text-decoration: none;
  white-space: nowrap;
}

.nav-item i {
  font-size: 17px;
}

.nav-item:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
}

.nav-item.active {
  color: #fff;
  background: rgba(255, 255, 255, 0.22);
}

.user-box {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  color: #fff;
  flex-shrink: 0;
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
</style>
