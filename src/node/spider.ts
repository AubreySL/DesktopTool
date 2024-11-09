import puppeteer from 'puppeteer'
import { saveFileSource, sendMsg, updateCrawlerLog } from './fileUtil'
import { html2md } from './html2md'
import type { IpcMainInvokeEvent } from 'electron'
import { isDev } from './env'

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
    await delay(4_000)
    // Query for an element handle.

    updateCrawlerLog('获取文章标题DOM')
    const titleElement = await page.waitForSelector(title, {
      timeout: 15_000,
    })

    updateCrawlerLog('获取文章主体DOM')
    const mainElement = await page.waitForSelector(article, {
      timeout: 15_000,
    })

    const fullTitle =
    (await titleElement?.evaluate(el => el.textContent?.trim().toString())) ??
    'no title'

    const mainElementHtml =
      (await mainElement?.evaluate(el => el.innerHTML?.trim().toString())) ??
      'no article'

    if ([null, undefined, ''].includes(mainElementHtml)) {
      sendMsg('爬虫失败, 标题为空', 'error')
      updateCrawlerLog('爬虫失败, 标题为空')
    }
    
    if ([null, undefined, ''].includes(fullTitle)) {
      sendMsg('爬虫失败, 内容为空', 'error')
      updateCrawlerLog('爬虫失败, 内容为空')
    }
    updateCrawlerLog('文章html 转 markdown')
    const mdString = html2md(mainElementHtml)
    updateCrawlerLog('保存文件中')
    await saveFileSource(mdString, `${fullTitle}.md`)

    await browser.close()
    updateCrawlerLog('操作完成', false)
  } catch (error) {
    updateCrawlerLog(`发生错误:${String(error)}`, false)
    sendMsg(String(error), 'error')
  }
}
