declare type CompilerOptions = {
  warn?: Function; // allow customizing warning in different environments; e.g. node  收集编译过程中的错误和提示信息
  modules?: Array<ModuleOptions>; // platform specific modules; e.g. style; class  平台相关，style、class、model
  directives?: { [key: string]: Function }; // platform specific directives 平台相关指令，html、model、text
  staticKeys?: string; // a list of AST properties to be considered static; for optimization  "staticClass,staticStyle"
  isUnaryTag?: (tag: string) => ?boolean; // check if a tag is unary for the platform    检查标签是不是一元标签，例如img
  canBeLeftOpenTag?: (tag: string) => ?boolean; // check if a tag can be left opened    检查标签是不是左开标签，左开标签由浏览器自己闭合，例如p标签，可以<p>content</p>，也可以<p>content
  isReservedTag?: (tag: string) => ?boolean; // check if a tag is a native for the platform    检查标签是否是平台的原生标签
  preserveWhitespace?: boolean; // preserve whitespace between elements?     是否保留空白符
  optimize?: boolean; // optimize static content?     是否优化静态内容

  // web specific  web环境相关的配置项
  mustUseProp?: (tag: string, type: ?string, name: string) => boolean; // check if an attribute should be bound as a property    检测一个属性在标签中是否要使用 prop 进行绑定
  isPreTag?: (attr: string) => ?boolean; // check if a tag needs to preserve whitespace     检查标签是否是 'pre' 标签
  getTagNamespace?: (tag: string) => ?string; // check the namespace for a tag   获取元素(标签)的命名空间
  expectHTML?: boolean; // only false for non-web builds  web编译器是true
  isFromDOM?: boolean;    // unused
  shouldDecodeTags?: boolean;
  shouldDecodeNewlines?:  boolean;         // 对浏览器的怪癖做兼容
  shouldDecodeNewlinesForHref?: boolean;  // 对浏览器的怪癖做兼容

  // runtime user-configurable
  delimiters?: [string, string]; // template delimiters    模板插值分隔符
  comments?: boolean; // preserve comments in template   是否保留注释内容

  // for ssr optimization compiler
  scopeId?: string;
};

declare type CompiledResult = {
  ast: ?ASTElement;
  render: string;
  staticRenderFns: Array<string>;
  stringRenderFns?: Array<string>; // unused
  errors?: Array<string>;
  tips?: Array<string>;
};

declare type ModuleOptions = {
  // transform an AST node before any attributes are processed
  // returning an ASTElement from pre/transforms replaces the element
  preTransformNode: (el: ASTElement) => ?ASTElement; // 在所有属性被处理之前执行
  // transform an AST node after built-ins like v-if, v-for are processed
  transformNode: (el: ASTElement) => ?ASTElement;    // 内置属性和指令执行完后执行
  // transform an AST node after its children have been processed
  // cannot return replacement in postTransform because tree is already finalized
  postTransformNode: (el: ASTElement) => void;       // 在孩子节点被处理完后执行
  genData: (el: ASTElement) => string; // generate extra data string for an element  生成data信息，例如staticClass、class、staticStyle、style相关的信息
  transformCode?: (el: ASTElement, code: string) => string; // further transform generated code for an element  目前是unused
  staticKeys?: Array<string>; // AST properties to be considered static  可以静态化的属性
};

declare type ASTModifiers = { [key: string]: boolean };              // 事件修饰符 key是修饰符，含有修饰符则为true，反之为false
declare type ASTIfCondition = { exp: ?string; block: ASTElement };   // if条件对象  exp是条件表达式，block是含有条件表达式的元素描述对象
declare type ASTIfConditions = Array<ASTIfCondition>;                // if条件块

// 单个事件的描述
declare type ASTElementHandler = {
  value: string;              // 事件值，可以是函数，也可以是方法的路径
  params?: Array<any>;        // 事件参数，例如：click
  modifiers: ?ASTModifiers;   // 事件修饰符，例如：stop
};

// events属性的描述
declare type ASTElementHandlers = { // key是事件名称，例如：on
  [key: string]: ASTElementHandler | Array<ASTElementHandler>;
};


// 指令的描述
declare type ASTDirective = {
  name: string;
  rawName: string;
  value: string;
  arg: ?string;
  modifiers: ?ASTModifiers;
};
// <input v-model="message" placeholder="edit me">
// "directives": [
//   {
//     "name": "model",
//     "rawName": "v-model",
//     "value": "message",
//     "arg": null,
//     "modifiers": null
//   }
// ]

// 元素描述节点，可以是标签描述对象、文本描述对象、模板插值描述对象
declare type ASTNode = ASTElement | ASTText | ASTExpression;

// 标签描述对象
declare type ASTElement = {
  type: 1;                                            //  type是1意味着是标签
  tag: string;                                        //  标签名称
  attrsList: Array<{ name: string; value: any }>;     //  词法分析生成的属性的数组形式，处理后的属性会从数组中删除
  attrsMap: { [key: string]: any };                   //  词法分析生成的属性的对象形式，包含标签所有的属性
  parent: ASTElement | void;                          //  父元素
  children: Array<ASTNode>;                           //  孩子节点

  processed?: true;                                   //  是否已处理过

  static?: boolean;                                   //  静态节点
  staticRoot?: boolean;                               //  静态根
  staticInFor?: boolean;                              //  静态节点处于v-for指令中
  staticProcessed?: boolean;                          //  是否已经执行过genStatic函数
  hasBindings?: boolean;                              //  是否含有绑定属性

  text?: string;                                      //
  attrs?: Array<{ name: string; value: any }>;        //  最终使用el.setAttribute添加的属性
  props?: Array<{ name: string; value: string }>;     //  最终使用el.属性 直接赋值的属性
  plain?: boolean;                                    //  是否是纯节点
  pre?: true;                                         //  是否是pre标签
  ns?: string;                                        //

  component?: string;                                 //  组件名称
  inlineTemplate?: true;                              //
  transitionMode?: string | null;                     //
  slotName?: ?string;                                 //
  slotTarget?: ?string;                               //
  slotScope?: ?string;                                //
  scopedSlots?: { [name: string]: ASTElement };       //

  ref?: string;                                       //  ref属性
  refInFor?: boolean;                                 //  含有ref属性的元素是否位于v-for内

  if?: string;                                        //  if表达式
  ifProcessed?: boolean;                              //  是否执行过genIf
  elseif?: string;                                    //  elseif表达式
  else?: true;                                        //  是否含有else
  ifConditions?: ASTIfConditions;                     //  if条件块数组

  for?: string;                                       //  list
  forProcessed?: boolean;                             //  是否执行过genFor
  key?: string;                                       //  index
  alias?: string;                                     //  item
  iterator1?: string;                                 //  key
  iterator2?: string;                                 //  index

  staticClass?: string;                               //  静态类选择器
  classBinding?: string;                              //  绑定类选择器
  staticStyle?: string;                               //  静态样式
  styleBinding?: string;                              //  绑定样式
  events?: ASTElementHandlers;                        //  事件对象
  nativeEvents?: ASTElementHandlers;                  //  原生事件对象

  transition?: string | true;                         //
  transitionOnAppear?: boolean;                       //

  model?: {                                           //  component v-model
    value: string;                                    //
    callback: string;                                 //
    expression: string;                               //
  };

  directives?: Array<ASTDirective>;                   //  指令对象

  forbidden?: true;                                   //  模板内禁止使用style和script标签
  once?: true;                                        //  是否含有v-once
  onceProcessed?: boolean;                            //  是否执行过genOnce
  wrapData?: (code: string) => string;                //  v-bind对象
  wrapListeners?: (code: string) => string;           //  v-on对象

  // 2.4 ssr optimization
  ssrOptimizability?: number;

  // weex specific
  appendAsTree?: boolean;
};

// 模板插值描述对象
declare type ASTExpression = {
  type: 2;                              // type为2表明当前节点是模板插值节点
  expression: string;                   // 处理后的模板插值表达式
  text: string;                         // 未处理的模板插值表达式
  tokens: Array<string | Object>;       // 记号数组
  static?: boolean;                     // 是否静态节点
  // 2.4 ssr optimization
  ssrOptimizability?: number;
};
// 这是插值{{ msg }}示例
// {
//     "type": 2,
//     "expression": "\"这是插值\"+_s(msg)+\"示例\"",
//     "tokens": [
//         "这是插值",
//         {
//             "@binding": "msg"
//         },
//         "示例"
//     ],
//     "text": "这是插值{{ msg }}示例"
// }

// 文本描述对象
declare type ASTText = {
  type: 3;                              // type为3表明当前节点是文本节点或注释节点
  text: string;                         // 文本
  static?: boolean;                     // 是否静态节点
  isComment?: boolean;                  // 是否为注释
  // 2.4 ssr optimization
  ssrOptimizability?: number;
};

// SFC-parser related declarations

// an object format describing a single-file component.
declare type SFCDescriptor = {
  template: ?SFCBlock;
  script: ?SFCBlock;
  styles: Array<SFCBlock>;
  customBlocks: Array<SFCBlock>;
};

declare type SFCBlock = {
  type: string;
  content: string;
  attrs: {[attribute:string]: string};
  start?: number;
  end?: number;
  lang?: string;
  src?: string;
  scoped?: boolean;
  module?: string | boolean;
};
