import path from 'path'
import fs from 'node:fs'
import { sendMsg } from './fileUtil'
import { getAppDataPath, getAppName } from './app'

const dirPath = `${getAppDataPath()}/${getAppName()}/config`
const fileName = 'config.json'
const fileFullPath = `${dirPath}/${fileName}`

export function readConfigFile() {
  try {
    if (fs.existsSync(dirPath)) {
      const data = fs.readFileSync(fileFullPath, 'utf8')
      return data
    } else {
      sendMsg('读取配置文件失败')
    }
    // console.log(data);
  } catch (err) {
    console.error(err)
  }
}

export function initConfigFile() {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath)
    }
    if (!fs.existsSync(fileFullPath)) {
      fs.copyFileSync(path.join(__dirname, 'config.json'), fileFullPath)
      sendMsg('初始化配置文件成功')
    }
  } catch (error) {
    console.error(error)
  }
}
