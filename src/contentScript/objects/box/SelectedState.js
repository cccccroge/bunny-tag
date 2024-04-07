import { BoxState } from "./BoxObject"

export class SelectedState {
  constructor(svg, boxObj) {
    this.svg = svg
    this.draw = window.draw
    this.controls = {}
    this.boxObj = boxObj

    this.isMoving = false
    this.startPoint = {
      x: -1,
      y: -1,
    }
    this.currentPoint = {
      x: -1,
      y: -1,
    }
    this.originalPoint = {
      x: svg.x(),
      y: svg.y(),
    }
  }

  setup(params) {
    this.svg.stroke({ color: '#e06666' })
    window.draw.css({ cursor: 'grab' })
    this.setupControls()

    this.onPointerdownCallback = this._onPointerdown.bind(this)
    this.onClickOutsideCallback = this._onClickOutside.bind(this)
    this.onPointeroverCallback = this._onPointerover.bind(this)
    this.onPointeroutCallback = this._onPointerout.bind(this)
    this.svg.on('pointerdown', this.onPointerdownCallback)
    document.addEventListener('pointerdown', this.onClickOutsideCallback)
    this.svg.on('pointerover', this.onPointeroverCallback)
    this.svg.on('pointerout', this.onPointeroutCallback)

    const { x, y } = params.initialPoint
    this.isMoving = true
    this.originalPoint = {
      x: this.svg.x(),
      y: this.svg.y(),
    }
    this.startPoint.x = x
    this.startPoint.y = y
    this.currentPoint.x = x
    this.currentPoint.y = y
  }

  teardown() {
    window.draw.css({ cursor: 'initial' })
    this.removeControls()

    this.svg.off('pointerdown', this.onPointerdownCallback)
    document.a
    document.removeEventListener('pointermove', this.onPointermoveCallback)
    document.removeEventListener('pointerup', this.onPointerupCallback)
    document.removeEventListener('pointerdown', this.onClickOutsideCallback)
    this.svg.off('pointerover', this.onPointeroverCallback)
    this.svg.off('pointerout', this.onPointeroutCallback)
  }

  setupControls() {
    const x = this.svg.x()
    const y = this.svg.y()
    const width = this.svg.width()
    const height = this.svg.height()

    this.controls['shape'] = this.draw
      .rect(width, height)
      .move(x, y)
      .stroke({ width: 1.5, color: '#3d85c6' })
      .fill('none')

    this.controls['topLeft'] = this.draw
      .rect(8, 8)
      .center(x, y)
      .stroke({ width: 1.5, color: '#3d85c6' })

    this.controls['topRight'] = this.draw
      .rect(8, 8)
      .center(x + width, y)
      .stroke({ width: 1.5, color: '#3d85c6' })

    this.controls['bottomLeft'] = this.draw
      .rect(8, 8)
      .center(x, y + height)
      .stroke({ width: 1.5, color: '#3d85c6' })

    this.controls['bottomRight'] = this.draw
      .rect(8, 8)
      .center(x + width, y + height)
      .stroke({ width: 1.5, color: '#3d85c6' })
  }

  removeControls() {
    for (const [, svg] of Object.entries(this.controls)) {
      svg.remove();
    }
    this.controls = {}
  }

  _onPointerdown(e) {
    // check which kind of the control element are we operate on
    // - go to moving
    // - go to resizing

    e.stopPropagation()
    this.isMoving = true

    this.originalPoint = {
      x: this.svg.x(),
      y: this.svg.y(),
    }
    const { clientX, clientY } = e
    this.startPoint.x = clientX
    this.startPoint.y = clientY
    this.currentPoint.x = clientX
    this.currentPoint.y = clientY
  }

  _onClickOutside() {
    this.boxObj.changeState(BoxState.IDLE)
  }

  _onPointerover() {
    // TODO: see which control point we are operating on
    // change to corresponding arrow icon
    window.draw.css({ cursor: 'grab' })
  }

  _onPointerout() {
    window.draw.css({ cursor: 'initial' })
  }
}
