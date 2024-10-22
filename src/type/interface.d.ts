import type { msgType } from './type'
export type callbackFn = (value: string, type?: msgType = 'success') => void

export interface IElectronAPI {
  getConfigData: () => Promise<string>
  fetchPage: (url: string, title: string, article: string) => void
  showMessage: (callback) => (value: string, type?: msgType = 'success') => {}
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
