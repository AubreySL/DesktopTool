//https://www.npmjs.com/package/turndown
import TurndownService, { type Node } from 'turndown'
// const TurndownService = require('turndown')
// @ts-ignore
import * as turndownPluginGfm from 'turndown-plugin-gfm'

const gfm = turndownPluginGfm.gfm
export function html2md(html: string, imgMap:Map<string,string>) {
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    // linkStyle: 'referenced',
    preformattedCode: true,
  })
  turndownService.use(gfm)
  turndownService.remove('style')
  turndownService.remove('meta')
  turndownService.remove('img')
  turndownService.addRule('imageCustom', {
    filter: ['img'],
    replacement: function (content, node: any ) {
        let alt = cleanAttribute(node.getAttribute('alt'));
        let src = node.getAttribute('src') || '';
        let id = imgMap.get(src);
        return src ? '![' + alt + ']' + '[' + id  + ']' : ''
      }
  })
  const markdown = turndownService.turndown(html)
  return markdown
}

function cleanAttribute (attribute:string) {
    return attribute ? attribute.replace(/(\n+\s*)+/g, '\n') : ''
  }
