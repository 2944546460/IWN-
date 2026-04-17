<template>
  <div class="page-container">
    <el-card class="content-card" :body-style="{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }">
      <el-empty description="历史数据管理模块开发中" />
      <div class="mt-4 text-gray-500 text-sm">此页面将用于查询飞行器的历史轨迹与执行记录</div>
    </el-card>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped>.page-container{padding:20px;height:100%;box-sizing:border-box}.content-card{height:100%;border-radius:6px}</style>
