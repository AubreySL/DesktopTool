import type { msgType } from '@/type/type'
import { getMainWindow } from '../main'
import type { IpcMainInvokeEvent } from 'electron'
import fs from 'node:fs'
import * as fsPromise from 'node:fs/promises'
import https from 'node:https'
import { getAppDataPath, getAppName } from './app'

const logFileDirPath = `${getAppDataPath()}/${getAppName()}/my_logs`

const { dialog, shell, app } = require('electron')

function selectSaveDirPath(fileName: string) {
  return dialog.showSaveDialogSync({
    defaultPath: fileName,
    // properties: ['dontAddToRecent']
  })
}
export function sendMsg(msg: string, type: msgType = 'success') {
  const mainWindow = getMainWindow()
  mainWindow?.webContents.send('showMessage', msg, type)
}

export async function saveFileSource(source: string, fileName: string) {
  try {
    const dirPath = selectSaveDirPath(fileName)
    if (!dirPath) throw new Error('取消')

    await fsPromise.writeFile(`${dirPath}`, source)
    sendMsg('保存成功')
  } catch (err) {
    sendMsg(String(err), 'error')
    console.error(err)
  }
}

export function openDirOnApp(event: IpcMainInvokeEvent, dirPath: string) {
  try {
    //app.getAppPath()
    //app.getPath('exe')
    const path = `${app.getPath('appData')}/${app.getName()}/${dirPath}`
    console.log(path)
    if (fs.existsSync(path)) {
      shell.showItemInFolder(path)
      sendMsg('操作成功')
    } else {
      throw new Error('目录不存在')
    }
  } catch (err) {
    sendMsg(String(err), 'error')
    console.error(err)
  }
}

export function updateCrawlerLog(txt: string, state?: boolean) {
  const mainWindow = getMainWindow()
  mainWindow?.webContents.send('updateCrawlerLog', txt, state)
}

export function dirPathCreator(dirPath: string) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath)
    }
  } catch (error) {
    console.error(error)
  }
}

export function downloadFile(url: string, targetPath: string) {
  return new Promise((resolve, reject) => {
    https.get(url,{
      /*
      默认情况下，使用 ClientRequest 对同一服务端发起的 HTTP 请求最多可以创建5个连接，实质上是一个链接池。如果当前连接池已满，新来的请求将会进入等待区域，当有连接释放后，会向等待区域询问是否有等待中的请求，如果有的话执行。
HTTP客户端对同一个HTTP服务器同时发起10次请求时，实际上只有5个请求处于并发状态，后面的请求将会加入等待区域，待前面有请求完成后，才会真正发出。这与浏览器对同一域名下有下载链接数的限制是相同的行为。
如果你在服务器端通过ClientRequest调用网络中的其他HTTP服务，需要关注网络请求的限制，一旦请求量过大，连接限制将会限制服务的性能。如果需要改变，可以将 options 中的 agent 选项设置为 false，用来脱离连接池的管理。也可以自行构造代理对象

      */
      agent: false,  // Create a new agent just for this one request
    }, res => {
      const fileStream = fs.createWriteStream(targetPath)
      res.pipe(fileStream)
      fileStream.on('finish', () => {
        fileStream.close()
        console.log('Download finished')
        resolve(targetPath)
      })
      fileStream.on('error', err => {
        reject(err)
      })
    })
  })
}

export async function saveLog(source: string, fileName: string = '', dirPath: string = logFileDirPath) {
  try {
    dirPathCreator(dirPath);
    const current = new Date();
    const datenName = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`
    await fsPromise.writeFile(`${dirPath}/${fileName || datenName}.txt`, source, { flag: 'a+' })
  } catch (err) {
    console.error(err)
  }
}