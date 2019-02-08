/* @flow */

import type Watcher from './watcher'
import { remove } from '../util/index'

let uid = 0

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 * 依赖收集器
 */
export default class Dep {
  static target: ?Watcher; // 全局变量 当前观察者
  id: number;
  subs: Array<Watcher>; // 观察者数组

  constructor () {
    this.id = uid++
    this.subs = []
  }

  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  depend () { // 观察者记录依赖收集器，依赖收集器收集观察者
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify () { // 遍历所有观察者，并调用观察者update方法
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
// 无论何时，全局只能有一个观察者被执行，这个观察者就是Dep.target
// 即将被执行的观察者被暂存到targetStack
Dep.target = null
const targetStack = []

export function pushTarget (_target: ?Watcher) {
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = _target
}

export function popTarget () {
  Dep.target = targetStack.pop()
}
