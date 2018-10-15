/* @flow */

import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
import { createCompilerCreator } from './create-compiler'

// 编译器创建者的创建函数
// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  const ast = parse(template.trim(), options)  // parse该函数是一个解析器，它的作用是将模板字符串解析为对应的抽象语法树(AST)
  if (options.optimize !== false) {
    optimize(ast, options)
  }
  const code = generate(ast, options) // codegen根据给定的AST生成最终的目标平台的代码
  return { // 注意这里的渲染函数，都以字符串的形式存在，因为真正变成函数的过程是在 compileToFunctions 中使用 new Function() 来完成的
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
