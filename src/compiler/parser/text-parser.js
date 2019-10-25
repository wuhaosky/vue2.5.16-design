/* @flow */

import { cached } from 'shared/util'
import { parseFilters } from './filter-parser'

const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g    // 匹配模板插值的正则
const regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g

const buildRegex = cached(delimiters => {
  const open = delimiters[0].replace(regexEscapeRE, '\\$&')
  const close = delimiters[1].replace(regexEscapeRE, '\\$&')
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
})

type TextParseResult = {
  expression: string,
  tokens: Array<string | { '@binding': string }>
}

/**
 *
 * 模板插值处理
 * @export
 * @param {string} text
 * @param {[string, string]} [delimiters]
 * @returns {(TextParseResult | void)}
 */
export function parseText (
  text: string,
  delimiters?: [string, string]
): TextParseResult | void {
  const tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE
  if (!tagRE.test(text)) {
    return
  }
  const tokens = [] //
  const rawTokens = []
  let lastIndex = tagRE.lastIndex = 0
  let match, index, tokenValue
  while ((match = tagRE.exec(text))) {
    index = match.index
    // push text token
    if (index > lastIndex) {
      rawTokens.push(tokenValue = text.slice(lastIndex, index))
      tokens.push(JSON.stringify(tokenValue))
    }
    // tag token
    const exp = parseFilters(match[1].trim())
    tokens.push(`_s(${exp})`)
    rawTokens.push({ '@binding': exp })
    lastIndex = index + match[0].length
  }
  if (lastIndex < text.length) {
    rawTokens.push(tokenValue = text.slice(lastIndex))
    tokens.push(JSON.stringify(tokenValue))
  }
  return {
    expression: tokens.join('+'),  // 生成render函数使用
    tokens: rawTokens  // 记号流
  }
}

// 例子：
// 这是插值{{ msg + avg}}示{{msg2}}例
// {
//     "type": 2,
//     "expression": "\"这是插值\"+_s(msg + avg)+\"示\"+_s(msg2)+\"例\"",
//     "tokens": [
//         "这是插值",
//         {
//             "@binding": "msg + avg"
//         },
//         "示",
//         {
//             "@binding": "msg2"
//         },
//         "例"
//     ],
//     "text": "这是插值{{ msg + avg}}示{{msg2}}例",
//     "static": false
// }
