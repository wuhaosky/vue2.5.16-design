/**
循环结束后，一旦满足条件 newEndIdx < newStartId 则说明有元素需要被移除。
*/

while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
  // 省略...
}
if (oldEndIdx < oldStartIdx) {
  // 添加新节点
  for (let i = newStartIdx; i <= newEndIdx; i++) {
    mount(nextChildren[i], container, false, oldStartVNode.el)
  }
} else if (newEndIdx < newStartIdx) {
  // 移除操作
  for (let i = oldStartIdx; i <= oldEndIdx; i++) {
    container.removeChild(prevChildren[i].el)
  }
}
