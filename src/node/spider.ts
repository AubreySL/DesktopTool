import puppeteer from 'puppeteer'
import { saveFileSource, sendMsg } from './fileUtil'
import { html2md } from './html2md'
import type { IpcMainInvokeEvent } from 'electron'

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
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  // Navigate the page to a URL
  await page.goto(url)

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 })

  //wait page loading done
  await delay(4_000)
  // Query for an element handle.
  try {
    const mainElement = await page.waitForSelector(article, {
      timeout: 15_000,
    })

    const titleElement = await page.waitForSelector(title, {
      timeout: 15_000,
    })

    const mainElementHtml =
      (await mainElement?.evaluate(el => el.innerHTML?.trim().toString())) ??
      'body'

    const fullTitle =
      (await titleElement?.evaluate(el => el.textContent?.trim().toString())) ??
      'title'

    if ([null, undefined, ''].includes(mainElementHtml)) {
      sendMsg('爬虫失败, 标题为空', 'error')
    }
    if ([null, undefined, ''].includes(fullTitle)) {
      sendMsg('爬虫失败, 内容为空', 'error')
    }
    const mdString = html2md(mainElementHtml)
    await saveFileSource(mdString, `${fullTitle}.md`)
  } catch (error) {
    sendMsg(String(error), 'error')
  }
  await browser.close()
}
