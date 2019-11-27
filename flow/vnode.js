declare type VNodeChildren = Array<?VNode | string | VNodeChildren> | string;

declare type VNodeComponentOptions = {
  Ctor: Class<Component>;   // Vue组件构造函数
  propsData: ?Object;       // 有效的props
  listeners: ?Object;       // 非dom事件
  children: ?Array<VNode>;  // 孩子
  tag?: string;             //
};

declare type MountedComponentVNode = {
  context: Component;
  componentOptions: VNodeComponentOptions;
  componentInstance: Component;
  parent: VNode;
  data: VNodeData;
};

// interface for vnodes in update modules
declare type VNodeWithData = {
  tag: string;                                   // 标签名
  data: VNodeData;                               // VNodeData 包含大多数vnode信息
  children: ?Array<VNode>;                       // 子VNode
  text: void;                                    // 文本
  elm: any;                                      // dom元素
  ns: string | void;
  context: Component;                            //
  key: string | number | void;                   // key diff算法使用
  parent?: VNodeWithData;                        // _render函数里，建立Vue组件的VNode之间的单向父子关系，只能子组件VNode找到父组件VNode
  componentOptions?: VNodeComponentOptions;      // vue组件选项
  componentInstance?: Component;                 // vue组件的实例
  isRootInsert: boolean;
};

declare interface VNodeData {
  key?: string | number;
  slot?: string;                                              // 如果组件是其它组件的子组件，需为插槽指定名称
  ref?: string;
  is?: string;
  pre?: boolean;
  tag?: string;
  staticClass?: string;
  class?: any;                                                // 接受一个字符串、对象或字符串和对象组成的数组
  staticStyle?: { [key: string]: any };
  style?: Array<Object> | Object;                             // 接受一个字符串、对象，或对象组成的数组
  normalizedStyle?: Object;
  props?: { [key: string]: any };                             // 组件 prop
  attrs?: { [key: string]: string };                          // 普通的 HTML 特性
  domProps?: { [key: string]: any };                          // DOM 属性
  hook?: { [key: string]: Function };
  on?: ?{ [key: string]: Function | Array<Function> };        // 事件监听器
  nativeOn?: { [key: string]: Function | Array<Function> };   // 仅用于组件，用于监听原生事件，而不是组件内部使用。`vm.$emit` 触发的事件。
  transition?: Object;
  show?: boolean; // marker for v-show
  inlineTemplate?: {
    render: Function;
    staticRenderFns: Array<Function>;
  };
  directives?: Array<VNodeDirective>;                         // 自定义指令
  keepAlive?: boolean;
  scopedSlots?: { [key: string]: Function };                  // 作用域插槽的格式为 { name: props => VNode | Array<VNode> }
  model?: {
    value: any;
    callback: Function;
  };
};

declare type VNodeDirective = {
  name: string;
  rawName: string;
  value?: any;
  oldValue?: any;
  arg?: string;
  modifiers?: ASTModifiers;
  def?: Object;
};

declare type ScopedSlotsData = Array<{ key: string, fn: Function } | ScopedSlotsData>;
