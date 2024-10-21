import puppeteer from 'puppeteer'

export async function fetchPage(
 
) {
    const url = 'https://juejin.cn/post/7407385581079396389',
    article = 'div#article-root',
    // title = "//h1[@class='article-title']/text()";
    title = "h1.article-title";
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  // Navigate the page to a URL
  await page.goto(url)

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 })

  // Query for an element handle.
  const mainElement = await page.waitForSelector(article, {
    visible: true,
    timeout: 50_000
  })
//   const titleElement = await page.waitForSelector(`::-p-xpath(${title})`)
  const titleElement = await page.waitForSelector(title)

  
  const fullTitle = await titleElement?.evaluate(el => el.textContent?.trim().toString());
  console.log(fullTitle);
  
  await mainElement?.screenshot({
    path: `${fullTitle}.png`,
  })

//   await browser.close()
}
