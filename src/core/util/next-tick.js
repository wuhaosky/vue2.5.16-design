/* @flow */
/* globals MessageChannel */

import { noop } from 'shared/util'
import { handleError } from './error'
import { isIOS, isNative } from './env'

const callbacks = []
let pending = false // pending 的值设置为 false，代表着此时回调队列为空，不需要等待刷新

function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}

// Here we have async deferring wrappers using both microtasks and (macro) tasks.
// In < 2.4 we used microtasks everywhere, but there are some scenarios where
// microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690) or even between bubbling of the same
// event (#6566). However, using (macro) tasks everywhere also has subtle problems
// when state is changed right before repaint (e.g. #6813, out-in transitions).
// Here we use microtask by default, but expose a way to force (macro) task when
// needed (e.g. in event handlers attached by v-on).
let microTimerFunc
let macroTimerFunc
let useMacroTask = false

// Determine (macro) task defer implementation.
// Technically setImmediate should be the ideal choice, but it's only available
// in IE. The only polyfill that consistently queues the callback after all DOM
// events triggered in the same loop is by using MessageChannel.
/* istanbul ignore if */
// Vue中对于 macro task 的实现，优先检测是否支持原生 setImmediate，
// 这是一个高版本 IE 和 Edge 才支持的特性，不支持的话再去检测是否支持原生的MessageChannel，
// 如果也不支持的话就会降级为 setTimeout 0
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else if (typeof MessageChannel !== 'undefined' && (
  isNative(MessageChannel) ||
  // PhantomJS
  MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
  const channel = new MessageChannel()
  const port = channel.port2
  channel.port1.onmessage = flushCallbacks
  macroTimerFunc = () => {
    port.postMessage(1)
  }
} else {
  /* istanbul ignore next */
  macroTimerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

// Determine microtask defer implementation.
/* istanbul ignore next, $flow-disable-line */
// Vue中对于 microtask 的实现，优先检测是否原生支持Promise，如果支持，则完美。
// 如果不支持，可使用macroTimerFunc替换microTimerFunc。
if (typeof Promise !== 'undefined' && isNative(Promise)) { // 检测当前宿主环境是否支持原生的 Promise，如果支持则优先使用 Promise 注册 microtask
  const p = Promise.resolve()
  microTimerFunc = () => { // microTimerFunc 定义为一个函数，这个函数的执行将会把 flushCallbacks 函数注册为 microtask
    p.then(flushCallbacks)
    // in problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) setTimeout(noop) // 解决怪异问题的变通方法
  }
} else { // 降级处理，即注册 (macro)task
  // fallback to macro
  microTimerFunc = macroTimerFunc
}

/**
 * Wrap a function so that if any code inside triggers state change,
 * the changes are queued using a (macro) task instead of a microtask.
 */
export function withMacroTask (fn: Function): Function {
  return fn._withTask || (fn._withTask = function () {
    useMacroTask = true
    const res = fn.apply(null, arguments)
    useMacroTask = false
    return res
  })
}
// macrotask -> microtask -> 渲染 -> macrotask ...
export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true  // pending 的值设置为 true，代表着此时回调队列不为空，正在等待刷新
    if (useMacroTask) {
      macroTimerFunc()
    } else {
      microTimerFunc() // 在 microtask 中把所有在UI重渲染之前需要更新的数据全部更新，这样只需要一次重渲染就能得到最新的DOM了。
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') { // 如果入参没有cb，nextTick会返回一个promise，这个promise会在渲染后，resolve(ctx)
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
