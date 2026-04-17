<template>
  <div class="page-layout">
    <TopNav />
    <div class="main-wrap">
      <SideMenu :menu-items="sideMenuItems" />
      <main class="content-area">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" :key="$route.path" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TopNav from './TopNav.vue'
import SideMenu from './SideMenu.vue'
import type { SideMenuItem } from '@/router'

const route = useRoute()

// 从匹配到的父路由 meta 中读取侧边栏菜单配置
const sideMenuItems = computed<SideMenuItem[]>(() => {
  for (const matched of [...route.matched].reverse()) {
    if (matched.meta?.sideMenu) {
      return matched.meta.sideMenu as SideMenuItem[]
    }
  }
  return []
})
</script>

<style scoped>
.page-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.main-wrap {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  background: #f0f2f5;
  display: flex;
  flex-direction: column;
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
