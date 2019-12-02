/**
双端比较，就是同时从新旧 children 的两端开始进行比较的一种方式，所以我们需要四个索引值，分别指向新旧 children 的两端，在一次比较过程中，最多需要进行四次比较：
1、使用旧 children 的头一个 VNode 与新 children 的头一个 VNode比对，即 oldStartVNode 和 newStartVNode 比较对。
2、使用旧 children 的最后一个 VNode 与新 children 的最后一个 VNode 比对，即 oldEndVNode 和 newEndVNode 比对。
3、使用旧 children 的头一个 VNode 与新 children 的最后一个 VNode 比对，即 oldStartVNode 和 newEndVNode 比对。
4、使用旧 children 的最后一个 VNode 与新 children 的头一个 VNode 比对，即 oldEndVNode 和 newStartVNode 比对。
*/

let oldStartIdx = 0
let oldEndIdx = prevChildren.length - 1
let newStartIdx = 0
let newEndIdx = nextChildren.length - 1
let oldStartVNode = prevChildren[oldStartIdx]
let oldEndVNode = prevChildren[oldEndIdx]
let newStartVNode = nextChildren[newStartIdx]
let newEndVNode = nextChildren[newEndIdx]

while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
  if (!oldStartVNode) {
    oldStartVNode = prevChildren[++oldStartIdx]
  } else if (!oldEndVNode) {
    oldEndVNode = prevChildren[--oldEndIdx]
  } else if (oldStartVNode.key === newStartVNode.key) {
    patch(oldStartVNode, newStartVNode, container)
    oldStartVNode = prevChildren[++oldStartIdx]
    newStartVNode = nextChildren[++newStartIdx]
  } else if (oldEndVNode.key === newEndVNode.key) {
    patch(oldEndVNode, newEndVNode, container)
    oldEndVNode = prevChildren[--oldEndIdx]
    newEndVNode = newEndVNode[--newEndIdx]
  } else if (oldStartVNode.key === newEndVNode.key) {
    patch(oldStartVNode, newEndVNode, container)
    container.insertBefore(
      oldStartVNode.el,
      oldEndVNode.el.nextSibling
    )
    oldStartVNode = prevChildren[++oldStartIdx]
    newEndVNode = nextChildren[--newEndIdx]
  } else if (oldEndVNode.key === newStartVNode.key) {
    patch(oldEndVNode, newStartVNode, container)
    container.insertBefore(oldEndVNode.el, oldStartVNode.el)
    oldEndVNode = prevChildren[--oldEndIdx]
    newStartVNode = nextChildren[++newStartIdx]
  }
}
