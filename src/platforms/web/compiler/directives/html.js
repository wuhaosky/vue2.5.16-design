/* @flow */

import { addProp } from 'compiler/helpers'

/**
  示例：<div v-html="text" ></div>
  更新el.props属性
  "props": [
      {
          "name": "innerHTML",
          "value": "_s(text)"
      }
  ]
  生成的render字符串：
  with(this){return _c('div',{domProps:{"innerHTML":_s(text)}})}
*/
export default function html (el: ASTElement, dir: ASTDirective) {
  if (dir.value) {
    addProp(el, 'innerHTML', `_s(${dir.value})`)
  }
}
