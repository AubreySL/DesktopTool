<template>
    <CrawlerTool v-if="isLoad" :rules="configData"></CrawlerTool>
</template>

<script setup lang="ts">
import type { ruleItem } from '@/type/type';
import CrawlerTool from "@/components/CrawlerTool.vue";
import { ref, type Ref } from 'vue';

const configData: Ref<Array<ruleItem>> = ref([])
const isLoad = ref(false)
window.electronAPI.getConfigData().then(value=>{
    configData.value = JSON.parse(value)?.config
    isLoad.value = true;
})

</script>

