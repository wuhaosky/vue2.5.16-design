/* @flow */

import { makeMap, isBuiltInTag, cached, no } from 'shared/util'

let isStaticKey
let isPlatformReservedTag

const genStaticKeysCached = cached(genStaticKeys)

/**
 * Goal of the optimizer: walk the generated template AST tree
 * and detect sub-trees that are purely static, i.e. parts of
 * the DOM that never needs to change.
 *
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render;
 * 2. Completely skip them in the patching process.
 */
/**
 * 优化器的目标：遍历生成的抽象语法树，探测纯静态的子树，也就是那些创建后不再需要变更的DOM节点。
 * 一旦我们检测到这些子树，我们可以：
 * 1.把它们提升为常量，从而在每次re-render时，我们不再需要为它们创造新的节点；
 * 2.在patch这一步，完全的跳过这些子树。
 */
export function optimize (root: ?ASTElement, options: CompilerOptions) { // 我们在编译阶段可以把一些 AST 节点优化成静态节点，所以整个 optimize 的过程实际上就干 2 件事情，markStatic(root) 标记静态节点 ，markStaticRoots(root, false) 标记静态根。
  if (!root) return
  isStaticKey = genStaticKeysCached(options.staticKeys || '')  // isStaticKey是makeMap('type,tag,attrsList,attrsMap,plain,parent,children,attrs,staticClass,staticStyle')
  isPlatformReservedTag = options.isReservedTag || no
  // first pass: mark all non-static nodes.
  markStatic(root)
  // second pass: mark static roots.
  markStaticRoots(root, false)
}

function genStaticKeys (keys: string): Function {
  return makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
    (keys ? ',' + keys : '')
  )
}

/**
 * 标记静态节点
 *
 * @param {ASTNode} node
 */
function markStatic (node: ASTNode) {
  node.static = isStatic(node)
  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    if (                                       // TODO: 这段代码没看懂
      !isPlatformReservedTag(node.tag) &&      // 节点是组件
      node.tag !== 'slot' &&                   // 并 节点标签不是slot
      node.attrsMap['inline-template'] == null // 并 节点不含inline-template属性
    ) {
      return
    }
    // 深度优先遍历子元素
    for (let i = 0, l = node.children.length; i < l; i++) {
      const child = node.children[i]
      markStatic(child)
      if (!child.static) {
        node.static = false // 如果子元素不是静态的，那父元素也不是静态
      }
    }
    if (node.ifConditions) { // 如果其它if条件不是静态的，则当前元素也不是静态的
      for (let i = 1, l = node.ifConditions.length; i < l; i++) {
        const block = node.ifConditions[i].block
        markStatic(block)
        if (!block.static) {
          node.static = false
        }
      }
    }
  }
}

/**
 * 标记静态根
 *
 * @param {ASTNode} node
 * @param {boolean} isInFor
 */
function markStaticRoots (node: ASTNode, isInFor: boolean) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor // 标记静态节点是否在一个 for 标签之内
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    // 要使节点符合静态根的条件，节点必须要有子节点，并且子节点不能只是静态文本。否则，标记静态节点的成本高于获得的收益。
    if (node.static && node.children.length && !( // 如果是静态节点, 有不止一个子节点, 或者有一个子节点但不是文本节点, 就标记为静态根
      node.children.length === 1 &&
      node.children[0].type === 3
    )) {
      node.staticRoot = true
      return // 作为静态 '根' 节点, 找到了就行了
    } else {
      node.staticRoot = false
    }
    if (node.children) {
      for (let i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for)
      }
    }
    if (node.ifConditions) {
      for (let i = 1, l = node.ifConditions.length; i < l; i++) {
        markStaticRoots(node.ifConditions[i].block, isInFor)
      }
    }
  }
}

/**
 * 判断是不是静态节点
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isStatic (node: ASTNode): boolean {
  if (node.type === 2) { // expression
    return false
  }
  if (node.type === 3) { // text
    return true
  }
  return !!(node.pre || ( // 有v-pre指令
    !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in 不是内置组件
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) && // 非带有 v-for 的 template 标签的直接子节点
    Object.keys(node).every(isStaticKey) // 节点的所有属性的 key 都满足静态 key
  ))
}

/**
 * 带有 v-for 的 template 标签的直接子节点
 *
 * @param {ASTElement} node
 * @returns {boolean}
 */
function isDirectChildOfTemplateFor (node: ASTElement): boolean {
  while (node.parent) {
    node = node.parent
    if (node.tag !== 'template') {
      return false
    }
    if (node.for) {
      return true
    }
  }
  return false
}
