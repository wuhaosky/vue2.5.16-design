<div class="app" v-on:click="onBtnClick"></div>

{
    "type": 1,
    "tag": "div",
    "attrsList": [
        {
            "name": "@click",
            "value": "onBtnClick"
        }
    ],
    "attrsMap": {
        "class": "app",
        "@click": "onBtnClick"
    },
    "children": [],
    "plain": false,
    "staticClass": "\"app\"",
    "hasBindings": true,
    "events": {
        "click": {
            "value": "onBtnClick"
        }
    },
    "static": false,
    "staticRoot": false
}

with (this) {
  return _c('div', { staticClass: 'app', on: { click: onBtnClick } })
}
