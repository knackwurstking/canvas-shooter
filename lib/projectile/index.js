export default class Projectile {
  /** @type {HTMLCanvasElement} */
  #canvas
  /** @type {CanvasRenderingContext2D} */
  #ctx

  /** @type {number} */
  #x
  /** @type {number} */
  #y
  /** @type {number} */
  #radius
  /** @type {string} */
  #color
  /** @type {Velocity} */
  #velocity

  /**
   * @param {HTMLCanvasElement} canvas
   * @param {CanvasRenderingContext2D} ctx
   * @param {Velocity} velocity
   */
  constructor(canvas, ctx, velocity) {
    this.#canvas = canvas
    this.#ctx = ctx

    // TODO: Take x/y from the current player position - Need to take player object as param
    this.#x = Math.floor(canvas.width / 2)  // TODO: Resize handling
    this.#y = Math.floor(canvas.height / 2) // TODO: Resize handling

    this.#radius = 5
    this.#color = "white"
    this.#velocity = velocity
  }

  get x() {
    return this.#x
  }

  get y() {
    return this.#y
  }

  get radius() {
    return this.#radius
  }

  get damage() {
    return this.#radius
  }

  update() {
    this.#x += this.#velocity.x
    this.#y += this.#velocity.y

    return this
  }

  draw() {
    this.#ctx.beginPath()
    this.#ctx.arc(
      this.#x, this.#y, this.#radius,
      0, Math.PI * 2,
      false
    )
    this.#ctx.fillStyle = this.#color
    this.#ctx.fill()

    return this
  }
}
