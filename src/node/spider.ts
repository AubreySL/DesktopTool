import puppeteer from 'puppeteer'
import { saveFileSource } from './fileUtil'
import { html2md } from './html2md'
import type { IpcMainInvokeEvent } from 'electron'

function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  })
}

export async function handleFetchPage(event: IpcMainInvokeEvent, url:string, title:string, article: string) {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  // Navigate the page to a URL
  await page.goto(url)

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 })

  //wait page loading done
  await delay(4_000)
  // Query for an element handle.
  const mainElement = await page.waitForSelector(article, {
    visible: true,
    timeout: 15_000,
  })
  const mainElementHtml =
    (await mainElement?.evaluate(el => el.innerHTML?.trim().toString())) ??
    'body'
  const titleElement = await page.waitForSelector(title)
  const fullTitle =
    (await titleElement?.evaluate(el => el.textContent?.trim().toString())) ??
    'title'

  const mdString = await html2md(mainElementHtml)
  await saveFileSource(mdString, `${fullTitle}.md`)
  await browser.close()
}
