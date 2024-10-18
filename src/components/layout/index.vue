<template>
    <a-layout style="min-height: 100vh">
        <a-layout-sider v-model:collapsed="collapsed" collapsible>
            <a-menu v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" mode="inline" :items="items"
                @click="handleClick" theme="dark"></a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-content style="margin: 0 16px">
                <KeepAlive>
                    <RouterView />
                </KeepAlive>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>
<script lang="ts" setup>
import {
    LockOutlined,
    DownloadOutlined
} from '@ant-design/icons-vue';
import { reactive, ref, watch, VueElement, h } from 'vue';
import type { MenuProps, ItemType } from 'ant-design-vue';
import { useRouter, useRoute } from 'vue-router'
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface';

const router = useRouter()
const route = useRoute()

const collapsed = ref<boolean>(true)
const selectedKeys = ref<string[]>(['/EncryptTool']);
const openKeys = ref<string[]>(['/EncryptTool']);
router.push(openKeys.value[0])
function getItem(
    label: VueElement | string,
    key: string,
    icon?: any,
    children?: ItemType[],
    type?: 'group',
): ItemType {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as ItemType;
}
const items: ItemType[] = reactive([
    getItem('AES 加解密', '/EncryptTool', () => h(LockOutlined),),
    getItem('爬虫', 'sub2', () => h(DownloadOutlined)),

]);

const handleClick: MenuProps['onClick'] = (e: MenuInfo) => {
    const { key } = e;
    router.push(key as string);
};

watch(openKeys, val => {
    console.log('openKeys', val);
});
</script>
<style scoped>
.site-layout .site-layout-background {
    background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
    background: #141414;
}
</style>