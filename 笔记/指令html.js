<div class="app" v-html="insertHtml"></div>

{
    "type": 1,
    "tag": "div",
    "attrsList": [
        {
            "name": "v-html",
            "value": "insertHtml"
        }
    ],
    "attrsMap": {
        "class": "app",
        "v-html": "insertHtml"
    },
    "children": [],
    "plain": false,
    "staticClass": "\"app\"",
    "hasBindings": true,
    "directives": [
        {
            "name": "html",
            "rawName": "v-html",
            "value": "insertHtml",
            "arg": null
        }
    ],
    "static": false,
    "staticRoot": false,
    "props": [
        {
            "name": "innerHTML",
            "value": "_s(insertHtml)"
        }
    ]
}

with (this) {
  return _c('div', {
    staticClass: 'app',
    domProps: { innerHTML: _s(insertHtml) }
  })
}
