/* @flow */

import Dep from './dep'
import VNode from '../vdom/vnode'
import { arrayMethods } from './array'
import {
  def,
  warn,
  hasOwn,
  hasProto,
  isObject,
  isPlainObject,
  isPrimitive,
  isUndef,
  isValidArrayIndex,
  isServerRendering
} from '../util/index'

const arrayKeys = Object.getOwnPropertyNames(arrayMethods)  // Object.getOwnPropertyNames()方法返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性但不包括Symbol值作为名称的属性）组成的数组。

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
export let shouldObserve: boolean = true

/**
 * 是否开启观测
 */
export function toggleObserving (value: boolean) {
  shouldObserve = value
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 * Observer对象附属于被观测的对象，观测函数将被观测对象的属性转换成访问器属性，这样就可以收集依赖和触发更新。
 */
export class Observer {
  value: any; // 被观测对象的引用
  dep: Dep;   // 依赖收集器
  vmCount: number; // number of vms that has this object as root $data  使用当前ob实例作为vue组件$data属性的观测对象的个数

  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)  // 定义__ob__为被观测对象的属性，__ob__的Value是Observer对象，__ob__是不可枚举的
    if (Array.isArray(value)) { // 如果被观测对象是数组，则覆写数组的变异方法，目的是拦截数组的数据变化
      const augment = hasProto
        ? protoAugment          // 如果支持__proto__，则覆写数组的原型为我们的数组变异方法
        : copyAugment           // 如果不支持__proto__，则把我们的数组变异方法当做数据属性添加到数组上，并且是不可枚举的
      augment(value, arrayMethods, arrayKeys)
      this.observeArray(value)
    } else {                    // 如果被观测对象是对象
      this.walk(value)
    }
  }

  /**
   * Walk through each property and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   * 遍历所有属性，将它们转换成访问器属性。这个方法的入参obj只能是对象。
   */
  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }

  /**
   * Observe a list of Array items.
   * 遍历数组，观测每一项item
   */
  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 * 变更目标对象或数组的原型
 */
function protoAugment (target, src: Object, keys: any) {
  /* eslint-disable no-proto */
  target.__proto__ = src
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 * 如果不支持__proto__，则把我们的数组变异方法当做数据属性添加到数组上，并且是不可枚举的
 */
/* istanbul ignore next */
function copyAugment (target: Object, src: Object, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 * 为value创建Observer，并返回
 */
export function observe (value: any, asRootData: ?boolean): Observer | void {
  if (!isObject(value) || value instanceof VNode) { // value不是对象或者数组，或者是VNode，则直接返回
    return
  }
  let ob: Observer | void
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 * 在一个对象上定义响应式属性
 */
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean   // 是否为浅层观测，默认为深层观测
) {
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {  // 属性是不可配置的，则直接return
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  if (!getter && arguments.length === 2) {
    val = obj[key]
  }
  const setter = property && property.set

  let childOb = !shallow && observe(val) // 默认为深度观测
  // 定义访问器属性
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) { // 收集依赖
        dep.depend() // 触发时机是val被修改时触发，即在 set 访问器方法中触发
        if (childOb) {
          childOb.dep.depend()  // 触发时机是val添加、删除属性时触发，即在 Vue.set 或 Vue.delete 方法中触发
          if (Array.isArray(value)) { // obj对象中的key对应的val是数组的情况 收集数组所有元素的依赖
            dependArray(value) // 依赖了数组 arr 就等价于依赖了数组内的所有元素，数组内所有元素的改变都可以看做是数组的改变
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)  // 对新设置的值进行观测
      dep.notify()
    }
  })
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 * 设置属性。当属性不存在时，给对象增加属性，并通知对象观察者。
 */
export function set (target: Array<any> | Object, key: any, val: any): any {
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target)) // 如果 set 函数的第一个参数是 undefined 或 null 或者是原始类型值，那么在非生产环境下会打印警告信息
  ) {
    warn(`Cannot set reactive property on undefined, null, or primitive value: ${(target: any)}`)
  }
  // 数组
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }
  // 对象已存在的属性
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  // 给对象添加一个全新的属性
  const ob = (target: any).__ob__
  if (target._isVue || (ob && ob.vmCount)) { // 当使用 Vue.set/$set 函数为根数据对象添加属性时，是不被允许的。
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return val
  }
  if (!ob) { // target不是响应式对象
    target[key] = val
    return val
  }
  defineReactive(ob.value, key, val) // 保证新添加的属性是响应式的
  ob.dep.notify() // 通知target对象的观察者
  return val
}

/**
 * Delete a property and trigger change if necessary.
 * 删除属性，并通知观察者
 */
export function del (target: Array<any> | Object, key: any) {
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(`Cannot delete reactive property on undefined, null, or primitive value: ${(target: any)}`)
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1)
    return
  }
  const ob = (target: any).__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    )
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key]
  if (!ob) {
    return
  }
  ob.dep.notify()
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 * 数组的索引是非响应式的
 * 依赖了数组就等价于依赖了数组内的所有元素，数组内所有元素的改变都可以看做是数组的改变
 */
function dependArray (value: Array<any>) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i]
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}
