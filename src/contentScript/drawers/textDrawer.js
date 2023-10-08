class TextDrawer {
  constructor(draw, options) {
    this.draw = draw
    this.options = options
    this._initGoogleFonts()
  }

  drawMark(position) {
    this._createText(position)
  }

  _initGoogleFonts() {
    const api = document.createElement('link')
    api.rel = 'preconnect'
    api.href = 'https://fonts.googleapis.com'
    document.head.appendChild(api)

    const gstatic = document.createElement('link')
    gstatic.rel = 'preconnect'
    gstatic.href = 'https://fonts.gstatic.com'
    gstatic.crossorigin = true
    document.head.appendChild(gstatic)

    const font = document.createElement('link')
    font.rel = 'stylesheet'
    font.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;700&display=swap'
    document.head.appendChild(font)
  }

  _createText(position) {
    const { 
      defaultText,
      fontSize,
      fontFamily,
     } = this.options
  
    this.draw
      .text(defaultText)
      .font({
        size: fontSize,
        family: fontFamily,
      })
      .move(position.x, position.y)
      .fill({ color: '#f06' })
  }
}

export default TextDrawer
