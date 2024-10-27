// See the Electron documentation for details on how to use preload scripts:

import type { callbackFn, callbackFnLog } from "./type/interface"

// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron/renderer')


contextBridge.exposeInMainWorld('electronAPI', {
    getConfigData: () => ipcRenderer.invoke('getConfigData'),
    fetchPage: (url: string, title: string, article: string) => ipcRenderer.invoke('handleFetchPage', url, title, article),
    showMessage: (callback:callbackFn) => ipcRenderer.on('showMessage', (_event, value, type) => callback(value, type)),
    openDirOnApp: (dirPath:string) => ipcRenderer.send('open-dir-on-app', dirPath),
    updateCrawlerLog: (callback:callbackFnLog) => ipcRenderer.on('updateCrawlerLog', (_event, text, state) => callback(text, state)),
})