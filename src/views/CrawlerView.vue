<template>
    <CrawlerTool :rules="configData"></CrawlerTool>
</template>

<script setup lang="ts">
import type { ruleItem } from '@/type/type';
import CrawlerTool from "@/components/CrawlerTool.vue";
import { ref, type Ref } from 'vue';

const configData: Ref<Array<ruleItem>> = ref([])
    
window.electronAPI.getConfigData().then(value=>{
    configData.value = JSON.parse(value)?.config
})

</script>

<style scoped>

</style>