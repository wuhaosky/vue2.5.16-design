_c(
    'div', { staticClass: "app" },
    [
        _c(
            'input', {
                directives: [{ name: "model", rawName: "v-model", value: (modelText2), expression: "modelText2" }],
                domProps: { "value": (modelText2) },
                on: {
                    "input": function($event) {
                        if ($event.target.composing) return;
                        modelText2 = $event.target.value
                    }
                }
            }
        ),
        _v(" "),
        _c('div', { pre: true }, [_v("vpreText")]),
        _v(" "),
        _c('pre', [_v("preText")]),
        _v(" "),
        _l((list), function(item, index) { return _c('div', { key: index }, [_v(_s(item))]) }),
        _v(" "),
        _l((obj), function(value, key, index) { return _c('div', { key: key }, [_v(_s(value))]) }),
        _v(" "),
        (showCondition == 1) ? _c('div', [_v("测试v-if指令")]) : (showCondition == 2) ? _c('div', [_v("测试v-else-if指令")]) : _c('div', [_v("测试v-else指令")]),
        _v(" "),
        _m(0),
        _v(" "),
        _c('div', { key: "keyIndex" }, [_v("keyText")]),
        _v(" "),
        _c('div', { ref: "mydom", staticClass: "app-ref" }, [_v("测试ref")]),
        _v(" "),
        _t("default", [_v("slotText")]),
        _v(" "),
        _c(comp, { tag: "component", attrs: { "text": modelText }, on: { "update:text": function($event) { modelText = $event } } }),
        _v(" "),
        _c('div', { staticClass: "app-btn", on: { "click": function($event) { $event.stopPropagation(); return onBtnClick($event) } } }, [_v("button")]),
        _v(" "),
        _c('div', { staticClass: "app-text" }, [_v("测试纯文本" + _s(modelText))]),
        _v(" "),
        _c('div', { staticClass: "app-domprops", domProps: { "innerHTML": _s(123) } }, [_v("测试domProps")]),
        _v(" "),
        _c('div', { staticClass: "app-class", class: { active: isActive } }, [_v("绑定HTML class")]),
        _v(" "),
        _c('div', { staticClass: "app-attr", attrs: { "attr1": "val1", "attr2": "val2", "shop": shopV } }, [_v("测试属性")]),
        _v(" "),
        _c('div', { directives: [{ name: "capture", rawName: "v-capture.m1.m2", modifiers: { "m1": true, "m2": true } }], staticClass: "app-capture" }, [_v("测试自定义指令")]),
        _v(" "),
        _c('div', { staticStyle: { "border": "3px solid #0f0" }, style: (styleObject) }, [_v("测试style")])
    ],
    2
)
