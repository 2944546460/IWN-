<template>
  <aside class="side-menu">
    <nav class="menu-list">
      <router-link
        v-for="item in menuItems"
        :key="item.key"
        :to="item.path"
        class="menu-item"
        :class="{ active: currentKey === item.key }"
      >
        <i :class="['menu-icon', item.icon]" />
        <span class="menu-text">{{ item.title }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { SideMenuItem } from '@/router'

defineProps<{
  menuItems: SideMenuItem[]
}>()

const route = useRoute()

const currentKey = computed(() => {
  return route.meta?.sideMenuKey as string | undefined
})
</script>

<style scoped>
.side-menu {
  width: var(--sidebar-width, 200px);
  background: var(--color-sidebar-bg, #0e2246);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
}

.menu-list {
  flex: 1;
  padding-top: 8px;
}

.menu-item {
  height: 46px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  color: rgba(255, 255, 255, 0.65);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  white-space: nowrap;
  text-decoration: none;
  border-left: 3px solid transparent;
  gap: 10px;
}

.menu-item:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
}

.menu-item.active {
  color: #fff;
  background: rgba(64, 158, 255, 0.18);
  border-left-color: #409eff;
}

.menu-icon {
  font-size: 16px;
  width: 18px;
  text-align: center;
  flex-shrink: 0;
}

.menu-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
