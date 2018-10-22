<div v-if="a"></div>
<h1 v-else-if="b"></h1>
<p v-else></p>

{
    "type": 1,
    "tag": "div",
    "attrsList": [],
    "attrsMap": {
        "v-if": "a"
    },
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


with (this) {
    return a ? _c("div") : b ? _c("h1") : _c("p");
}
