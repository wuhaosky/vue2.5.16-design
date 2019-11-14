{
    "type": 1,
    "tag": "div",
    "attrsList": [],
    "attrsMap": {
        "class": "app"
    },
    "rawAttrsMap": {},
    "children": [
        {
            "type": 1,
            "tag": "input",
            "attrsList": [
                {
                    "name": "v-model",
                    "value": "modelText2"
                }
            ],
            "attrsMap": {
                "v-model": "modelText2"
            },
            "rawAttrsMap": {},
            "parent": "[循环引用]",
            "children": [],
            "plain": false,
            "hasBindings": true,
            "directives": [
                {
                    "name": "model",
                    "rawName": "v-model",
                    "value": "modelText2",
                    "arg": null,
                    "isDynamicArg": false
                }
            ],
            "static": false,
            "staticRoot": false,
            "props": [
                {
                    "name": "value",
                    "value": "(modelText2)"
                }
            ],
            "events": {
                "input": {
                    "value": "if($event.target.composing)return;modelText2=$event.target.value"
                }
            }
        },
        {
            "type": 3,
            "text": " ",
            "static": true
        },
        {
            "type": 1,
            "tag": "div",
            "attrsList": [],
            "attrsMap": {
                "v-pre": ""
            },
            "rawAttrsMap": {},
            "parent": "[循环引用]",
            "children": [
                {
                    "type": 3,
                    "text": "vpreText",
                    "static": true
                }
            ],
            "pre": true,
            "static": true,
            "staticInFor": false,
            "staticRoot": false
        },
        {
            "type": 3,
            "text": " ",
            "static": true
        },
        {
            "type": 1,
            "tag": "pre",
            "attrsList": [],
            "attrsMap": {},
            "rawAttrsMap": {},
            "parent": "[循环引用]",
            "children": [
                {
                    "type": 3,
                    "text": "preText",
                    "static": true
                }
            ],
            "plain": true,
            "static": true,
            "staticInFor": false,
            "staticRoot": false
        },
        {
            "type": 3,
            "text": " ",
            "static": true
        },
        {
            "type": 1,
            "tag": "div",
            "attrsList": [],
            "attrsMap": {
                "v-for": "(item, index) in list",
                ":key": "index"
            },
            "rawAttrsMap": {},
            "parent": "[循环引用]",
            "children": [
                {
                    "type": 2,
                    "expression": "_s(item)",
                    "tokens": [
                        {
                            "@binding": "item"
                        }
                    ],
                    "text": "{{item}}",
                    "static": false
                }
            ],
            "for": "list",
            "alias": "item",
            "iterator1": "index",
            "key": "index",
            "plain": false,
            "static": false,
            "staticRoot": false,
            "forProcessed": true
        },
        {
            "type": 3,
            "text": " ",
            "static": true
        },
        {
            "type": 1,
            "tag": "div",
            "attrsList": [],
            "attrsMap": {
                "v-for": "(value, key, index) in obj",
                ":key": "key"
            },
            "rawAttrsMap": {},
            "parent": "[循环引用]",
            "children": [
                {
                    "type": 2,
                    "expression": "_s(value)",
                    "tokens": [
                        {
                            "@binding": "value"
                        }
                    ],
                    "text": "{{value}}",
                    "static": false
                }
            ],
            "for": "obj",
            "alias": "value",
            "iterator1": "key",
            "iterator2": "index",
            "key": "key",
            "plain": false,
            "static": false,
            "staticRoot": false,
            "forProcessed": true
        },
        {
            "type": 3,
            "text": " ",
            "static": true
        },
        {
            "type": 1,
            "tag": "div",
            "attrsList": [],
            "attrsMap": {
                "v-if": "showCondition == 1"
            },
            "rawAttrsMap": {},
            "parent": "[循环引用]",
            "children": [
                {
                    "type": 3,
                    "text": "测试v-if指令",
                    "static": true
                }
            ],
            "if": "showCondition == 1",
            "ifConditions": [
                {
                    "exp": "showCondition == 1",
                    "block": "[循环引用]"
                },
                {
                    "exp": "showCondition == 2",
                    "block": {
                        "type": 1,
                        "tag": "div",
                        "attrsList": [],
                        "attrsMap": {
                            "v-else-if": "showCondition == 2"
                        },
                        "rawAttrsMap": {},
                        "parent": "[循环引用]",
                        "children": [
                            {
                                "type": 3,
                                "text": "测试v-else-if指令",
                                "static": true
                            }
                        ],
                        "elseif": "showCondition == 2",
                        "plain": true,
                        "static": false,
                        "staticRoot": false
                    }
                },
                {
                    "block": {
                        "type": 1,
                        "tag": "div",
                        "attrsList": [],
                        "attrsMap": {
                            "v-else": ""
                        },
                        "rawAttrsMap": {},
                        "parent": "[循环引用]",
                        "children": [
                            {
                                "type": 3,
                                "text": "测试v-else指令",
                                "static": true
                            }
                        ],
                        "else": true,
                        "plain": true,
                        "static": false,
                        "staticRoot": false
                    }
                }
            ],
            "plain": true,
            "static": false,
            "staticRoot": false,
            "ifProcessed": true
        },
        {
            "type": 3,
            "text": " ",
            "static": true
        },
        {
            "type": 1,
            "tag": "div",
            "attrsList": [],
            "attrsMap": {
                "v-once": ""
            },
            "rawAttrsMap": {},
            "parent": "[循环引用]",
            "children": [
                {
                    "type": 3,
                    "text": "onceText",
                    "static": true
                }
            ],
            "once": true,
            "plain": true,
            "static": false,
            "staticInFor": false,
            "staticRoot": false,
            "onceProcessed": true,
            "staticProcessed": true
        },
        {
            "type": 3,
            "text": " ",
            "static": true
        },
        {
            "type": 1,
            "tag": "div",
            "attrsList": [],
            "attrsMap": {
                "key": "keyIndex"
            },
            "rawAttrsMap": {},
            "parent": "[循环引用]",
            "children": [
                {
                    "type": 3,
                    "text": "keyText",
                    "static": true
                }
            ],
            "key": "\"keyIndex\"",
            "plain": false,
            "static": false,
            "staticRoot": false
        },
        {
            "type": 3,
            "text": " ",
            "static": true
        },
        {
            "type": 1,
            "tag": "div",
            "attrsList": [],
            "attrsMap": {
                "ref": "mydom",
                "class": "app-ref"
            },
            "rawAttrsMap": {},
            "parent": "[循环引用]",
            "children": [
                {
                    "type": 3,
                    "text": "测试ref",
                    "static": true
                }
            ],
            "plain": false,
            "ref": "\"mydom\"",
            "refInFor": false,
            "staticClass": "\"app-ref\"",
            "static": false,
            "staticRoot": false
        },
        {
            "type": 3,
            "text": " ",
            "static": true
        },
        {
            "type": 1,
            "tag": "slot",
            "attrsList": [],
            "attrsMap": {},
            "rawAttrsMap": {},
            "parent": "[循环引用]",
            "children": [
                {
                    "type": 3,
                    "text": "slotText",
                    "static": true
                }
            ],
            "plain": true,
            "static": false,
            "staticRoot": false
        },
        {
            "type": 3,
            "text": " ",
            "static": true
        },
        {
            "type": 1,
            "tag": "component",
            "attrsList": [
                {
                    "name": "v-bind:text.sync",
                    "value": "modelText"
                }
            ],
            "attrsMap": {
                ":is": "comp",
                "v-bind:text.sync": "modelText"
            },
            "rawAttrsMap": {},
            "parent": "[循环引用]",
            "children": [],
            "plain": false,
            "component": "comp",
            "hasBindings": true,
            "events": {
                "update:text": {
                    "value": "modelText=$event"
                }
            },
            "attrs": [
                {
                    "name": "text",
                    "value": "modelText",
                    "dynamic": false
                }
            ],
            "static": false,
            "staticRoot": false
        },
        {
            "type": 3,
            "text": " ",
            "static": true
        },
        {
            "type": 1,
            "tag": "div",
            "attrsList": [
                {
                    "name": "@click.stop",
                    "value": "onBtnClick"
                }
            ],
            "attrsMap": {
                "class": "app-btn",
                "@click.stop": "onBtnClick"
            },
            "rawAttrsMap": {},
            "parent": "[循环引用]",
            "children": [
                {
                    "type": 3,
                    "text": "button",
                    "static": true
                }
            ],
            "plain": false,
            "staticClass": "\"app-btn\"",
            "hasBindings": true,
            "events": {
                "click": {
                    "value": "onBtnClick",
                    "dynamic": false,
                    "modifiers": {
                        "stop": true
                    }
                }
            },
            "static": false,
            "staticRoot": false
        },
        {
            "type": 3,
            "text": " ",
            "static": true
        },
        {
            "type": 1,
            "tag": "div",
            "attrsList": [],
            "attrsMap": {
                "class": "app-text"
            },
            "rawAttrsMap": {},
            "parent": "[循环引用]",
            "children": [
                {
                    "type": 2,
                    "expression": "\"测试纯文本\"+_s(modelText)",
                    "tokens": [
                        "测试纯文本",
                        {
                            "@binding": "modelText"
                        }
                    ],
                    "text": "测试纯文本{{modelText}}",
                    "static": false
                }
            ],
            "plain": false,
            "staticClass": "\"app-text\"",
            "static": false,
            "staticRoot": false
        },
        {
            "type": 3,
            "text": " ",
            "static": true
        },
        {
            "type": 1,
            "tag": "div",
            "attrsList": [
                {
                    "name": "v-html",
                    "value": "123"
                }
            ],
            "attrsMap": {
                "class": "app-domprops",
                "v-html": "123"
            },
            "rawAttrsMap": {},
            "parent": "[循环引用]",
            "children": [
                {
                    "type": 3,
                    "text": "测试domProps",
                    "static": true
                }
            ],
            "plain": false,
            "staticClass": "\"app-domprops\"",
            "hasBindings": true,
            "directives": [
                {
                    "name": "html",
                    "rawName": "v-html",
                    "value": "123",
                    "arg": null,
                    "isDynamicArg": false
                }
            ],
            "static": false,
            "staticRoot": false,
            "props": [
                {
                    "name": "innerHTML",
                    "value": "_s(123)"
                }
            ]
        },
        {
            "type": 3,
            "text": " ",
            "static": true
        },
        {
            "type": 1,
            "tag": "div",
            "attrsList": [],
            "attrsMap": {
                "class": "app-class",
                ":class": "{active: isActive}"
            },
            "rawAttrsMap": {},
            "parent": "[循环引用]",
            "children": [
                {
                    "type": 3,
                    "text": "绑定HTML class",
                    "static": true
                }
            ],
            "plain": false,
            "staticClass": "\"app-class\"",
            "classBinding": "{active: isActive}",
            "static": false,
            "staticRoot": false
        },
        {
            "type": 3,
            "text": " ",
            "static": true
        },
        {
            "type": 1,
            "tag": "div",
            "attrsList": [
                {
                    "name": "attr1",
                    "value": "val1"
                },
                {
                    "name": "attr2",
                    "value": "val2"
                },
                {
                    "name": ":shop",
                    "value": "shopV"
                }
            ],
            "attrsMap": {
                "class": "app-attr",
                "attr1": "val1",
                "attr2": "val2",
                ":shop": "shopV"
            },
            "rawAttrsMap": {},
            "parent": "[循环引用]",
            "children": [
                {
                    "type": 3,
                    "text": "测试属性",
                    "static": true
                }
            ],
            "plain": false,
            "staticClass": "\"app-attr\"",
            "attrs": [
                {
                    "name": "attr1",
                    "value": "\"val1\""
                },
                {
                    "name": "attr2",
                    "value": "\"val2\""
                },
                {
                    "name": "shop",
                    "value": "shopV",
                    "dynamic": false
                }
            ],
            "hasBindings": true,
            "static": false,
            "staticRoot": false
        },
        {
            "type": 3,
            "text": " ",
            "static": true
        },
        {
            "type": 1,
            "tag": "div",
            "attrsList": [
                {
                    "name": "v-capture.m1.m2",
                    "value": ""
                }
            ],
            "attrsMap": {
                "v-capture.m1.m2": "",
                "class": "app-capture"
            },
            "rawAttrsMap": {},
            "parent": "[循环引用]",
            "children": [
                {
                    "type": 3,
                    "text": "测试自定义指令",
                    "static": true
                }
            ],
            "plain": false,
            "staticClass": "\"app-capture\"",
            "hasBindings": true,
            "directives": [
                {
                    "name": "capture",
                    "rawName": "v-capture.m1.m2",
                    "value": "",
                    "arg": null,
                    "isDynamicArg": false,
                    "modifiers": {
                        "m1": true,
                        "m2": true
                    }
                }
            ],
            "static": false,
            "staticRoot": false
        },
        {
            "type": 3,
            "text": " ",
            "static": true
        },
        {
            "type": 1,
            "tag": "div",
            "attrsList": [],
            "attrsMap": {
                "style": "border: 3px solid #0f0",
                ":style": "styleObject"
            },
            "rawAttrsMap": {},
            "parent": "[循环引用]",
            "children": [
                {
                    "type": 3,
                    "text": "测试style",
                    "static": true
                }
            ],
            "plain": false,
            "staticStyle": "{\"border\":\"3px solid #0f0\"}",
            "styleBinding": "styleObject",
            "static": false,
            "staticRoot": false
        }
    ],
    "plain": false,
    "staticClass": "\"app\"",
    "static": false,
    "staticRoot": false
}
