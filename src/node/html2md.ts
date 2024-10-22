//https://www.npmjs.com/package/turndown
const TurndownService = require('turndown')
const turndownPluginGfm = require('turndown-plugin-gfm')
const gfm = turndownPluginGfm.gfm

export function html2md(html:string){
    const turndownService = new TurndownService({
        headingStyle: 'atx'
    })
    turndownService.use(gfm)
    turndownService.remove('style')
    turndownService.remove('meta')
    const markdown = turndownService.turndown(html)
    return markdown
}