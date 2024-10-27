import type { msgType } from './type'
export type callbackFn = (value: string, type?: msgType = 'success') => void
export type callbackFnLog = (value: string, state?: boolean = true) => void

export interface IElectronAPI {
  getConfigData: () => Promise<string>
  fetchPage: (url: string, title: string, article: string) => void
  showMessage: (callback: callbackFn) => (value: string, type?: msgType = 'success') => {}
  openDirOnApp: (dirPath: string) => void
  updateCrawlerLog: (callback: callbackFnLog) => (txt: string, state?: boolean) => {}
  
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
