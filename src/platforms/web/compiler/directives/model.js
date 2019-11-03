/* @flow */

import config from 'core/config'
import { addHandler, addProp, getBindingAttr } from 'compiler/helpers'
import { genComponentModel, genAssignmentCode } from 'compiler/directives/model'

let warn

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
export const RANGE_TOKEN = '__r'
export const CHECKBOX_RADIO_TOKEN = '__c'

/**
  用 v-model 指令在表单 <input>、<textarea> 及 <select> 元素上创建双向数据绑定。它会根据控件类型自动选取正确的方法来更新元素。

  v-model 在内部为不同的输入元素使用不同的属性并抛出不同的事件：
  text 和 textarea 元素使用 value 属性和 input 事件；
  checkbox 和 radio 使用 checked 属性和 change 事件；
  select 字段将 value 作为 prop 并将 change 作为事件。
*/
export default function model (
  el: ASTElement,
  dir: ASTDirective,
  _warn: Function
): ?boolean {
  warn = _warn
  const value = dir.value
  const modifiers = dir.modifiers
  const tag = el.tag
  const type = el.attrsMap.type

  if (process.env.NODE_ENV !== 'production') {
    // inputs with type="file" are read only and setting the input's
    // value will throw an error.
    if (tag === 'input' && type === 'file') {
      warn(
        `<${el.tag} v-model="${value}" type="file">:\n` +
        `File inputs are read only. Use a v-on:change listener instead.`
      )
    }
  }

  if (el.component) {
    genComponentModel(el, value, modifiers)
    // component v-model doesn't need extra runtime
    return false
  } else if (tag === 'select') {
    genSelect(el, value, modifiers)
  } else if (tag === 'input' && type === 'checkbox') {
    genCheckboxModel(el, value, modifiers)
  } else if (tag === 'input' && type === 'radio') {
    genRadioModel(el, value, modifiers)
  } else if (tag === 'input' || tag === 'textarea') {
    genDefaultModel(el, value, modifiers)
  } else if (!config.isReservedTag(tag)) {
    genComponentModel(el, value, modifiers)
    // component v-model doesn't need extra runtime
    return false
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      `<${el.tag} v-model="${value}">: ` +
      `v-model is not supported on this element type. ` +
      'If you are working with contenteditable, it\'s recommended to ' +
      'wrap a library dedicated for that purpose inside a custom component.'
    )
  }

  // ensure runtime directive metadata
  return true
}

/**
  示例：
  <input type="checkbox"  v-model="food"/>
  执行genSelect后，更新el.events属性：
  "el.events": {
    "change": function($event){
      var $$a = food, $$el = $event.target, $$c = $$el.checked ? (true) : (false);
      if (Array.isArray($$a)) {
        var $$v = null, $$i = _i($$a, $$v);
        if ($$el.checked) {
          $$i < 0 && (food = $$a.concat([$$v]))
        } else {
          $$i > -1 && (food = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
        }
      } else {
        food = $$c
      }
    }
  },
  生成的render字符串：
  with(this){
    return _c(
      'input',
      {
        directives: [{
          name: "model",
          rawName: "v-model",
          value: (food),
          expression: "food"
        }],
        attrs: {"type": "checkbox"},
        domProps: {"checked": Array.isArray(food) ? _i(food, null) > -1: (food)},
        on: {
          "change": function($event){
            var $$a = food, $$el = $event.target, $$c = $$el.checked ? (true) : (false);
            if (Array.isArray($$a)) {
              var $$v = null, $$i = _i($$a, $$v);
              if ($$el.checked) {
                $$i < 0 && (food = $$a.concat([$$v]))
              } else {
                $$i > -1 && (food = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
              }
            } else {
              food = $$c
            }
          }
        }
      }
    )
  }
 */
function genCheckboxModel (
  el: ASTElement,
  value: string,
  modifiers: ?ASTModifiers
) {
  const number = modifiers && modifiers.number
  const valueBinding = getBindingAttr(el, 'value') || 'null'
  const trueValueBinding = getBindingAttr(el, 'true-value') || 'true'
  const falseValueBinding = getBindingAttr(el, 'false-value') || 'false'
  addProp(el, 'checked',
    `Array.isArray(${value})` +
    `?_i(${value},${valueBinding})>-1` + (
      trueValueBinding === 'true'
        ? `:(${value})`
        : `:_q(${value},${trueValueBinding})`
    )
  )
  addHandler(el, 'change',
    `var $$a=${value},` +
        '$$el=$event.target,' +
        `$$c=$$el.checked?(${trueValueBinding}):(${falseValueBinding});` +
    'if(Array.isArray($$a)){' +
      `var $$v=${number ? '_n(' + valueBinding + ')' : valueBinding},` +
          '$$i=_i($$a,$$v);' +
      `if($$el.checked){$$i<0&&(${genAssignmentCode(value, '$$a.concat([$$v])')})}` +
      `else{$$i>-1&&(${genAssignmentCode(value, '$$a.slice(0,$$i).concat($$a.slice($$i+1))')})}` +
    `}else{${genAssignmentCode(value, '$$c')}}`,
    null, true
  )
}

/**
  示例：
  <input type="radio"  v-model="food" value="apple"/>
  执行genSelect后，更新el.events属性：
  "el.events": {
    "change": function($event){
      food = "apple"
    }
  },
  生成的render字符串：
  with(this){
    return _c(
      'input',
      {
        directives: [{
          name: "model",
          rawName: "v-model",
          value: (food),
          expression: "food"
        }],
        attrs: {"type": "radio", "value": "apple"},
        domProps: {"checked": _q(food, "apple")},
        on: {
          "change": function($event){
            food = "apple"
          }
        }
      }
    )
  }
 */
function genRadioModel (
  el: ASTElement,
  value: string,
  modifiers: ?ASTModifiers
) {
  const number = modifiers && modifiers.number
  let valueBinding = getBindingAttr(el, 'value') || 'null'
  valueBinding = number ? `_n(${valueBinding})` : valueBinding
  addProp(el, 'checked', `_q(${value},${valueBinding})`)
  addHandler(el, 'change', genAssignmentCode(value, valueBinding), null, true)
}

/**
  示例：
  <select v-model="city">
    <option value ="shanghai">ShangHai</option>
  </select>
  执行genSelect后，更新el.events属性：
  "el.events": {
    "change": {
        "value": "function($event){
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val});
          city = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
        }"
    }
  },
  生成的render字符串：
  with(this){
    return _c(
      'select',
      {
        directives: [{
          name: "model",
          rawName: "v-model",
          value: (city),
          expression: "city"
        }],
        on: {
          "change": function($event){
            var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val});
            city = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
          }
        }
      },
      [_c('option', {attrs: {"value": "shanghai"}}, [_v("ShangHai")])]
    )
  }
 */
function genSelect (
  el: ASTElement,
  value: string,
  modifiers: ?ASTModifiers
) {
  const number = modifiers && modifiers.number
  const selectedVal = `Array.prototype.filter` +
    `.call($event.target.options,function(o){return o.selected})` +
    `.map(function(o){var val = "_value" in o ? o._value : o.value;` +
    `return ${number ? '_n(val)' : 'val'}})`

  const assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]'
  let code = `var $$selectedVal = ${selectedVal};`
  code = `${code} ${genAssignmentCode(value, assignment)}`
  addHandler(el, 'change', code, null, true)
}

/**
  示例：
  <textarea v-model.trim="text" />
  执行genSelect后，更新el.events属性：
  "events": {
      "input": {
          "value": "if($event.target.composing)return;text=$event.target.value.trim()"
      },
      "blur": {
          "value": "$forceUpdate()"
      }
  },
  生成的render字符串：
  with(this){
    return _c(
      'textarea',
      {
        directives: [{
          name: "model",
          rawName: "v-model.trim",
          value: (text),
          expression: "text",
          modifiers: {"trim": true}
        }],
        domProps: {"value": (text)},
        on: {
          "input": function($event){
            if($event.target.composing)
              return;
            text = $event.target.value.trim()
          },
          "blur": function($event){
            return $forceUpdate()
          }
        }
      }
    )
  }
 */
function genDefaultModel (
  el: ASTElement,
  value: string,
  modifiers: ?ASTModifiers
): ?boolean {
  const type = el.attrsMap.type

  // warn if v-bind:value conflicts with v-model
  // except for inputs with v-bind:type
  if (process.env.NODE_ENV !== 'production') {
    const value = el.attrsMap['v-bind:value'] || el.attrsMap[':value']
    const typeBinding = el.attrsMap['v-bind:type'] || el.attrsMap[':type']
    if (value && !typeBinding) {
      const binding = el.attrsMap['v-bind:value'] ? 'v-bind:value' : ':value'
      warn(
        `${binding}="${value}" conflicts with v-model on the same element ` +
        'because the latter already expands to a value binding internally'
      )
    }
  }

  const { lazy, number, trim } = modifiers || {}
  const needCompositionGuard = !lazy && type !== 'range'
  const event = lazy  // lazy修饰符使用change事件，否则使用input事件
    ? 'change'
    : type === 'range'
      ? RANGE_TOKEN
      : 'input'

  let valueExpression = '$event.target.value'
  if (trim) {
    valueExpression = `$event.target.value.trim()`
  }
  if (number) {
    valueExpression = `_n(${valueExpression})`
  }

  let code = genAssignmentCode(value, valueExpression)
  // IME问题，即中文输入时出现在输入框上方的带候选但还未选择的状态，input框中会输入出现连续的字母异常问题；
  // onChange或者onInput事件不可用，onblur事件产品体验效果不佳；
  // onCompositionStart // 开始打字
  // onCompositionEnd // 打字结束
  // onCompositionUpdate // 打字过程中
  // 立flag,在start中置为false,end中为true；在flag为true时，可对输入值有所处理。
  // 参考文档：https://segmentfault.com/a/1190000009246058
  if (needCompositionGuard) {
    code = `if($event.target.composing)return;${code}`
  }

  addProp(el, 'value', `(${value})`)
  addHandler(el, event, code, null, true)
  if (trim || number) {
    addHandler(el, 'blur', '$forceUpdate()')
  }
}
