/* @flow */

import { warn } from 'core/util/index'

/**
  v-on 同样支持不带参数绑定一个事件/监听器键值对的对象。注意当使用对象语法时，是不支持任何修饰器的。
  示例：<button class="btnClass" v-on="{ mousedown: doThis, mouseup: doThat }"></button>
  增加el.wrapListeners属性：
  el.wrapListeners = (code) => `_g({staticClass:"btnClass"},{ mousedown: doThis, mouseup: doThat })`
  生成render字符串：
  with(this){return _c('button',_g({staticClass:"btnClass"},{ mousedown: doThis, mouseup: doThat }))}
*/
export default function on (el: ASTElement, dir: ASTDirective) {
  if (process.env.NODE_ENV !== 'production' && dir.modifiers) {
    warn(`v-on without argument does not support modifiers.`)
  }
  el.wrapListeners = (code: string) => `_g(${code},${dir.value})`
}
