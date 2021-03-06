/* @flow */

import {
  isPreTag,
  mustUseProp,
  isReservedTag,
  getTagNamespace
} from '../util/index'

import modules from './modules/index'
import directives from './directives/index'
import { genStaticKeys } from 'shared/util'
import { isUnaryTag, canBeLeftOpenTag } from './util'

export const baseOptions: CompilerOptions = { // 编译器选项
  expectHTML: true,
  modules,
  directives,
  isPreTag,
  isUnaryTag,
  mustUseProp,
  canBeLeftOpenTag,
  isReservedTag, // 校验是否是保留标签
  getTagNamespace,
  staticKeys: genStaticKeys(modules) // 'staticClass,staticStyle'
}


// {
//     // 生成编译器时传入的参数
//     shouldDecodeNewlines,
//     shouldDecodeNewlinesForHref,
//     delimiters,
//     comments,
//     warn,  // 被 delete

//     // baseOptions
//     expectHTML: true,
//     modules: [
//         {
//             staticKeys: ['staticClass'],
//             transformNode,
//             genData
//         },
//         {
//             staticKeys: ['staticStyle'],
//             transformNode,
//             genData
//         },
//         {
//             preTransformNode
//         }
//     ],
//     directives: {
//         model: function(){},
//         html: function(){},
//         text: function(){}
//     },
//     isPreTag,
//     isUnaryTag,
//     mustUseProp,
//     canBeLeftOpenTag,
//     isReservedTag,
//     getTagNamespace,
//     staticKeys: genStaticKeys(modules),
//     warn = (msg, tip) => {
//         (tip ? tips : errors).push(msg)
//     }
// }
