with(this) {
  return _c('div', {staticClass: "app"},
    [
      _c('input', {
        directives: [{
          name: "model",
          rawName: "v-model",
          value: (modelText),
          expression: "modelText"
        }],
        domProps: {
          "value": (modelText)
        },
        on: {
          "input": function ($event) {
            if ($event.target.composing) return;
            modelText = $event.target.value
          }
        }
      }),
      _v(" "),
      _l((list), function (item, index) {
        return _c('div', {key: index}, [_v(_s(item))])
      }),
      _v(" "),
      (showCondition == 1) ? _c('div', [_v("测试v-if指令")]) : (showCondition == 2) ? _c('div', [_v("测试v-else-if指令")]) : _c('div', [_v("测试v-else指令")]),
      _v(" "),
      _c('div', {
        staticClass: "app-btn",
        on: {
          "click": function ($event) {
            $event.stopPropagation();
            return onBtnClick($event)
          }
        }
      }, [_v("测试点击事件")]),
      _v(" "),
      _c('div', {
        staticClass: "app-text"
      }, [_v("测试纯文本" + _s(interpolation))]),
      _v(" "),
      _c('div', {
        staticClass: "app-class",
        class: {
          'active': isActive
        }
      }, [_v("绑定HTML class")]),
      _v(" "),
      _c('div', {
        staticClass: "app-attr",
        attrs: {
          "attr1": "val1",
          "attr2": "val2",
          "shop": shopId
        }
      }, [_v("测试属性")]),
      _v(" "),
      _c('div', {
        staticStyle: {
          "border": "3px solid #0f0"
        },
        style: (styleObject)
      }, [_v("测试style")]),
      _v(" "),
      _c('hello', {
        attrs: {
          "msg": helloMsg
        }
      })
    ],
    2
  )
}
