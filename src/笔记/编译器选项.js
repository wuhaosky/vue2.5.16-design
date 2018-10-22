{
    // 生成编译器时传入的参数
    shouldDecodeNewlines,
    shouldDecodeNewlinesForHref,
    delimiters,
    comments,
    warn,  // 被 delete

    // baseOptions
    expectHTML: true,
    modules: [
        {
            staticKeys: ['staticClass'],
            transformNode,
            genData
        },
        {
            staticKeys: ['staticStyle'],
            transformNode,
            genData
        },
        {
            preTransformNode
        }
    ],
    directives: {
        model: function(){},
        html: function(){},
        text: function(){}
    },
    isPreTag,
    isUnaryTag,
    mustUseProp,
    canBeLeftOpenTag,
    isReservedTag,
    getTagNamespace,
    staticKeys: genStaticKeys(modules),
    warn = (msg, tip) => {
        (tip ? tips : errors).push(msg)
    }
}