

  parseHTML(template, {
      start (tag, attrs, unary) {
          // 每当解析到标签的开始位置时，触发该函数
      },
      end () {
          // 每当解析到标签的结束位置时，触发该函数
      },
      chars (text) {
          // 每当解析到文本时，触发该函数
      },
      comment (text) {
          // 每当解析到注释时，触发该函数
      }
  })
