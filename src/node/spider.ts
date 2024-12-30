import puppeteer from 'puppeteer'
import { dirPathCreator, downloadFile, saveFileSource, saveLog, sendMsg, updateCrawlerLog } from './fileUtil'
import { html2md } from './html2md'
import type { IpcMainInvokeEvent } from 'electron'
import { isDev } from './env'
import { v4 as uuidv4 } from 'uuid'
import fs from 'node:fs';
import { getAppDataPath, getAppName } from './app'

const imgFileDirPath = `${getAppDataPath()}/${getAppName()}/img_files`

function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  })
}

export async function handleFetchPage(
  event: IpcMainInvokeEvent,
  url: string,
  title: string,
  article: string,
) {
  updateCrawlerLog('启动浏览器')
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: !isDev })

  updateCrawlerLog('创建页面')
  const page = await browser.newPage()
  try {
    updateCrawlerLog('访问链接')
    // Navigate the page to a URL
    await page.goto(url)

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 })

    //wait page loading done
    await delay(8_000)
    // Query for an element handle.

    updateCrawlerLog('检查文章主体DOM')
    const mainElement = await page.waitForSelector(article, {
      timeout: 15_000,
    })

    updateCrawlerLog('检查文章标题DOM')
    const titleElement = await page.waitForSelector(title, {
      timeout: 15_000,
    })

    const fullTitle =
      (await titleElement?.evaluate(el =>
        el.textContent
          ?.trim()
          .toString()
          .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, ''),
      )) ?? 'no title'

    const mainElementHtmlString =
      (await mainElement?.evaluate(el => el.innerHTML?.trim().toString())) ??
      'no article'

    if ([null, undefined, ''].includes(mainElementHtmlString)) {
      sendMsg('爬虫失败, 标题为空', 'error')
      updateCrawlerLog('爬虫失败, 标题为空')
    }

    if ([null, undefined, ''].includes(fullTitle)) {
      sendMsg('爬虫失败, 内容为空', 'error')
      updateCrawlerLog('爬虫失败, 内容为空')
    }

    //获取文章中的图片
    const imageElementHandleList = (await mainElement?.$$('img')) || []

    // console.log(imageElementHandleList)

    const len = imageElementHandleList?.length ?? 0
    const imgMap = new Map()
    for (let index = 0; index < len; index++) {
      const temp = imageElementHandleList[index]
      let srcString = await temp?.evaluate(el =>
        el.getAttribute('src')?.trim().toString(),
      )
      imgMap.set(srcString, uuidv4())
    }

    updateCrawlerLog('文章html 转 markdown')
    const mdString = html2md(mainElementHtmlString, imgMap)
    const mdStringWidthImgData = await transformImgToDataurl(imgMap, fullTitle, mdString);

    updateCrawlerLog('保存文件中')
    await saveFileSource(mdStringWidthImgData, `${fullTitle}.md`)

    await browser.close()
    updateCrawlerLog('操作完成', false)
  } catch (error) {
    updateCrawlerLog(`发生错误:${String(error)}`, false)
    sendMsg(String(error), 'error')
  }
}

  //网页中引入图片的格式和dataurl 类型映射
  const ext_dict = {
    'ico': 'x-icon',
    'tiff': 'tif',
    'tif': 'tif',
    'jfif': 'jpeg',
    'jif': 'jpeg',
    'pjpeg': 'jpeg',
    'pjp': 'jpeg',
    'jpg': 'jpeg',
    'jpe': 'jpeg',
    'jpeg': 'jpeg',
    'png': 'png',
    'bmp': 'bmp',
    'avif': 'avif',
    'gif': 'gif',
    'apng': 'apng',
    'awebp': 'webp',
    'webp': 'webp',
    'svg': 'svg+xml',
}
//文件后缀正则
const fileSuffixReg = new RegExp(`.(${Object.keys(ext_dict).join('|')})`, 'ig');

async function transformImgToDataurl(imgMap:Map<string,string>, fileName: string, mainHtmlStr: string){
  dirPathCreator(imgFileDirPath);
  for (const [key, value] of imgMap) {
    let regResult = fileSuffixReg.exec(key);
    if(!regResult){
      console.log(`miss match : ${key}`)
      continue;
    }

    const targetDir=`${imgFileDirPath}/${fileName}`
    const targetPath = `${targetDir}/${value}${regResult[0]}`
    dirPathCreator(targetDir);

    await downloadFile(key, targetPath).then((res:any)=>{
       try {
          if (fs.existsSync(res)) {
            let type = res.split('.')[1];
            let data = fs.readFileSync(res, 'base64')
            let dataUrl = `data:image/${type};base64,${data}`
            mainHtmlStr += `
    
[${value}]: ${dataUrl}
`
          }
        } catch (err) {
          saveLog(`error: [${err}]`)
          console.error(err)
        }
    });

  }
  mainHtmlStr +=`
<!--
  info:
  total:${imgMap.size},
  mapKey:${[...imgMap.keys()]},
  mapId:${[...imgMap.values()]}
-->    
`
  return mainHtmlStr;
}

