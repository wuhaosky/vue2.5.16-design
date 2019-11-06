/* @flow */

import config from 'core/config'

import {
  warn,
  isObject,
  toObject,
  isReservedAttribute
} from 'core/util/index'

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 * 1.保留属性（class，style，key,ref,slot,slot-scope,is），如果已存在于VNode's data中，则忽略；否则混入到 VNode's data对象中
 * 2.使用prop修饰的属性或者mustUseProp的属性，混入到 VNode's data's domProps对象中
 * 3.使用sync修饰的属性，把update:${key}事件混入到 VNode's data's on对象中
 * 4.其它属性，混入到 VNode's data's attrs对象中
 */
export function bindObjectProps (
  data: any,
  tag: string,
  value: any,
  asProp: boolean,
  isSync?: boolean
): VNodeData {
  if (value) {
    if (!isObject(value)) {
      process.env.NODE_ENV !== 'production' && warn(
        'v-bind without argument expects an Object or Array value',
        this
      )
    } else {
      if (Array.isArray(value)) {
        value = toObject(value)
      }
      let hash
      for (const key in value) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data
        } else {
          const type = data.attrs && data.attrs.type
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {})
        }
        if (!(key in hash)) {
          hash[key] = value[key]

          if (isSync) {
            const on = data.on || (data.on = {})
            on[`update:${key}`] = function ($event) {
              value[key] = $event
            }
          }
        }
      }
    }
  }
  return data
}
