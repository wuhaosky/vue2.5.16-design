/* @flow */

import { baseOptions } from './options'
import { createCompiler } from 'compiler/index'

// 创建编译器
// compileToFunctions负责将template编译成render函数
const { compile, compileToFunctions } = createCompiler(baseOptions)

export { compile, compileToFunctions }
