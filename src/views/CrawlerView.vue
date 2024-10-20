<template>
    <CrawlerTool></CrawlerTool>
</template>

<script setup lang="ts">
import CrawlerTool from "@/components/CrawlerTool.vue";

const configData=  window.electronAPI.getConfigData()
</script>

<style scoped>

</style>