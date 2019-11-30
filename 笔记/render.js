var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "app" }, [
    _c("div", { staticClass: "app-text" }, [
      _vm._v("vue: " + _vm._s(_vm.amount))
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "app-btn", on: { click: _vm.onBtnClick } }, [
      _vm._v("点击我")
    ])
  ])
}
