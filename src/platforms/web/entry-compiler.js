/* @flow */
// vue-template-compiler 入口文件
export { parseComponent } from 'sfc/parser'  // 解析单文件组件（Single-File Components）
export { compile, compileToFunctions } from './compiler/index'  // 编译template为render函数
export { ssrCompile, ssrCompileToFunctions } from './server/compiler'
