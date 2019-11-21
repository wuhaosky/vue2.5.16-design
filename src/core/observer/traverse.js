/* @flow */

import { _Set as Set, isObject } from '../util/index'
import type { SimpleSet } from '../util/index'
import VNode from '../vdom/vnode'

const seenObjects = new Set()

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 * 递归的遍历对象，收集内嵌属性的依赖（Dep）
 */
export function traverse (val: any) { // 递归地读取被观察属性的所有子属性的值，这样被观察属性的所有子属性都将会收集到观察者，从而达到深度观测的目的
  _traverse(val, seenObjects)
  seenObjects.clear()
}

function _traverse (val: any, seen: SimpleSet) {
  let i, keys
  const isA = Array.isArray(val)
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) { // 解决了循环引用导致死循环的问题
    const depId = val.__ob__.dep.id  // 可观测对象的依赖收集器对象的 id
    if (seen.has(depId)) {
      return
    }
    seen.add(depId)
  }
  if (isA) { // val[i] 和 val[keys[i]]，这两个参数实际上是在读取子属性的值，这将触发子属性的 get 拦截器函数，保证子属性能够收集到观察者。
    i = val.length
    while (i--) _traverse(val[i], seen)
  } else {
    keys = Object.keys(val)
    i = keys.length
    while (i--) _traverse(val[keys[i]], seen)
  }
}
