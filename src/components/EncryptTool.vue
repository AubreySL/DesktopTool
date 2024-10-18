<template>
  <div>
    <a-row :gutter="[10, 10]">
      <a-col :span="24">
        <a-textarea v-model:value="originalText" placeholder="please input text" :rows="10" allow-clear></a-textarea>
      </a-col>
      <a-col :span="24">
        <a-row :gutter="20">
          <a-col :span="12">
            <a-input-password v-model:value="secretKey" placeholder="please input key"></a-input-password>
          </a-col>
          <a-col :span="12">
            <a-space>
              <a-button type="primary" @click.stop="doEncode(originalText, secretKey)">加密</a-button>
              <a-button type="primary" @click.stop="doDecode(secretKey, cipherText)">解密</a-button>
            </a-space>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="24">
        <a-textarea v-model:value="cipherText" :rows="10" allow-clear></a-textarea>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import CryptoJS from "crypto-js";
import { message } from "ant-design-vue";

const originalText = ref<string>("");
const secretKey = ref<string>("");
const cipherText = ref<string>("");

/* 加密 */
function doEncode(text: string, key: string) {
  cipherText.value = "";
  if (!text.length) {
    message.error("请输入原文！");
    return false;
  }
  if (!key.length) {
    message.error("请输入密钥！");
    return false;
  }
  cipherText.value = CryptoJS.AES.encrypt(text, key).toString();
}

/* 解密 */
function doDecode(key: string, result: string) {
  if (!result.length) {
    message.error("请输入密文！");
    return false;
  }
  if (!key.length) {
    message.error("请输入密钥！");
    return false;
  }
  originalText.value = "";
  try {
    const bytes = CryptoJS.AES.decrypt(result, key);
    originalText.value = bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    message.error(`error: ${error}`);
  }

}
</script>

<style scoped></style>
