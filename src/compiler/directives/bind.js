/* @flow */

/**
  v-bind 同样支持绑定一个有属性的对象。
  示例：<div class="btnClass" v-bind="{ id: someProp, 'other-attr': otherProp }"></div>
  增加el.wrapData属性：
  el.wrapData = _b({staticClass:"btnClass"},'div',{ id: someProp, 'other-attr': otherProp },false)
  生成render字符串：
  with(this){return _c('div',_b({staticClass:"btnClass"},'div',{ id: someProp, 'other-attr': otherProp },false))}
*/
export default function bind (el: ASTElement, dir: ASTDirective) {
  el.wrapData = (code: string) => {
    return `_b(${code},'${el.tag}',${dir.value},${
      dir.modifiers && dir.modifiers.prop ? 'true' : 'false'
    }${
      dir.modifiers && dir.modifiers.sync ? ',true' : ''
    })`
  }
}
