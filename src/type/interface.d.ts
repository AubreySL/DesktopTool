export interface IElectronAPI {
  getConfigData: () => Promise<string>,
  fetchPage: (url ?:string, article?:string, title?:string ) => void
  }
  
  declare global {
    interface Window {
      electronAPI: IElectronAPI
    }
  }