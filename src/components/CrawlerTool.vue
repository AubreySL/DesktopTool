<template>
  <div>
    <a-row align="middle" :gutter="[5, 10]">
      <a-col :span="3">网站:</a-col>
      <a-col :span="21">
        <a-input v-model:value="url" allowClear></a-input>
      </a-col>

      <a-col :span="3">规则:</a-col>
      <a-col :span="21">
        <a-select
          v-model:value="rule"
          style="width: 100%"
          :options="ruleOptions"
          @change="handleChange"
        ></a-select>
      </a-col>

      <a-col :span="3">描述:</a-col>
      <a-col :span="21">
        <a-input readonly v-model:value="result"></a-input>
      </a-col>
      <a-col :span="3">日志:</a-col>
      <a-col :span="21">
        <a-textarea
          readonly
          v-model:value="log"
          :autoSize="{ minRows: 4, maxRows: 8 }"
        ></a-textarea>
      </a-col>
    </a-row>
    <a-row class="mt10" justify="center" :gutter="[5, 10]">
      <a-col>
        <a-button
          class="mr10"
          type="primary"
          @click="onStart"
          :disabled="isStartBtn"
          >开始</a-button
        >
        <a-button class="mr10" @click="onOpenConfig">查看配置</a-button>
        <a-button @click="onRefreshConfig">刷新配置</a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { message, type SelectProps } from 'ant-design-vue'
import type { ruleItem } from '@/type/type'

const props = defineProps({
  rules: {
    type: Array<ruleItem>,
    default() {
      return () => []
    },
  },
})

const attrs= useAttrs()  as Record<string, ()=> void>

const url = ref<string>('')
const rule = ref<string>('')
const result = ref<string>('')
const isStartBtn = ref<boolean>(false)
const log = ref<string>('  ')

const ruleOptions = ref<SelectProps['options']>([])
const ruleSelected = ref<ruleItem>({
  name: '掘金',
  title_xpath: "//h1[@class='article-title']/text()",
  article_xpath: "//div[@id='article-root']",
  title_selector: 'h1#article-title',
  article_selector: 'article.article',
})

ruleOptions.value = props.rules.map((item: ruleItem) => {
  const { name } = item
  return {
    ...item,
    label: name,
    value: name,
  }
})
const handleChange = (value: string, option: ruleItem) => {
  // console.log(`selected ${value}`)
  ruleSelected.value = option
}
const empty = ['', null, undefined]
const onStart = () => {
  log.value = '  '
  result.value = ''
  if (empty.includes(url.value)) {
    message.warning('网站不能为空！')
    return false
  }
  if (empty.includes(rule.value)) {
    message.warning('规则不能为空！')
    return false
  }
  isStartBtn.value = true
  result.value = `标题：${ruleSelected.value.title_selector}， 内容：${ruleSelected.value.article_selector}`

  window.electronAPI.fetchPage(
    url.value,
    ruleSelected.value.title_selector,
    ruleSelected.value.article_selector,
  )
}
const onOpenConfig = () => {
  window.electronAPI.openDirOnApp('config/config.json')
}

const onRefreshConfig = () => {
 attrs.onRefresh();
 message.info("刷新配置")
}


window.electronAPI.updateCrawlerLog((text, state = true) => {
  log.value += `---${text}---
  `
  isStartBtn.value = state
})

</script>

<style scoped>
.mt10 {
  margin-top: 10px;
}
.mr10 {
  margin-right: 10px;
}
</style>
