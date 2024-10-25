//https://www.npmjs.com/package/turndown
import TurndownService from 'turndown'
// const TurndownService = require('turndown')
// @ts-ignore
import * as turndownPluginGfm from 'turndown-plugin-gfm'

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