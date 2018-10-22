<div class="app" v-for="(item, index) in dataList"></div>

{
    "type": 1,
    "tag": "div",
    "attrsList": [],
    "attrsMap": {
        "class": "app",
        "v-for": "(item, index) in dataList"
    },
    "children": [],
    "for": "dataList",
    "alias": "item",
    "iterator1": "index",
    "plain": false,
    "staticClass": "\"app\"",
    "static": false,
    "staticRoot": false,
    "forProcessed": true
}

with (this) {
  return _l(dataList, function(item, index) {
    return _c('div', { staticClass: 'app' })
  })
}
