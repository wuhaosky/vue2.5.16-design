/**
在一轮比对中，可能存在无法找到可复用的节点，这时我们只能拿新 children 中的这个节点尝试去旧 children 中寻找，
试图找到拥有相同 key 值的节点，
*/

while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
  if (!oldStartVNode) {
    oldStartVNode = prevChildren[++oldStartIdx]
  } else if (!oldEndVNode) {
    oldEndVNode = prevChildren[--oldEndIdx]
  } else if (oldStartVNode.key === newStartVNode.key) {
    // 省略...
  } else if (oldEndVNode.key === newEndVNode.key) {
    // 省略...
  } else if (oldStartVNode.key === newEndVNode.key) {
    // 省略...
  } else if (oldEndVNode.key === newStartVNode.key) {
    // 省略...
  } else {
    const idxInOld = prevChildren.findIndex(
      node => node.key === newStartVNode.key
    )
    if (idxInOld >= 0) {
      const vnodeToMove = prevChildren[idxInOld]
      patch(vnodeToMove, newStartVNode, container)
      prevChildren[idxInOld] = undefined
      container.insertBefore(vnodeToMove.el, oldStartVNode.el)
    }
    newStartVNode = nextChildren[++newStartIdx]
  }
}
