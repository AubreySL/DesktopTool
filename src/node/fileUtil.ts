import type { msgType } from "@/type/type"
import { getMainWindow } from "../main";
import type { IpcMainInvokeEvent } from "electron";
import fs from "node:fs"
import * as fsPromise from 'node:fs/promises';
const { dialog , shell , app} = require('electron')

function selectSaveDirPath(fileName: string) {
  return dialog.showSaveDialogSync({
    defaultPath: fileName,
    // properties: ['dontAddToRecent']
  })
}
export function sendMsg(msg:string, type:msgType = "success"){
    const mainWindow = getMainWindow(); 
    mainWindow?.webContents.send('showMessage', msg, type);
}

export async function saveFileSource(source: string, fileName: string) {
  try {
    const dirPath = selectSaveDirPath(fileName);
    if(!dirPath) throw new Error("取消");
    
    await fsPromise.writeFile(`${dirPath}`, source)
    sendMsg("保存成功")
  } catch (err) {
    sendMsg(String(err), 'error')
    console.error(err)
  }
}

export function openDirOnApp(event: IpcMainInvokeEvent, dirPath: string){
  try {
    //app.getAppPath()
    const path = `${__dirname}${dirPath}`
    console.log(path);
    if (fs.existsSync(path)) {
      shell.openPath(path);
      sendMsg("操作成功")
    } else {
      throw new Error("目录不存在");
    }
    
  } catch (err) {
    sendMsg(String(err), 'error')
    console.error(err);
  }
}