<template slot="header">
    <div v-if="a"></div>
    <h1 v-else-if="b"></h1>
    <p v-else></p>
</template>

{
    "type": 1,
    "tag": "template",
    "attrsList": [],
    "attrsMap": {
        "slot": "header"
    },
    "children": [
        {
            "type": 1,
            "tag": "div",
            "attrsList": [],
            "attrsMap": {
                "v-if": "a"
            },
            "parent": "[循环引用]",
            "children": [],
            "if": "a",
            "ifConditions": [
                {
                    "exp": "a",
                    "block": "[循环引用]"
                },
                {
                    "exp": "b",
                    "block": {
                        "type": 1,
                        "tag": "h1",
                        "attrsList": [],
                        "attrsMap": {
                            "v-else-if": "b"
                        },
                        "parent": "[循环引用]",
                        "children": [],
                        "elseif": "b",
                        "plain": true,
                        "static": false,
                        "staticRoot": false
                    }
                },
                {
                    "block": {
                        "type": 1,
                        "tag": "p",
                        "attrsList": [],
                        "attrsMap": {
                            "v-else": ""
                        },
                        "parent": "[循环引用]",
                        "children": [],
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
        }
    ],
    "plain": false,
    "slotTarget": "\"header\"",
    "static": false,
    "staticRoot": false
}

with (this) {
  return _c("template", { slot: "header" }, [
    a ? _c("div") : b ? _c("h1") : _c("p")
  ]);
}