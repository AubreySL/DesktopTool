export interface IElectronAPI {
  getConfigData: () => Promise<void>,
  }
  
  declare global {
    interface Window {
      electronAPI: IElectronAPI
    }
  }