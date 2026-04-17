<template>
  <div class="map-layout">
    <TopNav />
    <main class="map-body">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import TopNav from './TopNav.vue'
</script>

<style scoped>
.map-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: #0a1628;
}

.map-body {
  flex: 1;
  position: relative;
  overflow: hidden;
}
</style>
