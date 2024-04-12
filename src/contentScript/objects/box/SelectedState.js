import { BoxState } from "./BoxObject"

export class SelectedState {
  constructor(svg, boxObj) {
    this.svg = svg
    this.draw = window.draw
    this.controls = {}
    this.boxObj = boxObj

    this.hoveredTarget = null

    this.onPointerdownCallback = this._onPointerdown.bind(this)
    this.onShapePointerover = this._onShapePointerover.bind(this)
    this.onShapePointerout = this._onShapePointerout.bind(this)
    this.onTopLeftPointerover = this._onTopLeftPointerover.bind(this)
    this.onTopLeftPointerout = this._onTopLeftPointerout.bind(this)
    this.onTopRightPointerover = this._onTopRightPointerover.bind(this)
    this.onTopRightPointerout = this._onTopRightPointerout.bind(this)
    this.onBottomLeftPointerover = this._onBottomLeftPointerover.bind(this)
    this.onBottomLeftPointerout = this._onBottomLeftPointerout.bind(this)
    this.onBottomRightPointerover = this._onBottomRightPointerover.bind(this)
    this.onBottomRightPointerout = this._onBottomRightPointerout.bind(this)
    this.onFillPointerover = this._onFillPointerover.bind(this)
    this.onFillPointerout = this._onFillPointerout.bind(this)

  }

  setup() {
    this.svg.stroke({ color: '#e06666' })
    window.draw.css({ cursor: 'grab' })
    this.setupControls()

    document.addEventListener('pointerdown', this.onPointerdownCallback)
  }

  teardown() {
    window.draw.css({ cursor: 'initial' })
    this.removeControls()

    document.removeEventListener('pointerdown', this.onPointerdownCallback)
  }

  setupControls() {
    const x = this.svg.x()
    const y = this.svg.y()
    const width = this.svg.width()
    const height = this.svg.height()

    this.controls['fill'] = this.draw
      .rect(width, height)
      .move(x, y)
      .opacity(0)
    this.controls['fill'].on('pointerover', this.onFillPointerover)
    this.controls['fill'].on('pointerout', this.onFillPointerout)

    this.controls['shape'] = this.draw
      .rect(width, height)
      .move(x, y)
      .stroke({ width: 1.5, color: '#3d85c6' })
      .fill('none')
    this.controls['shape'].on('pointerover', this.onShapePointerover)
    this.controls['shape'].on('pointerout', this.onShapePointerout)

    this.controls['topLeft'] = this.draw
      .rect(8, 8)
      .center(x, y)
      .stroke({ width: 1.5, color: '#3d85c6' })
    this.controls['topLeft'].on('pointerover', this.onTopLeftPointerover)
    this.controls['topLeft'].on('pointerout', this.onTopLeftPointerout)

    this.controls['topRight'] = this.draw
      .rect(8, 8)
      .center(x + width, y)
      .stroke({ width: 1.5, color: '#3d85c6' })
    this.controls['topRight'].on('pointerover', this.onTopRightPointerover)
    this.controls['topRight'].on('pointerout', this.onTopRightPointerout)

    this.controls['bottomLeft'] = this.draw
      .rect(8, 8)
      .center(x, y + height)
      .stroke({ width: 1.5, color: '#3d85c6' })
    this.controls['bottomLeft'].on('pointerover', this.onBottomLeftPointerover)
    this.controls['bottomLeft'].on('pointerout', this.onBottomLeftPointerout)

    this.controls['bottomRight'] = this.draw
      .rect(8, 8)
      .center(x + width, y + height)
      .stroke({ width: 1.5, color: '#3d85c6' })
    this.controls['bottomRight'].on('pointerover', this.onBottomRightPointerover)
    this.controls['bottomRight'].on('pointerout', this.onBottomRightPointerout)
  }

  removeControls() {
    this.controls['shape'].off('pointerover', this.onShapePointerover)
    this.controls['shape'].off('pointerout', this.onShapePointerout)

    for (const [, svg] of Object.entries(this.controls)) {
      svg.remove();
    }
    this.controls = {}
  }

  _onShapePointerover(e) {
    const { clientX, clientY } = e
    if (clientX > this.svg.x() && clientX < this.svg.x() + this.svg.width()) {
      window.draw.css({ cursor: 'ns-resize' })
      if (clientY < this.svg.y() + this.svg.height()) {
        this.hoveredTarget = 'top'
      } else {
        this.hoveredTarget = 'bottom'
      }
    } else if (clientY > this.svg.y() && clientY < this.svg.y() + this.svg.height()) {
      window.draw.css({ cursor: 'ew-resize' })
      if (clientX < this.svg.x() + this.svg.width()) {
        this.hoveredTarget = 'left'
      } else {
        this.hoveredTarget = 'right'
      }
    }
  }

  _onShapePointerout() {
    window.draw.css({ cursor: 'initial' })
    this.hoveredTarget = null
  }

  _onTopLeftPointerover() {
    window.draw.css({ cursor: 'nwse-resize' })
    this.hoveredTarget = 'topLeft'
  }

  _onTopLeftPointerout() {
    window.draw.css({ cursor: 'initial' })
    this.hoveredTarget = null
  }

  _onTopRightPointerover() {
    window.draw.css({ cursor: 'nesw-resize' })
    this.hoveredTarget = 'topRight'
  }

  _onTopRightPointerout() {
    window.draw.css({ cursor: 'initial' })
    this.hoveredTarget = null
  }

  _onBottomLeftPointerover() {
    window.draw.css({ cursor: 'nesw-resize' })
    this.hoveredTarget = 'bottomLeft'
  }

  _onBottomLeftPointerout() {
    window.draw.css({ cursor: 'initial' })
    this.hoveredTarget = null
  }

  _onBottomRightPointerover() {
    window.draw.css({ cursor: 'nwse-resize' })
    this.hoveredTarget = 'bottomRight'
  }

  _onBottomRightPointerout() {
    window.draw.css({ cursor: 'initial' })
    this.hoveredTarget = null
  }

  _onFillPointerover() {
    window.draw.css({ cursor: 'grab' })
    this.hoveredTarget = 'fill'
  }

  _onFillPointerout() {
    window.draw.css({ cursor: 'initial' })
    this.hoveredTarget = null
  }

  _onPointerdown(e) {
    const { clientX, clientY } = e

    switch(this.hoveredTarget) {
      case 'fill':
        this.boxObj.changeState(BoxState.MOVING, { x: clientX, y: clientY })
        break;
      case 'topLeft':
        this.boxObj.changeState(BoxState.RESIZING, { control: 'topLeft', x: clientX, y: clientY })
        break;
      case 'top':
        this.boxObj.changeState(BoxState.RESIZING, { control: 'top', y: clientY })
        break;
      case 'topRight':
        this.boxObj.changeState(BoxState.RESIZING, { control: 'topRight', x: clientX, y: clientY })
        break;
      case 'right':
        this.boxObj.changeState(BoxState.RESIZING, { control: 'right', x: clientX })
        break;
      case 'bottomRight':
        this.boxObj.changeState(BoxState.RESIZING, { control: 'bottomRight', x: clientX, y: clientY })
        break;
      case 'bottom':
        this.boxObj.changeState(BoxState.RESIZING, { control: 'bottom', y: clientY })
        break;
      case 'bottomLeft':
        this.boxObj.changeState(BoxState.RESIZING, { control: 'bottomLeft', x: clientX, y: clientY })
        break;
      case 'left':
        this.boxObj.changeState(BoxState.RESIZING, { control: 'left', x: clientX })
        break;
      default:
        this.boxObj.changeState(BoxState.IDLE)
    }
  }
}
