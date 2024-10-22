import type { msgType } from "@/type/type";
import { getMainWindow } from "../main";

const { dialog } = require('electron')
const fs = require('node:fs/promises')

function selectSaveDirPath(fileName: string) {
  return dialog.showSaveDialogSync({
    defaultPath: fileName,
    // properties: ['dontAddToRecent']
  })
}
function sendMsg(msg:string, type:msgType = "success"){
    const mainWindow = getMainWindow(); 
    mainWindow?.webContents.send('showMessage', msg, type);
}

export async function saveFileSource(source: string, fileName: string) {
  try {
    const dirPath = selectSaveDirPath(fileName);
    if(!dirPath) throw new Error("取消");
    
    await fs.writeFile(`${dirPath}`, source)
    sendMsg("保存成功")
  } catch (err) {
    sendMsg(String(err), 'error')
    console.log(err)
  }
}
