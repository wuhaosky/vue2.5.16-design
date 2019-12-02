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
                    "value": "modelText"
                }
            ],
            "attrsMap": {
                "v-model": "modelText"
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
                    "value": "modelText",
                    "arg": null,
                    "isDynamicArg": false
                }
            ],
            "static": false,
            "staticRoot": false,
            "props": [
                {
                    "name": "value",
                    "value": "(modelText)"
                }
            ],
            "events": {
                "input": {
                    "value": "if($event.target.composing)return;modelText=$event.target.value"
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
                    "text": "测试点击事件",
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
                    "expression": "\"测试纯文本\"+_s(interpolation)",
                    "tokens": [
                        "测试纯文本",
                        {
                            "@binding": "interpolation"
                        }
                    ],
                    "text": "测试纯文本{{interpolation}}",
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
            "attrsList": [],
            "attrsMap": {
                "class": "app-class",
                ":class": "{'active': isActive}"
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
            "classBinding": "{'active': isActive}",
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
                    "value": "shopId"
                }
            ],
            "attrsMap": {
                "class": "app-attr",
                "attr1": "val1",
                "attr2": "val2",
                ":shop": "shopId"
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
                    "value": "shopId",
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
        },
        {
            "type": 3,
            "text": " ",
            "static": true
        },
        {
            "type": 1,
            "tag": "hello",
            "attrsList": [
                {
                    "name": ":msg",
                    "value": "helloMsg"
                }
            ],
            "attrsMap": {
                ":msg": "helloMsg"
            },
            "rawAttrsMap": {},
            "parent": "[循环引用]",
            "children": [],
            "plain": false,
            "hasBindings": true,
            "attrs": [
                {
                    "name": "msg",
                    "value": "helloMsg",
                    "dynamic": false
                }
            ],
            "static": false,
            "staticRoot": false
        }
    ],
    "plain": false,
    "staticClass": "\"app\"",
    "static": false,
    "staticRoot": false
}
