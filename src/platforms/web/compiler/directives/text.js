/* @flow */

import { addProp } from 'compiler/helpers'

/**
  示例：
  <div v-text="msg"></div>
  执行本方法后，更新el.props属性：
  "props": [
      {
          "name": "textContent",
          "value": "_s(msg)"
      }
  ],
  生成的render字符串：
  with(this){return _c('div',{domProps:{"textContent":_s(msg)}})}
 */
export default function text (el: ASTElement, dir: ASTDirective) {
  if (dir.value) {
    addProp(el, 'textContent', `_s(${dir.value})`)
  }
}
