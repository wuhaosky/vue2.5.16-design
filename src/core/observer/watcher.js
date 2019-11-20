/* @flow */

import {
  warn,
  remove,
  isObject,
  parsePath,
  _Set as Set,
  handleError
} from '../util/index'

import { traverse } from './traverse'
import { queueWatcher } from './scheduler'
import Dep, { pushTarget, popTarget } from './dep'

import type { SimpleSet } from '../util/index'

let uid = 0

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 * 一个表达式的观察者，收集这个表达式的依赖，当表达式改变时，触发观察者的回调函数
 */
export default class Watcher {
  vm: Component; // 该属性指明了这个观察者是属于哪一个组件的
  expression: string;
  cb: Function; // 回调函数
  id: number;
  deep: boolean; // 发现对象内部值的变化
  user: boolean; // 这代表该观察者实例是用户创建的
  lazy: boolean;
  sync: boolean;
  dirty: boolean; // dirty是缓存标识，true意味着没有缓存需要重新计算，false意味着有缓存不需要重新计算
  active: boolean; // 观察者是否有效
  deps: Array<Dep>;   // 上一次求值时，收集到的依赖
  newDeps: Array<Dep>; // 最近一次求值时，收集到的依赖
  depIds: SimpleSet;
  newDepIds: SimpleSet;
  getter: Function;  // 返回值是value
  value: any; // 当前值

  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    this.vm = vm
    if (isRenderWatcher) { // 标识着是否是渲染函数的观察者
      vm._watcher = this
    }
    vm._watchers.push(this) // 属于该组件实例的观察者都会被添加到该组件实例对象的 vm._watchers 数组中，包括渲染函数的观察者和非渲染函数的观察者
    // options
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.cb = cb
    this.id = ++uid // uid for batching
    this.active = true
    this.dirty = this.lazy // for lazy watchers  计算属性是惰性求值
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    this.expression = process.env.NODE_ENV !== 'production'
      ? expOrFn.toString()
      : ''
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = function () {}
        process.env.NODE_ENV !== 'production' && warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )
      }
    }
    this.value = this.lazy
      ? undefined
      : this.get()
  }

  /**
   * Evaluate the getter, and re-collect dependencies.
   * 计算当前值，并收集依赖
   */
  get () {
    pushTarget(this) // 让依赖知道当前求值的是哪个观察者
    let value
    const vm = this.vm
    try {
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value) // 递归求对象（所有对象属性）或数组（所有元素）的值，收集所有相关依赖
      }
      popTarget()
      this.cleanupDeps()
    }
    return value
  }

  /**
   * Add a dependency to this directive.
   * 观察者记录依赖收集器，依赖收集器收集观察者
   */
  addDep (dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) { // 把依赖添加到newDeps里
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) { // 把观察者添加到依赖里，建立依赖和观察者的双向引用
        dep.addSub(this)
      }
    }
  }

  /**
   * Clean up for dependency collection.
   * 把最新一次收集的依赖存储到deps里，然后清空newDeps
   */
  cleanupDeps () {
    let i = this.deps.length
    while (i--) { //
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) { // 检查上一次求值所收集到的 Dep 实例对象是否存在于当前这次求值所收集到的 Dep 实例对象中
        dep.removeSub(this) // 将该观察者对象从 Dep 实例对象中移除
      }
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }

  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   * 订阅接口，当观测对象变化时调用。
   */
  update () {
    /* istanbul ignore else */
    if (this.lazy) { // 计算属性
      this.dirty = true // 计算属性值缓存失效，需要重新计算
    } else if (this.sync) { // 同步更新变化
      this.run()
    } else { // 异步更新变化
      queueWatcher(this)
    }
  }

  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   * 调度作业接口，异步更新时会被调度器调用。
   */
  run () {
    if (this.active) {
      const value = this.get()
      if ( // 实际上 if 语句块内的代码是为非渲染函数类型的观察者准备的，它用来对比新旧两次求值的结果，当值不相等的时候会调用通过参数传递进来的回调。
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) {
        // set new value
        const oldValue = this.value
        this.value = value
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue)
          } catch (e) {
            handleError(e, this.vm, `callback for watcher "${this.expression}"`)
          }
        } else {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   * 计算观察者的值，这个方法只被计算属性调用
   */
  evaluate () {
    this.value = this.get()
    this.dirty = false // 设置缓存标识，false意味着有缓存不需要重新计算
  }

  /**
   * Depend on all deps collected by this watcher.
   */
  depend () {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }

  /**
   * Remove self from all dependencies' subscriber list.
   * 将当前观察者从vue实例中删除；
   * 调用当前观察者的所有依赖的removeSub方法。
   */
  teardown () {
    if (this.active) { // 如果为假则说明该观察者已经不处于激活状态
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed.
      if (!this.vm._isBeingDestroyed) { // 为真说明该组件实例已经被销毁了，为假说明该组件还没有被销毁
        remove(this.vm._watchers, this) // 将当前观察者实例从组件实例对象的 vm._watchers 数组中移除
      }
      let i = this.deps.length
      while (i--) {
        this.deps[i].removeSub(this) // 将当前观察者实例对象从所有的 Dep 实例对象中移除
      }
      this.active = false // 观察者失效
    }
  }
}
