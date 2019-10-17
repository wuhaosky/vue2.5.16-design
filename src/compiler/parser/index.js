/* @flow */

import he from 'he'
import { parseHTML } from './html-parser'
import { parseText } from './text-parser'
import { parseFilters } from './filter-parser'
import { genAssignmentCode } from '../directives/model'
import { extend, cached, no, camelize } from 'shared/util'
import { isIE, isEdge, isServerRendering } from 'core/util/env'

import {
  addProp,
  addAttr,
  baseWarn,
  addHandler,
  addDirective,
  getBindingAttr,
  getAndRemoveAttr,
  pluckModuleFunction
} from '../helpers'

export const onRE = /^@|^v-on:/    // 以@开头 或者 以v-on:开头
export const dirRE = /^v-|^@|^:/   // 以v-开头 或者 以@开头 或者 以:开头
export const forAliasRE = /([^]*?)\s+(?:in|of)\s+([^]*)/   // 匹配 1."(item, index) in data"  2."obj of list" 3."(value, key, index) in object"
export const forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/
const stripParensRE = /^\(|\)$/g   // 带括号，以(开头 或者以)结尾

const argRE = /:(.*)$/               // 匹配 :value
export const bindRE = /^:|^v-bind:/  // 匹配绑定属性 以:开头 或 以v-bind:开头
const modifierRE = /\.[^.]+/g        // 匹配修饰符 .stop

const decodeHTMLCached = cached(he.decode)

// configurable state 8个平台化的变量
export let warn: any
let delimiters
let transforms
let preTransforms
let postTransforms
let platformIsPreTag
let platformMustUseProp
let platformGetTagNamespace

type Attr = { name: string; value: string };

export function createASTElement (
  tag: string,
  attrs: Array<Attr>,
  parent: ASTElement | void
): ASTElement {
  return {
    type: 1,
    tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    parent,
    children: []
  }
}

/**
 * 把模板解析成AST
 * Convert HTML string to AST.
 */
export function parse (
  template: string,
  options: CompilerOptions
): ASTElement | void {
  warn = options.warn || baseWarn // baseWarn 函数的作用无非就是通过 console.error 函数打印错误信息

  platformIsPreTag = options.isPreTag || no // 检查标签是否是 'pre' 标签
  platformMustUseProp = options.mustUseProp || no // 检测一个属性在标签中是否要使用 prop 进行绑定
  platformGetTagNamespace = options.getTagNamespace || no // 获取元素(标签)的命名空间

  transforms = pluckModuleFunction(options.modules, 'transformNode')  // [transformNode, transformNode]
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode') // [preTransformNode]
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode') // []

  delimiters = options.delimiters

  const stack = []
  const preserveWhitespace = options.preserveWhitespace !== false
  let root
  let currentParent // 描述对象之间的父子关系就是靠该变量进行联系的
  let inVPre = false // inVPre 变量用来标识当前解析的标签是否在拥有 v-pre 的标签之内
  let inPre = false // inPre 变量用来标识当前正在解析的标签是否在 <pre></pre> 标签之内
  let warned = false

  function warnOnce (msg) {
    if (!warned) {
      warned = true
      warn(msg)
    }
  }

  function closeElement (element) {
    // check pre state
    if (element.pre) {
      inVPre = false
    }
    if (platformIsPreTag(element.tag)) {
      inPre = false
    }
    // apply post-transforms
    for (let i = 0; i < postTransforms.length; i++) {
      postTransforms[i](element, options)
    }
  }

  parseHTML(template, {
    warn,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
    shouldKeepComment: options.comments,
    start (tag, attrs, unary) {
      // check namespace.
      // inherit parent ns if there is one   platformGetTagNamespace 函数只会获取 svg 和 math 这两个标签的命名空间，但这两个标签的所有子标签都会继承它们两个的命名空间。对于其他标签则不存在命名空间。
      const ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag)

      // handle IE svg bug
      /* istanbul ignore if */
      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs)
      }

      let element: ASTElement = createASTElement(tag, attrs, currentParent)
      if (ns) { // 如果当前解析的开始标签为 svg 标签或者 math 标签或者它们两个的子节点标签，都将会比其他 html 标签的元素描述对象多出一个 ns 属性，且该属性标识了该标签的命名空间。
        element.ns = ns
      }

      if (isForbiddenTag(element) && !isServerRendering()) {
        element.forbidden = true
        process.env.NODE_ENV !== 'production' && warn(
          'Templates should only be responsible for mapping the state to the ' +
          'UI. Avoid placing tags with side-effects in your templates, such as ' +
          `<${tag}>` + ', as they will not be parsed.'
        )
      }

      // apply pre-transforms
      for (let i = 0; i < preTransforms.length; i++) { // preTransforms 数组中的那些函数与 process* 系列函数唯一的区别就是平台化的区分即可。
        element = preTransforms[i](element, options) || element
      }

      if (!inVPre) { // 当 inVPre 变量为真时，意味着后续的所有解析工作都处于 v-pre 环境下，编译器会跳过拥有 v-pre 指令元素以及其子元素的编译过程，所以后续的编译逻辑需要 inVPre 变量作为标识才行。
        processPre(element) // 假如一个标签使用了 v-pre 指令，那么经过 processPre 函数处理之后，该元素描述对象的 .pre 属性值为 true
        if (element.pre) {
          inVPre = true
        }
      }
      if (platformIsPreTag(element.tag)) { // 判断当前元素是否是 <pre> 标签
        inPre = true
      }
      if (inVPre) {
        processRawAttrs(element) // 将该元素所有属性全部作为原生的属性(attr)处理
      } else if (!element.processed) {
        // structural directives
        processFor(element)
        processIf(element)
        processOnce(element)
        // element-scope stuff
        processElement(element, options)
      }

      function checkRootConstraints (el) { // 必须有且仅有一个根元素
        if (process.env.NODE_ENV !== 'production') {
          if (el.tag === 'slot' || el.tag === 'template') {
            warnOnce(
              `Cannot use <${el.tag}> as component root element because it may ` +
              'contain multiple nodes.'
            )
          }
          if (el.attrsMap.hasOwnProperty('v-for')) {
            warnOnce(
              'Cannot use v-for on stateful component root element because ' +
              'it renders multiple elements.'
            )
          }
        }
      }

      // tree management  根元素处理，原则就是只有一个根元素
      if (!root) {
        root = element
        checkRootConstraints(root)
      } else if (!stack.length) {
        // allow root elements with v-if, v-else-if and v-else
        // 如果根元素有v-if，且其兄弟元素含有v-else-if或者 v-else，这样也是被允许的
        if (root.if && (element.elseif || element.else)) {
          checkRootConstraints(element)
          addIfCondition(root, {
            exp: element.elseif,
            block: element
          })
        } else if (process.env.NODE_ENV !== 'production') {
          warnOnce(
            `Component template should contain exactly one root element. ` +
            `If you are using v-if on multiple elements, ` +
            `use v-else-if to chain them instead.`
          )
        }
      }
      if (currentParent && !element.forbidden) {
        if (element.elseif || element.else) { // 当一个元素使用了 v-else-if 或 v-else 指令时，它们是不会作为父级元素子节点的，而是会被添加到相符的使用了 v-if 指令的元素描述对象的 ifConditions 数组中。
          processIfConditions(element, currentParent)
        } else if (element.slotScope) { // scoped slot 使用了 slot-scope 特性的元素来讲它们将被添加到父级元素描述对象的 scopedSlots 对象下
          currentParent.plain = false
          const name = element.slotTarget || '"default"'
          ;(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element
        } else {
          currentParent.children.push(element) // 建立父子关系
          element.parent = currentParent
        }
      }
      if (!unary) {  // 每当遇到一个非一元标签都会将该元素的描述对象添加到 stack 数组，并且 currentParent 始终存储的是 stack 栈顶的元素，即当前解析元素的父级。
        currentParent = element
        stack.push(element)
      } else {
        closeElement(element)
      }
    },

    end () {
      // remove trailing whitespace
      const element = stack[stack.length - 1]
      const lastNode = element.children[element.children.length - 1]
      if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
        element.children.pop()
      }
      // pop stack
      stack.length -= 1
      currentParent = stack[stack.length - 1]
      closeElement(element)
    },

    chars (text: string) {
      if (!currentParent) {
        if (process.env.NODE_ENV !== 'production') {
          if (text === template) {
            warnOnce(
              'Component template requires a root element, rather than just text.'
            )
          } else if ((text = text.trim())) {
            warnOnce(
              `text "${text}" outside root element will be ignored.`
            )
          }
        }
        return
      }
      // IE textarea placeholder bug
      /* istanbul ignore if */
      if (isIE &&
        currentParent.tag === 'textarea' &&
        currentParent.attrsMap.placeholder === text
      ) {
        return
      }
      const children = currentParent.children
      text = inPre || text.trim()
        ? isTextTag(currentParent) ? text : decodeHTMLCached(text)
        // only preserve whitespace if its not right after a starting tag
        : preserveWhitespace && children.length ? ' ' : ''
      if (text) {
        let res
        if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) {
          children.push({
            type: 2,
            expression: res.expression,
            tokens: res.tokens,
            text
          })
        } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
          children.push({
            type: 3,
            text
          })
        }
      }
    },
    comment (text: string) {
      currentParent.children.push({
        type: 3,
        text,
        isComment: true
      })
    }
  })
  return root
}

/**
  处理v-pre属性
  如果元素含有v-pre属性，则元素对应的ASTElement对象的pre属性设置为true
 */
function processPre (el) {
  // 获取v-pre属性的值，并删除el的attrsList数组中的name属性为v-pre的元素
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true
  }
}

/**
  将v-pre元素和所有子元素的属性全部作为原生的属性(attr)处理，并赋值给attrs
 */
function processRawAttrs (el) {
  const l = el.attrsList.length
  if (l) {
    const attrs = el.attrs = new Array(l)
    for (let i = 0; i < l; i++) {
      attrs[i] = {
        name: el.attrsList[i].name,
        value: JSON.stringify(el.attrsList[i].value)
      }
    }
  } else if (!el.pre) { // v-pre元素和所有子元素如果没有属性，则设置plain为true
    // non root node in pre blocks with no attributes
    el.plain = true
  }
}

export function processElement (element: ASTElement, options: CompilerOptions) {
  processKey(element)

  // determine whether this is a plain element after
  // removing structural attributes
  element.plain = !element.key && !element.attrsList.length

  processRef(element)
  processSlot(element)
  processComponent(element)
  for (let i = 0; i < transforms.length; i++) {
    element = transforms[i](element, options) || element
  }
  processAttrs(element)
}

function processKey (el) {
  const exp = getBindingAttr(el, 'key')
  if (exp) {
    if (process.env.NODE_ENV !== 'production' && el.tag === 'template') {
      warn(`<template> cannot be keyed. Place the key on real elements instead.`)
    }
    el.key = exp
  }
}

function processRef (el) {
  const ref = getBindingAttr(el, 'ref')
  if (ref) {
    el.ref = ref
    el.refInFor = checkInFor(el)
  }
}

/**
  解析v-for指令，(item, key, index) in list，把如下属性混入ASTElement中
  for: 'list',
  alias: 'item',
  iterator1: 'key',
  iterator2: 'index'
 */
export function processFor (el: ASTElement) {
  let exp
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    const res = parseFor(exp)
    if (res) {
      extend(el, res) // 使用 extend 函数将 res 常量中的属性混入当前元素的描述对象中
    } else if (process.env.NODE_ENV !== 'production') {
      warn(
        `Invalid v-for expression: ${exp}`
      )
    }
  }
}

type ForParseResult = {
  for: string;
  alias: string;
  iterator1?: string;
  iterator2?: string;
};

/**
exp形如：
(item, key, index) in list

则返回值res，则为：
{
  for: 'list',
  alias: 'item',
  iterator1: 'key',
  iterator2: 'index'
}
 */
export function parseFor (exp: string): ?ForParseResult { // 解析 v-for 指令的值，并创建一个包含解析结果的对象，最后将该对象返回。
  const inMatch = exp.match(forAliasRE)
  if (!inMatch) return
  const res = {}               // 假设exp是item in list 或者 (item, index) in list
  res.for = inMatch[2].trim()  // res.for是list
  const alias = inMatch[1].trim().replace(stripParensRE, '') // alias是item 或者 item, index
  const iteratorMatch = alias.match(forIteratorRE) // iteratorMatch是null 或者 [', index', ' index']
  if (iteratorMatch) {
    res.alias = alias.replace(forIteratorRE, '') // res.alias是item
    res.iterator1 = iteratorMatch[1].trim() // res.iterator1是index
    if (iteratorMatch[2]) {
      res.iterator2 = iteratorMatch[2].trim()
    }
  } else {
    res.alias = alias // res.alias是item
  }
  return res
}

/**

 */
function processIf (el) {
  const exp = getAndRemoveAttr(el, 'v-if')
  if (exp) {
    el.if = exp
    addIfCondition(el, {
      exp: exp,
      block: el
    })
  } else {
    if (getAndRemoveAttr(el, 'v-else') != null) {
      el.else = true
    }
    const elseif = getAndRemoveAttr(el, 'v-else-if')
    if (elseif) {
      el.elseif = elseif
    }
  }
}

function processIfConditions (el, parent) {
  const prev = findPrevElement(parent.children)
  if (prev && prev.if) {
    addIfCondition(prev, {
      exp: el.elseif,
      block: el
    })
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      `v-${el.elseif ? ('else-if="' + el.elseif + '"') : 'else'} ` +
      `used on element <${el.tag}> without corresponding v-if.`
    )
  }
}

function findPrevElement (children: Array<any>): ASTElement | void {
  let i = children.length
  while (i--) {
    if (children[i].type === 1) {
      return children[i]
    } else {
      if (process.env.NODE_ENV !== 'production' && children[i].text !== ' ') {
        warn(
          `text "${children[i].text.trim()}" between v-if and v-else(-if) ` +
          `will be ignored.`
        )
      }
      children.pop()
    }
  }
}

export function addIfCondition (el: ASTElement, condition: ASTIfCondition) {
  if (!el.ifConditions) {
    el.ifConditions = []
  }
  el.ifConditions.push(condition)
}

function processOnce (el) {
  const once = getAndRemoveAttr(el, 'v-once')
  if (once != null) {
    el.once = true
  }
}

function processSlot (el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name')
    if (process.env.NODE_ENV !== 'production' && el.key) {
      warn(
        `\`key\` does not work on <slot> because slots are abstract outlets ` +
        `and can possibly expand into multiple elements. ` +
        `Use the key on a wrapping element instead.`
      )
    }
  } else {
    let slotScope
    if (el.tag === 'template') {
      slotScope = getAndRemoveAttr(el, 'scope')
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && slotScope) {
        warn(
          `the "scope" attribute for scoped slots have been deprecated and ` +
          `replaced by "slot-scope" since 2.5. The new "slot-scope" attribute ` +
          `can also be used on plain elements in addition to <template> to ` +
          `denote scoped slots.`,
          true
        )
      }
      el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope')
    } else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && el.attrsMap['v-for']) {
        warn(
          `Ambiguous combined usage of slot-scope and v-for on <${el.tag}> ` +
          `(v-for takes higher priority). Use a wrapper <template> for the ` +
          `scoped slot to make it clearer.`,
          true
        )
      }
      el.slotScope = slotScope
    }
    const slotTarget = getBindingAttr(el, 'slot')
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget
      // preserve slot as an attribute for native shadow DOM compat
      // only for non-scoped slots.
      if (el.tag !== 'template' && !el.slotScope) {
        addAttr(el, 'slot', slotTarget)
      }
    }
  }
}

function processComponent (el) {
  let binding
  if ((binding = getBindingAttr(el, 'is'))) {
    el.component = binding
  }
  if (getAndRemoveAttr(el, 'inline-template') != null) {
    el.inlineTemplate = true
  }
}

function processAttrs (el) {
  const list = el.attrsList
  let i, l, name, rawName, value, modifiers, isProp
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name
    value = list[i].value
    if (dirRE.test(name)) { // 1.指令属性 v- v-bind: : v-on @
      // mark element as dynamic
      el.hasBindings = true // 当前节点是否拥有绑定
      // modifiers
      modifiers = parseModifiers(name)
      if (modifiers) {
        name = name.replace(modifierRE, '')
      }
      if (bindRE.test(name)) { // 1.1 v-bind指令
        name = name.replace(bindRE, '')
        value = parseFilters(value)
        isProp = false
        if (modifiers) {
          if (modifiers.prop) {
            isProp = true
            name = camelize(name)
            if (name === 'innerHtml') name = 'innerHTML'
          }
          if (modifiers.camel) {
            name = camelize(name)
          }
          if (modifiers.sync) {
            addHandler(
              el,
              `update:${camelize(name)}`,
              genAssignmentCode(value, `$event`)
            )
          }
        }
        if (isProp || (
          !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)
        )) {
          addProp(el, name, value)
        } else {
          addAttr(el, name, value)
        }
      } else if (onRE.test(name)) { // 1.2 v-on指令
        name = name.replace(onRE, '')
        addHandler(el, name, value, modifiers, false, warn)
      } else { // 1.3 普通指令 normal directives
        name = name.replace(dirRE, '')
        // parse arg
        const argMatch = name.match(argRE)
        const arg = argMatch && argMatch[1]
        if (arg) {
          name = name.slice(0, -(arg.length + 1))
        }
        addDirective(el, name, rawName, value, arg, modifiers)
        if (process.env.NODE_ENV !== 'production' && name === 'model') {
          checkForAliasModel(el, value)
        }
      }
    } else { // 2.非指令属性
      // literal attribute
      // 检测是不是非指令属性的属性值使用了字面量表达式，如果是则打印信息，并建议使用绑定属性作为替代
      if (process.env.NODE_ENV !== 'production') {
        const res = parseText(value, delimiters)
        if (res) {
          warn(
            `${name}="${value}": ` +
            'Interpolation inside attributes has been removed. ' +
            'Use v-bind or the colon shorthand instead. For example, ' +
            'instead of <div id="{{ val }}">, use <div :id="val">.'
          )
        }
      }
      // 对于任何非指令属性，都会使用 addAttr 函数将该属性与该属性对应的字符串值添加到元素描述对象的 el.attrs 数组中。
      // 元素描述对象的 el.attrs 数组中所存储的任何属性都会在由虚拟DOM创建真实DOM的过程中使用 setAttribute 方法将属性添加到真实DOM元素上。
      addAttr(el, name, JSON.stringify(value)) // 让该属性的值当做一个纯字符串对待
      // #6887 firefox doesn't update muted state if set via attribute
      // even immediately after element creation
      if (!el.component &&
          name === 'muted' &&
          platformMustUseProp(el.tag, el.attrsMap.type, name)) {
        addProp(el, name, 'true') // 元素描述对象的 el.props 数组中所存储的任何属性都会在由虚拟DOM创建真实DOM的过程中直接使用真实DOM对象添加，也就是说对于 <video> 标签的 muted 属性的添加方式为：videoEl.muted = true。
      }
    }
  }
}

function checkInFor (el: ASTElement): boolean {
  let parent = el
  while (parent) {
    if (parent.for !== undefined) {
      return true
    }
    parent = parent.parent
  }
  return false
}

function parseModifiers (name: string): Object | void { // 解析修饰符
  const match = name.match(modifierRE)  // 例如name='@click.stop', match为['.stop']
  if (match) {
    const ret = {}
    match.forEach(m => { ret[m.slice(1)] = true })
    return ret  // ret为{stop: true}
  }
}

/**
attrs格式：
[{
  name:"class"
  value:"app"
}]
attrsMap格式：
{
  class:"app"
}
 */
function makeAttrsMap (attrs: Array<Object>): Object {
  const map = {}
  for (let i = 0, l = attrs.length; i < l; i++) {
    if (
      process.env.NODE_ENV !== 'production' &&
      map[attrs[i].name] && !isIE && !isEdge
    ) {
      warn('duplicate attribute: ' + attrs[i].name)
    }
    map[attrs[i].name] = attrs[i].value
  }
  return map
}

// for script (e.g. type="x/template") or style, do not decode content
function isTextTag (el): boolean {
  return el.tag === 'script' || el.tag === 'style'
}

function isForbiddenTag (el): boolean {
  return (
    el.tag === 'style' ||
    (el.tag === 'script' && (
      !el.attrsMap.type ||
      el.attrsMap.type === 'text/javascript'
    ))
  )
}

const ieNSBug = /^xmlns:NS\d+/
const ieNSPrefix = /^NS\d+:/

/* istanbul ignore next */
function guardIESVGBug (attrs) {
  const res = []
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i]
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '')
      res.push(attr)
    }
  }
  return res
}

function checkForAliasModel (el, value) {
  let _el = el
  while (_el) {
    if (_el.for && _el.alias === value) {
      warn(
        `<${el.tag} v-model="${value}">: ` +
        `You are binding v-model directly to a v-for iteration alias. ` +
        `This will not be able to modify the v-for source array because ` +
        `writing to the alias is like modifying a function local variable. ` +
        `Consider using an array of objects and use v-model on an object property instead.`
      )
    }
    _el = _el.parent
  }
}
