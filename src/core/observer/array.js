/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from '../util/index'

const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [ // 包含了所有需要拦截的数组变异方法
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 * push/unshift/splice三个方法会新增元素，新增元素需要进行观测
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted) // 对新增的数组元素进行观测
    // notify change
    ob.dep.notify() // 当调用数组变异方法时，必然修改了数组，所以这个时候需要将该数组的所有依赖(观察者)全部拿出来执行，即：ob.dep.notify()
    return result
  })
})
